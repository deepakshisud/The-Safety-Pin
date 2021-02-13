const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')
const Safetypin = require('../models/safetypin');
const {safetypinSchema} = require('../schemas.js');


const validateSafetypin = (req,res,next) => {
    const {error} = safetypinSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg , 400);
    } else {
        next();
    }
}

router.get('/', catchAsync(async(req, res) => {
    const safetypins = await Safetypin.find({});
    res.render('safetypins/index', {safetypins});
}))

router.get('/new', (req,res) => {
    res.render('safetypins/new');
})

router.post('/', validateSafetypin, catchAsync (async(req, res) => {
    const safetypin = new Safetypin(req.body.safetypin);
    await safetypin.save();
    req.flash('success','Successfully made a new safetypin')
    res.redirect(`/safetypins/${safetypin._id}`);

}))

router.get('/:id', catchAsync(async(req, res) => {
    const safetypin = await Safetypin.findById(req.params.id).populate('reviews');
    if(!safetypin) {
        req.flash('error','Cannot find the safetypin')
         return res.redirect('/safetypins');
    }
    res.render('safetypins/show', {safetypin,});
}))

router.get('/:id/edit', catchAsync(async(req,res) => {
    const safetypin = await Safetypin.findById(req.params.id);
    if(!safetypin) {
        req.flash('error','Cannot find the safetypin')
         return res.redirect('/safetypins');
    }
    res.render('safetypins/edit', {safetypin});
}))

router.put('/:id', validateSafetypin, catchAsync(async(req,res) => {
    const {id} = req.params;
    const safetypin = await Safetypin.findByIdAndUpdate(id, {...req.body.safetypin});
    req.flash('success','Successfully updated!');
    res.redirect(`/safetypins/${safetypin._id}`);
}))

router.delete('/:id', catchAsync(async(req, res) => {
    const {id} = req.params;
    await Safetypin.findByIdAndDelete(id);
    req.flash('success','Successfully deleted!')
    res.redirect('/safetypins');
}))


module.exports = router;