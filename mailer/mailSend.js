const dnsMailer = require('./dnsMailer');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const Email = require('./mailer');
const Logs = require('../Models/emailLogs');
const User = require('../Models/userModel');

// const storage = multer.memoryStorage();
// exports.upload = multer({ storage: storage }).single('attachment'); //CONFIGURING MULTER STORAGE

exports.sendMail = catchAsync(async (req, res, next) => {
  // upload(req, res, async (err) => {
  //   if (err) {
  //     return res
  //       .status(500)
  //       .json({ status: 'error', message: 'File upload failed', err });
  //   }

  const { license, senderName, senderEmail, subject, reciever, message } =
    req.body;
  const fileName = req.file.originalname;
  // const file2 = req.file;
  // console.log(file2);
  const fileBuffer = req.file ? req.file.buffer : null; // File buffer from Multer

  try {
    const mail = await dnsMailer(
      license,
      senderName,
      senderEmail,
      subject,
      reciever,
      message,
      fileBuffer, // Pass the file buffer to dnsMailer
      fileName
    );

    if (mail.includes('Email sent successfully')) {
      const logs = await Logs.create({
        toMail: reciever,
        fromEmail: senderEmail,
        status: 'success',
        subject,
        Body: message,
        mailType: 'spoof',
      });
      await User.findByIdAndUpdate(req.user.id, {
        $push: { logs: logs.id },
      });
      res.status(200).json({
        status: 'success',
        message: mail,
        data: logs,
      });
    } else {
      const logs = await Logs.create({
        toMail: reciever,
        fromEmail: senderEmail,
        status: 'failed',
        subject,
        Body: message,
        mailType: 'spoof',
      });
      await User.findByIdAndUpdate(req.user.id, {
        $push: { logs: logs.id },
      });
      res.status(400).json({
        status: 'fail',
        message: mail,
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 'error',
      data: err,
    });
  }
});

exports.smtpMail = catchAsync(async (req, res, next) => {
  const { contact, fromMail, smtp, message, subject } = req.body;
  try {
    const smtp_mail = await new Email(contact, smtp, fromMail).send(
      message,
      subject,
      'external'
    );
    const logs = await Logs.create({
      toMail: contact.email,
      fromEmail: fromMail.email,
      status: 'success',
      subject,
      Body: message,
      mailType: 'smtp',
    });
    await User.findByIdAndUpdate(req.user.id, {
      $push: { logs: logs.id },
    });
    res.status(200).json({
      status: 'success',
      message: 'email sent successfully',
      data: logs,
    });
  } catch (err) {
    const logs = await Logs.create({
      toMail: contact.email,
      fromEmail: fromMail.email,
      status: 'failed',
      subject,
      Body: message,
      mailType: 'smtp',
    });
    await User.findByIdAndUpdate(req.user.id, {
      $push: { logs: logs.id },
    });
    res.status(400).json({
      status: 'error',
      message: 'email was not sent',
    });
  }
});

// const contact = { email: 'shubhamkr1188@gmail.com', name: 'John Doe' };
// console.log(contact.email);
// const fromMail = { name: 'secureNET', email: 'help@securenet.fun' };
// const smtpp = {
//   host: 'smtp.zoho.in',
//   port: '587',
//   username: 'help@securenet.fun',
//   password: '9gv-Ndoz',
// };

// await new Email(contact, smtpp, fromMail).send(
//   '<h1>This is a command heading tab </h1>',
//   'your account has been activated',
//   'external'
// );
