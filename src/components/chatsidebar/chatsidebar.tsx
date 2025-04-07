import React, { useEffect, useState } from 'react';
import './chatsidebar.css';
import Navbar from '../navbar/navbar';
import { db } from '../Discussion/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { auth } from '../Discussion/firebase';

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
      const userCol = collection(db, "users");
      const userSnapshot = await getDocs(userCol);

      const currentUserUid = auth.currentUser?.uid;
      const userList = userSnapshot.docs
        .map((doc) => doc.data() as User)
        .filter((user) => user.uid !== currentUserUid);

      setUsers(userList);
    };

    fetchUsers();
  }, []);

  const handleUserSelect = (user: User) => {
    onSelectUser(user); // Met à jour l'état de l'utilisateur sélectionné dans Home
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
              <p></p> {/* Pour afficher le dernier message */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
