var express = require('express');
var request = require('request');
var bookingModel = require('../models/booking');
var basicAuth = require('basic-auth');
var validators = require('../utils/validators');
var htmlToText = require('html-to-text');
var router = express.Router();
var formatter = require('../utils/booking_formatter');

/* GET to /bookings: get all bookings for user */
router.get('/', validateUserAndPass, function(req, res, next) {
  var j = request.jar();
  var d = new Date();
  var n = d.toISOString();
  n = n.substring(2, 10);
  request({
    url: 'https://schema.mah.se/resursbokning.jsp?flik=FLIK-0017',
    jar: j
  }, function(err, httpResponse, bodyHandshake) {
    if (!err) {
      var user = req.userAndPassValidationResult.name;
      var pass = req.userAndPassValidationResult.pass;
      request({
        method: 'POST',
        url: 'https://schema.mah.se/login_do.jsp',
        form: {
          username: user,
          password: pass
        },
        jar: j
      }, function(err, httpResponse, body) {
        if (!err) {
          request({
            method: 'GET',
            url: 'https://schema.mah.se/minaresursbokningar.jsp?flik=FLIK-0017&datum=' + n,
            jar: j
          }, function(err, httpResponse, body) {
            var text = htmlToText.fromString(httpResponse.body, {
              wordwrap: 1
            });
            var textArray = text.split('\n');
            if (textArray[18] === 'Inga') {
              return res.send({
                bookings: []
              });
            } else {
              return createBookings(res, textArray);
            }
          });
        }
      });
    }
  });
});

/*
Subroutine for /get bookings
Returns response to user with alls bookings if there are any.
 */
function createBookings(res, textArray) {
  var result = [];
  var i = 18;
  while (i != -1) {
    var date = textArray[i];
    i += 2;
    var time = textArray[i++] + textArray[i++] + textArray[i++];
    i++;
    var room = textArray[i++];
    i++;

    if (date !== undefined && time !== undefined && room !== undefined) {
      date = formatter.formatDateFromMAH(date.trim());
      time = formatter.formatTimeFromMAH(time.trim());
      room = formatter.formatRoomFromMAH(room.trim());

      if (validators.room(room).id === room && validators.time(time).id === time && validators.date(date) === date) {
        result.push(bookingModel.getSingleBooking(room, date, time));
        i = findNextDate(i, textArray);
      } else {
        return res.status(500).json({
          status: 500,
          error: 'The data retreived from MAH\'s booking system was incorrect. Contact the administrator of this system'
        });
      }
    } else {
      return res.status(500).json({
        status: 500,
        error: 'The data retreived from MAH\'s booking system was incorrect. Contact the administrator of this system'
      });
    }
  }
  return res.send({
    bookings: result
  });
}

function findNextDate(i, textArray) {
  var d = new Date();
  var n = d.toISOString();
  n = n.substring(2, 10);
  for (; i < textArray.length; i++) {
    if (textArray[i].trim() === n) {
      return i;
    } else if (textArray[i].trim() === 'Kommande') {
      return -1;
    }
  }
  return -1;
}

/* POST to /bookings: create a booking */
router.post('/', validateUserAndPass, validatePostBody, function(req, res, next) {
  performExternalBooking(req.userAndPassValidationResult, req.postBodyValidationResult, function(err, result)  {
    if (!err) {
      var booking = bookingModel.getSingleBooking(req.postBodyValidationResult.room.id, req.postBodyValidationResult.date, req.postBodyValidationResult.time.id);
      res.json(booking);
    } else  {
      res.status(err.status).json({
        status: err.status,
        error: err.message
      });
    }
  });
});

function performExternalBooking(userAndPassword, postBodyObjects, callback)  {
  var user = userAndPassword.name;
  var pass = userAndPassword.pass;
  var room = postBodyObjects.room.urlRoom;
  var time = postBodyObjects.time.urlTime;
  var date = stripTwoDigitsFromYear(postBodyObjects.date);

  // sets a new cookie jar for each request
  var j = request.jar();

  // Handshake request: to get a JSESSIONID-cookie
  request({
    url: 'https://schema.mah.se/resursbokning.jsp?flik=FLIK-0017',
    jar: j
  }, function(err, httpResponse, bodyHandshake) {
    // Login request (using the cookie from the handshake)
    if (!err) {
      request({
        method: 'POST',
        url: 'https://schema.mah.se/login_do.jsp',
        form: {
          username: user,
          password: pass
        },
        jar: j
      }, function(err, httpResponse, body) {
        // Booking request
        if (!err) {
          var url = 'https://schema.mah.se/ajax/ajax_resursbokning.jsp?op=boka&datum=' + date + '&id=' + room + '&typ=RESURSER_LOKALER&intervall=' + time + '&moment= &flik=FLIK-0017';
          request({
            url: url,
            jar: j
          }, function(err, httpResponse, body) {
            if (!err) {
              if (body != 'OK') {

                if (body.match(/\bBokningen gick inte att spara pga kollision med följande resurser\b/i))  {
                  var error = new Error('The chosen room was already booked for that date and time. Room ' + postBodyObjects.room.name + ', date ' + postBodyObjects.date + ', time ' + postBodyObjects.time.name);
                  error.status = 409; // conflict
                  callback(error, null);

                } else if (body.match(/\bDin användare har inte rättigheter att skapa resursbokningar\b/i)) {
                  var error = new Error('Your user credentials aren\'t valid');
                  error.status = 401; // authentication failed
                  callback(error, null);

                } else if (body.match(/\bEj bokbar\b/i)) {
                  var error = new Error('Internal error. schema.mah.se didn\'t accept the url parameters.');
                  error.status = 500;
                  callback(error, null);

                } else {
                  // 200 OK but not a known error message from schema.mah.se
                  var error = new Error('The following error was received from schema.mah.se: ' + body);
                  error.status = 500;
                  callback(error, null);
                }

              } else {
                // Everything OK, booking was successful
                callback(null, true);
              }
            } else {
              // If booking request failed (schema.mah.se sent something other than 200 OK)
              var error = new Error('Internal error. Booking request failed, schema.mah.se/ajax/ajax_resursbokning.jsp is probably out of reach. This message was sent from schema.mah.se: ' + err.message);
              error.status = 500;
              callback(error, null);
            }
          });
        } else {
          // If login request failed
          var error = new Error('Login request to schema.mah.se failed. Either your login credentials are wrong or schema.mah.se/login_do.jsp is out of reach.');
          error.status = 500;
          callback(error, null);
        }
      });

    } else {
      // If handshake request failed
      var error = new Error('Internal error. Handshake request failed, schema.mah.se is probably down.');
      error.status = 500;
      callback(error, null);
    }
  });
}

var stripTwoDigitsFromYear = function(date) {
  return date.substring(2);
}

function validateUserAndPass(req, res, next) {
  var user = basicAuth(req);

  if (!user ||  !user.name  ||  !user.pass) {
    res.set('WWW-Authenticate', 'Basic realm="example"');
    res.status(401).json({
      error: "Username and/or password was not provided through HTTP Basic Authentication"
    });
  } else {
    req.userAndPassValidationResult = user;
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
    req.postBodyValidationResult = {};
    req.postBodyValidationResult.room = roomResult;
    req.postBodyValidationResult.date = dateResult;
    req.postBodyValidationResult.time = timeResult;

    next();
  }
}

module.exports = router;