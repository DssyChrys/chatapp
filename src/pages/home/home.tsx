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
          {/*selectedUser ? <Discussion selectedUser={selectedUser} /> : null*/}
          {selectedUser ? (
            <Discussion selectedUser={selectedUser} />
            ) : (
            <div className="no-user-selected">
                <img src="/drawkit.svg" alt="Veuillez sélectionner un utilisateur" style={{ width: '300px', opacity: 0.6 }} />
                <p style={{ marginTop: '10px', color: '#555' }}>Veuillez sélectionner un utilisateur pour commencer la discussion</p>
            </div>
            )}
        </div>
      </div>
    </div>
  );
}
