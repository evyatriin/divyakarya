const { Sequelize } = require('sequelize');
const path = require('path');
const pg = require('pg'); // Explicitly require pg for Vercel bundling

// Optimize for serverless: reuse connections
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
    // Keep connection alive
    keepAlive: true,
    statement_timeout: 10000,
    idle_in_transaction_session_timeout: 10000
  },
  pool: {
    max: 2, // Reduced for serverless
    min: 0,
    acquire: 10000, // Faster timeout
    idle: 5000, // Shorter idle time
    evict: 1000 // Check for idle connections frequently
  },
  logging: false,
  benchmark: false,
  retry: {
    max: 3 // Retry failed queries
  }
});

// Connection cache for serverless
let isConnected = false;

const ensureConnection = async () => {
  if (!isConnected) {
    try {
      await sequelize.authenticate();
      isConnected = true;
    } catch (error) {
      isConnected = false;
      throw error;
    }
  }
  return sequelize;
};

module.exports = sequelize;
module.exports.ensureConnection = ensureConnection;
