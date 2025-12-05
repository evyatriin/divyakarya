const express = require('express');
const router = express.Router();
const { Ceremony } = require('../models');
const authenticateToken = require('../middleware/auth');
const logger = require('../utils/logger');

// In-memory cache for ceremonies (they rarely change)
let ceremoniesCache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper to clear cache
const clearCache = () => {
    ceremoniesCache = null;
    cacheTimestamp = 0;
};

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

        if (!ceremoniesCache || (now - cacheTimestamp) > CACHE_DURATION) {
            logger.debug('Fetching ceremonies from DB');
            ceremoniesCache = await Ceremony.findAll({ raw: true });
            cacheTimestamp = now;
        }

        const translated = ceremoniesCache.map(c => translateCeremony(c, lang));
        res.json(translated);
    } catch (error) {
        logger.error('Error fetching ceremonies', error);
        res.status(500).json({ error: error.message });
    }
});

// Get ceremony by slug
router.get('/:slug', async (req, res) => {
    try {
        const { lang } = req.query;

        if (ceremoniesCache) {
            const cached = ceremoniesCache.find(c => c.slug === req.params.slug);
            if (cached) {
                return res.json(translateCeremony(cached, lang));
            }
        }

        const ceremony = await Ceremony.findOne({
            where: { slug: req.params.slug },
            raw: true
        });
        if (!ceremony) return res.status(404).json({ message: 'Ceremony not found' });
        res.json(translateCeremony(ceremony, lang));
    } catch (error) {
        logger.error('Error fetching ceremony', error);
        res.status(500).json({ error: error.message });
    }
});

// ==================== ADMIN ENDPOINTS ====================

// Create ceremony (Admin only)
router.post('/', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const { title, slug, description, icon, image, samagri, process, basePrice, videos, reviews } = req.body;

        if (!title || !slug) {
            return res.status(400).json({ error: 'Title and slug are required' });
        }

        // Check for duplicate slug
        const existing = await Ceremony.findOne({ where: { slug } });
        if (existing) {
            return res.status(400).json({ error: 'A ceremony with this slug already exists' });
        }

        const ceremony = await Ceremony.create({
            title,
            slug,
            description: description || '',
            icon: icon || '🕉️',
            image: image || '',
            samagri: samagri || [],
            process: process || [],
            basePrice: basePrice || 2500,
            videos: videos || [],
            reviews: reviews || [],
            translations: {}
        });

        clearCache();
        logger.info('Ceremony created', { slug, title });
        res.status(201).json(ceremony);
    } catch (error) {
        logger.error('Error creating ceremony', error);
        res.status(500).json({ error: error.message });
    }
});

// Update ceremony (Admin only)
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const ceremony = await Ceremony.findByPk(req.params.id);
        if (!ceremony) {
            return res.status(404).json({ error: 'Ceremony not found' });
        }

        const { title, slug, description, icon, image, samagri, process, basePrice, videos, reviews } = req.body;

        // Check for duplicate slug (if changing)
        if (slug && slug !== ceremony.slug) {
            const existing = await Ceremony.findOne({ where: { slug } });
            if (existing) {
                return res.status(400).json({ error: 'A ceremony with this slug already exists' });
            }
        }

        await ceremony.update({
            title: title || ceremony.title,
            slug: slug || ceremony.slug,
            description: description !== undefined ? description : ceremony.description,
            icon: icon || ceremony.icon,
            image: image !== undefined ? image : ceremony.image,
            samagri: samagri || ceremony.samagri,
            process: process || ceremony.process,
            basePrice: basePrice !== undefined ? basePrice : ceremony.basePrice,
            videos: videos || ceremony.videos,
            reviews: reviews || ceremony.reviews
        });

        clearCache();
        logger.info('Ceremony updated', { id: req.params.id });
        res.json(ceremony);
    } catch (error) {
        logger.error('Error updating ceremony', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete ceremony (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const ceremony = await Ceremony.findByPk(req.params.id);
        if (!ceremony) {
            return res.status(404).json({ error: 'Ceremony not found' });
        }

        await ceremony.destroy();
        clearCache();
        logger.info('Ceremony deleted', { id: req.params.id });
        res.json({ message: 'Ceremony deleted successfully' });
    } catch (error) {
        logger.error('Error deleting ceremony', error);
        res.status(500).json({ error: error.message });
    }
});

// Cache invalidation endpoint
router.post('/invalidate-cache', (req, res) => {
    clearCache();
    res.json({ message: 'Cache invalidated' });
});

module.exports = router;
