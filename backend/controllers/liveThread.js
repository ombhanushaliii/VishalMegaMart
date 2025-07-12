const { validationResult } = require('express-validator');
const LiveThread = require('../models/liveThread');
const ThreadMessage = require('../models/threadMessage');
const Question = require('../models/question');
const User = require('../models/user');

// Create a new live thread
const createLiveThread = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { title, description, tags } = req.body;
        const userId = req.user.id;

        const liveThread = new LiveThread({
            title,
            description,
            creatorId: userId,
            tags: tags || [],
            participants: [{
                userId: userId,
                joinedAt: new Date()
            }]
        });

        await liveThread.save();
        await liveThread.populate('creatorId', 'username email');

        res.status(201).json({
            success: true,
            message: 'Live thread created successfully',
            thread: liveThread
        });
    } catch (error) {
        console.error('Error creating live thread:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get all active live threads
const getActiveLiveThreads = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const threads = await LiveThread.find({
            isActive: true,
            isClosed: false
        })
        .populate('creatorId', 'username')
        .sort({ lastActivity: -1 })
        .skip(skip)
        .limit(limit);

        const total = await LiveThread.countDocuments({
            isActive: true,
            isClosed: false
        });

        // Add participant count
        const threadsWithCounts = threads.map(thread => ({
            ...thread.toObject(),
            participantCount: thread.participants.length
        }));

        res.json({
            success: true,
            threads: threadsWithCounts,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching live threads:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get a specific live thread with messages
const getLiveThreadById = async (req, res) => {
    try {
        const { threadId } = req.params;

        const thread = await LiveThread.findById(threadId)
            .populate('creatorId', 'username')
            .populate('participants.userId', 'username');

        if (!thread) {
            return res.status(404).json({
                success: false,
                message: 'Live thread not found'
            });
        }

        // Get messages for this thread
        const messages = await ThreadMessage.find({ threadId })
            .populate('userId', 'username')
            .sort({ createdAt: 1 });

        res.json({
            success: true,
            thread: {
                ...thread.toObject(),
                participantCount: thread.participants.length
            },
            messages
        });
    } catch (error) {
        console.error('Error fetching live thread:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Join a live thread
const joinLiveThread = async (req, res) => {
    try {
        const { threadId } = req.params;
        const userId = req.user.id;

        const thread = await LiveThread.findById(threadId);
        if (!thread) {
            return res.status(404).json({
                success: false,
                message: 'Live thread not found'
            });
        }

        if (thread.isClosed) {
            return res.status(400).json({
                success: false,
                message: 'Cannot join a closed thread'
            });
        }

        // Check if user is already a participant
        const isParticipant = thread.participants.some(p => p.userId.toString() === userId);
        
        if (!isParticipant) {
            thread.participants.push({
                userId: userId,
                joinedAt: new Date()
            });
            await thread.updateActivity();
        }

        await thread.populate('participants.userId', 'username');

        res.json({
            success: true,
            message: 'Joined thread successfully',
            thread: {
                ...thread.toObject(),
                participantCount: thread.participants.length
            }
        });
    } catch (error) {
        console.error('Error joining live thread:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Send a message in live thread
const sendMessage = async (req, res) => {
    try {
        const { threadId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        const thread = await LiveThread.findById(threadId);
        if (!thread) {
            return res.status(404).json({
                success: false,
                message: 'Live thread not found'
            });
        }

        if (thread.isClosed) {
            return res.status(400).json({
                success: false,
                message: 'Cannot send message to a closed thread'
            });
        }

        // Extract mentions from content
        const mentionRegex = /@(\w+)/g;
        const mentions = [];
        let match;
        while ((match = mentionRegex.exec(content)) !== null) {
            const username = match[1];
            const mentionedUser = await User.findOne({ username });
            if (mentionedUser) {
                mentions.push(mentionedUser._id);
            }
        }

        const message = new ThreadMessage({
            threadId,
            userId,
            content,
            mentions
        });

        await message.save();
        await thread.updateActivity();
        await message.populate('userId', 'username');

        // Emit to WebSocket
        const io = req.app.get('socketio');
        io.to(threadId).emit('new-message', {
            id: message._id,
            userId: message.userId._id,
            username: message.userId.username,
            content: message.content,
            timestamp: message.createdAt,
            threadId,
            mentions: message.mentions
        });

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: message
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Mark a message as correct answer and close thread
const markCorrectAnswer = async (req, res) => {
    try {
        const { threadId, messageId } = req.params;
        const userId = req.user.id;

        const thread = await LiveThread.findById(threadId);
        if (!thread) {
            return res.status(404).json({
                success: false,
                message: 'Live thread not found'
            });
        }

        // Only thread creator can mark correct answer
        if (thread.creatorId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Only thread creator can mark correct answer'
            });
        }

        const message = await ThreadMessage.findById(messageId);
        if (!message || message.threadId.toString() !== threadId) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        // Mark message as correct answer
        message.isMarkedAsAnswer = true;
        await message.save();

        // Update thread
        thread.correctAnswerId = messageId;
        thread.isClosed = true;
        thread.isActive = false;
        await thread.save();

        // Convert to question
        const question = new Question({
            title: thread.title,
            description: thread.description,
            userId: thread.creatorId,
            tags: [...thread.tags, 'live-thread'],
            topAnswerId: null, // We'll create an answer from the marked message
            isFromLiveThread: true,
            originalThreadId: thread._id
        });

        await question.save();

        // Create answer from the marked message
        const Answer = require('../models/answer');
        const answer = new Answer({
            questionId: question._id,
            userId: message.userId,
            content: message.content,
            isAccepted: true
        });

        await answer.save();

        // Update question with top answer
        question.topAnswerId = answer._id;
        await question.save();

        // Update thread with converted question ID
        thread.convertedQuestionId = question._id;
        await thread.save();

        // Emit thread closure to WebSocket
        const io = req.app.get('socketio');
        io.to(threadId).emit('thread-closed', {
            threadId,
            correctAnswerId: messageId,
            convertedQuestionId: question._id
        });

        res.json({
            success: true,
            message: 'Thread closed and converted to question successfully',
            questionId: question._id
        });
    } catch (error) {
        console.error('Error marking correct answer:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Auto-close inactive threads (to be called by a cron job)
const autoCloseInactiveThreads = async () => {
    try {
        const oneHourAgo = new Date(Date.now() - 3600000); // 1 hour ago
        
        const inactiveThreads = await LiveThread.find({
            isActive: true,
            isClosed: false,
            lastActivity: { $lt: oneHourAgo }
        });

        for (const thread of inactiveThreads) {
            // Close thread
            thread.isClosed = true;
            thread.isActive = false;
            await thread.save();

            // Convert to question without correct answer
            const question = new Question({
                title: thread.title,
                description: thread.description,
                userId: thread.creatorId,
                tags: [...thread.tags, 'live-thread'],
                topAnswerId: null,
                isFromLiveThread: true,
                originalThreadId: thread._id
            });

            await question.save();

            // Update thread with converted question ID
            thread.convertedQuestionId = question._id;
            await thread.save();

            console.log(`Auto-closed inactive thread: ${thread._id}`);
        }

        return inactiveThreads.length;
    } catch (error) {
        console.error('Error auto-closing threads:', error);
        throw error;
    }
};

module.exports = {
    createLiveThread,
    getActiveLiveThreads,
    getLiveThreadById,
    joinLiveThread,
    sendMessage,
    markCorrectAnswer,
    autoCloseInactiveThreads
};
