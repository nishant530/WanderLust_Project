const Listing = require('../models/listing');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema } = require('../schema.js');
const mongoose = require('mongoose');
//all listings renders
module.exports.index = async (req, res) => {
  let allListings = await Listing.find({});
  res.render('listing/index', { allListings });
};
//get new route
module.exports.getNewRoute = (req, res) => {
  res.render('listing/new');
};
//post new route
module.exports.postNewRoute = async (req, res, next) => {
  if (!req.body) {
    return res.send('form data not received');
  }
  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url, '....', filename);
  let result = listingSchema.validate(req.body.listing);
  let newListing = new Listing(req.body.listing);

  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash('success', 'new listing created');
  res.redirect('/listing');
};
//edit route
module.exports.getEditRoute = async (req, res) => {
  let { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ExpressError(400, 'Invalid ID');
  }

  let listing = await Listing.findById(id);
  let originalImage = listing.image.url;
  // console.log('phle...>>', originalImage);
  originalImage = originalImage.replace('/upload/h_300,w_250');
  // console.log('baad me...>>', originalImage);
  res.render('listing/edit', { listing, originalImage });
};
//put edit route
module.exports.putEditRoute = async (req, res) => {
  let { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ExpressError(400, 'Invalid ID');
  }

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file != 'undefined') {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash('success', 'listing updated');
  res.redirect('/listing');
};
//delete route
module.exports.delRoute = async (req, res) => {
  let { id } = req.params;
  let deletedData = await Listing.findByIdAndDelete(id);
  await req.flash('success', 'listing is deleted');
  res.redirect('/listing');
};
//show route
module.exports.showRoute = async (req, res) => {
  let { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ExpressError(400, 'Invalid ID');
  }

  let part = await Listing.findById(id)
    .populate({ path: 'reviews', populate: { path: 'author' } })
    .populate('owner');
  res.render('listing/show', { part });
};
