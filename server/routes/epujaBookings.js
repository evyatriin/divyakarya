const express = require('express');
const router = express.Router();
const { EPujaBooking, EPuja, User, Pandit } = require('../models');
const authenticateToken = require('../middleware/auth');

// User: Create e-puja booking
router.post('/', authenticateToken, async (req, res) => {
    try {
        const booking = await EPujaBooking.create({
            ...req.body,
            UserId: req.user.id
        });
        res.status(201).json(booking);
    } catch (error) {
        console.error('Error creating e-puja booking:', error);
        res.status(500).json({ error: 'Failed to create booking', details: error.message });
    }
});

// User: Get my e-puja bookings
router.get('/my', authenticateToken, async (req, res) => {
    try {
        const bookings = await EPujaBooking.findAll({
            where: { UserId: req.user.id },
            include: [{ model: EPuja, attributes: ['name', 'icon'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Pandit: Get my assigned e-puja bookings
router.get('/pandit', authenticateToken, async (req, res) => {
    try {
        const bookings = await EPujaBooking.findAll({
            where: { PanditId: req.user.id },
            include: [
                { model: EPuja, attributes: ['name', 'icon'] },
                { model: User, attributes: ['name', 'email', 'phone'] }
            ],
            order: [['pujaDate', 'ASC']]
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin: Get all e-puja bookings
router.get('/admin', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const bookings = await EPujaBooking.findAll({
            include: [
                { model: EPuja, attributes: ['name', 'icon'] },
                { model: User, attributes: ['name', 'email'] },
                { model: Pandit, attributes: ['name'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin: Update booking (assign pandit, update status, etc.)
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'pandit') {
            return res.status(403).json({ error: 'Access denied' });
        }
        const booking = await EPujaBooking.findByPk(req.params.id);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        await booking.update(req.body);
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin: Assign pandit to booking
router.put('/:id/assign', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const { panditId } = req.body;
        const booking = await EPujaBooking.findByPk(req.params.id);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        await booking.update({
            PanditId: panditId,
            status: 'confirmed'
        });
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single booking
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const booking = await EPujaBooking.findByPk(req.params.id, {
            include: [
                { model: EPuja },
                { model: User, attributes: ['name', 'email', 'phone'] },
                { model: Pandit, attributes: ['name', 'phone'] }
            ]
        });
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        // Check access
        if (req.user.role !== 'admin' &&
            booking.UserId !== req.user.id &&
            booking.PanditId !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
