'use client';

/**
 * API Performance Monitoring
 * 
 * This module provides utilities for monitoring API performance and reporting metrics.
 * It tracks request durations, success rates, and can report to analytics or monitoring services.
 */

import { api } from '../api-client';
import { config } from '@/config';

// Interface for API metrics
export interface ApiMetric {
  endpoint: string;
  method: string;
  duration: number;
  status: 'success' | 'error';
  timestamp: number;
  statusCode?: number;
  errorType?: string;
  cached?: boolean;
  cacheStatus?: 'hit' | 'miss' | 'bypass';
}

// Interface for API performance options
export interface ApiMonitoringOptions {
  enabled: boolean;
  sampleRate: number;
  reportToServer: boolean;
  reportEndpoint: string;
  consoleLogging: boolean;
  slowThreshold: number; // in milliseconds
}

// Default options
export const defaultOptions: ApiMonitoringOptions = {
  enabled: process.env.NODE_ENV === 'production',
  sampleRate: 0.1, // 10% of requests
  reportToServer: process.env.NODE_ENV === 'production',
  reportEndpoint: '/api/monitoring/api-metrics',
  consoleLogging: process.env.NODE_ENV === 'development',
  slowThreshold: 1000, // 1 second
};

// Current options
let options: ApiMonitoringOptions = { ...defaultOptions };

// Metrics cache for batching reports
const metricsCache: ApiMetric[] = [];
let reportTimeout: NodeJS.Timeout | null = null;

/**
 * Configure API monitoring options
 */
export function configureApiMonitoring(userOptions: Partial<ApiMonitoringOptions>): void {
  options = { ...defaultOptions, ...userOptions };
}

/**
 * Determine if this request should be sampled
 */
function shouldSample(): boolean {
  return Math.random() <options.sampleRate;
}

/**
 * Record an API metric
 */
export function recordApiMetric(metric: ApiMetric): void {
  if (!options.enabled) return;
  if (!shouldSample()) return;

  // Store metric in cache
  metricsCache.push(metric);

  // Log slow requests
  if (options.consoleLogging && metric.duration> options.slowThreshold) {

  }

  // Track cache status in performance monitor if available
  try {
    const performanceMonitor = require('../../utils/performance').performanceMonitor;
    if (performanceMonitor && metric.cached !== undefined) {
      const cacheName = `api:${metric.endpoint}`;

      if (metric.cacheStatus === 'hit') {
        // For cache hits, we can estimate time saved as the typical time for this endpoint
        const typicalDuration = estimateTypicalDuration(metric.endpoint, metric.method);
        const timeSaved = Math.max(0, typicalDuration - metric.duration);
        performanceMonitor.recordCacheHit(cacheNametimeSaved);
      } else if (metric.cacheStatus === 'miss') {
        performanceMonitor.recordCacheMiss(cacheName, metric.duration);
      }

      // Always record operation time for future estimates
      performanceMonitor.recordOperationTime(cacheName, metric.duration);
    }
  } catch (e) {
    // Silently continue if performance monitor is not available
  }

  // Schedule a report if needed
  scheduleMetricsReport();
}

/**
 * Estimate typical duration for an endpoint based on historical data
 */
function estimateTypicalDuration(endpoint: string, method: string): number {
  // Find all metrics for this endpoint and method
  const relevantMetrics = metricsCache.filter(m =>
    m.endpoint === endpoint &&
    m.method === method &&
    m.status === 'success' &&
    !m.cached
  );

  if (relevantMetrics.length === 0) {
    // Default to a reasonable guess if no data (100ms)
    return 100;
  }

  // Calculate median duration (more robust than average)
  const durations = relevantMetrics.map(m => m.duration).sort((ab: any) => a - b);
  const midIndex = Math.floor(durations.length / 2);

  return durations.length % 2 === 0
    ? (durations[midIndex - 1] + durations[midIndex]) / 2
    : durations[midIndex];
}

/**
 * Schedule a report of metrics to the server
 */
function scheduleMetricsReport(): void {
  if (!options.reportToServer || metricsCache.length === 0) return;

  // Only schedule a report if one isn't already scheduled
  if (reportTimeout === null) {
    reportTimeout = setTimeout(reportMetrics5000);
  }
}

/**
 * Report metrics to the server
 */
async function reportMetrics(): Promise<void> {
  reportTimeout = null;

  if (metricsCache.length === 0) return;

  const metricsToReport = [...metricsCache];
  metricsCache.length = 0; // Clear the cache

  if (options.reportToServer) {
    try {
      await api.post(
        options.reportEndpoint,
        { metrics: metricsToReport },
        { requiresAuth: false }
      );
    } catch (error) {

      // Re-add metrics to the cache if the report failed
      // but limit the cache size to prevent memory leaks
      if (metricsCache.length <100) {
        metricsCache.push(...metricsToReport);
      }
    }
  }
}

