"use strict"

const { Server } = require('socket.io')

const urlClientLocalHost = 'http://localhost:3000'
const urlClientDeploy = '' // pending: api url of the client deploy, e.g. https://chat-eisc.vercel.app
const port = 5000

const io = new Server({
    cors: {
        origin: [urlClientLocalHost, urlClientDeploy],
    },
});

io.listen(port)

const users = []; // Here we will store the socket number, not the user id or name


io.on('connection', (socket) => {
    console.log("socket.id: ", socket.id,
        ".\n There are ", io.engine.clientsCount, " users connected."
    );


    socket.on("data-user", (valuesUser)=>{
        const user = users.find((user) => user.id === socket.id);
        if (!user){
            const newUser = {
                id: socket.id,
                name: valuesUser.name,
                email: valuesUser.email,
            };
        }
        users.push(newUser);
        io.emit("users", users);
    })

    socket.on("new-message", (newMessage) => {
        console.log("newMessage: ", newMessage);
        io.emit("new-message", newMessage);
    });

    socket.on("disconnect", () => {
        const index = users.findIndex((user) => user.id === socket.id);
        if (index !== -1){
            users.splice(index, 1);
            io.emit("users", users);
            console.log("User disconnected with socket.id: ", socket.id,
                ".\n There are ", io.engine.clientsCount, " users connected."
            );
        }
    });
});
