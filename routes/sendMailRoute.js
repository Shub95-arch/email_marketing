const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const mailController = require('../mailer/mailSend');

router.use(authController.protect);

router.post('/send', mailController.sendMail);
router.post('/send-smtp', mailController.smtpMail);

module.exports = router;
