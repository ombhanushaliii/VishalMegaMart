const answerModel = require('../models/answer');
const questionModel = require('../models/question');
const userModel = require('../models/user');
const notificationService = require('./notification');

module.exports.createAnswer = async ({ questionId, userId, answer }) => {
    // Extract mentions from answer
    const mentions = notificationService.extractMentions(answer);
    
    // Find mentioned users
    const mentionedUsers = await userModel.find({
        username: { $in: mentions }
    }).select('_id username');

    const newAnswer = await answerModel.create({
        questionId,
        userId,
        answer,
        mentions: mentionedUsers.map(user => user._id)
    });
    
    // Populate the answer with user details
    const populatedAnswer = await answerModel
        .findById(newAnswer._id)
        .populate('userId', 'username email');
    
    // Get question details for notifications
    const question = await questionModel.findById(questionId).populate('userId', 'username');
    
    // Create notifications for mentioned users in the answer
    for (const mentionedUser of mentionedUsers) {
        await notificationService.createNotification({
            recipient: mentionedUser._id,
            sender: userId,
            type: 'mention_answer',
            content: `mentioned you in an answer to: "${question.title}"`,
            questionId: questionId,
            answerId: newAnswer._id
        });
    }

    // Create notification for question author (if not the same user)
    if (question.userId._id.toString() !== userId.toString()) {
        await notificationService.createNotification({
            recipient: question.userId._id,
            sender: userId,
            type: 'answer_on_question',
            content: `answered your question: "${question.title}"`,
            questionId: questionId,
            answerId: newAnswer._id
        });
    }
    
    return populatedAnswer;
};

module.exports.getAnswersByQuestionId = async (questionId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    
    const answers = await answerModel
        .find({ questionId, isActive: true })
        .populate('userId', 'username email')
        .sort({ isAccepted: -1, createdAt: -1 }) // Accepted answers first, then by date
        .skip(skip)
        .limit(limit);

    const total = await answerModel.countDocuments({ questionId, isActive: true });

    return {
        answers,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalAnswers: total
        }
    };
};

module.exports.getAnswerById = async (answerId) => {
    const answer = await answerModel
        .findById(answerId)
        .populate('userId', 'username email')
        .populate('questionId', 'title');
    
    return answer;
};

module.exports.updateAnswer = async (answerId, updateData) => {
    const answer = await answerModel
        .findByIdAndUpdate(answerId, updateData, { new: true })
        .populate('userId', 'username email');
    return answer;
};

module.exports.deleteAnswer = async (answerId) => {
    const answer = await answerModel.findByIdAndUpdate(
        answerId, 
        { isActive: false }, 
        { new: true }
    );
    return answer;
};

module.exports.voteAnswer = async (answerId, userId, voteType) => {
    const answer = await answerModel.findById(answerId);
    
    if (!answer) {
        throw new Error('Answer not found');
    }

    // Remove any existing votes by this user
    answer.upvotes.pull(userId);
    answer.downvotes.pull(userId);

    // Add the new vote
    if (voteType === 'upvote') {
        answer.upvotes.push(userId);
    } else if (voteType === 'downvote') {
        answer.downvotes.push(userId);
    }

    await answer.save();
    return answer;
};

module.exports.acceptAnswer = async (answerId, questionOwnerId) => {
    const answer = await answerModel.findById(answerId).populate('questionId');
    
    if (!answer) {
        throw new Error('Answer not found');
    }

    // Check if the user is the question owner
    if (answer.questionId.userId.toString() !== questionOwnerId.toString()) {
        throw new Error('Only question owner can accept answers');
    }

    // Remove accepted status from other answers for this question
    await answerModel.updateMany(
        { questionId: answer.questionId._id },
        { isAccepted: false }
    );

    // Set this answer as accepted
    answer.isAccepted = true;
    await answer.save();

    // Update question's top answer
    await questionModel.findByIdAndUpdate(
        answer.questionId._id,
        { topAnswerId: answerId }
    );

    return answer;
};

module.exports.getUserAnswers = async (userId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    
    const answers = await answerModel
        .find({ userId, isActive: true })
        .populate('questionId', 'title')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await answerModel.countDocuments({ userId, isActive: true });

    return {
        answers,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalAnswers: total
        }
    };
};
