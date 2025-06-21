// Mock implementation of performance monitoring utilities
export const performanceMonitor = {
  startTiming: jest.fn(() => performance.now()),
  endTiming: jest.fn(() => performance.now()),
  recordComponentRenderTime: jest.fn(),
  recordUserJourneyStep: jest.fn(),
  recordApiCall: jest.fn(),
  getReport: jest.fn(() => ({
    componentRenderTimes: {},
    apiTimings: [],
    userJourneys: {}
  })),
  clearTimings: jest.fn(),
  addObserver: jest.fn(),
  recordCacheHit: jest.fn(),
  recordCacheMiss: jest.fn(),
  recordOperationTime: jest.fn(),
  startRenderTiming: jest.fn(() => -1),
  endRenderTiming: jest.fn(),
  getComponentTimings: jest.fn(() => []),
  recordMetric: jest.fn()
};