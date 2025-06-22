const Review = require("../models/review");
const Listing = require("../models/listing");
module.exports.createReview = async(req,res)=>{
    let listing =await Listing.findById(req.params.listing_id);
    let newReview=  new Review(req.body.review);
    newReview.author = req.user._id;
    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();
    console.log(newReview);
   // res.send("saved");
    req.flash("success","New Review Created");
    res.redirect(`/listings/${listing._id}`);
}
module.exports.destroyReview = async(req,res)=>{
    let {listing_id,review_id} = req.params;
    console.log(listing_id);
    //Delete this review from listing first by pull
    await Listing.findByIdAndUpdate(listing_id,{$pull: {reviews:review_id}});
    await Review.findByIdAndDelete(review_id);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${listing_id}`);
}
