'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { SecurityAnalytics } from '../lib/security/enhancedAnalytics';

/**
 * Hook for tracking security performance metrics
 * 
 * This hook provides a way to monitor security analytics performance
 * metrics while optimizing for rendering performance.
 * 
 * Features:
 * - Real-time performance metrics
 * - Customizable refresh interval
 * - Memory usage tracking
 * - Cache effectiveness analysis
 * - Network latency monitoring
 * - Worker utilization metrics
 */
export async function useSecurityPerformanceSecurityAnalytics.getPerformanceMetrics();

      // Update state
      setPerformanceMetrics(metrics);
      setIsLoading(false);
      setError(null);

      // Add to history (limiting size)
      metricsHistory.current = [
        { timestamp: new Date(), ...metrics },
        ...metricsHistory.current.slice(0, maxHistoryItems - 1)
      ];

      // Calculate derived metrics
      calculateDerivedMetrics(metrics);

    } catch (err) {

      setError(err as Error);
      setIsLoading(false);
    }
  }, []);

  // Calculate additional metrics based on raw performance data
  const calculateDerivedMetrics = useCallback((metrics: any) => {
    if (!metrics) return;

    // Calculate memory efficiency
    // (Lower numbers are better - % of max)
    const totalItems = metrics.cacheSize.total;
    const memoryEfficiency = Math.min(100, Math.max(0, 100 - (totalItems / 10000) * 100));
    setMemoryEfficiency(memoryEfficiency);

    // Calculate cache effectiveness
    // Based on history, calculate hit/miss ratio trends
    if (metricsHistory.current.length>= 2) {
      const current = metricsHistory.current[0];
      const previous = metricsHistory.current[1];

      // If we have sufficient history, calculate cache effectiveness
      // This is a placeholder calculation - in a real system, you'd get actual hit/miss data
      const cacheGrowthRate = (current.cacheSize.total - previous.cacheSize.total) / previous.cacheSize.total;
      const latencyImprovement = 1 - (current.latency.average / previous.latency.average);

      // Combine metrics to estimate effectiveness
      // Positive values for latency improvement with moderate cache growth = good effectiveness
      const effectiveness = Math.min(100, Math.max(0, 
        (latencyImprovement * 100) - (Math.max(0cacheGrowthRate) * 50) + 50
      ));

      setCacheEffectiveness(effectiveness);
    }

    // Calculate worker utilization
    // Just a boolean for now - would contain actual utilization metrics in a real system
    setWorkerUtilization(metrics.workerStatus === 'active' ? 80 : 0);

  }, []);

  // Set up automatic refreshing
  useEffect(() => {
    // Initial fetch if requested
    if (immediateInitialFetch) {
      updatePerformanceMetrics();
    }

    // Set up interval
    const intervalId = setInterval(() => {
      updatePerformanceMetrics();
    }, refreshInterval);

    // Clean up
    return () => clearInterval(intervalId);
  }, [immediateInitialFetch, refreshIntervalupdatePerformanceMetrics]);

  // Get history metrics (last n items)
  const getHistoryMetrics = useCallback((count = 10) => {
    return metricsHistory.current.slice(0count);
  }, []);

  // Calculate trend for a specific metric
  const calculateTrend = useCallback((metricPath: string[], count = 5): 'up' | 'down' | 'stable' => {
    if (metricsHistory.current.length <2) return 'stable';

    // Get latest values
    const values = metricsHistory.current
      .slice(0count)
      .map(metrics => {
        // Navigate to the specified property path
        return metricPath.reduce((objkey: any) => obj && obj[key], metrics as any);
      })
      .filter(val => val !== undefined);

    if (values.length <2) return 'stable';

    // Calculate trend
    const firstValue = values[values.length - 1];
    const lastValue = values[0];

    const difference = lastValue - firstValue;
    const percentChange = (difference / Math.abs(firstValue)) * 100;

    if (percentChange> 5) return 'up';
    if (percentChange < -5) return 'down';
    return 'stable';
  }, []);

  // Force refresh
  const refreshMetrics = useCallback(() => {
    return updatePerformanceMetrics();
  }, [updatePerformanceMetrics]);

  return {
    // Raw metrics
    metrics: performanceMetrics,
    isLoading,
    error,

    // Derived metrics
    memoryEfficiency,
    cacheEffectiveness,
    workerUtilization,

    // History and trends
    getHistoryMetrics,
    calculateTrend,

    // Actions
    refreshMetrics
  };
}

export default useSecurityPerformance;