const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Dosha = sequelize.define('Dosha', {
    // Basic Info
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

    // Card Display Fields
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'One-line outcome-oriented description'
    },
    duration: {
        type: DataTypes.STRING,
        defaultValue: '2-3 hours'
    },
    mode: {
        type: DataTypes.STRING,
        defaultValue: 'Temple e-puja / Virtual homam / Home visit optional',
        comment: 'Mode of puja delivery'
    },
    recommendedWhen: {
        type: DataTypes.JSON,
        defaultValue: [],
        comment: 'Array of 2-4 bullets mapping typical problems to this dosha'
    },
    whoPerforms: {
        type: DataTypes.STRING,
        defaultValue: 'Senior Vedic pandits with 10+ years experience',
        comment: 'Description of who performs the puja'
    },
    locationOptions: {
        type: DataTypes.JSON,
        defaultValue: [],
        comment: 'Array of temples/kshetras where puja can be performed'
    },
    inclusions: {
        type: DataTypes.JSON,
        defaultValue: [],
        comment: 'Array of what is included in the puja'
    },

    // Pricing - Per Dosha Configurable
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 2100,
        comment: 'Base price (Basic tier)'
    },
    pricingTiers: {
        type: DataTypes.JSON,
        defaultValue: {
            basic: { price: 2100, label: 'Basic', features: ['Single priest', 'Standard puja', 'Digital video'] },
            standard: { price: 3500, label: 'Standard', features: ['2 priests', 'Extended japa', 'HD video', 'E-certificate'] },
            premium: { price: 5100, label: 'Premium', features: ['3+ priests', 'Full homam', '4K video', 'Prasad courier', 'Family sankalp'] }
        },
        comment: 'Pricing tiers configurable per dosha'
    },
    availableDates: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Best tithis/dates for this puja'
    },

    // Detail Page Sections
    whatIsDosha: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: '3-4 lines about the dosha and its typical effects'
    },
    whyPuja: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Why this specific ritual is traditionally used as remedy'
    },
    whatWillBeDone: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'High-level vidhi (Ganapati puja, sankalp, main homam/puja, aarti, dana)'
    },
    whatYouReceive: {
        type: DataTypes.JSON,
        defaultValue: [],
        comment: 'Video link, certificate, prasad details, japa count'
    },
    importantDays: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Key tithi/nakshatra/weekday recommendations'
    },
    samagri: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Who arranges samagri, what user must arrange if home visit'
    },
    preparation: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Fasting, dress code, mental state recommendations'
    },
    faqs: {
        type: DataTypes.JSON,
        defaultValue: [],
        comment: 'Array of {question, answer} objects'
    },

    // Legacy fields
    details: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    remedies: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    participantLimit: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        comment: 'Maximum number of participants allowed'
    },
    translations: {
        type: DataTypes.JSON,
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
