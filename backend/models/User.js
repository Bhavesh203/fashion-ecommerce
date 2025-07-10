const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    image: String,
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
});

module.exports = mongoose.model('User', userSchema);
