require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { User, Pandit, Booking } = require('./models');
const authRoutes = require('./routes/auth');

app.use('/api/auth', authRoutes);
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/pandits', require('./routes/pandits'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/ceremonies', require('./routes/ceremonies'));

// Root route for health check
app.get('/', (req, res) => {
    console.log('Health check request received');
    res.json({ status: 'ok', message: 'Server is running', env: process.env.NODE_ENV });
});

// Catch-all for debugging 404s - Express 5 compatible
app.use((req, res) => {
    console.log(`404 Not Found: ${req.originalUrl}`);
    res.status(404).json({
        error: 'Not Found',
        path: req.originalUrl,
        message: 'The requested resource was not found on this server'
    });
});

// Initialize database (for serverless)
async function initializeDatabase() {
    try {
        await sequelize.sync({ force: false });
        console.log('Database synced');
    } catch (err) {
        console.error('Unable to connect to the database:', err);
        throw err;
    }
}

// Start server (for local development)
if (require.main === module) {
    initializeDatabase().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }).catch(err => {
        console.error('Failed to initialize:', err);
        process.exit(1);
    });
}

// Export for serverless
module.exports = app;
module.exports.initializeDatabase = initializeDatabase;
