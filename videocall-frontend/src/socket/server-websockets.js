import socketIOClient from 'socket.io-client'


export const socketServer = socketIOClient(
    'http://localhost:5000'
);