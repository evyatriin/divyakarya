const express = require('express');
const router = express.Router();
const { Review, Pandit, User, Booking } = require('../models');
const authenticateToken = require('../middleware/auth');
const logger = require('../utils/logger');
const { body, validationResult } = require('express-validator');

// Validation for creating a review
const validateReview = [
    body('panditId').isInt().withMessage('Valid Pandit ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().trim().isLength({ max: 500 }).withMessage('Comment too long'),
    body('ceremonyType').optional().trim(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Create a review
router.post('/', authenticateToken, validateReview, async (req, res) => {
    try {
        if (req.user.role !== 'user') {
            return res.status(403).json({ error: 'Only users can submit reviews' });
        }

        const { panditId, rating, comment, ceremonyType } = req.body;

        // Verify Pandit exists
        const pandit = await Pandit.findByPk(panditId);
        if (!pandit) {
            return res.status(404).json({ error: 'Pandit not found' });
        }

        // Verify user has at least one completed booking with this pandit (optional but recommended for integrity)
        const booking = await Booking.findOne({
            where: {
                UserId: req.user.id,
                PanditId: panditId,
                status: 'completed'
            }
        });

        if (!booking) {
            return res.status(400).json({ error: 'You can only review pandits you have booked and completed a ceremony with.' });
        }

        // Check if already reviewed? (Ideally yes, but without BookingId on Review, we might limit to 1 review per pandit per user?)
        // For now, allowing multiple reviews if they have multiple bookings is hard to track without BookingId.
        // I will limit to one review per user per pandit to keep it simple and safe for now.
        const existingReview = await Review.findOne({
            where: {
                UserId: req.user.id,
                PanditId: panditId
            }
        });

        if (existingReview) {
            return res.status(400).json({ error: 'You have already reviewed this Pandit.' });
        }

        // Create Review
        const review = await Review.create({
            UserId: req.user.id,
            PanditId: panditId,
            rating,
            comment,
            ceremonyType: ceremonyType || booking.ceremonyType
        });

        // Update Pandit's average rating
        const allReviews = await Review.findAll({ where: { PanditId: panditId } });
        const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = totalRating / allReviews.length;

        pandit.rating = parseFloat(avgRating.toFixed(1));
        pandit.totalReviews = allReviews.length;
        await pandit.save();

        logger.info('Review created', { reviewId: review.id, panditId });
        res.status(201).json(review);
    } catch (error) {
        logger.error('Error creating review', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get reviews for a pandit
router.get('/pandit/:id', async (req, res) => {
    try {
        const reviews = await Review.findAll({
            where: { PanditId: req.params.id },
            include: [{
                model: User,
                attributes: ['name']
            }],
            order: [['createdAt', 'DESC']]
        });
        res.json(reviews);
    } catch (error) {
        logger.error('Error fetching reviews', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
