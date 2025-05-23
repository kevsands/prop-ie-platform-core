
export const performanceConfig = {
  // Lazy loading thresholds
  lazyLoadThreshold: '50px',
  
  // Debounce delays
  searchDebounceDelay: 300,
  resizeDebounceDelay: 150,
  
  // Cache TTLs
  apiCacheTTL: 5 * 60 * 1000, // 5 minutes
  staticCacheTTL: 24 * 60 * 60 * 1000, // 24 hours
  
  // Batch sizes
  defaultBatchSize: 20,
  maxBatchSize: 100,
  
  // Performance marks
  marks: {
    appStart: 'app-start',
    firstPaint: 'first-paint',
    interactive: 'interactive'};
