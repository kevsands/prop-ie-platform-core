/**
 * Server-side security analytics functions.
 * This module provides server-compatible functions for fetching security data.
 */
 
import { generateClient } from 'aws-amplify/api';
import { safeCacheFunction } from '../../utils/performance/safeCache';
import { API } from '../amplify/api';
import {
  SecurityMetric,
  SecurityEvent,
  AnomalyDetection,
  ThreatIndicator,
  SecuritySnapshot,
  SecurityAnalyticsOptions,
  AnalyticsTimeframe,
  CorrelationResult,
  SecurityPerformanceMetrics
} from './securityAnalyticsTypes';

// Initialize API client for low-level operations if needed
const amplifyClient = generateClient();

// Constants for performance tuning
const DEFAULT_BATCH_SIZE = 20;

/**
 * Helper function to generate date range based on timeframe
 */
function getDateRangeFromTimeframe(
  timeframe: AnalyticsTimeframe = AnalyticsTimeframe.LAST_24_HOURS,
  startDate?: Date,
  endDate?: Date
): { start: Date; end: Date } {
  const now = new Date();
  const end = endDate || now;
  let start: Date;
  
  switch (timeframe) {
    case AnalyticsTimeframe.LAST_HOUR:
      start = new Date(now.getTime() - 60 * 60 * 1000);
      break;
    case AnalyticsTimeframe.TODAY:
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case AnalyticsTimeframe.YESTERDAY:
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      break;
    case AnalyticsTimeframe.LAST_7_DAYS:
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case AnalyticsTimeframe.LAST_30_DAYS:
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case AnalyticsTimeframe.CUSTOM:
      if (!startDate) {
        throw new Error('Start date is required for custom timeframe');
      }
      start = startDate;
      break;
    default:
      start = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Default to last 24 hours
  }
  
  return { start, end };
}

/**
 * Convert options to query parameters
 */
function optionsToParams(options: SecurityAnalyticsOptions = {}): Record<string, string> {
  const params: Record<string, string> = {};
  const { start, end } = getDateRangeFromTimeframe(
    options.timeframe,
    options.startDate,
    options.endDate
  );
  
  params.start = start.toISOString();
  params.end = end.toISOString();
  
  if (options.limit) params.limit = options.limit.toString();
  if (options.category) params.category = options.category;
  if (options.severity?.length) params.severity = options.severity.join(',');
  if (options.source?.length) params.source = options.source.join(',');
  if (options.includeResolved) params.includeResolved = 'true';
  if (options.page) params.page = options.page.toString();
  if (options.withCorrelation) params.withCorrelation = 'true';
  if (options.withRecommendations) params.withRecommendations = 'true';
  
  return params;
}

/**
 * Calculate security score based on metrics, anomalies, and threats
 */
