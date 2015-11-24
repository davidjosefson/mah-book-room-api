var roomModel = require('./room');
var timeModel = require('./time');

var Booking = function(roomId, date, timeId, comment) {
  this.id = roomId + date + timeId;
  this.date = date;

  // comment is set to " " if no comment was specified by user
  if(comment === " ") {
    this.comment = null;
  } else {
    this.comment = comment;
  }

  this._embedded = {
    room: new roomModel.getSingleRoom(roomId),
    time: new timeModel.getSingleTime(timeId)
  };

  this._links = {
    self: {
      href: '/bookings/' + this.id
    }
  };
};

var bookingModel = {};

bookingModel.getSingleBooking = function(roomId, date, timeId, comment) {
  return new Booking(roomId, date, timeId, comment);
};

module.exports = bookingModel;
