const answerService = require('../services/answer');
const { validationResult } = require('express-validator');

module.exports.createAnswer = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { questionId, answer } = req.body;
        const userId = req.user._id;

        const newAnswer = await answerService.createAnswer({
            questionId,
            userId,
            answer
        });

        res.status(201).json({
            success: true,
            message: 'Answer created successfully',
            answer: newAnswer
        });
    } catch (error) {
        console.error('Error creating answer:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create answer' 
        });
    }
};

module.exports.getAnswersByQuestionId = async (req, res) => {
    try {
        const { questionId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const result = await answerService.getAnswersByQuestionId(questionId, page, limit);

        res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Error fetching answers:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch answers' 
        });
    }
};

module.exports.updateAnswer = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { answerId } = req.params;
        const { answer } = req.body;
        const userId = req.user._id;

        // Check if user owns the answer
        const existingAnswer = await answerService.getAnswerById(answerId);
        if (!existingAnswer) {
            return res.status(404).json({ 
                success: false, 
                message: 'Answer not found' 
            });
        }

        if (existingAnswer.userId._id.toString() !== userId.toString()) {
            return res.status(403).json({ 
                success: false, 
                message: 'Not authorized to update this answer' 
            });
        }

        const updatedAnswer = await answerService.updateAnswer(answerId, { answer });

        res.status(200).json({
            success: true,
            message: 'Answer updated successfully',
            answer: updatedAnswer
        });
    } catch (error) {
        console.error('Error updating answer:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update answer' 
        });
    }
};

module.exports.deleteAnswer = async (req, res) => {
    try {
        const { answerId } = req.params;
        const userId = req.user._id;

        // Check if user owns the answer
        const existingAnswer = await answerService.getAnswerById(answerId);
        if (!existingAnswer) {
            return res.status(404).json({ 
                success: false, 
                message: 'Answer not found' 
            });
        }

        if (existingAnswer.userId._id.toString() !== userId.toString()) {
            return res.status(403).json({ 
                success: false, 
                message: 'Not authorized to delete this answer' 
            });
        }

        await answerService.deleteAnswer(answerId);

        res.status(200).json({
            success: true,
            message: 'Answer deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting answer:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete answer' 
        });
    }
};

module.exports.voteAnswer = async (req, res) => {
    try {
        const { answerId } = req.params;
        const { voteType } = req.body;
        const userId = req.user._id;

        const answer = await answerService.voteAnswer(answerId, userId, voteType);

        res.status(200).json({
            success: true,
            message: 'Vote recorded successfully',
            answer: {
                _id: answer._id,
                upvoteCount: answer.upvotes.length,
                downvoteCount: answer.downvotes.length,
                totalVotes: answer.upvotes.length - answer.downvotes.length
            }
        });
    } catch (error) {
        console.error('Error voting on answer:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to vote on answer' 
        });
    }
};

module.exports.acceptAnswer = async (req, res) => {
    try {
        const { answerId } = req.params;
        const userId = req.user._id;

        const answer = await answerService.acceptAnswer(answerId, userId);

        res.status(200).json({
            success: true,
            message: 'Answer accepted successfully',
            answer
        });
    } catch (error) {
        console.error('Error accepting answer:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to accept answer' 
        });
    }
};

module.exports.getUserAnswers = async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const result = await answerService.getUserAnswers(userId, page, limit);

        res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Error fetching user answers:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch user answers' 
        });
    }
};
