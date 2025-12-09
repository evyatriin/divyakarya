const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EPuja = sequelize.define('EPuja', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    icon: {
        type: DataTypes.STRING,
        defaultValue: '🛕'
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'URL to image uploaded by admin'
    },
    tag: {
        type: DataTypes.STRING, // Popular, New, Subscription, Seasonal
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    features: {
        type: DataTypes.JSON, // Array of feature strings
        defaultValue: []
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 1100
    },
    priceType: {
        type: DataTypes.ENUM('fixed', 'starting', 'monthly'),
        defaultValue: 'fixed'
    },
    translations: {
        type: DataTypes.JSON, // { te: { name, description }, ta: {...} }
        defaultValue: {}
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    displayOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

module.exports = EPuja;
