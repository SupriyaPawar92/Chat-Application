// Develop a real-time chat application using Node.js that includes features like: 
// 1. user authentication

// 2.message encryption

// 3.and the ability to send images. 
// Ensure the application is scalable and can handle a large number of concurrent users. 
// Additionally, provide documentation on the architecture and explain how you addressed potential security concerns.

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const dotenv = require('dotenv');
const connectDB = require('./config/database.js');
const passport = require('passport');
const session = require('express-session');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'your_secret_key', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(multer({ dest: 'uploads/' }).single('image'));

app.use('/crypto-js', express.static(path.join(__dirname, 'node_modules/crypto-js')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/upload'));
app.use('/api/messages', require('./routes/messages'));

function encrypt(text, password) {
    const cipher = crypto.createCipher('aes-256-cbc', password);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function decrypt(encryptedText, password) {
    const decipher = crypto.createDecipher('aes-256-cbc', password);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

const SECRET_KEY = process.env.JWT_SECRET;

const authenticateSocket = (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return next(new Error('Authentication error'));
        socket.user = user;
        next();
    });
};

// Socket.io
io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('chat message', (msg) => {
        const decryptedMessage = decrypt(msg.text, 'your_secret_key');
        io.emit('chat message', { text: msg.text, user: msg.user });
    });

    socket.on('image', (data) => {
        io.emit('image', data);
    });
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// io.use(authenticateSocket);

// io.on('connection', (socket) => {
//     console.log(`User connected: ${socket.user.username}`);

//     socket.on('message', async ({ content, type }) => {
//         const encryptedContent = crypto.createCipher('aes-256-cbc', SECRET_KEY).update(content, 'utf8', 'hex') + crypto.createCipher('aes-256-cbc', SECRET_KEY).final('hex');
//         const message = new Message({ sender: socket.user.username, content: encryptedContent, type });
//         await message.save();
//         io.emit('message', { sender: socket.user.username, content: encryptedContent, type });
//     });

//     socket.on('disconnect', () => {
//         console.log(`User disconnected: ${socket.user.username}`);
//     });
// });

server.listen(3000, () => {
    console.log('Server running on port 3000');
});