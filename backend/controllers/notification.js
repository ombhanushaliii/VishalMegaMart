const notificationService = require('../services/notification');
const { validationResult } = require('express-validator');

module.exports.getUserNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const result = await notificationService.getUserNotifications(userId, page, limit);

        res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch notifications' 
        });
    }
};

module.exports.markNotificationAsRead = async (req, res) => {
    try {
        const notificationId = req.params.notificationId;
        const userId = req.user._id;

        const notification = await notificationService.markAsRead(notificationId, userId);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Notification marked as read',
            notification
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update notification' 
        });
    }
};

module.exports.markAllNotificationsAsRead = async (req, res) => {
    try {
        const userId = req.user._id;

        await notificationService.markAllAsRead(userId);

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update notifications' 
        });
    }
};

module.exports.getUnreadCount = async (req, res) => {
    try {
        const userId = req.user._id;
        const count = await notificationService.getUnreadCount(userId);

        res.status(200).json({
            success: true,
            unreadCount: count
        });
    } catch (error) {
        console.error('Error fetching unread count:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch unread count' 
        });
    }
};
