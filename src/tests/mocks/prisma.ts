import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

// Create a mock of the Prisma client
export const prismaMock = mockDeep<PrismaClient>() as unknown as DeepMockProxy<PrismaClient>
  );
// Reset all mocks between tests
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => prismaMock)}));

// Reset PrismaMock before each test
beforeEach(() => {
  mockReset(prismaMock);
});