var express = require('express');
var router = express.Router();

/* GET bookings listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST bookings listing. */
router.post('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
