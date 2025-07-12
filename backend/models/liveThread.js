const mongoose = require('mongoose');

const liveThreadSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: [5, 'Title must be at least 5 characters long'],
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: [10, 'Description must be at least 10 characters long'],
        maxlength: [5000, 'Description cannot exceed 5000 characters']
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    tags: [{
        type: String,
        lowercase: true,
        trim: true
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    isClosed: {
        type: Boolean,
        default: false
    },
    participants: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    lastActivity: {
        type: Date,
        default: Date.now
    },
    correctAnswerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'threadMessage',
        default: null
    },
    // Will be populated when thread is closed and converted to question
    convertedQuestionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'question',
        default: null
    },
    maxDuration: {
        type: Number,
        default: 3600000 // 1 hour in milliseconds
    }
}, {
    timestamps: true
});

// Virtual to check if thread should auto-close
liveThreadSchema.virtual('shouldAutoClose').get(function() {
    if (this.isClosed) return false;
    const now = new Date();
    const timeSinceLastActivity = now - this.lastActivity;
    return timeSinceLastActivity >= this.maxDuration;
});

// Method to update last activity
liveThreadSchema.methods.updateActivity = function() {
    this.lastActivity = new Date();
    return this.save();
};

// Indexes for better performance
liveThreadSchema.index({ creatorId: 1 });
liveThreadSchema.index({ isActive: 1, isClosed: 1 });
liveThreadSchema.index({ lastActivity: 1 });
liveThreadSchema.index({ tags: 1 });

const LiveThread = mongoose.model('LiveThread', liveThreadSchema);

module.exports = LiveThread;
