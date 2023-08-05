let socket = io();
socket.on('connect', function () {
    console.log('Connected to server');
    socket.emit('chat message',{
        from: 'User',
        text: 'Hi'
    })
});
socket.on('disconnect', function () {
    console.log('Disconnected to server');
});
socket.on('message', function (msg) {
    console.log('msg->',msg);
});
