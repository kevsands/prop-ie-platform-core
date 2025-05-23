'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/hooks/useAuth';

interface Notification {
  id: string;
  type: 'message' | 'property' | 'document' | 'appointment' | 'transaction' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  archived: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  actionText?: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
  };
  metadata?: {
    propertyId?: string;
    documentId?: string;
    appointmentId?: string;
    transactionId?: string;
    [key: string]: any;
  };
}

interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  inApp: boolean;
  categories: {
    messages: boolean;
    properties: boolean;
    documents: boolean;
    appointments: boolean;
    transactions: boolean;
    system: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [notificationssetNotifications] = useState<Notification[]>([]);
  const [unreadCountsetUnreadCount] = useState(0);
  const [preferencessetPreferences] = useState<NotificationPreferences>({
    email: true,
    push: true,
    sms: false,
    inApp: true,
    categories: {
      messages: true,
      properties: true,
      documents: true,
      appointments: true,
      transactions: true,
      system: true},
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'});

  const socketRef = useRef<Socket | null>(null);

  // Initialize WebSocket connection for real-time notifications
  useEffect(() => {
    if (!user) return;

    const socket = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001', {
      auth: { token: user.accessToken },
      transports: ['websocket']});

    socket.on('connect', () => {

      socket.emit('join-notification-room', user.id);
    });

    socket.on('notification', (notification: Notification) => {
      handleNewNotification(notification);
    });

    socket.on('notification-read', (notificationId: string) => {
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      updateUnreadCount();
    });

    socket.on('notification-deleted', (notificationId: string) => {
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      updateUnreadCount();
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [user]);

  // Fetch initial notifications
  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchPreferences();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications', {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`});
      const data = await response.json();
      setNotifications(data.notifications);
      updateUnreadCount();
    } catch (error) {

    }
  };

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/notifications/preferences', {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`});
      const data = await response.json();
      setPreferences(data.preferences);
    } catch (error) {

    }
  };

  const handleNewNotification = (notification: Notification) => {
    // Check if notification should be shown based on preferences
    if (!shouldShowNotification(notification)) return;

    // Check quiet hours
    if (isQuietHours()) return;

    // Add to notifications list
    setNotifications(prev => [notification, ...prev]);
    updateUnreadCount();

    // Request permission and show browser notification
    if (preferences.push && 'Notification' in window) {
      requestNotificationPermission().then(permission => {
        if (permission === 'granted') {
          showBrowserNotification(notification);
        }
      });
    }

    // Play notification sound
    playNotificationSound();
  };

  const shouldShowNotification = (notification: Notification): boolean => {
    if (!preferences.inApp) return false;
    if (!preferences.categories[notification.type]) return false;
    return true;
  };

  const isQuietHours = (): boolean => {
    if (!preferences.quietHours.enabled) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const [startHourstartMin] = preferences.quietHours.start.split(':').map(Number);
    const [endHourendMin] = preferences.quietHours.end.split(':').map(Number);

    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    if (startTime <endTime) {
      return currentTime>= startTime && currentTime <endTime;
    } else {
      return currentTime>= startTime || currentTime <endTime;
    }
  };

  const requestNotificationPermission = async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      return await Notification.requestPermission();
    }

    return 'denied';
  };

  const showBrowserNotification = (notification: Notification) => {
    const browserNotification = new Notification(notification.title, {
      body: notification.message,
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
      tag: notification.id,
      data: {
        url: notification.actionUrl});

    browserNotification.onclick = () => {
      window.focus();
      if (notification.actionUrl) {
        window.location.href = notification.actionUrl;
      }
      browserNotification.close();
    };
  };

  const playNotificationSound = () => {
    const audio = new Audio('/sounds/notification.mp3');
    audio.play().catch(e => );
  };

  const updateUnreadCount = useCallback(() => {
    const count = notifications.filter(n => !n.read && !n.archived).length;
    setUnreadCount(count);
  }, [notifications]);

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user?.accessToken}`});

      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      updateUnreadCount();

      // Emit to other connected clients
      socketRef.current?.emit('notification-read', notificationId);
    } catch (error) {

    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/read-all', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user?.accessToken}`});

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      updateUnreadCount();
    } catch (error) {

    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user?.accessToken}`});

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      updateUnreadCount();

      // Emit to other connected clients
      socketRef.current?.emit('notification-deleted', notificationId);
    } catch (error) {

    }
  };

  const archiveNotification = async (notificationId: string) => {
    try {
      const notification = notifications.find(n => n.id === notificationId);
      if (!notification) return;

      await fetch(`/api/notifications/${notificationId}/archive`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
          'Content-Type': 'application/json'},
        body: JSON.stringify({ archived: !notification.archived })});

      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, archived: !n.archived } : n)
      );
      updateUnreadCount();
    } catch (error) {

    }
  };

  const updatePreferences = async (newPreferences: NotificationPreferences) => {
    try {
      await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
          'Content-Type': 'application/json'},
        body: JSON.stringify(newPreferences)});

      setPreferences(newPreferences);
    } catch (error) {

    }
  };

  const createNotification = async (notification: Omit<Notification, 'id' | 'timestamp' | 'read' | 'archived'>) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
          'Content-Type': 'application/json'},
        body: JSON.stringify(notification)});

      const data = await response.json();
      return data.notification;
    } catch (error) {

      throw error;
    }
  };

  const subscribeToPropertyAlerts = async (propertyId: string, alertTypes: string[]) => {
    try {
      await fetch(`/api/properties/${propertyId}/alerts`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
          'Content-Type': 'application/json'},
        body: JSON.stringify({ alertTypes })});
    } catch (error) {

    }
  };

  const unsubscribeFromPropertyAlerts = async (propertyId: string) => {
    try {
      await fetch(`/api/properties/${propertyId}/alerts`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user?.accessToken}`});
    } catch (error) {

    }
  };

  return {
    notifications,
    unreadCount,
    preferences,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    archiveNotification,
    updatePreferences,
    createNotification,
    subscribeToPropertyAlerts,
    unsubscribeFromPropertyAlerts};
};