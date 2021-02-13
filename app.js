const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ExpressError = require('./utils/ExpressError')
const ejsMate = require('ejs-mate');
const {safetypinSchema, reviewSchema} = require('./schemas.js');
const methodOverride = require('method-override');
const safetypins = require('./routes/safetypins');
const reviews = require('./routes/reviews');


mongoose.connect('mongodb://localhost:27017/safety-pin', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
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


app.use('/safetypins', safetypins);
app.use('/safetypins/:id/reviews', reviews);


app.get('/', (req, res) => {
    res.render('home');
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