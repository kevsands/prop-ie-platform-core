/**
 * Jest setup file for GraphQL tests
 */

import '@testing-library/jest-dom';

// Mock the db module
jest.mock('@/lib/db', () => ({
  userDb: {
    getByEmail: jest.fn(),
    getById: jest.fn(),
    list: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  developmentDb: {
    getById: jest.fn(),
    getBySlug: jest.fn(),
    list: jest.fn(),
    create: jest.fn(),
    getDevelopmentStatistics: jest.fn(),
  },
  unitDb: {
    getById: jest.fn(),
    list: jest.fn(),
    create: jest.fn(),
  },
  documentDb: {
    getById: jest.fn(),
    list: jest.fn(),
    create: jest.fn(),
  },
  salesDb: {
    getById: jest.fn(),
    getByReferenceNumber: jest.fn(),
    list: jest.fn(),
    create: jest.fn(),
  },
}));

// Mock Amplify authentication
jest.mock('aws-amplify/auth', () => ({
  getCurrentUser: jest.fn(),
  fetchUserAttributes: jest.fn(),
}));

// Mock path and fs modules
jest.mock('path', () => ({
  join: jest.fn((_, ...args) => args.join('/')),
}));

// Set up global test environment
global.beforeEach(() => {
  jest.clearAllMocks();
});