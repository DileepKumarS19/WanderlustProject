const express = require("express");
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({storage })



router
    .route("/")
    .get( wrapAsync(listingController.index))
    .post(isLoggedIn,
        upload.single('listing[image]'),
         validateListing,        
        wrapAsync(listingController.createNewListing));
    
    
router.get("/new", isLoggedIn, listingController.renderNewForm);


router
    .route("/:id")
    .get( wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner,
        upload.single('listing[image]'),
         validateListing,
         wrapAsync(listingController.renderEditPage));


router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

// delete route / destroy route

router.delete("/:id/delete", isLoggedIn, isOwner,  wrapAsync(listingController.destroyListing));

module.exports = router;