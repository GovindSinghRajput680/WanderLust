const express = require("express");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const router =express.Router({mergeParams:true});
const {isLoggedIn,isOwner,validateListing}= require("../middleware.js");
const listingController = require("../controllers/listings.js");
//Index Route
router.get("/",wrapAsync(listingController.index));
//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);
//Show Route
router.get("/:id",wrapAsync(listingController.showListing));
//Create Route
router.post("/new",isLoggedIn,validateListing,wrapAsync(listingController.creatNewListing));
//Edit route
router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.renderEditForm));

//Update Route
router.put("/:id/edit",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));

//Delete Route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

module.exports=router