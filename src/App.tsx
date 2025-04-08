// src/App.tsx

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './components/Discussion/firebase';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/home/home';
import NotificationPage from './components/Notification/notifPage';
import { notificationService } from './services/notificationServices';
import './App.css';

function App() {
  useEffect(() => {
    // Configurer les écouteurs d'authentification
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Demander la permission de notification et enregistrer le token FCM
        await notificationService.requestPermissionAndRegisterToken();
        
        // Configurer l'écouteur pour les messages en premier plan
        notificationService.listenToMessages((payload) => {
          // Afficher une notification du navigateur
          if (Notification.permission === 'granted') {
            const title = payload.notification?.title || 'Nouveau message';
            const body = payload.notification?.body || 'Vous avez reçu un nouveau message';
            
            new Notification(title, {
              body,
              icon: '/chat.png'
            });
          }
        });
      }
    });
    
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;