const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./review");

const listingSchema = new Schema({
    title:{
        type:String,
        required: true
    },
    description:String,
    image:{
        type:String,
        set: (v)=> v === "" ? "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg" : v
    },
    country:String,
    price: Number,
    location:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:Review
    }]
});

listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
