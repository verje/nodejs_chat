var mongoose = require('mongoose');

var mongoDB = 'mongodb://127.0.0.1/chat';

var db = mongoose.connect(mongoDB, {useNewUrlParser: true});
mongoose.connection.once('open',function(){
    console.log('Database connected Successfully');
}).on('error',function(err){
    console.log('Error', err);
})

module.exports = db;