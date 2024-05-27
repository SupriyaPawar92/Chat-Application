import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

let socket;

export const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        socket = io();

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });
    }, []);

    const sendMessage = async () => {
        if (message) {
            socket.emit('sendMessage', message, 'room1');
            setMessage('');
        }
    };

    const handleImageUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', image);

        try {
            const response = await axios.post('localhost:5000/api/chat/message', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('Image uploaded', response.data.path);
        } catch (error) {
            console.error('Error uploading image', error);
        }
    };

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => (e.key === 'Enter' ? sendMessage() : null)}
            />
            <button onClick={sendMessage}>Send</button>
            <form onSubmit={handleImageUpload}>
                <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                <button type="submit">Upload Image</button>
            </form>
        </div>
    );
}
