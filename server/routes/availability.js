const express = require('express');
const router = express.Router();
const { PanditAvailability, Pandit, Booking } = require('../models');
const authenticateToken = require('../middleware/auth');
const { Op } = require('sequelize');

// Get availability for a specific pandit
router.get('/pandit/:panditId', async (req, res) => {
    try {
        const { panditId } = req.params;
        const { startDate, endDate } = req.query;

        let where = { PanditId: panditId };

        if (startDate && endDate) {
            where.date = {
                [Op.between]: [startDate, endDate]
            };
        } else if (startDate) {
            where.date = {
                [Op.gte]: startDate
            };
        }

        const availability = await PanditAvailability.findAll({
            where,
            include: [{
                model: Booking,
                attributes: ['id', 'ceremonyType', 'status']
            }],
            order: [['date', 'ASC'], ['startTime', 'ASC']]
        });

        res.json(availability);
    } catch (error) {
        console.error('Error fetching pandit availability:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all available pandits for a specific date and time
router.get('/pandits', async (req, res) => {
    try {
        const { date, time } = req.query;

        if (!date) {
            return res.status(400).json({ error: 'Date is required' });
        }

        // Find all pandits with available slots on this date
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

        // If time is specified, filter by time range
        let filteredSlots = availableSlots;
        if (time) {
            filteredSlots = availableSlots.filter(slot => {
                return time >= slot.startTime && time <= slot.endTime;
            });
        }

        // Group by pandit and return unique pandits
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

        res.json(Array.from(panditsMap.values()));
    } catch (error) {
        console.error('Error fetching available pandits:', error);
        res.status(500).json({ error: error.message });
    }
});

// Pandit: Add availability slot
router.post('/', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'pandit') {
            return res.status(403).json({ error: 'Pandit access required' });
        }

        const { date, startTime, endTime, notes } = req.body;

        if (!date || !startTime || !endTime) {
            return res.status(400).json({ error: 'Date, startTime, and endTime are required' });
        }

        // Check for overlapping slots
        const existingSlot = await PanditAvailability.findOne({
            where: {
                PanditId: req.user.id,
                date,
                [Op.or]: [
                    {
                        startTime: { [Op.lte]: startTime },
                        endTime: { [Op.gt]: startTime }
                    },
                    {
                        startTime: { [Op.lt]: endTime },
                        endTime: { [Op.gte]: endTime }
                    },
                    {
                        startTime: { [Op.gte]: startTime },
                        endTime: { [Op.lte]: endTime }
                    }
                ]
            }
        });

        if (existingSlot) {
            return res.status(400).json({ error: 'An overlapping slot already exists for this time' });
        }

        const slot = await PanditAvailability.create({
            PanditId: req.user.id,
            date,
            startTime,
            endTime,
            notes,
            isAvailable: true,
            slotType: 'available'
        });

        res.status(201).json(slot);
    } catch (error) {
        console.error('Error creating availability slot:', error);
        res.status(500).json({ error: error.message });
    }
});

// Pandit: Update availability slot
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'pandit') {
            return res.status(403).json({ error: 'Pandit access required' });
        }

        const slot = await PanditAvailability.findOne({
            where: {
                id: req.params.id,
                PanditId: req.user.id
            }
        });

        if (!slot) {
            return res.status(404).json({ error: 'Slot not found' });
        }

        if (slot.slotType === 'booked') {
            return res.status(400).json({ error: 'Cannot modify a booked slot' });
        }

        const { startTime, endTime, isAvailable, slotType, notes } = req.body;

        if (startTime) slot.startTime = startTime;
        if (endTime) slot.endTime = endTime;
        if (typeof isAvailable === 'boolean') slot.isAvailable = isAvailable;
        if (slotType && slotType !== 'booked') slot.slotType = slotType;
        if (notes !== undefined) slot.notes = notes;

        await slot.save();
        res.json(slot);
    } catch (error) {
        console.error('Error updating availability slot:', error);
        res.status(500).json({ error: error.message });
    }
});

// Pandit: Delete availability slot
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'pandit') {
            return res.status(403).json({ error: 'Pandit access required' });
        }

        const slot = await PanditAvailability.findOne({
            where: {
                id: req.params.id,
                PanditId: req.user.id
            }
        });

        if (!slot) {
            return res.status(404).json({ error: 'Slot not found' });
        }

        if (slot.slotType === 'booked') {
            return res.status(400).json({ error: 'Cannot delete a booked slot' });
        }

        await slot.destroy();
        res.json({ message: 'Slot deleted successfully' });
    } catch (error) {
        console.error('Error deleting availability slot:', error);
        res.status(500).json({ error: error.message });
    }
});

// Pandit: Bulk add availability (for a week)
router.post('/bulk', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'pandit') {
            return res.status(403).json({ error: 'Pandit access required' });
        }

        const { slots } = req.body; // Array of { date, startTime, endTime }

        if (!slots || !Array.isArray(slots)) {
            return res.status(400).json({ error: 'Slots array is required' });
        }

        const createdSlots = [];
        for (const slotData of slots) {
            const slot = await PanditAvailability.create({
                PanditId: req.user.id,
                date: slotData.date,
                startTime: slotData.startTime,
                endTime: slotData.endTime,
                notes: slotData.notes,
                isAvailable: true,
                slotType: 'available'
            });
            createdSlots.push(slot);
        }

        res.status(201).json(createdSlots);
    } catch (error) {
        console.error('Error creating bulk availability:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
