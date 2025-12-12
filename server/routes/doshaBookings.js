const express = require('express');
const router = express.Router();
const { DoshaBooking, Dosha, User } = require('../models');
const authenticateToken = require('../middleware/auth');

// Create a new dosha booking (authenticated user)
router.post('/', authenticateToken, async (req, res) => {
    try {
        const bookingData = {
            ...req.body,
            UserId: req.user.id
        };

        // Get dosha to calculate pricing
        if (req.body.DoshaId) {
            const dosha = await Dosha.findByPk(req.body.DoshaId);
            if (dosha && dosha.pricingTiers) {
                const tier = req.body.pricingTier || 'basic';
                const tierData = dosha.pricingTiers[tier];
                if (tierData) {
                    bookingData.totalAmount = tierData.price;
                    bookingData.advanceAmount = Math.round(tierData.price * 0.25);
                }
            }
        }

        const booking = await DoshaBooking.create(bookingData);

        // Include dosha info in response
        const result = await DoshaBooking.findByPk(booking.id, {
            include: [{ model: Dosha, attributes: ['name', 'slug', 'icon'] }]
        });

        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating dosha booking:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get user's dosha bookings
router.get('/my-bookings', authenticateToken, async (req, res) => {
    try {
        const bookings = await DoshaBooking.findAll({
            where: { UserId: req.user.id },
            include: [{ model: Dosha, attributes: ['name', 'slug', 'icon', 'image'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching user dosha bookings:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get single booking by ID (user can only see their own)
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const booking = await DoshaBooking.findOne({
            where: { id: req.params.id },
            include: [
                { model: Dosha },
                { model: User, attributes: ['id', 'name', 'email'] }
            ]
        });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Check access
        if (req.user.role !== 'admin' && booking.UserId !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json(booking);
    } catch (error) {
        console.error('Error fetching dosha booking:', error);
        res.status(500).json({ error: error.message });
    }
});

// Admin: Get all dosha bookings
router.get('/admin/all', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin only' });
        }

        const { status, doshaId } = req.query;
        const where = {};
        if (status) where.status = status;
        if (doshaId) where.DoshaId = doshaId;

        const bookings = await DoshaBooking.findAll({
            where,
            include: [
                { model: Dosha, attributes: ['name', 'slug', 'icon'] },
                { model: User, attributes: ['id', 'name', 'email', 'phone'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching all dosha bookings:', error);
        res.status(500).json({ error: error.message });
    }
});

// Admin: Update booking status
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin only' });
        }

        const booking = await DoshaBooking.findByPk(req.params.id);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        await booking.update(req.body);

        const result = await DoshaBooking.findByPk(booking.id, {
            include: [{ model: Dosha, attributes: ['name', 'slug', 'icon'] }]
        });

        res.json(result);
    } catch (error) {
        console.error('Error updating dosha booking:', error);
        res.status(500).json({ error: error.message });
    }
});

// Admin: Delete booking
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin only' });
        }

        const booking = await DoshaBooking.findByPk(req.params.id);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        await booking.destroy();
        res.json({ success: true, message: 'Dosha booking deleted' });
    } catch (error) {
        console.error('Error deleting dosha booking:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
