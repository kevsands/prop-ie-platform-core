'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/context/ProductionAuthContext';
import { useTransaction } from '@/context/TransactionContext';
import { api } from '@/lib/api-client';
import { useToast } from '@/components/ui/use-toast';

export interface Notification {
  id: string;
  type: 'TRANSACTION' | 'DOCUMENT' | 'PAYMENT' | 'MESSAGE' | 'SYSTEM';
  severity: 'info' | 'warning' | 'error' | 'success';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
  transactionId?: string;
  userId: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loadingNotifications: boolean;
  
  // Actions
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  
  // Real-time
  subscribeToNotifications: () => () => void;
  
  // Preferences
  notificationPreferences: NotificationPreferences;
  updateNotificationPreferences: (preferences: Partial<NotificationPreferences>) => Promise<void>;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  notificationTypes: {
    transaction: boolean;
    document: boolean;
    payment: boolean;
    message: boolean;
    system: boolean;
  };
}

const defaultPreferences: NotificationPreferences = {
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
  notificationTypes: {
    transaction: true,
    document: true,
    payment: true,
    message: true,
    system: true
  }
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { currentTransaction } = useTransaction();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>(defaultPreferences);
  
  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Fetch notifications from API
  const fetchNotifications = async () => {
    if (!user) return;
    
    setLoadingNotifications(true);
    try {
      const userNotifications = await api.get<Notification[]>('/notifications');
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      
      setNotifications(prev => 
        prev.filter(n => n.id !== notificationId)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    try {
      await api.delete('/notifications');
      setNotifications([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  // Update notification preferences
  const updateNotificationPreferences = async (preferences: Partial<NotificationPreferences>) => {
    try {
      const updatedPreferences = { ...notificationPreferences, ...preferences };
      await api.put('/notifications/preferences', updatedPreferences);
      setNotificationPreferences(updatedPreferences);
      
      toast({
        title: "Preferences updated",
        description: "Your notification preferences have been saved"
      });
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update notification preferences",
        variant: "destructive"
      });
    }
  };

  // Subscribe to real-time notifications
  const subscribeToNotifications = () => {
    if (!user) return () => {};

    // Create EventSource for SSE or WebSocket connection
    const eventSource = new EventSource(`/api/notifications/subscribe?userId=${user.id}`);
    
    eventSource.onmessage = (event) => {
      try {
        const notification: Notification = JSON.parse(event.data);
        
        // Check if notification should be shown based on preferences
        const typeKey = notification.type.toLowerCase();
        if (!notificationPreferences.notificationTypes[typeKey as keyof typeof notificationPreferences.notificationTypes]) {
          return;
        }
        
        // Add to notifications list
        setNotifications(prev => [notification, ...prev]);
        
        // Show toast for important notifications
        if (notification.severity === 'error' || notification.severity === 'warning') {
          toast({
            title: notification.title,
            description: notification.description,
            variant: notification.severity === 'error' ? 'destructive' : 'default'
          });
        }
        
        // Play notification sound for new messages
        if (notification.type === 'MESSAGE' && notificationPreferences.pushNotifications) {
          playNotificationSound();
        }
      } catch (error) {
        console.error('Error processing notification:', error);
      }
    };
    
    eventSource.onerror = (error) => {
      console.error('Notification subscription error:', error);
    };
    
    // Return cleanup function
    return () => {
      eventSource.close();
    };
  };

  // Play notification sound
  const playNotificationSound = () => {
    try {
      const audio = new Audio('/sounds/notification.mp3');
      audio.volume = 0.5;
      audio.play();
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  };

  // Create mock notifications for development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && notifications.length === 0) {
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'TRANSACTION',
          severity: 'success',
          title: 'Transaction Status Update',
          description: 'Your transaction has moved to Contract Stage',
          timestamp: new Date().toISOString(),
          isRead: false,
          actionUrl: '/transactions/123',
          transactionId: '123',
          userId: user?.id || ''
        },
        {
          id: '2',
          type: 'DOCUMENT',
          severity: 'info',
          title: 'New Document Uploaded',
          description: 'Contract document has been uploaded and requires your review',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          isRead: false,
          actionUrl: '/transactions/123/documents',
          transactionId: '123',
          userId: user?.id || ''
        },
        {
          id: '3',
          type: 'PAYMENT',
          severity: 'warning',
          title: 'Payment Due Soon',
          description: 'Contract deposit of €25,000 is due in 3 days',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          isRead: true,
          actionUrl: '/transactions/123/payments',
          transactionId: '123',
          userId: user?.id || ''
        },
        {
          id: '4',
          type: 'MESSAGE',
          severity: 'info',
          title: 'New Message',
          description: 'Your solicitor sent you a message',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          isRead: false,
          actionUrl: '/transactions/123/messages',
          transactionId: '123',
          userId: user?.id || ''
        }
      ];
      
      setNotifications(mockNotifications);
    }
  }, [user, notifications.length]);

  // Fetch notifications on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Set up real-time subscription
  useEffect(() => {
    const unsubscribe = subscribeToNotifications();
    return unsubscribe;
  }, [user, notificationPreferences]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    loadingNotifications,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    subscribeToNotifications,
    notificationPreferences,
    updateNotificationPreferences
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;