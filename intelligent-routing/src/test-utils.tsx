import React from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { expect } from '@jest/globals';
import type { PrismaClient } from '@prisma/client';
import type { NextRequest, NextResponse } from 'next/server';

// Create a custom render function that includes providers
function render(
  ui: React.ReactElement,
  {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { render };

// Mock data generators
export const generateTestData = <T extends Record<string, any>>(
  template: T,
  count: number
): T[] => {
  return Array.from({ length: count }, (_, index) => ({
    ...template,
    id: `test-${index}`,
  }));
};

// Mock function helpers
export const mockFunction = <T extends (...args: any[]) => any>(
  implementation?: T
) => {
  return jest.fn(implementation);
};

// Wait for element to be removed from DOM
export const waitForElementToBeRemoved = async (
  element: HTMLElement,
  timeout = 1000
) => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (!document.body.contains(element)) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  throw new Error(`Element was not removed within ${timeout}ms`);
};

// Mock IntersectionObserver entries
export const mockIntersectionObserver = (
  entries: IntersectionObserverEntry[]
) => {
  const mockCallback = jest.fn();
  const mockObserver = new IntersectionObserver(mockCallback);
  
  // Simulate intersection change
  mockCallback(entries);
  
  return {
    callback: mockCallback,
    observer: mockObserver,
  };
};

// Mock ResizeObserver entries
export const mockResizeObserver = (entries: ResizeObserverEntry[]) => {
  const mockCallback = jest.fn();
  const mockObserver = new ResizeObserver(mockCallback);
  
  // Simulate resize
  mockCallback(entries);
  
  return {
    callback: mockCallback,
    observer: mockObserver,
  };
};

// Mock window.matchMedia
export const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

// Mock URL.createObjectURL
export const mockCreateObjectURL = (url: string) => {
  window.URL.createObjectURL = jest.fn().mockReturnValue(url);
};

// Mock console methods
export const mockConsole = {
  error: jest.spyOn(console, 'error').mockImplementation(),
  warn: jest.spyOn(console, 'warn').mockImplementation(),
  log: jest.spyOn(console, 'log').mockImplementation(),
};

// Clean up mocks
export const cleanupMocks = () => {
  jest.clearAllMocks();
  mockConsole.error.mockRestore();
  mockConsole.warn.mockRestore();
  mockConsole.log.mockRestore();
};

// Extend expect with additional matchers
expect.extend({
  arrayContaining: (received: any[], expected: any[]) => {
    const pass = expected.every(item => received.includes(item));
    return {
      pass,
      message: () =>
        `expected ${received} ${pass ? 'not ' : ''}to contain all items in ${expected}`,
    };
  },
  objectContaining: (received: any, expected: any) => {
    const pass = Object.entries(expected).every(([key, value]) => received[key] === value);
    return {
      pass,
      message: () =>
        `expected ${JSON.stringify(received)} ${pass ? 'not ' : ''}to contain ${JSON.stringify(expected)}`,
    };
  },
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
    dispatchEvent: jest.fn(),
  })),
});

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