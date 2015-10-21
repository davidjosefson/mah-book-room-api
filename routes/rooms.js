var express = require('express');
var roomModel = require('../models/room');
var validators = require('../utils/validators');
var router = express.Router();

/* GET list of all rooms. */
router.get('/', function(req, res, next) {
  res.json(roomModel.getAllRooms());
});

/* GET single room. */
router.get('/:id', function(req, res, next)  {
  var roomId = req.params.id;
  var validatedRoom = validators.room(roomId);

  if (validatedRoom instanceof Error)  {
    res.status(400).json({
      error: validatedRoom.message
    })
  } else {
    res.json(roomModel.getSingleRoom(validatedRoom.id));
  }
});

module.exports = router;
