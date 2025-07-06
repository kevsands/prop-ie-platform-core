'use client';

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Eye,
  Heart,
  Zap,
  Timer,
  Fire
} from 'lucide-react';

interface UrgencyMessagingProps {
  developmentId: string;
  unitId?: string; // If specific unit, show unit-specific urgency
  availableUnits: number;
  totalUnits: number;
  interestCount?: number;
  viewingCount?: number;
  recentActivity?: number; // Activity in last 24h
  urgencyLevel?: 'low' | 'medium' | 'high' | 'critical';
  className?: string;
  showDetailedStats?: boolean;
}

interface UrgencyMessage {
  primary: string;
  secondary?: string;
  cta?: string;
  variant: 'success' | 'warning' | 'danger' | 'info';
  icon: React.ElementType;
  pulse?: boolean;
}

export default function UrgencyMessaging({
  developmentId,
  unitId,
  availableUnits,
  totalUnits,
  interestCount = 0,
  viewingCount = 0,
  recentActivity = 0,
  urgencyLevel = 'low',
  className = '',
  showDetailedStats = false
}: UrgencyMessagingProps) {
  const [currentMessage, setCurrentMessage] = useState<UrgencyMessage | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const message = generateUrgencyMessage();
    setCurrentMessage(message);
    
    // Auto-refresh message every 30 seconds for dynamic updates
    const interval = setInterval(() => {
      const newMessage = generateUrgencyMessage();
      setCurrentMessage(newMessage);
    }, 30000);

    return () => clearInterval(interval);
  }, [availableUnits, totalUnits, interestCount, viewingCount, recentActivity, urgencyLevel]);

  const generateUrgencyMessage = (): UrgencyMessage => {
    const soldPercentage = ((totalUnits - availableUnits) / totalUnits) * 100;
    
    // Critical urgency - very few units left
    if (availableUnits <= 3) {
      return {
        primary: `Only ${availableUnits} unit${availableUnits !== 1 ? 's' : ''} remaining!`,
        secondary: 'Final opportunity - these won\'t last long',
        cta: 'Reserve now',
        variant: 'danger',
        icon: Fire,
        pulse: true
      };
    }
    
    // High urgency - limited availability with high interest
    if (availableUnits <= 6 && (interestCount >= 15 || urgencyLevel === 'high')) {
      return {
        primary: `Only ${availableUnits} units left`,
        secondary: `${interestCount} people have shown interest`,
        cta: 'Don\'t miss out',
        variant: 'danger',
        icon: TrendingUp,
        pulse: true
      };
    }
    
    // Medium urgency - good demand signals
    if (availableUnits <= 10 || recentActivity >= 5 || interestCount >= 10) {
      return {
        primary: `${availableUnits} units available`,
        secondary: recentActivity > 0 
          ? `${recentActivity} recent inquiries today`
          : `${Math.round(soldPercentage)}% already sold`,
        cta: 'Book viewing',
        variant: 'warning',
        icon: Users
      };
    }
    
    // Phase 1 specific messaging for Fitzgerald Gardens
    if (developmentId === 'fitzgerald-gardens' && availableUnits === 15) {
      return {
        primary: 'Phase 1 - 15 units available',
        secondary: '12 units already sold to government scheme',
        cta: 'Be among the first',
        variant: 'info',
        icon: Zap
      };
    }
    
    // Standard availability messaging
    return {
      primary: `${availableUnits} units available`,
      secondary: `Starting from €420,000`,
      cta: 'Explore options',
      variant: 'success',
      icon: Eye
    };
  };

  const getActivityStats = () => {
    const stats = [];
    
    if (interestCount > 0) {
      stats.push({
        icon: Heart,
        value: interestCount,
        label: 'expressions of interest'
      });
    }
    
    if (viewingCount > 0) {
      stats.push({
        icon: Eye,
        value: viewingCount,
        label: 'viewings scheduled'
      });
    }
    
    if (recentActivity > 0) {
      stats.push({
        icon: TrendingUp,
        value: recentActivity,
        label: 'recent inquiries'
      });
    }
    
    return stats;
  };

  const getVariantStyles = (variant: UrgencyMessage['variant']) => {
    switch (variant) {
      case 'danger':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'success':
      default:
        return 'bg-green-50 border-green-200 text-green-800';
    }
  };

  const getIconColor = (variant: UrgencyMessage['variant']) => {
    switch (variant) {
      case 'danger':
        return 'text-red-600';
      case 'warning':
        return 'text-orange-600';
      case 'info':
        return 'text-blue-600';
      case 'success':
      default:
        return 'text-green-600';
    }
  };

  if (!currentMessage || !isVisible) {
    return null;
  }

  const Icon = currentMessage.icon;
  const stats = getActivityStats();

  return (
    <div className={`relative ${className}`}>
      {/* Main urgency banner */}
      <div className={`
        rounded-lg border p-4 transition-all duration-300
        ${getVariantStyles(currentMessage.variant)}
        ${currentMessage.pulse ? 'animate-pulse' : ''}
      `}>
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 mt-0.5 ${getIconColor(currentMessage.variant)} flex-shrink-0`} />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-sm">
                  {currentMessage.primary}
                </p>
                {currentMessage.secondary && (
                  <p className="text-sm opacity-90 mt-1">
                    {currentMessage.secondary}
                  </p>
                )}
              </div>
              
              {currentMessage.cta && (
                <button className={`
                  px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                  ${currentMessage.variant === 'danger' 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : currentMessage.variant === 'warning'
                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                    : currentMessage.variant === 'info'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                  }
                `}>
                  {currentMessage.cta}
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Activity stats */}
        {showDetailedStats && stats.length > 0 && (
          <div className="mt-3 pt-3 border-t border-current/20">
            <div className="flex items-center gap-4 text-xs opacity-90">
              {stats.map((stat, index) => {
                const StatIcon = stat.icon;
                return (
                  <div key={index} className="flex items-center gap-1">
                    <StatIcon className="w-3 h-3" />
                    <span className="font-medium">{stat.value}</span>
                    <span>{stat.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* Countdown timer for critical urgency */}
      {currentMessage.variant === 'danger' && availableUnits <= 3 && (
        <div className="mt-2 text-center">
          <div className="inline-flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
            <Timer className="w-3 h-3" />
            <span className="font-medium">High demand - act fast</span>
          </div>
        </div>
      )}
      
      {/* Social proof indicator */}
      {interestCount >= 8 && (
        <div className="mt-2 text-center">
          <div className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
            <Users className="w-3 h-3" />
            <span>Popular choice - {interestCount} people interested</span>
          </div>
        </div>
      )}
      
      {/* Dismiss button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-current/60 hover:text-current/80 transition-colors"
        aria-label="Dismiss urgency message"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// Preset configurations for common scenarios
export const UrgencyPresets = {
  fitzgeraldGardensPhase1: {
    developmentId: 'fitzgerald-gardens',
    availableUnits: 15,
    totalUnits: 27,
    showDetailedStats: true
  },
  
  lastFewUnits: {
    availableUnits: 3,
    totalUnits: 50,
    urgencyLevel: 'critical' as const,
    showDetailedStats: true
  },
  
  highDemand: {
    availableUnits: 8,
    totalUnits: 30,
    interestCount: 25,
    viewingCount: 40,
    recentActivity: 12,
    urgencyLevel: 'high' as const,
    showDetailedStats: true
  }
};