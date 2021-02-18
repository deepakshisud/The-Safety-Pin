const User = require('../models/user');


module.exports.registerForm = (req,res) => {
    res.render('users/register');
}

module.exports.loginForm = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', "Welcome back");
    const redirectUrl = req.session.returnTo || '/safetypins';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.register = async(req, res, next) => {
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err=> {
            if(err) return next(err);
            req.flash('success', "Successfully registered");
            res.redirect('/safetypins');
        })
    } catch(e) {
        req.flash('error',e.message);
        res.redirect('register');
    }
}

module.exports.logout = (req, res) => {
    req.logOut();
    req.flash('success', "Successfully logout");
    res.redirect('/safetypins');
}