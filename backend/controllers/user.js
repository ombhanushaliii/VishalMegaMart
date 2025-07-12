const userModel = require('../models/user');
const userService = require('../services/user');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blackListToken');

module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const isUserAlready = await userModel.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (isUserAlready) {
            return res.status(400).json({ 
                message: isUserAlready.email === email ? 'Email already exists' : 'Username already exists' 
            });
        }

        const hashedPassword = await userModel.hashPassword(password);

        const user = await userService.createUser({
            username,
            email,
            password: hashedPassword
        });

        const token = user.generateAuthToken();

        res.status(201).json({ 
            token, 
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                needsOnboarding: user.needsOnboarding
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { emailOrUsername, password } = req.body;

    try {
        // Find user by email or username
        const user = await userModel.findOne({
            $or: [
                { email: emailOrUsername },
                { username: emailOrUsername }
            ]
        }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = user.generateAuthToken();

        res.cookie('token', token);

        res.status(200).json({ 
            token, 
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                age: user.age,
                occupation: user.occupation,
                areaofinterest: user.areaofinterest,
                needsOnboarding: user.needsOnboarding
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports.getUserProfile = async (req, res, next) => {
    res.status(200).json(req.user);
}

module.exports.logoutUser = async (req, res, next) => {
    try {
        res.clearCookie('token');
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (token) {
            await blackListTokenModel.create({ token });
        }

        res.status(200).json({ message: 'Logged out' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports.checkUsername = async (req, res, next) => {
    try {
        const { username } = req.params;
        const existingUser = await userModel.findOne({ username });
        res.status(200).json({ available: !existingUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports.completeOnboarding = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { age, occupation, areaofinterest } = req.body;
        
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                age,
                occupation,
                areaofinterest,
                needsOnboarding: false
            },
            { new: true }
        );

        res.status(200).json({
            user: {
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                age: updatedUser.age,
                occupation: updatedUser.occupation,
                areaofinterest: updatedUser.areaofinterest,
                needsOnboarding: updatedUser.needsOnboarding
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}