const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const app = express();
app.enable('trust proxy', 1);

const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const compression = require('compression');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const userRouter = require('./routes/userRoutes'); //Routers
const smtpRouter = require('./routes/smtpRoute');
const viewRouter = require('./routes/viewRoute');
const mailRouter = require('./routes/sendMailRoute');

const morgan = require('morgan');
const globalErrorHandler = require('./controller/errorController');
const AppError = require('./utils/appError');

app.set('view engine', 'pug'); // defining our render engine

// app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.options('*', cors());

//SECURITY MIDDLEWARES

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
  })
);

app.use(morgan('dev')); //morgan middleware
app.use(express.json({ limit: '10kb' })); //now if we have a body more than 10kb it will not be served
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
    }, // Set secure to true in production with HTTPS
  })
);
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(compression());
const limiter = rateLimit({
  //PREVENTS FROM DDOS
  max: 100, // No. of requests
  windowMs: 60 * 60 * 1000, // Time in Ms
  message: 'Too many requests from this IP, Please try again in an hour', // Error message
});

app.use('/api', limiter);

app.use(express.static(`${__dirname}/data`));

app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/smtp', smtpRouter);
app.use('/api/v1/mail', mailRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Cant Find ${req.originalUrl} on this server`, 404)); //ERROR HANDLERS
});
app.use(globalErrorHandler);

module.exports = app;
