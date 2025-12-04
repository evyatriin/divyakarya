const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Pandit } = require('../models');

// Register User
router.post('/register/user', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, phone });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('User registration error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Register Pandit
router.post('/register/pandit', async (req, res) => {
    try {
        const { name, email, password, phone, specialization, experience } = req.body;

        // Check if pandit already exists
        const existingPandit = await Pandit.findOne({ where: { email } });
        if (existingPandit) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const pandit = await Pandit.create({
            name, email, password: hashedPassword, phone, specialization, experience: parseInt(experience) || 0
        });
        res.status(201).json({ message: 'Pandit registered successfully' });
    } catch (error) {
        console.error('Pandit registration error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Login (Generic for now, could be split)
router.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body; // role: 'user' or 'pandit' or 'admin'

        let user;
        let actualRole = role;

        if (role === 'pandit') {
            user = await Pandit.findOne({ where: { email } });
            if (!user) {
                return res.status(400).json({ message: 'Pandit account not found with this email' });
            }
        } else if (role === 'admin') {
            user = await User.findOne({ where: { email, role: 'admin' } });
            if (!user) {
                return res.status(400).json({ message: 'Admin account not found with this email' });
            }
        } else {
            // Regular user login
            user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(400).json({ message: 'User account not found with this email' });
            }
            actualRole = user.role; // Use the role from database (could be 'admin')
        }

        if (!user) {
            return res.status(400).json({ message: 'Account not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(403).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user.id, role: actualRole }, process.env.JWT_SECRET, { expiresIn: '7d' });

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
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed. Please try again.' });
    }
});

module.exports = router;
