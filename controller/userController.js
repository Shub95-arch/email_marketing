const User = require('../Models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// THESE ARE ALL ADMIN FUNCTIONS

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    result: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const currentUser = await User.findById(req.params.id);
  if (!currentUser)
    return next(new AppError('No Tour found with that id', 404));
  res.status(200).json({
    status: 'success',
    data: {
      currentUser,
    },
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
