const Smtp = require('../Models/smtpModel');
const User = require('../Models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Email = require('../mailer/mailer');

exports.getAllSmtp = catchAsync(async (req, res, next) => {
  const smtp = await Smtp.find();

  res.status(200).json({
    status: 'success',
    results: smtp.length,
    data: {
      smtp,
    },
  });
});

exports.getSmtp = catchAsync(async (req, res, next) => {
  const smtp = await Smtp.findById(req.params.id);
  if (!smtp) return next(new AppError('No smtp found with that id', 404));
  res.status(200).json({
    status: 'success',
    data: {
      smtp,
    },
  });
});

exports.createSmtp = catchAsync(async (req, res, next) => {
  const smtp = await Smtp.create(req.body);
  await User.findByIdAndUpdate(req.user.id, {
    $push: { smtp: smtp.id },
  });
  res.status(201).json({
    status: 'success',
    data: {
      data: smtp,
    },
  });
});

exports.updateSmtp = catchAsync(async (req, res, next) => {
  const smtp = await Smtp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!smtp) return next(new AppError('No smtp found with that id', 404));
  res.status(200).json({
    status: 'success',
    data: {
      smtp,
    },
  });
});

exports.deleteSmtp = catchAsync(async (req, res, next) => {
  const smtp = await Smtp.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: {
      data: null,
    },
  });
});
