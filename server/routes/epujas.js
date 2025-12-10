const express = require('express');
const router = express.Router();
const { EPuja } = require('../models');
const authenticateToken = require('../middleware/auth');

// Get all active e-pujas (public)
router.get('/', async (req, res) => {
    try {
        const { lang } = req.query;
        let epujas;

        try {
            // Try with displayOrder first
            epujas = await EPuja.findAll({
                where: { isActive: true },
                order: [['displayOrder', 'ASC'], ['createdAt', 'ASC']]
            });
        } catch (orderError) {
            console.warn('displayOrder column might not exist, falling back:', orderError.message);
            // Fallback to just createdAt if displayOrder doesn't exist
            epujas = await EPuja.findAll({
                where: { isActive: true },
                order: [['createdAt', 'ASC']]
            });
        }

        // Apply translations if language specified
        const result = epujas.map(e => {
            const epuja = e.toJSON();
            if (lang && lang !== 'en' && epuja.translations && epuja.translations[lang]) {
                return { ...epuja, ...epuja.translations[lang] };
            }
            return epuja;
        });

        res.json(result);
    } catch (error) {
        console.error('Error fetching e-pujas:', error);
        res.status(500).json({ error: 'Failed to fetch e-pujas', details: error.message });
    }
});

// Admin: Get all e-pujas (including inactive) - MUST be before /:slug
router.get('/admin/all', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin only' });
        }
        const epujas = await EPuja.findAll({
            order: [['displayOrder', 'ASC'], ['createdAt', 'ASC']]
        });
        res.json(epujas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single e-puja by slug (public)
router.get('/:slug', async (req, res) => {
    try {
        const epuja = await EPuja.findOne({
            where: { slug: req.params.slug, isActive: true }
        });
        if (!epuja) {
            return res.status(404).json({ error: 'e-Puja not found' });
        }
        res.json(epuja);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin: Create e-puja
router.post('/', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin only' });
        }
        const epuja = await EPuja.create(req.body);
        res.status(201).json(epuja);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin: Update e-puja
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin only' });
        }
        const epuja = await EPuja.findByPk(req.params.id);
        if (!epuja) {
            return res.status(404).json({ error: 'e-Puja not found' });
        }
        await epuja.update(req.body);
        res.json(epuja);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin: Delete e-puja
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin only' });
        }
        const epuja = await EPuja.findByPk(req.params.id);
        if (!epuja) {
            return res.status(404).json({ error: 'e-Puja not found' });
        }
        await epuja.destroy();
        res.json({ success: true, message: 'e-Puja deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
