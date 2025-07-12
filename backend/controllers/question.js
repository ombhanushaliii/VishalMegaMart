const questionService = require('../services/question');
const { validationResult } = require('express-validator');

module.exports.createQuestion = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, description, tags } = req.body;
        const userId = req.user._id;

        const question = await questionService.createQuestion({
            title,
            description,
            userId,
            tags
        });

        const populatedQuestion = await question.populate('userId', 'username email');

        res.status(201).json({
            success: true,
            message: 'Question created successfully',
            question: populatedQuestion
        });
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create question' 
        });
    }
};

module.exports.getAllQuestions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sortBy = req.query.sortBy || 'recent';

        const result = await questionService.getAllQuestions(page, limit, sortBy);

        res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch questions' 
        });
    }
};

module.exports.getQuestionById = async (req, res) => {
    try {
        const { questionId } = req.params;
        
        const question = await questionService.getQuestionById(questionId);
        
        if (!question) {
            return res.status(404).json({ 
                success: false, 
                message: 'Question not found' 
            });
        }

        res.status(200).json({
            success: true,
            question
        });
    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch question' 
        });
    }
};

module.exports.updateQuestion = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { questionId } = req.params;
        const { title, description, tags } = req.body;
        const userId = req.user._id;

        // Check if user owns the question
        const existingQuestion = await questionService.getQuestionById(questionId);
        if (!existingQuestion) {
            return res.status(404).json({ 
                success: false, 
                message: 'Question not found' 
            });
        }

        if (existingQuestion.userId._id.toString() !== userId.toString()) {
            return res.status(403).json({ 
                success: false, 
                message: 'Not authorized to update this question' 
            });
        }

        const updatedQuestion = await questionService.updateQuestion(questionId, {
            title,
            description,
            tags
        });

        res.status(200).json({
            success: true,
            message: 'Question updated successfully',
            question: updatedQuestion
        });
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update question' 
        });
    }
};

module.exports.deleteQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const userId = req.user._id;

        // Check if user owns the question
        const existingQuestion = await questionService.getQuestionById(questionId);
        if (!existingQuestion) {
            return res.status(404).json({ 
                success: false, 
                message: 'Question not found' 
            });
        }

        if (existingQuestion.userId._id.toString() !== userId.toString()) {
            return res.status(403).json({ 
                success: false, 
                message: 'Not authorized to delete this question' 
            });
        }

        await questionService.deleteQuestion(questionId);

        res.status(200).json({
            success: true,
            message: 'Question deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete question' 
        });
    }
};

module.exports.voteQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { voteType } = req.body; // 'upvote', 'downvote', or 'remove'
        const userId = req.user._id;

        const question = await questionService.voteQuestion(questionId, userId, voteType);

        res.status(200).json({
            success: true,
            message: 'Vote recorded successfully',
            question: {
                _id: question._id,
                upvoteCount: question.upvotes.length,
                downvoteCount: question.downvotes.length,
                totalVotes: question.upvotes.length - question.downvotes.length
            }
        });
    } catch (error) {
        console.error('Error voting on question:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to vote on question' 
        });
    }
};

module.exports.searchQuestions = async (req, res) => {
    try {
        const { q: query, tags, page = 1, limit = 10 } = req.query;
        const tagsArray = tags ? tags.split(',') : [];

        const result = await questionService.searchQuestions(
            query, 
            tagsArray, 
            parseInt(page), 
            parseInt(limit)
        );

        res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Error searching questions:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to search questions' 
        });
    }
};

module.exports.getUserQuestions = async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const questions = await questionService.getUserQuestions(userId, page, limit);

        res.status(200).json({
            success: true,
            questions
        });
    } catch (error) {
        console.error('Error fetching user questions:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch user questions' 
        });
    }
};