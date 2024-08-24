const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const util = require('util');
const User = require('../Models/userModel');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const CreateSendToken = (user, statusCode, res) => {
  const token = signToken(user._id); // WE WILL CHECK THIS LATER
  const CookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') CookieOptions.secure = true;
  res.cookie('jwt', token);
  user.password = undefined;
  console.log(token);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  let newUser;
  if (process.env.NODE_ENV == 'production') {
    newUser = await User.create({
      name: req.body.name,
      email: req.body.email, // WE can also pass req.body but for security we will only pass selected terms
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAT: req.body.passwordChangedAT,
    });
  } else {
    newUser = await User.create(req.body);
  }
  // we need to apply a welcome email here LATER

  CreateSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide an email or password', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  console.log(user);
  console.log(await user.correctPassword(password, user.password));
  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('Incorrect email or passsword', 401));

  CreateSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  //1> Checking if the token exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) token = req.cookies.jwt;
  if (!token)
    return next(new AppError('You are not logged in! Please login first', 401));

  //-----------------------------------------------------------------------------//

  //2> verification of token
  const decoded = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  console.log(decoded);
  //3> Check if the user exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The account belonging to the user does no longer exists',
        401
      )
    );
  }
  //4> Check if the user changed the password after the JWT was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again', 401)
    );
  }
  req.user = currentUser;
  res.locals.user = currentUser;
  next(); //GRANCT ACCESS TO PROTECTED ROUTE
});



