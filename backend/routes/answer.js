const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const answerController = require('../controllers/answer');
const authMiddleware = require('../middlewares/auth');

// Create answer
router.post('/', authMiddleware.authUser, [
    body('questionId').isMongoId().withMessage('Invalid question ID'),
    body('answer').isLength({ min: 10, max: 5000 }).withMessage('Answer must be between 10 and 5000 characters')
], answerController.createAnswer);

// Get answers by question ID
router.get('/question/:questionId', answerController.getAnswersByQuestionId);

// Get user's answers
router.get('/my-answers', authMiddleware.authUser, answerController.getUserAnswers);

// Update answer
router.put('/:answerId', authMiddleware.authUser, [
    body('answer').isLength({ min: 10, max: 5000 }).withMessage('Answer must be between 10 and 5000 characters')
], answerController.updateAnswer);

// Delete answer
router.delete('/:answerId', authMiddleware.authUser, answerController.deleteAnswer);

// Vote on answer
router.post('/:answerId/vote', authMiddleware.authUser, [
    body('voteType').isIn(['upvote', 'downvote', 'remove']).withMessage('Vote type must be upvote, downvote, or remove')
], answerController.voteAnswer);

// Accept answer
router.post('/:answerId/accept', authMiddleware.authUser, answerController.acceptAnswer);

module.exports = router;
