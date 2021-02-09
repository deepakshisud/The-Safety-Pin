const { func } = require('joi');
const mongoose = require('mongoose');
const Review = require('./review');
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

SafetypinSchema.post('findOneAndDelete', async function(doc)  {
    if(doc) {
        await Review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Safetypin', SafetypinSchema );