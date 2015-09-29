var expect = require('chai').expect;
var timesModel = require('../../models/time');

describe('Testing the times model', function()  { 
  describe('Testing the getSingleTime()-function', function() {
    var time;
    before(function() {
      time = timesModel.getSingleTime('10151300');
    });

    it('should only have the following keys: id, name and _links', function()  {
      expect(time).to.have.all.keys(['id', 'name', '_links']);
    });
    it('should return an object with properties id, name and _links', function() {
      expect(time).to.have.property('id').that.equals('10151300');
      expect(time).to.have.property('name').that.equals('10:15-13:00');
    });
    it('should return an object where the _links property contains a self-object with property href and the url to the times', function() {
      expect(time).to.have.property('_links').that.is.an('object').with.property('self').that.is.an('object').with.property('href').that.equals('/times/10151300');
    });
  });
  describe('Testing the getAllTimes()-function', function() {
    var times;
    before(function() {
      times = timesModel.getAllTimes();
    });

    it('should only have the following keys: id, name and _links', function()  {
      for (var i = 0; i < times.length; i++)  {
        expect(times[i]).to.have.all.keys(['id', 'name', '_links']);
      }
    });
    it('should return an array where each object has properties id, name and _links', function() {
      for (var i = 0; i < times.length; i++)  {
        expect(times[i]).to.have.property('name').that.is.a('string');
        expect(times[i]).to.have.property('id').that.is.a('string');
      }
    });
    it('should return an object where the _links property contains a self-object with property href and the url to the times', function() {
      for (var i = 0; i < times.length; i++)  {
        expect(times[i]).to.have.property('_links').that.is.an('object').with.property('self').that.is.an('object').with.property('href').that.is.a('string');
      }
    });
  });
});
