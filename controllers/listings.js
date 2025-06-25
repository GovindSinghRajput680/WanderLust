const Listing =require("../models/listing.js");


module.exports.index = async (req,res,next)=>{
    const allListings = await Listing.find();
    res.render("listings/index.ejs",{allListings});
}
module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
}
module.exports.showListing=async (req,res,next)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate : {
        path:"author"
    }}).populate("owner");
    if(!listing){
        req.flash("error","Requested Lising does not exist");
        res.redirect("/listings");
    }
    else res.render("listings/show.ejs",{listing});
}
module.exports.creatNewListing = async (req,res,next)=>{
    const newlisting = new Listing(req.body.listing);
    let url = req.file.path;
    let fileName = req.file.filename;
    newlisting.owner = req.user._id;
    newlisting.image.url = url;
    newlisting.image.fileName =fileName;
    console.log(newlisting);
    await newlisting.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
}
module.exports.renderEditForm = async (req,res,next)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    let originalImgUrl=listing.image.url;
    originalImgUrl = originalImgUrl.replace("/upload", "/upload/w_250");
    if(!listing){
        req.flash("error","Requested Lising does not exist");
        res.redirect("/listings");
    }
    else res.render("listings/edit.ejs",{listing,originalImgUrl});
}

module.exports.updateListing=async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file != "undefined"){
        let url =req.file.path;
        let fileName = req.file.filename;
        listing.image= {url,fileName};
        await listing.save();
    }
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
}
module.exports.destroyListing=async (req,res)=>{
    let {id }= req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}