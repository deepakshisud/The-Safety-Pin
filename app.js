if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ExpressError = require('./utils/ExpressError')
const session = require('express-session');
const flash = require('connect-flash');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const Safetypin = require('./models/safetypin');


const safetypinRoutes = require('./routes/safetypins');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');


mongoose.connect('mongodb://localhost:27017/safety-pin', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const app = express();
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, '/views'));
app.engine('ejs',ejsMate);
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));

const sessionConfig = {
    secret: 'asecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fakeUser', async(req, res) => {
    const user = new User({ email: "deepakshisud@gmail.com" ,username: "Deepakshi"});
    const newUser = await User.register(user,'shining123');
    res.send(newUser);
})

app.use('/safetypins', safetypinRoutes);
app.use('/safetypins/:id/reviews', reviewRoutes);
app.use('/',userRoutes);


app.get('/', async(req, res) => {
    const safetypins = await Safetypin.find({});
    res.render('home', {safetypins});
})


app.all('*',(req,res,next) => {
    next(new ExpressError('Page Not found',404));
})

app.use((err,req,res,next) => {
    const {statusCode = 500,} = err;
    if(!err.message) err.message = "Something went wrong";
    res.status(statusCode).render('error',{err});
})

app.listen(3000, () => {
    console.log("Listening on port 3000");
})