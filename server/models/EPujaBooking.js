const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EPujaBooking = sequelize.define('EPujaBooking', {
    // Person information
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gotra: {
        type: DataTypes.STRING,
        allowNull: true
    },

    // Birth Details
    dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    placeOfBirth: {
        type: DataTypes.STRING,
        allowNull: true
    },

    // Contact
    mobile: {
        type: DataTypes.STRING,
        allowNull: false
    },
    whatsapp: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },

    // Location
    city: {
        type: DataTypes.STRING,
        allowNull: true
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true
    },

    // Puja Details
    pujaName: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Name of the e-puja being booked'
    },
    pujaDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'Scheduled date for the puja'
    },
    pujaTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    preferredLanguage: {
        type: DataTypes.STRING,
        defaultValue: 'Hindi'
    },

    // Family members for sankalp
    familyMembersCount: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    familyMembers: {
        type: DataTypes.JSON,
        defaultValue: [],
        comment: 'Array of {name, relation}'
    },

    // Intentions/wishes
    intentions: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'What the devotee wishes to pray for'
    },

    // Shipping for prasad
    wantsPrasad: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    shippingAddress: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    shippingPincode: {
        type: DataTypes.STRING,
        allowNull: true
    },

    // Payment
    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    advanceAmount: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    advancePaid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    paymentId: {
        type: DataTypes.STRING,
        allowNull: true
    },

    // Status
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'scheduled', 'completed', 'cancelled'),
        defaultValue: 'pending'
    },

    // Delivery
    videoLink: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Link to recorded puja video'
    },
    certificateLink: {
        type: DataTypes.STRING,
        allowNull: true
    },
    prasadTrackingNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },

    // Notes
    adminNotes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    customerNotes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = EPujaBooking;
