'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Euro, AlertTriangle } from 'lucide-react';

interface FinancialOverlayProps {
  isVisible: boolean;
  position: { x: number; y: number };
  data: {
    value: number;
    variance?: number;
    impact?: 'positive' | 'negative' | 'neutral';
    details?: string;
  };
}

export function FinancialOverlay({ isVisible, position, data }: FinancialOverlayProps) {
  if (!isVisible) return null;

  const getVarianceColor = (variance?: number) => {
    if (!variance) return 'text-muted-foreground';
    if (variance> 5) return 'text-red-600';
    if (variance < -5) return 'text-green-600';
    return 'text-yellow-600';
  };

  const getVarianceIcon = (variance?: number) => {
    if (!variance) return null;
    return variance> 0 ? TrendingUp : TrendingDown;
  };

  return (
    <div 
      className="fixed z-50 pointer-events-none"
      style={ 
        left: position.x + 10, 
        top: position.y - 10,
        transform: 'translateY(-100%)'
      }
    >
      <Card className="shadow-lg border-2 bg-background/95 backdrop-blur-sm">
        <CardContent className="p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Euro className="h-4 w-4 text-primary" />
            <span className="font-semibold">€{data.value.toLocaleString()}</span>
            {data.variance && (
              <Badge 
                variant="secondary" 
                className={`text-xs ${getVarianceColor(data.variance)}`}
              >
                {getVarianceIcon(data.variance) && React.createElement(getVarianceIcon(data.variance)!, { className: "h-3 w-3 mr-1" })}
                {data.variance> 0 ? '+' : ''}{data.variance.toFixed(1)}%
              </Badge>
            )}
          </div>
          
          {data.details && (
            <p className="text-xs text-muted-foreground">{data.details}</p>
          )}
          
          {data.impact === 'negative' && (
            <div className="flex items-center gap-1 text-xs text-red-600">
              <AlertTriangle className="h-3 w-3" />
              <span>Review recommended</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}