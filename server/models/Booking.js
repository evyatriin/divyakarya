const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
    ceremonyType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'completed', 'cancelled'),
        defaultValue: 'pending'
    },
    paymentStatus: {
        type: DataTypes.ENUM('pending', 'advance_paid', 'paid', 'failed', 'refunded'),
        defaultValue: 'pending'
    },
    // Legacy field - kept for backward compatibility
    amount: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    // New payment fields
    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: true,
        comment: 'Full ceremony cost'
    },
    advanceAmount: {
        type: DataTypes.FLOAT,
        allowNull: true,
        comment: '25% of total amount'
    },
    advancePaid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Whether 25% advance has been paid'
    },
    remainingAmount: {
        type: DataTypes.FLOAT,
        allowNull: true,
        comment: '75% remaining - paid to pandit after ceremony'
    },
    advancePaymentId: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Razorpay payment ID for advance payment'
    },
    // Refund fields
    refundAmount: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
        comment: 'Amount to be refunded on cancellation'
    },
    refundStatus: {
        type: DataTypes.ENUM('none', 'pending', 'full', 'partial', 'processed'),
        defaultValue: 'none'
    },
    refundId: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Razorpay refund ID'
    },
    // Cancellation fields
    cancelledAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    cancellationReason: {
        type: DataTypes.TEXT,
        allowNull: true
    }
    // NOTE: The following columns were removed because they don't exist in production DB
    // To add them back, first run this SQL in Supabase:
    // ALTER TABLE "Bookings" ADD COLUMN IF NOT EXISTS "city" VARCHAR(255);
    // ALTER TABLE "Bookings" ADD COLUMN IF NOT EXISTS "locationType" VARCHAR(255);
    // ALTER TABLE "Bookings" ADD COLUMN IF NOT EXISTS "tradition" VARCHAR(255);
    // ALTER TABLE "Bookings" ADD COLUMN IF NOT EXISTS "purpose" VARCHAR(255);
    // ALTER TABLE "Bookings" ADD COLUMN IF NOT EXISTS "participants" VARCHAR(255);
    // ALTER TABLE "Bookings" ADD COLUMN IF NOT EXISTS "havanOption" VARCHAR(255);
    // ALTER TABLE "Bookings" ADD COLUMN IF NOT EXISTS "samagriOption" VARCHAR(255);
    // ALTER TABLE "Bookings" ADD COLUMN IF NOT EXISTS "preferredLanguage" VARCHAR(255);
    // ALTER TABLE "Bookings" ADD COLUMN IF NOT EXISTS "customerName" VARCHAR(255);
    // ALTER TABLE "Bookings" ADD COLUMN IF NOT EXISTS "customerEmail" VARCHAR(255);
    // ALTER TABLE "Bookings" ADD COLUMN IF NOT EXISTS "customerPhone" VARCHAR(255);
    // ALTER TABLE "Bookings" ADD COLUMN IF NOT EXISTS "notes" TEXT;
});

module.exports = Booking;
