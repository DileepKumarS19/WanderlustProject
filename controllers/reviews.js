const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = (async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("message", " New Review Added");

    res.redirect(`/listings/${listing._id}`);
});

module.exports.destroyReview = ( async(req, res) =>{
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id , {$pull: { reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("message", "Review Deleted");
    res.redirect(`/listings/${id}`);
});