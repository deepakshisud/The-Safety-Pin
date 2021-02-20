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
        var index = Math.floor(Math.random()*10);
        const places = new Safetypin( {
            author: '602a2a47a8afb63cecf559de',
            address: `${cities[random47].accentcity}`,
            location: `${sample(p[0])} ${sample(p[1])}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/dlx3t2epk/image/upload/v1613719108/Safetypin/pf6vg2zzvnvaroddmlm1.jpg',
                  filename: 'Safetypin/pf6vg2zzvnvaroddmlm1'
                },
                {
                  url: 'https://res.cloudinary.com/dlx3t2epk/image/upload/v1613719108/Safetypin/yaweoqbsxakabepn4efk.jpg',
                  filename: 'Safetypin/yaweoqbsxakabepn4efk'
                }
              ],
            geometry: { type: 'Point', coordinates: [ 76.53, 32.12 ] },
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut quis aliquam sunt quos officiis eaque, animi beatae molestias praesentium consequuntur vitae numquam veritatis harum ducimus blanditiis ad nobis consectetur esse.',
            safety_index: index,
        })
        await places.save();
    }
}

seedDB();