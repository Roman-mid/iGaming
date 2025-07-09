const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressSession = require('express-session');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catRouter = require('./routes/categories');
const cartRouter = require('./routes/cart');
const changelangRouter = require('./routes/change_lang');
const loginRouter = require('./routes/login');
const signUpRouter = require('./routes/sign_up');
const userCart = require('./routes/user_cart');
const ordersHistory = require('./routes/orders_history');

global.lang = 'en';

const app = express();

app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    },
  })
);

// pass session to pug files
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/categories', catRouter);
app.use('/cart', cartRouter);
app.use('/change_lang', changelangRouter);
app.use('/login', loginRouter);
app.use('/sign-up', signUpRouter);
app.use('/user-cart', userCart);
app.use('/orders-history', ordersHistory);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
