const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { User, Pandit } = require('../models');
const logger = require('../utils/logger');
const { sendPasswordResetEmail, sendVerificationEmail } = require('../utils/emailService');
const { loginValidation, userRegistrationValidation, panditRegistrationValidation } = require('../middleware/validators');

// Register User
router.post('/register/user', userRegistrationValidation, async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword, phone });
        logger.info('User registered', { email });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        logger.error('User registration error', error);
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
});

// Register Pandit
router.post('/register/pandit', panditRegistrationValidation, async (req, res) => {
    try {
        const { name, email, password, phone, specialization, experience } = req.body;

        const existingPandit = await Pandit.findOne({ where: { email } });
        if (existingPandit) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await Pandit.create({
            name, email, password: hashedPassword, phone, specialization, experience: parseInt(experience) || 0
        });
        logger.info('Pandit registered', { email });
        res.status(201).json({ message: 'Pandit registered successfully' });
    } catch (error) {
        logger.error('Pandit registration error', error);
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
});

// Login - Unified login that auto-detects role
router.post('/login', loginValidation, async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = null;
        let actualRole = null;

        // First, check if email exists in Pandit table
        const pandit = await Pandit.findOne({ where: { email } });
        if (pandit) {
            user = pandit;
            actualRole = 'pandit';
        }

        // If not found in Pandit, check User table
        if (!user) {
            const regularUser = await User.findOne({ where: { email } });
            if (regularUser) {
                user = regularUser;
                actualRole = regularUser.role;
            }
        }

        if (!user) {
            return res.status(400).json({ message: 'No account found with this email' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            logger.warn('Failed login attempt', { email });
            return res.status(403).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user.id, role: actualRole }, process.env.JWT_SECRET, { expiresIn: '7d' });

        logger.info('User logged in', { email, role: actualRole });
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: actualRole
            }
        });
    } catch (error) {
        logger.error('Login error', error);
        res.status(500).json({ error: 'Login failed. Please try again.' });
    }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        // Find user or pandit
        let account = await User.findOne({ where: { email } });
        let role = 'user';
        if (!account) {
            account = await Pandit.findOne({ where: { email } });
            role = 'pandit';
        }

        if (!account) {
            // Check specific logic: don't reveal if email exists or not? 
            // For now, let's say "If an account exists, email sent"
            return res.json({ message: 'If an account exists with this email, a reset link has been sent.' });
        }

        // Generate token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour

        account.passwordResetToken = resetToken;
        account.passwordResetExpires = passwordResetExpires;
        await account.save();

        // Send email
        const origin = req.headers.origin || 'http://localhost:5173';
        await sendPasswordResetEmail(account.email, resetToken, origin);

        logger.info('Password reset requested', { email, role });
        res.json({ message: 'If an account exists with this email, a reset link has been sent.' });
    } catch (error) {
        logger.error('Forgot password error', error);
        res.status(500).json({ error: 'Something went wrong requested' });
    }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) return res.status(400).json({ error: 'Token and password are required' });

        // Find account with valid token
        let account = await User.findOne({
            where: {
                passwordResetToken: token,
                passwordResetExpires: { [Op.gt]: new Date() }
            }
        });

        if (!account) {
            account = await Pandit.findOne({
                where: {
                    passwordResetToken: token,
                    passwordResetExpires: { [Op.gt]: new Date() }
                }
            });
        }

        if (!account) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        // Update password
        const hashedPassword = await bcrypt.hash(password, 10);
        account.password = hashedPassword;
        account.passwordResetToken = null;
        account.passwordResetExpires = null;
        await account.save();

        logger.info('Password reset successful', { email: account.email });
        res.json({ message: 'Password reset successfully. You can now login.' });
    } catch (error) {
        logger.error('Reset password error', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Verify Email (optional step if needed)
router.get('/verify-email', async (req, res) => {
    // Implementation can be added if we send verification emails on signup
    res.json({ message: 'Verification logic placeholder' });
});

module.exports = router;
