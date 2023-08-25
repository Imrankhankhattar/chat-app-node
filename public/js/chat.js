let socket = io();
let users = []
let name 
function scrollToBottom() {
    const messages = document.querySelector('#messages').lastElementChild
    messages.scrollIntoView()
}

socket.on('connect', function () {
    let searchQuery = window.location.search.substring(1);
    let params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g, '":"') + '"}');
    name = params.name
    socket.emit('join', params)
});

socket.on('updateUserList', function (usersList) {
    users = usersList
    const ol = document.createElement('ol')
    users.forEach(user => {
        const li = document.createElement('li')
        li.innerHTML = user
        ol.appendChild(li)
    }
    )
    const userList = document.querySelector('#users')
    userList.innerHTML = ''
    userList.appendChild(ol)    

});

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
    scrollToBottom()
});
socket.on('location', function (message) {
    const formattedTime = moment(message.createdAt).format('LT');
    const template = document.querySelector('#loc-msg-template').innerHTML
    const data = {
        from: message.from,
        url: message.text,
        createdAt: formattedTime
    }
    const html = Mustache.render(template, data)
    const div = document.createElement('div');
    div.innerHTML = html
    document.querySelector('#messages').append(div);
    scrollToBottom()
});

document.querySelector('#submit-btn').addEventListener('click', function (e) {
    e.preventDefault()
    socket.emit('chat message', {
        from: name,
        text: document.querySelector('input[name="message"]').value
    })
})
document.querySelector('#location').addEventListener('click', function (e) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            socket.emit('location', {
                from: name,
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