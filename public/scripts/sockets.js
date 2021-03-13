const socket = io();
var typing=false;
var timeout=undefined;
var user;

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');
var local_username = localStorage.getItem("nickname");
var room = localStorage.getItem("chat-room");
var usersList = document.getElementById('usersList');

socket.emit('join-to-room', { local_username, room });

form.addEventListener('submit', function(e){
    e.preventDefault();
    if(input.value){
        var message = input.value
        socket.emit('chat message', {message, local_username, room});
        input.value = '';
        $("#messages").animate({scrollTop: $('#messages').prop("scrollHeight")}, 1000);
    }
});

socket.on('new-user', (data)=>{
    $('#nav-nick').html(data.username.toUpperCase() + `&nbsp; <i onclick=logout() class="fas fa-sign-out-alt"></i>`);
    $('#nav-room').html("CHAT ROOM: " + data.room.toUpperCase());
});

socket.on('list users', (users) => {
    usersList.innerHTML = '';
    users.forEach((user) => {
        var li_template = $($('#li-template').clone().html());
        li_template.find('#user-socket').html(user.username);
        $('#usersList').append(li_template); 
    });
     
});

socket.on('message', (data)=>{
    var $template = '#message_template-left';
    if(socket.id != data.id){
        $template = '#message_template-right';
    }
    display_messages(data, $template);
});

socket.on('load messages', data => {
    console.log(data);
     data.messages.reverse().forEach(message => { 
        var $template = '#message_template-left';
        var $time_stamp = new Date(message.timestamp).toLocaleTimeString('en-US');
        var timestamp = remove_seconds($time_stamp); 
        var clase = data.clase
        var username = message.username
        var message = message.message
        if(local_username==username) $template = '#message_template-right';
        display_messages({username, message, clase, timestamp}, $template);
      });
});

function display_messages(data, $template){
    var img_avatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo7WfE6wFfdpeFph92LdEFJFnula0ecIObiQ&usqp=CAU';
    var message_template = $($($template).clone().html());
    message_template.find('#nick').html(data.username);
    message_template.find('#text-msg').html(data.message).addClass(data.clase);
    message_template.find('#ts').html(data.timestamp); 
    message_template.find('#avatar').addClass('img-avatar').attr("src",img_avatar);
    $('#messages').append(message_template);   
}

$('#input').keypress((e)=>{
    if(e.which!=13){
      typing=true
      socket.emit('typing', {local_username, typing:true, room})
      clearTimeout(timeout)
      timeout=setTimeout(typingTimeout, 2000);
    }else{
      clearTimeout(timeout);
      typingTimeout();
    }
  })

socket.on('display', (data)=>{
    if(data.typing==true)
        $('.typing').text(`${data.local_username} is typing...`)
    else
        $('.typing').text("")
});

function typingTimeout(){
    typing=false
    socket.emit('typing', {username:local_username, typing:false})
}

function logout(){
    const quit = confirm('You are leaving the chatroom! Are you sure?');
    if (quit) {
      window.location = '/';
    } 
}

function remove_seconds($time){
    var $time = $time.substr(0,5) + $time.substr($time.length-2,$time.length); //remove seconds
    return $time;
}


