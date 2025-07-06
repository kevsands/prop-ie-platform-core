'use client';

import { ttlCache, longTTLCache, asyncSafeCache, warnIfExcessive } from '@/utils/performance';

// Constants for performance tuning
const SHORT_CACHE_TTL = 60 * 1000; // 1 minute
const MEDIUM_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const LONG_CACHE_TTL = 30 * 60 * 1000; // 30 minutes
const SSE_RECONNECT_BACKOFF_BASE = 1000; // 1 second base for exponential backoff
const SSE_RECONNECT_MAX_ATTEMPTS = 5;
const DEFAULT_BATCH_SIZE = 20;
const MAX_MEMORY_CACHE_SIZE = 1000; // Maximum items to keep in memory
const MAX_CACHED_EVENTS = 500; // Maximum number of events to store in memory

// Define analytics time ranges
export enum AnalyticsTimeframe {
  LAST_HOUR = 'last_hour',
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  LAST_7_DAYS = 'last_7_days',
  LAST_30_DAYS = 'last_30_days',
  LAST_24_HOURS = 'last_24_hours',
  CUSTOM = 'custom'
}

/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
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
    metrics: number;
    events: number;
    anomalies: number;
    threats: number;
    average: number;
  };
}

// Analytics data interfaces
export interface SecurityMetric {
  id: string;
  name: string;
  value: number;
  timestamp: Date;
  category: string;
  valueType: 'count' | 'percentage' | 'duration' | 'score';
  trend?: 'up' | 'down' | 'stable';
  status?: 'normal' | 'warning' | 'critical';
}

export interface SecurityEvent {
  id: string;
  type: string;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  source: string;
  details: Record<string, any>;
  relatedEntities?: string[];
  status: 'detected' | 'investigating' | 'mitigated' | 'resolved';
  actionTaken?: string;
}

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
}

export interface ThreatIndicator {
  id: string;
  type: 'ip' | 'domain' | 'file_hash' | 'url' | 'user_agent' | 'behavior';
  value: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  firstSeen: Date;
  lastSeen: Date;
  source: string;
  context: Record<string, any>;
  relatedEvents?: string[];
}

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

// Options for various API calls
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
  eventIds?: string[]; // Added for correlation API
}

/**
 * Enhanced, performance-optimized security analytics service
 * 
 * Provides real-time and historical security metrics, events, anomalies, and threat indicators
 * with sophisticated caching, worker-based parallelization, and memory optimization
 */
class EnhancedAnalyticsService {
  private apiBase = '/api/security';
  private isInitialized = false;
  private sseConnection: EventSource | null = null;
  private eventHandlers: Map<string, Set<(data: unknown) => void>> = new Map();
  private pendingRequests: Map<string, Promise<unknown>> = new Map();
  private worker: SharedWorker | null = null;
  private dataCache = {
    metrics: new Map<string, SecurityMetric[]>(),
    events: new Map<string, SecurityEvent[]>(),
    anomalies: new Map<string, AnomalyDetection[]>(),
    threats: new Map<string, ThreatIndicator[]>()
  };
  private memoryUsage = {
    metrics: 0,
    events: 0,
    anomalies: 0,
    threats: 0
  };
  private reconnectAttempts = 0;

  constructor() {
    // Defer initialization to avoid blocking initial render
    setTimeout(() => this.initialize(), 100);
  }

  /**
   * Initialize the security analytics service with connections to real-time sources
   */
  private initialize() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Initialize worker for background processing if supported
    this.initializeWorker();
    
    // Connect to server-sent events for real-time updates
    this.connectToSSE();

