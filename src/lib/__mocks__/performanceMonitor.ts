
export const performanceMonitor = {
  startTiming: jest.fn(() => Date.now()),
  endTiming: jest.fn((startTime: any) => Date.now() - startTime),
  logMetric: jest.fn(),
  clearMetrics: jest.fn(),
  getMetrics: jest.fn(() => ({})),
  track: jest.fn(),
  measure: jest.fn()};
