const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const reportController = require('../controllers/report');
const authMiddleware = require('../middlewares/auth');

// Create report
router.post('/', authMiddleware.authUser, [
    body('contentType').isIn(['question', 'answer', 'user']).withMessage('Content type must be question, answer, or user'),
    body('contentId').isMongoId().withMessage('Invalid content ID'),
    body('reason').isIn(['spam', 'inappropriate', 'harassment', 'copyright', 'misinformation', 'offensive', 'other']).withMessage('Invalid reason'),
    body('description').optional().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
], reportController.createReport);

// Get all reports (admin only)
router.get('/', authMiddleware.authUser, reportController.getAllReports);

// Get report stats (admin only)
router.get('/stats', authMiddleware.authUser, reportController.getReportStats);

// Get report by ID (admin only)
router.get('/:reportId', authMiddleware.authUser, reportController.getReportById);

// Update report status (admin only)
router.put('/:reportId/status', authMiddleware.authUser, [
    body('status').isIn(['pending', 'reviewed', 'resolved', 'dismissed']).withMessage('Invalid status'),
    body('adminNotes').optional().isLength({ max: 1000 }).withMessage('Admin notes cannot exceed 1000 characters')
], reportController.updateReportStatus);

module.exports = router;
