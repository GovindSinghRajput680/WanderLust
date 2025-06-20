const express = require("express");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema,reviewSchema} = require("../schema.js")
const router =express.Router({mergeParams:true});
//middleware for error handling
const validateListing = (req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }
    else next();
}
//Index Route
router.get("/",wrapAsync(async (req,res,next)=>{
    const allListings = await Listing.find();
    res.render("listings/index.ejs",{allListings});
}));

//New Route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
})
//Show Route
router.get("/:id",wrapAsync(async (req,res,next)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Requested Lising does not exist");
        res.redirect("/listings");
    }
    else res.render("listings/show.ejs",{listing});
}));
//Create Route
router.post("/new",validateListing,wrapAsync(async (req,res,next)=>{
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
}));

//Edit route
router.get("/:id/edit",wrapAsync(async (req,res,next)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
     if(!listing){
        req.flash("error","Requested Lising does not exist");
        res.redirect("/listings");
    }
    else res.render("listings/edit.ejs",{listing});
   
}));

//Update Route
router.put("/:id/edit",validateListing,wrapAsync(async (req,res,next)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,req.body.listing);
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id }= req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}));

module.exports=router