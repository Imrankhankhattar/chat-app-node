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
    socket.on('chat message', (message, callback) => {
        socket.emit('message', generateMessage('Admin','Welcome to the chat app'))
        socket.broadcast.emit('message', {
            'test': ' a new user connected'
        })
        if (typeof callback === 'function'){
            callback('This is from the server')
        }
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('message', {
            'test': ' a user disconnected'
        })
    })
})

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});