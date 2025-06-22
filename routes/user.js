const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport")
const {requestedUrl}=require("../middleware.js");
const userControllers= require("../controllers/users.js");
//To get signUp page
router.get("/signup",userControllers.renderSignUpForm);
//register new user
router.post("/signup",wrapAsync(userControllers.signUp));
//Login page
router.get("/login",userControllers.renderLoginForm);
//Login
router.post("/login",requestedUrl,passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash:true
    }), 
    userControllers.login
)
router.get("/logout",userControllers.logout);
module.exports= router;