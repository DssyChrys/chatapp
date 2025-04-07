// src/components/Discussion/discussion.tsx

import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, Timestamp, where } from 'firebase/firestore';
import { auth, db } from './firebase';
import ChatMessage from './chatmessage';
import './discussion.css';
import { notificationService } from '../../services/notificationServices';

export interface Message {
  id?: string;
  text: string;
  uid: string;
  displayName?: string;
  createdAt: Timestamp | null;
  recipientId?: string; // Ajout du destinataire
}

interface DiscussionProps {
  selectedUser: {
    uid: string;
    displayName: string;
  } | null;
}

const Discussion: React.FC<DiscussionProps> = ({ selectedUser }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [formValue, setFormValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Effet pour charger les messages
  useEffect(() => {
    if (!selectedUser) return;
    
    // Référence à la collection des messages
    const messagesRef = collection(db, 'messages');
    
    // Créer une requête pour obtenir les messages entre l'utilisateur courant et le contact sélectionné
    const q = query(
      messagesRef,
      where('participants', 'array-contains', [auth.currentUser?.uid, selectedUser.uid].sort().join('_')),
      orderBy('createdAt')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Message));
      
      setMessages(messagesData);
    });
    
    // Nettoyer l'abonnement lors du démontage du composant
    return () => unsubscribe();
  }, [selectedUser]);

  // Effet pour faire défiler vers le bas lorsque de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formValue.trim() || !auth.currentUser || !selectedUser) return;
    
    try {
      // Créer un ID unique pour les participants (utilisé pour la requête)
      const participantId = [auth.currentUser.uid, selectedUser.uid].sort().join('_');
      
      // Ajouter le message à Firestore
      const messagesRef = collection(db, 'messages');
      await addDoc(messagesRef, {
        text: formValue,
        uid: auth.currentUser.uid,
        displayName: auth.currentUser.displayName,
        createdAt: serverTimestamp(),
        recipientId: selectedUser.uid,
        participants: [participantId] // Stocke l'ID unique pour faciliter les requêtes
      });
      
      // Envoyer une notification
      await notificationService.sendMessageNotification(
        selectedUser.uid,
        `Nouveau message: ${formValue.substring(0, 50)}${formValue.length > 50 ? '...' : ''}`
      );
      
      // Réinitialiser le champ de formulaire
      setFormValue('');
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    }
  };

  return (
    <div className="discussion-container">
      {selectedUser ? (
        <>
          <div className="chat-header">
            <h3>{selectedUser.displayName}</h3>
          </div>
          
          <div className="messages">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={sendMessage} className="message-form">
            <input
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              placeholder="Tapez votre message..."
            />
            <button type="submit" disabled={!formValue.trim()}>➤</button>
          </form>
        </>
      ) : (
        <div className="no-chat-selected">
          <p>Sélectionnez un contact pour commencer à discuter</p>
        </div>
      )}
    </div>
  );
};

export default Discussion;