const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../Models/userModel');
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

//Mongoose
dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE;
//Mongoose-Connection

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful!');
  });

const importData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    console.log('Data imported successfully form json file');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
const deleteData = async () => {
  try {
    await User.deleteMany();
    console.log('Data deleted successfully');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
console.log(process.argv);
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
