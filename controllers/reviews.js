const Safetypin = require('../models/safetypin');
const Review = require('../models/review');

module.exports.createReview = async(req, res) => {
    const safetypin = await Safetypin.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    safetypin.reviews.push(review);
    await review.save();
    await safetypin.save();
    req.flash('success', 'Review added!')
    res.redirect(`/safetypins/${safetypin._id}`);
}

module.exports.deleteReview = async(req, res)=> {
    const {id, reviewId} = req.params;
    await Safetypin.findByIdAndUpdate(id, {$pull: {review: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!')
    res.redirect(`/safetypins/${id}`)
}