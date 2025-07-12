const notificationModel = require('../models/notification');

module.exports.createNotification = async ({ recipient, sender, type, content, questionId, answerId = null }) => {
    // Don't create notification if user is mentioning themselves
    if (recipient.toString() === sender.toString()) {
        return null;
    }

    const notification = await notificationModel.create({
        recipient,
        sender,
        type,
        content,
        questionId,
        answerId
    });

    return notification.populate([
        { path: 'sender', select: 'username email' },
        { path: 'questionId', select: 'title' }
    ]);
};

module.exports.getUserNotifications = async (userId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const notifications = await notificationModel
        .find({ recipient: userId, isActive: true })
        .populate('sender', 'username email')
        .populate('questionId', 'title')
        .populate('answerId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await notificationModel.countDocuments({ 
        recipient: userId, 
        isActive: true 
    });

    return {
        notifications,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalNotifications: total,
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1
        }
    };
};

module.exports.markAsRead = async (notificationId, userId) => {
    const notification = await notificationModel.findOneAndUpdate(
        { _id: notificationId, recipient: userId },
        { isRead: true },
        { new: true }
    ).populate([
        { path: 'sender', select: 'username email' },
        { path: 'questionId', select: 'title' }
    ]);

    return notification;
};

module.exports.markAllAsRead = async (userId) => {
    await notificationModel.updateMany(
        { recipient: userId, isRead: false },
        { isRead: true }
    );
};

module.exports.getUnreadCount = async (userId) => {
    const count = await notificationModel.countDocuments({
        recipient: userId,
        isRead: false,
        isActive: true
    });
    return count;
};

// Helper function to extract mentions from text
module.exports.extractMentions = (text) => {
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;
    
    while ((match = mentionRegex.exec(text)) !== null) {
        mentions.push(match[1]); // username without @
    }
    
    return [...new Set(mentions)]; // Remove duplicates
};
