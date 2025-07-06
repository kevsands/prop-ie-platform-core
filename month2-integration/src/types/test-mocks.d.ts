/**
 * Type definitions for mock services used in testing
 */

import { ApiResponse, UnitData, UnitUpdateData, UserData, UserUpdateData } from './api-test';

// Mock Units Service
export interface MockUnitsService {
  listUnits: jest.Mock;
  getUnitById: jest.Mock;
  getUnitsByDevelopment: jest.Mock;
  createUnit: jest.Mock;
  updateUnit: jest.Mock;
  deleteUnit: jest.Mock;
  updateUnitStatus: jest.Mock;
  searchUnits: jest.Mock;
}

// Mock User Service
export interface MockUserService {
  listUsers: jest.Mock;
  getUserById: jest.Mock;
  getUserByEmail: jest.Mock;
  createUser: jest.Mock;
  updateUser: jest.Mock;
  deleteUser: jest.Mock;
  changePassword: jest.Mock;
  updateUserRole: jest.Mock;
  updateUserStatus: jest.Mock;
}

// Mock Repository types
export interface MockRepository<T> {
  findAll: jest.Mock<Promise<T[]>>;
  findById: jest.Mock<Promise<T | null>>;
  create: jest.Mock<Promise<T>>;
  update: jest.Mock<Promise<T>>;
  delete: jest.Mock<Promise<boolean>>;
  findByFilter: jest.Mock<Promise<T[]>>;
}

// Mock API response types
export interface MockApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
  message?: string;
}

// Mock database client
export interface MockDatabaseClient {
  query: jest.Mock;
  release: jest.Mock;
}

// Mock database pool
export interface MockDatabasePool {
  query: jest.Mock;
  connect: jest.Mock<Promise<MockDatabaseClient>>;
  on: jest.Mock;
  end: jest.Mock;
}

// Mock PrismaClient
export interface MockPrismaClient {
  $connect: jest.Mock;
  $disconnect: jest.Mock;
  user: {
    findUnique: jest.Mock;
    findMany: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete?: jest.Mock;
  };
  development: {
    findUnique: jest.Mock;
    findMany: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete?: jest.Mock;
  };
  unit?: {
    findUnique: jest.Mock;
    findMany: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete?: jest.Mock;
  };
  document?: {
    findUnique: jest.Mock;
    findMany: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete?: jest.Mock;
  };
  [key: string]: any;
}