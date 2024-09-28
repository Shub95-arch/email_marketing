const mongoose = require('mongoose');

const smtpSchema = new mongoose.Schema({
  host: {
    type: String,
    required: [true, 'Please provide a host'],
  },
  port: {
    type: Number,
    required: [true, 'Please provide a port'],
    max: [65535, 'Please provide a valid port'],
  },
  username: {
    type: String,
    required: [true, 'Please provide a username'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
});
// smtpSchema.index({ host: 1 });

const Smtp = mongoose.model('Smtp', smtpSchema);
module.exports = Smtp;
