var expect = require('chai').expect;
var constants = require('../../constants/constants');
var formatter = require('../../utils/booking_formatter');

describe('Testing the booking formatter', function() {
  describe('testing room formatter', function() {
    it('should return "nia0302" for input "NI:A0302"', function() {
      expect(formatter.formatRoomFromMAH('NI:A0302')).to.equal('nia0302');
    });
  });
  describe('testing date formatter', function() {
    it('should return "2015-06-13" for input "15-06-13"', function() {
      expect(formatter.formatDateFromMAH('15-06-13')).to.equal('2015-06-13');
    });
  });
  describe('testing time formatter', function() {
    it('should return "08151000" for input "08:15-10:00"', function() {
      expect(formatter.formatTimeFromMAH('08:15-10:00')).to.equal('08151000');
    });
  });
});