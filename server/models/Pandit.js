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
        type: DataTypes.STRING, // Comma separated values or JSON
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
    }
});

module.exports = Pandit;
