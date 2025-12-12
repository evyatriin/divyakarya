const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Dosha = sequelize.define('Dosha', {
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
        defaultValue: '🔴'
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'URL to image uploaded by admin'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    remedies: {
        type: DataTypes.JSON, // Array of remedy names
        defaultValue: []
    },
    duration: {
        type: DataTypes.STRING,
        defaultValue: '2-3 hours'
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 2100
    },
    participantLimit: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        comment: 'Maximum number of participants allowed'
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

module.exports = Dosha;
