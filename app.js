const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressValidator = require('express-validator');

const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');

require('./passport');
const config = require('./config');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const taskRouter = require('./routes/task');

const app = express();

// import environmental variables from our variables.env file
// require('dotenv').config({ path: 'variables.env' });
mongoose.connect(config.db, { useNewUrlParser: true});
global.User = require('./models/user');
global.Task = require('./models/task');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressValidator());

app.use(cookieParser());
app.use(session({
  secret: config.sessionKey,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
});
app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/auth', authRouter);
app.use('/', taskRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
