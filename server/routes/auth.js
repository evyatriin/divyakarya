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
        if (role === 'pandit') {
            user = await Pandit.findOne({ where: { email } });
        } else {
            user = await User.findOne({ where: { email } });
        }

        if (!user) return res.status(400).json({ message: 'User not found' });

        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id, role: role || user.role }, process.env.JWT_SECRET);
            res.json({ token, user: { id: user.id, name: user.name, role: role || user.role } });
        } else {
            res.status(403).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
