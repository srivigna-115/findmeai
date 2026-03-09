import React from 'react';
import { useParams } from 'react-router-dom';
import ChatBox from '../components/ChatBox';

const Chat = () => {
  const { chatRoomId } = useParams();

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 2rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>Chat</h2>
      <ChatBox chatRoomId={chatRoomId} />
    </div>
  );
};

export default Chat;
