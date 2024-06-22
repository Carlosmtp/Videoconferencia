import socketIOClient from 'socket.io-client'


export const socketServer = socketIOClient(
    process.env.REACT_APP_SOCKET_SERVER_URL
);