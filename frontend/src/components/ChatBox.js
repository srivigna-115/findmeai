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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '600px',
      background: '#000000',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
    }}>
      {/* Messages Container */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        background: '#000000'
      }}>
        {messages.map((msg) => {
          const senderId = msg.sender?._id?.toString() || msg.sender?.toString();
          const currentUserId = user?.id?.toString() || user?._id?.toString();
          const isOwn = senderId === currentUserId;
          return (
            <div
              key={msg._id}
              style={{
                display: 'flex',
                justifyContent: isOwn ? 'flex-end' : 'flex-start',
                marginBottom: '8px',
                alignItems: 'flex-end'
              }}
            >
              {/* Avatar for other person */}
              {!isOwn && (
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  marginRight: '8px',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  {msg.sender.name.charAt(0).toUpperCase()}
                </div>
              )}
              
              <div style={{
                maxWidth: '65%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: isOwn ? 'flex-end' : 'flex-start'
              }}>
                {/* Message bubble */}
                <div style={{
                  background: isOwn 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : '#262626',
                  padding: '10px 16px',
                  borderRadius: '20px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  position: 'relative',
                  wordWrap: 'break-word'
                }}>
                  {/* Message content */}
                  <div style={{
                    fontSize: '0.95rem',
                    color: '#ffffff',
                    lineHeight: '1.4'
                  }}>
                    {msg.content}
                  </div>
                </div>
                
                {/* Timestamp */}
                <div style={{
                  fontSize: '0.7rem',
                  color: '#8e8e8e',
                  marginTop: '4px',
                  marginLeft: isOwn ? '0' : '8px',
                  marginRight: isOwn ? '8px' : '0'
                }}>
                  {format(new Date(msg.createdAt), 'h:mm a')}
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Typing indicator */}
        {typing && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '12px',
            alignItems: 'flex-end'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              marginRight: '8px',
              flexShrink: 0
            }}></div>
            <div style={{
              background: '#262626',
              padding: '10px 16px',
              borderRadius: '20px',
              fontSize: '0.9rem',
              color: '#8e8e8e',
              fontStyle: 'italic'
            }}>
              {typing} is typing...
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={sendMessage} style={{
        display: 'flex',
        padding: '16px',
        background: '#000000',
        borderTop: '1px solid #262626',
        alignItems: 'center'
      }}>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          background: '#262626',
          borderRadius: '24px',
          padding: '8px 16px'
        }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Message..."
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: '0.95rem',
              outline: 'none',
              color: '#ffffff',
              padding: '4px 0'
            }}
          />
        </div>
        <button 
          type="submit"
          disabled={!newMessage.trim()}
          style={{
            marginLeft: '12px',
            padding: '0',
            background: 'transparent',
            color: newMessage.trim() ? '#0095f6' : '#555555',
            border: 'none',
            fontSize: '0.95rem',
            fontWeight: '600',
            cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
            transition: 'color 0.2s'
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
