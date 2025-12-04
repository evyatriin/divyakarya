const express = require('express');
const router = express.Router();
const { Booking, Pandit, User } = require('../models');
const authenticateToken = require('../middleware/auth');
const { Op } = require('sequelize');

// Get Admin Dashboard Statistics
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin only' });
        }

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [totalBookings, pendingBookings, completedBookings, totalRevenue, activePandits, totalUsers] = await Promise.all([
            Booking.count(),
            Booking.count({ where: { status: 'pending' } }),
            Booking.count({ where: { status: 'completed' } }),
            Booking.sum('amount', { where: { status: 'completed', paymentStatus: 'paid' } }),
            Pandit.count({ where: { isOnline: true } }),
            User.count()
        ]);

        res.json({
            totalBookings,
            pendingBookings,
            completedBookings,
            totalRevenue: totalRevenue || 0,
            activePandits,
            totalUsers
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ error: error.message });
    }
});

// Assign Pandit to Booking
router.put('/assign', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });

        const { bookingId, panditId } = req.body;
        const booking = await Booking.findByPk(bookingId);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        booking.PanditId = panditId;
        booking.status = 'pending'; // Reset to pending for the new pandit to accept
        await booking.save();

        // Mock Notification to Pandit
        console.log(`[SMS MOCK] Sending request to Pandit ${panditId} for Booking ${bookingId}`);

        res.json(booking);
    } catch (error) {
        console.error('Error assigning pandit:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
