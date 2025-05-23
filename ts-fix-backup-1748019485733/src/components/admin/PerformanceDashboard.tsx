'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { performanceMonitor, ComponentTiming, PerformanceMetric, WebVitalMetric } from '@/utils/performance';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { withMemo } from '@/utils/performance/withMemo';

interface ComponentPerformance {
  name: string;
  renderTime: number;
  rerenders: number;
  lastRender: Date;
}

interface PerformanceDashboardProps {
  /**
   * Whether to automatically refresh data
   */
  autoRefresh?: boolean;

  /**
   * Refresh interval in milliseconds (default: 10000)
   */
  refreshInterval?: number;

  /**
   * Whether to start minimized
   */
  defaultMinimized?: boolean;

  /**
   * Position of the dashboard
   */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

  /**
   * Whether to show position controls
   */
  showPositionControls?: boolean;
}

/**
 * A comprehensive performance dashboard for monitoring application performance
 */
function PerformanceDashboard({
  autoRefresh = true,
  refreshInterval = 10000,
  defaultMinimized = false,
  position = 'bottom-right',
  showPositionControls = true}: PerformanceDashboardProps) {
  const [minimizedsetMinimized] = useState(defaultMinimized);
  const [activeTabsetActiveTab] = useState('metrics');
  const [dashboardPositionsetDashboardPosition] = useState(position);
  const [componentFiltersetComponentFilter] = useState('all');

  // Use the performance monitor hook
  const {
    metrics,
    metricsHistory,
    refreshMetrics,
    getMetricHistory} = usePerformanceMonitor({
    enabled: true,
    collectionInterval: autoRefresh ? refreshInterval : 0,
    trackWebVitals: true,
    trackMemory: true,
    trackEventLoop: true});

  // Get component performance data
  const componentPerformance = useMemo(() => {
    const timings = performanceMonitor.getComponentTimings();

    // Group by component name and calculate stats
    const grouped = timings.reduce<Record<string, ComponentPerformance>>((acctiming) => {
      const name = timing.componentName;

      if (!acc[name]) {
        acc[name] = {
          name,
          renderTime: 0,
          rerenders: 0,
          lastRender: new Date(timing.endTime || timing.startTime)};
      }

      // Update stats
      acc[name].renderTime = Math.max(acc[name].renderTime, timing.duration);
      acc[name].rerenders += 1;

      // Update last render time if this is more recent
      const renderTime = new Date(timing.endTime || timing.startTime);
      if (renderTime> acc[name].lastRender) {
        acc[name].lastRender = renderTime;
      }

      return acc;
    }, {});

    // Convert to array and sort by render time (descending)
    return Object.values(grouped)
      .filter(comp => {
        if (componentFilter === 'all') return true;
        if (componentFilter === 'slow') return comp.renderTime> 16; // More than one frame
        if (componentFilter === 'frequent') return comp.rerenders> 5;
        return true;
      })
      .sort((ab) => b.renderTime - a.renderTime);
  }, [performanceMonitor.getComponentTimings(), componentFilter]);

  // Get memory metrics
  const memoryMetrics = useMemo(() => {
    return getMetricHistory('memory').slice(-20).map(metric => ({
      ...metric,
      value: metric || 0
    }));
  }, [getMetricHistorymetricsHistory]);

  // Get web vitals metrics with status
  const webVitals = useMemo(() => {
    const vitals: WebVitalMetric[] = [
      { 
        name: 'First Contentful Paint (FCP)', 
        value: metrics.fcp?.value || 0, 
        unit: 'ms', 
        target: 1000,
        timestamp: metrics.fcp?.timestamp || Date.now()
      },
      { 
        name: 'Largest Contentful Paint (LCP)', 
        value: metrics.lcp?.value || 0, 
        unit: 'ms', 
        target: 2500,
        timestamp: metrics.lcp?.timestamp || Date.now()
      },
      { 
        name: 'Cumulative Layout Shift (CLS)', 
        value: metrics.cls?.value || 0, 
        unit: '', 
        target: 0.1,
        timestamp: metrics.cls?.timestamp || Date.now()
      },
      { 
        name: 'First Input Delay (FID)', 
        value: metrics.fid?.value || 0, 
        unit: 'ms', 
        target: 100,
        timestamp: metrics.fid?.timestamp || Date.now()
      }].filter(vital => vital.value !== undefined);

    // Add status based on targets
    return vitals.map(vital => {
      let status: 'good' | 'warning' | 'critical' = 'good';

      if (vital.name.includes('CLS')) {
        // CLS has different thresholds
        status = vital.value <0.1 ? 'good' : 
                 vital.value <0.25 ? 'warning' : 'critical';
      } else {
        // Time-based metrics
        status = vital.value <vital.target ? 'good' : 
                 vital.value <vital.target * 1.5 ? 'warning' : 'critical';
      }

      return { ...vital, status };
    });
  }, [metrics]);

  // Position classes
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'};

  // Format time for display
  const formatTime = (time: number | undefined): string => {
    if (time === undefined) return 'N/A';
    return `${time.toFixed(2)} ms`;
  };

  // Get severity for render time
  const getRenderTimeSeverity = (time: number): string => {
    if (time> 50) return 'text-red-500';
    if (time> 16) return 'text-yellow-500'; // 1 frame at 60fps
    return 'text-green-500';
  };

  // Format memory value
  const formatMemory = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  // Calculate memory usage percentage
  const calculateMemoryUsage = (used: number, total: number): number => {
    return (used / total) * 100;
  };

  // Get memory status
  const getMemoryStatus = (usage: number): 'good' | 'warning' | 'critical' => {
    if (usage <70) return 'good';
    if (usage <85) return 'warning';
    return 'critical';
  };

  return (
    <div 
      className={`fixed ${positionClasses[dashboardPosition]} z-50 bg-white dark:bg-slate-800 shadow-lg rounded-lg overflow-hidden transition-all duration-300 border border-gray-200 dark:border-slate-700`}
      style={ 
        width: minimized ? '280px' : '500px',
        height: minimized ? '60px' : '600px',
        opacity: 0.95}
    >
      {/* Header */}
      <div 
        className="bg-blue-600 dark:bg-blue-800 text-white p-3 flex justify-between items-center cursor-pointer"
        onClick={() => setMinimized(!minimized)}
      >
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
          <span className="font-medium">Performance Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          {!minimized && (
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 text-white hover:bg-blue-700 dark:hover:bg-blue-900" 
              onClick={(e) => {
                e.stopPropagation();
                refreshMetrics();
              }
            >
              Refresh
            </Button>
          )}
          <button
            className="text-white hover:bg-blue-700 dark:hover:bg-blue-900 rounded-full p-1"
            onClick={(e) => {
              e.stopPropagation();
              setMinimized(!minimized);
            }
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
            >
              {minimized ? (
                <path d="M19 9l-7 7-7-7" />
              ) : (
                <path d="M5 15l7-7 7 7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Body - only shown when not minimized */}
      {!minimized && (
        <div className="overflow-y-auto h-[calc(100%-60px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="p-4">
            <TabsList className="mb-4">
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="memory">Memory</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Metrics Tab */}
            <TabsContent value="metrics" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Web Vitals</CardTitle>
                  <CardDescription>Core Web Vitals metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  {webVitals.length> 0 ? (
                    <div className="space-y-4">
                      {webVitals.map((vital) => (
                        <div key={vital.name} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{vital.name}</span>
                            <Badge 
                              variant={
                                vital.status === 'good' ? 'default' : 
                                vital.status === 'warning' ? 'outline' : 'destructive'
                              }
                              className={
                                vital.status === 'good' ? 'bg-green-500' : 
                                vital.status === 'warning' ? 'bg-yellow-500 text-white' : ''
                              }
                            >
                              {vital.value.toFixed(2)} {vital.unit}
                            </Badge>
                          </div>
                          <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded">
                            <div 
                              className={`h-full rounded ${
                                vital.status === 'good' ? 'bg-green-500' : 
                                vital.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={ 
                                width: `${Math.min(100, (vital.value / vital.target) * 100)}%`
                              }
                            />
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Target: {vital.target} {vital.unit}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No Web Vitals data collected yet.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Event Loop</CardTitle>
                  <CardDescription>JavaScript main thread performance</CardDescription>
                </CardHeader>
                <CardContent>
                  {metrics.eventLoopLag?.value ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Event Loop Lag</span>
                        <Badge 
                          variant={
                            (metrics.eventLoopLag?.value || 0) <10 ? 'default' : 
                            (metrics.eventLoopLag?.value || 0) <50 ? 'outline' : 'destructive'
                          }
                          className={
                            (metrics.eventLoopLag?.value || 0) <10 ? 'bg-green-500' : 
                            (metrics.eventLoopLag?.value || 0) <50 ? 'bg-yellow-500 text-white' : ''
                          }
                        >
                          {(metrics.eventLoopLag?.value || 0).toFixed(2)} ms
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Event loop lag indicates how responsive the UI is. 
                        {(metrics.eventLoopLag?.value || 0) <10
                          ? ' Your application is running smoothly.'
                          : (metrics.eventLoopLag?.value || 0) <50
                          ? ' There might be some heavy operations affecting UI responsiveness.'
                          : ' UI might feel laggy due to heavy operations on the main thread.'}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No event loop data collected yet.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Performance Recommendations */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Recommendations</CardTitle>
                  <CardDescription>Performance improvement suggestions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {componentPerformance.some(comp => comp.renderTime> 50) && (
                      <Alert variant="destructive">
                        <AlertTitle>Slow Component Renders</AlertTitle>
                        <AlertDescription>
                          Some components are taking over 50ms to render. Consider optimizing or memoizing them.
                        </AlertDescription>
                      </Alert>
                    )}

                    {componentPerformance.some(comp => comp.rerenders> 10) && (
                      <Alert variant="destructive">
                        <AlertTitle>Frequent Re-renders</AlertTitle>
                        <AlertDescription>
                          Some components are re-rendering frequently. Check dependency arrays and consider memoization.
                        </AlertDescription>
                      </Alert>
                    )}

                    {metrics.jsHeapSize?.value && (
                      <Alert>
                        <AlertTitle>High Memory Usage</AlertTitle>
                        <AlertDescription>
                          Your application is using {metrics.jsHeapSize.value}MB of JavaScript heap. 
                          Consider implementing component cleanup and checking for memory leaks.
                        </AlertDescription>
                      </Alert>
                    )}

                    {(!webVitals.length || !metrics.eventLoopLag) && (
                      <Alert>
                        <AlertTitle>Insufficient Data</AlertTitle>
                        <AlertDescription>
                          Not enough metrics collected yet. Interact with the application to generate more data.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Components Tab */}
            <TabsContent value="components" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Component Performance</h3>
                <Select
                  value={componentFilter}
                  onValueChange={setComponentFilter}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="slow">Slow ({'>'}16ms)</SelectItem>
                    <SelectItem value="frequent">Frequent ({'>'}5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Component</th>
                      <th className="text-right p-2">Render Time</th>
                      <th className="text-right p-2">Re-renders</th>
                      <th className="text-right p-2">Last Render</th>
                    </tr>
                  </thead>
                  <tbody>
                    {componentPerformance.length> 0 ? (
                      componentPerformance.map((comp) => (
                        <tr key={comp.name} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800">
                          <td className="p-2 text-sm">
                            <div className="font-medium">{comp.name}</div>
                          </td>
                          <td className={`p-2 text-sm text-right ${getRenderTimeSeverity(comp.renderTime)}`}>
                            {formatTime(comp.renderTime)}
                          </td>
                          <td className="p-2 text-sm text-right">
                            {comp.rerenders}
                          </td>
                          <td className="p-2 text-sm text-right">
                            {comp.lastRender.toLocaleTimeString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-slate-500 dark:text-slate-400">
                          No component performance data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Performance Tips</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>
                    <span className="font-medium">Green:</span> Under 16ms (60 FPS) - Good performance
                  </p>
                  <p>
                    <span className="font-medium text-yellow-500">Yellow:</span> 16-50ms - Noticeable lag
                  </p>
                  <p>
                    <span className="font-medium text-red-500">Red:</span> Over 50ms - Poor performance
                  </p>
                  <div className="pt-2">
                    <p className="font-medium">Optimization Tips:</p>
                    <ul className="list-disc pl-5 space-y-1 mt-1">
                      <li>Memoize components with {`<React.memo>`}</li>
                      <li>Use {`useMemo`} for expensive calculations</li>
                      <li>Check dependency arrays in {`useEffect`}</li>
                      <li>Virtualize long lists with {`VirtualizedList`}</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Memory Tab */}
            <TabsContent value="memory" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Memory Usage</CardTitle>
                  <CardDescription>JavaScript heap metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  {metrics.jsHeapSize?.value ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                          <div className="text-sm text-slate-500 dark:text-slate-400">Heap Used</div>
                          <div className="text-2xl font-bold">{metrics.jsHeapSize.value} MB</div>
                        </div>

                        {metrics.jsHeapLimit?.value && (
                          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                            <div className="text-sm text-slate-500 dark:text-slate-400">Heap Limit</div>
                            <div className="text-2xl font-bold">{metrics.jsHeapLimit.value} MB</div>
                          </div>
                        )}
                      </div>

                      {metrics.jsHeapLimit && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Heap Usage</span>
                            <span>
                              {Math.round(((metrics.jsHeapSize.value || 0) / (metrics.jsHeapLimit.value || 1)) * 100)}%
                            </span>
                          </div>
                          <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded">
                            <div 
                              className={`h-full rounded ${
                                (metrics.jsHeapSize.value || 0) / (metrics.jsHeapLimit.value || 1) <0.5 ? 'bg-green-500' : 
                                (metrics.jsHeapSize.value || 0) / (metrics.jsHeapLimit.value || 1) <0.8 ? 'bg-yellow-500' : 
                                'bg-red-500'
                              }`}
                              style={ 
                                width: `${Math.min(100, ((metrics.jsHeapSize.value || 0) / (metrics.jsHeapLimit.value || 1)) * 100)}%`
                              }
                            />
                          </div>
                        </div>
                      )}

                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        <p>Memory metrics help identify potential memory leaks and high memory usage.</p>
                        {(metrics.jsHeapSize.value || 0) > 100 && (
                          <p className="mt-2 text-yellow-500">
                            Memory usage is high. Consider checking for memory leaks or unnecessary caching.
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Memory usage data not available. This may not be supported in your browser.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Memory Optimization Tips</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>Common sources of memory leaks in React applications:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Missing cleanup in {`useEffect`} hooks</li>
                    <li>Unbounded caches without TTL or size limits</li>
                    <li>Event listeners not being removed</li>
                    <li>Closures capturing large objects</li>
                    <li>Large datasets stored in state</li>
                  </ul>
                  <p className="pt-2">
                    Use the React DevTools Profiler to identify components that may be causing memory issues.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Dashboard Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  {showPositionControls && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Dashboard Position</label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <Button
                            variant={dashboardPosition === 'top-left' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setDashboardPosition('top-left')}
                          >
                            Top Left
                          </Button>
                          <Button
                            variant={dashboardPosition === 'top-right' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setDashboardPosition('top-right')}
                          >
                            Top Right
                          </Button>
                          <Button
                            variant={dashboardPosition === 'bottom-left' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setDashboardPosition('bottom-left')}
                          >
                            Bottom Left
                          </Button>
                          <Button
                            variant={dashboardPosition === 'bottom-right' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setDashboardPosition('bottom-right')}
                          >
                            Bottom Right
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        performanceMonitor.clearTimings();
                        refreshMetrics();
                      }
                    >
                      Clear Performance Data
                    </Button>

                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                      Performance monitoring tools are only available in development mode and will be disabled in production.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Performance Documentation</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>
                    For detailed documentation on performance optimizations, see:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>
                      <code>docs/PERFORMANCE_OPTIMIZATION.md</code> - Comprehensive guide
                    </li>
                    <li>
                      <code>README-PERFORMANCE.md</code> - Quick reference
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}

// Apply performance optimizations to the dashboard itself
export default withMemo(PerformanceDashboard, {
  // Only re-render when specific props change
  includeProps: ['autoRefresh', 'refreshInterval', 'position'],
  // Don't track performance of the performance dashboard itself to avoid recursion
  trackPerformance: false});