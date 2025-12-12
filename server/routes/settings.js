const express = require('express');
const router = express.Router();
const { SiteSettings } = require('../models');
const authenticateToken = require('../middleware/auth');

// Get all settings (public - for frontend to use)
router.get('/', async (req, res) => {
    try {
        const settings = await SiteSettings.findAll();
        // Convert to key-value object
        const result = {};
        settings.forEach(s => {
            let value = s.value;
            if (s.type === 'json') {
                try { value = JSON.parse(s.value); } catch (e) { value = s.value; }
            } else if (s.type === 'number') {
                value = Number(s.value);
            } else if (s.type === 'boolean') {
                value = s.value === 'true';
            }
            result[s.key] = value;
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// Get single setting by key (public)
router.get('/:key', async (req, res) => {
    try {
        const setting = await SiteSettings.findByPk(req.params.key);
        if (!setting) {
            return res.status(404).json({ error: 'Setting not found' });
        }
        let value = setting.value;
        if (setting.type === 'json') {
            try { value = JSON.parse(setting.value); } catch (e) { }
        }
        res.json({ key: setting.key, value, type: setting.type });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch setting' });
    }
});

// Update or create setting (admin only)
router.put('/:key', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const { value, type, description } = req.body;
        const stringValue = type === 'json' ? JSON.stringify(value) : String(value);

        const [setting, created] = await SiteSettings.upsert({
            key: req.params.key,
            value: stringValue,
            type: type || 'string',
            description: description || null
        });

        res.json({ success: true, key: req.params.key, created });
    } catch (error) {
        console.error('Error updating setting:', error);
        res.status(500).json({ error: 'Failed to update setting' });
    }
});

// Bulk update settings (admin only)
router.post('/bulk', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const { settings } = req.body;
        for (const s of settings) {
            const stringValue = s.type === 'json' ? JSON.stringify(s.value) : String(s.value);
            await SiteSettings.upsert({
                key: s.key,
                value: stringValue,
                type: s.type || 'string',
                description: s.description || null
            });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error bulk updating settings:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

// Delete setting (admin only)
router.delete('/:key', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        await SiteSettings.destroy({ where: { key: req.params.key } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete setting' });
    }
});

module.exports = router;
