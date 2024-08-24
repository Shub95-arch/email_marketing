const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const smtpController = require('../controller/smtpController');

router
  .route('/')
  .get(smtpController.getAllSmtp)
  .post(authController.protect, smtpController.createSmtp);

router
  .route('/:id')
  .get(smtpController.getSmtp)
  .patch(smtpController.updateSmtp)
  .delete(smtpController.deleteSmtp);

module.exports = router;
