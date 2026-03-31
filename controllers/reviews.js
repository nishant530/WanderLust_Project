const Listing = require('../models/listing.js');
const ExpressError = require('../utils/ExpressError.js');
const Review = require('../models/review.js');
module.exports.reviewPost = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  // console.log(newReview);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  console.log(newReview);
  res.redirect(`/listing/${req.params.id}`);
};

module.exports.delReview = async (req, res) => {
  console.log(req.params);
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'review deleted');
  res.redirect(`/listing/${id}`);
};
