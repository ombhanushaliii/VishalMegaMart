const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const liveThreadController = require('../controllers/liveThread');
const authMiddleware = require('../middlewares/auth');

// Create live thread
router.post('/', authMiddleware.authUser, [
    body('title')
        .isLength({ min: 5, max: 200 })
        .withMessage('Title must be between 5 and 200 characters'),
    body('description')
        .isLength({ min: 10, max: 5000 })
        .withMessage('Description must be between 10 and 5000 characters'),
    body('tags')
        .optional()
        .isArray({ max: 5 })
        .withMessage('Maximum 5 tags allowed')
], liveThreadController.createLiveThread);

// Get all active live threads
router.get('/', liveThreadController.getActiveLiveThreads);

// Get specific live thread with messages
router.get('/:threadId', liveThreadController.getLiveThreadById);

// Join a live thread
router.post('/:threadId/join', authMiddleware.authUser, liveThreadController.joinLiveThread);

// Send message in thread
router.post('/:threadId/messages', authMiddleware.authUser, [
    body('content')
        .isLength({ min: 1, max: 1000 })
        .withMessage('Message must be between 1 and 1000 characters')
], liveThreadController.sendMessage);

// Mark correct answer and close thread
router.post('/:threadId/close/:messageId', authMiddleware.authUser, liveThreadController.markCorrectAnswer);

module.exports = router;
