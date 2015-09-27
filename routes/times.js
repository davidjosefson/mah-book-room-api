var express = require('express');
var router = express.Router();

/* GET times */
router.get('/', function(req, res, next) {
  res.send('GET TIMES');
});

module.exports = router;
