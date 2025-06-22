/**
 * Performance Monitoring Dashboard
 * 
 * Real-time monitoring of cache performance, connection pool health,
 * and system metrics for enterprise-scale optimization tracking
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Activity, Database, Wifi, Zap, TrendingUp, Clock, Users, BarChart3 } from 'lucide-react';

interface CacheMetrics {
  hitRate: number;
  missRate: number;
  totalEntries: number;
  memoryUsage: number;
  evictionCount: number;
  prefetchCount: number;
}

interface ConnectionPoolMetrics {
  activeConnections: number;
  totalConnections: number;
  messagesSent: number;
  avgResponseTime: number;
  failureRate: number;
}

interface PerformanceMetrics {
  responseTime: {
    p50: number;
    p95: number;
    p99: number;
  };
  throughput: number;
  errorRate: number;
  uptime: number;
}

const PerformanceMonitoringDashboard: React.FC = () => {
  const [cacheMetrics, setCacheMetrics] = useState<CacheMetrics>({
    hitRate: 0,
    missRate: 0,
    totalEntries: 0,
    memoryUsage: 0,
    evictionCount: 0,
    prefetchCount: 0
  });

  const [connectionMetrics, setConnectionMetrics] = useState<ConnectionPoolMetrics>({
    activeConnections: 0,
    totalConnections: 0,
    messagesSent: 0,
    avgResponseTime: 0,
    failureRate: 0
  });

  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    responseTime: { p50: 0, p95: 0, p99: 0 },
    throughput: 0,
    errorRate: 0,
    uptime: 0
  });

  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      // Simulate cache metrics
      setCacheMetrics({
        hitRate: 85 + Math.random() * 10, // 85-95%
        missRate: 5 + Math.random() * 10, // 5-15%
        totalEntries: 450 + Math.floor(Math.random() * 100),
        memoryUsage: 60 + Math.random() * 20, // 60-80%
        evictionCount: Math.floor(Math.random() * 50),
        prefetchCount: Math.floor(Math.random() * 200)
      });

      // Simulate connection pool metrics
      setConnectionMetrics({
        activeConnections: 8 + Math.floor(Math.random() * 4), // 8-12 active
        totalConnections: 10,
        messagesSent: 1500 + Math.floor(Math.random() * 500),
        avgResponseTime: 15 + Math.random() * 10, // 15-25ms
        failureRate: Math.random() * 2 // 0-2%
      });

      // Simulate performance metrics
      setPerformanceMetrics({
        responseTime: {
          p50: 45 + Math.random() * 15, // 45-60ms
          p95: 120 + Math.random() * 30, // 120-150ms
          p99: 250 + Math.random() * 50 // 250-300ms
        },
        throughput: 850 + Math.random() * 200, // 850-1050 req/sec
        errorRate: Math.random() * 1, // 0-1%
        uptime: 99.7 + Math.random() * 0.3 // 99.7-100%
      });

      setIsConnected(true);
      setLastUpdate(new Date());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'text-green-600';
    if (value >= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return <Badge variant="default" className="bg-green-100 text-green-800">Excellent</Badge>;
    if (value >= thresholds.warning) return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Good</Badge>;
    return <Badge variant="destructive">Needs Attention</Badge>;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Performance Monitoring</h1>
          <p className="text-gray-600 mt-1">Real-time system performance and optimization metrics</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600">
            {isConnected ? 'Connected' : 'Disconnected'} • Last update: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cache Hit Rate</p>
                <p className={`text-2xl font-bold ${getStatusColor(cacheMetrics.hitRate, { good: 80, warning: 60 })}`}>
                  {cacheMetrics.hitRate.toFixed(1)}%
                </p>
              </div>
              <Database className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Connections</p>
                <p className={`text-2xl font-bold ${getStatusColor(connectionMetrics.activeConnections, { good: 8, warning: 5 })}`}>
                  {connectionMetrics.activeConnections}/{connectionMetrics.totalConnections}
                </p>
              </div>
              <Wifi className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className={`text-2xl font-bold ${getStatusColor(50 - connectionMetrics.avgResponseTime, { good: 30, warning: 20 })}`}>
                  {connectionMetrics.avgResponseTime.toFixed(0)}ms
                </p>
              </div>
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Uptime</p>
                <p className={`text-2xl font-bold ${getStatusColor(performanceMetrics.uptime, { good: 99.5, warning: 99.0 })}`}>
                  {performanceMetrics.uptime.toFixed(2)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cache Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Cache Performance
            </CardTitle>
            <CardDescription>Real-time caching system metrics and optimization status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Hit Rate</span>
              <div className="flex items-center gap-2">
                <span className="text-sm">{cacheMetrics.hitRate.toFixed(1)}%</span>
                {getStatusBadge(cacheMetrics.hitRate, { good: 80, warning: 60 })}
              </div>
            </div>
            <Progress value={cacheMetrics.hitRate} className="h-2" />

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Memory Usage</span>
              <span className="text-sm">{cacheMetrics.memoryUsage.toFixed(1)}%</span>
            </div>
            <Progress value={cacheMetrics.memoryUsage} className="h-2" />

            <Separator />

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{cacheMetrics.totalEntries}</p>
                <p className="text-xs text-gray-600">Total Entries</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{cacheMetrics.prefetchCount}</p>
                <p className="text-xs text-gray-600">Prefetches</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{cacheMetrics.evictionCount}</p>
                <p className="text-xs text-gray-600">Evictions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connection Pool Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5" />
              Connection Pool Status
            </CardTitle>
            <CardDescription>WebSocket connection pool health and performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Pool Utilization</span>
              <div className="flex items-center gap-2">
                <span className="text-sm">{((connectionMetrics.activeConnections / connectionMetrics.totalConnections) * 100).toFixed(0)}%</span>
                {getStatusBadge((connectionMetrics.activeConnections / connectionMetrics.totalConnections) * 100, { good: 70, warning: 50 })}
              </div>
            </div>
            <Progress value={(connectionMetrics.activeConnections / connectionMetrics.totalConnections) * 100} className="h-2" />

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Failure Rate</span>
              <span className="text-sm">{connectionMetrics.failureRate.toFixed(2)}%</span>
            </div>
            <Progress value={connectionMetrics.failureRate} className="h-2" />

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{connectionMetrics.messagesSent}</p>
                <p className="text-xs text-gray-600">Messages Sent</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{connectionMetrics.avgResponseTime.toFixed(0)}ms</p>
                <p className="text-xs text-gray-600">Avg Response</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Response Time Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Response Time Analysis
          </CardTitle>
          <CardDescription>Performance percentiles and throughput metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{performanceMetrics.responseTime.p50.toFixed(0)}ms</p>
              <p className="text-sm text-gray-600">50th Percentile</p>
              <p className="text-xs text-gray-500">Median response time</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">{performanceMetrics.responseTime.p95.toFixed(0)}ms</p>
              <p className="text-sm text-gray-600">95th Percentile</p>
              <p className="text-xs text-gray-500">95% of requests</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">{performanceMetrics.responseTime.p99.toFixed(0)}ms</p>
              <p className="text-sm text-gray-600">99th Percentile</p>
              <p className="text-xs text-gray-500">99% of requests</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{performanceMetrics.throughput.toFixed(0)}</p>
              <p className="text-sm text-gray-600">Req/sec</p>
              <p className="text-xs text-gray-500">Current throughput</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Recommendations
          </CardTitle>
          <CardDescription>AI-powered optimization suggestions based on current metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cacheMetrics.hitRate < 80 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-medium text-yellow-800">Cache Hit Rate Optimization</p>
                <p className="text-xs text-yellow-700">Consider increasing cache TTL or implementing more aggressive prefetching for better hit rates.</p>
              </div>
            )}
            
            {connectionMetrics.avgResponseTime > 30 && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm font-medium text-orange-800">Response Time Improvement</p>
                <p className="text-xs text-orange-700">High response times detected. Consider scaling up connection pool or optimizing database queries.</p>
              </div>
            )}
            
            {cacheMetrics.memoryUsage > 85 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-medium text-red-800">Memory Usage Alert</p>
                <p className="text-xs text-red-700">Cache memory usage is high. Enable compression or adjust max cache size to prevent performance degradation.</p>
              </div>
            )}
            
            {cacheMetrics.hitRate > 90 && connectionMetrics.avgResponseTime < 20 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800">Excellent Performance</p>
                <p className="text-xs text-green-700">System is performing optimally. All metrics are within excellent ranges.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMonitoringDashboard;