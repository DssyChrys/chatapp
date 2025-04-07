import React, { useState } from 'react';
import Chatsidebar from '../../components/chatsidebar/chatsidebar';
import Discussion from '../../components/Discussion/discussion';
import './home.css';

interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
}

export default function Home() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <div className="main">
      <div className="box">
        <div className="son1">
          {/* Passer la fonction setSelectedUser à Chatsidebar */}
          <Chatsidebar onSelectUser={setSelectedUser} />
        </div>
        <div className="son2">
          {/* Si un utilisateur est sélectionné, afficher la discussion */}
          {selectedUser ? <Discussion selectedUser={selectedUser} /> : null}
        </div>
      </div>
    </div>
  );
}
