/**
 * Utility functions for formatting data for display
 */

/**
 * Format a number as currency (EUR)
 * @param value - The number to format
 * @returns Formatted currency string
 */
export function formatCurrency(value: number | string): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return '€0';
  }

  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(numValue);
}

/**
 * Alias for formatCurrency for backward compatibility
 */
export const formatPrice = formatCurrency;

/**
 * Format a number as a percentage
 * @param value - The number to format (0.1 = 10%)
 * @param digits - Number of decimal places to show
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number | string, digits: number = 1): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return '0%';
  }

  return new Intl.NumberFormat('en-IE', {
    style: 'percent',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(numValue);
}

/**
 * Format a date as a readable string
 * @param dateStr - Date string or Date object
 * @param options - Format options
 * @returns Formatted date string
 */
export function formatDate(dateStr: string | Date, options?: Intl.DateTimeFormatOptions): string {
  if (!dateStr) return '';

  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;

  if (isNaN(date.getTime())) {
    return '';
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };

  return date.toLocaleDateString('en-IE', options || defaultOptions);
}

/**
 * Format a date as a relative time string (e.g., "2 days ago")
 * @param dateStr - Date string or Date object
 * @returns Relative time string
 */
export function formatRelativeTime(dateStr: string | Date): string {
  if (!dateStr) return '';

  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;

  if (isNaN(date.getTime())) {
    return '';
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);

  if (diffSecs <60) {
    return 'Just now';
  }

  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins <60) {
    return `${diffMins} minute${diffMins> 1 ? 's' : ''} ago`;
  }

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours <24) {
    return `${diffHours} hour${diffHours> 1 ? 's' : ''} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays <30) {
    return `${diffDays} day${diffDays> 1 ? 's' : ''} ago`;
  }

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths <12) {
    return `${diffMonths} month${diffMonths> 1 ? 's' : ''} ago`;
  }

  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears} year${diffYears> 1 ? 's' : ''} ago`;
}

/**
 * Format a number with thousands separators
 * @param value - The number to format
 * @returns Formatted number string
 */
export function formatNumber(value: number | string): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return '0';
  }

  return new Intl.NumberFormat('en-IE').format(numValue);
}

/**
 * Truncate a string to a maximum length and add ellipsis if needed
 * @param str - The string to truncate
 * @param maxLength - Maximum length before truncating
 * @returns Truncated string
 */
export function truncateString(str: string, maxLength: number = 100): string {
  if (!str || str.length <= maxLength) {
    return str || '';
  }

  return str.substring(0, maxLength) + '...';
}