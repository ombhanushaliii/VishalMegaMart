const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification');
const authMiddleware = require('../middlewares/auth');

// Get user notifications
router.get('/', authMiddleware.authUser, notificationController.getUserNotifications);

// Get unread count
router.get('/unread-count', authMiddleware.authUser, notificationController.getUnreadCount);

// Mark notification as read
router.patch('/:notificationId/read', authMiddleware.authUser, notificationController.markNotificationAsRead);

// Mark all notifications as read
router.patch('/mark-all-read', authMiddleware.authUser, notificationController.markAllNotificationsAsRead);

module.exports = router;
