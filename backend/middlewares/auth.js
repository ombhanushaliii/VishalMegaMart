const userModel = require('../models/user');
const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../models/blackListToken');


module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }


    const isBlacklisted = await blackListTokenModel.findOne({ token: token });

    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id)

        req.user = user;

        return next();

    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports.authAdmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if it's a valid admin token (you may want to store these in database)
    const validAdminTokens = ['admin_123456789']; // This should be stored securely
    
    if (!validAdminTokens.includes(token)) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Set admin flag for the request
    req.isAdmin = true;
    
    return next();
};
