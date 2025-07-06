'use client';

import React, { useState, useEffect } from 'react';
import { optimizeComponent } from '../../utils/performance/optimizeComponent';
import { usePerformanceMonitoring } from '../../utils/performance';
import { withMemo } from '../../utils/performance/withMemo';

interface OptimizedComponentWrapperProps {
  /**
   * Component to optimize
   */
  component: React.ComponentType<any>;
  /**
   * Props to pass to the component
   */
  componentProps: Record<string, any>;
  /**
   * Whether to memoize the component
   */
  memoize?: boolean;
  /**
   * Whether to track performance metrics
   */
  trackPerformance?: boolean;
  /**
   * Whether to log render decisions
   */
  logRenders?: boolean;
  /**
   * Props to exclude from memoization equality check
   */
  excludeProps?: string[];
  /**
   * Props to include in memoization equality check
   */
  includeProps?: string[];
  /**
   * Custom display name for the component
   */
  displayName?: string;
  /**
   * Whether to show performance metrics inline
   */
  showMetrics?: boolean;
}

/**
 * A component that wraps another component with performance optimizations
 * and optional inline metrics display
 */
export const OptimizedComponentWrapper: React.FC<OptimizedComponentWrapperProps> = ({
  component: Component,
  componentProps,
  memoize = true,
  trackPerformance = true,
  logRenders = process.env.NODE_ENV === 'development',
  excludeProps = [],
  includeProps = [],
  displayName,
  showMetrics = process.env.NODE_ENV === 'development',
}) => {
  const [renderCount, setRenderCount] = useState(0);
  const [renderTime, setRenderTime] = useState<number | null>(null);
  const [lastRenderAt, setLastRenderAt] = useState<Date | null>(null);
  
  // Create optimized component
  const OptimizedComponent = React.useMemo(() => {
    return optimizeComponent(Component, {
      memoize,
      excludeProps,
      includeProps,
      trackPerformance,
      logRenders,
      displayName,
    });
  }, [Component, memoize, excludeProps, includeProps, trackPerformance, logRenders, displayName]);
  
  // Use the performance hook to measure render time
  const { measureRender } = usePerformanceMonitoring(
    displayName || Component.displayName || Component.name || 'Component',
    { 
      trackReRenders: true
    }
  );
  
  // Increment render count on each render
  useEffect(() => {
    const startTime = performance.now();
    
    setRenderCount(prev => prev + 1);
    setLastRenderAt(new Date());
    
    return () => {
      const endTime = performance.now();
      setRenderTime(endTime - startTime);
    };
  }, [componentProps]);
  
  // Measure render performance
  measureRender();
  
  return (
    <div className="relative">
      {/* Render the optimized component */}
      <OptimizedComponent {...componentProps} />
      
      {/* Show metrics overlay if enabled */}
      {showMetrics && (
        <div className="absolute top-0 right-0 bg-black/80 text-white text-xs p-2 rounded-bl-md z-10">
          <div>Renders: {renderCount}</div>
          {renderTime !== null && <div>Last render: {renderTime.toFixed(2)}ms</div>}
          {lastRenderAt && <div>At: {lastRenderAt.toLocaleTimeString()}</div>}
        </div>
      )}
    </div>
  );
};

/**
 * A reusable wrapper for a Button component with performance optimizations
 */
export const OptimizedButton = withMemo(
  ({ children, onClick, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    const { measureRender } = usePerformanceMonitoring('OptimizedButton');
    measureRender();
    
    return (
      <button 
        onClick={onClick} 
        className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${className || ''}`}
        {...props}
      >
        {children}
      </button>
    );
  },
  {
    name: 'OptimizedButton',
    includeProps: ['onClick', 'disabled', 'children', 'className'],
    trackPerformance: true,
  }
);

/**
 * A reusable wrapper for a Card component with performance optimizations
 */
export const OptimizedCard = withMemo(
  ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    const { measureRender } = usePerformanceMonitoring('OptimizedCard');
    measureRender();
    
    return (
      <div 
        className={`p-4 border rounded-lg shadow-sm bg-white ${className || ''}`}
        {...props}
      >
        {children}
      </div>
    );
  },
  {
    name: 'OptimizedCard',
    includeProps: ['children', 'className'],
    trackPerformance: true,
  }
);

export default {
  OptimizedComponentWrapper,
  OptimizedButton,
  OptimizedCard
};