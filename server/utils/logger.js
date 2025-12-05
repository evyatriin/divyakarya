// Simple logger for production - replace console.log
const isDev = process.env.NODE_ENV !== 'production';

const logger = {
    info: (message, meta = {}) => {
        const log = {
            level: 'info',
            timestamp: new Date().toISOString(),
            message,
            ...meta
        };
        if (isDev) {
            console.log(`[INFO] ${message}`, meta);
        } else {
            console.log(JSON.stringify(log));
        }
    },

    warn: (message, meta = {}) => {
        const log = {
            level: 'warn',
            timestamp: new Date().toISOString(),
            message,
            ...meta
        };
        if (isDev) {
            console.warn(`[WARN] ${message}`, meta);
        } else {
            console.log(JSON.stringify(log));
        }
    },

    error: (message, error = null, meta = {}) => {
        const log = {
            level: 'error',
            timestamp: new Date().toISOString(),
            message,
            error: error ? {
                message: error.message,
                stack: isDev ? error.stack : undefined
            } : null,
            ...meta
        };
        if (isDev) {
            console.error(`[ERROR] ${message}`, error, meta);
        } else {
            console.log(JSON.stringify(log));
        }
    },

    debug: (message, meta = {}) => {
        if (isDev) {
            console.log(`[DEBUG] ${message}`, meta);
        }
        // Don't log debug in production
    }
};

module.exports = logger;
