"use client";

import React, { useState } from 'react';
import { useEnterpriseNotifications } from '@/context/EnterpriseNotificationContext';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useEnterpriseNotifications();

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      // When opening and we have unread notifications, mark them as read
      markAllAsRead();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleOpen}
        className="relative p-1 text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
              {notifications.length > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500 text-center">
                No notifications
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`px-4 py-2 border-b border-gray-100 hover:bg-gray-50 ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {/* Indicator for notification type */}
                    <div className={`h-2 w-2 rounded-full mt-1 ml-2 ${
                      notification.type === 'error' ? 'bg-red-500' :
                      notification.type === 'warning' ? 'bg-yellow-500' :
                      notification.type === 'success' ? 'bg-green-500' :
                      'bg-blue-500'
                    }`}></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
