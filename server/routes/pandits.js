const express = require('express');
const router = express.Router();
const { Pandit, Booking } = require('../models');
const authenticateToken = require('../middleware/auth');
const { Op } = require('sequelize');

// Get all pandits (for admin)
router.get('/', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const pandits = await Pandit.findAll({
            attributes: ['id', 'name', 'email', 'phone', 'specialization', 'experience', 'isOnline', 'isVerified']
        });
        res.json(pandits);
    } catch (error) {
        console.error('Error fetching pandits:', error);
        res.status(500).json({ error: error.message });
    }
});

// Toggle online/offline status
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
        console.error('Error toggling status:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get pandit revenue statistics
router.get('/revenue', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'pandit') {
            return res.status(403).json({ error: 'Pandit access required' });
        }

        const { period } = req.query; // 'month', 'year', 'all'

        let dateFilter = {};
        const now = new Date();

        if (period === 'month') {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            dateFilter = { createdAt: { [Op.gte]: startOfMonth } };
        } else if (period === 'year') {
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            dateFilter = { createdAt: { [Op.gte]: startOfYear } };
        }

        // Get all completed bookings for this pandit
        const bookings = await Booking.findAll({
            where: {
                PanditId: req.user.id,
                status: 'completed',
                paymentStatus: 'paid',
                ...dateFilter
            },
            attributes: ['id', 'ceremonyType', 'date', 'amount', 'createdAt'],
            order: [['date', 'DESC']]
        });

        // Calculate totals
        const totalRevenue = bookings.reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0);
        const totalCeremonies = bookings.length;

        // Per-ceremony breakdown
        const perCeremony = bookings.map(b => ({
            id: b.id,
            ceremonyType: b.ceremonyType,
            date: b.date,
            amount: b.amount
        }));

        // Aggregate by ceremony type
        const aggregateByCeremony = {};
        bookings.forEach(b => {
            if (!aggregateByCeremony[b.ceremonyType]) {
                aggregateByCeremony[b.ceremonyType] = { count: 0, total: 0 };
            }
            aggregateByCeremony[b.ceremonyType].count++;
            aggregateByCeremony[b.ceremonyType].total += parseFloat(b.amount) || 0;
        });

        res.json({
            totalRevenue,
            totalCeremonies,
            perCeremony,
            aggregateByCeremony,
            period: period || 'all'
        });
    } catch (error) {
        console.error('Error fetching revenue:', error);
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

        // Count bookings by status
        const [pending, accepted, completed, thisMonth] = await Promise.all([
            Booking.count({ where: { PanditId: req.user.id, status: 'pending' } }),
            Booking.count({ where: { PanditId: req.user.id, status: 'accepted' } }),
            Booking.count({ where: { PanditId: req.user.id, status: 'completed' } }),
            Booking.count({
                where: {
                    PanditId: req.user.id,
                    createdAt: { [Op.gte]: startOfMonth }
                }
            })
        ]);

        res.json({
            pending,
            accepted,
            completed,
            thisMonth
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
