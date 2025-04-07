import React, { useState, useEffect, FormEvent } from 'react';
import { auth } from '../components/Discussion/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { db } from '../components/Discussion/firebase'; 
import { setDoc, doc } from 'firebase/firestore'; 
import ClipLoader from 'react-spinners/ClipLoader';
import './Register.css';

const Register: React.FC = () => {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true); // <- par défaut loading
  const [isSubmitting, setIsSubmitting] = useState(false); // <- pour le bouton
  const navigate = useNavigate();

  // Simuler un chargement initial du composant
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // par exemple 1.5s de "chargement"

    return () => clearTimeout(timer);
  }, []);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: nom });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: nom,
        email: user.email,
        photoURL: user.photoURL || '',
      });

      navigate('/home');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loader-wrapper">
        <ClipLoader color="#36d7b7" loading={true} size={100} />
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="img">
        <img src="/chat.png" alt="" />
      </div>
      <h2>Inscription</h2>

      <form onSubmit={handleRegister} className="register-form">
        <input
          type="text"
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <ClipLoader color="#fff" size={20} /> : "S'inscrire"}
        </button>
      </form>

      <p>
        Vous avez déjà un compte ? <a href="/login">Se connecter</a>
      </p>
    </div>
  );
};

export default Register;
