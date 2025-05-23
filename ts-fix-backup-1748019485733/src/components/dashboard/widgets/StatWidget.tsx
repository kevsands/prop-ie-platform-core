"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatWidgetProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  className?: string;
  trend?: {
    value: number;
    positive?: boolean;
    label?: string;
  };
  loading?: boolean;
  iconClassName?: string;
  valueClassName?: string;
  onClick?: () => void;
  variant?: "default" | "outline" | "success" | "warning" | "danger" | "info";
}

export function StatWidget({
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
  variant = "default": StatWidgetProps) {
  const variantClassMap = {
    default: "",
    outline: "border-2 bg-transparent",
    success: "bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-100",
    warning: "bg-amber-50 text-amber-900 dark:bg-amber-900/20 dark:text-amber-100",
    danger: "bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-100",
    info: "bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-100";

  const getTrendColor = () => {
    if (trend?.positive) {
      return "text-green-600 dark:text-green-400";
    } else {
      return "text-red-600 dark:text-red-400";
    }
  };

  return (
    <Card 
      className={cn(
        "transition-shadow hover:shadow-md", 
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
                      {trend.positive ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 mr-1">
                          <path fillRule="evenodd" d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 mr-1">
                          <path fillRule="evenodd" d="M1.22 5.222a.75.75 0 011.06 0L7 9.942l3.768-3.769a.75.75 0 011.113.058 20.908 20.908 0 013.813 7.254l1.574-2.727a.75.75 0 011.3.75l-2.475 4.286a.75.75 0 01-.617.381l-4.453.303a.75.75 0 01-.577-1.27l2.599-2.599a.75.75 0 01-1.113-.058 20.908 20.908 0 00-3.813-7.254L5.38 8.117a.75.75 0 01-1.06 0l-3.1-3.1a.75.75 0 010-1.06l-.53.53z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span>
                        {trend.positive ? "+" : "-"
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