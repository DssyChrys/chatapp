import React, { useEffect, useState, useRef } from 'react';
import { collection, query, where, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { db, auth } from './firebase';
import { format } from 'date-fns';
import { Send } from 'lucide-react';
import './discussion.css';
import ChatMessage from './chatmessage';

export interface Message {
  id?: string;
  text: string;
  uid: string;
  photoURL: string;
  displayName: string;
  createdAt: any;
  recipientId: string;
  senderId: string;
}

interface DiscussionProps {
  selectedUser: { uid: string; displayName: string; photoURL: string } | null;
}

const Discussion: React.FC<DiscussionProps> = ({ selectedUser }) => {
  if (!selectedUser) {
    return <div>Please select a user to chat with.</div>;
  }

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [formValue, setFormValue] = useState('');

  const messagesRef = collection(db, 'messages');

  // Requête mise à jour pour récupérer les messages entre l'utilisateur actuel et le destinataire sélectionné
  const messagesQuery = query(
    messagesRef,
    where('recipientId', 'in', [selectedUser.uid, auth.currentUser?.uid]),
    where('senderId', 'in', [selectedUser.uid, auth.currentUser?.uid]),
    orderBy('createdAt', 'asc'),
    limit(50)
  );

  const [messages] = useCollectionData(messagesQuery);

  // Filtrer et trier les messages pour éviter les problèmes liés à createdAt
  const sortedMessages = messages
    ?.filter((msg) => msg.createdAt) // Ignorez les messages sans createdAt
    .sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis()) || [];

  const scrollToBottom = () => {
    console.log('Scrolling to bottom');
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [sortedMessages]);

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
      recipientId: selectedUser.uid,
      senderId: uid,
    });

    setFormValue('');
    scrollToBottom();
  };

  return (
    <div className="chat">
      <div className="info">
        <h3>{selectedUser.displayName}</h3>
      </div>
      <div className="messages">
        {sortedMessages.map((msg, idx) => (
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

export default Discussion;
