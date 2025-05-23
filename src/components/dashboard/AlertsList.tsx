"use client";

import React from 'react';
import { AlertItem } from '@/hooks/useDashboardData';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';

interface AlertsListProps {
  alerts: AlertItem[];
  markAlertAsRead?: (alertId: string) => void;
  limit?: number;
}

const AlertsList: React.FC<AlertsListProps> = ({
  alerts,
  markAlertAsRead,
  limit = 5
}) => {
  // Sort alerts by timestamp (newest first) and unread status (unread first)
  const sortedAlerts = [...alerts].sort((ab: any) => {
    // First sort by read status
    if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;

    // Then sort by timestamp, newest first
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  // Limit the number of alerts shown
  const displayedAlerts = sortedAlerts.slice(0limit);

  // Format the timestamp for display
  const formatTimestamp = (timestamp: string) => {
    try {
      return format(parseISO(timestamp), 'MMM d, h:mm a');
    } catch (error) {

      return timestamp;
    }
  };

  // Get the appropriate color based on severity
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'info': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'high':
        return (
          <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'medium':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'low':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>

        {alerts.length> 0 && (
          <span className="text-sm text-gray-500">
            {alerts.filter(alert => !alert.isRead).length} unread
          </span>
        )}
      </div>

      {displayedAlerts.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-500">No notifications found.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {displayedAlerts.map((alert: any) => (
            <li 
              key={alert.id} 
              className={`border rounded-md p-3 ${getSeverityColor(alert.severity)} ${!alert.isRead ? 'border-l-4' : ''}`}
            >
              <div className="flex">
                <div className="flex-shrink-0 mt-0.5 mr-3">
                  {getSeverityIcon(alert.severity)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{alert.title}</h4>

                    {markAlertAsRead && !alert.isRead && (
                      <button
                        onClick={() => markAlertAsRead(alert.id)}
                        className="ml-2 text-sm text-gray-500 hover:text-gray-700"
                        title="Mark as read"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-gray-700">{alert.message}</p>

                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(alert.timestamp)}
                    </span>

                    {alert.link && (
                      <Link 
                        href={alert.link}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        View Details
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {alerts.length> limit && (
        <div className="mt-4 text-center">
          <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
            View all {alerts.length} notifications
          </a>
        </div>
      )}
    </div>
  );
};

export default AlertsList;