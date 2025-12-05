const express = require('express');
const router = express.Router();
const { Booking, Pandit, User, PanditAvailability } = require('../models');
const authenticateToken = require('../middleware/auth');
const { Op } = require('sequelize');

// Get Admin Dashboard Statistics
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin only' });
        }

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [totalBookings, pendingBookings, completedBookings, totalRevenue, activePandits, totalUsers, cancelledBookings] = await Promise.all([
            Booking.count(),
            Booking.count({ where: { status: 'pending' } }),
            Booking.count({ where: { status: 'completed' } }),
            Booking.sum('totalAmount', { where: { status: 'completed', paymentStatus: 'paid' } }),
            Pandit.count({ where: { isOnline: true } }),
            User.count(),
            Booking.count({ where: { status: 'cancelled' } })
        ]);

        // Calculate advance payments collected
        const advanceCollected = await Booking.sum('advanceAmount', {
            where: { advancePaid: true }
        });

        res.json({
            totalBookings,
            pendingBookings,
            completedBookings,
            cancelledBookings,
            totalRevenue: totalRevenue || 0,
            advanceCollected: advanceCollected || 0,
            activePandits,
            totalUsers
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get available pandits for a specific date and time
router.get('/available-pandits', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin only' });
        }

        const { date, time } = req.query;

        if (!date) {
            return res.status(400).json({ error: 'Date is required' });
        }

        // Find pandits with available slots on this date
        const availableSlots = await PanditAvailability.findAll({
            where: {
                date,
                isAvailable: true,
                slotType: 'available'
            },
            include: [{
                model: Pandit,
                attributes: ['id', 'name', 'phone', 'specialization', 'experience', 'isOnline', 'isVerified']
            }]
        });

        // Filter by time if specified
        let filteredSlots = availableSlots;
        if (time) {
            filteredSlots = availableSlots.filter(slot => {
                return time >= slot.startTime && time <= slot.endTime;
            });
        }

        // Also get pandits who don't have any availability set (legacy/unscheduled)
        const panditsWithSlots = new Set(availableSlots.map(s => s.PanditId));
        const allPandits = await Pandit.findAll({
            attributes: ['id', 'name', 'phone', 'specialization', 'experience', 'isOnline', 'isVerified']
        });

        const result = {
            availablePandits: [],
            unscheduledPandits: []
        };

        // Pandits with matching slots
        const panditsMap = new Map();
        filteredSlots.forEach(slot => {
            if (slot.Pandit && !panditsMap.has(slot.Pandit.id)) {
                panditsMap.set(slot.Pandit.id, {
                    ...slot.Pandit.toJSON(),
                    availableSlots: []
                });
            }
            if (slot.Pandit) {
                panditsMap.get(slot.Pandit.id).availableSlots.push({
                    id: slot.id,
                    startTime: slot.startTime,
                    endTime: slot.endTime
                });
            }
        });
        result.availablePandits = Array.from(panditsMap.values());

        // Pandits without any set availability
        result.unscheduledPandits = allPandits
            .filter(p => !panditsWithSlots.has(p.id))
            .map(p => p.toJSON());

        res.json(result);
    } catch (error) {
        console.error('Error fetching available pandits:', error);
        res.status(500).json({ error: error.message });
    }
});

// Assign Pandit to Booking (with availability check)
router.put('/assign', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });

        const { bookingId, panditId, slotId } = req.body;

        const booking = await Booking.findByPk(bookingId);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        const pandit = await Pandit.findByPk(panditId);
        if (!pandit) return res.status(404).json({ message: 'Pandit not found' });

        // If a specific slot was selected, mark it as booked
        if (slotId) {
            const slot = await PanditAvailability.findOne({
                where: {
                    id: slotId,
                    PanditId: panditId,
                    isAvailable: true
                }
            });

            if (slot) {
                slot.isAvailable = false;
                slot.slotType = 'booked';
                slot.BookingId = bookingId;
                await slot.save();
            }
        } else {
            // Create a new slot for this booking if none was selected
            await PanditAvailability.create({
                PanditId: panditId,
                date: booking.date,
                startTime: booking.time || '09:00',
                endTime: booking.time ?
                    // Add 2 hours to start time
                    (() => {
                        const [h, m] = booking.time.split(':').map(Number);
                        const newH = (h + 2) % 24;
                        return `${newH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                    })() : '11:00',
                isAvailable: false,
                slotType: 'booked',
                BookingId: bookingId,
                notes: `Booking #${bookingId}: ${booking.ceremonyType}`
            });
        }

        booking.PanditId = panditId;
        booking.status = 'pending'; // Pandit needs to accept
        await booking.save();

        // Mock Notification to Pandit
        console.log(`[SMS MOCK] Sending request to Pandit ${pandit.name} (${pandit.phone}) for Booking ${bookingId}`);

        res.json({
            success: true,
            message: `Pandit ${pandit.name} assigned to booking #${bookingId}`,
            booking
        });
    } catch (error) {
        console.error('Error assigning pandit:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get pandit schedule overview
router.get('/pandit-schedules', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin only' });
        }

        const { startDate, endDate } = req.query;

        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter.date = { [Op.between]: [startDate, endDate] };
        } else if (startDate) {
            dateFilter.date = { [Op.gte]: startDate };
        }

        const schedules = await PanditAvailability.findAll({
            where: dateFilter,
            include: [
                {
                    model: Pandit,
                    attributes: ['id', 'name', 'phone', 'specialization']
                },
                {
                    model: Booking,
                    attributes: ['id', 'ceremonyType', 'status'],
                    required: false
                }
            ],
            order: [['date', 'ASC'], ['startTime', 'ASC']]
        });

        res.json(schedules);
    } catch (error) {
        console.error('Error fetching pandit schedules:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

