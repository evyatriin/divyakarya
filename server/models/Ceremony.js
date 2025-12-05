const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ceremony = sequelize.define('Ceremony', {
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    samagri: {
        type: DataTypes.JSON, // Storing array as JSON
        allowNull: false
    },
    process: {
        type: DataTypes.JSON, // Storing array as JSON
        allowNull: false
    },
    icon: {
        type: DataTypes.STRING, // Emoji or icon name
        defaultValue: '🕉️'
    },
    translations: {
        type: DataTypes.JSON, // { te: { title: '...', ... }, ta: { ... } }
        defaultValue: {}
    },
    videos: {
        type: DataTypes.JSON, // Array of video URLs
        defaultValue: []
    },
    reviews: {
        type: DataTypes.JSON, // Array of { user, rating, comment }
        defaultValue: []
    },
    basePrice: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 2500,
        comment: 'Base price for ceremony in INR'
    }
});

module.exports = Ceremony;
