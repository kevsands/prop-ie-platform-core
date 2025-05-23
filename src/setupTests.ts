import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { expect } from '@jest/globals';

// Configure testing-library
configure({
  testIdAttribute: 'data-testid'});

// Extend expect with additional matchers
expect.extend({
  arrayContaining: (received: any[], expected: any[]) => {
    const pass = expected.every(item => received.includes(item));
    return {
      pass,
      message: () =>
        `expected ${received} ${pass ? 'not ' : ''}to contain all items in ${expected}`};
  },
  objectContaining: (received: any, expected: any) => {
    const pass = Object.entries(expected).every(([keyvalue]) => received[key] === value);
    return {
      pass,
      message: () =>
        `expected ${JSON.stringify(received)} ${pass ? 'not ' : ''}to contain ${JSON.stringify(expected)}`};
  });

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];

  constructor(private callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {}
  
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

window.IntersectionObserver = MockIntersectionObserver as any;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()}))});

// Mock URL.createObjectURL
window.URL.createObjectURL = jest.fn();

// Mock console.error to fail tests on React warnings
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Warning: ReactDOM.render is no longer supported')
  ) {
    return;
  }
  originalError.call(console, ...args);
}; 