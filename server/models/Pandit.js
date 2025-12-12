const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pandit = sequelize.define('Pandit', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    specialization: {
        type: DataTypes.STRING,
        allowNull: false
    },
    experience: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    isOnline: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    // Service types this pandit can perform
    serviceTypes: {
        type: DataTypes.JSON,
        defaultValue: ['ceremonies'],
        comment: 'Array of service types: ceremonies, doshas, epujas'
    },
    // New fields
    photo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    languages: {
        type: DataTypes.JSON,
        defaultValue: ['Hindi', 'English']
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    totalReviews: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    emailVerificationToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    passwordResetToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    passwordResetExpires: {
        type: DataTypes.DATE,
        allowNull: true
    }
});

module.exports = Pandit;
