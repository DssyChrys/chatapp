// src/components/Notification/NotificationPage.tsx

import React, { useState, useEffect } from 'react';
import { Notification, notificationService } from '../../services/notificationServices';
import { format } from 'date-fns';
import './NotificationPage.css';
import Navbar from '../Navbar/navbar';
import ClipLoader from 'react-spinners/ClipLoader';

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const fetchedNotifications = await notificationService.getAllNotifications();
        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error('Erreur lors de la récupération des notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      // Mettre à jour l'état local
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
    }
  };

  if (loading) {
    return (
      <div className="notification-page">
        <Navbar />
        <div className="notification-content">
          <div className="loader-wrapper">
            <ClipLoader color="#36d7b7" size={50} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-page">
      <Navbar />
      <div className="notification-content">
        <h2>Notifications</h2>
        
        {notifications.length === 0 ? (
          <p className="no-notifications">Aucune notification pour le moment.</p>
        ) : (
          <div className="notification-list">
            {notifications
              .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
              .map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => !notification.read && notification.id && handleMarkAsRead(notification.id)}
                >
                  <div className="notification-header">
                    <span className="notification-sender">{notification.senderName}</span>
                    <span className="notification-time">
                      {format(notification.createdAt.toDate(), 'dd/MM/yyyy HH:mm')}
                    </span>
                  </div>
                  <div className="notification-message">{notification.message}</div>
                  {!notification.read && (
                    <div className="notification-badge"></div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;