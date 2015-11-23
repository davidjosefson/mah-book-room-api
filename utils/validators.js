var constants = require('../constants/constants');

var validators = {};

validators.room = function(room)  {
  var validRoom;
  if (room === null || room === undefined) {
    return new Error('No room was specified.');
  } else if (typeof room != 'string')  {
    return new Error('Room was not a string.'); 
  } else if ((validRoom = constants.ROOMS[room]) === undefined) {
    return new Error('\'' + room + '\' is not a valid room. See endpoint /rooms for a list of valid rooms to use.');
  }
  return validRoom;
}

validators.time = function(time) {
  var validTime;
  if (time === null ||  time === undefined) {
    return new Error('No time was specified.');
  } else if (typeof time != 'string')  {
    return new Error('Time was not a string.'); 
  } else if ((validTime = constants.TIMES[time]) === undefined) {
    return new Error('\'' + time + '\' is not a valid time. See endpoint /times for a list of valid times to use.');
  }
  return validTime;
}

validators.date = function(date) {
  if (date === null || date === undefined) {
    return new Error('No date was specified.');
  } else if (typeof date != 'string')  {
    return new Error('Date was not a string.');
  } else if (!date.match(/\b(\d{4})-(\d{2})-(\d{2})\b/))  {
    return new Error('\'' + date + '\' is not a valid date. It has to be in ISO 8106-format YYYY-MM-DD, example: \'2016-01-15\'');
  }
  return date;
}

module.exports = validators;
