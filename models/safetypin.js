const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SafetypinSchema = new Schema( {
    location: String,
    safety_index: String,
    description: String,
    address: String
})

module.exports = mongoose.model('Safetypin', SafetypinSchema );