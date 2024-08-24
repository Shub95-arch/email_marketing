const mongoose = require('mongoose');
const convertToReadableDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString(); // Convert to a human-readable string
};
const logSchema = new mongoose.Schema({
  toMail: String,
  fromEmail: String,
  status: { type: String, enum: ['success', 'failed'] },
  sentOn: {
    type: String,
    default: () => convertToReadableDate(Date.now()),
  },
  subject: String,
  Body: String,
  mailType: {
    type: String,
    enum: ['smtp', 'spoof'],
  },
});

const email_logs = mongoose.model('Email_logs', logSchema);
module.exports = email_logs;
