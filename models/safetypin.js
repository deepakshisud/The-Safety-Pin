const { func } = require('joi');
const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url : String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});


const SafetypinSchema = new Schema( {
    location: String,
    images : [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum : ['Point'],
            required: true
        },
        coordinates : {
            type: [Number],
            required: true
        }
    },
    safety_index: Number,
    description: String,
    address: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

SafetypinSchema.post('findOneAndDelete', async function(doc)  {
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Safetypin', SafetypinSchema );