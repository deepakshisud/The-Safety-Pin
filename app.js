const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError')
const ejsMate = require('ejs-mate');
const {safetypinSchema, reviewSchema} = require('./schemas.js');
const Safetypin = require('./models/safetypin');
const methodOverride = require('method-override');
const Review = require('./models/review');
const safetypins = require('./routes/safetypins');


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


const validateSafetypin = (req,res,next) => {
    const {error} = safetypinSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg , 400);
    } else {
        next();
    }
}

const validateReview = (req,res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg , 400);
    } else {
        next();
    }
}

app.use('/safetypins', safetypins)


app.get('/', (req, res) => {
    res.render('home');
})



app.post('/safetypins/:id/reviews', validateReview ,catchAsync(async(req, res) => {
    const safetypin = await Safetypin.findById(req.params.id);
    const review = new Review(req.body.review);
    safetypin.reviews.push(review);
    await review.save();
    await safetypin.save();
    res.redirect(`/safetypins/${safetypin._id}`);
}))

app.delete('/safetypins/:id/reviews/:reviewId', catchAsync(async(req, res)=> {
    const {id, reviewId} = req.params;
    await Safetypin.findByIdAndUpdate(id, {$pull: {review: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/safetypins/${id}`)
}))

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