const modelMSG = require('./models/modelMsg');
const {newUserData, listUsers, userLeave} = require('./public/scripts/users-info')
module.exports = function(io){
    let users = [];
    io.on('connection', async (socket)=>{
        var clase = "regular-msg";
        let messages = await modelMSG.find({}).limit(8).sort('-timestamp');
        socket.emit('load messages', {messages, clase});

        socket.on('join-to-room', data => {
            const user_logged = {
                username: data.local_username,
                room: data.room
                };

            socket.join(data.room);
            var message =  `${data.local_username} has joined...`;
            var clase = "new-user-msg";
            socket.broadcast.to(data.room).emit('message', {message, clase});
            socket.emit('new-user', user_logged);
            newUserData(socket.id, data.local_username, data.room);
            io.to(data.room).emit('list users', listUsers(data.room))
        });

        socket.on('disconnect', ()=>{
            const user = userLeave(socket.id);
            var clase = "bye-user-msg";
            if (user) {
              var message =  `${user.username} has left the chat`;
              io.to(user.room).emit('message', {message, clase});
              io.to(user.room).emit('list users', listUsers(user.room)); 
            } else {
                console.log(user);
            }
            connectedUsers();
        });

        socket.on('disconnecting', (reason) => {
            for(const room of socket.rooms){
                if(room !== socket.id){
                    socket.to(room).emit("User has left", socket.id);
                }
            }
        });

        socket.on('chat message', (data)=>{
            var message = data.message;
            var clase = "regular-msg"
            var username = data.local_username;
            var timestamp = time_stamp();
            var id = socket.id;
            new modelMSG ({
                username: username,
                message: message
            }).save();
            io.to(data.room).emit('message', {id, username, message, clase, timestamp});

        });

        socket.on('typing', (data) => {
            io.emit('display', data);
        });

        function connectedUsers(){
            const count = io.engine.clientsCount;
            console.log('Total Connected Users -> ' + count);
        }

        function time_stamp(){
            var $time = new Date().toLocaleTimeString('en-US'); //get time only
            var $time = $time.substr(0,5) + $time.substr($time.length-2,$time.length); //remove seconds
            return $time;
        }
    });
}