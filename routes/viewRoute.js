const express = require('express');
const router = express.Router();
const viewController = require('../controller/viewsController');
const authController = require('../controller/authController');

router.get('/login', authController.isLoggedIn, viewController.login);
router.get(
  '/verify',
  authController.isLoggedIn,
  viewController.verification_mail
);

// router.use(authController.protect);
// router.get('/', authController.protect, viewController.getOverview);

router.get('/activity', authController.protect, viewController.getActivity);

router.get('/account', authController.protect, viewController.getAccount);

router.get('/smtp', authController.protect, viewController.getSmtp);

router.get('/send-mail', authController.protect, viewController.sendMail);

router.get('/spoof-mail', authController.protect, viewController.spoofMail);

module.exports = router;
