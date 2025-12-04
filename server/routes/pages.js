const express = require('express');
const router = express.Router();
const { PageContent } = require('../models');

// Get page content by slug
router.get('/:slug', async (req, res) => {
    try {
        const page = await PageContent.findOne({ where: { slug: req.params.slug } });
        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }
        res.json(page);
    } catch (error) {
        console.error('Error fetching page content:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
