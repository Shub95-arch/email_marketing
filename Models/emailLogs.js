const mongoose = require('mongoose');
// const convertToReadableDate = (timestamp) => {
//   const date = new Date(timestamp);
//   return date.toLocaleString(); // Convert to a human-readable string
// };
// const moment = require('moment'); // Import moment.js or another date library

// function convertToISO(dateStr) {
//   // Assuming your format is 'DD/MM/YYYY, HH:MM:SS am/pm'
//   return moment(dateStr, 'DD/MM/YYYY, hh:mm:ss a').toISOString();
// }

const logSchema = new mongoose.Schema({
  toMail: String,
  fromEmail: String,
  status: { type: String, enum: ['success', 'failed'] },
  sentOn: {
    type: Date,
    default: Date.now,
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
