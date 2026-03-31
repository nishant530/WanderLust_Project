const express = require('express');
const router = express.Router({ mergeParams: true });

const wrapAsync = require('../utils/wrapAsync.js');
const { reviewSchema } = require('../models/review.js');
const reviewController = require('../controllers/reviews.js');
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require('../middlewares.js');

//reviews
//post review route
router.post(
  '/',
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.reviewPost),
);
//delete review route
router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.delReview),
);
module.exports = router;
