const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users');
const { route } = require('./safetypins');

router.route('/register')
.get( users.registerForm)
.post( catchAsync(users.register))

router.route('/login')
.get(users.loginForm)
.post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login )

router.get('/logout', users.logout);

module.exports = router; 