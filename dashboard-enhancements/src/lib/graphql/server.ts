/**
 * GraphQL Apollo Server Configuration
 * 
 * This file configures the Apollo Server for GraphQL operations, including:
 * - Server creation and configuration
 * - Authentication integration with AWS Amplify
 * - Error handling and logging
 * - Performance monitoring
 */

import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest } from 'next/server';
import { loadFiles } from '@graphql-tools/load-files';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { createRequire } from 'module';
import path from 'path';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { API } from '../amplify/api';
import { AuthUser } from '../amplify';
import { authDirectiveTransformer } from './directives/auth';

// Environment variables
const isDevelopment = process.env.NODE_ENV === 'development';

// Define the GraphQL context type
export interface GraphQLContext {
  user: {
    id?: string;
    userId?: string;
    roles?: string[];
  } | null;
  userRoles: string[];
  isAuthenticated: boolean;
  token?: string;
}

/**
 * Creates the Apollo Server instance
 * @returns Apollo Server instance configured for PropIE
 */
export async function createApolloServer() {
  // Dynamically load all schema files
  const schemaPath = path.join(process.cwd(), 'src/lib/graphql/schemas');
  const typesArray = await loadFiles(schemaPath, {
    extensions: ['graphql', 'gql'],
  });

  // Dynamically load all resolver files
  const resolversPath = path.join(process.cwd(), 'src/lib/graphql/resolvers');
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

  // Create Apollo Server
  const server = new ApolloServer<GraphQLContext>({
    schema,
    introspection: isDevelopment,
    formatError: (formattedError) => {
      // Log errors in development
      if (isDevelopment) {
        console.error(formattedError);
      }

      // Don't expose internal server errors to clients in production
      if (!isDevelopment && formattedError.extensions?.code === 'INTERNAL_SERVER_ERROR') {
        return {
          message: 'Internal server error',
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
          },
        };
      }

      return formattedError;
    },
    plugins: [
      // Performance monitoring plugin
      {
        async serverWillStart() {
          console.log('GraphQL Server starting...');
          return {
            async serverWillStop() {
              console.log('GraphQL Server stopping...');
            },
          };
        },
        async requestDidStart() {
          const requestStart = Date.now();
          return {
            async didEncounterErrors({ errors }) {
              errors.forEach((error) => {
                console.error('GraphQL Error:', error);
              });
            },
            async willSendResponse({ response }) {
              const requestEnd = Date.now();
              const duration = requestEnd - requestStart;

              // Log slow queries for optimization
              if (duration > 500) {
                console.warn(`Slow GraphQL query detected: ${duration}ms`);
              }
            },
          };
        },
      },
    ],
  });

  // Return the server instance
  return server;
}

/**
 * Creates a Next.js API handler for GraphQL
 * @returns A handler function for Next.js API routes
 */
export function createGraphQLHandler() {
  return async (req: NextRequest) => {
    const server = await createApolloServer();

    // Create Next.js API handler
    const handler = startServerAndCreateNextHandler(server, {
      context: async (req: NextRequest): Promise<GraphQLContext> => {
        // Extract the authorization token from the headers
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split(' ')[1];

        // Default unauthenticated context
        const defaultContext: GraphQLContext = {
          user: null,
          userRoles: [],
          isAuthenticated: false,
        };

        // If no token, return unauthenticated context
        if (!token) {
          return defaultContext;
        }

        try {
          // Verify token and get user
          const cognitoUser = await getCurrentUser();
          const attributes = await fetchUserAttributes();

          // Parse user roles from Cognito groups
          let roles: string[] = [];

          if (attributes["cognito:groups"]) {
            if (Array.isArray(attributes["cognito:groups"])) {
              roles = attributes["cognito:groups"] as string[];
            } else if (typeof attributes["cognito:groups"] === 'string') {
              const groupsStr = attributes["cognito:groups"] as string;
              roles = groupsStr.includes(',')
                ? groupsStr.split(',').map(g => g.trim())
                : [groupsStr];
            }
          }

          // Create authenticated context
          return {
            user: {
              userId: cognitoUser.userId,
              username: cognitoUser.username,
              email: attributes.email,
              roles: roles,
            },
            userRoles: roles,
            isAuthenticated: true,
            token,
          };
        } catch (error) {
          console.error('Authentication error in GraphQL context:', error);
          return defaultContext;
        }
      },
    });

    return handler(req);
  };
}