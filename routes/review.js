const express = require("express");
const router =express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js")
const Listing = require("../models/listing.js");
const {validateReview,isLoggedIn,isAuthor}= require("../middleware.js");
const reviewController = require("../controllers/reviews.js");
//New Review Route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//Delete Review Route
router.delete("/:review_id",isLoggedIn,isAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;