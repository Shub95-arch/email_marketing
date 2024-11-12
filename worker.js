const Queue = require('bull');
const emailQueue = new Queue('emailQueue');
const nodemailer = require('nodemailer');
const Logs = require('./Models/emailLogs');
const mongoose = require('mongoose');
const User = require('./Models/userModel');

const dotenv = require('dotenv');

//Mongoose
dotenv.config({ path: './config.env' });

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Worker connected to MongoDB');
});
mongoose.connection.on('error', (error) => {
  console.error('Error connecting to MongoDB in worker:', error);
});

//------------------------------
function convertBufferAttachments(attachments) {
  return attachments.map((attachment) => {
    if (attachment.content && attachment.content.type === 'Buffer') {
      attachment.content = Buffer.from(attachment.content.data);
    }
    return attachment;
  });
}
// Process each email job
emailQueue.process(5, async (job) => {
  console.log('we are processing');
  const { mailOptions, CurrentUser } = job.data;

  try {
    const transporter = nodemailer.createTransport({
      host: mailOptions.host,
      port: mailOptions.port,
      auth: {
        user: mailOptions.auth.user,
        pass: mailOptions.auth.pass,
      },
    });
    if (mailOptions.attachments) {
      mailOptions.attachments = convertBufferAttachments(
        mailOptions.attachments
      );
    }

    await transporter.sendMail(mailOptions);

    const logs = await Logs.create({
      toMail: mailOptions.to,
      fromEmail: mailOptions.from,
      status: 'success',
      subject: mailOptions.subject,
      Body: mailOptions.html,
      mailType: 'smtp',
    });

    await User.findByIdAndUpdate(CurrentUser, {
      $push: { logs: logs.id },
    });
  } catch (err) {
    const logs = await Logs.create({
      toMail: mailOptions.to,
      fromEmail: mailOptions.from,
      status: 'failed',
      subject: mailOptions.subject,
      Body: mailOptions.html,
      mailType: 'smtp',
    });

    await User.findByIdAndUpdate(CurrentUser, {
      $push: { logs: logs.id },
    });

    throw err;
  }
});
