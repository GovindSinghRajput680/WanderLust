if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter= require("./routes/review.js");
const userRouter= require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy =require("passport-local");
const User = require("./models/user.js");

const app = express();
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const port = 8080;
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")))
async function main(){
    await mongoose.connect(MONGO_URL);
}
main().then(()=>{
    console.log("connected with database");
}).catch((err)=>{
    console.log(err);
});
app.listen(port,()=>{
    console.log(`port is lilstening on ${port}.`);
});

// app.get("/",(req,res)=>{
//     res.send("server is woriking good.");
// });

const sessionOptions= {
    secret:"mysecretkey",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});
// app.get("/demouser",async (req,res)=>{
//     let fakeUser = new User({
//         username:"Ramji",
//         email:"ram@gmail.com"
//     });
//     let registeredUser = await User.register(fakeUser,"1234");
//     res.send(registeredUser);


// });
//Listing all routes
app.use("/listings",listingRouter)
//Review all routes
app.use("/listings/:listing_id/reviews",reviewRouter);
app.use("/",userRouter);

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});
app.use((err,req,res,next)=>{
    let {statusCode=500,message = "something went wrong!"} =err;
    //console.log(err);
    res.status(statusCode).render("error.ejs",{message});
});
