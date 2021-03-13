const mongoose = require('mongoose');
const schema = mongoose.Schema;

const db = require ('../database/db');

const msgSchema = new schema({
    username : {type: String, required: true},
    message: {type: String},
    timestamp: {type: Date, default: Date.now},
});

module.exports = mongoose.model('messages', msgSchema);