const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user.js');
const passport = require('passport');
const wrapAsync = require('../utils/wrapAsync.js');
const { saveRedirectUrl } = require('../middlewares.js');
const userController = require('../controllers/users.js');

router
  .route('/signup')
  .get(userController.getSignUp)
  .post(wrapAsync(userController.postSignUp));
//signUp route
// router.get('/signup', userController.getSignUp);
//post signup route
// router.post('/signup', wrapAsync(userController.postSignUp));

router
  .route('/login')
  .get(userController.getLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/login',
    }),
    userController.postLogin,
  );
//login routes
// router.get('/login', userController.getLogin);
// router.post(
//   '/login',
//   saveRedirectUrl,
//   passport.authenticate('local', {
//     failureFlash: true,
//     failureRedirect: '/login',
//   }),
//   userController.postLogin,
// );
//logout
router.get('/logout', userController.getLogOut);
module.exports = router;
