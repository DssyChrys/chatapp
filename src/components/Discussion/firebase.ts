// firebase.ts (mise à jour)
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyBVqEf05JxMihWrkxu8OQjql3juY6TjkGk",
  authDomain: "chatapp-a8088.firebaseapp.com",
  projectId: "chatapp-a8088",
  storageBucket: "chatapp-a8088.firebasestorage.app",
  messagingSenderId: "1096320173422",
  appId: "1:1096320173422:web:51b907f47924122bdf6d7f",
  measurementId: "G-5164QYTNEG"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
export const messaging = getMessaging(app);
export default firebaseConfig;