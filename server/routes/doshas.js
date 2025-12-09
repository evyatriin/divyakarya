const express = require('express');
const router = express.Router();
const { Dosha } = require('../models');
const authenticateToken = require('../middleware/auth');

// Get all active doshas (public)
router.get('/', async (req, res) => {
    try {
        const { lang } = req.query;
        const doshas = await Dosha.findAll({
            where: { isActive: true },
            order: [['displayOrder', 'ASC'], ['createdAt', 'ASC']]
        });

        // Apply translations if language specified
        const result = doshas.map(d => {
            const dosha = d.toJSON();
            if (lang && lang !== 'en' && dosha.translations && dosha.translations[lang]) {
                return { ...dosha, ...dosha.translations[lang] };
            }
            return dosha;
        });

        res.json(result);
    } catch (error) {
        console.error('Error fetching doshas:', error);
        res.status(500).json({ error: error.message });
    }
});

// Admin: Get all doshas (including inactive) - MUST be before /:slug
router.get('/admin/all', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin only' });
        }
        const doshas = await Dosha.findAll({
            order: [['displayOrder', 'ASC'], ['createdAt', 'ASC']]
        });
        res.json(doshas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single dosha by slug (public)
router.get('/:slug', async (req, res) => {
    try {
        const dosha = await Dosha.findOne({
            where: { slug: req.params.slug, isActive: true }
        });
        if (!dosha) {
            return res.status(404).json({ error: 'Dosha not found' });
        }
        res.json(dosha);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin: Create dosha
router.post('/', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin only' });
        }
        const dosha = await Dosha.create(req.body);
        res.status(201).json(dosha);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin: Update dosha
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin only' });
        }
        const dosha = await Dosha.findByPk(req.params.id);
        if (!dosha) {
            return res.status(404).json({ error: 'Dosha not found' });
        }
        await dosha.update(req.body);
        res.json(dosha);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin: Delete dosha
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin only' });
        }
        const dosha = await Dosha.findByPk(req.params.id);
        if (!dosha) {
            return res.status(404).json({ error: 'Dosha not found' });
        }
        await dosha.destroy();
        res.json({ success: true, message: 'Dosha deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
