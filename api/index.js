const path = require('path');
const app = require(path.join(__dirname, '../server/server'));
const { initializeDatabase } = require(path.join(__dirname, '../server/server'));

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
    console.log(`[Vercel] Incoming request: ${req.method} ${req.url}`);

    try {
        console.log('[Vercel] ensuring database initialized...');
        await ensureInitialized();
        console.log('[Vercel] database initialized, passing to app...');
        return app(req, res);
    } catch (error) {
        console.error('[Vercel] Serverless function error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
