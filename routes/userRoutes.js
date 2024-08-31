const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const authController = require('../controller/authController');

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.get('/logout', authController.logout);
router.get('/logs', userController.getLogs);

router.use(authController.protect); // this will run this middle ware that comes after this point

router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

router.patch('/updateMyPassword', authController.updatePassword);

router.route('/').get(userController.getAllUsers); // this will be later restricted to only admin
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser);

router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUser
);

module.exports = router;
