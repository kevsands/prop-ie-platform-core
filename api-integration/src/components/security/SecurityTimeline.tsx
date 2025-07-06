'use client';

import React, { useMemo } from 'react';
import { 
  AlertCircle, 
  AlertTriangle, 
  Clock, 
  ServerCrash, 
  Shield, 
  User, 
  Lock, 
  Key, 
  Database, 
  Globe 
} from 'lucide-react';

interface SecurityTimelineProps {
  events: any[];
}

/**
 * Performance-optimized security events timeline
 * 
 * Displays a chronological timeline of security events with
 * visual indicators for different event types and severities.
 */
const SecurityTimeline: React.FC<SecurityTimelineProps> = ({ events }) => {
  // Process and group events with memoization
  const { processedEvents, groupedByDay } = useMemo(() => {
    // Sort events by timestamp (newest first)
    const sortedEvents = [...events].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    // Group events by day
    const byDay: Record<string, any[]> = {};
    
    sortedEvents.forEach(event => {
      const date = new Date(event.timestamp);
      const dayStr = date.toLocaleDateString();
      
      if (!byDay[dayStr]) {
        byDay[dayStr] = [];
      }
      
      byDay[dayStr].push(event);
    });
    
    return {
      processedEvents: sortedEvents,
      groupedByDay: byDay
    };
  }, [events]);
  
  // Helper to format relative time
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };
  
  // Get icon for event type
  const getEventIcon = (event: any) => {
    const type = event.type?.toLowerCase() || '';
    
    // Authentication related
    if (type.includes('login') || type.includes('auth')) {
      return <User className="h-5 w-5 text-blue-500" />;
    }
    
    // Authorization related
    if (type.includes('permission') || type.includes('access')) {
      return <Lock className="h-5 w-5 text-purple-500" />;
    }
    
    // API related
    if (type.includes('api') || type.includes('request')) {
      return <Globe className="h-5 w-5 text-green-500" />;
    }
    
    // Database related
    if (type.includes('data') || type.includes('db')) {
      return <Database className="h-5 w-5 text-yellow-500" />;
    }
    
    // Session related
    if (type.includes('session') || type.includes('token')) {
      return <Key className="h-5 w-5 text-orange-500" />;
    }
    
    // Error related
    if (type.includes('error') || type.includes('fail')) {
      return <ServerCrash className="h-5 w-5 text-red-500" />;
    }
    
    // Default
    return <Shield className="h-5 w-5 text-gray-500" />;
  };
  
  // Get severity icon
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Shield className="h-5 w-5 text-blue-500" />;
    }
  };
  
  // Severity badge styles
  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };
  
  // If no events, show empty state
  if (!events.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-md p-6">
        <Clock className="h-12 w-12 text-gray-400 mb-3" />
        <p className="text-gray-500 text-center">No security events recorded</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {Object.entries(groupedByDay).map(([day, dayEvents]) => (
        <div key={day}>
          <div className="flex items-center mb-4">
            <div className="h-px flex-grow bg-gray-200"></div>
            <h3 className="px-3 text-sm font-medium text-gray-500">{day}</h3>
            <div className="h-px flex-grow bg-gray-200"></div>
          </div>
          
          <div className="space-y-4">
            {dayEvents.map((event) => {
              const eventTime = new Date(event.timestamp);
              
              return (
                <div key={event.id} className="flex">
                  {/* Timeline connector */}
                  <div className="flex flex-col items-center mr-4">
                    <div className="h-4 w-px bg-gray-200"></div>
                    <div className="rounded-full p-1 bg-white border border-gray-200">
                      {getEventIcon(event)}
                    </div>
                    <div className="h-full w-px bg-gray-200"></div>
                  </div>
                  
                  {/* Event content */}
                  <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm flex-grow mb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{event.type}</div>
                        <div className="text-sm text-gray-600 mt-1">{event.details?.message || event.description}</div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <div className={`text-xs px-2 py-1 rounded-full border ${getSeverityClass(event.severity)}`}>
                          {event.severity}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTimeAgo(eventTime)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Event details */}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {event.source && (
                        <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                          Source: {event.source}
                        </div>
                      )}
                      
                      {event.status && (
                        <div className={`text-xs px-2 py-1 rounded ${
                          event.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          event.status === 'mitigated' ? 'bg-blue-100 text-blue-800' :
                          event.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100'
                        }`}>
                          {event.status}
                        </div>
                      )}
                      
                      {event.relatedEntities?.length > 0 && (
                        <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {event.relatedEntities.length} related entities
                        </div>
                      )}
                      
                      {event.actionTaken && (
                        <div className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          Action: {event.actionTaken}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(SecurityTimeline);