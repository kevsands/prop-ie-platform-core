/**
 * Urgency Indicators Component
 * Creates psychological pressure to drive buyers toward exclusivity purchase
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Clock, 
  Users, 
  TrendingUp, 
  AlertCircle, 
  Timer,
  Zap,
  Fire,
  Target,
  CheckCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export interface UrgencyData {
  unitsRemaining: number;
  totalUnits: number;
  currentViewers: number;
  viewsToday: number;
  recentReservations: number;
  priceIncreaseDate?: Date;
  priceIncreaseAmount?: number;
  timeLeftForCurrentPrice?: number; // minutes
  lastReservationTime?: Date;
  averageTimeToSell?: number; // days
}

interface UrgencyIndicatorsProps {
  urgencyData: UrgencyData;
  propertyPrice: number;
  showIntense?: boolean;
  onReserveClick?: () => void;
}

export const UrgencyIndicators: React.FC<UrgencyIndicatorsProps> = ({
  urgencyData,
  propertyPrice,
  showIntense = false,
  onReserveClick
}) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  // Calculate urgency level
  const availabilityPercentage = (urgencyData.unitsRemaining / urgencyData.totalUnits) * 100;
  const urgencyLevel = availabilityPercentage <= 10 ? 'critical' : 
                      availabilityPercentage <= 25 ? 'high' : 
                      availabilityPercentage <= 50 ? 'medium' : 'low';

  // Update countdown timer
  useEffect(() => {
    if (!urgencyData.timeLeftForCurrentPrice) return;

    const interval = setInterval(() => {
      const minutes = urgencyData.timeLeftForCurrentPrice! - 1;
      if (minutes <= 0) {
        setTimeLeft('Price increased!');
        return;
      }

      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      setTimeLeft(`${hours}h ${mins}m`);
    }, 60000);

    return () => clearInterval(interval);
  }, [urgencyData.timeLeftForCurrentPrice]);

  const getUrgencyColor = () => {
    switch (urgencyLevel) {
      case 'critical': return 'bg-red-500 text-white animate-pulse';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      default: return 'bg-green-500 text-white';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  return (
    <div className="space-y-4">
      {/* Critical Availability Alert */}
      {urgencyLevel === 'critical' && (
        <Card className="p-4 border-red-500 bg-red-50 animate-pulse">
          <div className="flex items-center space-x-2">
            <Fire className="h-5 w-5 text-red-500" />
            <span className="font-bold text-red-700">
              FINAL {urgencyData.unitsRemaining} UNITS REMAINING
            </span>
            <Fire className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-red-600 text-sm mt-1">
            Secure legal exclusivity now before someone else does!
          </p>
        </Card>
      )}

      {/* Main Urgency Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Units Remaining */}
        <div className="text-center">
          <Badge className={getUrgencyColor()}>
            <Target className="h-3 w-3 mr-1" />
            {urgencyData.unitsRemaining}/{urgencyData.totalUnits} Left
          </Badge>
          <p className="text-xs text-gray-600 mt-1">
            Units Available
          </p>
        </div>

        {/* Current Viewers */}
        <div className="text-center">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Eye className="h-3 w-3 mr-1" />
            {urgencyData.currentViewers} Viewing Now
          </Badge>
          <p className="text-xs text-gray-600 mt-1">
            Active Viewers
          </p>
        </div>

        {/* Views Today */}
        <div className="text-center">
          <Badge variant="outline">
            <TrendingUp className="h-3 w-3 mr-1" />
            {urgencyData.viewsToday} Views Today
          </Badge>
          <p className="text-xs text-gray-600 mt-1">
            High Interest
          </p>
        </div>

        {/* Recent Activity */}
        <div className="text-center">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            {urgencyData.recentReservations} Reserved Today
          </Badge>
          <p className="text-xs text-gray-600 mt-1">
            Recent Sales
          </p>
        </div>
      </div>

      {/* Price Increase Warning */}
      {urgencyData.priceIncreaseDate && urgencyData.priceIncreaseAmount && (
        <Card className="p-4 border-orange-300 bg-orange-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="font-semibold text-orange-800">
                  Price Increasing Soon
                </p>
                <p className="text-sm text-orange-600">
                  +€{urgencyData.priceIncreaseAmount.toLocaleString()} in {timeLeft || 'calculating...'}
                </p>
              </div>
            </div>
            <Timer className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      )}

      {/* Last Reservation Alert */}
      {urgencyData.lastReservationTime && (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>
            Last unit reserved {formatTimeAgo(urgencyData.lastReservationTime)}
          </span>
        </div>
      )}

      {/* Intense Mode - High Pressure Messaging */}
      {showIntense && urgencyLevel !== 'low' && (
        <Card className="p-4 border-red-400 bg-gradient-to-r from-red-50 to-orange-50">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Zap className="h-5 w-5 text-red-500 animate-bounce" />
              <span className="font-bold text-red-700">
                DON'T MISS OUT!
              </span>
              <Zap className="h-5 w-5 text-red-500 animate-bounce" />
            </div>
            <p className="text-red-600 text-sm">
              {urgencyData.currentViewers} others are viewing this property right now.
              Secure your legal exclusivity before they do!
            </p>
            {onReserveClick && (
              <button
                onClick={onReserveClick}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors animate-pulse"
              >
                SECURE EXCLUSIVITY NOW - €{(propertyPrice * 0.01).toLocaleString()}
              </button>
            )}
          </div>
        </Card>
      )}

      {/* Selling Velocity Indicator */}
      {urgencyData.averageTimeToSell && (
        <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <span>Average time to sell: {urgencyData.averageTimeToSell} days</span>
          <Badge variant="outline" className="text-xs">
            Based on recent sales
          </Badge>
        </div>
      )}
    </div>
  );
};

export default UrgencyIndicators;