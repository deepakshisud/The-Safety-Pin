const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
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

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/safetypins', async(req, res) => {
    const safetypins = await Safetypin.find({});
    res.render('safetypins/index', {safetypins});
})

app.get('/safetypins/new', (req,res) => {
    res.render('safetypins/new');
})

app.post('/safetypins', async(req, res) => {
    const safetypin = new Safetypin(req.body.safetypin);
    await safetypin.save();
    res.redirect(`/safetypins/${safetypin._id}`);
})

app.get('/safetypins/:id', async(req, res) => {
    const safetypin = await Safetypin.findById(req.params.id);
    res.render('safetypins/show', {safetypin});
})

app.get('/safetypins/:id/edit', async(req,res) => {
    const safetypin = await Safetypin.findById(req.params.id);
    res.render('safetypins/edit', {safetypin});
})

app.put('/safetypins/:id', async(req,res) => {
    const {id} = req.params;
    const safetypin = await Safetypin.findByIdAndUpdate(id, {...req.body.safetypin});
    res.redirect(`/safetypins/${safetypin._id}`);
})

app.delete('/safetypins/:id', async(req, res) => {
    const {id} = req.params;
    await Safetypin.findByIdAndDelete(id);
    res.redirect('/safetypins');
})



app.listen(3000, () => {
    console.log("Listening on port 3000");
})