    // Register cleanup on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.cleanup());
    }
  }

  /**
   * Initialize the shared worker for background processing
   */
  private initializeWorker() {
    try {
      if (typeof SharedWorker !== 'undefined') {
        // Create a shared worker for background processing
        this.worker = new SharedWorker('/workers/security-analytics.js');
        
        // Set up message handler
        this.worker.port.onmessage = (event) => {
          const workerEvent = event.data as { type: string; data: Record<string, unknown> };
          const { type, data } = workerEvent;
          
          switch (type) {
            case 'metrics_update':
              this.updateCache('metrics', 
                data.key as string, 
                data.metrics as SecurityMetric[]
              );
              this.notifyListeners<SecurityMetric[]>('metrics', data.metrics as SecurityMetric[]);
              break;
              
            case 'events_update':
              this.updateCache('events', 
                data.key as string, 
                data.events as SecurityEvent[]
              );
              this.notifyListeners<SecurityEvent[]>('events', data.events as SecurityEvent[]);
              break;
              
            case 'anomalies_update':
              this.updateCache('anomalies', 
                data.key as string, 
                data.anomalies as AnomalyDetection[]
              );
              this.notifyListeners<AnomalyDetection[]>('anomalies', data.anomalies as AnomalyDetection[]);
              break;
              
            case 'threats_update':
              this.updateCache('threats', 
                data.key as string, 
                data.threats as ThreatIndicator[]
              );
              this.notifyListeners<ThreatIndicator[]>('threats', data.threats as ThreatIndicator[]);
              break;
              
            case 'correlation_result':
              this.notifyListeners('correlation', data.result);
              break;
          }
        };
        
        // Start the worker
        this.worker.port.start();
      }
    } catch (error) {
      console.warn('Failed to initialize security analytics worker:', error);
    }
  }

  /**
   * Connect to server-sent events for real-time updates
   */
  private connectToSSE() {
    try {
      if (typeof EventSource !== 'undefined' && !this.sseConnection) {
        this.sseConnection = new EventSource(`${this.apiBase}/events/stream`);
        
        // Set up event handlers
        this.sseConnection.onopen = () => {
          this.reconnectAttempts = 0; // Reset reconnect attempts on successful connection
          console.log('Security events stream connected');
        };
        
        this.sseConnection.onerror = (error) => {
          console.error('Security events stream error:', error);
          this.reconnectSSE();
        };
        
        // Listen for different event types
        this.sseConnection.addEventListener('security_metric', (event) => {
          try {
            const metric = JSON.parse(event.data) as SecurityMetric;
            this.processRealtimeMetric(metric);
          } catch (e) {
            console.error('Error processing security metric event:', e);
          }
        });
        
        this.sseConnection.addEventListener('security_event', (event) => {
          try {
            const secEvent = JSON.parse(event.data) as SecurityEvent;
            this.processRealtimeEvent(secEvent);
          } catch (e) {
            console.error('Error processing security event:', e);
          }
        });
        
        this.sseConnection.addEventListener('anomaly_detection', (event) => {
          try {
            const anomaly = JSON.parse(event.data) as AnomalyDetection;
            this.processRealtimeAnomaly(anomaly);
          } catch (e) {
            console.error('Error processing anomaly detection event:', e);
          }
        });
        
        this.sseConnection.addEventListener('threat_indicator', (event) => {
          try {
            const threat = JSON.parse(event.data) as ThreatIndicator;
            this.processRealtimeThreat(threat);
          } catch (e) {
            console.error('Error processing threat indicator event:', e);
          }
        });
      }
    } catch (error) {
      console.warn('Failed to connect to security events stream:', error);
      this.reconnectSSE();
    }
  }

  /**
   * Reconnect to SSE with exponential backoff
   */
  private reconnectSSE() {
    if (this.sseConnection) {
      this.sseConnection.close();
      this.sseConnection = null;
    }
    
    if (this.reconnectAttempts < SSE_RECONNECT_MAX_ATTEMPTS) {
      const delay = Math.min(
        SSE_RECONNECT_BACKOFF_BASE * Math.pow(2, this.reconnectAttempts),
        30000 // Max 30 seconds
      );
      
      this.reconnectAttempts++;
      
      setTimeout(() => {
        this.connectToSSE();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached for security events stream');
    }
  }

  /**
   * Process a real-time security metric
   */
  private processRealtimeMetric(metric: SecurityMetric) {
    // Update caches with new metric
    for (const [key, metrics] of this.dataCache.metrics.entries()) {
      // Only add to relevant timeframes
      if (this.isInTimeframe(metric.timestamp, key)) {
        const updatedMetrics = [...metrics];
        const existingIndex = updatedMetrics.findIndex(m => m.id === metric.id);
        
        if (existingIndex >= 0) {
          updatedMetrics[existingIndex] = metric;
        } else {
          updatedMetrics.push(metric);
        }
        
        this.updateCache('metrics', key, updatedMetrics);
      }
    }
    
    // Notify listeners
    this.notifyListeners('metric', metric);
  }

  /**
   * Process a real-time security event
   */
  private processRealtimeEvent(event: SecurityEvent) {
    // Update caches with new event
    for (const [key, events] of this.dataCache.events.entries()) {
      // Only add to relevant timeframes
      if (this.isInTimeframe(event.timestamp, key)) {
        const updatedEvents = [event, ...events]; // Add to beginning (most recent first)
        
        // Limit the size to prevent memory issues
        if (updatedEvents.length > MAX_CACHED_EVENTS) {
          updatedEvents.length = MAX_CACHED_EVENTS;
        }
        
        this.updateCache('events', key, updatedEvents);
      }
    }
    
    // Notify listeners
    this.notifyListeners('event', event);
    
    // Send to worker for advanced processing if available
    if (this.worker) {
      this.worker.port.postMessage({
        type: 'process_event',
        event
      });
    }
  }

  /**
   * Process a real-time anomaly detection
   */
  private processRealtimeAnomaly(anomaly: AnomalyDetection) {
    // Update caches with new anomaly
    for (const [key, anomalies] of this.dataCache.anomalies.entries()) {
      // Only add to relevant timeframes
      if (this.isInTimeframe(anomaly.detectedAt, key)) {
        const updatedAnomalies = [...anomalies];
        const existingIndex = updatedAnomalies.findIndex(a => a.id === anomaly.id);
        
        if (existingIndex >= 0) {
          updatedAnomalies[existingIndex] = anomaly;
        } else {
          updatedAnomalies.unshift(anomaly); // Add to beginning (most recent first)
        }
        
        this.updateCache('anomalies', key, updatedAnomalies);
      }
    }
    
    // Notify listeners
    this.notifyListeners('anomaly', anomaly);
    
    // Send to worker for advanced processing if available
    if (this.worker) {
      this.worker.port.postMessage({
        type: 'process_anomaly',
        anomaly
      });
    }
  }

  /**
   * Process a real-time threat indicator
   */
  private processRealtimeThreat(threat: ThreatIndicator) {
    // Update caches with new threat
    for (const [key, threats] of this.dataCache.threats.entries()) {
      // Only add to relevant timeframes
      if (this.isInTimeframe(threat.lastSeen, key)) {
        const updatedThreats = [...threats];
        const existingIndex = updatedThreats.findIndex(t => t.id === threat.id);
        
        if (existingIndex >= 0) {
          updatedThreats[existingIndex] = threat;
        } else {
          updatedThreats.unshift(threat); // Add to beginning (most recent first)
        }
        
        this.updateCache('threats', key, updatedThreats);
      }
    }
    
    // Notify listeners
    this.notifyListeners('threat', threat);
    
    // Send to worker for advanced processing if available
    if (this.worker) {
      this.worker.port.postMessage({
        type: 'process_threat',
        threat
      });
    }
  }

  /**
   * Notify all registered listeners for an event type
   */
  private notifyListeners<T>(type: string, data: T) {
    const handlers = this.eventHandlers.get(type);
    if (handlers) {
      for (const handler of handlers) {
        try {
          // Cast to handle the unknown-to-specific-type conversion
          handler(data as unknown);
        } catch (error) {
          console.error(`Error in security analytics ${type} handler:`, error);
        }
      }
    }
  }

  /**
   * Check if a date is within a timeframe specified by a cache key
   */
  private isInTimeframe(date: Date, cacheKey: string): boolean {
    if (!date) return false;
    
    const now = new Date();
    const timestamp = date instanceof Date ? date : new Date(date);
    
    if (cacheKey.includes(AnalyticsTimeframe.LAST_HOUR)) {
      const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      return timestamp >= hourAgo;
    }
    
    if (cacheKey.includes(AnalyticsTimeframe.TODAY)) {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return timestamp >= today;
    }
    
    if (cacheKey.includes(AnalyticsTimeframe.YESTERDAY)) {
      const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return timestamp >= yesterday && timestamp < today;
    }
    
    if (cacheKey.includes(AnalyticsTimeframe.LAST_7_DAYS)) {
      const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return timestamp >= last7Days;
    }
    
    if (cacheKey.includes(AnalyticsTimeframe.LAST_30_DAYS)) {
      const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return timestamp >= last30Days;
    }
    
    // For custom timeframes, the cache key would need to include the date range
    if (cacheKey.includes(AnalyticsTimeframe.CUSTOM) && cacheKey.includes('_to_')) {
      const [, startStr, endStr] = cacheKey.match(/custom_(.+)_to_(.+)/) || [];
      if (startStr && endStr) {
        const start = new Date(parseInt(startStr, 10));
        const end = new Date(parseInt(endStr, 10));
        return timestamp >= start && timestamp <= end;
      }
    }
    
    return true; // Default to true for unknown formats
  }

  /**
   * Update the in-memory cache with new data
   */
  private updateCache<T>(
    dataType: 'metrics' | 'events' | 'anomalies' | 'threats', 
    key: string, 
    data: T[]
  ) {
    // Update the cache
    if (dataType === 'metrics') {
      this.dataCache.metrics.set(key, data as unknown as SecurityMetric[]);
      this.memoryUsage.metrics = this.dataCache.metrics.size;
    } else if (dataType === 'events') {
      this.dataCache.events.set(key, data as unknown as SecurityEvent[]);
      this.memoryUsage.events = this.dataCache.events.size;
    } else if (dataType === 'anomalies') {
      this.dataCache.anomalies.set(key, data as unknown as AnomalyDetection[]);
      this.memoryUsage.anomalies = this.dataCache.anomalies.size;
    } else if (dataType === 'threats') {
      this.dataCache.threats.set(key, data as unknown as ThreatIndicator[]);
      this.memoryUsage.threats = this.dataCache.threats.size;
    }
    
    // Check if memory usage exceeds limits
    this.checkAndCleanupCache(dataType);
  }

  /**
   * Check if cache size exceeds limits and cleanup if needed
   */
  private checkAndCleanupCache(dataType: 'metrics' | 'events' | 'anomalies' | 'threats') {
    const cache = this.dataCache[dataType];
    const usage = this.memoryUsage[dataType];
    
    if (usage > MAX_MEMORY_CACHE_SIZE) {
      // Keep only the most recently used keys
      const keys = Array.from(cache.keys());
      const keysToRemove = keys.slice(0, keys.length - MAX_MEMORY_CACHE_SIZE);
      
      for (const key of keysToRemove) {
        cache.delete(key);
      }
      
      // Update memory usage
      this.memoryUsage[dataType] = cache.size;
    }
  }

  /**
   * Create a cache key based on options
   */
  private createCacheKey(
    baseKey: string, 
    options: SecurityAnalyticsOptions = {}
  ): string {
    const {
      timeframe = AnalyticsTimeframe.LAST_24_HOURS,
      startDate,
      endDate,
      limit,
      category,
      severity,
      source,
      includeResolved,
      page,
    } = options;
    
    let key = `${baseKey}_${timeframe}`;
    
    if (timeframe === AnalyticsTimeframe.CUSTOM && startDate && endDate) {
      key = `${baseKey}_custom_${startDate.getTime()}_to_${endDate.getTime()}`;
    }
    
    // Add other filters to the key
    if (limit) key += `_limit${limit}`;
    if (category) key += `_cat${category}`;
    if (severity?.length) key += `_sev${severity.join('-')}`;
    if (source?.length) key += `_src${source.join('-')}`;
    if (includeResolved === true) key += '_resolved';
    if (page) key += `_page${page}`;
    
    return key;
  }

  /**
   * Generate date range based on timeframe
   */
  private getDateRangeFromTimeframe(
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
  private optionsToParams(options: SecurityAnalyticsOptions = {}): URLSearchParams {
    const params = new URLSearchParams();
    const { start, end } = this.getDateRangeFromTimeframe(
      options.timeframe,
      options.startDate,
      options.endDate
    );
    
    params.append('start', start.toISOString());
    params.append('end', end.toISOString());
    
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.category) params.append('category', options.category);
    if (options.severity?.length) options.severity.forEach(s => params.append('severity', s));
    if (options.source?.length) options.source.forEach(s => params.append('source', s));
    if (options.includeResolved) params.append('includeResolved', 'true');
    if (options.page) params.append('page', options.page.toString());
    if (options.withCorrelation) params.append('withCorrelation', 'true');
    if (options.withRecommendations) params.append('withRecommendations', 'true');
    
    return params;
  }

  /**
   * Make an API request with deduplication and error handling
   */
  private async fetchApi<T>(endpoint: string, options: SecurityAnalyticsOptions = {}): Promise<T> {
    if (!this.isInitialized) this.initialize();
    
    const params = this.optionsToParams(options);
    const url = `${this.apiBase}${endpoint}?${params.toString()}`;
    
    // Check for existing pending request to deduplicate
    if (this.pendingRequests.has(url)) {
      return this.pendingRequests.get(url) as Promise<T>;
    }
    
    const request = (async () => {
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Security Analytics API error: ${response.status} ${response.statusText}`);
        }
        
        return await response.json() as T;
      } catch (error) {
        console.error(`Error fetching security analytics from ${endpoint}:`, error);
        throw error;
      } finally {
        // Remove from pending requests
        this.pendingRequests.delete(url);
      }
    })();
    
    // Store pending request
    this.pendingRequests.set(url, request);
    
    return request;
  }

  /**
   * Batch fetch API requests to reduce network overhead
   */
  private async batchFetchApi<T>(
    endpoint: string, 
    ids: string[], 
    options: SecurityAnalyticsOptions = {}
  ): Promise<Record<string, T>> {
    if (!ids.length) return {} as Record<string, T>;
    
    // Limit batch size to avoid URL length limits
    const batchSize = options.limit || DEFAULT_BATCH_SIZE;
    const batches: Array<Promise<Record<string, T>>> = [];
    
    for (let i = 0; i < ids.length; i += batchSize) {
      const batchIds = ids.slice(i, i + batchSize);
      const params = this.optionsToParams(options);
      
      batchIds.forEach(id => params.append('ids', id));
      
      batches.push(
        this.fetchApi<Record<string, T>>(`${endpoint}/batch`, {
          ...options,
          // Custom params will be handled by optionsToParams
        })
      );
    }
    
    // Fetch all batches in parallel
    const results = await Promise.all(batches);
    
    // Merge results with proper type handling
    return results.reduce<Record<string, T>>(
      (acc, result) => ({...acc, ...result}), 
      {} as Record<string, T>
    );
  }

  /**
   * Fetch security metrics with caching and performance optimization
   */
  getMetrics = asyncSafeCache<SecurityAnalyticsOptions | undefined, SecurityMetric[]>(async (options?: SecurityAnalyticsOptions): Promise<SecurityMetric[]> => {
    options = options || {};
    const cacheKey = this.createCacheKey('metrics', options);
    
    // Check memory cache first
    if (!options.refreshCache && this.dataCache.metrics.has(cacheKey)) {
      return this.dataCache.metrics.get(cacheKey) || [];
    }
    
    // Fetch metrics from API
    const metrics = await this.fetchApi<SecurityMetric[]>('/metrics', options);
    
    // Cache results
    this.updateCache('metrics', cacheKey, metrics);
    
    return metrics;
  });

  /**
   * Fetch security events with caching and performance optimization
   */
  getEvents = asyncSafeCache<SecurityAnalyticsOptions | undefined, SecurityEvent[]>(async (options?: SecurityAnalyticsOptions): Promise<SecurityEvent[]> => {
    options = options || {};
    const cacheKey = this.createCacheKey('events', options);
    
    // Check memory cache first
    if (!options.refreshCache && this.dataCache.events.has(cacheKey)) {
      return this.dataCache.events.get(cacheKey) || [];
    }
    
    // Fetch events from API
    const events = await this.fetchApi<SecurityEvent[]>('/events', options);
    
    // Cache results
    this.updateCache('events', cacheKey, events);
    
    return events;
  });

  /**
   * Fetch anomaly detections with caching and performance optimization
   */
  getAnomalies = asyncSafeCache<SecurityAnalyticsOptions | undefined, AnomalyDetection[]>(async (options?: SecurityAnalyticsOptions): Promise<AnomalyDetection[]> => {
    options = options || {};
    const cacheKey = this.createCacheKey('anomalies', options);
    
    // Check memory cache first
    if (!options.refreshCache && this.dataCache.anomalies.has(cacheKey)) {
      return this.dataCache.anomalies.get(cacheKey) || [];
    }
    
    // Fetch anomalies from API
    const anomalies = await this.fetchApi<AnomalyDetection[]>('/anomalies', options);
    
    // Cache results
    this.updateCache('anomalies', cacheKey, anomalies);
    
    return anomalies;
  });

  /**
   * Fetch threat indicators with caching and performance optimization
   */
  getThreats = asyncSafeCache<SecurityAnalyticsOptions | undefined, ThreatIndicator[]>(async (options?: SecurityAnalyticsOptions): Promise<ThreatIndicator[]> => {
    options = options || {};
    const cacheKey = this.createCacheKey('threats', options);
    
    // Check memory cache first
    if (!options.refreshCache && this.dataCache.threats.has(cacheKey)) {
      return this.dataCache.threats.get(cacheKey) || [];
    }
    
    // Fetch threats from API
    const threats = await this.fetchApi<ThreatIndicator[]>('/threats', options);
    
    // Cache results
    this.updateCache('threats', cacheKey, threats);
    
    return threats;
  });

  /**
   * Get a comprehensive security snapshot
   */
  getSecuritySnapshot = longTTLCache(async (options: SecurityAnalyticsOptions = {}): Promise<SecuritySnapshot> => {
    // Fetch all data in parallel for performance
    const [metrics, events, anomalies, threats] = await Promise.all([
      this.getMetrics(options),
      this.getEvents({...options, limit: 10}), // Limit recent events
      this.getAnomalies({
        ...options, 
        includeResolved: false // Only include active anomalies
      }),
      this.getThreats(options)
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
    
    // Calculate security score (0-100)
    const securityScore = this.calculateSecurityScore(metrics, anomalies, threats);
    
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
      metrics,
      recentEvents: events,
      activeAnomalies: anomalies,
      activeThreatIndicators: threats,
      securityScore,
      securityStatus,
      alertCount
    };
  });

  /**
   * Calculate security score based on metrics, anomalies, and threats
   */
  private calculateSecurityScore(
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
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Perform correlation analysis on security events
   */
  async correlateEvents(
    eventIds: string[],
    options: SecurityAnalyticsOptions = {}
  ): Promise<{
    correlationId: string;
    relatedEvents: SecurityEvent[];
    patterns: string[];
    score: number;
    recommendations: string[];
  }> {
    // Use worker for correlation if available, otherwise use API
    if (this.worker) {
      return new Promise((resolve, reject) => {
        const correlationId = `corr_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
        
        // Set up one-time handler for this correlation
        const handler = (result: any) => {
          if (result.correlationId === correlationId) {
            // Remove the handler
            const handlers = this.eventHandlers.get('correlation') || new Set();
            handlers.delete(handler);
            
            resolve(result);
          }
        };
        
        // Add handler
        let handlers = this.eventHandlers.get('correlation');
        if (!handlers) {
          handlers = new Set();
          this.eventHandlers.set('correlation', handlers);
        }
        handlers.add(handler);
        
        // Send to worker
        if (this.worker) {
          this.worker.port.postMessage({
            type: 'correlate_events',
            correlationId,
            eventIds,
            options
          });
        } else {
          reject(new Error('Worker is not available for correlation processing'));
          return;
        }
        
        // Timeout after 10 seconds
        setTimeout(() => {
          const handlers = this.eventHandlers.get('correlation');
          if (handlers) {
            handlers.delete(handler);
          }
          reject(new Error('Event correlation timed out'));
        }, 10000);
      });
    }
    
    // Fallback to API
    return this.fetchApi<{
      correlationId: string;
      relatedEvents: SecurityEvent[];
      patterns: string[];
      score: number;
      recommendations: string[];
    }>('/correlate', {
      ...options,
      eventIds
    });
  }

  /**
   * Subscribe to security analytics events
   */
  on<T = unknown>(
    eventType: 'metric' | 'event' | 'anomaly' | 'threat' | 'correlation' | 'snapshot',
    handler: (data: T) => void
  ): () => void {
    // Initialize if not already
    if (!this.isInitialized) this.initialize();
    
    // Add handler
    let handlers = this.eventHandlers.get(eventType);
    if (!handlers) {
      handlers = new Set<(data: unknown) => void>();
      this.eventHandlers.set(eventType, handlers);
    }
    
    // Cast handler to match Set type
    const typedHandler = handler as (data: unknown) => void;
    handlers.add(typedHandler);
    
    // Return unsubscribe function
    return () => {
      const handlers = this.eventHandlers.get(eventType);
      if (handlers) {
        handlers.delete(typedHandler);
      }
    };
  }

  /**
   * Unsubscribe from all events for a specific handler
   */
  off<T = unknown>(
    eventType: 'metric' | 'event' | 'anomaly' | 'threat' | 'correlation' | 'snapshot',
    handler: (data: T) => void
  ): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      // Cast handler to match Set type
      const typedHandler = handler as (data: unknown) => void;
      handlers.delete(typedHandler);
    }
  }

  /**
   * Manually refresh data from API
   */
  async refreshData(types: ('metrics' | 'events' | 'anomalies' | 'threats')[] = ['metrics', 'events', 'anomalies', 'threats']): Promise<void> {
    const options = { refreshCache: true };
    const promises = [];
    
    // Refresh selected data types
    if (types.includes('metrics')) {
      promises.push(this.getMetrics(options));
    }
    
    if (types.includes('events')) {
      promises.push(this.getEvents(options));
    }
    
    if (types.includes('anomalies')) {
      promises.push(this.getAnomalies(options));
    }
    
    if (types.includes('threats')) {
      promises.push(this.getThreats(options));
    }
    
    // Wait for all refreshes to complete
    await Promise.all(promises);
  }

  /**
   * Get performance metrics for the security analytics service
   */
  getPerformanceMetrics = asyncSafeCache(async (): Promise<PerformanceMetrics> => {
    // Record current cache sizes
    const cacheSize = {
      metrics: this.dataCache.metrics.size,
      events: this.dataCache.events.size,
      anomalies: this.dataCache.anomalies.size,
      threats: this.dataCache.threats.size,
      total: this.dataCache.metrics.size + 
             this.dataCache.events.size + 
             this.dataCache.anomalies.size + 
             this.dataCache.threats.size
    };
    
    // Determine SSE connection status
    let sseStatus: 'connected' | 'connecting' | 'disconnected' = 'disconnected';
    if (this.sseConnection) {
      sseStatus = this.sseConnection.readyState === EventSource.OPEN ? 'connected' : 'connecting';
    }
    
    // Determine worker status
    const workerStatus = this.worker ? 'active' : 'inactive';
    
    // Return metrics with placeholder latency (would be measured in production)
    return {
      cacheSize,
      sseStatus,
      workerStatus,
      latency: {
        metrics: 150,
        events: 180,
        anomalies: 200,
        threats: 220,
        average: 187.5
      }
    };
  });

  /**
   * Clean up resources
   */
  private cleanup() {
    // Close SSE connection
    if (this.sseConnection) {
      this.sseConnection.close();
      this.sseConnection = null;
    }
    
    // Terminate worker
    if (this.worker) {
      this.worker.port.postMessage({ type: 'close' });
      this.worker = null;
    }
    
    // Clear event handlers
    this.eventHandlers.clear();
    
    // Clear caches
    this.dataCache.metrics.clear();
    this.dataCache.events.clear();
    this.dataCache.anomalies.clear();
    this.dataCache.threats.clear();
    
    // Reset memory usage
    this.memoryUsage = {
      metrics: 0,
      events: 0,
      anomalies: 0,
      threats: 0
    };
    
    this.isInitialized = false;
  }
}

