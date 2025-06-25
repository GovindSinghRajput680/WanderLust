const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router =express.Router({mergeParams:true});
const {isLoggedIn,isOwner,validateListing}= require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const{ storage}=require("../cloudConfig.js");
const upload = multer({ storage });
//Index Route
router.route("/")
    .get(wrapAsync(listingController.index));
//New Route
router.route("/new")
    .get(isLoggedIn,listingController.renderNewForm)
    .post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.creatNewListing));
//Edit route
router.route("/:id/edit")
    .get(isLoggedIn,wrapAsync(listingController.renderEditForm));

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

module.exports=router