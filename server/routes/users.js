const express = require('express');
const router = express.Router();
const { User } = require('../models');
const authenticateToken = require('../middleware/auth');
const logger = require('../utils/logger');
const { body, validationResult } = require('express-validator');

// Validation for profile update
const validateProfileUpdate = [
    body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    body('phone').optional().trim().isLength({ min: 10, max: 15 }).withMessage('Phone must be 10-15 digits'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Get User Profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password', 'passwordResetToken', 'emailVerificationToken'] }
        });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        logger.error('Error fetching profile', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update User Profile
router.put('/profile', authenticateToken, validateProfileUpdate, async (req, res) => {
    try {
        const { name, phone } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user) return res.status(404).json({ error: 'User not found' });

        if (name) user.name = name;
        if (phone) user.phone = phone;

        await user.save();

        logger.info('User profile updated', { userId: user.id });
        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        logger.error('Error updating profile', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
