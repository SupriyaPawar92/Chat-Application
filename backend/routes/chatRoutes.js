const express = require('express');
const { sendMessage, getMessages } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/message', protect, sendMessage);
router.get('/messages/:chatId', protect, getMessages);

module.exports = router;