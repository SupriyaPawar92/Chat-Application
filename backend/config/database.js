const mongoose = require('mongoose');
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
const connectDB = async () => {
    console.log('Connecting to')
    try {
        await mongoose.connect("mongodb+srv://supriya:supriya@cluster0.pktodbd.mongodb.net/chat_app_db", options);
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        // process.exit(1);
    }
};

module.exports = connectDB;