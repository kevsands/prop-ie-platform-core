import { ApolloServer } from '@apollo/server';
import { GraphQLContext } from '@/lib/graphql/server';
import { createTestContext, createUnauthenticatedContext } from '../utils/testContext';
import { prismaMock } from '../mocks/prisma';
import { UserRole, UserStatus } from '@/types/core/user';
import { authDirectiveTransformer } from '@/lib/graphql/directives/auth';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { loadFiles } from '@graphql-tools/load-files';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import path from 'path';
import { GraphQLError } from 'graphql';

// Mock the GraphQL schema and resolvers
const typeDefs = `
  directive @auth(requires: [Role] = []) on FIELD_DEFINITION

  enum Role {
    ADMIN
    DEVELOPER
    BUYER
    AGENT
  }

  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    fullName: String!
    roles: [Role!]!
    status: String!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  type UsersResponse {
    users: [User!]!
    totalCount: Int!
    pageInfo: PageInfo!
  }

  type Query {
    me: User @auth
    user(id: ID!): User @auth(requires: [ADMIN])
    users: UsersResponse @auth(requires: [ADMIN, DEVELOPER])
  }

  type Mutation {
    createUser(email: String!, firstName: String!, lastName: String!, roles: [Role!]!): User @auth(requires: [ADMIN])
    updateUser(id: ID!, firstName: String, lastName: String): User @auth
  }
`;

// Mock resolvers
const resolvers = {
  Query: {
    me: (_: any, __: any, context: GraphQLContext) => {
      return {
        id: context.user?.userId,
        email: context.user?.email,
        firstName: 'Test',
        lastName: 'User',
        fullName: 'Test User',
        roles: context.userRoles,
        status: UserStatus.ACTIVE
      };
    },
    user: (_: any, { id }: { id: string }, context: GraphQLContext) => {
      // This should be protected by @auth directive
      return {
        id,
        email: 'user@example.com',
        firstName: 'Test',
        lastName: 'User',
        fullName: 'Test User',
        roles: [UserRole.BUYER],
        status: UserStatus.ACTIVE
      };
    },
    users: () => ({
      users: [
        {
          id: '1',
          email: 'user1@example.com',
          firstName: 'User',
          lastName: 'One',
          fullName: 'User One',
          roles: [UserRole.BUYER],
          status: UserStatus.ACTIVE
        },
        {
          id: '2',
          email: 'user2@example.com',
          firstName: 'User',
          lastName: 'Two',
          fullName: 'User Two',
          roles: [UserRole.DEVELOPER],
          status: UserStatus.ACTIVE
        }
      ],
      totalCount: 2,
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null
      }
    })
  },
  Mutation: {
    createUser: (_: any, args: any) => {
      return {
        id: 'new-user',
        email: args.email,
        firstName: args.firstName,
        lastName: args.lastName,
        fullName: `${args.firstName} ${args.lastName}`,
        roles: args.roles,
        status: UserStatus.PENDING
      };
    },
    updateUser: (_: any, args: any, context: GraphQLContext) => {
      // Check if user is updating their own profile or is admin
      if (args.id !== context.user?.userId && !context.userRoles.includes(UserRole.ADMIN)) {
        throw new GraphQLError('You can only update your own profile unless you are an admin', {
          extensions: { code: 'FORBIDDEN' }
        });
      }
      
      return {
        id: args.id,
        email: 'user@example.com',
        firstName: args.firstName || 'Test',
        lastName: args.lastName || 'User',
        fullName: `${args.firstName || 'Test'} ${args.lastName || 'User'}`,
        roles: [UserRole.BUYER],
        status: UserStatus.ACTIVE
      };
    }
  }
};

// Create test server with schema applying auth directive
async function createTestServer(context?: any) {
  // Create executable schema with auth directive
  let schema = makeExecutableSchema({
    typeDefs,
    resolvers
  });
  
  // Apply the auth directive transformer
  schema = authDirectiveTransformer()(schema);
  
  // Create server with schema
  const server = new ApolloServer({
    schema,
  });
  
  return server;
}

