if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
};

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./router/listing.js");
const reviewRouter = require("./router/review.js");
const userRouter = require("./router/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash =  require("connect-flash");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/user.js");
const dbUrl = process.env.ATLASDB_URL;



app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);



const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,

});
store.on("error", () => {
    console.log("error in mongo session store"), err
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
     cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 *1000,
        maxAge: 7 * 24 * 60 * 60 *1000,
        httpOnly: true,
  }
};

app.listen(8080, () => {
    console.log("listening at port 8080");
});

main()
    .then(()=>{
        console.log("connected to DB")
    })
    .catch((err) => {
        console.log(err);
    });

    async function main(){
    await mongoose.connect(dbUrl);
};

// root
// app.get("/", (req, res) =>{
//     res.send("working");
// });

// app.get("/demoUser", async(req, res) => {
//     let newUser = new User({
//         email: "dileep@gamil.com",
//         username: "dili",
//     });

//     let registerdUser = await User.register(newUser, "password");
//     res.send(registerdUser);
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use( new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.message = req.flash("message");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// app.use((req, res, next) => {
//     res.locals.error = req.flash("success");
//     next();
// });



// listing routes
app.use("/listings", listingRouter);

// review - post route
app.use("/listings/:id/reviews", reviewRouter);

app.use("/user", userRouter);

// errror handling middleware
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found"));
    
});

app.use( (err, req , res, next) =>{
    let {statusCode=400, message="page not found"} = err;
    res.status(statusCode).render("error.ejs", { statusCode, message })
    
});



