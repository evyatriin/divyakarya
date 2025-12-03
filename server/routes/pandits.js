const express = require('express');
const router = express.Router();
const { Pandit } = require('../models');
const authenticateToken = require('../middleware/auth');

// Toggle Online Status
router.put('/status', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'pandit') return res.status(403).json({ message: 'Not a pandit' });

        const pandit = await Pandit.findByPk(req.user.id);
        pandit.isOnline = !pandit.isOnline;
        await pandit.save();
        res.json({ isOnline: pandit.isOnline });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// List Online Pandits (Public/Admin)
router.get('/', async (req, res) => {
    try {
        const pandits = await Pandit.findAll({
            where: { isOnline: true },
            attributes: { exclude: ['password'] }
        });
        res.json(pandits);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
