'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Progress } from '../ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { BudgetVsActualProps } from '../../types/finance/dashboard';
import { formatCurrency, calculateVariancePercentage } from '../../utils/finance/formatting';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

// Card variants for different performance contexts
const barColorVariant = cva(
  "",
  {
    variants: {
      performance: {
        positive: "bg-green-500",
        warning: "bg-amber-500",
        negative: "bg-red-500",
        neutral: "bg-blue-500",
      },
    },
    defaultVariants: {
      performance: "neutral",
    },
  }
);

// Value variants for different performance contexts
const valueVariants = cva(
  "text-sm font-medium",
  {
    variants: {
      performance: {
        positive: "text-green-600 dark:text-green-400",
        negative: "text-red-600 dark:text-red-400",
        neutral: "text-slate-600 dark:text-slate-400",
        warning: "text-amber-600 dark:text-amber-400",
      },
    },
    defaultVariants: {
      performance: "neutral",
    },
  }
);

/**
 * Budget vs Actual Component
 * 
 * Displays a comparison between budgeted and actual values with a progress bar
 */
const BudgetVsActualCard = ({
  title,
  description,
  budgetLabel = "Budget",
  actualLabel = "Actual",
  budgetValue,
  actualValue,
  category,
  period = "Current Period",
  invertComparison = false,
  isLoading = false,
  className,
  onClick
}: BudgetVsActualProps) => {

  // Calculate percentage of budget used
  const percentageUsed = React.useMemo(() => {
    if (budgetValue === 0) return 100;
    return Math.min(Math.round((actualValue / budgetValue) * 100), 200);
  }, [actualValue, budgetValue]);

  // Calculate variance and percentage
  const variance = actualValue - budgetValue;
  const variancePercentage = calculateVariancePercentage(actualValue, budgetValue);
  
  // Determine performance indicator
  const performance = React.useMemo(() => {
    // If inverting comparison (e.g., for costs where lower is better)
    if (invertComparison) {
      if (actualValue <= budgetValue) return 'positive';
      if (actualValue <= budgetValue * 1.1) return 'warning';
      return 'negative';
    } 
    // Normal comparison (e.g., for revenue where higher is better)
    else {
      if (actualValue >= budgetValue) return 'positive';
      if (actualValue >= budgetValue * 0.9) return 'warning';
      return 'negative';
    }
  }, [actualValue, budgetValue, invertComparison]);

  // Format values for display
  const formattedBudget = formatCurrency(budgetValue);
  const formattedActual = formatCurrency(actualValue);
  const formattedVariance = formatCurrency(Math.abs(variance));
  
  // Variance display text
  const varianceText = `${variance >= 0 ? '+' : '-'} ${formattedVariance} (${Math.abs(variancePercentage).toFixed(1)}%)`;
  
  // Render trend icon based on variance direction and context
  const renderTrendIcon = () => {
    if ((variance > 0 && !invertComparison) || (variance < 0 && invertComparison)) {
      return <TrendingUp className="h-4 w-4 mr-1" />;
    } else if ((variance < 0 && !invertComparison) || (variance > 0 && invertComparison)) {
      return <TrendingDown className="h-4 w-4 mr-1" />;
    } else {
      return null;
    }
  };

  return (
    <Card 
      className={cn(
        "transition-all hover:shadow-md", 
        onClick ? "cursor-pointer" : "",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-xs mt-0">
                {description}
              </CardDescription>
            )}
          </div>
          {percentageUsed > 100 && invertComparison && (
            <div className="rounded-full bg-red-100 p-1 dark:bg-red-900/30">
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
          )}
          {percentageUsed < 90 && !invertComparison && (
            <div className="rounded-full bg-amber-100 p-1 dark:bg-amber-900/30">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
          )}
        </div>
        {period && (
          <CardDescription className="text-xs mt-0">
            {period} {category ? `• ${category}` : ''}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-slate-500 dark:text-slate-400 mr-1">{actualLabel}:</span>
            <span className="font-medium">{formattedActual}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 mr-1">{budgetLabel}:</span>
            <span className="font-medium">{formattedBudget}</span>
          </div>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="space-y-1.5">
                <Progress 
                  value={percentageUsed > 100 ? 100 : percentageUsed} 
                  className={cn(
                    "h-2.5", 
                    percentageUsed > 100 ? "bg-slate-200 dark:bg-slate-800" : ""
                  )}
                  indicatorClassName={barColorVariant({ performance })}
                />
                {percentageUsed > 100 && (
                  <div className="w-full bg-slate-100 dark:bg-slate-800/50 h-1.5 rounded-full">
                    <div 
                      className={cn(
                        "h-full rounded-full", 
                        barColorVariant({ performance: 'negative' })
                      )}
                      style={{ width: `${Math.min(((percentageUsed - 100) / 100) * 100, 100)}%` }}
                    />
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{percentageUsed}% of budget {invertComparison ? 'spent' : 'achieved'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="flex justify-between items-center">
          <div className={cn(
            "flex items-center", 
            valueVariants({ 
              performance: (
                (variance < 0 && !invertComparison) || 
                (variance > 0 && invertComparison)
              ) ? 'negative' : 'positive' 
            })
          )}>
            {renderTrendIcon()}
            <span>{varianceText}</span>
          </div>
          <div className="text-xs text-slate-500">
            {percentageUsed}% {invertComparison ? 'used' : 'achieved'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetVsActualCard;