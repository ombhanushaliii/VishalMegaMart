const express = require('express');
const router = express.Router();
const { body } = require("express-validator")
const userController = require('../controllers/user');
const authMiddleware = require('../middlewares/auth');


router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
    userController.registerUser
)

router.post('/login', [
    body('emailOrUsername').notEmpty().withMessage('Email or username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
    userController.loginUser
)

router.get('/profile', authMiddleware.authUser, userController.getUserProfile)

router.get('/logout', authMiddleware.authUser, userController.logoutUser)

router.get('/check-username/:username', userController.checkUsername)

router.put('/complete-onboarding', authMiddleware.authUser, [
    body('age').isInt({ min: 13, max: 120 }).withMessage('Age must be between 13 and 120'),
    body('occupation').notEmpty().withMessage('Occupation is required'),
    body('areaofinterest').isArray({ min: 1 }).withMessage('At least one area of interest is required')
], userController.completeOnboarding)

module.exports = router;