/**
 * Security and Performance Types
 * 
 * This file defines shared type definitions for security and performance features
 * that are used across the application. It provides consistent interfaces for
 * monitoring, correlation, and analysis features.
 */

// -------------------------------------------------------------------------
// Common Enum Types
// -------------------------------------------------------------------------

/**
 * Common severity levels across security and performance
 */
export enum SeverityLevel {
  NONE = 'none',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Time range for analytics and monitoring
 */
export enum TimeRange {
  LAST_HOUR = 'last_hour',
  LAST_24_HOURS = 'last_24_hours',
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  LAST_7_DAYS = 'last_7_days',
  LAST_30_DAYS = 'last_30_days',
  CUSTOM = 'custom'
}

/**
 * Status of a process, feature, or component
 */
export enum OperationalStatus {
  NORMAL = 'normal',
  DEGRADED = 'degraded',
  WARNING = 'warning',
  CRITICAL = 'critical',
  OFFLINE = 'offline'
}

/**
 * Trend direction for metrics
 */
export enum TrendDirection {
  IMPROVING = 'improving',
  STABLE = 'stable',
  DEGRADING = 'degrading',
  UNKNOWN = 'unknown'
}

/**
 * Correlation strength between events or metrics
 */
export enum CorrelationStrength {
  NONE = 'none',        // No correlation detected
  WEAK = 'weak',        // Some correlation but low confidence
  MODERATE = 'moderate', // Moderate correlation with reasonable confidence
  STRONG = 'strong',     // Strong correlation with high confidence
  CAUSATION = 'causation' // Direct causation detected
}

// -------------------------------------------------------------------------
// Security Types
// -------------------------------------------------------------------------

/**
 * Security metric data
 */
export interface SecurityMetric {
  /** Unique identifier */
  id: string;
  /** Metric name */
  name: string;
  /** Metric value */
  value: number;
  /** Timestamp when the metric was recorded */
  timestamp: Date | number;
  /** Metric category */
  category: string;
  /** Type of value */
  valueType: 'count' | 'percentage' | 'duration' | 'score';
  /** Trend direction */
  trend?: TrendDirection | 'up' | 'down' | 'stable';
  /** Current status */
  status?: OperationalStatus | 'normal' | 'warning' | 'critical';
  /** Percentage change from previous period */
  changePercentage?: number;
}

/**
 * Security event data
 */
export interface SecurityEvent {
  /** Unique identifier */
  id: string;
  /** Event type */
  type: string;
  /** Event action */
  action?: string;
  /** Event severity */
  severity: SeverityLevel | 'info' | 'low' | 'medium' | 'high' | 'critical';
  /** Timestamp when the event occurred */
  timestamp: Date | number;
  /** Source of the event */
  source: string;
  /** Event category */
  category?: string;
  /** Additional details about the event */
  details: Record<string, any>
  );
  /** Related entities (IDs) */
  relatedEntities?: string[];
  /** Current status of the event */
  status: 'detected' | 'investigating' | 'mitigated' | 'resolved';
  /** Action taken to address the event */
  actionTaken?: string;
}

/**
 * Security anomaly detection
 */
export interface SecurityAnomaly {
  /** Unique identifier */
  id: string;
  /** Anomaly pattern */
  pattern: string;
  /** Confidence level (0-100) */
  confidence: number;
  /** Anomaly severity */
  severity: SeverityLevel | 'low' | 'medium' | 'high' | 'critical';
  /** Timestamp when the anomaly was detected */
  detectedAt: Date | number;
  /** Systems affected by the anomaly */
  affectedSystems: string[];
  /** Anomaly description */
  description: string;
  /** Recommended actions */
  recommendations: string[];
  /** Current status */
  status: 'new' | 'analyzing' | 'confirmed' | 'false_positive';
  /** Related event IDs */
  relatedEvents?: string[];
}

/**
 * Security threat indicator
 */
export interface ThreatIndicator {
  /** Unique identifier */
  id: string;
  /** Indicator type */
  type: 'ip' | 'domain' | 'file_hash' | 'url' | 'user_agent' | 'behavior';
  /** Indicator value */
  value: string;
  /** Confidence level (0-100) */
  confidence: number;
  /** Severity level */
  severity: SeverityLevel | 'low' | 'medium' | 'high' | 'critical';
  /** Timestamp when first seen */
  firstSeen: Date | number;
  /** Timestamp when last seen */
  lastSeen: Date | number;
  /** Indicator source */
  source: string;
  /** Additional context */
  context: Record<string, any>
  );
  /** Related event IDs */
  relatedEvents?: string[];
}

