const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const authenticateToken = require('../middleware/auth');
const { Booking } = require('../models');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Order
router.post('/create-order', authenticateToken, async (req, res) => {
    try {
        const { amount, bookingId } = req.body;
        const options = {
            amount: amount * 100, // amount in smallest currency unit
            currency: "INR",
            receipt: `booking_${bookingId}`
        };
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Verify Payment
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

module.exports = router;
