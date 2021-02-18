const {safetypinSchema, reviewSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Safetypin = require('./models/safetypin');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}


module.exports.validateSafetypin = (req,res,next) => {
    const {error} = safetypinSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg , 400);
    } else {
        next();
    }
}

module.exports.isAuthor = async(req, res, next) => {
    const {id} = req.params;
    const safetypin = await Safetypin.findById(id);
    if(!safetypin.author.equals(req.user._id)) {
        req.flash('error', 'Unauthorized user');
        return res.redirect(`/safetypins/${safetypin._id}`)
    } else {
        next();
    }
}

module.exports.validateReview = (req,res, next) => {
    console.log(req.body);
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg , 400);
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async(req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)) {
        req.flash('error', 'Unauthorized user');
        return res.redirect(`/safetypins/${id}`)
    } else {
        next();
    }
}
