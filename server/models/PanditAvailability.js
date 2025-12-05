const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PanditAvailability = sequelize.define('PanditAvailability', {
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Date of availability'
    },
    startTime: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '09:00',
        comment: 'Start time in HH:MM format'
    },
    endTime: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '18:00',
        comment: 'End time in HH:MM format'
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'False if slot is booked or blocked'
    },
    slotType: {
        type: DataTypes.ENUM('available', 'booked', 'blocked'),
        defaultValue: 'available',
        comment: 'Type of slot: available for booking, booked for ceremony, or manually blocked'
    },
    notes: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Optional notes for the slot'
    }
});

module.exports = PanditAvailability;
