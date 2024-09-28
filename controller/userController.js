const User = require('../Models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const multer = require('multer');
const sharp = require('sharp');
const Email_logs = require('../Models/emailLogs');
const APIFeatures = require('../utils/apiFeatures');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image, Please upload only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  // console.log(req.file.filename);
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`data/img/user/${req.file.filename}`);
  next();
});

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
  console.log('this me middleware is hit');
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
  const features = new APIFeatures(
    User.find().select('-smtp -__v -logs'),
    req.query
  )
    .filter()
    .sorting()
    .limitFields()
    .pagination();
  const users = await features.query;
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
  const filteredBody = filterObj(
    req.body,
    'emailLimit',
    'durationDays',
    'renewalDate'
  );
  const user = await User.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  if (!user) return next(new AppError('No User found with that id', 404));
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new AppError('No User found with that id', 404));
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
