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

var Times = function() {
  this.times = [];
  this._links = {
    self: {
      href: '/times'
    }
  };

  for (var time in constants.TIMES) {
    this.times.push(new Time(time));
  }

  // sorts array based on id to get 08:15-10:00 first instead of last
  this.times.sort(function(a, b) {
    if (a.id > b.id) {
      return 1;
    }
    if (a.id < b.id) {
      return -1;
    }
    return 0;
  });
}

var timeModel = {};

timeModel.getSingleTime = function(timeId) {
  return new Time(timeId);
}

timeModel.getAllTimes = function() {
  return new Times();
}


module.exports = timeModel;
