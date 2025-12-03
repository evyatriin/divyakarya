const express = require('express');
const router = express.Router();
const { Ceremony } = require('../models');

// Helper to translate ceremony
const translateCeremony = (ceremony, lang) => {
    if (!lang || lang === 'en') return ceremony;
    const translation = ceremony.translations?.[lang];
    if (!translation) return ceremony;

    return {
        ...ceremony.toJSON(),
        title: translation.title || ceremony.title,
        description: translation.description || ceremony.description,
        samagri: translation.samagri || ceremony.samagri,
        process: translation.process || ceremony.process
    };
};

// Get all ceremonies
router.get('/', async (req, res) => {
    try {
        const { lang } = req.query;
        const ceremonies = await Ceremony.findAll();
        const translated = ceremonies.map(c => translateCeremony(c, lang));
        res.json(translated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get ceremony by slug
router.get('/:slug', async (req, res) => {
    try {
        const { lang } = req.query;
        const ceremony = await Ceremony.findOne({ where: { slug: req.params.slug } });
        if (!ceremony) return res.status(404).json({ message: 'Ceremony not found' });
        res.json(translateCeremony(ceremony, lang));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
