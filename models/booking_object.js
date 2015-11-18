var Booking = function(r, t, d, p) {
    this.room = r;
    this.time = t;
    this.date = d;
    this.passed = p;
};

var bookingModel = {};

bookingModel.getBooking = function(room, time, date, passed) {
    return new Booking(room, time, date, passed);
};

module.exports = bookingModel;
