const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  smtp: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Smtp',
    },
  ],
  logs: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Email_logs',
    },
  ],
  renewalDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  durationDays: {
    type: Number,
    required: true,
    default: 7,
  },
  emailLimit: {
    type: Number,
    default: 0,
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'reseller', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false, //To not show in the output
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please Confirm your Password'],
    validate: {
      // This only works on CREATE & SAVE!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Confirm Password do not match the Password',
    },
  },
  passwordChangedAT: Date,
  passwordResetToken: String,
  passwordResetExpiry: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// userSchema.index({ renewalDate: 1 });

userSchema.pre(
  'save',
  // Only run this function if the password is actually modified and not when
  async function (next) {
    if (!this.isModified('password')) {
      return next();
    }

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined; //Delete the passowrd , make it undefined
    next();
  }
);

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAT = Date.now() - 1000; // We are just putting it 1 second behind
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  // console.log('hello', candidatePassword, userPassword);
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAT) {
    const changedTimeStamp = parseInt(this.passwordChangedAT.getTime() / 1000);
    console.log(changedTimeStamp, JWTTimeStamp);
    return JWTTimeStamp < changedTimeStamp; //This will either return a true or false
  }
  return false; //False mean pass not changed
};

userSchema.pre(/^find/, function (next) {
  this.select(
    '-__v -passwordChangedAT'
    // this to exclude from the query
  );
  next();
});

userSchema.pre(/^find/, function (next) {
  // this is a query middleware which is used for all the query that starts with find

  this.find({ active: { $ne: false } });
  next(); // this is to find only the users that has active to set to true
});

const User = mongoose.model('User', userSchema);
module.exports = User;
