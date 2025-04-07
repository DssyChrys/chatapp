import React, { useEffect, useState, useRef } from 'react';
import { collection, query, orderBy, limit, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { db, auth } from './firebase';
import { format } from 'date-fns';
import { Send } from 'lucide-react';
import './discussion.css';

interface Message {
  id?: string;
  text: string;
  uid: string;
  photoURL: string;
  displayName: string;
  createdAt: any;
}

const Discussion: React.FC = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [formValue, setFormValue] = useState('');

  const messagesRef = collection(db, 'messages');
  const messagesQuery = query(messagesRef, orderBy('createdAt', 'desc'), limit(50));

  const [messages] = useCollectionData(messagesQuery);
  const reversedMessages = messages?.slice().reverse();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formValue.trim() || !auth.currentUser) return;

    const { uid, photoURL, displayName } = auth.currentUser;

    await addDoc(messagesRef, {
      text: formValue,
      uid,
      photoURL,
      displayName,
      createdAt: serverTimestamp(),
    });

    setFormValue('');
    scrollToBottom();
  };

  return (
    <div className="chat">
      <div className="messages">
        {reversedMessages?.map((msg, idx) => (
          <ChatMessage key={idx} message={msg as Message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="input">
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Type a message..."
          className="inputField"
        />
        <button
          type="submit"
          disabled={!formValue.trim()}
          className="sendButton"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const { text, uid, displayName, createdAt } = message;
  const isCurrentUser = uid === auth.currentUser?.uid;

  return (
    <div className={`message ${isCurrentUser ? 'owner' : ''}`}>
      <div className="messageContent">
        <div className="messageUser">{displayName || 'Anonymous'}</div>
        <p className="messageText">{text}</p>
      </div>
      {createdAt && createdAt instanceof Timestamp && (
        <div className="messageTime">
          {format(createdAt.toDate(), 'HH:mm')}
        </div>
      )}
    </div>
  );
};

export default Discussion;
