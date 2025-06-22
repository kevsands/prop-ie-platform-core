/**
 * Real-Time Cache Manager
 * 
 * Advanced caching system optimized for real-time data with WebSocket integration
 * Provides intelligent cache invalidation, prefetching, and performance optimization
 */

import { EventEmitter } from 'events';
import { realTimeServerManager } from '@/lib/realtime/realTimeServerManager';

export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum cache size
  prefetchThreshold: number; // When to trigger prefetch (percentage of TTL)
  invalidateOnUpdate: boolean; // Auto-invalidate on real-time updates
  compressionEnabled: boolean; // Enable data compression
  priority: 'low' | 'medium' | 'high' | 'critical'; // Cache priority
}

export interface CacheEntry<T> {
  key: string;
  value: T;
  expiry: number;
  createdAt: number;
  lastAccessed: number;
  accessCount: number;
  size: number; // Estimated memory size
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[]; // For batch invalidation
  realTimeSubscribed: boolean; // Whether this entry listens to real-time updates
}

export interface CacheStats {
  totalEntries: number;
  totalSize: number;
  hitRate: number;
  missRate: number;
  evictionCount: number;
  prefetchCount: number;
  memoryUsage: {
    used: number;
    available: number;
    percentage: number;
  };
}

export class RealTimeCacheManager extends EventEmitter {
  private cache = new Map<string, CacheEntry<any>>();
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    prefetches: 0,
    lastCleanup: Date.now()
  };
  
  private readonly defaultConfig: CacheConfig = {
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 1000,
    prefetchThreshold: 0.8, // 80% of TTL
    invalidateOnUpdate: true,
    compressionEnabled: false,
    priority: 'medium'
  };

  private cleanupInterval: NodeJS.Timeout;
  private prefetchInterval: NodeJS.Timeout;

  constructor() {
    super();
    
    // Start background processes
    this.startBackgroundCleanup();
    this.startPrefetchMonitoring();
    this.setupRealTimeListeners();
    
    console.log('🚀 Real-Time Cache Manager initialized');
  }

  /**
   * Get cached value with intelligent prefetching and real-time updates
   */
  async get<T>(
    key: string, 
    fetchFunction?: () => Promise<T>,
    config: Partial<CacheConfig> = {}
  ): Promise<T | null> {
    const entry = this.cache.get(key);
    const now = Date.now();
    
    // Cache hit
    if (entry && entry.expiry > now) {
      entry.lastAccessed = now;
      entry.accessCount++;
      this.stats.hits++;
      
      // Check if prefetch is needed
      if (fetchFunction && this.shouldPrefetch(entry, config)) {
        this.prefetchEntry(key, fetchFunction, config);
      }
      
      this.emit('cache_hit', { key, entry });
      return entry.value;
    }
    
    // Cache miss
    this.stats.misses++;
    this.emit('cache_miss', { key });
    
    // If no fetch function, return null
    if (!fetchFunction) {
      return null;
    }
    
    // Fetch and cache new data
    try {
      const value = await fetchFunction();
      await this.set(key, value, config);
      return value;
    } catch (error) {
      console.error(`Cache fetch failed for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set cached value with real-time subscription
   */
  async set<T>(
    key: string, 
    value: T, 
    config: Partial<CacheConfig> = {}
  ): Promise<void> {
    const finalConfig = { ...this.defaultConfig, ...config };
    const now = Date.now();
    
    // Calculate entry size (rough estimation)
    const size = this.calculateSize(value);
    
    // Check if we need to evict entries
    if (this.cache.size >= finalConfig.maxSize) {
      this.evictEntries(finalConfig);
    }
    
    const entry: CacheEntry<T> = {
      key,
      value,
      expiry: now + finalConfig.ttl,
      createdAt: now,
      lastAccessed: now,
      accessCount: 1,
      size,
      priority: finalConfig.priority,
      tags: this.extractTags(key),
      realTimeSubscribed: finalConfig.invalidateOnUpdate
    };
    
    this.cache.set(key, entry);
    
    // Subscribe to real-time updates if enabled
    if (finalConfig.invalidateOnUpdate) {
      this.subscribeToRealTimeUpdates(key, entry);
    }
    
    this.emit('cache_set', { key, entry });
    
    // Broadcast cache update for distributed caching
    realTimeServerManager.triggerEvent('cache_updated', {
      key,
      action: 'set',
      timestamp: now,
      size: this.cache.size
    });
  }

  /**
   * Invalidate cache entries by key pattern or tags
   */
  invalidate(pattern: string | RegExp | string[]): number {
    let invalidatedCount = 0;
    const keysToDelete: string[] = [];
    
    if (typeof pattern === 'string') {
      // Single key invalidation
      if (this.cache.has(pattern)) {
        keysToDelete.push(pattern);
      }
    } else if (pattern instanceof RegExp) {
      // Regex pattern invalidation
      for (const key of this.cache.keys()) {
        if (pattern.test(key)) {
          keysToDelete.push(key);
        }
      }
    } else if (Array.isArray(pattern)) {
      // Tag-based invalidation
      for (const [key, entry] of this.cache.entries()) {
        if (pattern.some(tag => entry.tags.includes(tag))) {
          keysToDelete.push(key);
        }
      }
    }
    
    // Delete the keys
    for (const key of keysToDelete) {
      this.cache.delete(key);
      invalidatedCount++;
    }
    
    if (invalidatedCount > 0) {
      this.emit('cache_invalidated', { pattern, count: invalidatedCount });
      
      // Broadcast invalidation for distributed caching
      realTimeServerManager.triggerEvent('cache_invalidated', {
        pattern: pattern.toString(),
        count: invalidatedCount,
        timestamp: Date.now()
      });
    }
    
    return invalidatedCount;
  }

  /**
   * Prefetch data based on access patterns and predictions
   */
  private async prefetchEntry<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    config: Partial<CacheConfig>
  ): Promise<void> {
    try {
      const value = await fetchFunction();
      await this.set(key, value, config);
      this.stats.prefetches++;
      
      this.emit('cache_prefetched', { key });
      console.log(`📡 Prefetched cache entry: ${key}`);
    } catch (error) {
      console.error(`Prefetch failed for key ${key}:`, error);
    }
  }

  /**
   * Check if entry should be prefetched
   */
  private shouldPrefetch(entry: CacheEntry<any>, config: Partial<CacheConfig>): boolean {
    const finalConfig = { ...this.defaultConfig, ...config };
    const timeUntilExpiry = entry.expiry - Date.now();
    const totalTtl = entry.expiry - entry.createdAt;
    const remainingPercentage = timeUntilExpiry / totalTtl;
    
    return remainingPercentage <= (1 - finalConfig.prefetchThreshold);
  }

  /**
   * Evict entries based on LRU and priority
   */
  private evictEntries(config: CacheConfig): void {
    const entries = Array.from(this.cache.entries());
    
    // Sort by priority (low first) and last accessed (oldest first)
    entries.sort(([, a], [, b]) => {
      const priorityOrder = { low: 0, medium: 1, high: 2, critical: 3 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return a.lastAccessed - b.lastAccessed;
    });
    
    // Evict 25% of entries
    const evictCount = Math.ceil(entries.length * 0.25);
    for (let i = 0; i < evictCount; i++) {
      const [key] = entries[i];
      this.cache.delete(key);
      this.stats.evictions++;
    }
    
    this.emit('cache_evicted', { count: evictCount });
  }

  /**
   * Subscribe to real-time updates for cache invalidation
   */
  private subscribeToRealTimeUpdates(key: string, entry: CacheEntry<any>): void {
    // Determine what real-time events should invalidate this cache entry
    const tags = entry.tags;
    
    if (tags.includes('property')) {
      realTimeServerManager.addEventListener('property_updated', () => {
        this.invalidate(key);
      });
    }
    
    if (tags.includes('development')) {
      realTimeServerManager.addEventListener('development_updated', () => {
        this.invalidate(key);
      });
    }
    
    if (tags.includes('htb')) {
      realTimeServerManager.addEventListener('htb_updated', () => {
        this.invalidate(key);
      });
    }
    
    if (tags.includes('task')) {
      realTimeServerManager.addEventListener('task_updated', () => {
        this.invalidate(key);
      });
    }
  }

  /**
   * Extract tags from cache key for intelligent invalidation
   */
  private extractTags(key: string): string[] {
    const tags: string[] = [];
    
    if (key.includes('property')) tags.push('property');
    if (key.includes('development')) tags.push('development');
    if (key.includes('htb')) tags.push('htb');
    if (key.includes('task')) tags.push('task');
    if (key.includes('user')) tags.push('user');
    if (key.includes('role')) tags.push('role');
    if (key.includes('search')) tags.push('search');
    if (key.includes('analytics')) tags.push('analytics');
    
    return tags;
  }

  /**
   * Calculate rough memory size of cached value
   */
  private calculateSize(value: any): number {
    try {
      return JSON.stringify(value).length * 2; // Rough estimation in bytes
    } catch {
      return 100; // Default size estimate
    }
  }

  /**
   * Background cleanup of expired entries
   */
  private startBackgroundCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000); // Run every minute
  }

  /**
   * Background prefetch monitoring
   */
  private startPrefetchMonitoring(): void {
    this.prefetchInterval = setInterval(() => {
      this.monitorPrefetchOpportunities();
    }, 30000); // Run every 30 seconds
  }

  /**
   * Set up real-time event listeners for cache management
   */
  private setupRealTimeListeners(): void {
    realTimeServerManager.addEventListener('cache_clear_request', () => {
      this.clear();
    });
    
    realTimeServerManager.addEventListener('cache_invalidate_pattern', (data: any) => {
      this.invalidate(data.pattern);
    });
  }

  /**
   * Monitor for prefetch opportunities
   */
  private monitorPrefetchOpportunities(): void {
    const now = Date.now();
    let opportunities = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.accessCount > 5 && this.shouldPrefetch(entry, {})) {
        opportunities++;
      }
    }
    
    if (opportunities > 0) {
      this.emit('prefetch_opportunities', { count: opportunities });
    }
  }

  /**
   * Cleanup expired entries
   */
  cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiry <= now) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }
    
    this.stats.lastCleanup = now;
    
    if (cleanedCount > 0) {
      this.emit('cache_cleaned', { count: cleanedCount });
      console.log(`🧹 Cleaned ${cleanedCount} expired cache entries`);
    }
  }

  /**
   * Get comprehensive cache statistics
   */
  getStats(): CacheStats {
    const totalAccesses = this.stats.hits + this.stats.misses;
    const totalSize = Array.from(this.cache.values()).reduce((sum, entry) => sum + entry.size, 0);
    
    return {
      totalEntries: this.cache.size,
      totalSize,
      hitRate: totalAccesses > 0 ? this.stats.hits / totalAccesses : 0,
      missRate: totalAccesses > 0 ? this.stats.misses / totalAccesses : 0,
      evictionCount: this.stats.evictions,
      prefetchCount: this.stats.prefetches,
      memoryUsage: {
        used: totalSize,
        available: 50 * 1024 * 1024, // 50MB limit
        percentage: (totalSize / (50 * 1024 * 1024)) * 100
      }
    };
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    const count = this.cache.size;
    this.cache.clear();
    this.emit('cache_cleared', { count });
    
    realTimeServerManager.triggerEvent('cache_cleared', {
      count,
      timestamp: Date.now()
    });
  }

  /**
   * Destroy cache manager and cleanup resources
   */
  destroy(): void {
    if (this.cleanupInterval) clearInterval(this.cleanupInterval);
    if (this.prefetchInterval) clearInterval(this.prefetchInterval);
    this.clear();
    this.removeAllListeners();
  }
}

// Export singleton instance
export const realTimeCacheManager = new RealTimeCacheManager();