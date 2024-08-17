const express = require('express');
const router = express.Router();
const smtpController = require('../controller/smtpController');

router
  .route('/')
  .get(smtpController.getAllSmtp)
  .post(smtpController.createSmtp);

router
  .route('/:id')
  .get(smtpController.getSmtp)
  .patch(smtpController.updateSmtp)
  .delete(smtpController.deleteSmtp);

module.exports = router;
