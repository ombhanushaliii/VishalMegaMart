const reportService = require('../services/report');
const { validationResult } = require('express-validator');

module.exports.createReport = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { contentType, contentId, reason, description } = req.body;
        const reportedBy = req.user._id;

        const report = await reportService.createReport({
            reportedBy,
            contentType,
            contentId,
            reason,
            description
        });

        res.status(201).json({
            success: true,
            message: 'Report submitted successfully',
            report
        });
    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to submit report' 
        });
    }
};

module.exports.getAllReports = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status || 'all';

        const result = await reportService.getAllReports(page, limit, status);

        res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch reports' 
        });
    }
};

module.exports.getReportById = async (req, res) => {
    try {
        const { reportId } = req.params;
        
        const report = await reportService.getReportById(reportId);
        
        if (!report) {
            return res.status(404).json({ 
                success: false, 
                message: 'Report not found' 
            });
        }

        res.status(200).json({
            success: true,
            report
        });
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch report' 
        });
    }
};

module.exports.updateReportStatus = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { reportId } = req.params;
        const { status, adminNotes } = req.body;
        const reviewedBy = req.user._id;

        const report = await reportService.updateReportStatus(reportId, status, reviewedBy, adminNotes);

        res.status(200).json({
            success: true,
            message: 'Report status updated successfully',
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

module.exports.getReportStats = async (req, res) => {
    try {
        const stats = await reportService.getReportStats();

        res.status(200).json({
            success: true,
            stats
        });
    } catch (error) {
        console.error('Error fetching report stats:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch report stats' 
        });
    }
};
