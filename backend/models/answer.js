const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'question',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    answer: {
        type: String,
        required: true,
        trim: true,
        minlength: [10, 'Answer must be at least 10 characters long'],
        maxlength: [5000, 'Answer cannot exceed 5000 characters']
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
    isAccepted: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Virtual fields
answerSchema.virtual('upvoteCount').get(function() {
    return this.upvotes.length;
});

answerSchema.virtual('downvoteCount').get(function() {
    return this.downvotes.length;
});

answerSchema.virtual('totalVotes').get(function() {
    return this.upvotes.length - this.downvotes.length;
});

// Indexes for better performance
answerSchema.index({ questionId: 1 });
answerSchema.index({ userId: 1 });
answerSchema.index({ createdAt: -1 });

const answerModel = mongoose.model('answer', answerSchema);

module.exports = answerModel;
