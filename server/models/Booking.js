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
        type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'completed'),
        defaultValue: 'pending'
    },
    paymentStatus: {
        type: DataTypes.ENUM('pending', 'paid', 'failed'),
        defaultValue: 'pending'
    },
    amount: {
        type: DataTypes.FLOAT,
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
