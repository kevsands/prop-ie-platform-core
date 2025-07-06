// Re-export formatting functions from the centralized formatting module
// This file is maintained for backward compatibility

import {
  formatFileSize,
  formatDateRelative,
  formatCurrency,
  formatPercentage,
  truncateText,
  formatFileName,
  formatEnumValue
} from './formatting';

export {
  formatFileSize,
  formatDateRelative,
  formatCurrency,
  formatPercentage,
  truncateText,
  formatFileName,
  formatEnumValue
};