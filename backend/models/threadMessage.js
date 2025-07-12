const mongoose = require('mongoose');

const threadMessageSchema = new mongoose.Schema({
    threadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LiveThread',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    mentions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    isMarkedAsAnswer: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Indexes for better performance
threadMessageSchema.index({ threadId: 1, createdAt: 1 });
threadMessageSchema.index({ userId: 1 });

const ThreadMessage = mongoose.model('ThreadMessage', threadMessageSchema);

module.exports = ThreadMessage;
