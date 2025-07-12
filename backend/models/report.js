const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    contentType: {
        type: String,
        enum: ['question', 'answer', 'user'],
        required: true
    },
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'contentType'
    },
    reason: {
        type: String,
        enum: [
            'spam',
            'inappropriate',
            'harassment',
            'copyright',
            'misinformation',
            'offensive',
            'other'
        ],
        required: true
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters'],
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
        default: 'pending'
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    reviewedAt: {
        type: Date
    },
    adminNotes: {
        type: String,
        maxlength: [1000, 'Admin notes cannot exceed 1000 characters']
    }
}, {
    timestamps: true
});

// Indexes
reportSchema.index({ status: 1 });
reportSchema.index({ contentType: 1 });
reportSchema.index({ createdAt: -1 });

const reportModel = mongoose.model('report', reportSchema);

module.exports = reportModel;
