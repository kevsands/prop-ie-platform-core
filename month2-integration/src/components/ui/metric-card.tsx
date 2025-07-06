"use client";

import * as React from "react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { ArrowDown, ArrowUp, LucideIcon, TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { Skeleton } from "./skeleton";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trendValue?: number;
  trendLabel?: string;
  trendData?: Array<{ value: number }>;
  trendColor?: "default" | "success" | "warning" | "danger";
  loading?: boolean;
  className?: string;
  footerContent?: React.ReactNode;
  headerAction?: React.ReactNode;
  variant?: "default" | "outline" | "info" | "success" | "warning" | "danger";
}

/**
 * A card component for displaying metrics with optional trend indicators and sparkline
 */
export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trendValue,
  trendLabel,
  trendData,
  trendColor = "default",
  loading = false,
  className,
  footerContent,
  headerAction,
  variant = "default",
}: MetricCardProps) {
  // Determine trend direction
  const isTrendPositive = trendValue && trendValue > 0;
  const isTrendNegative = trendValue && trendValue < 0;
  const isTrendNeutral = trendValue === 0 || !trendValue;
  const trendValueFormatted = trendValue ? Math.abs(trendValue) : 0;
  
  // Determine trend colors
  const getTrendStyles = () => {
    if (trendColor === "success" || (trendColor === "default" && isTrendPositive)) {
      return "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400";
    }
    if (trendColor === "danger" || (trendColor === "default" && isTrendNegative)) {
      return "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400";
    }
    if (trendColor === "warning") {
      return "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400";
    }
    return "text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400";
  };
  
  // Determine sparkline color
  const getSparklineColor = () => {
    if (trendColor === "success" || (trendColor === "default" && isTrendPositive)) {
      return "var(--green-600, #16a34a)";
    }
    if (trendColor === "danger" || (trendColor === "default" && isTrendNegative)) {
      return "var(--red-600, #dc2626)";
    }
    if (trendColor === "warning") {
      return "var(--amber-600, #d97706)";
    }
    return "var(--gray-600, #4b5563)";
  };
  
  // Select appropriate trend icon
  const TrendIcon = React.useMemo(() => {
    if (isTrendPositive) return TrendingUp;
    if (isTrendNegative) return TrendingDown;
    return null;
  }, [isTrendPositive, isTrendNegative]);

  return (
    <Card variant={variant} className={cn("", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base font-semibold">{loading ? <Skeleton className="h-5 w-24" /> : title}</CardTitle>
            {subtitle && (
              <CardDescription>{loading ? <Skeleton className="h-4 w-20 mt-1" /> : subtitle}</CardDescription>
            )}
          </div>
          {headerAction && (
            <div className="ml-2">
              {headerAction}
            </div>
          )}
          {Icon && !headerAction && (
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <Icon size={18} />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="flex items-center">
            {loading ? (
              <Skeleton className="h-9 w-28" />
            ) : (
              <div className="text-2xl font-bold">{value}</div>
            )}
          </div>
          
          {(trendValue !== undefined || trendData) && (
            <div className="flex items-center space-x-2">
              {loading ? (
                <Skeleton className="h-5 w-20" />
              ) : (
                trendValue !== undefined && (
                  <div className={cn("text-xs rounded-full px-2 py-0.5 flex items-center", getTrendStyles())}>
                    {isTrendPositive && <ArrowUp className="h-3 w-3 mr-1" />}
                    {isTrendNegative && <ArrowDown className="h-3 w-3 mr-1" />}
                    {trendValueFormatted}%
                    {trendLabel && <span className="ml-1">{trendLabel}</span>}
                  </div>
                )
              )}
              
              {trendData && trendData.length > 0 && !loading && (
                <div className="h-9 w-24 ml-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={getSparklineColor()}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      {footerContent && (
        <CardFooter className="pt-2">
          {loading ? <Skeleton className="h-5 w-full" /> : footerContent}
        </CardFooter>
      )}
    </Card>
  );
}