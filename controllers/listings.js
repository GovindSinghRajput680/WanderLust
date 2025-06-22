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
    
    newlisting.owner = req.user._id;
    console.log(req.user);
    await newlisting.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
}
module.exports.renderEditForm = async (req,res,next)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
     if(!listing){
        req.flash("error","Requested Lising does not exist");
        res.redirect("/listings");
    }
    else res.render("listings/edit.ejs",{listing});
}

module.exports.updateListing=async (req,res,next)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,req.body.listing);
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