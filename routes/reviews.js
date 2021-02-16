const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')
const Safetypin = require('../models/safetypin');
const Review = require('../models/review');
const {validateReview, isLoggedIn} = require('../middleware');

router.post('/', isLoggedIn, validateReview ,catchAsync(async(req, res) => {
    const safetypin = await Safetypin.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    safetypin.reviews.push(review);
    await review.save();
    await safetypin.save();
    req.flash('success', 'Review added!')
    res.redirect(`/safetypins/${safetypin._id}`);
}))

router.delete('/:reviewId', catchAsync(async(req, res)=> {
    const {id, reviewId} = req.params;
    await Safetypin.findByIdAndUpdate(id, {$pull: {review: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!')
    res.redirect(`/safetypins/${id}`)
}))

module.exports = router;