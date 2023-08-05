const express = require('express');
const path = require('path');
const http = require('http');
const socket = require('socket.io');

const app = express();
const port = 3001;

const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));
const server = http.createServer(app);
const io = socket(server);




io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', (message) => {
    console.log('Received message:', message);
    socket.emit('message',{
        from: 'Admin',
        text: 'Welcome to the chat app'
    })
    socket.broadcast.emit('chat message', message);
  })

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  })
})

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});