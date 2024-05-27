// const express = require('express');
// const jwt = require('jsonwebtoken');
// const Message = require('../models/message');
// const crypto = require('crypto');

// const router = express.Router();
// const SECRET_KEY = process.env.JWT_SECRET;

// // Middleware to authenticate the token
// const authenticateToken = (req, res, next) => {
//     const token = req.headers['authorization'];
//     if (!token) return res.sendStatus(401);

//     jwt.verify(token, SECRET_KEY, (err, user) => {
//         console.log(err)
//         if (err) return res.sendStatus(403);
//         req.user = user;
//         next();
//     });
// };

// // API endpoint to send a message
// router.post('/send', authenticateToken, async (req, res) => {
//     const { content, type } = req.body;

//     // Encrypt the message content
//     const cipher = crypto.createCipher('aes-256-cbc', SECRET_KEY);
//     let encryptedContent = cipher.update(content, 'utf8', 'hex');
//     encryptedContent += cipher.final('hex');

//     const message = new Message({
//         sender: req.user.username,
//         content: encryptedContent,
//         type: type,
//     });

//     await message.save();

//     // Broadcast the message to all connected clients
//     req.app.get('io').emit('message', {
//         sender: req.user.username,
//         content: encryptedContent,
//         type: type,
//     });

//     res.status(201).send('Message sent');
// });

// module.exports = router;