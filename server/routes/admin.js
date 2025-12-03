const express = require('express');
const router = express.Router();
const { Booking, Pandit } = require('../models');
const authenticateToken = require('../middleware/auth');

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
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
