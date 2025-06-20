const express = require("express");
const router =express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const Review = require("../models/review.js")
const {reviewSchema} = require("../schema.js")
const Listing = require("../models/listing.js");

//Reviews
const validateReview = (req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }
    else next();
}
//New Review Route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let listing =await Listing.findById(req.params.listing_id);
    let newReview=  new Review(req.body.review);
    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();
    console.log(newReview);
   // res.send("saved");
    req.flash("success","New Review Created");
    res.redirect(`/listings/${listing._id}`);
}));

//Delete Review Route
router.delete("/:review_id",async(req,res)=>{
    let {listing_id,review_id} = req.params;
    console.log(listing_id);
    //Delete this review from listing first by pull
    await Listing.findByIdAndUpdate(listing_id,{$pull: {reviews:review_id}});
    await Review.findByIdAndDelete(review_id);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${listing_id}`);

});

module.exports = router;