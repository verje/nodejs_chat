const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');

require('./server')(io);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(routes);

app.set('view engine', 'ejs');
app.set("views", __dirname + "/views");

http.listen(3000, ()=>{
    console.log('listening on *: 3000');
})