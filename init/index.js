const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
main().then(()=>{
    console.log("connected successfully");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}
const initDB = async ()=>{
    await Listing.deleteMany();
    initData.data=initData.data.map(obj=>({...obj,owner:new mongoose.Types.ObjectId('6859526dc6e56c8cdaebc7d5')}));
    await Listing.insertMany(initData.data);
    console.log("Data successfully initialised.");
}
initDB();