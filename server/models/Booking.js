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
    },
    // Modern Booking UI fields
    city: {
        type: DataTypes.STRING,
        allowNull: true
    },
    locationType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tradition: {
        type: DataTypes.STRING,
        allowNull: true
    },
    purpose: {
        type: DataTypes.STRING,
        allowNull: true
    },
    participants: {
        type: DataTypes.STRING,
        allowNull: true
    },
    havanOption: {
        type: DataTypes.STRING,
        allowNull: true
    },
    samagriOption: {
        type: DataTypes.STRING,
        allowNull: true
    },
    preferredLanguage: {
        type: DataTypes.STRING,
        allowNull: true
    },
    customerName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    customerEmail: {
        type: DataTypes.STRING,
        allowNull: true
    },
    customerPhone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = Booking;
