const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema= new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        mx:5  
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});

module.exports= mongoose.model("Review",reviewSchema);