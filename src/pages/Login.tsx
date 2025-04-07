import React, { useState, useEffect, FormEvent } from 'react';
import { auth } from '../components/Discussion/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true); // chargement initial
  const [isSubmitting, setIsSubmitting] = useState(false); // bouton
  const navigate = useNavigate();

  // Chargement initial du composant
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 sec de loading
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Affichage du spinner plein écran si la page est en cours de chargement
  if (isLoading) {
    return (
      <div className="loader-wrapper">
        <ClipLoader color="#36d7b7" size={80} />
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="img">
        <img src="/chat.png" alt="" />
      </div>
      <h2>Connexion</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <ClipLoader color="#fff" size={20} /> : "Se connecter"}
        </button>
      </form>
      <p>
        Pas encore de compte ? <a href="/register">S'inscrire</a>
      </p>
    </div>
  );
};

export default Login;
