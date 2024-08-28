const User = require('../Models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email_logs = require('../Models/emailLogs');

const filterObj = (obj, ...allowedFileds) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    // we want the selected elements of the req.body
    if (allowedFileds.includes(el)) {
      newObj[el] = obj[el];
    }
  }); // This is being used to filter out the stuff that are not meant to be updated on updateME
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError('This route is not for changing the password!', 400)
    ); // 1> We dont want user to update password from here

  // 2> Update user document

  const filteredBody = filterObj(req.body, 'name', 'email'); //USed this to filter out the names that are not needed to prevent them from updating any other stuff that will lead to security breach
  if (req.file) filteredBody.photo = req.file.filename;
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// THESE ARE ALL ADMIN FUNCTIONS

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select('-smtp -__v -logs');
  res.status(200).json({
    status: 'success',
    result: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const currentUser = await User.findById(req.params.id).populate({
    path: 'logs smtp',
    select: '-__v',
  });
  if (!currentUser)
    return next(new AppError('No User found with that id', 404));
  res.status(200).json({
    status: 'success',
    data: {
      currentUser,
    },
  });
});

exports.getLogs = catchAsync(async (req, res, next) => {
  const log = await Email_logs.find();
  res.status(200).json({
    log,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) return next(new AppError('No User found with that id', 404));
  res.status(200).json({
    status: 'success',
    data: {
      doc,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await Model.findByIdAndDelete(req.params.id);
  if (!user) return next(new AppError('No User found with that id', 404));
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
