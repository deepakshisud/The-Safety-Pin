const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Safetypin = require('../models/safetypin');
const {safetypinSchema} = require('../schemas.js');
const {isLoggedIn, isAuthor, validateSafetypin} = require('../middleware');



router.get('/', catchAsync(async(req, res) => {
    const safetypins = await Safetypin.find({});
    res.render('safetypins/index', {safetypins});
}))

router.get('/new', isLoggedIn, (req,res) => {
    res.render('safetypins/new');
})

router.post('/', isLoggedIn, validateSafetypin, catchAsync (async(req, res) => {
    const safetypin = new Safetypin(req.body.safetypin);
    safetypin.author = req.user._id;
    await safetypin.save();
    req.flash('success','Successfully made a new safetypin')
    res.redirect(`/safetypins/${safetypin._id}`);

}))

router.get('/:id', catchAsync(async(req, res) => {
    const safetypin = await Safetypin.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!safetypin) {
        req.flash('error','Cannot find the safetypin')
         return res.redirect('/safetypins');
    }
    res.render('safetypins/show', {safetypin,});
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async(req,res) => {
    const safetypin = await Safetypin.findById(req.params.id);
    if(!safetypin) {
        req.flash('error','Cannot find the safetypin')
         return res.redirect('/safetypins');
    }
    res.render('safetypins/edit', {safetypin});
}))

router.put('/:id', isLoggedIn, isAuthor, validateSafetypin, catchAsync(async(req,res) => {
    const {id} = req.params;
    const safetypin = await Safetypin.findByIdAndUpdate(id, {...req.body});
    req.flash('success','Successfully updated!');
    res.redirect(`/safetypins/${safetypin._id}`);
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async(req, res) => {
    const {id} = req.params;
    await Safetypin.findByIdAndDelete(id);
    req.flash('success','Successfully deleted!')
    res.redirect('/safetypins');
}))


module.exports = router;