/**
 * Security Analytics Module
 * 
 * This module provides analytics and insights for security-related data
 * to help identify trends, detect anomalies, and improve security posture.
 */

import { AuditLogger, AuditCategory, AuditSeverity } from './auditLogger';
import { threatDetector, ThreatType, ThreatSeverity } from './threatDetection';
import { SecurityError, SecurityErrorCode } from './errorHandling';

// Create a simple memory cache for analytics results
class AnalyticsCache {
  private cache: Map<string, { data: any; expiry: number }> = new Map();
  
  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }
    
    // Check if expired
    if (cached.expiry < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data as T;
  }
  
  set(key: string, data: any, ttlMs: number): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttlMs
    });
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  // Clean up expired items
  cleanup(): void {
    const now = Date.now();
    
    for (const [key, value] of this.cache.entries()) {
      if (value.expiry < now) {
        this.cache.delete(key);
      }
    }
  }
}

const analyticsCache = new AnalyticsCache();

// Run cache cleanup every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => analyticsCache.cleanup(), 5 * 60 * 1000);
}

// Types for analytics results
export interface SecurityOverview {
  totalEvents: number;
  criticalEvents: number;
  highSeverityEvents: number;
  mediumSeverityEvents: number;
  lowSeverityEvents: number;
  authenticationMetrics: {
    successfulLogins: number;
    failedLogins: number;
    mfaUsage: number;
    passwordChanges: number;
  };
  threatMetrics: {
    totalThreats: number;
    criticalThreats: number;
    highThreats: number;
    mediumThreats: number;
    lowThreats: number;
    topThreatTypes: Array<{ type: string; count: number; percentage: number }>;
  };
  trends: {
    eventsLastDay: number;
    eventsLastWeek: number;
    eventsLastMonth: number;
    dayOverDayChange: number;
    weekOverWeekChange: number;
  };
  topEvents: Array<{ category: string; action: string; count: number; percentage: number }>;
  geographicData: Array<{ location: string; eventCount: number; successRate: number }>;
  securityScore: number;
  generatedAt: number;
}

export interface TimeframeData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
  }>;
}

export interface DetailedMetrics {
  category: string;
  metrics: Record<string, any>;
  timeframe: 'day' | 'week' | 'month';
  generatedAt: number;
}

export interface SecurityRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  impact: string;
  implementation: string;
  category: string;
}

/**
 * Security analytics service
 */
export class SecurityAnalytics {
  private initialized = false;
  
  /**
   * Initialize the security analytics service
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }
    
    try {
      // Ensure threatDetector is initialized
      if (threatDetector) {
        await threatDetector.initialize();
      }
      
      this.initialized = true;
      
      // Log initialization
      AuditLogger.logSecurity(
        'security_analytics_initialized',
        AuditSeverity.INFO,
        'Security analytics service initialized'
      );
    } catch (error) {
      console.error('Error initializing security analytics:', error);
      
      AuditLogger.logSecurity(
        'security_analytics_init_error',
        AuditSeverity.ERROR,
        'Failed to initialize security analytics',
        { error: error instanceof Error ? error.message : String(error) }
      );
    }
  }
  
  /**
   * Get security overview metrics
   */
  async getSecurityOverview(
    userId?: string,
    refreshCache = false
  ): Promise<SecurityOverview> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    const cacheKey = `security_overview:${userId || 'global'}`;
    
    // Check cache first unless refresh is requested
    if (!refreshCache) {
      const cached = analyticsCache.get<SecurityOverview>(cacheKey);
      if (cached) {
        return cached;
      }
    }
    
