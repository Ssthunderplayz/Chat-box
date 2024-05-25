import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import './Chat.css';

const Chat = () => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const socket = socketIOClient('http://localhost:4000');

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on('typing', (data) => {
      setTyping(data.typing);
    });
  }, [socket]);

  const handleJoinRoom = () => {
    socket.emit('join_room', { username, room });
  };

  const handleSendMessage = () => {
    socket.emit('send_message', { message, room });
    setMessage('');
  };

  const handleTyping = () => {
    socket.emit('typing', { typing: true, room });
  };

  const handleStopTyping = () => {
    socket.emit('typing', { typing: false, room });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>{room}</h2>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <span className="username">{message.username}</span>
            <span className="message-text">{message.message}</span>
          </div>
        ))}
        {typing && <div className="typing">...</div>}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          onFocus={handleTyping}
          onBlur={handleStopTyping}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
