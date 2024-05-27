const mongoose = require('mongoose');
const crypto = require('crypto');

const MessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
}, { timestamps: true });

MessageSchema.methods.encryptContent = function (content, secret) {
    const cipher = crypto.createCipher('aes-256-ctr', secret);
    let encrypted = cipher.update(content, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

MessageSchema.methods.decryptContent = function (content, secret) {
    const decipher = crypto.createDecipher('aes-256-ctr', secret);
    let decrypted = decipher.update(content, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

module.exports = mongoose.model('Message', MessageSchema);