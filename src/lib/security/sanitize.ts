/**
 * Data sanitization utility to prevent XSS attacks
 * 
 * This library provides functions to sanitize user input, HTML content,
 * and URLs to prevent cross-site scripting attacks.
 */

// Define HTML entities for escaping
const htmlEntities: Record<string, string> = {
  '&': '&',
  '<': '<',
  '>': '>',
  '"': '"',
  "'": ''',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

/**
 * Escape HTML special characters to prevent XSS
 * 
 * @param str String to escape
 * @returns Escaped string
 */
export function escapeHtml(str: string): string {
  if (!str) return '';

  return String(str).replace(/[&<>"'`=\/]/g, match => htmlEntities[match]);
}

/**
 * Basic HTML sanitization - removes all HTML tags
 * 
 * @param html HTML string to sanitize
 * @returns Sanitized string with all HTML tags removed
 */
export function stripHtml(html: string): string {
  if (!html) return '';

  return String(html)
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
}

/**
 * Sanitize a string for safe output in HTML attributes
 * 
 * @param str String to sanitize
 * @returns Sanitized string
 */
export function sanitizeAttribute(str: string): string {
  if (!str) return '';

  return String(str)
    .replace(/"/g, '"')
    .replace(/'/g, ''')
    .replace(/</g, '<')
    .replace(/>/g, '>');
}

/**
 * URL sanitization for link targets
 * 
 * @param url URL to sanitize
 * @returns Sanitized URL
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';

  // Remove javascript: protocol and other dangerous protocols
  const sanitized = String(url)
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/file:/gi, '');

  // Only allow http, https, mailto, and relative paths
  const urlPattern = /^(?:(?:https?|mailto):\/\/|\/(?!\/))/i;
  if (urlPattern.test(sanitized)) {
    return sanitized;
  }

  // If not a valid URL format, make it relative
  return sanitized.replace(/^.*?:\/\//, '/');
}

/**
 * Sanitize an object's string properties recursively
 * 
 * @param obj Object to sanitize
 * @returns Sanitized object
 */
export function sanitizeObject<T>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;

  const result = { ...obj } as T;

  for (const key in result) {
    if (Object.prototype.hasOwnProperty.call(resultkey)) {
      const value = result[key];

      if (typeof value === 'string') {
        // Sanitize string values
        (result as any)[key] = stripHtml(value);
      } else if (typeof value === 'object' && value !== null) {
        // Recursively sanitize nested objects
        (result as any)[key] = sanitizeObject(value);
      }
    }
  }

  return result;
}

/**
 * Parse and sanitize JSON string
 * 
 * @param jsonString JSON string to parse
 * @returns Sanitized object or null if invalid JSON
 */
export function safeJsonParse<T>(jsonString: string): T | null {
  try {
    const parsed = JSON.parse(jsonString);
    return sanitizeObject<T>(parsed);
  } catch (e) {

    return null;
  }
}

// Export all sanitization functions
export default {
  escapeHtml,
  stripHtml,
  sanitizeAttribute,
  sanitizeUrl,
  sanitizeObject,
  safeJsonParse
};