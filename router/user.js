const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { storeRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");



router
    .route("/signup")
    .get(userController.renderSignup)
    .post( wrapAsync(userController.signup))


router
    .route("/login")
    .get( userController.renderLogin)
    .post(storeRedirectUrl,
        passport.authenticate('local', 
        { failureRedirect: '/user/login', failureFlash: true }),
        userController.login)
   

router.get("/logout", userController.logout);

module.exports = router;