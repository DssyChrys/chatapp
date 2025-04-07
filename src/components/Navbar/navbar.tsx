import React from 'react';
import './navbar.css';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../Discussion/firebase';
import { Link } from 'react-router-dom';


const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      alert("Déconnexion réussie !");
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  return (
    <div className="sidebar">
      <h2>ChatApp</h2>
      <ul>
        <li title="Discussions">
         <Link to="/home">
            <img 
                src="/conversation.png" 
                alt="Disconnect" 
                style={{ cursor: 'pointer' }}
                />
             </Link>
        </li>
        <li title="Notification">
          <Link to="/notification">
            <img 
              src="/notif.png" 
              alt="Notification" 
              style={{ cursor: 'pointer' }} 
            />
          </Link>
        </li>
        <li title="Se deconnecter">
            <img 
                onClick={handleSignOut} 
                src="/disconnect.png" 
                alt="Disconnect" 
                style={{ cursor: 'pointer' }}
            />
        </li>
      </ul>
    </div>
  );
};

export default Navbar;


/*
import React, { useEffect, useState } from 'react';
import './navbar.css';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Nettoyage de l'écouteur
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      alert("Déconnexion réussie !");
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  return (
    <div className="nav">
      <h3>ChatApp</h3>
      {user && (
        <div className="info">
          <img src="/user.png" alt="User" />
          <h4>{user.displayName || "Utilisateur"}</h4>
          <img 
            onClick={handleSignOut} 
            src="/disconnect.png" 
            alt="Disconnect" 
            style={{ cursor: 'pointer' }}
          />
        </div>
      )}
    </div>
  );
};
*/

