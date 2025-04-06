import React, { useEffect, useState, useRef } from 'react';
import { collection, query, orderBy, limit, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { db, auth } from './firebase'; // Assurez-vous que ce fichier existe et est correctement configuré.
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
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {reversedMessages?.map((msg, idx) => (
            <ChatMessage key={idx} message={msg as Message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t bg-white">
        <div className="flex items-center gap-2">
          <input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!formValue.trim()}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const { text, uid, photoURL, displayName, createdAt } = message;
  const isCurrentUser = uid === auth.currentUser?.uid;

  return (
    <div className={`flex items-end gap-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <img
        src={photoURL || `https://api.dicebear.com/7.x/avatars/svg?seed=${uid}`}
        alt="avatar"
        className="w-8 h-8 rounded-full"
      />
      <div className={`max-w-[70%] ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-100'} rounded-2xl px-4 py-2`}>
        <div className="text-sm font-medium mb-1">
          {displayName || 'Anonymous'}
        </div>
        <p className="break-words">{text}</p>
        {createdAt && createdAt instanceof Timestamp && (
          <div className="text-xs opacity-75 mt-1">
            {format(createdAt.toDate(), 'HH:mm')}
          </div>
        )}
      </div>
    </div>
  );
};

export default Discussion;