    try {
      // Calculate time windows
      const now = Date.now();
      const dayAgo = now - 24 * 60 * 60 * 1000;
      const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
      const monthAgo = now - 30 * 24 * 60 * 60 * 1000;
      
      // Get logs for different time periods
      // In a real implementation, these would be actual calls to get logs
      // For now, we'll use mock data
      const [dayLogs, weekLogs, monthLogs] = await Promise.all([
        this.getMockLogs(dayAgo, now, userId),
        this.getMockLogs(weekAgo, now, userId),
        this.getMockLogs(monthAgo, now, userId)
      ]);
      
      // Get threat detection results
      const threatResults = await threatDetector.analyzeSecurityLogs(userId);
      
      // Calculate authentication metrics
      const authMetrics = {
        successfulLogins: this.countEvents(monthLogs, 'AUTH', 'LOGIN', 'SUCCESS'),
        failedLogins: this.countEvents(monthLogs, 'AUTH', 'LOGIN', 'FAILURE'),
        mfaUsage: this.calculateMfaUsageRate(monthLogs),
        passwordChanges: this.countEvents(monthLogs, 'AUTH', 'PASSWORD_CHANGE', 'SUCCESS')
      };
      
      // Calculate top events
      const topEvents = this.calculateTopEvents(monthLogs);
      
      // Calculate geographic data
      const geoData = this.calculateGeographicData(monthLogs);
      
      // Calculate security score
      const securityScore = this.calculateSecurityScore({
        threatRiskScore: threatResults.riskScore,
        mfaUsageRate: authMetrics.mfaUsage,
        failedLoginRate: authMetrics.failedLogins / Math.max(authMetrics.successfulLogins + authMetrics.failedLogins, 1),
        eventTrends: {
          dayOverDayChange: this.calculatePercentChange(
            dayLogs.length,
            this.getMockLogs(dayAgo - 24 * 60 * 60 * 1000, dayAgo, userId).length
          ),
          weekOverWeekChange: this.calculatePercentChange(
            weekLogs.length,
            this.getMockLogs(weekAgo - 7 * 24 * 60 * 60 * 1000, weekAgo, userId).length
          )
        }
      });
      
      // Process threat types for topThreatTypes ensuring number type
      const processedThreatTypes: Array<{ type: string; count: number; percentage: number }> = 
        Object.entries(threatResults.threatTypes || {}).map(([type, count]) => ({
          type,
          count: typeof count === 'number' ? count : 0, // Ensure count is a number
          percentage: (typeof count === 'number' ? count : 0) / Math.max(threatResults.threatCount, 1) * 100
        })).sort((a, b) => b.count - a.count).slice(0, 5);
      
      // Compile the overview
      const overview: SecurityOverview = {
        totalEvents: monthLogs.length,
        criticalEvents: this.countEventsBySeverity(monthLogs, 'CRITICAL'),
        highSeverityEvents: this.countEventsBySeverity(monthLogs, 'ERROR'),
        mediumSeverityEvents: this.countEventsBySeverity(monthLogs, 'WARNING'),
        lowSeverityEvents: this.countEventsBySeverity(monthLogs, 'INFO'),
        
        authenticationMetrics: authMetrics,
        
        threatMetrics: {
          totalThreats: threatResults.threatCount,
          criticalThreats: threatResults.criticalThreats,
          highThreats: threatResults.highThreats,
          mediumThreats: threatResults.mediumThreats,
          lowThreats: threatResults.lowThreats,
          topThreatTypes: processedThreatTypes
        },
        
        trends: {
          eventsLastDay: dayLogs.length,
          eventsLastWeek: weekLogs.length,
          eventsLastMonth: monthLogs.length,
          dayOverDayChange: this.calculatePercentChange(
            dayLogs.length,
            this.getMockLogs(dayAgo - 24 * 60 * 60 * 1000, dayAgo, userId).length
          ),
          weekOverWeekChange: this.calculatePercentChange(
            weekLogs.length,
            this.getMockLogs(weekAgo - 7 * 24 * 60 * 60 * 1000, weekAgo, userId).length
          )
        },
        
        topEvents,
        geographicData: geoData,
        securityScore,
        generatedAt: now
      };
      
      // Cache the results (5 minute TTL)
      analyticsCache.set(cacheKey, overview, 5 * 60 * 1000);
      
      return overview;
    } catch (error) {
      console.error('Error getting security overview:', error);
      
      AuditLogger.logSecurity(
        'security_analytics_error',
        AuditSeverity.ERROR,
        'Failed to generate security overview',
        { 
          userId,
          errorMessage: error instanceof Error ? error.message : String(error)
        }
      );
      
      throw new SecurityError(
        'Failed to generate security overview',
        SecurityErrorCode.INTERNAL_SECURITY_ERROR,
        { errorMessage: error instanceof Error ? error.message : String(error) }
      );
    }
  }
  
  /**
   * Get timeline data for security events
   */
  async getTimelineData(
    category: string,
    timeframe: 'day' | 'week' | 'month' = 'week',
    userId?: string
  ): Promise<TimeframeData> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    const cacheKey = `timeline:${category}:${timeframe}:${userId || 'global'}`;
    
    // Check cache first
    const cached = analyticsCache.get<TimeframeData>(cacheKey);
    if (cached) {
      return cached;
    }
    
    try {
      const now = Date.now();
      let startTime: number;
      let intervalMs: number;
      let intervals: number;
      
      // Calculate time range based on timeframe
      switch (timeframe) {
        case 'day':
          startTime = now - 24 * 60 * 60 * 1000;
          intervalMs = 60 * 60 * 1000; // 1 hour
          intervals = 24;
          break;
        case 'week':
          startTime = now - 7 * 24 * 60 * 60 * 1000;
          intervalMs = 24 * 60 * 60 * 1000; // 1 day
          intervals = 7;
          break;
        case 'month':
          startTime = now - 30 * 24 * 60 * 60 * 1000;
          intervalMs = 24 * 60 * 60 * 1000; // 1 day
          intervals = 30;
          break;
        default:
          throw new Error(`Invalid timeframe: ${timeframe}`);
      }
      
      // Get logs for the time period
      const logs = await this.getMockLogs(startTime, now, userId);
      
      // Generate labels based on timeframe
      const labels = Array.from({ length: intervals }, (_, i) => {
        const date = new Date(startTime + i * intervalMs);
        
        if (timeframe === 'day') {
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
          return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
      });
      
      // Generate datasets based on category
      let datasets: Array<{ label: string; data: number[] }> = [];
      
      if (category === 'severity') {
        // Group by severity
        const severityLevels = ['CRITICAL', 'ERROR', 'WARNING', 'INFO'];
        
        datasets = severityLevels.map(severity => {
          const data = Array.from({ length: intervals }, (_, i) => {
            const intervalStart = startTime + i * intervalMs;
            const intervalEnd = intervalStart + intervalMs;
            
            return logs.filter(log => 
              log.severity === severity && 
              log.timestamp >= intervalStart && 
              log.timestamp < intervalEnd
            ).length;
          });
          
          return { label: severity, data };
        });
      } else if (category === 'authentication') {
        // Group by authentication status
        datasets = [
          {
            label: 'Successful Logins',
            data: Array.from({ length: intervals }, (_, i) => {
              const intervalStart = startTime + i * intervalMs;
              const intervalEnd = intervalStart + intervalMs;
              
              return logs.filter(log => 
                log.category === 'AUTH' && 
                log.action === 'LOGIN' && 
                log.status === 'SUCCESS' && 
                log.timestamp >= intervalStart && 
                log.timestamp < intervalEnd
              ).length;
            })
          },
          {
            label: 'Failed Logins',
            data: Array.from({ length: intervals }, (_, i) => {
              const intervalStart = startTime + i * intervalMs;
              const intervalEnd = intervalStart + intervalMs;
              
              return logs.filter(log => 
                log.category === 'AUTH' && 
                log.action === 'LOGIN' && 
                log.status === 'FAILURE' && 
                log.timestamp >= intervalStart && 
                log.timestamp < intervalEnd
              ).length;
            })
          }
        ];
      } else if (category === 'threats') {
        // Generate threat data
        datasets = [
          {
            label: 'Detected Threats',
            data: Array.from({ length: intervals }, () => 
              // Mock data for threats
              Math.floor(Math.random() * 5)
            )
          }
        ];
      } else {
        // Default to all events
        datasets = [
          {
            label: 'Security Events',
            data: Array.from({ length: intervals }, (_, i) => {
              const intervalStart = startTime + i * intervalMs;
              const intervalEnd = intervalStart + intervalMs;
              
              return logs.filter(log => 
                log.timestamp >= intervalStart && 
                log.timestamp < intervalEnd
              ).length;
            })
          }
        ];
      }
      
      const result: TimeframeData = { labels, datasets };
      
      // Cache the results (5 minute TTL)
      analyticsCache.set(cacheKey, result, 5 * 60 * 1000);
      
      return result;
    } catch (error) {
      console.error('Error getting timeline data:', error);
      
      AuditLogger.logSecurity(
        'security_analytics_error',
        AuditSeverity.ERROR,
        'Failed to generate timeline data',
        { 
          category, 
          timeframe,
          userId,
          errorMessage: error instanceof Error ? error.message : String(error)
        }
      );
      
      throw new SecurityError(
        'Failed to generate timeline data',
        SecurityErrorCode.INTERNAL_SECURITY_ERROR,
        { errorMessage: error instanceof Error ? error.message : String(error) }
      );
    }
  }
  
  /**
   * Get detailed metrics for a specific category
   */
  async getDetailedMetrics(
    category: string,
    timeframe: 'day' | 'week' | 'month' = 'month',
    userId?: string
  ): Promise<DetailedMetrics> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    const cacheKey = `detailed_metrics:${category}:${timeframe}:${userId || 'global'}`;
    
    // Check cache first
    const cached = analyticsCache.get<DetailedMetrics>(cacheKey);
    if (cached) {
      return cached;
    }
    
    try {
      const now = Date.now();
      let startTime: number;
      
      // Calculate time range based on timeframe
      switch (timeframe) {
        case 'day':
          startTime = now - 24 * 60 * 60 * 1000;
          break;
        case 'week':
          startTime = now - 7 * 24 * 60 * 60 * 1000;
          break;
        case 'month':
          startTime = now - 30 * 24 * 60 * 60 * 1000;
          break;
        default:
          throw new Error(`Invalid timeframe: ${timeframe}`);
      }
      
      // Get logs for the time period
      const logs = await this.getMockLogs(startTime, now, userId);
      
      // Calculate metrics based on category
      let metrics: Record<string, any> = {};
      
      switch (category) {
        case 'authentication':
          metrics = {
            totalLogins: this.countEvents(logs, 'AUTH', 'LOGIN'),
            successfulLogins: this.countEvents(logs, 'AUTH', 'LOGIN', 'SUCCESS'),
            failedLogins: this.countEvents(logs, 'AUTH', 'LOGIN', 'FAILURE'),
            successRate: Math.round(
              (this.countEvents(logs, 'AUTH', 'LOGIN', 'SUCCESS') / 
               Math.max(this.countEvents(logs, 'AUTH', 'LOGIN'), 1)) * 100
            ),
            mfaVerifications: this.countEvents(logs, 'AUTH', 'MFA_VERIFICATION'),
            mfaSuccessRate: Math.round(
              (this.countEvents(logs, 'AUTH', 'MFA_VERIFICATION', 'SUCCESS') / 
               Math.max(this.countEvents(logs, 'AUTH', 'MFA_VERIFICATION'), 1)) * 100
            ),
            passwordChanges: this.countEvents(logs, 'AUTH', 'PASSWORD_CHANGE'),
            accountLockouts: this.countEvents(logs, 'AUTH', 'ACCOUNT_LOCKED'),
            topFailureReasons: this.getTopValues(
              logs.filter(log => 
                log.category === 'AUTH' && 
                log.action === 'LOGIN' && 
                log.status === 'FAILURE'
              ),
              'details.reason',
              5
            ),
            deviceTypes: this.getTopValues(
              logs.filter(log => log.category === 'AUTH'),
              'details.deviceType',
              5
            )
          };
          break;
          
        case 'threats':
          const threatResults = await threatDetector.analyzeSecurityLogs(userId, {
            startTime,
            endTime: now
          });
          
          // Process threat types ensuring number type
          const threatsByType = Object.entries(threatResults.threatTypes || {}).map(([type, count]) => ({
            type,
            count: typeof count === 'number' ? count : 0, // Ensure count is a number
            percentage: (typeof count === 'number' ? count : 0) / Math.max(threatResults.threatCount, 1) * 100
          })).sort((a, b) => b.count - a.count);
          
          metrics = {
            totalThreats: threatResults.threatCount,
            threatsByType,
            threatsBySeverity: {
              critical: threatResults.criticalThreats,
              high: threatResults.highThreats,
              medium: threatResults.mediumThreats,
              low: threatResults.lowThreats
            },
            riskScore: threatResults.riskScore,
            top5Threats: threatResults.threats
              .sort((a, b) => 
                this.getSeverityWeight(b.severity) - this.getSeverityWeight(a.severity)
              )
              .slice(0, 5)
              .map(t => ({
                id: t.id,
                type: t.type,
                severity: t.severity,
                description: t.description
              }))
          };
          break;
          
        case 'access_control':
          metrics = {
            totalAccessEvents: this.countEvents(logs, 'AUTHORIZATION'),
            accessDenied: this.countEvents(logs, 'AUTHORIZATION', undefined, 'FAILURE'),
            accessGranted: this.countEvents(logs, 'AUTHORIZATION', undefined, 'SUCCESS'),
            denyRate: Math.round(
              (this.countEvents(logs, 'AUTHORIZATION', undefined, 'FAILURE') / 
               Math.max(this.countEvents(logs, 'AUTHORIZATION'), 1)) * 100
            ),
            topDeniedResources: this.getTopValues(
              logs.filter(log => 
                log.category === 'AUTHORIZATION' && 
                log.status === 'FAILURE'
              ),
              'resourceType',
              5
            ),
            topDeniedPermissions: this.getTopValues(
              logs.filter(log => 
                log.category === 'AUTHORIZATION' && 
                log.status === 'FAILURE'
              ),
              'details.permission',
              5
            )
          };
          break;
          
        case 'api':
          metrics = {
            totalApiCalls: this.countEvents(logs, 'API'),
            failedApiCalls: this.countEvents(logs, 'API', undefined, 'FAILURE'),
            successfulApiCalls: this.countEvents(logs, 'API', undefined, 'SUCCESS'),
            topEndpoints: this.getTopValues(
              logs.filter(log => log.category === 'API'),
              'details.endpoint',
              10
            ),
            topFailureEndpoints: this.getTopValues(
              logs.filter(log => 
                log.category === 'API' && 
                log.status === 'FAILURE'
              ),
              'details.endpoint',
              5
            ),
            rateLimitEvents: this.countEvents(logs, 'API', 'RATE_LIMIT')
          };
          break;
          
        default:
          metrics = {
            totalEvents: logs.length,
            eventsBySeverity: {
              critical: this.countEventsBySeverity(logs, 'CRITICAL'),
              error: this.countEventsBySeverity(logs, 'ERROR'),
              warning: this.countEventsBySeverity(logs, 'WARNING'),
              info: this.countEventsBySeverity(logs, 'INFO')
            },
            eventsByCategory: this.getCategoryCounts(logs),
            topActions: this.getTopValues(logs, 'action', 10)
          };
      }
      
      const result: DetailedMetrics = {
        category,
        metrics,
        timeframe,
        generatedAt: now
      };
      
      // Cache the results (5 minute TTL)
      analyticsCache.set(cacheKey, result, 5 * 60 * 1000);
      
      return result;
    } catch (error) {
      console.error('Error getting detailed metrics:', error);
      
      AuditLogger.logSecurity(
        'security_analytics_error',
        AuditSeverity.ERROR,
        'Failed to generate detailed metrics',
        { 
          category, 
          timeframe,
          userId,
          errorMessage: error instanceof Error ? error.message : String(error)
        }
      );
      
      throw new SecurityError(
        'Failed to generate detailed metrics',
        SecurityErrorCode.INTERNAL_SECURITY_ERROR,
        { errorMessage: error instanceof Error ? error.message : String(error) }
      );
    }
  }
  
  /**
   * Generate security recommendations based on analytics
   */
  async generateRecommendations(userId?: string): Promise<SecurityRecommendation[]> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    try {
      // Get security overview to analyze
      const overview = await this.getSecurityOverview(userId);
      
      // Generate recommendations based on the data
      const recommendations: SecurityRecommendation[] = [];
      
      // MFA recommendation
      if (overview.authenticationMetrics.mfaUsage < 50) {
        recommendations.push({
          id: 'enable_mfa',
          title: 'Enable Multi-Factor Authentication',
          description: 'MFA usage is below recommended levels. Enabling MFA for all users will significantly improve security.',
          priority: 'high',
          impact: 'Reduces account compromise risk by 99%',
          implementation: 'Implement MFA requirement for all users through the Security Dashboard.',
          category: 'authentication'
        });
      }
      
      // Failed login recommendation
      if (overview.authenticationMetrics.failedLogins > 10) {
        recommendations.push({
          id: 'address_failed_logins',
          title: 'Address Failed Login Attempts',
          description: `There have been ${overview.authenticationMetrics.failedLogins} failed login attempts in the past 30 days.`,
          priority: 'medium',
          impact: 'Reduces risk of brute force attacks',
          implementation: 'Review failed login patterns and implement additional protections like CAPTCHA or temporary lockouts.',
          category: 'authentication'
        });
      }
      
      // Threat recommendations
      if (overview.threatMetrics.criticalThreats > 0 || overview.threatMetrics.highThreats > 0) {
        recommendations.push({
          id: 'address_security_threats',
          title: 'Address Critical Security Threats',
          description: `There are ${overview.threatMetrics.criticalThreats} critical and ${overview.threatMetrics.highThreats} high severity threats detected.`,
          priority: 'critical',
          impact: 'Prevents potential security breaches',
          implementation: 'Review the Security Monitoring Dashboard and address each threat immediately.',
          category: 'threats'
        });
      }
      
      // Add more custom recommendations based on the data
      
      // Sort recommendations by priority
      const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
      recommendations.sort((a, b) => 
        priorityOrder[a.priority as keyof typeof priorityOrder] - 
        priorityOrder[b.priority as keyof typeof priorityOrder]
      );
      
      return recommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      
      AuditLogger.logSecurity(
        'security_analytics_error',
        AuditSeverity.ERROR,
        'Failed to generate security recommendations',
        { 
          userId,
          errorMessage: error instanceof Error ? error.message : String(error)
        }
      );
      
      throw new SecurityError(
        'Failed to generate security recommendations',
        SecurityErrorCode.INTERNAL_SECURITY_ERROR,
        { errorMessage: error instanceof Error ? error.message : String(error) }
      );
    }
  }
  
  /**
   * MOCK: Get security logs
   * This is a mock implementation for testing purposes
   */
  private getMockLogs(startTime: number, endTime: number, userId?: string): any[] {
    // Generate random mock logs for testing
    const logs = [];
    const categories = ['AUTH', 'AUTHORIZATION', 'API', 'DATA_ACCESS', 'SECURITY'];
    const actions = {
      'AUTH': ['LOGIN', 'LOGOUT', 'PASSWORD_CHANGE', 'MFA_VERIFICATION'],
      'AUTHORIZATION': ['RESOURCE_ACCESS', 'PERMISSION_CHECK'],
      'API': ['GET_USER', 'UPDATE_USER', 'GET_DATA', 'RATE_LIMIT'],
      'DATA_ACCESS': ['READ', 'WRITE', 'DELETE'],
      'SECURITY': ['THREAT_DETECTED', 'SESSION_VALIDATION']
    };
    const statuses = ['SUCCESS', 'FAILURE'];
    const severities = ['INFO', 'WARNING', 'ERROR', 'CRITICAL'];
    
    // Generate some logs
    const logCount = Math.floor(Math.random() * 50) + 50; // 50-100 logs
    
    for (let i = 0; i < logCount; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const action = actions[category][Math.floor(Math.random() * actions[category].length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const timestamp = startTime + Math.floor(Math.random() * (endTime - startTime));
      
      logs.push({
        id: `log-${i}`,
        timestamp,
        category,
        action,
        status,
        severity,
        userId: userId || 'user123',
        details: {
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
          deviceType: Math.random() > 0.7 ? 'mobile' : 'desktop',
          browser: Math.random() > 0.6 ? 'Chrome' : Math.random() > 0.3 ? 'Firefox' : 'Safari',
          location: ['New York, US', 'London, UK', 'Dublin, Ireland'][Math.floor(Math.random() * 3)]
        }
      });
    }
    
    return logs;
  }
  
  /**
   * Count events by category, action, and status
   */
  private countEvents(
    logs: any[],
    category?: string,
    action?: string,
    status?: string
  ): number {
    return logs.filter(log => 
      (!category || log.category === category) &&
      (!action || log.action === action) &&
      (!status || log.status === status)
    ).length;
  }
  
  /**
   * Count events by severity
   */
  private countEventsBySeverity(logs: any[], severity: string): number {
    return logs.filter(log => log.severity === severity).length;
  }
  
  /**
   * Get counts of events by category
   */
  private getCategoryCounts(logs: any[]): Record<string, number> {
    const categories: Record<string, number> = {};
    
    for (const log of logs) {
      categories[log.category] = (categories[log.category] || 0) + 1;
    }
    
    return categories;
  }
  
  /**
   * Get top values for a property
   */
  private getTopValues(
    logs: any[],
    property: string,
    limit: number
  ): Array<{ value: string; count: number; percentage: number }> {
    const counts: Record<string, number> = {};
    const total = logs.length;
    
    for (const log of logs) {
      // Handle nested properties (e.g. "details.reason")
      const props = property.split('.');
      let value = log;
      
      for (const prop of props) {
        if (value && typeof value === 'object') {
          value = value[prop];
        } else {
          value = undefined;
          break;
        }
      }
      
      if (value) {
        counts[value] = (counts[value] || 0) + 1;
      }
    }
    
    return Object.entries(counts)
      .map(([value, count]) => ({
        value,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }
  
  /**
   * Calculate percent change between two values
   */
  private calculatePercentChange(current: number, previous: number): number {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    
    return Math.round(((current - previous) / previous) * 100);
  }
  
  /**
   * Calculate MFA usage rate
   */
  private calculateMfaUsageRate(logs: any[]): number {
    const loginEvents = logs.filter(log => 
      log.category === 'AUTH' && 
      log.action === 'LOGIN' && 
      log.status === 'SUCCESS'
    );
    
    if (loginEvents.length === 0) {
      return 0;
    }
    
    const mfaEvents = logs.filter(log => 
      log.category === 'AUTH' && 
      log.action === 'MFA_VERIFICATION' && 
      log.status === 'SUCCESS'
    );
    
    return Math.round((mfaEvents.length / loginEvents.length) * 100);
  }
  
  /**
   * Calculate top events
   */
  private calculateTopEvents(
    logs: any[]
  ): Array<{ category: string; action: string; count: number; percentage: number }> {
    const eventCounts: Record<string, number> = {};
    const total = logs.length;
    
    for (const log of logs) {
      const key = `${log.category}:${log.action}`;
      eventCounts[key] = (eventCounts[key] || 0) + 1;
    }
    
    return Object.entries(eventCounts)
      .map(([key, count]) => {
        const [category, action] = key.split(':');
        
        return {
          category,
          action,
          count,
          percentage: total > 0 ? Math.round((count / total) * 100) : 0
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
  
  /**
   * Calculate geographic data
   */
  private calculateGeographicData(
    logs: any[]
  ): Array<{ location: string; eventCount: number; successRate: number }> {
    const locationCounts: Record<string, { total: number; success: number }> = {};
    
    for (const log of logs) {
      const location = log.details?.location;
      
      if (location) {
        if (!locationCounts[location]) {
          locationCounts[location] = { total: 0, success: 0 };
        }
        
        locationCounts[location].total++;
        
        if (log.status === 'SUCCESS') {
          locationCounts[location].success++;
        }
      }
    }
    
    return Object.entries(locationCounts)
      .map(([location, { total, success }]) => ({
        location,
        eventCount: total,
        successRate: Math.round((success / total) * 100)
      }))
      .sort((a, b) => b.eventCount - a.eventCount);
  }
  
  /**
   * Calculate security score
   */
  private calculateSecurityScore(metrics: {
    threatRiskScore: number;
    mfaUsageRate: number;
    failedLoginRate: number;
    eventTrends: {
      dayOverDayChange: number;
      weekOverWeekChange: number;
    };
  }): number {
    // Calculate base score (0-100)
    // Lower is better for threat risk and failed login rate
    // Higher is better for MFA usage
    const threatScore = Math.max(0, 100 - metrics.threatRiskScore);
    const mfaScore = metrics.mfaUsageRate;
    const loginScore = Math.max(0, 100 - (metrics.failedLoginRate * 100));
    
    // Check for concerning trends (large increases in event volume)
    const trendPenalty = (
      (metrics.eventTrends.dayOverDayChange > 200 ? 10 : 0) +
      (metrics.eventTrends.weekOverWeekChange > 100 ? 5 : 0)
    );
    
    // Calculate weighted score
    const weightedScore = (
      (threatScore * 0.4) +
      (mfaScore * 0.3) +
      (loginScore * 0.3)
    );
    
    // Apply penalty
    return Math.max(0, Math.min(100, Math.round(weightedScore - trendPenalty)));
  }
  
  /**
   * Get severity weight for sorting
   */
  private getSeverityWeight(severity: ThreatSeverity): number {
    switch (severity) {
      case ThreatSeverity.CRITICAL: return 4;
      case ThreatSeverity.HIGH: return 3;
      case ThreatSeverity.MEDIUM: return 2;
      case ThreatSeverity.LOW: return 1;
      default: return 0;
    }
  }
}

// Export singleton instance
export const securityAnalytics = new SecurityAnalytics();

// Initialize on module load
if (typeof window !== 'undefined') {
  securityAnalytics.initialize().catch(console.error);
}

export default securityAnalytics;