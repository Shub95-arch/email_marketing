const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const authController = require('../controller/authController');

router.post('/login', authController.login);
router.post('/signup', authController.signup);

router.route('/').get(userController.getAllUsers);

module.exports = router;
