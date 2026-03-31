const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn } = require('../middlewares.js');
const { isOwner } = require('../middlewares.js');
const listingControllers = require('../controllers/listings.js');
const multer = require('multer');
const { storage } = require('../CloudConfig.js');
const upload = multer({ storage });
router
  .route('/')
  .get(wrapAsync(listingControllers.index))
  .post(
    isLoggedIn,
    upload.single('listing[image]'),
    wrapAsync(listingControllers.postNewRoute),
  );
// .post(upload.single('listing[image]'), (req, res) => {
//   res.send(req.file);
// });

router.get('/new', isLoggedIn, listingControllers.getNewRoute);

router
  .route('/:id')
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    wrapAsync(listingControllers.putEditRoute),
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingControllers.delRoute))
  .get(wrapAsync(listingControllers.showRoute));

router.get(
  '/:id/edit',
  isLoggedIn,
  isOwner,
  wrapAsync(listingControllers.getEditRoute),
);

module.exports = router;
