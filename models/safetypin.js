const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SafetypinSchema = new Schema( {
    location: String,
    image :String,
    safety_index: Number,
    description: String,
    address: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

module.exports = mongoose.model('Safetypin', SafetypinSchema );