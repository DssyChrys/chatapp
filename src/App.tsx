import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/home/home';
import './App.css';
import NotifPage from './pages/notifPage/notifPage';
import Discussion from './components/Discussion/discussion';

interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
}

const App: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
   
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/notification" element={<NotifPage />} />
        {/* Redirige vers Home si aucun utilisateur n'est sélectionné */}
        <Route
          path="/discussion"
          element={selectedUser ? <Discussion selectedUser={selectedUser} /> : <Navigate to="/home" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
