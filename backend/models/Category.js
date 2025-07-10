const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String },   // base64 or file path
    banner: { type: String },  // base64 or file path
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
