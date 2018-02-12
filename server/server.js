const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);

var io = socketIO(server);


app.use(express.static(publicPath));

io.on("connection",(socket)=>{
    console.log("New user connected");
    
    socket.emit('newMessage',{
    from:"test@test.com",
    text:"test msg",
    createdAt: 11022018
    });

    socket.on('createMessage', (msg)=>{
    console.log(msg);
    });

   socket.on('disconnect', ()=>{
        console.log("Disconnected from server");
    });
    
});






server.listen(port,()=>{
    console.log(`server started ${port}`);
});

