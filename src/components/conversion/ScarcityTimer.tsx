/**
 * Scarcity Timer Component
 * Creates time-sensitive urgency for price increases, offers, and availability
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  Zap, 
  Fire,
  Timer,
  Target,
  Euro,
  Calendar,
  Bell
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface ScarcityEvent {
  id: string;
  type: 'price_increase' | 'offer_expiry' | 'unit_release' | 'final_availability';
  title: string;
  description: string;
  endTime: Date;
  impact: {
    priceChange?: number;
    discountAmount?: number;
    unitsAffected?: number;
  };
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  actionText?: string;
  onAction?: () => void;
}

interface ScarcityTimerProps {
  events: ScarcityEvent[];
  showMultiple?: boolean;
  onEventExpired?: (eventId: string) => void;
}

export const ScarcityTimer: React.FC<ScarcityTimerProps> = ({
  events,
  showMultiple = false,
  onEventExpired
}) => {
  const [timeRemaining, setTimeRemaining] = useState<Record<string, number>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const newTimeRemaining: Record<string, number> = {};

      events.forEach(event => {
        const remaining = Math.max(0, event.endTime.getTime() - now);
        newTimeRemaining[event.id] = remaining;

        // Call expiry callback if event just expired
        if (remaining === 0 && timeRemaining[event.id] > 0) {
          onEventExpired?.(event.id);
        }
      });

      setTimeRemaining(newTimeRemaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [events, timeRemaining, onEventExpired]);

  const formatTime = (milliseconds: number) => {
    if (milliseconds === 0) return { expired: true, display: 'EXPIRED' };

    const totalSeconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) {
      return { 
        expired: false, 
        display: `${days}d ${hours}h ${minutes}m`,
        short: `${days}d ${hours}h`
      };
    } else if (hours > 0) {
      return { 
        expired: false, 
        display: `${hours}h ${minutes}m ${seconds}s`,
        short: `${hours}h ${minutes}m`
      };
    } else {
      return { 
        expired: false, 
        display: `${minutes}m ${seconds}s`,
        short: `${minutes}m ${seconds}s`,
        critical: minutes < 10
      };
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'price_increase': return TrendingUp;
      case 'offer_expiry': return Timer;
      case 'unit_release': return Target;
      case 'final_availability': return Fire;
      default: return Clock;
    }
  };

  const getUrgencyColor = (urgencyLevel: string, critical?: boolean) => {
    if (critical) return 'bg-red-600 text-white animate-pulse';
    
    switch (urgencyLevel) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  const getEventColor = (urgencyLevel: string) => {
    switch (urgencyLevel) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  // Sort events by urgency and time remaining
  const sortedEvents = [...events].sort((a, b) => {
    const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    const aUrgency = urgencyOrder[a.urgencyLevel];
    const bUrgency = urgencyOrder[b.urgencyLevel];
    
    if (aUrgency !== bUrgency) return bUrgency - aUrgency;
    
    return (timeRemaining[a.id] || 0) - (timeRemaining[b.id] || 0);
  });

  const activeEvents = showMultiple ? sortedEvents : sortedEvents.slice(0, 1);

  if (activeEvents.length === 0) return null;

  return (
    <div className="space-y-4">
      {activeEvents.map((event) => {
        const timeData = formatTime(timeRemaining[event.id] || 0);
        const EventIcon = getEventIcon(event.type);

        if (timeData.expired) {
          return (
            <Card key={event.id} className="p-4 border-gray-300 bg-gray-100">
              <div className="text-center">
                <p className="text-gray-600 font-medium">Event Expired</p>
                <p className="text-sm text-gray-500">{event.title}</p>
              </div>
            </Card>
          );
        }

        return (
          <Card 
            key={event.id} 
            className={`p-4 ${getEventColor(event.urgencyLevel)} border-2`}
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <EventIcon className="h-5 w-5 text-gray-700" />
                  <span className="font-semibold text-gray-800">
                    {event.title}
                  </span>
                </div>
                <Badge className={getUrgencyColor(event.urgencyLevel, timeData.critical)}>
                  {event.urgencyLevel.toUpperCase()}
                </Badge>
              </div>

              {/* Timer Display */}
              <div className="text-center">
                <div className={`text-3xl font-mono font-bold ${
                  timeData.critical ? 'text-red-600 animate-pulse' : 'text-gray-800'
                }`}>
                  {timeData.display}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {event.description}
                </p>
              </div>

              {/* Impact Information */}
              {(event.impact.priceChange || event.impact.discountAmount || event.impact.unitsAffected) && (
                <div className="bg-white/70 rounded-lg p-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
                    {event.impact.priceChange && (
                      <div>
                        <div className="flex items-center justify-center space-x-1">
                          <Euro className="h-4 w-4 text-red-600" />
                          <span className="font-bold text-red-600">
                            +€{event.impact.priceChange.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">Price Increase</p>
                      </div>
                    )}
                    
                    {event.impact.discountAmount && (
                      <div>
                        <div className="flex items-center justify-center space-x-1">
                          <Euro className="h-4 w-4 text-green-600" />
                          <span className="font-bold text-green-600">
                            -€{event.impact.discountAmount.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">Discount Expires</p>
                      </div>
                    )}
                    
                    {event.impact.unitsAffected && (
                      <div>
                        <div className="flex items-center justify-center space-x-1">
                          <Target className="h-4 w-4 text-blue-600" />
                          <span className="font-bold text-blue-600">
                            {event.impact.unitsAffected} Units
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">Affected</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Button */}
              {event.actionText && event.onAction && (
                <Button
                  onClick={event.onAction}
                  className={`w-full ${
                    timeData.critical 
                      ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {timeData.critical && <Zap className="h-4 w-4 mr-2" />}
                  {event.actionText}
                  {timeData.critical && <Zap className="h-4 w-4 ml-2" />}
                </Button>
              )}

              {/* Progress Bar for Visual Time Indication */}
              {!timeData.expired && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      timeData.critical ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ 
                      width: `${Math.max(5, (timeRemaining[event.id] || 0) / (24 * 60 * 60 * 1000) * 100)}%` 
                    }}
                  />
                </div>
              )}
            </div>
          </Card>
        );
      })}

      {/* Summary for Multiple Events */}
      {showMultiple && events.length > 3 && (
        <Card className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center justify-center space-x-2 text-purple-700">
            <Bell className="h-4 w-4" />
            <span className="text-sm font-medium">
              +{events.length - 3} more time-sensitive offers available
            </span>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ScarcityTimer;