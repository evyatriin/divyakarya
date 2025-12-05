const express = require('express');
const router = express.Router();
const { Booking, User, Pandit, Ceremony, PanditAvailability } = require('../models');
const authenticateToken = require('../middleware/auth');
const { sendBookingConfirmation } = require('../services/emailService');

// Helper: Calculate payment amounts
const calculatePaymentAmounts = (totalAmount) => {
    const advanceAmount = Math.round(totalAmount * 0.25 * 100) / 100; // 25%
    const remainingAmount = Math.round((totalAmount - advanceAmount) * 100) / 100; // 75%
    return { advanceAmount, remainingAmount };
};

// Helper: Get ceremony price
const getCeremonyPrice = async (ceremonyType) => {
    const ceremony = await Ceremony.findOne({
        where: { title: ceremonyType }
    });
    return ceremony?.basePrice || 2500; // Default price if not found
};

// Public Booking Endpoint (No Auth Required) - Creates pending booking for admin to handle
router.post('/public', async (req, res) => {
    try {
        const {
            ceremonyType,
            date,
            time,
            address,
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

        // Get ceremony price
        const totalAmount = await getCeremonyPrice(ceremonyType);
        const { advanceAmount, remainingAmount } = calculatePaymentAmounts(totalAmount);

        // Create booking (public bookings don't have advance payment - admin will handle)
        const booking = await Booking.create({
            ceremonyType,
            date,
            time,
            address: address || 'To be confirmed',
            amount: totalAmount,
            totalAmount,
            advanceAmount,
            remainingAmount,
            advancePaid: false,
            status: 'pending',
            paymentStatus: 'pending'
        });

        // Send confirmation email
        const emailResult = await sendBookingConfirmation({
            ...booking.toJSON(),
            customerName,
            customerEmail,
            ceremonyType,
            date,
            time,
            address
        });

        res.status(201).json({
            success: true,
            message: 'Booking received successfully! We will contact you for advance payment.',
            booking: {
                id: booking.id,
                ceremonyType: booking.ceremonyType,
                date: booking.date,
                time: booking.time,
                totalAmount: booking.totalAmount,
                advanceAmount: booking.advanceAmount,
                remainingAmount: booking.remainingAmount,
                status: booking.status
            },
            emailSent: emailResult.success
        });
    } catch (error) {
        console.error('Booking creation error:', error);
        res.status(500).json({ error: 'Failed to create booking. Please try again.' });
    }
});

// Create Booking (Authenticated User) - Requires 25% advance payment
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { ceremonyType, date, time, address, totalAmount: providedAmount } = req.body;

        // Validate required fields
        if (!ceremonyType || !date || !time) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['ceremonyType', 'date', 'time']
            });
        }

        // Get ceremony price (use provided amount if available, otherwise lookup)
        const totalAmount = providedAmount || await getCeremonyPrice(ceremonyType);
        const { advanceAmount, remainingAmount } = calculatePaymentAmounts(totalAmount);

        // Create booking with payment details
        const booking = await Booking.create({
            UserId: req.user.id,
            ceremonyType,
            date,
            time,
            address: address || 'To be confirmed',
            amount: totalAmount,
            totalAmount,
            advanceAmount,
            remainingAmount,
            advancePaid: false,
            status: 'pending',
            paymentStatus: 'pending'
        });

        res.status(201).json({
            ...booking.toJSON(),
            message: 'Booking created. Please complete 25% advance payment.',
            paymentRequired: advanceAmount
        });
    } catch (error) {
        console.error('Booking creation error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Confirm advance payment for a booking
router.put('/:id/confirm-advance', authenticateToken, async (req, res) => {
    try {
        const { paymentId } = req.body;
        const booking = await Booking.findByPk(req.params.id);

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Verify user owns this booking
        if (req.user.role === 'user' && booking.UserId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        booking.advancePaid = true;
        booking.advancePaymentId = paymentId;
        booking.paymentStatus = 'advance_paid';
        await booking.save();

        res.json({
            success: true,
            message: 'Advance payment confirmed',
            booking
        });
    } catch (error) {
        console.error('Error confirming advance:', error);
        res.status(500).json({ error: error.message });
    }
});

// Cancel booking with refund calculation
router.put('/:id/cancel', authenticateToken, async (req, res) => {
    try {
        const { reason } = req.body;
        const booking = await Booking.findByPk(req.params.id);

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Verify user owns this booking or is admin
        if (req.user.role === 'user' && booking.UserId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to cancel this booking' });
        }

        // Check if already cancelled
        if (booking.status === 'cancelled') {
            return res.status(400).json({ error: 'Booking is already cancelled' });
        }

        // Check if completed
        if (booking.status === 'completed') {
            return res.status(400).json({ error: 'Cannot cancel a completed booking' });
        }

        // Calculate refund based on time until ceremony
        const ceremonyDate = new Date(`${booking.date}T${booking.time || '00:00'}`);
        const now = new Date();
        const hoursUntilCeremony = (ceremonyDate - now) / (1000 * 60 * 60);

        let refundAmount = 0;
        let refundStatus = 'none';

        if (booking.advancePaid && booking.advanceAmount > 0) {
            if (hoursUntilCeremony >= 24) {
                // Full refund if >= 24 hours before
                refundAmount = booking.advanceAmount;
                refundStatus = 'full';
            } else {
                // Partial refund (50% of advance) if < 24 hours
                refundAmount = Math.round(booking.advanceAmount * 0.5 * 100) / 100;
                refundStatus = 'partial';
            }
        }

        // Update booking
        booking.status = 'cancelled';
        booking.cancelledAt = new Date();
        booking.cancellationReason = reason || 'Cancelled by user';
        booking.refundAmount = refundAmount;
        booking.refundStatus = refundStatus;

        // Free up the pandit's slot if assigned
        if (booking.PanditId) {
            await PanditAvailability.update(
                { isAvailable: true, slotType: 'available', BookingId: null },
                { where: { BookingId: booking.id } }
            );
        }

        await booking.save();

        res.json({
            success: true,
            message: refundStatus === 'full'
                ? `Booking cancelled. Full refund of ₹${refundAmount} will be processed.`
                : refundStatus === 'partial'
                    ? `Booking cancelled. Partial refund of ₹${refundAmount} (50% of advance) will be processed.`
                    : 'Booking cancelled. No refund applicable.',
            booking: {
                id: booking.id,
                status: booking.status,
                refundAmount: booking.refundAmount,
                refundStatus: booking.refundStatus,
                hoursUntilCeremony: Math.round(hoursUntilCeremony)
            }
        });
    } catch (error) {
        console.error('Error cancelling booking:', error);
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

// Get ceremony price (for frontend to show before booking)
router.get('/ceremony-price/:ceremonyType', async (req, res) => {
    try {
        const ceremonyType = decodeURIComponent(req.params.ceremonyType);
        const totalAmount = await getCeremonyPrice(ceremonyType);
        const { advanceAmount, remainingAmount } = calculatePaymentAmounts(totalAmount);

        res.json({
            ceremonyType,
            totalAmount,
            advanceAmount,
            remainingAmount,
            advancePercentage: 25
        });
    } catch (error) {
        console.error('Error getting ceremony price:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update Booking Status (Pandit/Admin)
router.put('/:id/status', authenticateToken, async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByPk(req.params.id);

        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // Logic: Pandit can accept/reject if assigned to them
        if (req.user.role === 'pandit' && booking.PanditId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // If marking as completed, update payment status
        if (status === 'completed' && booking.advancePaid) {
            booking.paymentStatus = 'paid';
        }

        booking.status = status;
        await booking.save();
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

