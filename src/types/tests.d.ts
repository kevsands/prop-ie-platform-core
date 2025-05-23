/**
 * Type definitions specifically for testing
 * This file consolidates testing-related types and avoids duplication
 */

// Re-export test types to make them available in a single import
import type { 
  MockUnitsService,
  MockUserService,
  MockRepository,
  MockDatabaseClient,
  MockDatabasePool,
  MockPrismaClient
} from './test-mocks';

import type {
  TestSignInResult,
  TestSignUpResult,
  TestAuthUser,
  StorageMock
} from './amplify/auth-test';

export {
  // Test mock services
  MockUnitsService,
  MockUserService,
  MockRepository,
  MockDatabaseClient,
  MockDatabasePool,
  MockPrismaClient,
  
  // Auth test types
  TestSignInResult,
  TestSignUpResult,
  TestAuthUser,
  StorageMock
};

// Additional test utility types
export interface TestEnvironment {
  NODE_ENV: string;
  DATABASE_URL: string;
  API_URL: string;
  AUTH_URL: string;
  AWS_REGION: string;
}

export interface TestSetupResult {
  restore: () => void;
}

// Test helper function types
export type SetupTestEnvironment = () => () => void;
export type MockConsole = Record<'log' | 'error' | 'warn' | 'info', jest.SpyInstance>\n  );
export type MockNetwork = () => {
  restore: () => void;
  simulateOffline: () => void;
  simulateOnline: () => void;
};