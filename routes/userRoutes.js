const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.route('/').get(userController.getAllUsers);

module.exports = router;
