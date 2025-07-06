/**
 * User Resolver Tests
 * 
 * This file contains tests for the user-related GraphQL resolvers.
 */

import { createTestServer, createAuthContext, createAdminContext } from './testServer';
import { ApolloServer } from '@apollo/server';
import { GraphQLContext } from '../server';

describe('User Resolvers', () => {
  let testServer: ApolloServer<GraphQLContext>;

  // Mock the userDb functions
  jest.mock('@/lib/db', () => ({
    userDb: {
      getByEmail: jest.fn((email) => {
        if (email === 'test@example.com') {
          return {
            id: 'test-user-id',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            roles: ['BUYER'],
            status: 'ACTIVE',
            kycStatus: 'NOT_STARTED',
            created: new Date(),
            lastActive: new Date(),
          };
        }
        return null;
      }),
      getById: jest.fn((id) => {
        if (id === 'test-user-id') {
          return {
            id: 'test-user-id',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            roles: ['BUYER'],
            status: 'ACTIVE',
            kycStatus: 'NOT_STARTED',
            created: new Date(),
            lastActive: new Date(),
          };
        }
        return null;
      }),
      list: jest.fn(() => ({
        users: [
          {
            id: 'test-user-id',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            roles: ['BUYER'],
            status: 'ACTIVE',
            kycStatus: 'NOT_STARTED',
            created: new Date(),
            lastActive: new Date(),
          },
        ],
        totalCount: 1,
      })),
      create: jest.fn((data) => ({
        id: 'new-user-id',
        ...data,
        created: new Date(),
        lastActive: new Date(),
      })),
      update: jest.fn((id, data) => ({
        id,
        email: 'test@example.com',
        firstName: 'Updated',
        lastName: 'User',
        ...data,
      })),
    },
  }));

  beforeEach(async () => {
    // Create a new test server for each test
    testServer = await createTestServer();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Query.me', () => {
    const ME_QUERY = `
      query {
        me {
          id
          email
          firstName
          lastName
          fullName
          roles
          status
        }
      }
    `;

    it('should return the current user when authenticated', async () => {
      // Create authenticated context
      const contextValue = createAuthContext('test-user-id', ['BUYER'], 'test@example.com');
      
      // Execute query
      const response = await testServer.executeOperation(
        { query: ME_QUERY },
        { contextValue }
      );
      
      // Check response
      expect(response.body.kind).toBe('single');
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data?.me).toEqual({
        id: 'test-user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        fullName: 'Test User',
        roles: ['BUYER'],
        status: 'ACTIVE',
      });
    });

    it('should return an authentication error when not authenticated', async () => {
      // Execute query
      const response = await testServer.executeOperation({ query: ME_QUERY });
      
      // Check response
      expect(response.body.kind).toBe('single');
      expect(response.body.singleResult.errors).toBeDefined();
      expect(response.body.singleResult.errors?.[0].extensions?.code).toBe('UNAUTHENTICATED');
    });
  });

  describe('Query.user', () => {
    const USER_QUERY = `
      query GetUser($id: ID!) {
        user(id: $id) {
          id
          email
          firstName
          lastName
          fullName
          roles
          status
        }
      }
    `;

    it('should return a user by ID for admin users', async () => {
      // Create admin context
      const contextValue = createAdminContext();
      
      // Execute query
      const response = await testServer.executeOperation(
        { 
          query: USER_QUERY,
          variables: { id: 'test-user-id' },
        },
        { contextValue }
      );
      
      // Check response
      expect(response.body.kind).toBe('single');
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data?.user).toEqual({
        id: 'test-user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        fullName: 'Test User',
        roles: ['BUYER'],
        status: 'ACTIVE',
      });
    });

    it('should return an authorization error for non-admin users', async () => {
      // Create non-admin context
      const contextValue = createAuthContext('test-user-id', ['BUYER']);
      
      // Execute query
      const response = await testServer.executeOperation(
        { 
          query: USER_QUERY,
          variables: { id: 'test-user-id' },
        },
        { contextValue }
      );
      
      // Check response
      expect(response.body.kind).toBe('single');
      expect(response.body.singleResult.errors).toBeDefined();
      expect(response.body.singleResult.errors?.[0].extensions?.code).toBe('FORBIDDEN');
    });
  });

  // Add more tests for other user-related resolvers
  // Such as:
  // - Query.users
  // - Query.searchUsers
  // - Mutation.createUser
  // - Mutation.updateUser
  // - Mutation.changeUserStatus
  // - Mutation.updateKYCStatus
});