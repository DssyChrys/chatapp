import React, { useEffect, useState, useRef } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import ChatMessage from './chatmessage';
import { Send } from 'lucide-react';
import './discussion.css';

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [formValue, setFormValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedUser || !auth.currentUser) return;

    const messagesRef = collection(db, 'messages');

    const messagesQuery = query(
      messagesRef,
      where('participants', 'array-contains', auth.currentUser.uid),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const msgs: Message[] = snapshot.docs
        .map((doc) => doc.data() as Message)
        .filter((msg) =>
          (msg.senderId === auth.currentUser?.uid && msg.recipientId === selectedUser.uid) ||
          (msg.senderId === selectedUser.uid && msg.recipientId === auth.currentUser?.uid)
        );
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [selectedUser]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValue.trim() || !auth.currentUser || !selectedUser) return;

    const { uid, photoURL, displayName } = auth.currentUser;

    await addDoc(collection(db, 'messages'), {
      text: formValue,
      uid,
      photoURL,
      displayName,
      createdAt: serverTimestamp(),
      recipientId: selectedUser.uid,
      senderId: uid,
      participants: [uid, selectedUser.uid], // <== utilisé pour array-contains
    });

    setFormValue('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!selectedUser) return <div>Please select a user to chat with.</div>;

  return (
    <div className="chat">
      <div className="info">
        <h3>{selectedUser.displayName}</h3>
      </div>

      <div className="messages">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
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
        <button type="submit" disabled={!formValue.trim()} className="sendButton">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default Discussion;
