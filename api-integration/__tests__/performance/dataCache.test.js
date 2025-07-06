import { DataCache, MemoryStorageAdapter } from '../../src/lib/cache/dataCache';
// Skip this test in favor of the TypeScript version (__tests__/performance/dataCache.test.ts)
describe.skip('DataCache', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('basic operations', () => {
        it('should store and retrieve values', () => {
            const cache = new DataCache();
            cache.set('key1', 'value1');
            expect(cache.get('key1')).toBe('value1');
        });
        it('should check if keys exist', () => {
            const cache = new DataCache();
            cache.set('key1', 'value1');
            expect(cache.has('key1')).toBe(true);
            expect(cache.has('nonexistent')).toBe(false);
        });
        it('should delete keys', () => {
            const cache = new DataCache();
            cache.set('key1', 'value1');
            cache.delete('key1');
            expect(cache.has('key1')).toBe(false);
            expect(cache.get('key1')).toBeUndefined();
        });
        it('should clear all entries', () => {
            const cache = new DataCache();
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');
            cache.clear();
            expect(cache.has('key1')).toBe(false);
            expect(cache.has('key2')).toBe(false);
        });
    });
    describe('TTL functionality', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });
        afterEach(() => {
            jest.useRealTimers();
        });
        it('should respect TTL for cached items', () => {
            const cache = new DataCache({ defaultTTL: 1000 }); // 1 second default TTL
            cache.set('key1', 'value1'); // Use default TTL
            cache.set('key2', 'value2', 2000); // 2 second TTL
            cache.set('key3', 'value3', 0); // No expiry
            // All keys should exist initially
            expect(cache.get('key1')).toBe('value1');
            expect(cache.get('key2')).toBe('value2');
            expect(cache.get('key3')).toBe('value3');
            // Advance time by 1.5 seconds
            jest.advanceTimersByTime(1500);
            // key1 should be expired, key2 and key3 should still exist
            expect(cache.get('key1')).toBeUndefined();
            expect(cache.get('key2')).toBe('value2');
            expect(cache.get('key3')).toBe('value3');
            // Advance time by another 1 second
            jest.advanceTimersByTime(1000);
            // key2 should now be expired, key3 should still exist
            expect(cache.get('key2')).toBeUndefined();
            expect(cache.get('key3')).toBe('value3');
        });
        it('should auto-cleanup expired items', () => {
            const cache = new DataCache({
                defaultTTL: 1000,
                cleanupInterval: 2000 // cleanup every 2 seconds
            });
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');
            // Spy on delete method to check if it's called
            const deleteSpy = jest.spyOn(cache, 'delete');
            // Advance time past TTL but before cleanup
            jest.advanceTimersByTime(1500);
            // Items should be expired but not yet cleaned up
            expect(cache.get('key1')).toBeUndefined();
            expect(cache.get('key2')).toBeUndefined();
            expect(deleteSpy).not.toHaveBeenCalled();
            // Advance time to trigger cleanup
            jest.advanceTimersByTime(1000); // total 2500ms
            // Cleanup should have removed both keys
            expect(deleteSpy).toHaveBeenCalledTimes(2);
        });
    });
    describe('getOrSet functionality', () => {
        it('should get existing value or set new value', () => {
            const cache = new DataCache();
            const fetchFn = jest.fn(() => 'fetched-value');
            // First call should use the fetchFn
            expect(cache.getOrSet('key1', fetchFn)).toBe('fetched-value');
            expect(fetchFn).toHaveBeenCalledTimes(1);
            // Second call should use cached value
            expect(cache.getOrSet('key1', fetchFn)).toBe('fetched-value');
            expect(fetchFn).toHaveBeenCalledTimes(1);
        });
        it('should work with async functions', async () => {
            const cache = new DataCache();
            const fetchFn = jest.fn(async () => 'async-value');
            // First call should use the fetchFn
            expect(await cache.getOrSetAsync('key1', fetchFn)).toBe('async-value');
            expect(fetchFn).toHaveBeenCalledTimes(1);
            // Second call should use cached value
            expect(await cache.getOrSetAsync('key1', fetchFn)).toBe('async-value');
            expect(fetchFn).toHaveBeenCalledTimes(1);
        });
        it('should handle fetch errors properly', async () => {
            const cache = new DataCache();
            const fetchFn = jest.fn(async () => {
                throw new Error('Fetch failed');
            });
            // Should propagate error
            await expect(cache.getOrSetAsync('key1', fetchFn)).rejects.toThrow('Fetch failed');
            // Should not cache errors
            expect(cache.has('key1')).toBe(false);
            // Should retry on next call
            fetchFn.mockImplementationOnce(async () => 'success');
            expect(await cache.getOrSetAsync('key1', fetchFn)).toBe('success');
        });
    });
    describe('storage adapters', () => {
        it('should use the specified storage adapter', () => {
            const storage = new MemoryStorageAdapter();
            const getItemSpy = jest.spyOn(storage, 'get');
            const setItemSpy = jest.spyOn(storage, 'set');
            const cache = new DataCache({ storage });
            cache.set('key1', 'value1');
            cache.get('key1');
            expect(setItemSpy).toHaveBeenCalled();
            expect(getItemSpy).toHaveBeenCalled();
        });
    });
    describe('metrics and stats', () => {
        it('should track cache statistics', () => {
            const cache = new DataCache();
            // Set some values
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');
            // Get some values (hits)
            cache.get('key1');
            cache.get('key1'); // second hit
            // Miss
            cache.get('nonexistent');
            // Delete
            cache.delete('key2');
            // Get metrics
            const metrics = cache.getMetrics();
            expect(metrics.hits).toBe(2);
            expect(metrics.misses).toBe(1);
            expect(metrics.sets).toBe(2);
            expect(metrics.deletes).toBe(1);
        });
    });
    describe('size limits', () => {
        it('should respect maximum size', () => {
            const cache = new DataCache({ maxSize: 2 });
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');
            // Access key1 to update its last accessed time
            cache.get('key1');
            // Adding a third entry should remove the least recently used (key2)
            cache.set('key3', 'value3');
            expect(cache.has('key1')).toBe(true);
            expect(cache.has('key2')).toBe(false);
            expect(cache.has('key3')).toBe(true);
        });
    });
});
