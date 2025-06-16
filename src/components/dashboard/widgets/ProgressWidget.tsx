import React from 'react';
"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface ProgressWidgetProps {
  title: string;
  value: number;
  maxValue?: number;
  icon?: LucideIcon;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  className?: string;
  status?: "inProgress" | "completed" | "overdue" | "blocked";
  barColor?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  target?: number;
  showTargetIndicator?: boolean;
  onClick?: () => void;
  onStatusClick?: (status: string) => void;
}

export function ProgressWidget({
  title,
  value,
  maxValue = 100,
  icon: Icon,
  description,
  primaryLabel,
  secondaryLabel,
  className,
  status,
  barColor = "default",
  size = "md",
  loading = false,
  target,
  showTargetIndicator = false,
  onClick,
  onStatusClick}: ProgressWidgetProps) {
  // Calculate percentage
  const percentage = Math.min(Math.max(0, (value / maxValue) * 100), 100);

  // Status badge configuration
  const statusConfig = {
    inProgress: { label: "In Progress", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
    completed: { label: "Completed", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
    overdue: { label: "Overdue", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
    blocked: { label: "Blocked", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" };

  // Progress bar color
  const progressColorClassMap = {
    default: "bg-primary",
    success: "bg-green-600 dark:bg-green-500",
    warning: "bg-amber-500",
    danger: "bg-red-600",
    info: "bg-blue-500";

  // Adjust size
  const sizeClasses = {
    sm: {
      progressHeight: "h-1.5",
      paddingY: "py-3",
    md: {
      progressHeight: "h-2",
      paddingY: "py-4",
    lg: {
      progressHeight: "h-3",
      paddingY: "py-6";

  return (
    <Card 
      className={cn(
        "transition-shadow hover:shadow-md", 
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="flex flex-col">
          <CardTitle className="text-sm font-medium">
            {loading ? <Skeleton className="h-4 w-24" /> : title}
          </CardTitle>
          {description && !loading && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {status && !loading && (
            <Badge 
              variant="outline"
              className={cn(
                "rounded-sm font-normal text-xs", 
                statusConfig[status].color
              )}
              onClick={(e: any) => {
                e.stopPropagation();
                onStatusClick?.(status);
              }
            >
              {statusConfig[status].label}
            </Badge>
          )}
          {Icon && !loading && (
            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-muted/50">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className={sizeClasses[size].paddingY}>
        {loading ? (
          <>
            <Skeleton className="h-2 w-full mb-2" />
            <Skeleton className="h-4 w-16" / />
        ) : (
          <>
            <div className="relative">
              <Progress 
                value={percentage} 
                className={cn("w-full", sizeClasses[size].progressHeight)}
              />

              {showTargetIndicator && target !== undefined && (
                <div 
                  className="absolute top-0 w-px h-4 bg-black dark:bg-white"
                  style={ 
                    left: `${Math.min(Math.max(0, (target / maxValue) * 100), 100)}%`,
                    transform: 'translateX(-50%)'
                  }
                />
              )}
            </div>

            <div className="flex justify-between items-center mt-2">
              <div className="text-sm font-medium">
                {primaryLabel || `${value} / ${maxValue}`}
              </div>
              {secondaryLabel && (
                <div className="text-xs text-muted-foreground">
                  {secondaryLabel}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}