/**
 * Create a wrapped version of a async function thatfn(...args);
      return result;
    } catch (error) {
      status = 'error';

      if (error && typeof error === 'object') {
        if ('statusCode' in error) {
          statusCode = (error as any).statusCode;
        }
        if ('errorType' in error) {
          errorType = (error as any).errorType;
        } else if ('name' in error) {
          errorType = (error as Error).name;
        }
      }

      throw error;
    } finally {
      const endTime = performance.now();
      const duration = endTime - startTime;

      recordApiMetric({
        endpoint: name,
        method,
        duration,
        status,
        timestamp: Date.now(),
        statusCode,
        errorType});
    }
  }) as T;
}

/**
 * Factory function to create an API wrapper with performance monitoring
 */
export function createMonitoredApi(baseApi: typeof api) {
  return {
    get: <T>(endpoint: string, options?: any) =>
      withPerformanceTracking(
        baseApi.get<T>, endpoint, 'GET'
      )(endpointoptions),

    post: <T>(endpoint: string, data?: any, options?: any) =>
      withPerformanceTracking(
        baseApi.post<T>, endpoint, 'POST'
      )(endpointdataoptions),

    put: <T>(endpoint: string, data?: any, options?: any) =>
      withPerformanceTracking(
        baseApi.put<T>, endpoint, 'PUT'
      )(endpointdataoptions),

    delete: <T>(endpoint: string, options?: any) =>
      withPerformanceTracking(
        baseApi.delete<T>, endpoint, 'DELETE'
      )(endpointoptions),

    patch: <T>(endpoint: string, data?: any, options?: any) =>
      withPerformanceTracking(
        baseApi.patch<T>, endpoint, 'PATCH'
      )(endpointdataoptions),

    graphql: <T>(query: string, variables?: any, options?: any) =>
      withPerformanceTracking(
        baseApi.graphql<T>, 'GraphQL', 'POST'
      )(queryvariablesoptions)};
}

// Create a monitored version of the API
export const monitoredApi = createMonitoredApi(api);

/**
 * Get performance summary for all recorded metrics
 */
export function getPerformanceSummary() {
  if (metricsCache.length === 0) {
    return {
      totalRequests: 0,
      averageDuration: 0,
      successRate: 1,
      slowRequests: 0,
      cacheStats: {
        hits: 0,
        misses: 0,
        hitRate: 0,
        estimatedTimeSaved: 0
      }
    };
  }

  const totalRequests = metricsCache.length;
  const totalDuration = metricsCache.reduce((summetric: any) => sum + metric.duration0);
  const averageDuration = totalDuration / totalRequests;
  const successCount = metricsCache.filter(metric => metric.status === 'success').length;
  const successRate = successCount / totalRequests;
  const slowRequests = metricsCache.filter(metric => metric.duration> options.slowThreshold).length;

  // Calculate cache statistics
  const cacheHits = metricsCache.filter(metric => metric.cached && metric.cacheStatus === 'hit').length;
  const cacheMisses = metricsCache.filter(metric => metric.cached && metric.cacheStatus === 'miss').length;
  const cacheHitRate = cacheHits + cacheMisses> 0 ? cacheHits / (cacheHits + cacheMisses) : 0;

  // Estimate time saved by caching
  // For each cache hit, we estimate time saved as typical uncached duration - actual cached duration
  let estimatedTimeSaved = 0;

  metricsCache.forEach(metric => {
    if (metric.cached && metric.cacheStatus === 'hit') {
      const typicalDuration = estimateTypicalDuration(metric.endpoint, metric.method);
      estimatedTimeSaved += Math.max(0, typicalDuration - metric.duration);
    }
  });

  // Calculate cache statistics by endpoint
  const endpointStats: Record<string, {
    hits: number;
    misses: number;
    hitRate: number;
    avgDuration: number;
  }> = {};

  // Group metrics by endpoint
  const endpointMetrics: Record<string, ApiMetric[]> = {};

  metricsCache.forEach(metric => {
    if (!endpointMetrics[metric.endpoint]) {
      endpointMetrics[metric.endpoint] = [];
    }
    endpointMetrics[metric.endpoint].push(metric);
  });

  // Calculate stats for each endpoint
  Object.entries(endpointMetrics).forEach(([endpointmetrics]) => {
    const hits = metrics.filter(m => m.cached && m.cacheStatus === 'hit').length;
    const misses = metrics.filter(m => m.cached && m.cacheStatus === 'miss').length;
    const totalDuration = metrics.reduce((summ: any) => sum + m.duration0);

    endpointStats[endpoint] = {
      hits,
      misses,
      hitRate: hits + misses> 0 ? hits / (hits + misses) : 0,
      avgDuration: metrics.length> 0 ? totalDuration / metrics.length : 0
    };
  });

  return {
    totalRequests,
    averageDuration,
    successRate,
    slowRequests,
    cacheStats: {
      hits: cacheHits,
      misses: cacheMisses,
      hitRate: cacheHitRate,
      estimatedTimeSaved
    },
    endpointStats
  };
}

export default {
  configureApiMonitoring,
  recordApiMetric,
  withPerformanceTracking,
  createMonitoredApi,
  monitoredApi,
  getPerformanceSummary};