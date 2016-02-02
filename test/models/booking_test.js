var expect = require('chai').expect;
var bookingModel = require('../../models/booking');

describe('Testing the booking model', function()  { 
  describe('Testing the getSingleBooking()-function', function() {
    var booking;
    before(function() {
      booking = bookingModel.getSingleBooking('nia0515', '2015-06-12', '17152000', 'testcomment');
    });

    it('should only have the following keys: id, date, comment, _embedded and _links', function()  {
      expect(booking).to.have.all.keys(['id', 'date', 'comment', '_embedded', '_links']);
    });
    it('should return an object with properties id, date, _embedded and _links', function() {
      expect(booking).to.have.property('id').that.equals('nia05152015-06-1217152000');
      expect(booking).to.have.property('date').that.equals('2015-06-12');
      expect(booking).to.have.property('comment').that.equals('testcomment');
    });
    it('should return an object where the _embedded room-object to have correct properties', function() {
      expect(booking).to.have.deep.property('_embedded.room.id', 'nia0515');
      expect(booking).to.have.deep.property('_embedded.room.name', 'NI:A0515');
      expect(booking).to.have.deep.property('_embedded.room._links');
    });
    it('should return an object where the _embedded time-object to have correct properties', function() {
      expect(booking).to.have.deep.property('_embedded.time.id', '17152000');
      expect(booking).to.have.deep.property('_embedded.time.name', '17:15-20:00');
      expect(booking).to.have.deep.property('_embedded.time._links');
    });
    it('should return an object where the _links property contains a self-object with property href and the url to the booking', function() {
      expect(booking).to.have.deep.property('_links.self.href', '/bookings/nia05152015-06-1217152000');
    });
  });
});
