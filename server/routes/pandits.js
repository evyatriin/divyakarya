const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Pandit, Booking } = require('../models');
const authenticateToken = require('../middleware/auth');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

// Get all pandits (for admin)
router.get('/', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const pandits = await Pandit.findAll({
            attributes: ['id', 'name', 'email', 'phone', 'specialization', 'experience', 'isOnline', 'isVerified', 'createdAt']
        });
        res.json(pandits);
    } catch (error) {
        logger.error('Error fetching pandits', error);
        res.status(500).json({ error: error.message });
    }
});

// Get pandit with revenue (admin)
router.get('/:id/details', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const pandit = await Pandit.findByPk(req.params.id, {
            attributes: ['id', 'name', 'email', 'phone', 'specialization', 'experience', 'isOnline', 'isVerified', 'createdAt']
        });

        if (!pandit) {
            return res.status(404).json({ error: 'Pandit not found' });
        }

        // Get booking stats
        const [totalBookings, completedBookings, bookings] = await Promise.all([
            Booking.count({ where: { PanditId: req.params.id } }),
            Booking.count({ where: { PanditId: req.params.id, status: 'completed' } }),
            Booking.findAll({
                where: { PanditId: req.params.id, status: 'completed' },
                attributes: ['amount', 'totalAmount', 'remainingAmount']
            })
        ]);

        const totalRevenue = bookings.reduce((sum, b) => sum + (parseFloat(b.remainingAmount) || parseFloat(b.amount) || 0), 0);

        res.json({
            ...pandit.toJSON(),
            stats: {
                totalBookings,
                completedBookings,
                totalRevenue
            }
        });
    } catch (error) {
        logger.error('Error fetching pandit details', error);
        res.status(500).json({ error: error.message });
    }
});

// Toggle pandit verification (admin)
router.put('/:id/verify', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const pandit = await Pandit.findByPk(req.params.id);
        if (!pandit) {
            return res.status(404).json({ error: 'Pandit not found' });
        }

        pandit.isVerified = !pandit.isVerified;
        await pandit.save();

        logger.info('Pandit verification toggled', { panditId: req.params.id, isVerified: pandit.isVerified });
        res.json({ id: pandit.id, isVerified: pandit.isVerified });
    } catch (error) {
        logger.error('Error toggling verification', error);
        res.status(500).json({ error: error.message });
    }
});

// Create pandit (admin)
router.post('/', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const { name, email, password, phone, specialization, experience } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ error: 'Name, email, password, and phone are required' });
        }

        const existing = await Pandit.findOne({ where: { email } });
        if (existing) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const pandit = await Pandit.create({
            name,
            email,
            password: hashedPassword,
            phone,
            specialization: specialization || '',
            experience: parseInt(experience) || 0,
            isVerified: true,
            isOnline: false
        });

        logger.info('Pandit created by admin', { email });
        res.status(201).json({
            id: pandit.id,
            name: pandit.name,
            email: pandit.email,
            phone: pandit.phone,
            specialization: pandit.specialization,
            experience: pandit.experience,
            isVerified: pandit.isVerified
        });
    } catch (error) {
        logger.error('Error creating pandit', error);
        res.status(500).json({ error: error.message });
    }
});

// Update pandit (admin)
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const pandit = await Pandit.findByPk(req.params.id);
        if (!pandit) {
            return res.status(404).json({ error: 'Pandit not found' });
        }

        const { name, phone, specialization, experience } = req.body;

        await pandit.update({
            name: name || pandit.name,
            phone: phone || pandit.phone,
            specialization: specialization !== undefined ? specialization : pandit.specialization,
            experience: experience !== undefined ? parseInt(experience) : pandit.experience
        });

        logger.info('Pandit updated by admin', { panditId: req.params.id });
        res.json(pandit);
    } catch (error) {
        logger.error('Error updating pandit', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete pandit (admin)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const pandit = await Pandit.findByPk(req.params.id);
        if (!pandit) {
            return res.status(404).json({ error: 'Pandit not found' });
        }

        // Check if pandit has active bookings
        const activeBookings = await Booking.count({
            where: { PanditId: req.params.id, status: { [Op.in]: ['pending', 'accepted'] } }
        });

        if (activeBookings > 0) {
            return res.status(400).json({ error: 'Cannot delete pandit with active bookings' });
        }

        await pandit.destroy();
        logger.info('Pandit deleted', { panditId: req.params.id });
        res.json({ message: 'Pandit deleted successfully' });
    } catch (error) {
        logger.error('Error deleting pandit', error);
        res.status(500).json({ error: error.message });
    }
});

