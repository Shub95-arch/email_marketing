const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const smtpController = require('../controller/smtpController');

router.use(authController.protect);

router
  .route('/')
  .get(authController.restrictTo('admin'), smtpController.getAllSmtp)
  .post(smtpController.createSmtp);

router
  .route('/:id')
  .get(authController.restrictTo('admin'), smtpController.getSmtp)
  .patch(smtpController.updateSmtp)
  .delete(smtpController.deleteSmtp);

module.exports = router;
