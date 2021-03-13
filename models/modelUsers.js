const mongoose = require('mongoose');
const schema = mongoose.Schema;

const db = require ('../database/db');

const userSchema = new schema({
    username : {type: String, required: true},
    password: {type: String, required: true},
    image: {type: String},
});

module.exports = mongoose.model('users', userSchema);