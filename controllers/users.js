const User = require("../models/user");

module.exports.renderSignUpForm = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signUp = async (req,res)=>{
   try{
        let {username, email, password}=req.body;
        let newuser = new User({username,email});

        let registeredUser = await User.register(newuser,password);
        console.log(registeredUser);

        await req.login(registeredUser,(err)=>{
            if(err){
                return next();
            }
            req.flash("success","Welcome on WanderLust");
            res.redirect("/listings");
        });
   }
   catch(e){
     req.flash("error",e.message);
     res.redirect("/signup");
   }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = (req,res)=>{
        req.flash("success","Welcome back on WanderLust");
        let url = res.locals.requestedUrl || "/listings"
        res.redirect(url);
}

module.exports.logout =(req,res)=>{
    req.logout((err,next)=>{
        if(err){
            req.flash("err","Something went wrong");
            return next();
        }
        req.flash("success","You are logged out")
        res.redirect("/listings");
    });


}