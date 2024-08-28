const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();

const userRouter = require('./routes/userRoutes'); //Routers
const smtpRouter = require('./routes/smtpRoute');
const viewRouter = require('./routes/viewRoute');
const mailRouter = require('./routes/sendMailRoute');

const morgan = require('morgan');
const globalErrorHandler = require('./controller/errorController');
const AppError = require('./utils/appError');

app.set('view engine', 'pug'); // defining our render engine

// app.set('views', path.join(__dirname, 'views'));
app.use(express.static(`${__dirname}/data`));

app.use(morgan('dev')); //morgan middleware
app.use(express.json({ limit: '10kb' })); //now if we have a body more than 10kb it will not be served
app.use(cookieParser());

app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/smtp', smtpRouter);
app.use('/api/v1/mail', mailRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Cant Find ${req.originalUrl} on this server`, 404)); //ERROR HANDLERS
});
app.use(globalErrorHandler);

module.exports = app;
