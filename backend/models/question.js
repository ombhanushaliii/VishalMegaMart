const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
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
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    tags: [{
        type: String,
        lowercase: true,
        trim: true
    }],
    topAnswerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'answer',
        default: null
    },
    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    downvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    mentions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    views: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Virtual fields
questionSchema.virtual('upvoteCount').get(function() {
    return this.upvotes.length;
});

questionSchema.virtual('downvoteCount').get(function() {
    return this.downvotes.length;
});

questionSchema.virtual('totalVotes').get(function() {
    return this.upvotes.length - this.downvotes.length;
});

// Indexes for better performance
questionSchema.index({ userId: 1 });
questionSchema.index({ tags: 1 });
questionSchema.index({ createdAt: -1 });
questionSchema.index({ views: -1 });

const questionModel = mongoose.model('question', questionSchema);

module.exports = questionModel;