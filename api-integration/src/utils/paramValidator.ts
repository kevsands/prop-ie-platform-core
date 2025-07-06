import { ReadonlyURLSearchParams } from 'next/navigation';

/**
 * Helper function to safely extract and validate URL parameters
 * This helps with the migration from router.query to useSearchParams
 * @param params The search params object from useSearchParams()
 * @param key The parameter key to extract
 * @param required Whether the parameter is required
 * @param defaultValue Default value if param is missing or invalid
 * @returns The validated parameter value or default value
 * @throws Error if parameter is required but missing or doesn't match pattern
 */
export function getValidParam(
  params: ReadonlyURLSearchParams | null,
  key: string,
  required: boolean = false,
  defaultValue: string = ''
): string {
  const value = params?.get(key) || '';
  
  // Check if required but missing
  if (required && !value) {
    throw new Error(`Required parameter '${key}' is missing from URL`);
  }
  
  return value || defaultValue;
}

/**
 * Helper function with advanced validation options
 * @param params The search params object from useSearchParams()
 * @param key The parameter key to extract
 * @param options Validation options
 * @returns The validated parameter value or default value
 * @throws Error if parameter is required but missing or doesn't match pattern
 */
export function getValidParamWithOptions(
  params: ReadonlyURLSearchParams | null,
  key: string,
  options: {
    required?: boolean;
    defaultValue?: string;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    allowEmpty?: boolean;
    transform?: (value: string) => string;
  } = {}
): string {
  const { 
    required = false,
    defaultValue = '',
    minLength,
    maxLength,
    pattern,
    allowEmpty = false,
    transform
  } = options;
  
  const value = params?.get(key) || '';
  
  // Check if required but missing
  if (required && !value && !allowEmpty) {
    throw new Error(`Required parameter '${key}' is missing from URL`);
  }
  
  // Apply transformation if provided
  const transformedValue = transform ? transform(value) : value;
  
  // Check minimum length
  if (minLength !== undefined && transformedValue.length < minLength) {
    if (required) {
      throw new Error(`Parameter '${key}' must be at least ${minLength} characters`);
    }
    return defaultValue;
  }
  
  // Check maximum length
  if (maxLength !== undefined && transformedValue.length > maxLength) {
    if (required) {
      throw new Error(`Parameter '${key}' must be at most ${maxLength} characters`);
    }
    return defaultValue;
  }
  
  // Check pattern
  if (pattern && !pattern.test(transformedValue)) {
    if (required) {
      throw new Error(`Parameter '${key}' does not match the required pattern`);
    }
    return defaultValue;
  }
  
  return transformedValue || defaultValue;
}

/**
 * Extract numeric ID from search params with type safety and validation
 * @param params The search params object from useSearchParams()
 * @param key The parameter key to extract (defaults to 'id')
 * @param required Whether the parameter is required
 * @param options Additional options for validation
 * @returns The numeric ID or null if invalid/missing
 * @throws Error if parameter is required but missing or invalid or fails validation
 */
export function getNumericId(
  params: ReadonlyURLSearchParams | null,
  key: string = 'id',
  required: boolean = true,
  options: {
    min?: number;
    max?: number;
    allowZero?: boolean;
    allowNegative?: boolean;
  } = {}
): number | null {
  const { min, max, allowZero = false, allowNegative = false } = options;
  const value = params?.get(key) || '';
  const numericValue = value ? parseInt(value, 10) : NaN;
  
  // Check if value is required but missing or not a number
  if (required && (!value || isNaN(numericValue))) {
    throw new Error(`Required numeric parameter '${key}' is missing or invalid`);
  }
  
  // If not required and missing or invalid, return null
  if (isNaN(numericValue)) {
    return null;
  }
  
  // Validate the numeric value
  if (!allowNegative && numericValue < 0) {
    if (required) {
      throw new Error(`Parameter '${key}' cannot be negative`);
    }
    return null;
  }
  
  if (!allowZero && numericValue === 0) {
    if (required) {
      throw new Error(`Parameter '${key}' cannot be zero`);
    }
    return null;
  }
  
  if (min !== undefined && numericValue < min) {
    if (required) {
      throw new Error(`Parameter '${key}' must be at least ${min}`);
    }
    return null;
  }
  
  if (max !== undefined && numericValue > max) {
    if (required) {
      throw new Error(`Parameter '${key}' must be at most ${max}`);
    }
    return null;
  }
  
  return numericValue;
}

/**
 * Extract and validate a boolean parameter from search params
 * @param params The search params object from useSearchParams()
 * @param key The parameter key to extract
 * @param defaultValue Default value if param is missing
 * @returns The boolean value
 */
export function getBooleanParam(
  params: ReadonlyURLSearchParams | null,
  key: string,
  defaultValue: boolean = false
): boolean {
  const value = params?.get(key);
  if (value === null || value === undefined) return defaultValue;
  return value === 'true' || value === '1' || value === 'yes';
}

/**
 * Create a new query string with updated parameters
 * 
 * @param params Current URLSearchParams or ReadonlyURLSearchParams
 * @param updates Record of parameters to update or remove (null/undefined to remove)
 * @returns String representation of the new query string (without leading ?)
 * 
 * @example
 * // Update filter and page params
 * const queryString = createQueryString(searchParams, { filter: 'newest', page: 2 });
 * router.push(`${pathname}?${queryString}`);
 * 
 * // Remove a parameter by setting it to null
 * const queryString = createQueryString(searchParams, { filter: null });
 * router.push(`${pathname}?${queryString}`);
 */
export function createQueryString(
  params: URLSearchParams | ReadonlyURLSearchParams,
  updates: Record<string, string | number | boolean | null | undefined>
): string {
  // Create a new URLSearchParams instance from current params
  const newParams = new URLSearchParams(params.toString());
  
  // Apply updates
  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      // Remove the parameter if value is null or undefined
      newParams.delete(key);
    } else {
      // Convert value to string and set parameter
      newParams.set(key, String(value));
    }
  });
  
  return newParams.toString();
}