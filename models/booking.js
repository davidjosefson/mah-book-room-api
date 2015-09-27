var Booking = function(room, date, time) {
  this.room = room;
  this.date = date;
  this.time = time;

  this._links = {
    self: '/bookings/' + room + date + time
  }
}

// Booking.prototype.getJson()  {
//
// }

module.exports = Booking;
