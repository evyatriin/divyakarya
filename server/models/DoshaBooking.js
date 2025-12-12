const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DoshaBooking = sequelize.define('DoshaBooking', {
    // Person for whom puja is done
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Full name of person for whom puja is done'
    },
    gotra: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Family lineage (optional but valued)'
    },
    fatherName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    motherName: {
        type: DataTypes.STRING,
        allowNull: true
    },

    // Birth Details (for dosha validation and sankalp)
    dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    timeOfBirth: {
        type: DataTypes.STRING,
        allowNull: true
    },
    placeOfBirth: {
        type: DataTypes.STRING,
        allowNull: true
    },

    // Location
    currentCity: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'For time zone and prasad shipping'
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true
    },

    // Concern
    primaryConcern: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'marriage, health, career, finances, foreign travel, children, etc.'
    },
    primaryConcernDetails: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Free-text description of concern'
    },

    // Family Members for Sankalp
    familyMembersCount: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        comment: 'Number of family members to include in sankalp'
    },
    familyMembers: {
        type: DataTypes.JSON,
        defaultValue: [],
        comment: 'Array of {name, relation} objects'
    },

    // Preferences
    preferredLanguage: {
        type: DataTypes.STRING,
        defaultValue: 'Hindi',
        comment: 'Hindi, English, Telugu, Tamil, Sanskrit, etc.'
    },
    mode: {
        type: DataTypes.ENUM('e-puja-video', 'live-zoom', 'home-visit'),
        defaultValue: 'e-puja-video',
        comment: 'Only e-puja video / Live Zoom + recording / Home visit'
    },
    preferredDateStart: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    preferredDateEnd: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    preferredTimeSlot: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Morning, Afternoon, Evening, or specific time'
    },
    earliestAuspicious: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Earliest auspicious slot as per pandit'
    },

    // Contact Details
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

    // Shipping for Prasad
    shippingAddress: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Address for prasad delivery if included'
    },
    shippingPincode: {
        type: DataTypes.STRING,
        allowNull: true
    },

    // Nice-to-have fields
    kundliUpload: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'URL to uploaded kundli PDF'
    },
    doshaConfirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Dosha already confirmed by my astrologer'
    },
    wantsPanditCall: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Want 10-min call with pandit before puja'
    },
    consent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Consent to store data and share name/gotra with temple for sankalp'
    },

    // Pricing
    pricingTier: {
        type: DataTypes.ENUM('basic', 'standard', 'premium'),
        defaultValue: 'basic'
    },
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

    // Status
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'scheduled', 'completed', 'cancelled'),
        defaultValue: 'pending'
    },
    scheduledDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    scheduledTime: {
        type: DataTypes.STRING,
        allowNull: true
    },

    // Delivery
    videoLink: {
        type: DataTypes.STRING,
        allowNull: true
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

module.exports = DoshaBooking;
