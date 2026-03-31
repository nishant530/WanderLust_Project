const User = require('../models/user.js');

//get signup route
module.exports.getSignUp = (req, res) => {
  res.render('users/signup.ejs');
};
//post signup route
module.exports.postSignUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({
      email: email,
      username: username,
    });
    const registerUser = await User.register(newUser, password);
    await req.login(registerUser, (err) => {
      if (err) {
        next(err);
      }
      req.flash('success', 'Welcome to wanderLust');
      res.redirect('/listing');
    });
  } catch (err) {
    req.flash('error', err.msg);
    res.redirect('/signup');
  }
};
//get login route
module.exports.getLogin = (req, res) => {
  res.render('users/login.ejs');
};
//post login route
module.exports.postLogin = async (req, res) => {
  req.flash('success', 'Welcome to wanderLust');
  let redirectUrl = res.locals.redirectUrl || '/listing';
  res.redirect(redirectUrl);
};
//logout route
module.exports.getLogOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash('success', 'you are logout!');
    res.redirect('/listing');
  });
};
