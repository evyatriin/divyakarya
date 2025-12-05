const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const authenticateToken = require('../middleware/auth');
const { Booking } = require('../models');
const logger = require('../utils/logger');
const { createOrderValidation, verifyPaymentValidation, idParamValidation } = require('../middleware/validators');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Order for Advance Payment (25%)
router.post('/create-order', authenticateToken, async (req, res) => {
    try {
        const { bookingId, paymentType } = req.body;

        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Determine amount based on payment type
        let amount;
        if (paymentType === 'advance') {
            amount = booking.advanceAmount;
        } else if (paymentType === 'remaining') {
            amount = booking.remainingAmount;
        } else {
            // Default to advance amount for backward compatibility
            amount = req.body.amount || booking.advanceAmount;
        }

        const options = {
            amount: Math.round(amount * 100), // amount in paise
            currency: "INR",
            receipt: `booking_${bookingId}_${paymentType || 'payment'}`,
            notes: {
                bookingId: bookingId.toString(),
                paymentType: paymentType || 'general',
                ceremonyType: booking.ceremonyType
            }
        };

        const order = await razorpay.orders.create(options);

        res.json({
            ...order,
            bookingDetails: {
                totalAmount: booking.totalAmount,
                advanceAmount: booking.advanceAmount,
                remainingAmount: booking.remainingAmount,
                paymentType
            }
        });
    } catch (error) {
        logger.error('Error creating order', error);
        res.status(500).json({ error: error.message });
    }
});

// Verify Advance Payment
router.post('/verify-advance', authenticateToken, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            const booking = await Booking.findByPk(bookingId);
            if (!booking) {
                return res.status(404).json({ error: 'Booking not found' });
            }

            // Update booking with advance payment details
            booking.advancePaid = true;
            booking.advancePaymentId = razorpay_payment_id;
            booking.paymentStatus = 'advance_paid';
            await booking.save();

            res.json({
                status: 'success',
                message: 'Advance payment verified successfully',
                booking: {
                    id: booking.id,
                    advancePaid: booking.advancePaid,
                    advanceAmount: booking.advanceAmount,
                    remainingAmount: booking.remainingAmount,
                    paymentStatus: booking.paymentStatus
                }
            });
        } else {
            res.status(400).json({ status: 'failure', message: 'Invalid signature' });
        }
    } catch (error) {
        logger.error('Error verifying advance', error);
        res.status(500).json({ error: error.message });
    }
});

// Legacy: Verify Full Payment (kept for backward compatibility)
router.post('/verify', authenticateToken, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            const booking = await Booking.findByPk(bookingId);
            booking.paymentStatus = 'paid';
            await booking.save();
            res.json({ status: 'success' });
        } else {
            res.status(400).json({ status: 'failure' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Process Refund via Razorpay
router.post('/process-refund', authenticateToken, async (req, res) => {
    try {
        const { bookingId } = req.body;

        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Check if refund is applicable
        if (booking.refundStatus === 'none' || booking.refundStatus === 'processed') {
            return res.status(400).json({
                error: booking.refundStatus === 'none'
                    ? 'No refund applicable for this booking'
                    : 'Refund already processed'
            });
        }

        if (!booking.advancePaymentId) {
            return res.status(400).json({ error: 'No payment ID found for refund' });
        }

        // Create refund via Razorpay
        const refund = await razorpay.payments.refund(booking.advancePaymentId, {
            amount: Math.round(booking.refundAmount * 100), // amount in paise
            speed: 'normal',
            notes: {
                bookingId: bookingId.toString(),
                refundType: booking.refundStatus,
                reason: booking.cancellationReason || 'User requested cancellation'
            }
        });

        // Update booking with refund details
        booking.refundId = refund.id;
        booking.refundStatus = 'processed';
        booking.paymentStatus = 'refunded';
        await booking.save();

        res.json({
            status: 'success',
            message: `Refund of ₹${booking.refundAmount} initiated successfully`,
            refund: {
                id: refund.id,
                amount: booking.refundAmount,
                status: refund.status
            }
        });
    } catch (error) {
        logger.error('Error processing refund', error);

        // Handle Razorpay-specific errors
        if (error.error && error.error.description) {
            return res.status(400).json({
                error: error.error.description,
                razorpayError: true
            });
        }

        res.status(500).json({ error: error.message });
    }
});

// Get Refund Status
router.get('/refund-status/:bookingId', authenticateToken, async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        let razorpayRefundStatus = null;
        if (booking.refundId) {
            try {
                const refund = await razorpay.refunds.fetch(booking.refundId);
                razorpayRefundStatus = refund.status;
            } catch (e) {
                logger.error('Error fetching refund from Razorpay', e);
            }
        }

        res.json({
            bookingId: booking.id,
            refundAmount: booking.refundAmount,
            refundStatus: booking.refundStatus,
            refundId: booking.refundId,
            razorpayStatus: razorpayRefundStatus
        });
    } catch (error) {
        logger.error('Error getting refund status', error);
        res.status(500).json({ error: error.message });
    }
});

// Report Payment Failure
router.post('/failure', authenticateToken, async (req, res) => {
    try {
        const { bookingId, errorDescription, razorpayOrderId } = req.body;

        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Only update if not already paid
        if (booking.paymentStatus !== 'paid' && booking.paymentStatus !== 'advance_paid') {
            booking.paymentStatus = 'failed';
            logger.warn('Payment failed', { bookingId, errorDescription });
            await booking.save();
        }

        res.json({ status: 'recorded' });
    } catch (error) {
        logger.error('Error recording payment failure', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

