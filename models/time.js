var constants = require('../constants/constants');

var Time = function(timeId) {
  this.id = constants.TIMES[timeId].id;
  this.name = constants.TIMES[timeId].name;

  this._links = {
    self: {
      href: '/times/' + constants.TIMES[timeId].id
    }
  }
}

var timeModel = {};

timeModel.getSingleTime = function(timeId) {
  return new Time(timeId);
}

timeModel.getAllTimes = function() {
  times = [];
  for (var time in constants.TIMES) {
    times.push(new Time(time));
  }
  return times;
}


module.exports = timeModel;
