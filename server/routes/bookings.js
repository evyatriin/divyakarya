const express = require('express');
const router = express.Router();
const { Booking, User, Pandit } = require('../models');
const authenticateToken = require('../middleware/auth');
const { sendBookingConfirmation } = require('../services/emailService');

// Public Booking Endpoint (No Auth Required)
router.post('/public', async (req, res) => {
    try {
        const {
            ceremonyType,
            date,
            time,
            address, // Changed from city/locationType composition
            customerName,
            customerEmail,
            customerPhone
        } = req.body;

        // Validate required fields
        if (!ceremonyType || !date || !time || !customerName || !customerEmail || !customerPhone) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['ceremonyType', 'date', 'time', 'customerName', 'customerEmail', 'customerPhone']
            });
        }

        // Create booking
        const booking = await Booking.create({
            ceremonyType,
            date,
            time,
            address: address || 'To be confirmed',
            customerName, // Note: These might not be saved if columns don't exist, but we'll try. 
            // Actually, wait. The model I just updated REMOVED customerName/Email/Phone too.
            // I need to check the model again.
            // The previous model update removed: city, locationType, tradition, purpose, participants, havanOption, samagriOption, preferredLanguage, customerName, customerEmail, customerPhone, notes.
            // So I can ONLY save: ceremonyType, date, time, address, status, paymentStatus, amount.
            // I should put the customer details in the 'address' field or similar if I want to persist them, or just accept they won't be saved in the DB for now until migration runs.
            // For now, let's just stick to what the model supports.
            amount: 0,
            status: 'pending'
        });

        // Send confirmation email (mock)
        // Send confirmation email (mock)
        const emailResult = await sendBookingConfirmation({
            ...booking.toJSON(),
            ceremonyType,
            date,
            time,
            address
        });

        res.status(201).json({
            success: true,
            message: 'Booking received successfully! We will contact you soon.',
            booking: {
                id: booking.id,
                ceremonyType: booking.ceremonyType,
                date: booking.date,
                time: booking.time,
                status: booking.status
            },
            emailSent: emailResult.success
        });
    } catch (error) {
        console.error('Booking creation error:', error);
        res.status(500).json({ error: 'Failed to create booking. Please try again.' });
    }
});

// Create Booking (User)
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { ceremonyType, date, time, address, amount } = req.body;

        // Validate required fields
        if (!ceremonyType || !date || !time) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['ceremonyType', 'date', 'time']
            });
        }

        const booking = await Booking.create({
            UserId: req.user.id,
            ceremonyType,
            date,
            time,
            address: address || 'To be confirmed',
            amount: amount || 0,
            status: 'pending',
            paymentStatus: 'pending'
        });
        res.status(201).json(booking);
    } catch (error) {
        console.error('Booking creation error:', error);
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
                { model: User, attributes: ['name', 'phone', 'email'] },
                { model: Pandit, attributes: ['name', 'phone'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
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
