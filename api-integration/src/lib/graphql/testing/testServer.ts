/**
 * GraphQL Testing Server
 * 
 * This file provides a test server for GraphQL operations
 * that can be used in automated tests.
 */

import { ApolloServer } from '@apollo/server';
import { ApolloServerOptions } from '@apollo/server/dist/externalTypes/apollo-server-core';
import { loadFiles } from '@graphql-tools/load-files';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import path from 'path';
import { GraphQLSchema } from 'graphql';
import { authDirectiveTransformer } from '../directives/auth';
import { GraphQLContext } from '../server';

/**
 * Create a testing Apollo Server instance
 * @param contextValue Custom context value for testing
 * @returns Apollo Server instance configured for testing
 */
export async function createTestServer(contextValue?: Partial<GraphQLContext>) {
  // Load schema and resolvers
  const schemaPath = path.join(process.cwd(), 'src/lib/graphql/schemas');
  const resolversPath = path.join(process.cwd(), 'src/lib/graphql/resolvers');
  
  const typesArray = await loadFiles(schemaPath, {
    extensions: ['graphql', 'gql'],
  });
  
  const resolversArray = await loadFiles(resolversPath, {
    extensions: ['js', 'ts'],
    ignoreIndex: true,
  });
  
  // Merge schemas and resolvers
  const typeDefs = mergeTypeDefs(typesArray);
  const resolvers = mergeResolvers(resolversArray);
  
  // Create executable schema
  let schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  
  // Apply the auth directive transformer
  schema = authDirectiveTransformer()(schema);
  
  // Default test context
  const defaultContext: GraphQLContext = {
    user: null,
    userRoles: [],
    isAuthenticated: false,
  };
  
  // Create Apollo Server
  const server = new ApolloServer<GraphQLContext>({
    schema,
    includeStacktraceInErrorResponses: true,
  });
  
  // Add context function
  const originalExecuteOperation = server.executeOperation.bind(server);
  server.executeOperation = async (request, options) => {
    return originalExecuteOperation(request, {
      ...options,
      contextValue: {
        ...defaultContext,
        ...contextValue,
      },
    });
  };
  
  return server;
}

/**
 * Create an authenticated test context
 * @param userId User ID for testing
 * @param roles User roles for testing
 * @param email User email for testing
 * @returns Authenticated context for testing
 */
export function createAuthContext(userId: string, roles: string[] = [], email = 'test@example.com') {
  return {
    user: {
      userId,
      username: 'testuser',
      email,
      roles,
    },
    userRoles: roles,
    isAuthenticated: true,
  };
}

/**
 * Create an admin test context
 * @returns Admin context for testing
 */
export function createAdminContext() {
  return createAuthContext('admin-id', ['ADMIN'], 'admin@example.com');
}

/**
 * Create a developer test context
 * @returns Developer context for testing
 */
export function createDeveloperContext() {
  return createAuthContext('developer-id', ['DEVELOPER'], 'developer@example.com');
}

/**
 * Create a buyer test context
 * @returns Buyer context for testing
 */
export function createBuyerContext() {
  return createAuthContext('buyer-id', ['BUYER'], 'buyer@example.com');
}