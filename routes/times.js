var express = require('express');
var timeModel = require('../models/time');
var validators = require('../utils/validators');
var router = express.Router();

/* GET list of all times. */
router.get('/', function(req, res, next) {
  res.json(timeModel.getAllTimes());
});

/* GET single time. */
router.get('/:id', function(req, res, next)  {
  var timeId = req.params.id;
  var validatedTime = validators.time(timeId);

  if (validatedTime instanceof Error)  {
    res.status(400).json({
      error: validatedTime.message
    })
  } else {
    res.json(timeModel.getSingleTime(validatedTime.id));
  }
});
module.exports = router;
