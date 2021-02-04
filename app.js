const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError')
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const Safetypin = require('./models/safetypin');
const methodOverride = require('method-override');

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
    const safetypinSchema = Joi.object( {
        safetypin: Joi.object({
            location: Joi.string().required(),
            safety_index: Joi.number().required().min(0),
            image:Joi.string().required(),
            address:Joi.string().required(),
            description:Joi.string().required(),
        }).required()
    })

    const {error} = safetypinSchema.validate(req.body);

    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg , 400);
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/safetypins', catchAsync(async(req, res) => {
    const safetypins = await Safetypin.find({});
    res.render('safetypins/index', {safetypins});
}))

app.get('/safetypins/new', (req,res) => {
    res.render('safetypins/new');
})

app.post('/safetypins', validateSafetypin, catchAsync (async(req, res) => {
    // if(!req.body.safetypin) throw new ExpressError('Invalid data',400)
    const safetypin = new Safetypin(req.body.safetypin);
    await safetypin.save();
    res.redirect(`/safetypins/${safetypin._id}`);

}))

app.get('/safetypins/:id', catchAsync(async(req, res) => {
    const safetypin = await Safetypin.findById(req.params.id);
    res.render('safetypins/show', {safetypin});
}))

app.get('/safetypins/:id/edit', catchAsync(async(req,res) => {
    const safetypin = await Safetypin.findById(req.params.id);
    res.render('safetypins/edit', {safetypin});
}))

app.put('/safetypins/:id', validateSafetypin, catchAsync(async(req,res) => {
    const {id} = req.params;
    const safetypin = await Safetypin.findByIdAndUpdate(id, {...req.body.safetypin});
    res.redirect(`/safetypins/${safetypin._id}`);
}))

app.delete('/safetypins/:id', catchAsync(async(req, res) => {
    const {id} = req.params;
    await Safetypin.findByIdAndDelete(id);
    res.redirect('/safetypins');
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