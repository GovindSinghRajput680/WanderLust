const Listing = require("./models/listing.js");
const Review =require("./models/review.js")
const {listingSchema,reviewSchema}=require("./schema.js")
module.exports.isLoggedIn = (req,res,next)=>{
    req.session.requestedUrl = req.originalUrl;
    if(!req.isAuthenticated()){
        req.flash("error","You must be logged in");
        return res.redirect("/login");
    }
    next();
}

module.exports.requestedUrl= (req,res,next)=>{
    res.locals.requestedUrl=req.session.requestedUrl;
    next();
}

module.exports.isOwner=async (req,res,next)=>{
    let {id }= req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    console.log(res.locals.currUser);
    next();
}
module.exports.isAuthor=async (req,res,next)=>{
    let {review_id,listing_id}= req.params;
    let review = await Review.findById(review_id);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this review");
        return res.redirect(`/listings/${listing_id}`);
    }
    next();
}

//middleware to validate listings
module.exports.validateListing = (req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }
    else next();
}
//midllware to validate review
module.exports.validateReview = (req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }
    else next();
}
