const express = require('express');
const router = express.Router();
const { Booking, User, Pandit } = require('../models');
const authenticateToken = require('../middleware/auth');

// Create Booking (User)
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { ceremonyType, date, time, address, amount } = req.body;
        const booking = await Booking.create({
            UserId: req.user.id,
            ceremonyType,
            date,
            time,
            address,
            amount
        });
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Bookings (User/Pandit/Admin)
router.get('/', authenticateToken, async (req, res) => {
    try {
        let where = {};
        if (req.user.role === 'user') {
            where.UserId = req.user.id;
        } else if (req.user.role === 'pandit') {
            where.PanditId = req.user.id;
        }
        // Admin sees all

        const bookings = await Booking.findAll({
            where,
            include: [
                { model: User, attributes: ['name', 'phone'] },
                { model: Pandit, attributes: ['name', 'phone'] }
            ]
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Booking Status (Pandit/Admin)
router.put('/:id/status', authenticateToken, async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByPk(req.params.id);

        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // Logic: Pandit can accept/reject if assigned to them (or if open pool - simplified here to assigned)
        if (req.user.role === 'pandit' && booking.PanditId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        booking.status = status;
        await booking.save();
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