function calculateSecurityScore(
  metrics: SecurityMetric[],
  anomalies: AnomalyDetection[],
  threats: ThreatIndicator[]
): number {
  // Start with perfect score and subtract based on issues
  let score = 100;
  
  // Reduce score based on anomalies (weighted by severity)
  for (const anomaly of anomalies) {
    if (anomaly.status === 'false_positive') continue;
    
    switch (anomaly.severity) {
      case 'low':
        score -= 1;
        break;
      case 'medium':
        score -= 3;
        break;
      case 'high':
        score -= 5;
        break;
      case 'critical':
        score -= 10;
        break;
    }
  }
  
  // Reduce score based on threats (weighted by severity and confidence)
  for (const threat of threats) {
    const confidenceFactor = threat.confidence / 100;
    let severityImpact = 0;
    
    switch (threat.severity) {
      case 'low':
        severityImpact = 2;
        break;
      case 'medium':
        severityImpact = 4;
        break;
      case 'high':
        severityImpact = 7;
        break;
      case 'critical':
        severityImpact = 12;
        break;
    }
    
    score -= severityImpact * confidenceFactor;
  }
  
  // Use relevant metrics to adjust score
  const securityScoreMetric = metrics.find(m => m.name === 'Security Score');
  if (securityScoreMetric) {
    // Blend calculated score with reported score (70/30 split)
    score = 0.7 * score + 0.3 * securityScoreMetric.value;
  }
  
  // Ensure score is between 0-100
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Fetch security metrics using server-compatible API
 * This function is cache-optimized for React Server Components
 */
export const getSecurityMetrics = safeCacheFunction<(options?: SecurityAnalyticsOptions) => Promise<SecurityMetric[]>>(
  async (options: SecurityAnalyticsOptions = {}): Promise<SecurityMetric[]> => {
    const queryParams = optionsToParams(options);
    
    try {
      const metrics = await API.get<SecurityMetric[]>('/api/security/metrics', queryParams);
      return metrics;
    } catch (error) {
      console.error('Error fetching security metrics:', error);
      return [];
    }
  }
);

/**
 * Fetch security events using server-compatible API
 * This function is cache-optimized for React Server Components
 */
export const getSecurityEvents = safeCacheFunction<(options?: SecurityAnalyticsOptions) => Promise<SecurityEvent[]>>(
  async (options: SecurityAnalyticsOptions = {}): Promise<SecurityEvent[]> => {
    const queryParams = optionsToParams(options);
    
    try {
      const events = await API.get<SecurityEvent[]>('/api/security/events', queryParams);
      return events;
    } catch (error) {
      console.error('Error fetching security events:', error);
      return [];
    }
  }
);

/**
 * Fetch anomaly detections using server-compatible API
 * This function is cache-optimized for React Server Components
 */
export const getAnomalyDetections = safeCacheFunction<(options?: SecurityAnalyticsOptions) => Promise<AnomalyDetection[]>>(
  async (options: SecurityAnalyticsOptions = {}): Promise<AnomalyDetection[]> => {
    const queryParams = optionsToParams(options);
    
    try {
      const anomalies = await API.get<AnomalyDetection[]>('/api/security/anomalies', queryParams);
      return anomalies;
    } catch (error) {
      console.error('Error fetching anomaly detections:', error);
      return [];
    }
  }
);

/**
 * Fetch threat indicators using server-compatible API
 * This function is cache-optimized for React Server Components
 */
export const getThreatIndicators = safeCacheFunction<(options?: SecurityAnalyticsOptions) => Promise<ThreatIndicator[]>>(
  async (options: SecurityAnalyticsOptions = {}): Promise<ThreatIndicator[]> => {
    const queryParams = optionsToParams(options);
    
    try {
      const threats = await API.get<ThreatIndicator[]>('/api/security/threats', queryParams);
      return threats;
    } catch (error) {
      console.error('Error fetching threat indicators:', error);
      return [];
    }
  }
);

/**
 * Get a comprehensive security snapshot - optimized for server
 * This function is cache-optimized for React Server Components
 */
export const getSecuritySnapshot = safeCacheFunction<(options?: SecurityAnalyticsOptions) => Promise<SecuritySnapshot>>(
  async (options: SecurityAnalyticsOptions = {}): Promise<SecuritySnapshot> => {
    try {
      // Fetch all data in parallel for performance
      const [metrics, events, anomalies, threats] = await Promise.all([
        getSecurityMetrics(options),
        getSecurityEvents({...options, limit: 10}), // Limit recent events
        getAnomalyDetections({
          ...options, 
          includeResolved: false // Only include active anomalies
        }),
        getThreatIndicators(options)
      ]);
      
      // Calculate alert counts
      const alertCount = {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0
      };
      
      // Count active anomalies by severity
      for (const anomaly of anomalies) {
        if (anomaly.status !== 'false_positive') {
          const severity = anomaly.severity as keyof typeof alertCount;
          alertCount[severity]++;
        }
      }
      
      // Count active threats by severity
      for (const threat of threats) {
        const severity = threat.severity as keyof typeof alertCount;
        alertCount[severity]++;
      }
      
      // Calculate security score
      const securityScore = calculateSecurityScore(
        metrics as SecurityMetric[], 
        anomalies as AnomalyDetection[], 
        threats as ThreatIndicator[]
      );
      
      // Determine overall security status
      let securityStatus: 'normal' | 'elevated' | 'high_alert' | 'critical' = 'normal';
      
      if (alertCount.critical > 0) {
        securityStatus = 'critical';
      } else if (alertCount.high > 0) {
        securityStatus = 'high_alert';
      } else if (alertCount.medium > 0) {
        securityStatus = 'elevated';
      }
      
      return {
        timestamp: new Date(),
        metrics: metrics as SecurityMetric[],
        recentEvents: events as SecurityEvent[],
        activeAnomalies: anomalies as AnomalyDetection[],
        activeThreatIndicators: threats as ThreatIndicator[],
        securityScore,
        securityStatus,
        alertCount
      };
    } catch (error) {
      console.error('Error fetching security snapshot:', error);
      
      // Return a default snapshot in case of error
      return {
        timestamp: new Date(),
        metrics: [],
        recentEvents: [],
        activeAnomalies: [],
        activeThreatIndicators: [],
        securityScore: 0,
        securityStatus: 'normal',
        alertCount: {
          low: 0,
          medium: 0,
          high: 0,
          critical: 0
        }
      };
    }
  }
);

/**
 * Correlate security events - server-side implementation
 */
export async function correlateSecurityEvents(
  eventIds: string[],
  options: SecurityAnalyticsOptions = {}
): Promise<CorrelationResult> {
  if (!eventIds.length) {
    return {
      correlationId: 'empty',
      relatedEvents: [],
      patterns: [],
      score: 0,
      recommendations: []
    };
  }
  
  try {
    const queryParams = {
      ...optionsToParams(options),
      ids: eventIds.join(',')
    };
    
    return await API.get<CorrelationResult>('/api/security/correlate', queryParams);
  } catch (error) {
    console.error('Error correlating security events:', error);
    
    return {
      correlationId: 'error',
      relatedEvents: [],
      patterns: [],
      score: 0,
      recommendations: ['Error correlating events. Please try again.']
    };
  }
}

/**
 * Get performance metrics - simple mock for server-side
 */
export async function getSecurityPerformanceMetrics(): Promise<SecurityPerformanceMetrics> {
  // Server-side implementation returns baseline performance metrics
  return {
    cacheSize: {
      metrics: 0,
      events: 0,
      anomalies: 0,
      threats: 0,
      total: 0
    },
    sseStatus: 'disconnected',
    workerStatus: 'inactive',
    latency: {
      metrics: 150,
      events: 180,
      anomalies: 200,
      threats: 220,
      average: 187.5
    }
  };
}

/**
 * Export all functions as a unified API
 */
export const SecurityAnalyticsServer = {
  getSecurityMetrics,
  getSecurityEvents,
  getAnomalyDetections,
  getThreatIndicators,
  getSecuritySnapshot,
  correlateSecurityEvents,
  getSecurityPerformanceMetrics
};