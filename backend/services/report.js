const reportModel = require('../models/report');

module.exports.createReport = async ({ reportedBy, contentType, contentId, reason, description }) => {
    const report = await reportModel.create({
        reportedBy,
        contentType,
        contentId,
        reason,
        description
    });
    
    const populatedReport = await reportModel
        .findById(report._id)
        .populate('reportedBy', 'username email');
    
    return populatedReport;
};

module.exports.getAllReports = async (page = 1, limit = 10, status = 'all') => {
    const skip = (page - 1) * limit;
    
    let filterOption = {};
    if (status !== 'all') {
        filterOption.status = status;
    }
    
    const reports = await reportModel
        .find(filterOption)
        .populate('reportedBy', 'username email')
        .populate('reviewedBy', 'username email')
        .populate({
            path: 'contentId',
            select: 'title description answer username email', // Select relevant fields based on content type
            populate: {
                path: 'userId',
                select: 'username email'
            }
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await reportModel.countDocuments(filterOption);

    return {
        reports,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalReports: total
        }
    };
};

module.exports.getReportById = async (reportId) => {
    const report = await reportModel
        .findById(reportId)
        .populate('reportedBy', 'username email')
        .populate('reviewedBy', 'username email');
    
    return report;
};

module.exports.updateReportStatus = async (reportId, status, reviewedBy, adminNotes) => {
    const updateData = {
        status,
        reviewedBy,
        reviewedAt: new Date(),
        adminNotes
    };
    
    const report = await reportModel
        .findByIdAndUpdate(reportId, updateData, { new: true })
        .populate('reportedBy', 'username email')
        .populate('reviewedBy', 'username email');
    
    return report;
};

module.exports.getReportStats = async () => {
    const stats = await reportModel.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);
    
    const totalReports = await reportModel.countDocuments();
    const pendingReports = await reportModel.countDocuments({ status: 'pending' });
    
    return {
        totalReports,
        pendingReports,
        statusBreakdown: stats
    };
};
