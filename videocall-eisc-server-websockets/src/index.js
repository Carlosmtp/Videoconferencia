const { Server } = require('socket.io');
require('dotenv').config();
const urlClient = process.env.FRONTEND_URL;
const port = process.env.PORT || 5001;

const io = new Server({
    cors: {
        origin: [urlClient],
    },
});

const users = new Map(); // Using Map to store users by socket.id

io.listen(port);

io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}. Current active connections: ${io.engine.clientsCount}`);
    
    socket.on('check-room-status', () => {
        if (users.size >= 2) {
            socket.emit("room-full");
        } else {
            socket.emit("room-available");
        }
    });

    if (users.size >= 2) {
        socket.emit("full-house");
        console.log("Room is full");
        return;
    }

    socket.on("data-user", (userData) => {
        // Store user data associated with socket.id
        users.set(socket.id, {
            id: socket.id,
            name: userData.name,
            email: userData.email,
            photoUrl: userData.photoUrl,
        });
        updateUsers();
    });

    socket.on('offer', (data) => {
        // Broadcast offer to all other clients
        socket.broadcast.emit('offer', data);
    });

    socket.on('answer', (data) => {
        // Broadcast answer to all other clients
        socket.broadcast.emit('answer', data);
    });

    socket.on('candidate', (data) => {
        // Broadcast ICE candidate to all other clients
        socket.broadcast.emit('candidate', data);
    });

    socket.on("disconnect", () => {
        if (users.has(socket.id)) {
            const { name, email } = users.get(socket.id);
            users.delete(socket.id);
            updateUsers();
            console.log(`User disconnected: ${name} (${email}). Current active connections: ${io.engine.clientsCount}`);
        }
    });

    socket.on("powerOff", () => {
        // Broadcast powerOff signal to all clients
        socket.broadcast.emit("powerOff");
    });

    function updateUsers() {
        io.emit("users", Array.from(users.values())); // Broadcast updated user list
        console.log(`Current active users: ${users.size}`);
    }
});
