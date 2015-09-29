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

var roomModel = {};

roomModel.getSingleRoom = function(roomId) {
  return new Room(roomId);
}

roomModel.getAllRooms = function() {
  rooms = [];
  for (var room in constants.ROOMS) {
    rooms.push(new Room(room));
  }
  return rooms;
}

module.exports = roomModel;
