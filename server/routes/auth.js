const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Pandit } = require('../models');
const logger = require('../utils/logger');
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

module.exports = router;
