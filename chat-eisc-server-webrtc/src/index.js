"use strict"

const { Server } = require('socket.io')

const urlClientLocalHost = 'http://localhost:3000'
const urlClientDeploy = '' // pending: api url of the client deploy, e.g. https://chat-eisc.vercel.app
const port = 8000;

const io = new Server({
    cors: {
        origin: [urlClientLocalHost, urlClientDeploy],
    },
});

io.listen(port)

let peers = [];


io.on('connection', (socket) => {
    if (!peers[socket.id]){
        peers[socket.id] = {};
        socket.emit("introduction", Object.keys(peers));
        io.emit("newUserConnected", socket.id);
        console.log("Peer connected with socket.id: ", socket.id,
            ".\n There are ", io.engine.clientsCount, " peers connected."
        );
    }


    socket.on("signal", (to, from, data)=>{
        if (to in peers){
            io.to(to).emit("signal", to, from, data);
        }else{
            console.log("Peer with socket.id: ", to, " not found.");
        }
    });

    

    socket.on("disconnect", () => {
        delete peers[socket.id];
        io.sockets.emit("userDisconnected", socket.id);
        console.log(
            "Peer disconnected with ID",
            socket.id,
            ". There are " + io.engine.clientsCount + " peer(s) connected."
        );
    });
});
