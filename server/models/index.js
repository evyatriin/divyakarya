const User = require('./User');
const Pandit = require('./Pandit');
const Booking = require('./Booking');
const Ceremony = require('./Ceremony');
const PageContent = require('./PageContent');
const PanditAvailability = require('./PanditAvailability');
const Review = require('./Review');
const Dosha = require('./Dosha');
const EPuja = require('./EPuja');
const DoshaBooking = require('./DoshaBooking');

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

// Review associations
Pandit.hasMany(Review);
Review.belongsTo(Pandit);
User.hasMany(Review);
Review.belongsTo(User);

// DoshaBooking associations
Dosha.hasMany(DoshaBooking);
DoshaBooking.belongsTo(Dosha);
User.hasMany(DoshaBooking);
DoshaBooking.belongsTo(User);

module.exports = {
    User,
    Pandit,
    Booking,
    Ceremony,
    PageContent,
    PanditAvailability,
    Review,
    Dosha,
    EPuja,
    DoshaBooking
};

