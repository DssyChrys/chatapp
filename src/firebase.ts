import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);