/**
 * Formatting utility functions for finance and dashboard components
 */

/**
 * Format a currency value
 * @param value Number to format as currency
 * @param abbreviated Whether to abbreviate large numbers (K, M, B)
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, abbreviated: boolean = false): string {
  if (abbreviated) {
    if (Math.abs(value) >= 1_000_000_000) {
      return `€${(value / 1_000_000_000).toFixed(1)}B`;
    } else if (Math.abs(value) >= 1_000_000) {
      return `€${(value / 1_000_000).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1_000) {
      return `€${(value / 1_000).toFixed(1)}K`;
    }
    return value.toLocaleString('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  }
  
  return value.toLocaleString('en-IE', { style: 'currency', currency: 'EUR' });
}

/**
 * Format a percentage value
 * @param value Number to format as percentage 
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Calculate variance percentage between actual and budget
 * @param actual Actual amount
 * @param budget Budgeted amount
 * @returns Variance as a percentage
 */
export function calculateVariancePercentage(actual: number, budget: number): number {
  if (budget === 0) return 0;
  return ((actual - budget) / budget) * 100;
}

/**
 * Format a date string to a readable format
 * @param dateString ISO date string or timestamp
 * @returns Formatted date string (e.g. "Oct 15, 2023")
 */
export function formatDate(dateString: string | number): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : new Date(dateString);
  return date.toLocaleDateString('en-IE', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Format a timestamp to a relative time string
 * @param timestamp Timestamp in milliseconds
 * @returns Relative time string (e.g. "3 hours ago")
 */
export function formatTimeAgo(timestamp: number): string {
  const now = new Date().getTime();
  const diff = now - timestamp;
  
  // Convert to seconds
  const seconds = Math.floor(diff / 1000);
  
  // Less than a minute
  if (seconds < 60) {
    return 'just now';
  }
  
  // Less than an hour
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  // Less than a day
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  // Less than a week
  if (seconds < 604800) {
    const days = Math.floor(seconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
  
  // More than a week, format as date
  return formatDate(timestamp);
}

/**
 * Format a number with thousands separators
 * @param value Number to format
 * @returns Formatted number string
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('en-IE');
}

/**
 * Format a file size in bytes to a human-readable string
 * @param bytes File size in bytes
 * @returns Formatted file size string (e.g. "2.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Format a date range
 * @param startDate Start date string or timestamp
 * @param endDate End date string or timestamp
 * @returns Formatted date range string
 */
export function formatDateRange(startDate: string | number, endDate: string | number): string {
  const start = typeof startDate === 'string' ? new Date(startDate) : new Date(startDate);
  const end = typeof endDate === 'string' ? new Date(endDate) : new Date(endDate);
  
  const startFormatted = start.toLocaleDateString('en-IE', {
    month: 'short',
    day: 'numeric'
  });
  
  const endFormatted = end.toLocaleDateString('en-IE', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  return `${startFormatted} - ${endFormatted}`;
}