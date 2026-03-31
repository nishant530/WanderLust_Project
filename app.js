if (process.env.NOFE_ENV != 'production') {
  require('dotenv').config();
}
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Listing = require('./models/listing.js');
const Review = require('./models/review.js');
const path = require('path');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema } = require('./schema.js');
const { reviewSchema } = require('./schema.js');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const flash = require('connect-flash');
const listingsRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
let dbUrl = process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log('connection successful');
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(dbUrl);
}
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 3600 * 1000,
    maxAge: 7 * 24 * 3600 * 1000,
    httpOnly: true,
  },
};
app.use(flash());
app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user;
  next();
});

app.use('/listing', listingsRouter);
app.use('/listing/:id/reviews', reviewsRouter);
app.use('/', userRouter);

app.use((err, req, res, next) => {
  let { statusCode = 500, message = 'Something went wrong' } = err;
  res.status(statusCode).render('Error.ejs', { message });
});

// app.get('/demoUser', async (req, res) => {
//   let user = new User({
//     email: 'student1@gmail.com',
//     username: 'student1',
//   });
//   let rssuser = await User.register(user, 'abc');
//   res.send(rssuser);
//   console.log(rssuser);
// });
//root route
app.get('/', (req, res) => {
  res.send('working');
});
//listen route
app.listen(8080, (req, res) => {
  console.log('listening to 8080');
});
