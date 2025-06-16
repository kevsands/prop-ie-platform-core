/**
 * Security Analytics Types
 * 
 * Comprehensive type definitions for the security analytics system
 * Compatible with AWS Amplify v6 and Next.js App Router
 */

/**
 * Analytics timeframe enum for specifying data time ranges
 */
export enum AnalyticsTimeframe {
  LAST_HOUR = 'last_hour',
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  LAST_7_DAYS = 'last_7_days',
  LAST_30_DAYS = 'last_30_days',
  CUSTOM = 'custom',
  LAST_24_HOURS = 'last_24_hours'}

/**
 * Security metric data point
 * Represents a single security measurement or indicator
 */
export interface SecurityMetric {
  id: string;
  name: string;
  value: number;
  timestamp: Date;
  category: string;
  valueType: 'count' | 'percentage' | 'duration' | 'score';
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  status?: 'normal' | 'warning' | 'critical';
  source?: string;
  metadata?: Record<string, any>
  );
}

/**
 * Security event record
 * Represents a security-relevant activity or occurrence
 */
export interface SecurityEvent {
  id: string;
  type: string;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  source: string;
  details: Record<string, any>
  );
  relatedEntities?: string[];
  status: 'detected' | 'investigating' | 'mitigated' | 'resolved';
  actionTaken?: string;
  userId?: string;
  ipAddress?: string;
  resource?: string;
  resourceId?: string;
  description?: string;
  relatedEvents?: string[];
}

/**
 * Anomaly detection result
 * Represents a detected pattern that deviates from normal behavior
 */
export interface AnomalyDetection {
  id: string;
  pattern: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: Date;
  affectedSystems: string[];
  description: string;
  recommendations: string[];
  status: 'new' | 'analyzing' | 'confirmed' | 'false_positive';
  relatedEvents?: string[];
  source?: string;
  category?: string;
  affectedResource?: string;
  affectedUser?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
  metadata?: Record<string, any>
  );
}

/**
 * Threat indicator
 * Represents a signal of potential security threat
 */
export interface ThreatIndicator {
  id: string;
  type: 'ip' | 'domain' | 'file_hash' | 'url' | 'user_agent' | 'behavior';
  value: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  firstSeen: Date;
  lastSeen: Date;
  source: string;
  context: Record<string, any>
  );
  relatedEvents?: string[];
  description?: string;
  indicators?: {
    ipAddress?: string[];
    domain?: string[];
    hash?: string[];
    userAgent?: string[];
    path?: string[];
    other?: Record<string, string[]>
  );
  };
  status?: 'active' | 'expired' | 'false_positive';
  relatedThreats?: string[];
  metadata?: Record<string, any>
  );
}

/**
 * Correlation pattern between security events
 * Identifies relationships between different security events
 */
export interface CorrelationPattern {
  id: string;
  name: string;
  description: string;
  confidence: number; // 0-100
  severity: 'low' | 'medium' | 'high' | 'critical';
  eventSequence: {
    eventId: string;
    position: number;
    importance: number; // 0-100
  }[];
}

/**
 * Correlation analysis result
 * Output of correlation analysis on security events
 */
export interface CorrelationResult {
  correlationId: string;
  relatedEvents: SecurityEvent[];
  patterns: string[] | CorrelationPattern[];
  score: number;
  recommendations: string[];
}

/**
 * Comprehensive security snapshot
 * Complete picture of security status at a point in time
 */
export interface SecuritySnapshot {
  timestamp: Date;
  metrics: SecurityMetric[];
  recentEvents: SecurityEvent[];
  activeAnomalies: AnomalyDetection[];
  activeThreatIndicators: ThreatIndicator[];
  securityScore: number;
  securityStatus: 'normal' | 'elevated' | 'high_alert' | 'critical';
  alertCount: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

/**
 * Security analytics performance metrics
 * Monitoring information about the analytics system itself
 */
export interface SecurityPerformanceMetrics {
  cacheSize: {
    metrics: number;
    events: number;
    anomalies: number;
    threats: number;
    total: number;
  };
  sseStatus: 'connected' | 'connecting' | 'disconnected';
  workerStatus: 'active' | 'inactive';
  latency: {
    metrics: number; // ms
    events: number; // ms
    anomalies: number; // ms
    threats: number; // ms
    average: number; // ms
  };
}

/**
 * Security analytics options
 * Configuration options for analytics API calls
 */
export interface SecurityAnalyticsOptions {
  timeframe?: AnalyticsTimeframe;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  category?: string;
  severity?: string[];
  source?: string[];
  includeResolved?: boolean;
  page?: number;
  withCorrelation?: boolean;
  withRecommendations?: boolean;
  refreshCache?: boolean;
  eventIds?: string[];
}

/**
 * Security violation detected by the client-side monitor
 * Represents a security issue detected in the browser
 */
export interface SecurityViolation {
  id: string;
  timestamp: Date;
  type: 'xss' | 'csrf' | 'csp' | 'redirect' | 'dom_tampering' | 'injection' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  details?: Record<string, any>
  );
  url: string;
  userId?: string;
  sessionId?: string;
  remediation?: string;
}

/**
 * Type for security monitor configuration
 * Options for configuring client-side security monitoring
 */
export interface SecurityMonitorConfig {
  enableRedirectProtection?: boolean;
  enableXSSDetection?: boolean;
  enableCSPReporting?: boolean;
  enableFormProtection?: boolean;
  enableInlineScriptChecking?: boolean;
  reportViolationsToBackend?: boolean;
  reportEndpoint?: string;
  blockOnCriticalViolations?: boolean;
}