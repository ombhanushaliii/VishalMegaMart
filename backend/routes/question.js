const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const questionController = require('../controllers/question');
const authMiddleware = require('../middlewares/auth');

// Create question
router.post('/', authMiddleware.authUser, [
    body('title')
        .isLength({ min: 5, max: 200 })
        .withMessage('Title must be between 5 and 200 characters'),
    body('description')
        .isLength({ min: 10, max: 5000 })
        .withMessage('Description must be between 10 and 5000 characters'),
    body('tags')
        .isArray({ min: 1, max: 5 })
        .withMessage('Please provide 1-5 tags')
], questionController.createQuestion);

// Get all questions
router.get('/', questionController.getAllQuestions);

// Search questions
router.get('/search', questionController.searchQuestions);

// Get user's questions
router.get('/my-questions', authMiddleware.authUser, questionController.getUserQuestions);

// Get question by ID
router.get('/:questionId', questionController.getQuestionById);

// Update question
router.put('/:questionId', authMiddleware.authUser, [
    body('title')
        .optional()
        .isLength({ min: 5, max: 200 })
        .withMessage('Title must be between 5 and 200 characters'),
    body('description')
        .optional()
        .isLength({ min: 10, max: 5000 })
        .withMessage('Description must be between 10 and 5000 characters'),
    body('tags')
        .optional()
        .isArray({ min: 1, max: 5 })
        .withMessage('Please provide 1-5 tags')
], questionController.updateQuestion);

// Delete question
router.delete('/:questionId', authMiddleware.authUser, questionController.deleteQuestion);

// Vote on question
router.post('/:questionId/vote', authMiddleware.authUser, [
    body('voteType')
        .isIn(['upvote', 'downvote', 'remove'])
        .withMessage('Vote type must be upvote, downvote, or remove')
], questionController.voteQuestion);

module.exports = router;