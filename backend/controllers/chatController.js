const Message = require('../models/Message');
const User = require('../models/User');

exports.sendMessage = async (req, res) => {
    const { content, chatId } = req.body;
    const userId = req.user.id;
    try {
        const message = await Message.create({
            sender: userId,
            content: Message.encryptContent(content, process.env.MESSAGE_SECRET),
            chat: chatId,
        });
        res.status(201).json(message);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getMessages = async (req, res) => {
    const { chatId } = req.params;
    try {
        const messages = await Message.find({ chat: chatId }).populate('sender', 'username');
        const decryptedMessages = messages.map((message) => ({
            ...message._doc,
            content: Message.decryptContent(message.content, process.env.MESSAGE_SECRET),
        }));
        res.json(decryptedMessages);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};