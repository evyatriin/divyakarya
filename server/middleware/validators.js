const { body, param, query, validationResult } = require('express-validator');

// Validation error handler middleware
const logger = require('../utils/logger');

// Validation error handler middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorDetails = errors.array().map(err => ({
            field: err.path,
            message: err.msg
        }));
        logger.warn('Validation failed', { path: req.path, errors: errorDetails });
        return res.status(400).json({
            error: 'Validation failed',
            details: errorDetails
        });
    }
    next();
};

// Auth validations
const loginValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate
];

const userRegistrationValidation = [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').trim().isLength({ min: 10, max: 15 }).withMessage('Phone must be 10-15 digits'),
    validate
];

const panditRegistrationValidation = [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').trim().isLength({ min: 10, max: 15 }).withMessage('Phone must be 10-15 digits'),
    body('specialization').trim().isLength({ min: 2 }).withMessage('Specialization is required'),
    body('experience').isInt({ min: 0, max: 100 }).withMessage('Experience must be a valid number'),
    validate
];

// Booking validations
const createBookingValidation = [
    body('ceremonyType').trim().notEmpty().withMessage('Ceremony type is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('time').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Valid time (HH:MM) is required'),
    body('address').trim().isLength({ min: 10 }).withMessage('Address must be at least 10 characters'),
    validate
];

const cancelBookingValidation = [
    param('id').isInt({ min: 1 }).withMessage('Valid booking ID is required'),
    body('reason').optional().trim().isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters'),
    validate
];

// Payment validations
const createOrderValidation = [
    body('bookingId').isInt({ min: 1 }).withMessage('Valid booking ID is required'),
    body('paymentType').optional().isIn(['advance', 'remaining', 'full']).withMessage('Invalid payment type'),
    validate
];

const verifyPaymentValidation = [
    body('razorpay_order_id').notEmpty().withMessage('Order ID is required'),
    body('razorpay_payment_id').notEmpty().withMessage('Payment ID is required'),
    body('razorpay_signature').notEmpty().withMessage('Signature is required'),
    body('bookingId').isInt({ min: 1 }).withMessage('Valid booking ID is required'),
    validate
];

// Availability validations
const addAvailabilityValidation = [
    body('date').isISO8601().withMessage('Valid date is required'),
    body('startTime').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Valid start time required'),
    body('endTime').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Valid end time required'),
    validate
];

// Admin validations
const assignPanditValidation = [
    body('bookingId').isInt({ min: 1 }).withMessage('Valid booking ID is required'),
    body('panditId').isInt({ min: 1 }).withMessage('Valid pandit ID is required'),
    body('slotId').optional().isInt({ min: 1 }).withMessage('Invalid slot ID'),
    validate
];

// ID param validation
const idParamValidation = [
    param('id').isInt({ min: 1 }).withMessage('Valid ID is required'),
    validate
];

module.exports = {
    validate,
    loginValidation,
    userRegistrationValidation,
    panditRegistrationValidation,
    createBookingValidation,
    cancelBookingValidation,
    createOrderValidation,
    verifyPaymentValidation,
    addAvailabilityValidation,
    assignPanditValidation,
    idParamValidation
};
