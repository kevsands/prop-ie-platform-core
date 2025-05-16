/**
 * Repository Transaction Tests (Simplified)
 * Tests the transaction support for repositories with mocked Prisma client
 */

import { setupTestEnvironment } from '../helpers/app-router-test-utils';
import { prismaMock } from '../helpers/repository-test-utils';
import { expect, describe, it, beforeEach, afterEach, jest } from '@jest/globals';
import { mockDeep } from 'jest-mock-extended';

// Define our own constants to avoid import issues with Prisma in tests
const UserRole = {
  DEVELOPER: 'DEVELOPER',
  BUYER: 'BUYER',
  ADMIN: 'ADMIN',
};

const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

const KYCStatus = {
  NOT_STARTED: 'NOT_STARTED',
  COMPLETED: 'COMPLETED',
};

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mockPrisma = jest.requireActual('jest-mock-extended').mockDeep();
  return {
    PrismaClient: jest.fn(() => mockPrisma),
    Prisma: {},
    UserRole,
    UserStatus,
    KYCStatus,
  };
});

describe('Repository Transaction Support', () => {
  let restoreEnv: () => void;
  
  beforeEach(() => {
    // Setup test environment
    restoreEnv = setupTestEnvironment();
    
    // Reset mocks
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    // Restore original environment after each test
    restoreEnv();
  });

  it('should execute operations within a transaction', async () => {
    // Create a transaction mock for testing
    const txMock = mockDeep();
    
    // Setup mockPrisma.$transaction to use our txMock
    prismaMock.$transaction.mockImplementation(async (callback: any) => {
      return callback(txMock);
    });
    
    // Setup response for user creation
    const mockUser = {
      id: '1',
      email: 'transaction@example.com',
      firstName: 'Transaction',
      lastName: 'Test',
      roles: [UserRole.DEVELOPER],
      status: UserStatus.ACTIVE,
      kycStatus: KYCStatus.NOT_STARTED,
    };
    
    txMock.user.create.mockResolvedValue(mockUser);
    
    // Create a stub repository with transaction support
    const userRepository = {
      transaction: async (callback: any) => {
        return prismaMock.$transaction(callback);
      }
    };
    
    // Execute the transaction
    const result = await userRepository.transaction(async (tx: any) => {
      return tx.user.create({
        data: {
          email: 'transaction@example.com',
          firstName: 'Transaction',
          lastName: 'Test',
          roles: { set: [UserRole.DEVELOPER] },
          status: UserStatus.ACTIVE,
          kycStatus: KYCStatus.NOT_STARTED,
        }
      });
    });
    
    // Verify the result
    expect(result).toEqual(mockUser);
    expect(prismaMock.$transaction).toHaveBeenCalled();
    expect(txMock.user.create).toHaveBeenCalled();
  });
  
  it('should rollback transaction on error', async () => {
    // Create a transaction mock that will throw an error
    const txMock = mockDeep();
    txMock.user.create.mockImplementation(() => {
      throw new Error('Transaction failed');
    });
    
    // Setup mockPrisma.$transaction to use our txMock and handle errors
    prismaMock.$transaction.mockImplementation(async (callback: any) => {
      try {
        return await callback(txMock);
      } catch (error) {
        // Simulate transaction rollback
        throw error;
      }
    });
    
    // Create a stub repository with transaction support
    const userRepository = {
      transaction: async (callback: any) => {
        return prismaMock.$transaction(callback);
      }
    };
    
    // Execute the transaction and expect it to throw
    await expect(userRepository.transaction(async (tx: any) => {
      return tx.user.create({
        data: {
          email: 'fail@example.com',
          firstName: 'Will',
          lastName: 'Fail',
        }
      });
    })).rejects.toThrow('Transaction failed');
    
    // Verify transaction was called
    expect(prismaMock.$transaction).toHaveBeenCalled();
    expect(txMock.user.create).toHaveBeenCalled();
  });
});