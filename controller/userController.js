const User = require('../Models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      message: 'Hello from the server side',
    },
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined', // Please use the signup route->WE ARE GOING TO USE THE SIGNUP
  });
};
