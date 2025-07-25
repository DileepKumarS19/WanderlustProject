const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = (async (req, res) =>{
    let allListings = await Listing.find({});
    // console.log(allListings);
    
    res.render("listings/index.ejs", { allListings } );
});


module.exports.renderNewForm = (req, res) =>{
    res.render("listings/new.ejs");
};

module.exports.showListing = (async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({path: "reviews", 
         populate:{
            path: "author"
        }
    })
    .populate("owner");
    if(!listing){
        req.flash("error", "Listing Not Found");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});

});


module.exports.createNewListing = (async (req, res, next) =>{
    let response = await geocodingClient
        .forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()
    ;

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename};
    newListing.geometry = response.body.features[0].geometry
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("message", "New Listing Created Succesfully");
    // console.log(newListing);
     res.redirect("/listings");
});

module.exports.renderEditPage = (async (req, res, next) => {
    
    let {id} = req.params; 
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined" ){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("message", " Listing Edited Succesfully");
    res.redirect(`/listings/${id}`);
});

module.exports.editListing = (async (req, res) =>{
    
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing Not Found");
        return res.redirect(`/listings`);
    }

    let originalListingImage = listing.image.url;
    // console.log(`first:${originalListingImage}`);
    originalListingImage = originalListingImage.replace("/upload", "/upload/h_100")
    // console.log(`sec:${originalListingImage}`);
    
    res.render("listings/edit.ejs", {listing, originalListingImage});
});

module.exports.destroyListing = (async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("message", " Listing Deleted Succesfully");
    res.redirect("/listings");
});