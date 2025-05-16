/**
 * repository-test-utils.ts
 * Utilities for testing repositories with transaction support
 */

import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { expect } from '@jest/globals';

// Create a deep mock of the Prisma client for testing
export const prismaMock = mockDeep<PrismaClient>();

// Reset mocks before each test
beforeEach(() => {
  mockReset(prismaMock);
  
  // Setup transaction mock implementation with proper type handling
  prismaMock.$transaction.mockImplementation(<T>(callback: ((prisma: PrismaClient) => Promise<T>) | Promise<T>[]) => {
    if (typeof callback === 'function') {
      const txMock = mockDeep<PrismaClient>();
      return callback(txMock) as Promise<T>;
    }
    throw new Error('Array-style transactions are not supported in this test utility');
  });
});

/**
 * Transaction test context with Prisma client
 */
export interface TransactionTestContext {
  tx: DeepMockProxy<PrismaClient>;
}

/**
 * Helper function to test repository operations within a transaction
 * @param testFn Test function that receives transaction context
 * @returns Promise that resolves when the test completes
 */
export async function testWithTransaction<T = void>(
  testFn: (context: TransactionTestContext) => Promise<T>
): Promise<T> {
  // Create a transaction mock
  const txMock = mockDeep<PrismaClient>();
  
  // Setup the transaction mock implementation with proper typing
  prismaMock.$transaction.mockImplementation(<R>(cb: ((prisma: PrismaClient) => Promise<R>) | Promise<R>[]) => {
    if (typeof cb === 'function') {
      return cb(txMock) as Promise<R>;
    }
    throw new Error('Array-style transactions are not supported in this test utility');
  });
  
  // Create transaction context
  const txContext: TransactionTestContext = {
    tx: txMock,
  };
  
  // Execute transaction callback with context
  return prismaMock.$transaction(async () => {
    // Run the test function with the transaction context
    return testFn(txContext);
  });
}

// Type-safe approach for accessing Prisma models
type PrismaModelName = keyof Omit<PrismaClient, 
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends' | 
  '$executeRaw' | '$executeRawUnsafe' | '$queryRaw' | '$queryRawUnsafe'
>;

// Format for error point string with type checking
type ErrorPointString = `${string & PrismaModelName}.${string}`;

/**
 * Helper for testing error handling in transactions
 * Automatically configures the transaction to fail at the specified point
 * @param errorPoint Repository method that should throw an error (format: "model.method")
 * @param errorMessage Optional error message
 * @param testFn Test function that receives transaction context
 */
export async function testTransactionRollback(
  errorPoint: string,
  errorMessage: string = 'Transaction error',
  testFn: (context: TransactionTestContext) => Promise<void>
): Promise<void> {
  // Create a transaction mock
  const txMock = mockDeep<PrismaClient>();
  
  // Inject error at the specified point
  // Example: "user.create" -> txMock.user.create should throw
  const [model, method] = errorPoint.split('.');
  
  if (model && method) {
    // Type-safe way to get the model object when possible
    // For unknown models, fall back to any casting
    const modelObj = model in txMock 
      ? (txMock as Record<string, any>)[model] 
      : undefined;
    
    // Make the method throw an error
    if (modelObj && typeof modelObj[method] === 'function') {
      modelObj[method].mockImplementation(() => {
        throw new Error(errorMessage);
      });
    }
  }
  
  // Setup the transaction mock implementation
  prismaMock.$transaction.mockImplementation(<R>(cb: ((prisma: PrismaClient) => Promise<R>) | Promise<R>[]) => {
    if (typeof cb === 'function') {
      return cb(txMock).catch(err => {
        // Simulate transaction rollback on error
        throw err;
      }) as Promise<R>;
    }
    throw new Error('Array-style transactions are not supported in this test utility');
  });
  
  // Create transaction context
  const txContext: TransactionTestContext = {
    tx: txMock,
  };
  
  // Execute transaction and expect it to throw
  await expect(prismaMock.$transaction(async () => {
    // Run the test function with the transaction context
    await testFn(txContext);
  })).rejects.toThrow(errorMessage);
}

// Mock PrismaClient with a factory function
export function mockPrismaClient(): DeepMockProxy<PrismaClient> {
  return prismaMock;
}

// Export default for backward compatibility
export default {
  prismaMock,
  testWithTransaction,
  testTransactionRollback,
  mockPrismaClient
};