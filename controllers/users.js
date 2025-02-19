const User = require("../models/user");

module.exports.renderSignup = (req, res) => {
    res.render("users/signup.ejs"); 
}

module.exports.signup = ( async(req, res) => {
    try{
        let {username, email, password } = req.body;
        let newUser = new User({
            username: username,
            email: email,
        });
        let registerdUser = await User.register(newUser, password);
        // console.log(registerdUser);
        req.login(registerdUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("message", "Welcome to Wanderlust")
            res.redirect("/listings");
        })
        
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/user/signup")
    }
   
});


module.exports.renderLogin =  (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async(req, res) => {
    req.flash("message", "Login Sucessfully");
    let finalUrl = res.locals.redirectUrl || "/listings" ;
    res.redirect(finalUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err){
            next(err);
        }
        req.flash("message", "Logged Out Sucessfully" );
        res.redirect("/listings");
    });
}