/**
 * Security snapshot data
 */
export interface SecuritySnapshot {
  /** Timestamp of the snapshot */
  timestamp: Date | number;
  /** Security metrics */
  metrics: SecurityMetric[];
  /** Recent security events */
  recentEvents: SecurityEvent[];
  /** Active anomalies */
  activeAnomalies: SecurityAnomaly[];
  /** Active threat indicators */
  activeThreatIndicators: ThreatIndicator[];
  /** Overall security score (0-100) */
  securityScore: number;
  /** Current security status */
  securityStatus: OperationalStatus | 'normal' | 'elevated' | 'high_alert' | 'critical';
  /** Count of alerts by severity */
  alertCount: {
    /** Low severity alerts */
    low: number;
    /** Medium severity alerts */
    medium: number;
    /** High severity alerts */
    high: number;
    /** Critical severity alerts */
    critical: number;
  };
}

/**
 * Security dashboard analytics options
 */
export interface SecurityAnalyticsOptions {
  /** Time frame for the analysis */
  timeframe?: TimeRange;
  /** Custom start date */
  startDate?: Date | number;
  /** Custom end date */
  endDate?: Date | number;
  /** Maximum number of results */
  limit?: number;
  /** Filter by category */
  category?: string;
  /** Filter by severity */
  severity?: string[];
  /** Filter by source */
  source?: string[];
  /** Whether to include resolved events */
  includeResolved?: boolean;
  /** Page number for pagination */
  page?: number;
  /** Whether to include correlation data */
  withCorrelation?: boolean;
  /** Whether to include recommendations */
  withRecommendations?: boolean;
  /** Whether to refresh cache */
  refreshCache?: boolean;
}

// -------------------------------------------------------------------------
// Performance Types
// -------------------------------------------------------------------------

/**
 * Performance monitor options
 */
export interface PerformanceMonitorOptions {
  /** Whether to log performance data to console */
  enableConsoleLogging?: boolean;
  /** Minimum render time (in ms) to consider as a slow render worth logging */
  slowRenderThreshold?: number;
  /** Whether to track memory usage (if available in the browser) */
  trackMemoryUsage?: boolean;
  /** Whether to automatically track page transitions */
  trackPageTransitions?: boolean;
  /** Whether to send metrics to an analytics service */
  reportToAnalytics?: boolean;
  /** Whether to collect performance entries from PerformanceObserver */
  collectPerformanceEntries?: boolean;
}

/**
 * Component render timing data
 */
export interface ComponentRenderTiming {
  /** Component name */
  componentName: string;
  /** Render start time */
  startTime: number;
  /** Render end time */
  endTime: number;
  /** Total render duration in milliseconds */
  duration: number;
  /** Whether this was an initial render or a re-render */
  isRerender: boolean;
  /** Optional additional context information */
  context?: Record<string, any>
  );
}

/**
 * Application performance metrics
 */
export interface AppPerformanceMetrics {
  /** First Contentful Paint time in ms */
  fcp?: number;
  /** Largest Contentful Paint time in ms */
  lcp?: number;
  /** First Input Delay in ms */
  fid?: number;
  /** Cumulative Layout Shift score */
  cls?: number;
  /** Time to Interactive in ms */
  tti?: number;
  /** Total Blocking Time in ms */
  tbt?: number;
  /** Memory usage in MB (if available) */
  memoryUsage?: number;
  /** JavaScript heap size in MB (if available) */
  jsHeapSize?: number;
}

/**
 * Performance metric data
 */
export interface PerformanceMetric {
  /** Unique identifier */
  id: string;
  /** Metric name */
  name: string;
  /** Metric value */
  value: number;
  /** Measurement unit */
  unit: string;
  /** Timestamp when the metric was recorded */
  timestamp: number;
  /** Metric source */
  source: 'client' | 'server' | 'api' | 'database';
  /** Additional context */
  context?: Record<string, any>
  );
}

/**
 * Resource utilization data
 */
