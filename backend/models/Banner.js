const mongoose = require('mongoose');

const bannerSchema= new mongoose.Schema({
    image: {type: String, required: true},
    title: {type: String},
    description: {type: String}
})

module.exports = mongoose.model('Banner', bannerSchema);