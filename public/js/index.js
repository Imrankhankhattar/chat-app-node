let socket = io();
socket.on('connect', function () {
    socket.emit('chat message', {
        from: 'User',
        text: 'Hi'
    }, function (msg) {
        console.log('Got it');
    })
});
socket.on('disconnect', function () {
    console.log('Disconnected to server');
});
socket.on('message', function (msg) {
    console.log('msg->', msg);
});
socket.emit('chat message', {
    from: 'Imran',
    text: 'Hi'
}, function (msg) {
    console.log('Got it');
})