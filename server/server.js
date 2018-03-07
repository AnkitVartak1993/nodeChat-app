const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');
const {Users} = require('./utils/users');
const {isRealString} = require('./utils/validation');
const {generateLocationMessage, generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);

var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on("connection",(socket)=>{
    console.log("New user connected");
    socket.on('join', (params,callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room))
        {  
            callback('Name and Room are required');
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        socket.emit('newMessage',{
            from:'Admin',
            text:'Welcome to chat room',
            createdAt: new Date().getDate()
        });

        socket.broadcast.to(params.room).emit('newMessage',{
            from:'Admin',
            text:`${params.name} has joined`,
            createdAt: new Date().getDate()
        });
        callback();
    });

    
    socket.on('createMessage', (msg,callback)=>{
        var user = users.getUser(socket.id)
        if(user && isRealString(msg.text)){
            io.to(user.room).emit('newMessage',{
                from: user.name,
                text: msg.text,
                createdAt: new Date().getDate()
            });
        }
        callback();
    });

    socket.on('createLocationMessage', (coords)=>{
        var user = users.getUser(socket.id)
        io.emit('newLocationMessage', generateLocationMessage (user.name,coords.latitude,coords.longitude));
    });

    socket.on('disconnect', ()=>{
        var user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
        console.log("Disconnected from server");
    });
    
});


server.listen(port,()=>{
    console.log(`server started ${port}`);
});

