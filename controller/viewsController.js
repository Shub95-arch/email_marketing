const catchAsync = require('../utils/catchAsync');
const User = require('../Models/userModel');
const mongoose = require('mongoose');

exports.getActivity = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set the time to the start of the day
  const user = await User.findById(req.user.id).populate({
    path: 'logs',
    options: {
      skip: (page - 1) * limit,
      limit: parseInt(limit),
      sort: { sentOn: -1 },
    },
  });

  const logs = await User.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(req.user.id),
      },
    },
    {
      $unwind: '$logs', // Unwind the logs array to work with individual log IDs
    },
    {
      $lookup: {
        from: 'email_logs', // The name of the logs collection
        localField: 'logs',
        foreignField: '_id',
        as: 'logDetails',
      },
    },
    {
      $unwind: '$logDetails', // Unwind the logDetails array to access individual log documents
    },
    {
      $group: {
        _id: null,
        todayCount: {
          $sum: {
            $cond: [
              { $gte: ['$logDetails.sentOn', today] }, // Check if sentOn is today
              1,
              0,
            ],
          },
        },
        totalMailCount: { $sum: 1 }, // Count all emails
        spoofCount: {
          $sum: {
            $cond: [{ $eq: ['$logDetails.mailType', 'spoof'] }, 1, 0],
          },
        },
        successCount: {
          $sum: {
            $cond: [{ $eq: ['$logDetails.status', 'success'] }, 1, 0],
          },
        },
        failedCount: {
          $sum: {
            $cond: [{ $eq: ['$logDetails.status', 'failed'] }, 1, 0],
          },
        },
        smtpCount: {
          $sum: {
            $cond: [{ $eq: ['$logDetails.mailType', 'smtp'] }, 1, 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        todayCount: 1,
        totalMailCount: 1,
        spoofCount: 1,
        smtpCount: 1,
        successCount: 1,
        failedCount: 1,
      },
    },
  ]);
  // console.log('hrllo', logs);

  res.status(200).render('index', {
    user,
    logs: logs[0] || [], // logs[0] because the aggregation results in an array
    title: 'Activity Logs',
  });
});

exports.getAccount = catchAsync(async (req, res, next) => {
  res.status(200).render('account', {
    title: 'User Account',
  });
});

exports.getSmtp = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const user = await User.findById(req.user.id).populate({
    path: 'smtp',
    options: {
      skip: (page - 1) * limit,
      limit: parseInt(limit),
      sort: { sentOn: -1 },
    },
  });
  res.status(200).render('smtp', {
    user,
    title: 'add SMTP',
  });
});

exports.verification_mail = catchAsync(async (req, res, next) => {
  res.status(200).render('verify', {
    title: 'Verification',
  });
});

exports.sendMail = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('smtp');
  res.status(200).render('send_mail', {
    user,
    title: 'Send email campaigns',
  });
});

exports.spoofMail = catchAsync(async (req, res, next) => {
  res.status(200).render('spoof_mail', {
    title: 'Send spoof email',
  });
});

exports.login = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
});
