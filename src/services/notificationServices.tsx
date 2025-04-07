// src/services/notificationService.ts

import { 
    getToken, 
    onMessage, 
    Messaging 
  } from "firebase/messaging";
  import { 
    doc, 
    setDoc, 
    collection, 
    query, 
    where, 
    getDocs, 
    addDoc, 
    serverTimestamp, 
    Timestamp 
  } from 'firebase/firestore';
  import { auth, db, messaging } from '../components/Discussion/firebase';
  
  // Type pour les notifications
  export interface Notification {
    id?: string;
    recipientId: string;
    senderId: string;
    senderName: string;
    message: string;
    read: boolean;
    createdAt: Timestamp;
  }
  
  const VAPID_KEY = 'BBpCC5UbAzRu3MKOm-8cUYgLK7aFcS6KCx1EMqmtTPFHPA34UTHc4lvnyOi7dJeUipng7TxsxYMTGpXU4cn66uI'; // À remplacer par votre clé publique
  
  class NotificationService {
    
    // Demander la permission et enregistrer le token FCM
    async requestPermissionAndRegisterToken() {
      try {
        // Demander la permission de notification au navigateur
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
          // Obtenir le token FCM
          const token = await getToken(messaging, { vapidKey: VAPID_KEY });
          
          // Enregistrer le token dans Firestore
          if (token && auth.currentUser) {
            const userRef = doc(db, 'users', auth.currentUser.uid);
            await setDoc(userRef, { fcmToken: token }, { merge: true });
            console.log('Token FCM enregistré avec succès');
            return token;
          }
        } else {
          console.log('Permission de notification refusée');
        }
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement du token:', error);
      }
      return null;
    }
  
    // Écouter les messages FCM entrants (pour les notifications en premier plan)
    listenToMessages(callback: (payload: any) => void) {
      return onMessage(messaging, (payload) => {
        callback(payload);
      });
    }
  
    // Stocker une notification dans Firestore
    async storeNotification(notification: Omit<Notification, 'createdAt'>) {
      try {
        const notificationsRef = collection(db, 'notifications');
        await addDoc(notificationsRef, {
          ...notification,
          createdAt: serverTimestamp()
        });
      } catch (error) {
        console.error('Erreur lors du stockage de la notification:', error);
      }
    }
  
    // Récupérer les notifications non lues pour l'utilisateur connecté
    async getUnreadNotifications() {
      if (!auth.currentUser) return [];
      
      try {
        const notificationsRef = collection(db, 'notifications');
        const q = query(
          notificationsRef, 
          where('recipientId', '==', auth.currentUser.uid),
          where('read', '==', false)
        );
        
        const querySnapshot = await getDocs(q);
        const notifications: Notification[] = [];
        
        querySnapshot.forEach((doc) => {
          notifications.push({ id: doc.id, ...doc.data() } as Notification);
        });
        
        return notifications;
      } catch (error) {
        console.error('Erreur lors de la récupération des notifications:', error);
        return [];
      }
    }
  
    // Récupérer toutes les notifications pour l'utilisateur connecté
    async getAllNotifications() {
      if (!auth.currentUser) return [];
      
      try {
        const notificationsRef = collection(db, 'notifications');
        const q = query(
          notificationsRef, 
          where('recipientId', '==', auth.currentUser.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const notifications: Notification[] = [];
        
        querySnapshot.forEach((doc) => {
          notifications.push({ id: doc.id, ...doc.data() } as Notification);
        });
        
        return notifications;
      } catch (error) {
        console.error('Erreur lors de la récupération des notifications:', error);
        return [];
      }
    }
  
    // Marquer une notification comme lue
    async markAsRead(notificationId: string) {
      try {
        const notificationRef = doc(db, 'notifications', notificationId);
        await setDoc(notificationRef, { read: true }, { merge: true });
      } catch (error) {
        console.error('Erreur lors du marquage de la notification comme lue:', error);
      }
    }
  
    // Envoyer une notification lorsqu'un nouveau message est envoyé
    async sendMessageNotification(recipientId: string, message: string) {
      if (!auth.currentUser) return;
      
      try {
        // Récupérer le token FCM du destinataire
        const userRef = doc(db, 'users', recipientId);
        const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', recipientId)));
        
        if (userDoc.empty) return;
        
        const userData = userDoc.docs[0].data();
        const recipientToken = userData.fcmToken;
        
        if (!recipientToken) return;
        
        // Stocker la notification dans Firestore
        await this.storeNotification({
          recipientId,
          senderId: auth.currentUser.uid,
          senderName: auth.currentUser.displayName || 'Utilisateur',
          message,
          read: false
        });
        
        // Pour une application web, les notifications en arrière-plan nécessiteraient 
        // un backend (Cloud Functions) pour envoyer les notifications FCM.
        // Cette partie n'est pas incluse ici et nécessiterait l'ajout de Cloud Functions.
      } catch (error) {
        console.error('Erreur lors de l\'envoi de la notification:', error);
      }
    }
  }
  
  export const notificationService = new NotificationService();
  export default notificationService;