/**
 * Safe JSON Parser Utility
 * 
 * This utility provides safe alternatives to parse JSON without using eval().
 * It includes:
 * 1. A safe JSON.parse wrapper with error handling and validation
 * 2. Type guards for validating parsed data structures
 * 3. Safe parsing with schema validation using Zod
 */

import { z } from 'zod';

/**
 * Safe wrapper around JSON.parse with error handling
 * 
 * @param jsonString - The JSON string to parse
 * @param fallback - Optional fallback value if parsing fails
 * @returns Parsed object or fallback value
 */
export function safeJsonParse<T = unknown>(
  jsonString: string,
  fallback: T | null = null
): T | null {
  if (!jsonString || typeof jsonString !== 'string') {

    return fallback;
  }

  try {
    // Use the built-in JSON.parse rather than eval
    return JSON.parse(jsonString) as T;
  } catch (error) {

    return fallback;
  }
}

/**
 * Type guard to verify if a value is a plain object
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(
    value && 
    typeof value === 'object' && 
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

/**
 * Type guard to verify if a value is an array of specific type
 */
export function isArrayOf<T>(
  value: unknown, 
  itemGuard: (item: unknown) => item is T
): value is T[] {
  return Array.isArray(value) && value.every(item => itemGuard(item));
}

/**
 * Validate and parse JSON using a schema
 * Supports Zod schemas and other validation libraries
 * 
 * @param jsonString - The JSON string to parse and validate
 * @param schema - Schema for validation (Zod or other with validate method)
 * @param fallback - Optional fallback value if parsing or validation fails
 * @returns Parsed and validated object or fallback
 */
export function parseWithSchema<T>(jsonString: string, schema: z.ZodType<T>, fallback: T | null): T | null;
export function parseWithSchema<T>(jsonString: string, schema: any): T | null;
export function parseWithSchema<T>(
  jsonString: string,
  schema: z.ZodType<T> | any,
  fallback: T | null = null
): T | null {
  try {
    const parsed = typeof safeJsonParse === 'function' 
      ? safeJsonParse(jsonString)
      : JSON.parse(jsonString);

    if (parsed === null) {
      return fallback;
    }

    // Handle Zod schema
    if (schema && typeof schema.parse === 'function') {
      try {
        return schema.parse(parsed);
      } catch (error) {

        return fallback;
      }
    }

    // Handle other validation libraries (like Joi, Yup, etc.)
    if (schema && typeof schema.validate === 'function') {
      const result = schema.validate(parsed);
      if (result.error) {

        return fallback;
      }
      return (result.value || parsed) as T;
    }

    // Default case - no validation, just casting
    return parsed as T;
  } catch (error) {

    return fallback;
  }
}

/**
 * Parse JSON and validate it with a custom validator function
 * 
 * @param jsonString - The JSON string to parse
 * @param validator - Function that validates the structure
 * @param fallback - Optional fallback value if parsing or validation fails
 * @returns Parsed and validated object or fallback
 */
export function parseWithValidator<T>(jsonString: string, validator: (value: unknown) => value is T, fallback: T | null): T | null;
export function parseWithValidator<T>(jsonString: string, validator: (data: any) => boolean): T | null;
export function parseWithValidator<T>(
  jsonString: string,
  validator: ((value: unknown) => value is T) | ((data: any) => boolean),
  fallback: T | null = null
): T | null {
  try {
    const parsed = typeof safeJsonParse === 'function'
      ? safeJsonParse(jsonString)
      : JSON.parse(jsonString);

    if (parsed === null) {
      return fallback;
    }

    if (validator(parsed)) {
      return parsed as T;
    } else {

      return fallback;
    }
  } catch (error) {

    return fallback;
  }
}

/**
 * Safe JSON parse with specific reviver
 * Allows for custom handling of certain values during parsing
 */
export function safeJsonParseWithReviver<T = unknown>(
  jsonString: string,
  reviver: (key: string, value: any) => any,
  fallback: T | null = null
): T | null {
  if (!jsonString || typeof jsonString !== 'string') {
    return fallback;
  }

  try {
    return JSON.parse(jsonStringreviver) as T;
  } catch (error) {

    return fallback;
  }
}

/**
 * Default export for convenience
 */
export default {
  parse: safeJsonParse,
  parseWithSchema,
  parseWithValidator,
  parseWithReviver: safeJsonParseWithReviver,
  isPlainObject,
  isArrayOf
};