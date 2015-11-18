var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

var root = require('./routes/index');
var bookings = require('./routes/bookings');
var rooms = require('./routes/rooms');
var times = require('./routes/times');

var env = process.env.NODE_ENV || 'development';

var app = express();

// redirects to HTTPS on Heroku (http://jaketrent.com/post/https-redirect-node-heroku/) 
if(env === 'production'){
  app.use(function(req, res, next) {
    if(req.headers['x-forwarded-proto'] != 'https'){
      return res.redirect(301, "https://" + (req.header('host')) + req.url);
    } else {
      return next();
    }
  });
}

// enables pre-flight CORS for all routes
app.options('*', cors());
app.use(cors());

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

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  var status = (err.status ||  500);
  res.status(status).json({
    status: status,
    error: err.message,
  });
});

module.exports = app;