describe('GraphQL Server Integration', () => {
  describe('Authentication and Authorization', () => {
    let server: ApolloServer;
    
    beforeAll(async () => {
      server = await createTestServer();
    });
    
    test('Authenticated user can access @auth protected queries', async () => {
      // Create authenticated context
      const contextValue = createTestContext('user-1', [UserRole.BUYER]);
      
      // Execute query
      const response = await server.executeOperation(
        {
          query: `
            query {
              me {
                id
                email
                fullName
                roles
              }
            }
          `
        },
        { contextValue }
      );
      
      // Check response - use type assertion to handle Apollo Server response type
      expect(response.body.kind).toBe('single');
      const result = response.body.kind === 'single' ? response.body.singleResult : null;
      expect(result?.errors).toBeUndefined();
      expect(result?.data?.me).toEqual({
        id: 'user-1',
        email: 'user-user-1@example.com',
        fullName: 'Test User',
        roles: [UserRole.BUYER]
      });
    });
    
    test('Unauthenticated user cannot access @auth protected queries', async () => {
      // Create unauthenticated context
      const contextValue = createUnauthenticatedContext();
      
      // Execute query
      const response = await server.executeOperation(
        {
          query: `
            query {
              me {
                id
                email
                fullName
              }
            }
          `
        },
        { contextValue }
      );
      
      // Check response - should have error
      expect(response.body.kind).toBe('single');
      const result = response.body.kind === 'single' ? response.body.singleResult : null;
      expect(result?.errors).toBeDefined();
      expect(result?.errors?.[0].extensions?.code).toBe('UNAUTHENTICATED');
    });
    
    test('ADMIN user can access role-protected queries', async () => {
      // Create admin context
      const contextValue = createTestContext('admin-user', [UserRole.ADMIN]);
      
      // Execute query
      const response = await server.executeOperation(
        {
          query: `
            query GetUser($id: ID!) {
              user(id: $id) {
                id
                email
                fullName
                roles
              }
            }
          `,
          variables: { id: 'test-user' }
        },
        { contextValue }
      );
      
      // Check response
      expect(response.body.kind).toBe('single');
      const result = response.body.kind === 'single' ? response.body.singleResult : null;
      expect(result?.errors).toBeUndefined();
      expect(result?.data?.user).toMatchObject({
        id: 'test-user',
        fullName: 'Test User'
      });
    });
    
    test('Non-ADMIN user cannot access ADMIN-only queries', async () => {
      // Create buyer context
      const contextValue = createTestContext('buyer-user', [UserRole.BUYER]);
      
      // Execute query
      const response = await server.executeOperation(
        {
          query: `
            query GetUser($id: ID!) {
              user(id: $id) {
                id
                email
                fullName
              }
            }
          `,
          variables: { id: 'test-user' }
        },
        { contextValue }
      );
      
      // Check response - should have error
      expect(response.body.kind).toBe('single');
      const result = response.body.kind === 'single' ? response.body.singleResult : null;
      expect(result?.errors).toBeDefined();
      expect(result?.errors?.[0].extensions?.code).toBe('FORBIDDEN');
    });
    
    test('Users with multiple roles receive access correctly', async () => {
      // Create context with multiple roles
      const contextValue = createTestContext('developer-user', [UserRole.DEVELOPER, UserRole.BUYER]);
      
      // Execute query (users endpoint requires ADMIN or DEVELOPER)
      const response = await server.executeOperation(
        {
          query: `
            query {
              users {
                users {
                  id
                  email
                  fullName
                }
                totalCount
              }
            }
          `
        },
        { contextValue }
      );
      
      // Check response - should be accessible
      expect(response.body.kind).toBe('single');
      const result = response.body.kind === 'single' ? response.body.singleResult : null;
      expect(result?.errors).toBeUndefined();
      expect(result?.data?.users).toMatchObject({
        users: expect.any(Array),
        totalCount: 2
      });
    });
  });
  
  describe('Resolver Business Logic', () => {
    let server: ApolloServer;
    
    beforeAll(async () => {
      server = await createTestServer();
    });
    
    test('User can update their own profile', async () => {
      // Create user context
      const contextValue = createTestContext('user-1', [UserRole.BUYER]);
      
      // Execute mutation to update own profile
      const response = await server.executeOperation(
        {
          query: `
            mutation UpdateUser($id: ID!, $firstName: String, $lastName: String) {
              updateUser(id: $id, firstName: $firstName, lastName: $lastName) {
                id
                fullName
              }
            }
          `,
          variables: { 
            id: 'user-1',
            firstName: 'Updated',
            lastName: 'Name'
          }
        },
        { contextValue }
      );
      
      // Check response
      expect(response.body.kind).toBe('single');
      const result = response.body.kind === 'single' ? response.body.singleResult : null;
      expect(result?.errors).toBeUndefined();
      expect(result?.data?.updateUser).toEqual({
        id: 'user-1',
        fullName: 'Updated Name'
      });
    });
    
    test('User cannot update another user\'s profile unless admin', async () => {
      // Create user context (not admin)
      const contextValue = createTestContext('user-1', [UserRole.BUYER]);
      
      // Execute mutation to update another user's profile
      const response = await server.executeOperation(
        {
          query: `
            mutation UpdateUser($id: ID!, $firstName: String, $lastName: String) {
              updateUser(id: $id, firstName: $firstName, lastName: $lastName) {
                id
                fullName
              }
            }
          `,
          variables: { 
            id: 'another-user',
            firstName: 'Updated',
            lastName: 'Name'
          }
        },
        { contextValue }
      );
      
      // Check response - should have error
      expect(response.body.kind).toBe('single');
      const result = response.body.kind === 'single' ? response.body.singleResult : null;
      expect(result?.errors).toBeDefined();
      expect(result?.errors?.[0].message).toContain('You can only update your own profile');
    });
    
    test('Admin can create new users', async () => {
      // Create admin context
      const contextValue = createTestContext('admin-user', [UserRole.ADMIN]);
      
      // Execute mutation to create user
      const response = await server.executeOperation(
        {
          query: `
            mutation CreateUser($email: String!, $firstName: String!, $lastName: String!, $roles: [Role!]!) {
              createUser(email: $email, firstName: $firstName, lastName: $lastName, roles: $roles) {
                id
                email
                fullName
                roles
                status
              }
            }
          `,
          variables: { 
            email: 'new@example.com',
            firstName: 'New',
            lastName: 'User',
            roles: [UserRole.BUYER]
          }
        },
        { contextValue }
      );
      
      // Check response
      expect(response.body.kind).toBe('single');
      const result = response.body.kind === 'single' ? response.body.singleResult : null;
      expect(result?.errors).toBeUndefined();
      expect(result?.data?.createUser).toMatchObject({
        email: 'new@example.com',
        fullName: 'New User',
        roles: [UserRole.BUYER],
        status: UserStatus.PENDING
      });
    });
  });
});