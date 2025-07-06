"use client";

import * as React from "react";
import { LucideIcon, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export interface ListItem {
  id: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  status?: string;
  statusColor?: "default" | "primary" | "secondary" | "outline" | "success" | "warning" | "danger" | "info";
  timestamp?: string;
  avatar?: {
    src?: string;
    fallback: string;
  };
  actions?: Array<{
    label: string;
    onClick: (id: string) => void;
    icon?: LucideIcon;
  }>;
}

interface ListWidgetProps {
  title: string;
  items: ListItem[];
  description?: string;
  className?: string;
  listClassName?: string;
  loading?: boolean;
  emptyState?: React.ReactNode;
  variant?: "default" | "compact" | "card" | "separated";
  onItemClick?: (id: string) => void;
  maxItems?: number;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  footerAction?: {
    label: string;
    onClick: () => void;
  };
  loadingItemCount?: number;
}

export function ListWidget({
  title,
  items,
  description,
  className,
  listClassName,
  loading = false,
  emptyState,
  variant = "default",
  onItemClick,
  maxItems,
  actions,
  footer,
  footerAction,
  loadingItemCount = 4,
}: ListWidgetProps) {
  // Determine item layout based on variant
  const getItemClasses = (index: number, total: number) => {
    const baseClasses = "group";
    
    switch (variant) {
      case "compact":
        return cn(baseClasses, "flex items-center gap-3 py-2");
      case "card":
        return cn(baseClasses, "rounded-md border bg-card p-3 shadow-sm hover:shadow");
      case "separated":
        return cn(baseClasses, "rounded-md border bg-card p-3 shadow-sm hover:shadow mb-3");
      default:
        return cn(
          baseClasses,
          "flex items-start gap-3 py-3",
          index < total - 1 && "border-b"
        );
    }
  };
  
  // Display items, limited by maxItems if specified
  const displayItems = maxItems ? items.slice(0, maxItems) : items;
  
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div>
          <CardTitle className="text-base font-medium">
            {loading ? <Skeleton className="h-5 w-40" /> : title}
          </CardTitle>
          {description && !loading && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {actions && !loading && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </CardHeader>
      <CardContent className={cn(variant === "separated" ? "pt-2" : "pt-0")}>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: loadingItemCount }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 py-3 border-b last:border-b-0">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full max-w-[250px]" />
                  <Skeleton className="h-3 w-full max-w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : displayItems.length === 0 && emptyState ? (
          <div className="flex items-center justify-center py-8">
            {emptyState}
          </div>
        ) : (
          <div className={listClassName}>
            {displayItems.map((item, index) => (
              <div
                key={item.id}
                className={getItemClasses(index, displayItems.length)}
                onClick={onItemClick ? () => onItemClick(item.id) : undefined}
              >
                {/* Icon/Avatar */}
                {item.avatar ? (
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={item.avatar.src} />
                    <AvatarFallback>{item.avatar.fallback}</AvatarFallback>
                  </Avatar>
                ) : item.icon ? (
                  <div 
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                      item.iconColor || "bg-primary/10 text-primary"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                ) : null}
                
                {/* Content */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className={cn(
                      "font-medium leading-none",
                      variant === "compact" ? "text-sm" : "text-sm"
                    )}>
                      {item.title}
                    </p>
                    {item.status && (
                      <Badge variant={item.statusColor || "outline"} className="ml-2 text-xs">
                        {item.status}
                      </Badge>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                  {item.timestamp && variant !== "compact" && (
                    <p className="text-xs text-muted-foreground">
                      {item.timestamp}
                    </p>
                  )}
                </div>
                
                {/* Actions */}
                {item.actions && item.actions.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {item.actions.map((action, actionIndex) => (
                        <DropdownMenuItem
                          key={actionIndex}
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick(item.id);
                          }}
                        >
                          {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                          {action.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      {(footer || footerAction) && !loading && (
        <CardFooter className={cn(
          displayItems.length > 0 ? "pt-0 mt-2" : "mt-0",
          "border-t",
          footer && footerAction 
            ? "flex items-center justify-between" 
            : footer 
            ? "block" 
            : "flex justify-end"
        )}>
          {footer}
          {footerAction && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={footerAction.onClick}
              className="text-xs"
            >
              {footerAction.label}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}