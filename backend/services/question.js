const questionModel = require('../models/question');
const userModel = require('../models/user');
const notificationService = require('./notification');

module.exports.createQuestion = async ({ title, description, userId, tags }) => {
    // Extract mentions from description
    const mentions = notificationService.extractMentions(description);
    
    // Find mentioned users
    const mentionedUsers = await userModel.find({
        username: { $in: mentions }
    }).select('_id username');

    const question = await questionModel.create({
        title,
        description,
        userId,
        tags,
        mentions: mentionedUsers.map(user => user._id)
    });

    // Create notifications for mentioned users
    for (const mentionedUser of mentionedUsers) {
        await notificationService.createNotification({
            recipient: mentionedUser._id,
            sender: userId,
            type: 'mention_question',
            content: `mentioned you in a question: "${title}"`,
            questionId: question._id
        });
    }

    return question;
};

module.exports.getAllQuestions = async (page = 1, limit = 10, sortBy = 'recent', tagFilter = null) => {
    const skip = (page - 1) * limit;
    let sortOption = {};
    let pipeline = [
        { $match: { isActive: true } }
    ];

    // Add tag filter if provided
    if (tagFilter) {
        pipeline.push({ $match: { tags: { $in: [tagFilter] } } });
    }

    // Add lookup to get answer count
    pipeline.push({
        $lookup: {
            from: 'answers',
            localField: '_id',
            foreignField: 'questionId',
            as: 'answers'
        }
    });

    pipeline.push({
        $addFields: {
            answerCount: { $size: '$answers' }
        }
    });

    // Apply filters based on sortBy
    switch (sortBy) {
        case 'unanswered':
            pipeline.push({ $match: { answerCount: 0 } });
            sortOption = { createdAt: -1 };
            break;
        case 'answered':
            pipeline.push({ $match: { answerCount: { $gt: 0 } } });
            sortOption = { createdAt: -1 };
            break;
        case 'recent':
        default:
            sortOption = { createdAt: -1 };
            break;
    }

    // Add sorting
    pipeline.push({ $sort: sortOption });

    // Add pagination
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    // Populate user details
    pipeline.push({
        $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userId'
        }
    });

    pipeline.push({
        $unwind: '$userId'
    });

    // Project only needed user fields
    pipeline.push({
        $project: {
            'userId.password': 0,
            'answers': 0
        }
    });

    const questions = await questionModel.aggregate(pipeline);

    // Get total count for pagination
    let countPipeline = [
        { $match: { isActive: true } }
    ];

    // Add tag filter to count pipeline if provided
    if (tagFilter) {
        countPipeline.push({ $match: { tags: { $in: [tagFilter] } } });
    }

    countPipeline.push(
        {
            $lookup: {
                from: 'answers',
                localField: '_id',
                foreignField: 'questionId',
                as: 'answers'
            }
        },
        {
            $addFields: {
                answerCount: { $size: '$answers' }
            }
        }
    );

    if (sortBy === 'unanswered') {
        countPipeline.push({ $match: { answerCount: 0 } });
    } else if (sortBy === 'answered') {
        countPipeline.push({ $match: { answerCount: { $gt: 0 } } });
    }

    const totalResult = await questionModel.aggregate([
        ...countPipeline,
        { $count: "total" }
    ]);

    const total = totalResult.length > 0 ? totalResult[0].total : 0;

    return {
        questions,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalQuestions: total,
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1
        }
    };
};

module.exports.getQuestionById = async (questionId) => {
    const question = await questionModel
        .findById(questionId)
        .populate('userId', 'username email')
        .populate('topAnswerId');
    
    if (question) {
        // Increment view count
        await questionModel.findByIdAndUpdate(questionId, { $inc: { views: 1 } });
    }
    
    return question;
};

module.exports.updateQuestion = async (questionId, updateData) => {
    const question = await questionModel
        .findByIdAndUpdate(questionId, updateData, { new: true })
        .populate('userId', 'username email');
    return question;
};

module.exports.deleteQuestion = async (questionId) => {
    const question = await questionModel.findByIdAndUpdate(
        questionId, 
        { isActive: false }, 
        { new: true }
    );
    return question;
};

module.exports.voteQuestion = async (questionId, userId, voteType) => {
    const question = await questionModel.findById(questionId);
    
    if (!question) {
        throw new Error('Question not found');
    }

    // Remove any existing votes by this user
    question.upvotes.pull(userId);
    question.downvotes.pull(userId);

    // Add the new vote
    if (voteType === 'upvote') {
        question.upvotes.push(userId);
    } else if (voteType === 'downvote') {
        question.downvotes.push(userId);
    }

    await question.save();
    return question;
};

module.exports.searchQuestions = async (query, tags = [], page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    
    let searchCriteria = { isActive: true };
    
    if (query) {
        searchCriteria.$or = [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
        ];
    }
    
    if (tags.length > 0) {
        searchCriteria.tags = { $in: tags };
    }

    const questions = await questionModel
        .find(searchCriteria)
        .populate('userId', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await questionModel.countDocuments(searchCriteria);

    return {
        questions,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalQuestions: total
        }
    };
};

module.exports.getUserQuestions = async (userId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    
    const questions = await questionModel
        .find({ userId, isActive: true })
        .populate('userId', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await questionModel.countDocuments({ userId, isActive: true });

    return {
        questions,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalQuestions: total
        }
    };
};

module.exports.getAllTags = async () => {
    const pipeline = [
        { $match: { isActive: true } },
        { $unwind: '$tags' },
        { 
            $group: {
                _id: '$tags',
                count: { $sum: 1 }
            }
        },
        { 
            $project: {
                _id: 0,
                name: '$_id',
                questionCount: '$count'
            }
        },
        { $sort: { questionCount: -1 } }
    ];

    const tags = await questionModel.aggregate(pipeline);
    return tags;
};