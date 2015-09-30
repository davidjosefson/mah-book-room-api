var constants = require('../constants/constants');

var Room = function(roomId) {
  this.id = constants.ROOMS[roomId].id;
  this.name = constants.ROOMS[roomId].name;

  this._links = {
    self: {
      href: '/rooms/' + constants.ROOMS[roomId].id
    }
  }
}

var Rooms = function() {
  this.rooms = [];
  this._links = {
    self: {
      href: '/rooms'
    }
  };

  for (var room in constants.ROOMS) {
    this.rooms.push(new Room(room));
  }
}

var roomModel = {};

roomModel.getSingleRoom = function(roomId) {
  return new Room(roomId);
}

roomModel.getAllRooms = function() {
  return new Rooms();
}

module.exports = roomModel;
