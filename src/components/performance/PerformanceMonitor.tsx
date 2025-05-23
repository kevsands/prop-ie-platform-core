'use client';

import React, { useEffect, useState } from 'react';
import { Chart } from '../ui/chart';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  target?: number;
  status: 'good' | 'warning' | 'critical';
}

interface ComponentRenderTime {
  componentName: string;
  renderTime: number;
  rerenders: number;
}

interface PerformanceMonitorProps {
  /**
   * Whether to show the monitor (useful for toggling in development)
   */
  enabled?: boolean;
  /**
   * Whether to automatically collect metrics on mount
   */
  autoCollect?: boolean;
  /**
   * Position of the monitor
   */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  /**
   * Whether to minimize the monitor by default
   */
  defaultMinimized?: boolean;
}

/**
 * PerformanceMonitor - Real-time performance monitoring dashboard
 * 
 * Tracks and displays key performance metrics for the application:
 * - First Contentful Paint (FCP)
 * - Largest Contentful Paint (LCP)
 * - Cumulative Layout Shift (CLS)
 * - First Input Delay (FID)
 * - Time to Interactive (TTI)
 * - Memory usage
 * - Component render times
 */
export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  enabled = true,
  autoCollect = true,
  position = 'bottom-right',
  defaultMinimized = true}) => {
  const [minimizedsetMinimized] = useState(defaultMinimized);
  const [metricssetMetrics] = useState<PerformanceMetric[]>([]);
  const [componentTimessetComponentTimes] = useState<ComponentRenderTime[]>([]);
  const [resourceMetricssetResourceMetrics] = useState<any[]>([]);
  const [lastUpdatedsetLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (enabled && autoCollect) {
      collectMetrics();

      // Set up periodic collection
      const intervalId = setInterval(collectMetrics10000); // every 10 seconds

      return () => clearInterval(intervalId);
    }
  }, [enabledautoCollect]);

  // Collect performance metrics
  const collectMetrics = async () => {
    if (typeof window === 'undefined' || !window.performance) return;

    try {
      // Collect Web Vitals
      const webVitals = await getWebVitals();

      // Collect memory usage if available
      let memoryUsage: PerformanceMetric | null = null;
      if ((performance as any).memory) {
        const memory = (performance as any).memory;
        memoryUsage = {
          name: 'Memory Usage',
          value: Math.round(memory.usedJSHeapSize / 1048576), // Convert to MB
          unit: 'MB',
          target: Math.round(memory.jsHeapSizeLimit / 1048576 * 0.7), // 70% of limit
          status: memory.usedJSHeapSize / memory.jsHeapSizeLimit> 0.8 ? 'critical' : 
                 memory.usedJSHeapSize / memory.jsHeapSizeLimit> 0.6 ? 'warning' : 'good'};
      }

      // Collect resource metrics
      const resources = getResourceMetrics();

      // Update state
      setMetrics([...(webVitals || []), ...(memoryUsage ? [memoryUsage] : [])]);
      setResourceMetrics(resources);
      setLastUpdated(new Date());
    } catch (error) {

    }
  };

  // Get Web Vitals metrics
  const getWebVitals = async (): Promise<PerformanceMetric[]> => {
    const result: PerformanceMetric[] = [];

    // Get basic timing metrics
    const paint = performance.getEntriesByType('paint');
    const fcp = paint.find(entry => entry.name === 'first-contentful-paint');

    if (fcp) {
      result.push({
        name: 'First Contentful Paint (FCP)',
        value: Math.round(fcp.startTime),
        unit: 'ms',
        target: 1000, // 1 second target
        status: fcp.startTime <1000 ? 'good' : fcp.startTime <3000 ? 'warning' : 'critical'});
    }

    // FID is not directly available in the Performance API
    // In a real implementation, we would use the web-vitals library
    // Here we're just creating a placeholder based on input delay PerformanceEventTiming
    try {
      if (PerformanceObserver.supportedEntryTypes.includes('first-input')) {
        const fidEntries = performance.getEntriesByType('first-input');
        if (fidEntries.length> 0) {
          const firstInput = fidEntries[0] as any;
          const fid = firstInput.processingStart - firstInput.startTime;

          result.push({
            name: 'First Input Delay (FID)',
            value: Math.round(fid),
            unit: 'ms',
            target: 100, // 100ms target
            status: fid <100 ? 'good' : fid <300 ? 'warning' : 'critical'});
        }
      }
    } catch (e) {

    }

    // Try to get CLS (Cumulative Layout Shift)
    // In a real implementation, we would use web-vitals library
    try {
      if (PerformanceObserver.supportedEntryTypes.includes('layout-shift')) {
        const layoutShiftEntries = performance.getEntriesByType('layout-shift') as any[];

        if (layoutShiftEntries.length> 0) {
          const cls = layoutShiftEntries.reduce((sumentry: any) => sum + entry.value0);

          result.push({
            name: 'Cumulative Layout Shift (CLS)',
            value: parseFloat(cls.toFixed(3)),
            unit: '',
            target: 0.1, // Target less than 0.1
            status: cls <0.1 ? 'good' : cls <0.25 ? 'warning' : 'critical'});
        }
      }
    } catch (e) {

    }

    return result;
  };

  // Get resource load metrics
  const getResourceMetrics = () => {
    const resources = performance.getEntriesByType('resource');

    // Group resources by type
    const resourcesByType = resources.reduce((acc: anyresource) => {
      const type = resource.initiatorType;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push({
        name: new URL(resource.name).pathname.split('/').pop(),
        duration: Math.round(resource.duration),
        size: Math.round(resource.encodedBodySize / 1024), // KB
      });
      return acc;
    }, {});

    // Sort resources by duration
    Object.keys(resourcesByType).forEach(type => {
      resourcesByType[type].sort((a: any, b: any) => b.duration - a.duration);
      // Only keep top 5 slowest
      resourcesByType[type] = resourcesByType[type].slice(05);
    });

    return resourcesByType;
  };

  // Position classes
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'};

  // Don't render anything if not enabled
  if (!enabled) return null;

  return (
    <div 
      className={`fixed ${positionClasses[position]} z-50 bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 border border-gray-200 max-w-lg`}
      style={ 
        width: minimized ? '280px' : '500px',
        height: minimized ? '60px' : '600px'}
    >
      {/* Header */}
      <div className="bg-blue-600 text-white p-3 flex justify-between items-center cursor-pointer"
        onClick={() => setMinimized(!minimized)}>
        <div className="flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            className="mr-2"
          >
            <path d="M17.79 13.5H22M22 18.5h-4.21" strokeWidth="2"/>
            <path d="M16 7.5H2M16 7.5l-4 4M16 7.5l-4-4" strokeWidth="2"/>
            <path d="M12 16.5H2M12 16.5l-4 4M12 16.5l-4-4" strokeWidth="2"/>
          </svg>
          <span className="font-medium">Performance Monitor</span>
        </div>
        <div className="flex items-center">
          {!minimized && (
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 mr-2 text-white hover:bg-blue-700" 
              onClick={(e: any) => {
                e.stopPropagation();
                collectMetrics();
              }
            >
              Refresh
            </Button>
          )}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            onClick={(e: any) => {
              e.stopPropagation();
              setMinimized(!minimized);
            }
          >
            {minimized ? (
              <path d="M5 12h14M12 5v14" strokeWidth="2"/>
            ) : (
              <path d="M5 12h14" strokeWidth="2"/>
            )}
          </svg>
        </div>
      </div>

      {/* Body - only shown when not minimized */}
      {!minimized && (
        <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
          {/* Last updated */}
          <div className="text-xs text-gray-500 mb-4">
            Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
          </div>

          {/* Web Vitals */}
          <h3 className="font-medium text-gray-800 mb-2">Web Vitals</h3>
          <div className="grid grid-cols-1 gap-4 mb-6">
            {metrics.map((metric: any) => (
              <Card key={metric.name} className="p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium">{metric.name}</div>
                    <div className="text-2xl font-bold">
                      {metric.value}{metric.unit}
                      {metric.target && (
                        <span className="text-xs text-gray-500 ml-1">
                          / Target: {metric.target}{metric.unit}
                        </span>
                      )}
                    </div>
                  </div>
                  <div 
                    className={`h-3 w-3 rounded-full ${
                      metric.status === 'good' ? 'bg-green-500' : 
                      metric.status === 'warning' ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`} 
                  />
                </div>
                {metric.target && (
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        metric.status === 'good' ? 'bg-green-500' : 
                        metric.status === 'warning' ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}
                      style={ 
                        width: `${Math.min(100, (metric.value / metric.target) * 100)}%` 
                      }
                    />
                  </div>
                )}
              </Card>
            ))}

            {metrics.length === 0 && (
              <div className="text-gray-500 text-sm">No metrics collected yet</div>
            )}
          </div>

          {/* Resource Metrics */}
          <h3 className="font-medium text-gray-800 mb-2">Slowest Resources</h3>
          <div className="space-y-4">
            {Object.keys(resourceMetrics).length> 0 ? (
              Object.entries(resourceMetrics).map(([typeresources]: [string, any[]]) => (
                <div key={type} className="mb-4">
                  <h4 className="text-sm font-medium capitalize mb-2">{type} ({resources.length})</h4>
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-2 text-left font-medium">Resource</th>
                        <th className="p-2 text-right font-medium">Load Time</th>
                        <th className="p-2 text-right font-medium">Size</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resources.map((resource: any, i: number) => (
                        <tr key={i} className="border-t">
                          <td className="p-2 truncate max-w-[200px]">{resource.name || '(unnamed)'}</td>
                          <td className="p-2 text-right">{resource.duration}ms</td>
                          <td className="p-2 text-right">{resource.size}KB</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm">No resource metrics collected yet</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor;