const mongoose = require('mongoose');
const crypto = require('crypto');

// Define encryption and decryption functions
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32); // Replace with a consistent key stored securely
const iv = crypto.randomBytes(16);

// exports.encrypt = (text) => {
//     let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
//     let encrypted = cipher.update(text);
//     encrypted = Buffer.concat([encrypted, cipher.final()]);
//     return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
// };

const encrypt = (text) => {
    const iv = crypto.randomBytes(16); // Generate a random IV each time
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedData: encrypted };
};

const decrypt = (text) => {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

const messageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    iv: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Pre-save middleware to encrypt message content
messageSchema.pre('save', function (next) {
    if (this.isModified('content')) {
        const encryptedContent = encrypt(this.content);
        this.content = encryptedContent.encryptedData;
        this.iv = encryptedContent.iv;
    }
    next();
});

// Method to decrypt content
messageSchema.methods.decryptContent = function () {
    return decrypt({ iv: this.iv, encryptedData: this.content });
};

module.exports = mongoose.model('Message', messageSchema);