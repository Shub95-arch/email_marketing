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
    });
  } else {
    newUser = await User.create(req.body);
  }
  // we need to apply a welcome email here LATER

  CreateSendToken(newUser, 201, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

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

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      //1> Verify the jwt token stored in the cookie
      const decoded = await util.promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      //2> Check if the user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      //3> Check if the user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      //NOW IF ALL THE CHECKS ARE PERFORMED THEN THE USER IS LOGGED IN

      res.locals.user = currentUser; // we can use this user variable everywhere as its local

      return res.redirect('/');
    } catch (err) {
      return next();
    }
  }

  next();
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1> Get user from the collection
  const user = await User.findById(req.user.id).select('+password');
  //2> Check if the posted password is correct

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    // we will pass passwordCurrent in the req.body

    return next(new AppError('Your current password is wrong', 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //3> If so, update the password

  //4> Log the user in with JWT
  CreateSendToken(user, 200, res);
});

exports.checkExpire = catchAsync(async (req, res, next) => {
  //check for expiration date
  const user = await User.findById(req.user.id);
  expirationDate = new Date(user.renewalDate);
  expirationDate.setDate(expirationDate.getDate() + user.durationDays);

  //check for credits

  if (new Date() > expirationDate) {
    return next(new AppError('License Expired', 400));
  }

  if (user.emailLimit === 0) {
    return next(new AppError('Balance Empty', 400));
  }
  next();
});
