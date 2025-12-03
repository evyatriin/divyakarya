const User = require('./User');
const Pandit = require('./Pandit');
const Booking = require('./Booking');
const Ceremony = require('./Ceremony');

// Associations
User.hasMany(Booking);
Booking.belongsTo(User);

Pandit.hasMany(Booking);
Booking.belongsTo(Pandit);

module.exports = {
    User,
    Pandit,
    Booking,
    Ceremony
};
