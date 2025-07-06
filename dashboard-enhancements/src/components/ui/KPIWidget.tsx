'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { TrendDirection } from '@/types/dashboard';

export interface KPIWidgetProps {
  title: string;
  value: number | string;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: TrendDirection;
  };
  className?: string;
  onClick?: () => void;
}

export function KPIWidget({ 
  title, 
  value, 
  description, 
  icon,
  trend,
  className = '',
  onClick
}: KPIWidgetProps) {
  // Determine the trend color and icon
  const getTrendColor = (direction: TrendDirection) => {
    switch (direction) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };
  
  const getTrendIcon = (direction: TrendDirection) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="inline-block h-4 w-4 mr-1" />;
      case 'down':
        return <TrendingDown className="inline-block h-4 w-4 mr-1" />;
      default:
        return <Minus className="inline-block h-4 w-4 mr-1" />;
    }
  };

  return (
    <Card 
      className={`hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">{value}</div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
            {trend && (
              <div className={`flex items-center mt-1 ${getTrendColor(trend.direction)}`}>
                {getTrendIcon(trend.direction)}
                <span className="text-xs">{trend.value}%</span>
              </div>
            )}
          </div>
          {icon && <div className="bg-primary/10 p-2 rounded-full text-primary">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
}