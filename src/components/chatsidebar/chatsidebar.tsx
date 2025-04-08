import React, { useEffect, useState } from 'react';
import './chatsidebar.css';
import Navbar from '../navbar/navbar';
import { db, auth } from '../Discussion/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
}

interface ChatsidebarProps {
  onSelectUser: (user: User) => void;
}

export default function Chatsidebar({ onSelectUser }: ChatsidebarProps) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const currentUserUid = auth.currentUser?.uid;
      if (!currentUserUid) return; // Empêche de continuer si l'utilisateur n'est pas encore chargé

      const userCol = collection(db, "users");
      const userSnapshot = await getDocs(userCol);

      const userList = userSnapshot.docs
        .map((doc) => doc.data() as User)
        .filter((user) => user.uid !== currentUserUid); // Exclut l'utilisateur connecté

      setUsers(userList);
    };

    fetchUsers();
  }, []);

  const handleUserSelect = (user: User) => {
    onSelectUser(user); // Met à jour l'utilisateur sélectionné dans Home
  };

  return (
    <div className='home'>
      <div className="container">
        <Navbar />
      </div>
      <div className="chat">
        {users.map((user) => (
          <div className="userchat" key={user.uid} onClick={() => handleUserSelect(user)}>
            <img src={user.photoURL || "/user.png"} alt={user.displayName} />
            <div className='userchatinfo'>
              <span>{user.displayName}</span>
              <p></p> {/* Tu peux ajouter ici un aperçu du dernier message si tu veux */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
