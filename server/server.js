const express = require('express');
const path = require('path');
const http = require('http');
const socket = require('socket.io');

const app = express();
const port = 3001;
const { generateMessage } = require('./utils/message')
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));
const server = http.createServer(app);
const io = socket(server);





io.on('connection', (socket) => {
    // Notify all other users when a new user connects
    socket.broadcast.emit('message', {
      'test': 'A new user connected'
    });
    // welcome user
    socket.emit('message', generateMessage({
        from: 'Admin',
        text: 'Welcome!'
    }))
    socket.on('chat message', (message) => {
      // Broadcast the message to all other users except the sender
      socket.broadcast.emit('message', generateMessage(message));
    });
  
    socket.on('disconnect', () => {
      // Notify all other users when a user disconnects
      socket.broadcast.emit('message', {
        'test': 'A user disconnected'
      });
    });
  });
  

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

