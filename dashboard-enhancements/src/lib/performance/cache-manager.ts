import { LRUCache } from 'lru-cache';

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  max?: number; // Maximum number of items in cache
  updateAgeOnGet?: boolean;
  stale?: boolean;
}

class CacheManager {
  private caches: Map<string, LRUCache<string, any>>;
  private defaultOptions: CacheOptions;

  constructor() {
    this.caches = new Map();
    this.defaultOptions = {
      ttl: 5 * 60 * 1000, // 5 minutes default
      max: 100,
      updateAgeOnGet: true,
      stale: false
    };
  }

  createCache(name: string, options: CacheOptions = {}) {
    const cacheOptions = { ...this.defaultOptions, ...options };
    const cache = new LRUCache<string, any>({
      max: cacheOptions.max!,
      ttl: cacheOptions.ttl!,
      updateAgeOnGet: cacheOptions.updateAgeOnGet,
      allowStale: cacheOptions.stale,
      fetchMethod: async (key: string, staleValue: any, { signal }) => {
        // This can be overridden per cache
        return null;
      }
    });

    this.caches.set(name, cache);
    return cache;
  }

  getCache(name: string): LRUCache<string, any> | undefined {
    return this.caches.get(name);
  }

  async get<T>(cacheName: string, key: string): Promise<T | undefined> {
    const cache = this.getCache(cacheName);
    if (!cache) {
      console.warn(`Cache ${cacheName} not found`);
      return undefined;
    }
    return cache.get(key);
  }

  async set<T>(cacheName: string, key: string, value: T, options?: { ttl?: number }): Promise<void> {
    const cache = this.getCache(cacheName);
    if (!cache) {
      console.warn(`Cache ${cacheName} not found`);
      return;
    }
    cache.set(key, value, options);
  }

  async delete(cacheName: string, key: string): Promise<boolean> {
    const cache = this.getCache(cacheName);
    if (!cache) {
      console.warn(`Cache ${cacheName} not found`);
      return false;
    }
    return cache.delete(key);
  }

  async clear(cacheName: string): Promise<void> {
    const cache = this.getCache(cacheName);
    if (!cache) {
      console.warn(`Cache ${cacheName} not found`);
      return;
    }
    cache.clear();
  }

  async clearAll(): Promise<void> {
    for (const cache of this.caches.values()) {
      cache.clear();
    }
  }

  getCacheStats(cacheName: string) {
    const cache = this.getCache(cacheName);
    if (!cache) {
      return null;
    }

    return {
      size: cache.size,
      max: cache.max,
      disposed: cache.disposed,
      calculatedSize: cache.calculatedSize,
      // Additional stats can be added here
    };
  }
}

// Singleton instance
export const cacheManager = new CacheManager();

// Create specific caches
export const propertyCache = cacheManager.createCache('properties', {
  ttl: 10 * 60 * 1000, // 10 minutes
  max: 200
});

export const userCache = cacheManager.createCache('users', {
  ttl: 30 * 60 * 1000, // 30 minutes
  max: 50
});

export const apiCache = cacheManager.createCache('api', {
  ttl: 5 * 60 * 1000, // 5 minutes
  max: 100
});

export const imageCache = cacheManager.createCache('images', {
  ttl: 60 * 60 * 1000, // 1 hour
  max: 500
});

// Helper functions for common cache operations
export const withCache = async <T>(
  cacheName: string,
  key: string,
  fetchFn: () => Promise<T>,
  options?: CacheOptions
): Promise<T> => {
  const cached = await cacheManager.get<T>(cacheName, key);
  if (cached !== undefined) {
    return cached;
  }

  const value = await fetchFn();
  await cacheManager.set(cacheName, key, value, options);
  return value;
};

// React Query integration
export const queryCache = {
  get: async (key: string) => {
    return await cacheManager.get('queries', key);
  },
  set: async (key: string, value: any) => {
    await cacheManager.set('queries', key, value);
  },
  remove: async (key: string) => {
    await cacheManager.delete('queries', key);
  },
  clear: async () => {
    await cacheManager.clear('queries');
  }
};

// Create query cache
cacheManager.createCache('queries', {
  ttl: 5 * 60 * 1000, // 5 minutes
  max: 100
});