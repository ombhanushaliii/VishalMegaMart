const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const adminController = require('../controllers/admin');
const authMiddleware = require('../middlewares/auth');

// Admin login (no auth required)
router.post('/login', [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
], adminController.adminLogin);

// All other routes require admin authentication


// Dashboard stats
router.get('/dashboard/stats', adminController.getDashboardStats);

// User management
router.get('/users', adminController.getAllUsers);

// Question management
router.get('/questions', adminController.getAllQuestions);
router.put('/questions/:questionId/toggle-status', adminController.toggleQuestionStatus);
router.delete('/questions/:questionId', adminController.deleteQuestion);

// Report management
router.get('/reports', adminController.getAllReports);
router.put('/reports/:reportId/status', adminController.updateReportStatus);
router.delete('/reports/:reportId', adminController.deleteReport);

module.exports = router;
