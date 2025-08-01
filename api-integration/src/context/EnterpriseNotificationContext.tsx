'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: Date;
}

interface EnterpriseNotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const defaultContext: EnterpriseNotificationContextType = {
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  clearNotifications: () => {},
};

const EnterpriseNotificationContext = createContext<EnterpriseNotificationContextType>(defaultContext);

export const useEnterpriseNotifications = () => useContext(EnterpriseNotificationContext);

export const EnterpriseNotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notificationsList, setNotificationsList] = useState<Notification[]>([]);

  const unreadCount = notificationsList.filter(n => !n.read).length;

  const addNotification = ({ title, message, type }: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      message,
      type,
      read: false,
      timestamp: new Date(),
    };
    
    setNotificationsList(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotificationsList(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotificationsList(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotificationsList([]);
  };

  return (
    <EnterpriseNotificationContext.Provider 
      value={{ 
        notifications: notificationsList, 
        unreadCount, 
        addNotification, 
        markAsRead, 
        markAllAsRead, 
        clearNotifications 
      }}
    >
      {children}
    </EnterpriseNotificationContext.Provider>
  );
}; 