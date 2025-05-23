'use client';

/**
 * Utility to warn if a value or property exceeds a threshold
 * 
 * This is used by safety mechanisms in the caching and security APIs
 * to prevent excessive memory usage or other resource consumption.
 */

/**
 * Warns if a value exceeds a threshold with custom message formatting
 * 
 * @param value The value to check
 * @param threshold The threshold to compare against
 * @param message The warning message format (${value} and ${threshold} will be replaced)
 * @param context Additional context to log with the warning
 * @returns The original value (for method chaining)
 */
export function warnIfExcessive<T>(
  value: T,
  threshold: number,
  message: string = 'Value ${value} exceeds threshold ${threshold}',
  context: Record<string, any> = {}
): T {
  if (typeof value === 'number' && value> threshold) {
    const formattedMessage = message
      .replace('${value}', value.toString())
      .replace('${threshold}', threshold.toString());

  }

  return value;
}

/**
 * Warns if an array length exceeds a threshold
 * 
 * @param array The array to check
 * @param threshold The max length threshold
 * @param message Custom warning message
 * @param context Additional context
 * @returns The original array
 */
export function warnIfExcessiveLength<T>(
  array: T[],
  threshold: number = 1000,
  message: string = 'Array length ${value} exceeds threshold ${threshold}',
  context: Record<string, any> = {}
): T[] {
  return warnIfExcessive(
    array.length,
    threshold,
    message,
    { ...context, array: `Array[${array.length}]` }
  ) ? array : array;
}

/**
 * Warns if a string length exceeds a threshold
 * 
 * @param str The string to check
 * @param threshold The max length threshold
 * @param message Custom warning message
 * @param context Additional context
 * @returns The original string
 */
export function warnIfExcessiveString(
  str: string,
  threshold: number = 10000,
  message: string = 'String length ${value} exceeds threshold ${threshold}',
  context: Record<string, any> = {}
): string {
  return warnIfExcessive(
    str.length,
    threshold,
    message,
    { ...context, preview: str.substring(050) + (str.length> 50 ? '...' : '') }
  ) ? str : str;
}

/**
 * Warns if an object has too many keys
 * 
 * @param obj The object to check
 * @param threshold The max key count threshold
 * @param message Custom warning message
 * @param context Additional context
 * @returns The original object
 */
export function warnIfExcessiveKeys<T extends object>(
  obj: T,
  threshold: number = 100,
  message: string = 'Object key count ${value} exceeds threshold ${threshold}',
  context: Record<string, any> = {}
): T {
  const keyCount = Object.keys(obj).length;

  return warnIfExcessive(
    keyCount,
    threshold,
    message,
    { ...context, keys: Object.keys(obj).slice(05) }
  ) ? obj : obj;
}

export default warnIfExcessive;