export interface ResourceUtilization {
  /** Unique identifier */
  id: string;
  /** Resource type */
  resourceType: 'cpu' | 'memory' | 'network' | 'storage' | 'database';
  /** Percentage utilization */
  value: number;
  /** Absolute value */
  absoluteValue?: number;
  /** Unit for absolute value */
  unit?: string;
  /** Timestamp when the utilization was recorded */
  timestamp: number;
  /** Additional context */
  context?: Record<string, any>
  );
}

// -------------------------------------------------------------------------
// Security-Performance Integration Types
// -------------------------------------------------------------------------

/**
 * Impact of security features on performance
 */
export interface SecurityFeatureImpact {
  /** Feature identifier */
  featureId: string;
  /** Feature name */
  featureName: string;
  /** Average impact in milliseconds */
  averageImpact: number;
  /** Impact as percentage of total time */
  percentageImpact: number;
  /** Number of samples measured */
  samples: number;
  /** When last measured */
  lastMeasured: number;
  /** Trend direction */
  trend: TrendDirection | 'improving' | 'stable' | 'degrading';
  /** Recommended optimizations */
  recommendations?: string[];
}

/**
 * Correlation between security and performance
 */
export interface PerformanceCorrelation {
  /** Correlation identifier */
  id: string;
  /** Related security event ID */
  securityEventId?: string;
  /** Security event type */
  securityEventType?: string;
  /** Related performance metric ID */
  performanceMetricId: string;
  /** Performance metric name */
  performanceMetricName: string;
  /** Correlation strength */
  correlationStrength: CorrelationStrength;
  /** Impact severity */
  impactSeverity: SeverityLevel;
  /** When the correlation was detected */
  detectedAt: number;
  /** Additional context */
  context?: Record<string, any>
  );
  /** Resources affected by the correlation */
  affectedResources?: string[];
  /** Recommended actions */
  recommendations?: string[];
}

/**
 * Performance correlation analysis item
 * Used when correlating events with metrics
 */
export interface PerformanceCorrelationItem {
  /** The security event being correlated */
  event: SecurityEvent;
  /** The performance metric being correlated */
  metric: PerformanceMetric;
  /** Time difference between event and metric in milliseconds */
  timeDelta: number;
}

/**
 * Performance correlation event
 * Used specifically for mapping security events to performance impacts in the correlation service
 */
export interface PerformanceCorrelationEvent {
  /** The security event causing the correlation */
  event: SecurityEvent;
  /** The performance metric affected by the event */
  metric: PerformanceMetric;
  /** Time difference between event and metric in milliseconds */
  timeDelta: number;
}

/**
 * Performance optimization recommendation
 */
export interface PerformanceRecommendation {
  /** Recommendation identifier */
  id: string;
  /** Recommendation title */
  title: string;
  /** Detailed description */
  description: string;
  /** Expected impact */
  impact: SeverityLevel | 'low' | 'medium' | 'high';
  /** Implementation effort */
  effort: 'low' | 'medium' | 'high';
  /** Recommendation category */
  category: 'optimization' | 'configuration' | 'architecture' | 'implementation';
  /** Related correlation IDs */
  relatedCorrelations?: string[];
  /** Implementation steps */
  steps?: string[];
}

/**
 * Correlation analysis overview
 */
export interface CorrelationOverview {
  /** Performance correlations */
  correlations: PerformanceCorrelation[];
  /** Performance recommendations */
  recommendations: PerformanceRecommendation[];
  /** Security feature impacts */
  featureImpacts: SecurityFeatureImpact[];
  /** When the overview was last updated */
  lastUpdated: number;
}

/**
 * Security performance metrics
 */
export interface SecurityPerformanceMetrics {
  /** Cache size information */
  cacheSize: {
    /** Metrics cache size */
    metrics: number;
    /** Events cache size */
    events: number;
    /** Anomalies cache size */
    anomalies: number;
    /** Threats cache size */
    threats: number;
    /** Total cache size */
    total: number;
  };
  /** Server-sent events status */
  sseStatus: 'connected' | 'connecting' | 'disconnected';
  /** Worker status */
  workerStatus: 'active' | 'inactive';
  /** Latency measurements */
  latency: {
    /** Metrics latency */
    metrics: number;
    /** Events latency */
    events: number;
    /** Anomalies latency */
    anomalies: number;
    /** Threats latency */
    threats: number;
    /** Average latency */
    average: number;
  };
}