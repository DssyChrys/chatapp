// public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBVqEf05JxMihWrkxu8OQjql3juY6TjkGk",
  authDomain: "chatapp-a8088.firebaseapp.com",
  projectId: "chatapp-a8088",
  storageBucket: "chatapp-a8088.firebasestorage.app",
  messagingSenderId: "1096320173422",
  appId: "1:1096320173422:web:51b907f47924122bdf6d7f",
  measurementId: "G-5164QYTNEG"
});

// Récupérer une instance de Firebase Messaging
const messaging = firebase.messaging();

// Configuration des notifications en arrière-plan
messaging.onBackgroundMessage((payload) => {
  console.log('Message reçu en arrière-plan:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/chat.png'
  };
  
  self.registration.showNotification(notificationTitle, notificationOptions);
});