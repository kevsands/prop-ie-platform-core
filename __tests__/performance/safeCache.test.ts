import { safeCache, asyncSafeCache, ttlCache } from '../../src/utils/performance/safeCache';

describe('Safe Cache Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('safeCache', () => {
    it('should cache function results', () => {
      // Create a mock function to track calls
      const mockFn = jest.fn((x: number) => x * 2);
      const cachedFn = safeCache(mockFn);
      
      // First call should execute the function
      expect(cachedFn(5)).toBe(10);
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      // Second call with same argument should use cached result
      expect(cachedFn(5)).toBe(10);
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      // Call with different argument should execute the function again
      expect(cachedFn(10)).toBe(20);
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
    
    it('should work with complex arguments', () => {
      const mockFn = jest.fn((obj: { id: string, data: any }) => obj.id);
      const cachedFn = safeCache(mockFn);
      
      const obj1 = { id: 'a', data: { value: 1 } };
      const obj2 = { id: 'a', data: { value: 1 } }; // Same structure but different reference
      
      // First call should execute the function
      expect(cachedFn(obj1)).toBe('a');
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      // Second call with equivalent object should use cached result
      expect(cachedFn(obj2)).toBe('a');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('asyncSafeCache', () => {
    it('should cache async function results', async () => {
      const mockAsyncFn = jest.fn(async (x: number) => x * 3);
      const cachedAsyncFn = asyncSafeCache(mockAsyncFn);
      
      // First call should execute the function
      expect(await cachedAsyncFn(5)).toBe(15);
      expect(mockAsyncFn).toHaveBeenCalledTimes(1);
      
      // Second call with same argument should use cached result
      expect(await cachedAsyncFn(5)).toBe(15);
      expect(mockAsyncFn).toHaveBeenCalledTimes(1);
    });
    
    it('should not cache rejected promises', async () => {
      const mockErrorFn = jest.fn(async (x: number) => {
        if (x < 0) throw new Error('Negative input');
        return x;
      });
      
      const cachedErrorFn = asyncSafeCache(mockErrorFn);
      
      // First call with positive number should succeed
      await expect(cachedErrorFn(5)).resolves.toBe(5);
      expect(mockErrorFn).toHaveBeenCalledTimes(1);
      
      // Call with negative number should throw
      await expect(cachedErrorFn(-5)).rejects.toThrow('Negative input');
      expect(mockErrorFn).toHaveBeenCalledTimes(2);
      
      // Retry with negative number should try again (not cached)
      await expect(cachedErrorFn(-5)).rejects.toThrow('Negative input');
      expect(mockErrorFn).toHaveBeenCalledTimes(3);
    });
  });
  
  // Note: serverCache function has been removed from the API
  
  describe('ttlCache', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });
    
    afterEach(() => {
      jest.useRealTimers();
    });
    
    it('should expire cache entries after TTL', () => {
      const mockFn = jest.fn((x: number) => x * 2);
      const cachedFn = ttlCache(mockFn, 1000); // 1 second TTL
      
      // First call should execute the function
      expect(cachedFn(5)).toBe(10);
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      // Call before expiry should use cached result
      jest.advanceTimersByTime(500);
      expect(cachedFn(5)).toBe(10);
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      // Call after expiry should execute the function again
      jest.advanceTimersByTime(600); // total 1100ms
      expect(cachedFn(5)).toBe(10);
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
    
    it('should honor custom TTL for specific calls', () => {
      const mockFn = jest.fn((x: number) => x * 2);
      const cachedFn = ttlCache(mockFn, 2000); // Cache with 2s TTL
      
      // First call
      expect(cachedFn(5)).toBe(10);
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      // After 1 second, should still be cached
      jest.advanceTimersByTime(1000);
      expect(cachedFn(5)).toBe(10);
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      // After another 1.5 seconds (total 2.5s), should expire
      jest.advanceTimersByTime(1500);
      expect(cachedFn(5)).toBe(10);
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });
});