const Message = require('../models/message');
const User = require('../models/User');

// exports.sendMessage = async (req, res) => {
//     console.log(req.body)
//     const { content, chatId } = req.body;
//     const userId = req.user.id;
//     console.log(Message)
//     try {
//         const message = await Message.create({
//             sender: userId,
//             content: Message.encryptContent(content, process.env.MESSAGE_SECRET),
//             chat: chatId,
//         });
//         res.status(201).json(message);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// exports.getMessages = async (req, res) => {
//     const { chatId } = req.params;
//     try {
//         const messages = await Message.find({ chat: chatId }).populate('sender', 'username');
//         const decryptedMessages = messages.map((message) => ({
//             ...message._doc,
//             content: Message.decryptContent(message.content, process.env.MESSAGE_SECRET),
//         }));
//         res.json(decryptedMessages);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// const getMessages = async (req, res) => {
//     const { chatId } = req.params;

//     try {
//         const messages = await Message.find({ chat: chatId }).populate('user', 'username');
//         const decryptedMessages = messages.map((msg) => ({
//             ...msg._doc,
//             content: msg.decryptContent(),
//         }));
//         res.json(decryptedMessages);
//     } catch (error) {
//         console.error('Error fetching messages', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// const sendMessage = async (req, res) => {
//     const { chatId, content } = req.body;

//     try {
//         const message = new Message({
//             chat: chatId,
//             user: req.user.id,
//             content, // This will be encrypted in the pre-save middleware
//         });

//         const savedMessage = await message.save();
//         res.json(savedMessage);
//     } catch (error) {
//         console.error('Error sending message', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// module.exports = { getMessages, sendMessage };

const mongoose = require('mongoose');
// const Message = require('../models/Message');
const Chat = require('../models/Chat');

const getMessages = async (req, res) => {
    const { chatId } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(chatId)) {
            return res.status(400).json({ message: 'Invalid chat ID' });
        }

        const messages = await Message.find({ chat: chatId }).populate('user', 'username');
        const decryptedMessages = messages.map((msg) => ({
            ...msg._doc,
            content: msg.decryptContent(),
        }));
        res.json(decryptedMessages);
    } catch (error) {
        console.error('Error fetching messages', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const sendMessage = async (req, res) => {
    const { chatId, content } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(chatId)) {
            return res.status(400).json({ message: 'Invalid chat ID' });
        }

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        const message = new Message({
            chat: chatId,
            user: req.user.id,
            content, // This will be encrypted in the pre-save middleware
        });

        const savedMessage = await message.save();
        res.json(savedMessage);
    } catch (error) {
        console.error('Error sending message', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getMessages, sendMessage };