// src/utils/date-utils.ts
// Re-export date-related formatting functions from the centralized formatting module
// This file is maintained for backward compatibility

import { 
  formatDate,
  formatDateRelative,
  daysFromNow,
  formatCurrency
} from './formatting';

// Re-export the DateFormatOptions type directly
export type DateFormatOptions = {
  locale?: string;
  day?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'short' | 'long';
  year?: 'numeric' | '2-digit';
};

// Re-export for backward compatibility
export { 
  formatDate, 
  formatDateRelative,
  daysFromNow, 
  formatCurrency
};