// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/home/home';
import './App.css';
import NotifPage from './pages/notifPage/notifPage';
import Discussion from './components/Discussion/discussion';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/notification" element={<NotifPage />} />
        <Route path="/discussion" element={<Discussion />} />
      </Routes>
    </Router>
  );
};

export default App;
