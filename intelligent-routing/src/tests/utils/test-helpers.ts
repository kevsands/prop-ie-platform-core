import { waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { UserRole, UserStatus } from '@/types/core/user';

/**
 * Helper to wait for asynchronous operations
 */
export async function waitForAsync(ms = 0) {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, ms));
  });
}

/**
 * Helper to wait for all pending promises to resolve
 */
export async function waitForPromises() {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });
}

/**
 * Helper to wait for query to be in success state
 */
export async function waitForQuerySuccess() {
  await waitFor(
    () => {
      // This will complete when all promises are resolved
    },
    { timeout: 1000 }
  );
}

/**
 * Helper to create a mock user
 */
export function createMockUser(overrides = {}) {
  return {
    id: 'test-user-id',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    fullName: 'Test User',
    roles: [UserRole.BUYER],
    status: UserStatus.ACTIVE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Helper to create a mock document
 */
export function createMockDocument(overrides = {}) {
  return {
    id: 'test-document-id',
    name: 'Test Document',
    fileType: 'application/pdf',
    fileSize: 12345,
    downloadUrl: 'https://example.com/test-document.pdf',
    uploadedBy: {
      id: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com',
    },
    metadata: {
      category: 'test-category',
      tags: ['test', 'document'],
      description: 'Test document description',
      version: '1.0',
    },
    status: 'active',
    uploadedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    ...overrides,
  };
}

/**
 * Helper to create a mock project
 */
export function createMockProject(overrides = {}) {
  return {
    id: 'test-project-id',
    name: 'Test Project',
    status: 'active',
    completionPercentage: 25,
    location: 'Test Location',
    propertyCount: 10,
    lastUpdated: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Helper to create mock developer dashboard data
 */
export function createMockDeveloperDashboard(overrides = {}) {
  return {
    activeProjects: 5,
    propertiesAvailable: 25,
    totalSales: 15,
    projects: Array.from({ length: 3 }, (_, index) => createMockProject({
      id: `project-${index}`,
      name: `Project ${index}`,
      completionPercentage: 25 * (index + 1),
    })),
    salesTrend: {
      period: 'month',
      percentage: 15,
      direction: 'up',
    },
    ...overrides,
  };
}

/**
 * Helper to create mock document categories
 */
export function createMockDocumentCategories(count = 3, overrides = {}) {
  return Array.from({ length: count }, (_, index) => ({
    id: `category-${index}`,
    name: `Category ${index}`,
    description: `Description for category ${index}`,
    required: index < 2, // First two categories are required
    documentCount: index + 1,
    completionStatus: index === 0 ? 'complete' : index === 1 ? 'partial' : 'incomplete',
    ...overrides,
  }));
}

/**
 * Helper to create a jest spy on console methods
 */
export function spyOnConsole() {
  const errorSpy = jest.spyOn(console, 'error').mockImplementation();
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
  const logSpy = jest.spyOn(console, 'log').mockImplementation();
  
  return { error: errorSpy, warn: warnSpy, log: logSpy };
}

/**
 * Helper to restore console spies
 */
export function restoreConsole(spies: ReturnType<typeof spyOnConsole>) {
  spies.error.mockRestore();
  spies.warn.mockRestore();
  spies.log.mockRestore();
}

/**
 * Helper to mock fetch API
 */
export function mockFetch(response: any, status = 200) {
  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response)),
      headers: {
        get: () => 'application/json',
      },
    })
  );
  
  return global.fetch;
}

/**
 * Helper to restore fetch mock
 */
export function restoreFetch() {
  global.fetch.mockRestore();
}

/**
 * Helper function to mock local storage
 */
export function mockLocalStorage() {
  const store: Record<string, string> = {};
  
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        Object.keys(store).forEach(key => {
          delete store[key];
        });
      }),
      key: jest.fn((index: number) => Object.keys(store)[index] || null),
      length: jest.fn(() => Object.keys(store).length),
    },
    writable: true,
  });
  
  return window.localStorage;
}

/**
 * Helper to assert that a function was called with a subset of arguments
 */
export function expectCalledWithSubset(mockFn: jest.Mock, expectedArgs: Record<string, any>) {
  expect(mockFn).toBeCalled();
  
  const calls = mockFn.mock.calls;
  const lastCall = calls[calls.length - 1][0];
  
  Object.entries(expectedArgs).forEach(([key, value]) => {
    expect(lastCall[key]).toEqual(value);
  });
}

/**
 * Helper function to create array of mock items
 */
export function createMockArray<T>(factory: (index: number) => T, count: number): T[] {
  return Array.from({ length: count }, (_, index) => factory(index));
}