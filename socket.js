'use strict';

const socketIO = require('socket.io');

module.exports = (server) => {
    const io = socketIO(server);
    io.on('connection', (socket) => {
        socket.on('chatMessage', (data) => {
            io.emit('chatMessage', data);
        })
    });
}