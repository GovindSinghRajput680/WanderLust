const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./review")
const listingSchema = new Schema({
    title:{
        type:String,
        required: true
    },
    description:String,
    image:{
        type:String,
        set: (v)=> v === "" ? "https://unsplash.com/photos/a-farm-house-with-a-red-roof-surrounded-by-trees-nwGeGSqpRbo" : v
    },
    country:String,
    price: Number,
    location:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:Review
    }]
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
