require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const sequelize = require('./config/database');
const logger = require('./utils/logger');
const { generalLimiter, bookingLimiter, authLimiter, paymentLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5000;

// Security headers
app.use(helmet({
    contentSecurityPolicy: false, // Disable for API
    crossOriginEmbedderPolicy: false
}));

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5000',
    'https://divyakaryaclient.vercel.app',
    'https://divyakaryaserver.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json({ limit: '10kb' })); // Limit body size

// Apply general rate limiting to all routes
app.use(generalLimiter);

const { User, Pandit, Booking } = require('./models');
const authRoutes = require('./routes/auth');

// Apply specific rate limiters to sensitive routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/bookings', bookingLimiter, require('./routes/bookings'));
app.use('/api/pandits', require('./routes/pandits'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/payments', paymentLimiter, require('./routes/payments'));
app.use('/api/ceremonies', require('./routes/ceremonies'));
app.use('/api/pages', require('./routes/pages'));
app.use('/api/users', require('./routes/users'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/availability', require('./routes/availability'));
app.use('/api/doshas', require('./routes/doshas'));
app.use('/api/epujas', require('./routes/epujas'));
app.use('/api/dosha-bookings', require('./routes/doshaBookings'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/epuja-bookings', require('./routes/epujaBookings'));

// Health check with DB status
app.get('/', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.json({ status: 'ok', message: 'Server is running', db: 'connected' });
    } catch {
        res.status(503).json({ status: 'degraded', message: 'Server running, DB issue' });
    }
});

// 404 handler
app.use((req, res) => {
    logger.warn('Route not found', { path: req.originalUrl, method: req.method });
    res.status(404).json({
        error: 'Not Found',
        path: req.originalUrl
    });
});

// Global error handler
app.use((err, req, res, next) => {
    logger.error('Unhandled error', err, { path: req.originalUrl });
    res.status(500).json({ error: 'Internal server error' });
});

// Initialize database
let dbInitialized = false;

async function initializeDatabase() {
    if (dbInitialized) {
        logger.debug('Database already initialized');
        return;
    }

    try {
        logger.info('Starting database sync...');
        await sequelize.sync({ alter: true });
        logger.info('Database synced successfully');

        // Auto-seed doshas and epujas if tables are empty
        try {
            const { Dosha, EPuja } = require('./models');
            const doshaCount = await Dosha.count();
            const epujaCount = await EPuja.count();

            if (doshaCount === 0 || epujaCount === 0) {
                logger.info('Seeding doshas and epujas data...');
                const seedDoshasAndEPujas = require('./seed-doshas-epujas');
                await seedDoshasAndEPujas();
                logger.info('Doshas and ePujas seeded successfully');
            }
        } catch (seedError) {
            logger.warn('Could not seed doshas/epujas:', seedError.message);
        }

        dbInitialized = true;
    } catch (err) {
        logger.error('Database sync failed', err);
        try {
            await sequelize.authenticate();
            logger.info('Database connection authenticated');
            dbInitialized = true;
        } catch (authErr) {
            logger.error('Database authentication failed', authErr);
            throw err;
        }
    }
}

// Start server (local development)
if (require.main === module) {
    initializeDatabase().then(() => {
        app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
        });
    }).catch(err => {
        logger.error('Failed to initialize', err);
        process.exit(1);
    });
}

module.exports = app;
module.exports.initializeDatabase = initializeDatabase;
