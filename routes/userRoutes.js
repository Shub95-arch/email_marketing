const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const authController = require('../controller/authController');

router.post('/login', authController.login);
router.post('/signup', authController.signup);

router.route('/').get(userController.getAllUsers); // this will be later restricted to only admin

router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUser
);

module.exports = router;
