const socket = io();
const password = 'your_secret_password';

document.getElementById('login-btn').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simulate authentication
    if (username && password) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('chat-container').style.display = 'block';
    }
});

document.getElementById('send-btn').addEventListener('click', () => {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value;
    if (message) {
        const encryptedMessage = CryptoJS.AES.encrypt(message, password).toString();
        socket.emit('chat message', { text: encryptedMessage, user: 'username' });
        messageInput.value = '';
    }
});

document.getElementById('image-input').addEventListener('change', () => {
    const file = document.getElementById('image-input').files[0];
    const reader = new FileReader();
    reader.onload = () => {
        const dataURL = reader.result;
        socket.emit('image', dataURL);
    };
    if (file) {
        reader.readAsDataURL(file);
    }
});

socket.on('chat message', (msg) => {
    const decryptedMessage = CryptoJS.AES.decrypt(msg.text, password).toString(CryptoJS.enc.Utf8);
    const messageElement = document.createElement('div');
    messageElement.textContent = `${msg.user}: ${decryptedMessage}`;
    document.getElementById('messages').appendChild(messageElement);
});

socket.on('image', (data) => {
    const imageElement = document.createElement('img');
    imageElement.src = data;
    imageElement.style.maxWidth = '100%';
    document.getElementById('messages').appendChild(imageElement);
});
