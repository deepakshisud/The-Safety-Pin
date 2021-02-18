const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users');
const { route } = require('./safetypins');

router.route('/register')
.get('/register',  users.registerForm)
.post('/register', catchAsync(users.register))

router.route('/login')
.get('/login', users.loginForm)
.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login )

router.get('/logout', users.logout);

module.exports = router; 