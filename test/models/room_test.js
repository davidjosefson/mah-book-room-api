var expect = require('chai').expect;
var roomModel = require('../../models/room');

describe('Testing the room model', function()  { 
  describe('Testing the getSingleRoom()-function', function() {
    var room;
    before(function() {
      room = roomModel.getSingleRoom('nia0506');
    });

    it('should only have the following keys: id, name and _links', function()  {
      expect(room).to.have.all.keys(['id', 'name', '_links']);
    });
    it('should return an object with properties id, name and _links', function() {
      expect(room).to.have.property('id').that.equals('nia0506');
      expect(room).to.have.property('name').that.equals('NI:A0506');
    });
    it('should return an object where the _links property contains a self-object with property href and the url to the room', function() {
      expect(room).to.have.property('_links').that.is.an('object').with.property('self').that.is.an('object').with.property('href').that.equals('/rooms/nia0506');
    });
  });
  describe('Testing the getAllRooms()-function', function() {
    var rooms;
    before(function() {
      rooms = roomModel.getAllRooms();
    });

    it('should only have the following keys: id, name and _links', function()  {
      for (var i = 0; i < rooms.length; i++)  {
        expect(rooms[i]).to.have.all.keys(['id', 'name', '_links']);
      }
    });
    it('should return an array where each object has properties id, name and _links', function() {
      for (var i = 0; i < rooms.length; i++)  {
        expect(rooms[i]).to.have.property('name').that.is.a('string');
        expect(rooms[i]).to.have.property('id').that.is.a('string');
      }
    });
    it('should return an object where the _links property contains a self-object with property href and the url to the room', function() {
      for (var i = 0; i < rooms.length; i++)  {
        expect(rooms[i]).to.have.property('_links').that.is.an('object').with.property('self').that.is.an('object').with.property('href').that.is.a('string');
      }
    });
  });
});
