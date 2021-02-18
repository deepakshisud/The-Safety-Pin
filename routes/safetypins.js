const express = require('express');
const router = express.Router();
const safetypins = require('../controllers/safetypins');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Safetypin = require('../models/safetypin');
const {safetypinSchema} = require('../schemas.js');
const {isLoggedIn, isAuthor, validateSafetypin} = require('../middleware');



router.get('/', catchAsync(safetypins.index))

router.get('/new', isLoggedIn, safetypins.newForm)

router.post('/', isLoggedIn, validateSafetypin, catchAsync (safetypins.createPin));

router.get('/:id', catchAsync(safetypins.showPins))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(safetypins.editForm))

router.put('/:id', isLoggedIn, isAuthor, validateSafetypin, catchAsync(safetypins.updatePin))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(safetypins.deletePin))


module.exports = router;