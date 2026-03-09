import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';

const ChatBox = ({ chatRoomId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const socket = useSocket();
  const { user } = useAuth();
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (socket && chatRoomId) {
      // Join room
      socket.emit('join-room', { chatRoomId });

      // Load existing messages
      loadMessages();

      // Listen for new messages
      socket.on('new-message', (message) => {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      });

      // Listen for typing
      socket.on('user-typing', ({ userName }) => {
        setTyping(userName);
      });

      socket.on('user-stop-typing', () => {
        setTyping(false);
      });

      return () => {
        socket.off('new-message');
        socket.off('user-typing');
        socket.off('user-stop-typing');
      };
    }
  }, [socket, chatRoomId]);

  const loadMessages = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/chat/${chatRoomId}/messages`
      );
      setMessages(res.data.messages);
      scrollToBottom();
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTyping = () => {
    socket.emit('typing', { chatRoomId });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop-typing', { chatRoomId });
    }, 1000);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    socket.emit('send-message', {
      chatRoomId,
      content: newMessage
    });

    setNewMessage('');
    socket.emit('stop-typing', { chatRoomId });
  };

  return (
    <div className="chat-box">
      <div className="messages-container">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`message ${msg.sender._id === user.id ? 'own' : 'other'}`}
          >
            <div className="message-sender">{msg.sender.name}</div>
            <div className="message-content">{msg.content}</div>
            <div className="message-time">
              {format(new Date(msg.createdAt), 'HH:mm')}
            </div>
          </div>
        ))}
        {typing && <div className="typing-indicator">{typing} is typing...</div>}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="message-input-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          placeholder="Type a message..."
          className="message-input"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
};

export default ChatBox;