// Toggle online/offline status (pandit only)
router.put('/status', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'pandit') {
            return res.status(403).json({ error: 'Pandit access required' });
        }

        const pandit = await Pandit.findByPk(req.user.id);
        if (!pandit) {
            return res.status(404).json({ error: 'Pandit not found' });
        }

        pandit.isOnline = !pandit.isOnline;
        await pandit.save();

        res.json({ isOnline: pandit.isOnline });
    } catch (error) {
        logger.error('Error toggling status', error);
        res.status(500).json({ error: error.message });
    }
});

// Get pandit revenue statistics
router.get('/revenue', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'pandit') {
            return res.status(403).json({ error: 'Pandit access required' });
        }

        const { period } = req.query;
        let dateFilter = {};
        const now = new Date();

        if (period === 'month') {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            dateFilter = { createdAt: { [Op.gte]: startOfMonth } };
        } else if (period === 'year') {
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            dateFilter = { createdAt: { [Op.gte]: startOfYear } };
        }

        const bookings = await Booking.findAll({
            where: {
                PanditId: req.user.id,
                status: 'completed',
                paymentStatus: 'paid',
                ...dateFilter
            },
            attributes: ['id', 'ceremonyType', 'date', 'amount', 'remainingAmount', 'createdAt'],
            order: [['date', 'DESC']]
        });

        const totalRevenue = bookings.reduce((sum, b) => sum + (parseFloat(b.remainingAmount) || parseFloat(b.amount) || 0), 0);

        res.json({
            totalRevenue,
            totalCeremonies: bookings.length,
            bookings: bookings.map(b => ({
                id: b.id,
                ceremonyType: b.ceremonyType,
                date: b.date,
                amount: b.remainingAmount || b.amount
            })),
            period: period || 'all'
        });
    } catch (error) {
        logger.error('Error fetching revenue', error);
        res.status(500).json({ error: error.message });
    }
});

// Get own profile (pandit)
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'pandit') {
            return res.status(403).json({ error: 'Pandit access required' });
        }

        const pandit = await Pandit.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        if (!pandit) return res.status(404).json({ error: 'Pandit not found' });

        res.json(pandit);
    } catch (error) {
        logger.error('Error fetching pandit profile', error);
        res.status(500).json({ error: error.message });
    }
});

// Update own profile (pandit)
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'pandit') {
            return res.status(403).json({ error: 'Pandit access required' });
        }

        const pandit = await Pandit.findByPk(req.user.id);
        if (!pandit) return res.status(404).json({ error: 'Pandit not found' });

        const { name, phone, bio, photo, languages, experience, specialization } = req.body;

        await pandit.update({
            name: name || pandit.name,
            phone: phone || pandit.phone,
            bio: bio !== undefined ? bio : pandit.bio,
            photo: photo !== undefined ? photo : pandit.photo,
            languages: languages !== undefined ? languages : pandit.languages,
            experience: experience !== undefined ? parseInt(experience) : pandit.experience,
            specialization: specialization !== undefined ? specialization : pandit.specialization
        });

        logger.info('Pandit profile updated', { panditId: pandit.id });
        res.json(pandit);
    } catch (error) {
        logger.error('Error updating pandit profile', error);
        res.status(500).json({ error: error.message });
    }
});

// Get pandit dashboard stats
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'pandit') {
            return res.status(403).json({ error: 'Pandit access required' });
        }

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [pending, accepted, completed, thisMonth, pandit] = await Promise.all([
            Booking.count({ where: { PanditId: req.user.id, status: 'pending' } }),
            Booking.count({ where: { PanditId: req.user.id, status: 'accepted' } }),
            Booking.count({ where: { PanditId: req.user.id, status: 'completed' } }),
            Booking.count({
                where: { PanditId: req.user.id, createdAt: { [Op.gte]: startOfMonth } }
            }),
            Pandit.findByPk(req.user.id, { attributes: ['rating', 'totalReviews'] })
        ]);

        res.json({
            pending,
            accepted,
            completed,
            thisMonth,
            rating: pandit?.rating || 0,
            totalReviews: pandit?.totalReviews || 0
        });
    } catch (error) {
        logger.error('Error fetching stats', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
