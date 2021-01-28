const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Safetypin = require('./models/safetypin');
const { captureRejectionSymbol } = require('events');

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


app.get('/', (req, res) => {
    res.render('home');
})

app.get('/addNew', async (req, res) => {
    const place = new Safetypin({location : 'Grand Plaza', description: 'A shopping center in Palampur'});
    await place.save();
    res.send(place);
})

app.listen(3000, () => {
    console.log("Listening on port 3000");
})