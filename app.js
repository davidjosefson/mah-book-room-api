var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var root = require('./routes/index');
var bookings = require('./routes/bookings');
var rooms = require('./routes/rooms');
var times = require('./routes/times');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

// parse post body to json and store in req.body
app.use(bodyParser.json());

// allow access to public folder
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', root);
app.use('/bookings', bookings);
app.use('/rooms', rooms);
app.use('/times', times);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500).json({
//       message: err.message,
//       error: err
//     });
//
//     // res.render('error', {
//     //   message: err.message,
//     //   error: err
//     // });
//   });
// }

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  var status = (err.status ||  500);
  res.status(status).json({
    status: status,
    error: err.message,
  });

  // res.status(err.status || 500);
  // res.render('error', {
  //   message: err.message,
  //   error: {}
  // });
});


module.exports = app;
