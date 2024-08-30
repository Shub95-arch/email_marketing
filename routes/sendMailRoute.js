const express = require('express');
const router = express.Router();
const multer = require('multer');
const authController = require('../controller/authController');
const mailController = require('../mailer/mailSend');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use(authController.protect);

router.post('/send', upload.single('attachment'), mailController.sendMail);
router.post('/send-smtp', upload.single('attachment'), mailController.smtpMail);

module.exports = router;
