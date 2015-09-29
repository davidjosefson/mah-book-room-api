var express = require('express');
var request = require('request');
var bookingModel = require('../models/booking');
var basicAuth = require('basic-auth');
var validators = require('../utils/validators');
var router = express.Router();

/* GET to /bookings: get all bookings for user */
router.get('/', validateUserAndPass, function(req, res, next) {
  res.send('GET BOOKINGS');
});

/* POST to /bookings: create a booking */
router.post('/', validateUserAndPass, validatePostBody, function(req, res, next) {
  /*
    2. perform request-get to schema.mah.se
    3. create a json-response of the booking information
  */

  performExternalBooking(req.semiValidUser, req.body, function(err, result)  {
    if (!err) {
      var booking = bookingModel.getSingleBooking(req.body.room, req.body.date, req.body.time);
      res.json(booking);
    } else  {
      res.status(500).json({
        error: err
      });
    }
  });
});

function validateUserAndPass(req, res, next) {
  var user = basicAuth(req);

  if (!user ||  !user.name  ||  !user.pass) {
    res.set('WWW-Authenticate', 'Basic realm="example"');
    res.status(401).json({
      error: "Username and/or password was not provided through HTTP Basic Authentication"
    });
  } else {
    req.semiValidUser = user;
    next();
  }
}

function validatePostBody(req, res, next) {
  var roomResult = validators.room(req.body.room);
  var dateResult = validators.date(req.body.date);
  var timeResult = validators.time(req.body.time);
  var combinedError = [];

  if (roomResult instanceof Error) {
    combinedError.push({
      error: roomResult.message
    });
  }
  if (dateResult instanceof Error) {
    combinedError.push({
      error: dateResult.message
    });
  }
  if (timeResult instanceof Error) {
    combinedError.push({
      error: timeResult.message
    });
  }

  if (combinedError.length > 0) {
    res.status(400).json(combinedError);
  } else {
    next();
  }
}

function performExternalBooking(userAndPassword, postBody, callback)  {
  // strips the two first digits of the year from date string
  var strippedDate = stripTwoDigitsFromYear(postBody.date);

  // sets a new cookie jar for each request
  var j = request.jar();

  request({
    url: 'https://schema.mah.se/resursbokning.jsp?flik=FLIK-0017',
    jar: j
  }, function(err, httpResponse1, body) {
    request({
      method: 'POST',
      url: 'https://schema.mah.se/login_do.jsp',
      form: {
        password: userAndPassword.pass,
        username: userAndPassword.user
      },
      jar: j
    }, function(err, httpResponse2, body) {
      if (!err) {
        request({
          url: 'https://schema.mah.se/ajax/ajax_resursbokning.jsp?op=boka&datum=' + strippedDate + '&id=' + postBody.room + '&typ=RESURSER_LOKALER&intervall=' + postBody.time + '&moment= &flik=FLIK-0017',
          jar: j
        }, function(err, httpResponse3, body) {
          if (!err) {
            if (body != 'OK') {
              // console.log('\nThe room was not booked, the following error was received from schema.mah.se: ');
              // console.log('\n\t' + body + '\n');
              if (body.match(/\bBokningen gick inte att spara pga kollision med följande resurser\b/i))  {
                callback("The chosen room was already booked for that date and time.", null)
              } else {
                callback(body, null);
              }
            } else {
              // console.log('Room ' + args.room + ' was booked at ' + args.date + ' ' + constants.TIMES[args.time].readableTime);
              callback(null, true);
            }
          } else {
            // console.log('GET for https://schema.mah.se/ajax/ajax_resursbokning.jsp?.. failed: ', err);
            callback(err, null);
          }
        });
      } else {
        console.log('POST for https://schema.mah.se/login_do.jsp.. failed: ', err);

        callback(err, null);
      }
    });
  });
}

var stripTwoDigitsFromYear = function(date) {
  return date.substring(2);
}

module.exports = router;
