"use client";

import * as React from "react";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendDirection } from "@/types/dashboard";

interface KPIWidgetProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  className?: string;
  trend?: {
    value: number;
    direction: TrendDirection;
    label?: string;
  };
  loading?: boolean;
  iconClassName?: string;
  valueClassName?: string;
  onClick?: () => void;
  variant?: "default" | "outline" | "success" | "warning" | "danger" | "info";
}

export function KPIWidget({
  title,
  value,
  description,
  icon: Icon,
  className,
  trend,
  loading = false,
  iconClassName,
  valueClassName,
  onClick,
  variant = "default",
}: KPIWidgetProps) {
  const variantClassMap = {
    default: "",
    outline: "border-2 bg-transparent",
    success: "bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-100",
    warning: "bg-amber-50 text-amber-900 dark:bg-amber-900/20 dark:text-amber-100",
    danger: "bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-100",
    info: "bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-100",
  };

  const getTrendColor = () => {
    if (trend?.direction === 'up') {
      return "text-green-600 dark:text-green-400";
    } else if (trend?.direction === 'down') {
      return "text-red-600 dark:text-red-400";
    } else {
      return "text-gray-500 dark:text-gray-400";
    }
  };

  const getTrendIcon = () => {
    if (trend?.direction === 'up') {
      return <TrendingUp className="w-3 h-3 mr-1" />;
    } else if (trend?.direction === 'down') {
      return <TrendingDown className="w-3 h-3 mr-1" />;
    } else {
      return <Minus className="w-3 h-3 mr-1" />;
    }
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-200 hover:shadow-md", 
        onClick && "cursor-pointer",
        variantClassMap[variant],
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">
          {loading ? <Skeleton className="h-4 w-24" /> : title}
        </CardTitle>
        {Icon && (
          <div className={cn("p-2 rounded-full", iconClassName)}>
            <Icon 
              className={cn(
                "h-4 w-4", 
                variant === "default" && "text-muted-foreground"
              )} 
            />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {loading ? (
            <Skeleton className="h-7 w-20" />
          ) : (
            <div className={cn("text-2xl font-bold", valueClassName)}>
              {value}
            </div>
          )}
          {(description || trend) && (
            <div className="flex items-center text-xs text-muted-foreground">
              {loading ? (
                <Skeleton className="h-3 w-24" />
              ) : (
                <>
                  {description && <span>{description}</span>}
                  {trend && (
                    <div className={cn("ml-2 flex items-center", getTrendColor())}>
                      {getTrendIcon()}
                      <span>
                        {trend.direction === 'up' ? "+" : trend.direction === 'down' ? "-" : ""}
                        {Math.abs(trend.value)}%
                        {trend.label && <span className="ml-1">{trend.label}</span>}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}