// src/components/ui/LoadingSpinner.tsx
import React from 'react';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  color = 'primary', 
  className = '' 
}: LoadingSpinnerProps) {
  // Size mapping
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
    xl: 'w-16 h-16'};

  // Color mapping
  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white'};

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        data-testid="loading-spinner"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
}

// Skeleton component for loading states
export interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export function Skeleton({ className = '', children }: SkeletonProps) {
  return (
    <div className={`animate-pulse rounded-md bg-gray-200 ${className}`}>
      {children}
    </div>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <Skeleton className="h-48 md:h-56" />
      <div className="p-4 sm:p-5 md:p-6 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
}

export default LoadingSpinner;