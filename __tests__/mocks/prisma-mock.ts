/**
 * prisma-mock.ts
 * Enhanced mock implementation of the Prisma client for testing
 */
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

// Create a deep mock of the Prisma client
export const prismaMock = mockDeep<PrismaClient>() as unknown as DeepMockProxy<PrismaClient>;

// Reset all mocks between tests
beforeEach(() => {
  mockReset(prismaMock);
  
  // Setup transaction mock by default
  prismaMock.$transaction.mockImplementation(async (callback) => {
    // Create transaction context that mimics the structure of prismaMock
    const txContext = mockDeep<PrismaClient>();
    
    // Execute callback with transaction context
    return callback(txContext);
  });
});

// Mock the PrismaClient in the @prisma/client module if needed
// This is commented out because we generally handle this in individual test files
/*
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => prismaMock),
}));
*/

/**
 * Create a mocked repository context with transaction support
 * @returns Mocked Prisma client with transaction support
 */
export function createMockRepositoryContext() {
  return {
    prisma: prismaMock,
    transaction: async <T>(callback: (tx: PrismaClient) => Promise<T>): Promise<T> => {
      return prismaMock.$transaction(callback);
    }
  };
}

/**
 * Setup transaction mock for testing repository transaction operations
 * This configures the transaction to work with repository pattern testing
 * @param setupCallback Optional callback to configure mock responses for transaction context
 */
export function setupTransactionMock(
  setupCallback?: (txMock: DeepMockProxy<PrismaClient>) => void
) {
  // Replace the transaction implementation
  prismaMock.$transaction.mockImplementation(async (callback) => {
    // Create a fresh transaction context for this test
    const txMock = mockDeep<PrismaClient>();
    
    // Allow test to configure mock responses for transaction
    if (setupCallback) {
      setupCallback(txMock);
    }
    
    // Execute the callback with our configured transaction context
    return callback(txMock);
  });
}

/**
 * Setup error in transaction for testing rollback scenarios
 * @param errorPoint The repository method that should throw (e.g., "user.create")
 * @param errorMessage The error message to throw
 */
export function setupTransactionError(
  errorPoint: string,
  errorMessage: string = 'Transaction error'
) {
  setupTransactionMock(txMock => {
    const [model, method] = errorPoint.split('.');
    
    if (model && method) {
      // Get the model object
      const modelObj = (txMock as any)[model];
      
      // Make the method throw an error
      if (modelObj && typeof modelObj[method] === 'function') {
        modelObj[method].mockImplementation(() => {
          throw new Error(errorMessage);
        });
      }
    }
  });
}

export default prismaMock;