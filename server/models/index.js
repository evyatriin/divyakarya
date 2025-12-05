const User = require('./User');
const Pandit = require('./Pandit');
const Booking = require('./Booking');
const Ceremony = require('./Ceremony');
const PageContent = require('./PageContent');
const PanditAvailability = require('./PanditAvailability');

// Associations
User.hasMany(Booking);
Booking.belongsTo(User);

Pandit.hasMany(Booking);
Booking.belongsTo(Pandit);

// Pandit Availability associations
Pandit.hasMany(PanditAvailability);
PanditAvailability.belongsTo(Pandit);

// Optional: Link availability slot to booking when booked
Booking.hasOne(PanditAvailability);
PanditAvailability.belongsTo(Booking);

module.exports = {
    User,
    Pandit,
    Booking,
    Ceremony,
    PageContent,
    PanditAvailability
};
