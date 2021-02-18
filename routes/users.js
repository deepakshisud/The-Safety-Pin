const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users');
const { route } = require('./safetypins');

router.get('/register',  users.registerForm);



router.get('/login', users.loginForm);

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login )

router.post('/register', catchAsync(users.register))

router.get('/logout', users.logout);

module.exports = router; 