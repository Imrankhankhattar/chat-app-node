// const moment = require("./libs/moment");

let socket = io();
// socket.on('connect', function () {
//     socket.emit('chat message', {
//         from: 'User',
//         text: 'Hi'
//     }, function (msg) {
//         console.log('Got it');
//     })
// });
socket.on('disconnect', function () {
    console.log('Disconnected to server');
});
socket.on('location message', function (msg) {
    if (msg) {
        const formattedTime = moment(msg.createdAt).format('LT')
        const li = document.createElement('li')
        const a = document.createElement('a')
        a.setAttribute('target', '_blank')
        a.setAttribute('href', msg.text)
        li.innerHTML(`${msg.from} :${formattedTime}`)
        a.innerHTML = `My current Location`
        li.appendChild(a)
        document.querySelector('body').appendChild(li)
    }
});
socket.on('message', function (message) {
    const formattedTime = moment(message.createdAt).format('LT');
    const template = document.querySelector('#msg-template').innerHTML
    const data = {
        from: message.from,
        text: message.text,
        createdAt: formattedTime
      }
    const html = Mustache.render(template, data)
    const div = document.createElement('div');
    div.innerHTML = html
    document.querySelector('#messages').append(div);
});
socket.on('location', function (message) {
    // console.log('message',message)
    // const formattedTime = moment(message.createdAt).format('LT');
    // const a = document.createElement('a')
    // const li = document.createElement('li')
    // li.innerText = `${message.from} ${formattedTime}`
    // a.setAttribute('target','_blank')
    // a.setAttribute('href',message.text)
    // a.innerText = 'My current location'
    // li.appendChild(a)
    // document.querySelector('#messages').appendChild(li);
    const formattedTime = moment(message.createdAt).format('LT');
    const template = document.querySelector('#loc-msg-template').innerHTML
    const data = {
        from: message.from,
        url: message.text,
        createdAt: formattedTime
      }
    console.log('data',data)
    const html = Mustache.render(template, data)
    const div = document.createElement('div');
    div.innerHTML = html
    document.querySelector('#messages').append(div);
});

document.querySelector('#submit-btn').addEventListener('click', function (e) {
    e.preventDefault()
    socket.emit('chat message', {
        from: 'User',
        text: document.querySelector('input[name="message"]').value
    })
})
document.querySelector('#location').addEventListener('click', function (e) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            socket.emit('location', {
                from: 'User',
                text: `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`,
                createdAt: new Date().getTime(),
                lat: position.coords.latitude,
                long: position.coords.longitude
            })
        }, function () {
            alert('Unable to fetch location')
        })
    }
    else {
        alert('Geolocation not supported by your browser')
    }

})