var formatter = {};

formatter.formatDateFromMAH = function(date) {
  return '20' + date;
};

formatter.formatTimeFromMAH = function(time) {
  time = time.replace(/:/gi, '');
  return time.replace('-', '');
};

formatter.formatRoomFromMAH = function(room) {
  room = room.replace(':', '');
  return room.toLowerCase();
};

module.exports = formatter;