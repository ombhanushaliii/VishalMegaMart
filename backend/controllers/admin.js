const userModel = require('../models/user');
const questionModel = require('../models/question');
const answerModel = require('../models/answer');
const reportModel = require('../models/report');

// Hardcoded admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

module.exports.adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            // Create a temporary admin token (in real app, use JWT)
            const adminToken = 'admin_' + Date.now();
            
            res.status(200).json({
                success: true,
                message: 'Admin login successful',
                token: adminToken,
                admin: {
                    username: ADMIN_USERNAME,
                    role: 'admin'
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid admin credentials'
            });
        }
    } catch (error) {
        console.error('Error in admin login:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await userModel.countDocuments();
        const totalQuestions = await questionModel.countDocuments({ isActive: true });
        const totalAnswers = await answerModel.countDocuments({ isActive: true });
        const pendingReports = await reportModel.countDocuments({ status: 'pending' });

        // Recent activity (last 7 days)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentUsers = await userModel.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
        const recentQuestions = await questionModel.countDocuments({ 
            createdAt: { $gte: sevenDaysAgo }, 
            isActive: true 
        });
        const recentAnswers = await answerModel.countDocuments({ 
            createdAt: { $gte: sevenDaysAgo }, 
            isActive: true 
        });

        // Top users by question count
        const topUsers = await questionModel.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$userId', questionCount: { $sum: 1 } } },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            { $sort: { questionCount: -1 } },
            { $limit: 5 },
            { $project: { _id: 1, questionCount: 1, 'user.username': 1, 'user.email': 1 } }
        ]);

        res.status(200).json({
            success: true,
            stats: {
                overview: {
                    totalUsers,
                    totalQuestions,
                    totalAnswers,
                    pendingReports
                },
                recentActivity: {
                    recentUsers,
                    recentQuestions,
                    recentAnswers
                },
                topUsers
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard stats'
        });
    }
};

module.exports.getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await userModel
            .find({})
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await userModel.countDocuments();

        res.status(200).json({
            success: true,
            users,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalUsers: total
            }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users'
        });
    }
};

module.exports.getAllQuestions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const questions = await questionModel
            .find({})
            .populate('userId', 'username email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await questionModel.countDocuments();

        res.status(200).json({
            success: true,
            questions,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalQuestions: total
            }
        });
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch questions'
        });
    }
};

module.exports.toggleQuestionStatus = async (req, res) => {
    try {
        const { questionId } = req.params;
        const question = await questionModel.findById(questionId);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        question.isActive = !question.isActive;
        await question.save();

        res.status(200).json({
            success: true,
            message: `Question ${question.isActive ? 'activated' : 'deactivated'} successfully`,
            question
        });
    } catch (error) {
        console.error('Error toggling question status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle question status'
        });
    }
};

module.exports.deleteQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        
        await questionModel.findByIdAndDelete(questionId);
        await answerModel.deleteMany({ questionId });

        res.status(200).json({
            success: true,
            message: 'Question and related answers deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete question'
        });
    }
};

// Report Management
module.exports.getAllReports = async (req, res) => {
    try {
        const reports = await reportModel.find({})
            .populate('contentId')
            .populate('reportedBy', 'username email')
            .sort({ reportedAt: -1 });

        res.status(200).json({
            success: true,
            reports
        });
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reports'
        });
    }
};

module.exports.updateReportStatus = async (req, res) => {
    try {
        const { reportId } = req.params;
        const { status } = req.body;

        const report = await reportModel.findByIdAndUpdate(
            reportId,
            { status },
            { new: true }
        ).populate({
            path: 'reportedContentId',
            refPath: 'reportedContentType',
            populate: {
                path: 'userId',
                model: 'User',
                select: 'username'
            }
        })
        .populate('reportedBy', 'username');

        res.status(200).json({
            success: true,
            report
        });
    } catch (error) {
        console.error('Error updating report status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update report status'
        });
    }
};

module.exports.deleteReport = async (req, res) => {
    try {
        const { reportId } = req.params;
        
        await reportModel.findByIdAndDelete(reportId);

        res.status(200).json({
            success: true,
            message: 'Report deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete report'
        });
    }
};
