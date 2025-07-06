import { prismaMock } from '../mocks/prisma';
import { UserRepository } from '../../lib/db/repositories/user-repository';
import { DevelopmentRepository } from '../../lib/db/repositories/development-repository';
import { UnitRepository } from '../../lib/db/repositories/unit-repository';
import { DocumentRepository } from '../../lib/db/repositories/document-repository';
import { FinancialRepository } from '../../lib/db/repositories/financial-repository';
import { GraphQLContext } from '../../lib/graphql/server';

// Define extended GraphQLContext for tests that includes repositories
export interface TestGraphQLContext extends GraphQLContext {
  prisma: any;
  repositories: {
    users: UserRepository;
    developments: DevelopmentRepository;
    units: UnitRepository;
    documents: DocumentRepository;
    financials: FinancialRepository;
  };
  auth: {
    isAuthenticated: boolean;
    userId: string | null;
    userRoles: string[];
    hasPermission: (resource: string, action: string) => boolean;
  };
  request: {
    headers: Record<string, string>;
    ip: string;
  };
}

// Create context with authenticated user
export function createTestContext(userId = '1', userRoles = ['USER']): TestGraphQLContext {
  return {
    prisma: prismaMock,
    repositories: {
      users: new UserRepository(prismaMock),
      developments: new DevelopmentRepository(prismaMock),
      units: new UnitRepository(prismaMock),
      documents: new DocumentRepository(prismaMock),
      financials: new FinancialRepository(prismaMock),
    },
    user: {
      id: userId,
      userId: userId,
      roles: userRoles,
      email: `user-${userId}@example.com`, // Add email field for tests
    },
    userRoles,
    isAuthenticated: true,
    auth: {
      isAuthenticated: true,
      userId,
      userRoles,
      hasPermission: (resource: string, action: string) => true, // Default to allowing access
    },
    request: {
      headers: {},
      ip: '127.0.0.1',
    },
  };
}

// Create context with unauthenticated user (for auth tests)
export function createUnauthenticatedContext(): TestGraphQLContext {
  return {
    prisma: prismaMock,
    repositories: {
      users: new UserRepository(prismaMock),
      developments: new DevelopmentRepository(prismaMock),
      units: new UnitRepository(prismaMock),
      documents: new DocumentRepository(prismaMock),
      financials: new FinancialRepository(prismaMock),
    },
    user: null,
    userRoles: [],
    isAuthenticated: false,
    auth: {
      isAuthenticated: false,
      userId: null,
      userRoles: [],
      hasPermission: () => false,
    },
    request: {
      headers: {},
      ip: '127.0.0.1',
    },
  };
}