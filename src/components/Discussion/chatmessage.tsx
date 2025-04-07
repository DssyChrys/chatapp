// src/components/chatmessage.tsx
import React from 'react';
import { Message } from './discussion';
import { format } from 'date-fns';
import { auth } from './firebase';
import { Timestamp } from 'firebase/firestore';
import './discussion.css';

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const { text, uid, displayName, createdAt } = message;

  if (!text || !uid || !createdAt) {
    return null;
  }

  const isCurrentUser = uid === auth.currentUser?.uid;

  return (
    <div className={`message ${isCurrentUser ? 'owner' : ''}`}>
      <div className="messageContent">
        <div className="messageUser">{displayName || 'Anonymous'}</div>
        <p className="messageText">{text}</p>
      </div>
      {createdAt instanceof Timestamp && (
        <div className="messageTime">{format(createdAt.toDate(), 'HH:mm')}</div>
      )}
    </div>
  );
};

export default ChatMessage;
