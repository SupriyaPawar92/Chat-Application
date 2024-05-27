require('dotenv').config();
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const { protect } = require('./middleware/authMiddleware');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketio(server);

connectDB();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);

io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    socket.on('join', (room) => {
        socket.join(room);
    });

    socket.on('sendMessage', (message, room) => {
        io.to(room).emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('User has left');
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});