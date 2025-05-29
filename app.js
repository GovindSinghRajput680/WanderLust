const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js")
const joi = require('joi');
const {listingSchema,reviewSchema} = require("./schema.js")
const Review = require("./models/review.js")



const app = express();
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust'
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

app.get("/",(req,res)=>{
    res.send("server is woriking good.");
});

//Index Route
app.get("/listings",wrapAsync(async (req,res,next)=>{
    const allListings = await Listing.find();
    res.render("listings/index.ejs",{allListings});
}));

//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})
//Show Route
app.get("/listings/:id",wrapAsync(async (req,res,next)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}));
//middleware for error handling
const validateListing = (req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }
    else next();
}
const validateReview = (req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }
    else next();
}
//Create Route
app.post("/listings/new",validateListing,wrapAsync(async (req,res,next)=>{
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
}));

//Edit route
app.get("/listings/:id/edit",wrapAsync(async (req,res,next)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//Update Route
app.put("/listings/:id/edit",validateListing,wrapAsync(async (req,res,next)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,req.body.listing);
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id",async (req,res)=>{
    let {id }= req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    res.redirect("/listings");
});

//Reviews
//New Review Route
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
    let listing =await Listing.findById(req.params.id);
    let newReview=  new Review(req.body.review);
    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();
    console.log(newReview);
   // res.send("saved");
    res.redirect(`/listings/${listing._id}`);
}));
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});
app.use((err,req,res,next)=>{
    let {statusCode=500,message = "something went wrong!"} =err;
    //console.log(err);
    res.status(statusCode).render("error.ejs",{message});
});
// app.get("/testing",async (req,res)=>{
//         let sampleListing = new Listing(
//         { title:"Rajput House",
//             country:"India",
//             location:"Shajapur,MP",
//             price:100000,
//             description:"Peacfull place"
//         }
//         );
//         await sampleListing.save();
//         console.log("data added successfully");
//         res.send("tested successfully");
//     }
// );