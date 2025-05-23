'use client';

import { SecurityEvent, SecurityMetric, SecurityAnalytics } from './enhancedAnalytics';
import { asyncSafeCache, ttlCache } from '@/utils/performance/safeCache';
import {
  CorrelationOverview,
  CorrelationStrength,
  PerformanceCorrelation,
  PerformanceCorrelationEvent,
  PerformanceMetric,
  PerformanceRecommendation,
  ResourceUtilization,
  SecurityFeatureImpact,
  SeverityLevel
} from '@/types/common/security-performance';

/**
 * Performance Correlation Service
 * 
 * Correlates performance metrics with security events to identify performance 
 * impacts from security issues or potential security issues indicated by performance anomalies.
 * 
 * Features:
 * - Time-based correlation between performance drops and security events
 * - Resource impact analysis for security features
 * - Anomaly detection for performance-related security issues
 * - Threshold-based alerts for performance degradation related to security
 * - Optimization recommendations based on analysis
 */

interface PerformanceCorrelationConfig {
  apiEndpoint?: string;
  refreshInterval?: number;
  enableAutoCollection?: boolean;
  collectionInterval?: number;
  correlationThreshold?: number;
  impactThreshold?: number;
  enableBackgroundAnalysis?: boolean;
}

// Default configuration
const DEFAULT_CONFIG: PerformanceCorrelationConfig = {
  apiEndpoint: '/api/security/performance',
  refreshInterval: 300000, // 5 minutes
  enableAutoCollection: true,
  collectionInterval: 60000, // 1 minute
  correlationThreshold: 0.7, // 70% correlation required to report
  impactThreshold: 100, // 100ms impact to report
  enableBackgroundAnalysis: true
};

/**
 * Performance Correlation Service
 * For analyzing relationships between security events and performance metrics
 */
class PerformanceCorrelationService {
  private config: PerformanceCorrelationConfig;
  private isInitialized = false;
  private refreshIntervalId: number | null = null;
  private collectionIntervalId: number | null = null;
  private performanceMetrics: Map<string, PerformanceMetric[]> = new Map();
  private resourceUtilization: Map<string, ResourceUtilization[]> = new Map();
  private correlations: PerformanceCorrelation[] = [];
  private featureImpacts: Map<string, SecurityFeatureImpact> = new Map();
  private recommendations: Map<string, PerformanceRecommendation> = new Map();
  private latestOverview: CorrelationOverview | null = null;
  private eventListeners: Map<string, Set<Function>> = new Map();
  private pendingAnalysis = false;

