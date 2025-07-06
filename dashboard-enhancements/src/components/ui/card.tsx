import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Enhanced Card component implementation
 * 
 * A flexible card component system with support for multiple variants,
 * media content, badges, and different layout options.
 */

type CardVariant = 
  | 'default' 
  | 'elevated' 
  | 'outline' 
  | 'filled' 
  | 'ghost' 
  | 'interactive'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border border-border overflow-hidden",
        // Variants
        variant === 'default' && "bg-card text-card-foreground shadow-sm",
        variant === 'elevated' && "bg-card text-card-foreground shadow-md",
        variant === 'outline' && "border border-border bg-transparent",
        variant === 'filled' && "bg-secondary/30 border-secondary/20",
        variant === 'ghost' && "border-transparent bg-transparent hover:bg-muted/50",
        variant === 'interactive' && "bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-1",
        // Status variants
        variant === 'info' && "bg-blue-50 border-blue-200 text-blue-900",
        variant === 'success' && "bg-green-50 border-green-200 text-green-900",
        variant === 'warning' && "bg-amber-50 border-amber-200 text-amber-900",
        variant === 'danger' && "bg-red-50 border-red-200 text-red-900",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  action?: React.ReactNode;
  padding?: 'standard' | 'sm' | 'lg' | 'none';
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, action, padding = 'standard', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-1.5",
        padding === 'standard' && "p-6",
        padding === 'sm' && "p-4",
        padding === 'lg' && "p-8",
        padding === 'none' && "p-0",
        className
      )}
      {...props}
    >
      {action ? (
        <div className="flex items-start justify-between">
          <div>{props.children}</div>
          {action}
        </div>
      ) : (
        props.children
      )}
    </div>
  )
);
CardHeader.displayName = "CardHeader";

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, size = 'md', ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "font-semibold leading-none tracking-tight",
        size === 'sm' && "text-sm",
        size === 'md' && "text-lg",
        size === 'lg' && "text-xl",
        size === 'xl' && "text-2xl",
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'standard' | 'sm' | 'lg' | 'none' | 'sm-standard';
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, padding = 'standard', ...props }, ref) => (
    <div 
      ref={ref}
      className={cn(
        padding === 'standard' && "p-6 pt-0",
        padding === 'sm' && "p-4 pt-0",
        padding === 'sm-standard' && "px-6 py-4",
        padding === 'lg' && "p-8 pt-0",
        padding === 'none' && "p-0",
        className
      )}
      {...props} 
    />
  )
);
CardContent.displayName = "CardContent";

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'standard' | 'sm' | 'lg' | 'none';
  withBorder?: boolean;
  align?: 'left' | 'center' | 'right' | 'between';
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, padding = 'standard', align = 'left', withBorder = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center",
        padding === 'standard' && "p-6 pt-0",
        padding === 'sm' && "p-4 pt-0",
        padding === 'lg' && "p-8 pt-0",
        padding === 'none' && "p-0",
        align === 'left' && "justify-start",
        align === 'center' && "justify-center",
        align === 'right' && "justify-end",
        align === 'between' && "justify-between",
        withBorder && "border-t pt-4 mt-4",
        className
      )}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export interface CardMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  ratio?: 'square' | 'video' | 'portrait' | 'wide';
  overlay?: React.ReactNode;
}

const CardMedia = React.forwardRef<HTMLDivElement, CardMediaProps>(
  ({ className, src, alt, ratio = 'square', overlay, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden",
        ratio === 'square' && "aspect-square",
        ratio === 'video' && "aspect-video",
        ratio === 'portrait' && "aspect-[3/4]",
        ratio === 'wide' && "aspect-[16/9]",
        className
      )}
      {...props}
    >
      <img
        src={src}
        alt={alt}
        className="object-cover w-full h-full"
      />
      {overlay && (
        <div className="absolute inset-0 bg-black/40 flex items-end p-4 text-white">
          {overlay}
        </div>
      )}
    </div>
  )
);
CardMedia.displayName = "CardMedia";

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger';
export type BadgePosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface CardBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  position?: BadgePosition;
}

const CardBadge = React.forwardRef<HTMLDivElement, CardBadgeProps>(
  ({ className, variant = 'default', position = 'top-right', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "absolute z-10 px-2.5 py-0.5 rounded-md text-xs font-medium",
        // Positioning
        position === 'top-left' && "top-2 left-2",
        position === 'top-right' && "top-2 right-2",
        position === 'bottom-left' && "bottom-2 left-2",
        position === 'bottom-right' && "bottom-2 right-2",
        // Variants
        variant === 'default' && "bg-primary text-primary-foreground",
        variant === 'primary' && "bg-primary text-primary-foreground",
        variant === 'secondary' && "bg-secondary text-secondary-foreground",
        variant === 'outline' && "bg-white border border-gray-200 text-gray-800",
        variant === 'success' && "bg-green-100 text-green-800",
        variant === 'warning' && "bg-amber-100 text-amber-800",
        variant === 'danger' && "bg-red-100 text-red-800",
        className
      )}
      {...props}
    />
  )
);
CardBadge.displayName = "CardBadge";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardMedia,
  CardBadge
};