// Create singleton instance
export const enhancedAnalytics = new EnhancedAnalyticsService();

// Create a wrapper SecurityAnalytics class with additional event methods
class SecurityAnalyticsEventHandler {
  private events: EnhancedAnalyticsService;
  private eventListeners: Map<string, Set<(data: unknown) => void>> = new Map();

  constructor(events: EnhancedAnalyticsService) {
    this.events = events;
  }

  /**
   * Subscribe to an event
   */
  on<T = unknown>(event: string, callback: (data: T) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set<(data: unknown) => void>());
    }
    
    // Cast callback to match Set type
    const typedCallback = callback as (data: unknown) => void;
    this.eventListeners.get(event)?.add(typedCallback);
    
    // Wire up the enhanced analytics events to pass through
    if (['metric', 'event', 'anomaly', 'threat', 'correlation', 'snapshot'].includes(event)) {
      this.events.on<T>(event as 'metric' | 'event' | 'anomaly' | 'threat' | 'correlation' | 'snapshot', callback);
    }
  }

  /**
   * Unsubscribe from an event
   */
  off<T = unknown>(event: string, callback: (data: T) => void): void {
    if (this.eventListeners.has(event)) {
      // Cast callback to match Set type
      const typedCallback = callback as (data: unknown) => void;
      this.eventListeners.get(event)?.delete(typedCallback);
    }
    
    // Remove from enhanced analytics events if applicable
    if (['metric', 'event', 'anomaly', 'threat', 'correlation', 'snapshot'].includes(event)) {
      this.events.off<T>(event as 'metric' | 'event' | 'anomaly' | 'threat' | 'correlation' | 'snapshot', callback);
    }
  }
  
  /**
   * Get metrics via the underlying enhanced analytics instance
   */
  getMetrics(options: SecurityAnalyticsOptions = {}) {
    return this.events.getMetrics(options);
  }
  
  /**
   * Get events via the underlying enhanced analytics instance
   */
  getEvents(options: SecurityAnalyticsOptions = {}) {
    return this.events.getEvents(options);
  }
  
  /**
   * Get anomalies via the underlying enhanced analytics instance
   */
  getAnomalies(options: SecurityAnalyticsOptions = {}) {
    return this.events.getAnomalies(options);
  }
  
  /**
   * Get threats via the underlying enhanced analytics instance
   */
  getThreats(options: SecurityAnalyticsOptions = {}) {
    return this.events.getThreats(options);
  }
  
  /**
   * Get security snapshot via the underlying enhanced analytics instance
   */
  getSecuritySnapshot(options: SecurityAnalyticsOptions = {}) {
    return this.events.getSecuritySnapshot(options);
  }
  
  /**
   * Get performance metrics via the underlying enhanced analytics instance
   */
  getPerformanceMetrics() {
    return this.events.getPerformanceMetrics();
  }
  
  /**
   * Refresh data via the underlying enhanced analytics instance
   */
  refreshData(types?: ('metrics' | 'events' | 'anomalies' | 'threats')[]) {
    return this.events.refreshData(types);
  }
  
  /**
   * Correlate events via the underlying enhanced analytics instance
   */
  correlateEvents(eventIds: string[], options?: SecurityAnalyticsOptions) {
    return this.events.correlateEvents(eventIds, options);
  }
}

// Create and export the SecurityAnalytics instance
export const SecurityAnalytics = new SecurityAnalyticsEventHandler(enhancedAnalytics);

// Re-export SecurityAnalyticsClient for naming compatibility with old code
export const SecurityAnalyticsClient = enhancedAnalytics;

// For default export compatibility
export default enhancedAnalytics;