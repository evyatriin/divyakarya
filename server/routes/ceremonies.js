const express = require('express');
const router = express.Router();
const { Ceremony } = require('../models');

// In-memory cache for ceremonies (they rarely change)
let ceremoniesCache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper to translate ceremony
const translateCeremony = (ceremony, lang) => {
    if (!lang || lang === 'en') return ceremony;
    const ceremonyData = ceremony.toJSON ? ceremony.toJSON() : ceremony;
    const translation = ceremonyData.translations?.[lang];
    if (!translation) return ceremonyData;

    return {
        ...ceremonyData,
        title: translation.title || ceremonyData.title,
        description: translation.description || ceremonyData.description,
        samagri: translation.samagri || ceremonyData.samagri,
        process: translation.process || ceremonyData.process
    };
};

// Get all ceremonies (with caching)
router.get('/', async (req, res) => {
    try {
        const { lang } = req.query;
        const now = Date.now();

        // Check if cache is valid
        if (!ceremoniesCache || (now - cacheTimestamp) > CACHE_DURATION) {
            console.log('Cache miss - fetching ceremonies from DB');
            ceremoniesCache = await Ceremony.findAll({
                attributes: ['id', 'slug', 'title', 'description', 'icon', 'price', 'duration', 'samagri', 'process', 'translations'],
                raw: true // Faster - returns plain objects
            });
            cacheTimestamp = now;
        } else {
            console.log('Cache hit - using cached ceremonies');
        }

        const translated = ceremoniesCache.map(c => translateCeremony(c, lang));
        res.json(translated);
    } catch (error) {
        console.error('Error fetching ceremonies:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get ceremony by slug
router.get('/:slug', async (req, res) => {
    try {
        const { lang } = req.query;

        // Try to get from cache first
        if (ceremoniesCache) {
            const cached = ceremoniesCache.find(c => c.slug === req.params.slug);
            if (cached) {
                console.log('Cache hit for slug:', req.params.slug);
                return res.json(translateCeremony(cached, lang));
            }
        }

        // Fallback to database
        const ceremony = await Ceremony.findOne({
            where: { slug: req.params.slug },
            raw: true
        });
        if (!ceremony) return res.status(404).json({ message: 'Ceremony not found' });
        res.json(translateCeremony(ceremony, lang));
    } catch (error) {
        console.error('Error fetching ceremony:', error);
        res.status(500).json({ error: error.message });
    }
});

// Cache invalidation endpoint (for admin use)
router.post('/invalidate-cache', (req, res) => {
    ceremoniesCache = null;
    cacheTimestamp = 0;
    res.json({ message: 'Cache invalidated' });
});

module.exports = router;
