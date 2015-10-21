var roomModel = require('./room');
var timeModel = require('./time');

var Booking = function(roomId, date, timeId) {
  this.id = roomId + date + timeId;
  this.date = date;

  this._embedded = {
    room: new roomModel.getSingleRoom(roomId),
    time: new timeModel.getSingleTime(timeId)
  }

  this._links = {
    self: {
      href: '/bookings/' + this.id
    }
  }
}

var bookingModel = {};

bookingModel.getSingleBooking = function(roomId, date, timeId) {
  return new Booking(roomId, date, timeId);
}

module.exports = bookingModel;