  constructor(config: PerformanceCorrelationConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Initialize the performance correlation service
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load initial data if available
      await this.loadInitialData();

      // Set up refresh interval for data
      if (this.config.refreshInterval && typeof window !== 'undefined') {
        this.refreshIntervalId = window.setInterval(
          () => this.refreshData(),
          this.config.refreshInterval
        );
      }

      // Set up collection interval for performance metrics
      if (this.config.enableAutoCollection && 
          this.config.collectionInterval && 
          typeof window !== 'undefined') {
        this.collectionIntervalId = window.setInterval(
          () => this.collectPerformanceMetrics(),
          this.config.collectionInterval
        );

        // Collect metrics immediately
        this.collectPerformanceMetrics();
      }

      // Attach to SecurityAnalytics event stream for real-time correlation
      SecurityAnalytics.on('event', (events: SecurityEvent[]) => {
        if (this.config.enableBackgroundAnalysis) {
          this.correlateEventsWithMetrics(events);
        }
      });

      SecurityAnalytics.on('metric', (metrics: SecurityMetric[]) => {
        if (this.config.enableBackgroundAnalysis) {
          this.analyzeSecurityMetrics(metrics);
        }
      });

      this.isInitialized = true;

      // Emit initialized event
      this.emit('initialized');
    } catch (error) {

      // Continue in degraded mode
      this.isInitialized = true;
    }
  }

  /**
   * Get performance correlations with caching
   * @param minCorrelationStrength Minimum correlation strength to include
   * @param minImpactSeverity Minimum impact severity to include
   * @param limit Maximum number of correlations to return
   */
  getCorrelations = ttlCache(async function(
      this: PerformanceCorrelationService,
      minCorrelationStrength: CorrelationStrength = CorrelationStrength.MODERATE,
      minImpactSeverity: SeverityLevel = SeverityLevel.LOW,
      limit: number = 10
    ): Promise<PerformanceCorrelation[]> {
      await this.ensureInitialized();

      try {
        const params = new URLSearchParams({
          minCorrelationStrength: minCorrelationStrength.toString(),
          minImpactSeverity: minImpactSeverity.toString(),
          limit: limit.toString()
        });

        const response = await fetch(`${this.config.apiEndpoint}/correlations?${params}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Error fetching correlations: ${response.statusText}`);
        }

        const correlations: PerformanceCorrelation[] = await response.json();

        // Update cache
        this.correlations = correlations;

        return correlations;
      } catch (error) {

        // Return cached correlations filtered by criteria
        return this.correlations
          .filter((c: PerformanceCorrelation) => {
            const strengthMap: Record<string, number> = {
              [CorrelationStrength.NONE]: 0,
              [CorrelationStrength.WEAK]: 1,
              [CorrelationStrength.MODERATE]: 2,
              [CorrelationStrength.STRONG]: 3,
              [CorrelationStrength.CAUSATION]: 4
            };

            const severityMap: Record<string, number> = {
              [SeverityLevel.NONE]: 0,
              [SeverityLevel.LOW]: 1,
              [SeverityLevel.MEDIUM]: 2,
              [SeverityLevel.HIGH]: 3,
              [SeverityLevel.CRITICAL]: 4
            };

            return strengthMap[c.correlationStrength.toString()] >= strengthMap[minCorrelationStrength.toString()] &&
                  severityMap[c.impactSeverity.toString()] >= severityMap[minImpactSeverity.toString()];
          })
          .slice(0limit);
      }
    }
  )

  /**
   * Get feature impacts with caching
   * @param featureIds Optional specific features to get impact for
   */
  getFeatureImpacts = ttlCache(async function(this: PerformanceCorrelationService, featureIds?: string[]): Promise<SecurityFeatureImpact[]> {
      await this.ensureInitialized();

      try {
        const params = new URLSearchParams(
          featureIds ? { featureIds: featureIds.join(',') } : {}
        );

        const response = await fetch(`${this.config.apiEndpoint}/impacts?${params}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Error fetching feature impacts: ${response.statusText}`);
        }

        const impacts: SecurityFeatureImpact[] = await response.json();

        // Update cache
        impacts.forEach(impact => {
          this.featureImpacts.set(impact.featureIdimpact);
        });

        return impacts;
      } catch (error) {

        // Return cached impacts filtered by feature IDs if specified
        const impacts = Array.from(this.featureImpacts.values()) as SecurityFeatureImpact[];

        if (featureIds?.length) {
          return impacts.filter(impact => 
            impact && 'featureId' in impact && featureIds.includes(impact.featureId)
          );
        }

        return impacts;
      }
    }
  )

  /**
   * Get optimization recommendations with caching
   * @param category Optional filter by recommendation category
   * @param impactLevel Optional minimum impact level
   */
  getRecommendations = asyncSafeCache(async function(
      this: PerformanceCorrelationService,
      category?: 'optimization' | 'configuration' | 'architecture' | 'implementation',
      impactLevel: 'low' | 'medium' | 'high' = 'low'
    ): Promise<PerformanceRecommendation[]> {
      await this.ensureInitialized();

      try {
        const params = new URLSearchParams({
          ...(category ? { category } : {}),
          minImpact: impactLevel
        });

        const response = await fetch(`${this.config.apiEndpoint}/recommendations?${params}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Error fetching recommendations: ${response.statusText}`);
        }

        const recommendations: PerformanceRecommendation[] = await response.json();

        // Update cache
        recommendations.forEach(rec => {
          this.recommendations.set(rec.idrec);
        });

        return recommendations;
      } catch (error) {

        // Return cached recommendations filtered by criteria
        const levelMap: Record<string, number> = { low: 0, medium: 1, high: 2 };

        const recommendations = Array.from(this.recommendations.values()) as PerformanceRecommendation[];

        return recommendations.filter(rec => {
          if (!rec) return false;
          return (!category || ('category' in rec && rec.category === category)) &&
                ('impact' in rec && typeof rec.impact === 'string' && levelMap[rec.impact] >= levelMap[impactLevel]);
        });
      }
    }
  )

  /**
   * Get complete correlation overview with caching
   * Includes correlations, recommendations, and feature impacts
   */
  getCorrelationOverview = asyncSafeCache(async function(this: PerformanceCorrelationService): Promise<CorrelationOverview> {
      await this.ensureInitialized();

      try {
        // Check if we have a recent overview
        if (this.latestOverview && 
            this.latestOverview.lastUpdated> Date.now() - 60000) {
          return this.latestOverview;
        }

        const response = await fetch(`${this.config.apiEndpoint}/overview`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Error fetching correlation overview: ${response.statusText}`);
        }

        const overview: CorrelationOverview = await response.json();

        // Update local caches
        overview.correlations.forEach((corr: PerformanceCorrelation) => {
          const existingIndex = this.correlations.findIndex(c => c.id === corr.id);
          if (existingIndex !== -1) {
            this.correlations[existingIndex] = corr;
          } else {
            this.correlations.push(corr);
          }
        });

        overview.featureImpacts.forEach(impact => {
          this.featureImpacts.set(impact.featureIdimpact);
        });

        overview.recommendations.forEach(rec => {
          this.recommendations.set(rec.idrec);
        });

        // Set latest overview
        this.latestOverview = {
          ...overview,
          lastUpdated: Date.now()
        };

        return this.latestOverview;
      } catch (error) {

        // Return constructed overview from cache as fallback
        if (this.latestOverview) {
          return this.latestOverview;
        }

        // Construct from individual caches
        return {
          correlations: this.correlations,
          recommendations: Array.from(this.recommendations.values()),
          featureImpacts: Array.from(this.featureImpacts.values()),
          lastUpdated: Date.now()
        };
      }
    }
  )

  /**
   * Submit performance metrics to the service
   * @param metrics The metrics to submit
   */
  async submitPerformanceMetrics(metrics: PerformanceMetric[]): Promise<boolean> {
    await this.ensureInitialized();

    // Store metrics locally for correlation
    metrics.forEach(metric => {
      if (!this.performanceMetrics.has(metric.id)) {
        this.performanceMetrics.set(metric.id, []);
      }

      const metricsList = this.performanceMetrics.get(metric.id) || [];
      metricsList.push(metric);

      // Limit array size to prevent memory issues
      if (metricsList.length> 100) {
        metricsList.shift();
      }

      this.performanceMetrics.set(metric.idmetricsList);
    });

    try {
      const response = await fetch(`${this.config.apiEndpoint}/metrics`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ metrics })
      });

      return response.ok;
    } catch (error) {

      return false;
    }
  }

  /**
   * Submit resource utilization data to the service
   * @param utilization The resource utilization data to submit
   */
  async submitResourceUtilization(utilization: ResourceUtilization[]): Promise<boolean> {
    await this.ensureInitialized();

    // Store utilization data locally for correlation
    utilization.forEach(item => {
      if (!this.resourceUtilization.has(item.resourceType)) {
        this.resourceUtilization.set(item.resourceType, []);
      }

      const utilizationList = this.resourceUtilization.get(item.resourceType) || [];
      utilizationList.push(item);

      // Limit array size to prevent memory issues
      if (utilizationList.length> 100) {
        utilizationList.shift();
      }

      this.resourceUtilization.set(item.resourceTypeutilizationList);
    });

    try {
      const response = await fetch(`${this.config.apiEndpoint}/utilization`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ utilization })
      });

      return response.ok;
    } catch (error) {

      return false;
    }
  }

  /**
   * Analyze specific security features for performance impact
   * @param featureIds The IDs of features to analyze
   * @param samples Number of samples to collect for the analysis
   */
  async analyzeFeaturePerformance(
    featureIds: string[],
    samples: number = 10
  ): Promise<SecurityFeatureImpact[]> {
    await this.ensureInitialized();

    try {
      const response = await fetch(`${this.config.apiEndpoint}/analyze-features`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ featureIds, samples })
      });

      if (!response.ok) {
        throw new Error(`Error analyzing feature performance: ${response.statusText}`);
      }

      const impacts: SecurityFeatureImpact[] = await response.json();

      // Update cache
      impacts.forEach(impact => {
        this.featureImpacts.set(impact.featureIdimpact);
      });

      return impacts;
    } catch (error) {

      // Return cached impacts for these features as fallback
      return Array.from(this.featureImpacts.values())
        .filter(impact => featureIds.includes(impact.featureId));
    }
  }

  /**
   * Manually trigger correlation analysis between security events and performance
   * This is useful when automatic correlation is disabled
   */
  async triggerCorrelationAnalysis(): Promise<PerformanceCorrelation[]> {
    await this.ensureInitialized();

    if (this.pendingAnalysis) {

      return this.correlations;
    }

    this.pendingAnalysis = true;

    try {
      const response = await fetch(`${this.config.apiEndpoint}/analyze`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error triggering correlation analysis: ${response.statusText}`);
      }

      const correlations: PerformanceCorrelation[] = await response.json();

      // Update cache
      this.correlations = correlations;

      // Emit updated event
      this.emit('correlations-updated', correlations);

      return correlations;
    } catch (error) {

      return this.correlations;
    } finally {
      this.pendingAnalysis = false;
    }
  }

  /**
   * Add event listener for service events
   * @param event Event name to listen for
   * @param callback Callback function
   */
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }

    this.eventListeners.get(event)?.add(callback);
  }

  /**
   * Remove event listener
   * @param event Event name
   * @param callback Callback to remove
   */
  off(event: string, callback: Function): void {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event)?.delete(callback);
    }
  }

  /**
   * Dispose resources
   */
  dispose(): void {
    // Clear intervals
    if (this.refreshIntervalId !== null && typeof window !== 'undefined') {
      window.clearInterval(this.refreshIntervalId);
      this.refreshIntervalId = null;
    }

    if (this.collectionIntervalId !== null && typeof window !== 'undefined') {
      window.clearInterval(this.collectionIntervalId);
      this.collectionIntervalId = null;
    }

    // Clear caches
    this.performanceMetrics.clear();
    this.resourceUtilization.clear();
    this.correlations = [];
    this.featureImpacts.clear();
    this.recommendations.clear();
    this.latestOverview = null;

    // Clear event listeners
    this.eventListeners.clear();

    this.isInitialized = false;
  }

  /**
   * Make sure the service is initialized before use
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  /**
   * Load initial data for the service
   */
  private async loadInitialData(): Promise<void> {
    try {
      const response = await fetch(`${this.config.apiEndpoint}/initial-data`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {

        return;
      }

      const data = await response.json();

      // Populate caches with initial data
      if (data && typeof data === 'object') {
        const typedData = data as Record<string, any>\n  );
        if (typedData.correlations && Array.isArray(typedData.correlations)) {
          this.correlations = typedData.correlations as PerformanceCorrelation[];
        }

        if (typedData.featureImpacts && Array.isArray(typedData.featureImpacts)) {
          typedData.featureImpacts.forEach((impact: SecurityFeatureImpact) => {
            this.featureImpacts.set(impact.featureIdimpact);
          });
        }

        if (typedData.recommendations && Array.isArray(typedData.recommendations)) {
          typedData.recommendations.forEach((rec: PerformanceRecommendation) => {
            this.recommendations.set(rec.idrec);
          });
        }

        // Set initial overview
        if (typedData.correlations && typedData.featureImpacts && typedData.recommendations) {
          this.latestOverview = {
            correlations: typedData.correlations as PerformanceCorrelation[],
            featureImpacts: typedData.featureImpacts as SecurityFeatureImpact[],
            recommendations: typedData.recommendations as PerformanceRecommendation[],
            lastUpdated: Date.now()
          };
        }
      }
    } catch (error) {

      // Continue without initial data
    }
  }

  /**
   * Refresh all data
   */
  private async refreshData(): Promise<void> {
    try {
      // Get fresh overview which will update all caches
      await this.getCorrelationOverview();
    } catch (error) {

    }
  }

  /**
   * Collect performance metrics from browser
   */
  private async collectPerformanceMetrics(): Promise<void> {
    if (typeof window === 'undefined' || typeof performance === 'undefined') {
      return;
    }

    try {
      const metrics: PerformanceMetric[] = [];

      // Get navigation timing metrics if available
      const navigationTiming = this.getNavigationTiming();
      if (navigationTiming) {
        metrics.push(...navigationTiming);
      }

      // Get resource timing metrics for key resources
      const resourceTiming = this.getResourceTiming();
      if (resourceTiming.length> 0) {
        metrics.push(...resourceTiming);
      }

      // Get memory metrics if available
      const memoryMetrics = this.getMemoryMetrics();
      if (memoryMetrics) {
        metrics.push(memoryMetrics);
      }

      // Submit metrics if we have any
      if (metrics.length> 0) {
        this.submitPerformanceMetrics(metrics);
      }

      // Collect resource utilization
      const utilization = this.getResourceUtilization();
      if (utilization.length> 0) {
        this.submitResourceUtilization(utilization);
      }
    } catch (error) {

    }
  }

  /**
   * Get navigation timing metrics
   */
  private getNavigationTiming(): PerformanceMetric[] | null {
    if (!performance.getEntriesByType) {
      return null;
    }

    try {
      const navigationEntries = performance.getEntriesByType('navigation');

      if (navigationEntries.length === 0) {
        return null;
      }

      const navigationTiming = navigationEntries[0] as PerformanceNavigationTiming;
      const now = Date.now();

      return [
        {
          id: 'page_load_time',
          name: 'Page Load Time',
          value: navigationTiming.loadEventEnd - navigationTiming.startTime,
          unit: 'ms',
          timestamp: now,
          source: 'client'
        },
        {
          id: 'dom_content_loaded',
          name: 'DOM Content Loaded',
          value: navigationTiming.domContentLoadedEventEnd - navigationTiming.startTime,
          unit: 'ms',
          timestamp: now,
          source: 'client'
        },
        {
          id: 'first_byte',
          name: 'Time to First Byte',
          value: navigationTiming.responseStart - navigationTiming.requestStart,
          unit: 'ms',
          timestamp: now,
          source: 'client'
        },
        {
          id: 'dns_lookup',
          name: 'DNS Lookup Time',
          value: navigationTiming.domainLookupEnd - navigationTiming.domainLookupStart,
          unit: 'ms',
          timestamp: now,
          source: 'client'
        }
      ];
    } catch (error) {

      return null;
    }
  }

  /**
   * Get resource timing metrics for key resources
   */
  private getResourceTiming(): PerformanceMetric[] {
    if (!performance.getEntriesByType) {
      return [];
    }

    try {
      const resourceEntries = performance.getEntriesByType('resource');
      const now = Date.now();
      const metrics: PerformanceMetric[] = [];

      // Filter for API calls and important resources
      const apiCalls = resourceEntries.filter(entry => 
        entry.name.includes('/api/') || 
        entry.name.includes('/graphql')
      );

      // Get average API call time
      if (apiCalls.length> 0) {
        const avgApiTime = apiCalls.reduce((sumentry: any) => 
          sum + entry.duration0) / apiCalls.length;

        metrics.push({
          id: 'api_response_time',
          name: 'API Response Time',
          value: avgApiTime,
          unit: 'ms',
          timestamp: now,
          source: 'api',
          context: {
            sampleSize: apiCalls.length
          }
        });
      }

      // Look for security-specific API calls
      const securityApiCalls = apiCalls.filter(entry => 
        entry.name.includes('/api/security/') || 
        entry.name.includes('/api/auth/')
      );

      if (securityApiCalls.length> 0) {
        const avgSecurityApiTime = securityApiCalls.reduce((sumentry: any) => 
          sum + entry.duration0) / securityApiCalls.length;

        metrics.push({
          id: 'security_api_response_time',
          name: 'Security API Response Time',
          value: avgSecurityApiTime,
          unit: 'ms',
          timestamp: now,
          source: 'api',
          context: {
            sampleSize: securityApiCalls.length
          }
        });
      }

      return metrics;
    } catch (error) {

      return [];
    }
  }

  /**
   * Get memory metrics if available
   */
  private getMemoryMetrics(): PerformanceMetric | null {
    if (typeof performance === 'undefined' || !(performance as any).memory) {
      return null;
    }

    try {
      const memory = (performance as any).memory;

      return {
        id: 'js_heap_size',
        name: 'JS Heap Size',
        value: Math.round(memory.usedJSHeapSize / 1048576), // Convert to MB
        unit: 'MB',
        timestamp: Date.now(),
        source: 'client',
        context: {
          totalHeapSize: Math.round(memory.totalJSHeapSize / 1048576),
          heapLimit: Math.round(memory.jsHeapSizeLimit / 1048576)
        }
      };
    } catch (error) {

      return null;
    }
  }

  /**
   * Get resource utilization metrics
   */
  private getResourceUtilization(): ResourceUtilization[] {
    const utilization: ResourceUtilization[] = [];
    const now = Date.now();

    // Memory utilization if available
    if ((performance as any).memory) {
      const memory = (performance as any).memory;
      const memoryUtilization = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;

      utilization.push({
        id: `memory_${now}`,
        resourceType: 'memory',
        value: memoryUtilization,
        absoluteValue: Math.round(memory.usedJSHeapSize / 1048576),
        unit: 'MB',
        timestamp: now
      });
    }

    // Network utilization metrics - estimated from recent resource requests
    if (typeof performance.getEntriesByType === 'function') {
      try {
        const resourceEntries = performance.getEntriesByType('resource');
        // Filter for recent entries in the last 30 seconds
        const recentEntries = resourceEntries.filter(entry => 
          entry.startTime> performance.now() - 30000
        );

        if (recentEntries.length> 0) {
          let totalTransferred = 0;
          recentEntries.forEach(entry => {
            if ('transferSize' in entry) {
              totalTransferred += (entry as any).transferSize || 0;
            }
          });

          utilization.push({
            id: `network_${now}`,
            resourceType: 'network',
            value: 0, // We don't know the percentage utilization
            absoluteValue: Math.round(totalTransferred / 1024), // KB
            unit: 'KB/30s',
            timestamp: now,
            context: {
              requests: recentEntries.length
            }
          });
        }
      } catch (e) {

      }
    }

    return utilization;
  }

  /**
   * Correlate security events with performance metrics
   * This is a simple implementation that would be more sophisticated in a real service
   */
  private correlateEventsWithMetrics(events: SecurityEvent[]): void {
    if (events.length === 0 || this.performanceMetrics.size === 0) {
      return;
    }

    // In a real implementation, this would use much more sophisticated analysis
    // For demonstration purposes, we'll do a simple time-based correlation

    // Only consider recent events in the last 5 minutes
    const recentEvents = events.filter(event => 
      new Date(event.timestamp).getTime() > Date.now() - 5 * 60 * 1000
    );

    if (recentEvents.length === 0) {
      return;
    }

    // Look for performance metrics that happened shortly after security events
    // This is a very simplistic approach for demonstration
    const correlations: PerformanceCorrelation[] = [];

    for (const event of recentEvents) {
      // Look at performance metrics that happened within 10 seconds after the event
      const potentialCorrelations: PerformanceCorrelationEvent[] = [];
      const eventTimestamp = new Date(event.timestamp).getTime();

      for (const entry of Array.from(this.performanceMetrics.entries())) {
        const metricId = entry[0];
        const metrics = entry[1];
        for (const metric of metrics) {
          // Check if metric happened within 10 seconds after the security event
          if (metric.timestamp>= eventTimestamp && 
              metric.timestamp <= eventTimestamp + 10000) {

            // This is where real correlation analysis would happen
            // For demo purposes, we'll use a simple approach
            // Create correlation data with the proper type
            const correlationData: PerformanceCorrelationEvent = {
              event,
              metric,
              timeDelta: metric.timestamp - eventTimestamp
            };
            potentialCorrelations.push(correlationData);
          }
        }
      }

      // If we found at least one potential correlation
      if (potentialCorrelations.length> 0) {
        // Sort by time delta (closest first)
        potentialCorrelations.sort((ab: any) => a.timeDelta - b.timeDelta);

        // Take the closest one
        const closest = potentialCorrelations[0];

        // Create a correlation
        const correlation: PerformanceCorrelation = {
          id: `corr_${event.id}_${closest.metric.id}_${Date.now()}`,
          securityEventId: event.id,
          securityEventType: event.type,
          performanceMetricId: closest.metric.id,
          performanceMetricName: closest.metric.name,
          correlationStrength: CorrelationStrength.MODERATE, // This would be calculated in reality
          impactSeverity: SeverityLevel.MEDIUM, // This would be calculated in reality
          detectedAt: Date.now(),
          context: {
            timeDelta: closest.timeDelta,
            metricValue: closest.metric.value,
            eventCategory: (event as any).category, // Use type assertion for property that may not exist
            eventSeverity: event.severity
          }
        };

        correlations.push(correlation);
      }
    }

    // If we found correlations, add them to our cache and emit an event
    if (correlations.length> 0) {
      correlations.forEach(corr => {
        // Check if this correlation already exists
        const existingIndex = this.correlations.findIndex((c: PerformanceCorrelation) => 
          c.securityEventId === corr.securityEventId && 
          c.performanceMetricId === corr.performanceMetricId
        );

        if (existingIndex !== -1) {
          // Update existing correlation
          this.correlations[existingIndex] = corr;
        } else {
          // Add new correlation
          this.correlations.push(corr);
        }
      });

      // Emit event
      this.emit('correlations-detected', correlations);
    }
  }

  /**
   * Analyze security metrics for trends
   */
  private analyzeSecurityMetrics(metrics: SecurityMetric[]): void {
    // This would be a much more sophisticated analysis in a real service
    // For demonstration purposes, this is a simplified approach

    // Find metrics with significant changes
    const significantChanges = metrics.filter(metric => {
      // Use type assertion to access the property that may not be in the interface
      const changePercentage = (metric as any).changePercentage;
      return changePercentage !== undefined && Math.abs(changePercentage) > 20;
    });

    if (significantChanges.length> 0) {
      // In a real implementation, we would do more analysis here
      this.emit('significant-security-metric-changes', significantChanges);
    }
  }

  /**
   * Emit an event to all listeners
   */
  private emit(event: string, data?: any): void {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event)?.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          :`, error);
        }
      });
    }
  }
}

// Create singleton instance
export const perfCorrelationService = new PerformanceCorrelationService();

// Auto-initialize in client
if (typeof window !== 'undefined') {
  // Delayed initialization to avoid blocking the main thread
  setTimeout(() => perfCorrelationService.initialize(), 200);
}