var socket = io()
socket.on('connect', () => {
    console.log('connected to server');
    socket.emit('connected', {'message' : 'client is connected'});
})

socket.on('connected', (data) => {
    console.log(data['message']);
})

socket.on('disconnect', () => {
    console.log('disconnected from server');
})

