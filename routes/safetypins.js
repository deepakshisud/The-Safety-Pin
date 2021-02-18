const express = require('express');
const router = express.Router();
const safetypins = require('../controllers/safetypins');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Safetypin = require('../models/safetypin');
const {safetypinSchema} = require('../schemas.js');
const {isLoggedIn, isAuthor, validateSafetypin} = require('../middleware');

router.route('/')
    .get(catchAsync(safetypins.index))
    .post(isLoggedIn, validateSafetypin, catchAsync (safetypins.createPin));

    
router.get('/new', isLoggedIn, safetypins.newForm)

router.route('/:id')
    .get( catchAsync(safetypins.showPins))
    .put( isLoggedIn, isAuthor, validateSafetypin, catchAsync(safetypins.updatePin)) 
    .delete( isLoggedIn, isAuthor, catchAsync(safetypins.deletePin))
    


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(safetypins.editForm))



module.exports = router;