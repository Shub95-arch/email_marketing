const express = require('express');
const path = require('path');

const userRouter = require('./routes/userRoutes'); //Routers
const smtpRouter = require('./routes/smtpRoute');

const morgan = require('morgan');
const globalErrorHandler = require('./controller/errorController');
const AppError = require('./utils/appError');
const app = express();
app.use(morgan('dev')); //morgan middleware
app.use(express.json({ limit: '10kb' })); //now if we have a body more than 10kb it will not be served

app.use('/api/v1/users', userRouter);
app.use('/api/v1/smtp', smtpRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Cant Find ${req.originalUrl} on this server`, 404)); //ERROR HANDLERS
});
app.use(globalErrorHandler);

module.exports = app;
