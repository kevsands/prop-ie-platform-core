// __tests__/utils/paramValidator.test.ts
import { getValidParam, getNumericId, getBooleanParam } from '../../src/utils/paramValidator';
import { ReadonlyURLSearchParams } from 'next/navigation';

// Mock URLSearchParams
const createMockSearchParams = (params: Record<string, string> = {}): ReadonlyURLSearchParams => {
  return {
    get: jest.fn((key) => params[key] || null),
    getAll: jest.fn(),
    has: jest.fn((key) => key in params),
    entries: jest.fn(),
    keys: jest.fn(),
    values: jest.fn(),
    forEach: jest.fn(),
    toString: jest.fn(() => new URLSearchParams(params).toString()),
    // Type assertion to match ReadonlyURLSearchParams
  } as unknown as ReadonlyURLSearchParams;
};

describe('URL Parameter Validation Utils', () => {
  describe('getValidParam', () => {
    it('should return the param value when it exists', () => {
      const params = createMockSearchParams({ test: 'value' });
      expect(getValidParam(params, 'test')).toBe('value');
      expect(params.get).toHaveBeenCalledWith('test');
    });

    it('should return empty string when param does not exist and not required', () => {
      const params = createMockSearchParams({});
      expect(getValidParam(params, 'test')).toBe('');
    });

    it('should return default value when param does not exist and default is provided', () => {
      const params = createMockSearchParams({});
      expect(getValidParam(params, 'test', false, 'default')).toBe('default');
    });

    it('should throw error when param is required but missing', () => {
      const params = createMockSearchParams({});
      expect(() => getValidParam(params, 'test', true)).toThrow("Required parameter 'test' is missing from URL");
    });

    it('should handle null params safely', () => {
      expect(getValidParam(null, 'test')).toBe('');
      expect(getValidParam(null, 'test', false, 'default')).toBe('default');
    });
  });

  describe('getNumericId', () => {
    it('should return numeric value when param is a valid number', () => {
      const params = createMockSearchParams({ id: '123' });
      expect(getNumericId(params)).toBe(123);
    });

    it('should use custom key when provided', () => {
      const params = createMockSearchParams({ customId: '456' });
      expect(getNumericId(params, 'customId')).toBe(456);
      expect(params.get).toHaveBeenCalledWith('customId');
    });

    it('should return null when param is not a valid number and not required', () => {
      const params = createMockSearchParams({ id: 'abc' });
      expect(getNumericId(params, 'id', false)).toBeNull();
    });

    it('should throw error when param is required but not a valid number', () => {
      const params = createMockSearchParams({ id: 'abc' });
      expect(() => getNumericId(params)).toThrow("Required numeric parameter 'id' is missing or invalid");
    });

    it('should throw error when param is required but missing', () => {
      const params = createMockSearchParams({});
      expect(() => getNumericId(params)).toThrow("Required numeric parameter 'id' is missing or invalid");
    });

    it('should handle null params safely', () => {
      expect(() => getNumericId(null)).toThrow("Required numeric parameter 'id' is missing or invalid");
      expect(getNumericId(null, 'id', false)).toBeNull();
    });
  });

  describe('getBooleanParam', () => {
    it('should return true for "true", "1", and "yes" values', () => {
      expect(getBooleanParam(createMockSearchParams({ a: 'true' }), 'a')).toBe(true);
      expect(getBooleanParam(createMockSearchParams({ b: '1' }), 'b')).toBe(true);
      expect(getBooleanParam(createMockSearchParams({ c: 'yes' }), 'c')).toBe(true);
    });

    it('should return false for other string values', () => {
      expect(getBooleanParam(createMockSearchParams({ a: 'false' }), 'a')).toBe(false);
      expect(getBooleanParam(createMockSearchParams({ b: '0' }), 'b')).toBe(false);
      expect(getBooleanParam(createMockSearchParams({ c: 'no' }), 'c')).toBe(false);
      expect(getBooleanParam(createMockSearchParams({ d: 'something' }), 'd')).toBe(false);
    });

    it('should return the default value when param is missing', () => {
      expect(getBooleanParam(createMockSearchParams({}), 'test')).toBe(false); // Default is false
      expect(getBooleanParam(createMockSearchParams({}), 'test', true)).toBe(true); // Explicit default
    });

    it('should handle null params safely', () => {
      expect(getBooleanParam(null, 'test')).toBe(false);
      expect(getBooleanParam(null, 'test', true)).toBe(true);
    });
  });
});