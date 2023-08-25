const express = require('express');
const path = require('path');
const http = require('http');
const socket = require('socket.io');

const app = express();
const port = 3001;
const { generateMessage, isRealString } = require('./utils/message')
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));
const server = http.createServer(app);
const io = socket(server);
const { User } = require('./utils/user')
let users = new User()
io.on('connection', (socket) => {
    // Notify all other users when a new user connects
    // socket.broadcast.emit('message', generateMessage({
    //     text: 'A new user connected',
    //     from: 'Admin'
    // }));
    // // welcome user
    // socket.emit('message', generateMessage({
    //     from: 'Admin',
    //     text: 'Welcome!'
    // }))
    socket.on('chat message', (message) => {
        const user = users.getUser(socket.id)
        if (user && isRealString(message.text)) {
            io.to(user.room).emit('message', generateMessage({
                from: user.name,
                text: message.text
            }))
        }
    });
    socket.on('join', (params) => {
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        socket.join(params.room);
        const user = users.getUser(socket.id);
        if (user) {
            // Send a welcome message to the user who joined
            socket.emit('message', generateMessage({
                from: 'Admin',
                text: `Welcome to the ${params.room}`
            }));

            // Send a message to all other users in the room
            socket.broadcast.to(params.room).emit('message', generateMessage({
                from: 'Admin',
                text: `${params.name} has joined`
            }));

            // Update user list for everyone in the room
            io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        }
    });
    socket.on('location', (message) => {
        try {
            const user = users.getUser(socket.id)
            io.to(user.room).emit('location', generateMessage(message));
        } catch (error) {
            console.log(error)
        }
    });

    socket.on('disconnect', () => {
        const user = users.removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room))
            io.to(user.room).emit('message', generateMessage({
                from: 'Admin',
                text: `${user.name} has left`
            }))
        }

    });
});


server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

