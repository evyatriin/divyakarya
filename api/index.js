const app = require('../server/server');
const { initializeDatabase } = require('../server/server');

let isInitialized = false;

// Initialize database once
async function ensureInitialized() {
    if (!isInitialized) {
        await initializeDatabase();
        isInitialized = true;
    }
}

// Serverless function handler
module.exports = async (req, res) => {
    try {
        await ensureInitialized();
        return app(req, res);
    } catch (error) {
        console.error('Serverless function error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
};
