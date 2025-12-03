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


// Sync Database
sequelize.sync({ force: false }).then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});
