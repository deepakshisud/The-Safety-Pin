const mongoose = require('mongoose');
const cities = require('./cities');
const p = require('./seedHelpers');
const Safetypin = require('../models/safetypin');

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

const sample = array => array[Math.floor(Math.random()*15)];

const seedDB = async () => {
    await Safetypin.deleteMany({});
    for(let i=0;i<50;i++) {
        const random47 = Math.floor(Math.random()*47);
        const places = new Safetypin( {
            address: `${cities[random47].accentcity}`,
            location: `${sample(p[0])} ${sample(p[1])}`
        })
        await places.save();
    }
}

seedDB();