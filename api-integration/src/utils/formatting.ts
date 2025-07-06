/**
 * Formatting Utilities
 * 
 * A comprehensive set of formatting utilities for dates, currency, and other data types.
 * This module consolidates formatting functions previously spread across multiple files.
 */

// ===== Date Formatting =====

/**
 * Format options for the date formatter
 */
export type DateFormatOptions = {
  locale?: string;
  day?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'short' | 'long';
  year?: 'numeric' | '2-digit';
};

/**
 * Formats a date using the specified locale and format options
 * @param date The date to format (Date object or string)
 * @param options Optional formatting options
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number,
  options: DateFormatOptions = {}
): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    console.warn(`Invalid date provided to formatDate: ${date}`);
    return 'Invalid date';
  }
  
  const { 
    locale = 'en-IE', 
    day = 'numeric', 
    month = 'short', 
    year = 'numeric' 
  } = options;
  
  return dateObj.toLocaleDateString(locale, { day, month, year });
}

/**
 * Calculate days from now to the given date
 * @param date The target date (Date object or string)
 * @returns Number of days from now (positive if in future, negative if in past)
 */
export function daysFromNow(date: Date | string | number): number {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    console.warn(`Invalid date provided to daysFromNow: ${date}`);
    return 0;
  }
  
  const now = new Date();
  const diffTime = dateObj.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format a date string to a relative time string (e.g. "2 days ago")
 */
export function formatDateRelative(dateString: string | Date): string {
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  
  if (isNaN(date.getTime())) {
    console.warn(`Invalid date provided to formatDateRelative: ${dateString}`);
    return 'Invalid date';
  }
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // Less than a minute
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  // Less than an hour
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  // Less than a day
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  // Less than a week
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
  
  // Less than a month
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  }
  
  // Format as date
  return date.toLocaleDateString('en-IE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// ===== Currency and Number Formatting =====

/**
 * Format a currency amount
 * @param amount The amount to format
 * @param currency The currency code (default: EUR)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  if (amount === null || amount === undefined) {
    return 'N/A';
  }
  
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format a percentage value
 * @param value The percentage value
 * @param decimalPlaces Number of decimal places to include
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimalPlaces: number = 1): string {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  
  return `${value.toFixed(decimalPlaces)}%`;
}

/**
 * Format a file size in bytes to a human-readable string
 * @param bytes Size in bytes
 * @returns Formatted size string (e.g., "2.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0 || bytes === null || bytes === undefined) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ===== Text Formatting =====

/**
 * Truncate text to a specified length and add ellipsis
 * @param text The text to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Format a file name with fallback for empty values
 * @param fileName The file name to format
 * @returns Formatted file name
 */
export function formatFileName(fileName: string): string {
  if (!fileName) return 'Unnamed file';
  
  // Extract just the filename without path
  const nameParts = fileName.split(/[\/\\]/);
  return nameParts[nameParts.length - 1];
}

/**
 * Format an enum-like string to a human-readable form
 * @param value The enum value (e.g. SNAKE_CASE or camelCase)
 * @returns Formatted string (e.g. "Snake Case" or "Camel Case")
 */
export function formatEnumValue(value: string): string {
  if (!value) return '';
  
  // Handle snake_case and SNAKE_CASE
  if (value.includes('_')) {
    return value
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // Handle camelCase
  return value
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

// Export for backward compatibility
export { formatDate as formatDateString };
export { daysFromNow as calculateDaysFromNow };