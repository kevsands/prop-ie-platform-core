import { prismaMock } from '../mocks/prisma';
import { UserRepository } from '@/lib/db/repositories/user-repository';
import { DevelopmentRepository } from '@/lib/db/repositories/development-repository';
import { UnitRepository } from '@/lib/db/repositories/unit-repository';
import { DocumentRepository } from '@/lib/db/repositories/document-repository';
import { FinancialRepository } from '@/lib/db/repositories/financial-repository';
import { createTestContext } from './testContext';
import { UserRole, UserStatus } from '@/types/core/user';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

/**
 * MSW server for API mocking
 */
export const dataServer = setupServer();

/**
 * Setup integration test context with repositories
 */
export function setupIntegrationTestContext(userId = 'test-user', roles = [UserRole.DEVELOPER]) {
  const context = createTestContext(userIdroles);
  
  // Create repositories with mocked Prisma
  const repositories = {
    users: new UserRepository(prismaMock),
    developments: new DevelopmentRepository(prismaMock),
    units: new UnitRepository(prismaMock),
    documents: new DocumentRepository(prismaMock),
    financials: new FinancialRepository(prismaMock)};
  
  return {
    context,
    repositories,
    prismaMock};
}

/**
 * Helper to mock a Prisma repository call
 */
export function mockPrismaCall<T extends keyof typeof prismaMock, K extends keyof typeof prismaMock[T]>(
  model: T,
  method: K,
  mockImplementation: (...args: any[]) => any
) {
  const mockFunction = jest.fn(mockImplementation);
  
  if (typeof prismaMock[model][method] === 'function') {
    // @ts-ignore - This is a mock function
    prismaMock[model][method].mockImplementation(mockFunction);
  }
  
  return mockFunction;
}

/**
 * Helper to mock a repository method
 */
export function mockRepositoryMethod<T>(
  repository: { [key: string]: any },
  method: string,
  mockImplementation: (...args: any[]) => T
) {
  const originalMethod = repository[method];
  const mockFunction = jest.fn(mockImplementation);
  
  repository[method] = mockFunction;
  
  return {
    mock: mockFunction,
    restore: () => {
      repository[method] = originalMethod;
    };
}

/**
 * Mock data for repositories
 */
export function mockUserData(override = {}) {
  return {
    id: 'test-user-id',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    roles: [UserRole.BUYER],
    status: UserStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...override};
}

export function mockDevelopmentData(override = {}) {
  return {
    id: 'test-development-id',
    name: 'Test Development',
    description: 'A test development for integration testing',
    location: 'Test Location',
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'test-user-id',
    ...override};
}

export function mockUnitData(override = {}) {
  return {
    id: 'test-unit-id',
    name: 'Test Unit',
    unitNumber: 'A101',
    developmentId: 'test-development-id',
    status: 'AVAILABLE',
    price: 250000,
    bedrooms: 2,
    bathrooms: 1,
    floorArea: 85,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...override};
}

export function mockDocumentData(override = {}) {
  return {
    id: 'test-document-id',
    name: 'Test Document',
    fileUrl: 'https://example.com/test-document.pdf',
    fileType: 'application/pdf',
    fileSize: 12345,
    status: 'ACTIVE',
    uploadedBy: 'test-user-id',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...override};
}

export function mockFinancialData(override = {}) {
  return {
    id: 'test-financial-id',
    developmentId: 'test-development-id',
    totalBudget: 5000000,
    spentToDate: 2500000,
    projectedProfit: 1000000,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...override};
}

/**
 * Setup REST API mocks
 */
export function setupRestApiMocks() {
  // API route mocks for data layer testing
  dataServer.use(
    rest.get('/api/users/:id', (req: NextApiRequest, res: NextApiResponse, ctx: any) => {
      const { id } = req.params;
      return res(
        ctx.json({
          id,
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          roles: ['BUYER']})
      );
    }),
    
    rest.get('/api/developments', (req: NextApiRequest, res: NextApiResponse, ctx: any) => {
      return res(
        ctx.json({
          developments: [
            mockDevelopmentData(),
            mockDevelopmentData({ id: 'test-development-id-2', name: 'Test Development 2' })],
          totalCount: 2})
      );
    }),
    
    rest.get('/api/developments/:id', (req: NextApiRequest, res: NextApiResponse, ctx: any) => {
      const { id } = req.params;
      return res(
        ctx.json(mockDevelopmentData({ id }))
      );
    }),
    
    rest.get('/api/developments/:id/units', (req: NextApiRequest, res: NextApiResponse, ctx: any) => {
      const { id } = req.params;
      return res(
        ctx.json({
          units: [
            mockUnitData({ developmentId: id }),
            mockUnitData({ id: 'test-unit-id-2', unitNumber: 'A102', developmentId: id })],
          totalCount: 2})
      );
    }),
    
    rest.get('/api/documents', (req: NextApiRequest, res: NextApiResponse, ctx: any) => {
      return res(
        ctx.json({
          documents: [
            mockDocumentData(),
            mockDocumentData({ id: 'test-document-id-2', name: 'Test Document 2' })],
          totalCount: 2})
      );
    }),
    
    rest.post('/api/documents', (req: NextApiRequest, res: NextApiResponse, ctx: any) => {
      return res(
        ctx.json(mockDocumentData())
      );
    })
  );
  
  return dataServer;
}

/**
 * Clean up functions for data layer tests
 */
export function cleanupDataLayer() {
  jest.resetAllMocks();
  dataServer.resetHandlers();
}