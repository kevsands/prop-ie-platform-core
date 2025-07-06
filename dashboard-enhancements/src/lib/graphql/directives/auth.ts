/**
 * Authentication directive for PropIE GraphQL API
 * 
 * This file implements a directive to enforce authentication and role-based permissions.
 */

import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { GraphQLSchema, defaultFieldResolver } from 'graphql';
import { AuthenticationError, ForbiddenError } from '../resolvers/base';
import { GraphQLContext } from '../server';
import { UserRole } from '@/types/core/user';

/**
 * Create a schema transformer for the @auth directive
 * @returns A function that transforms a schema with @auth directives
 */
export function authDirectiveTransformer() {
  return (schema: GraphQLSchema) => {
    return mapSchema(schema, {
      // Apply directive to all field definitions
      [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
        // Check if the @auth directive is applied to this field
        const authDirective = getDirective(schema, fieldConfig, 'auth')?.[0];

        if (authDirective) {
          const { requires } = authDirective;

          // Get the original resolver
          const originalResolver = fieldConfig.resolve || defaultFieldResolver;

          // Replace the resolver with one that includes auth checks
          fieldConfig.resolve = async (source, args, context: GraphQLContext, info) => {
            // Check if the user is authenticated
            if (!context.isAuthenticated || !context.user) {
              throw new AuthenticationError();
            }

            // If roles are specified, check if the user has any of them
            if (requires && requires.length > 0) {
              // Admin can access everything
              if (context.userRoles.includes(UserRole.ADMIN)) {
                return originalResolver(source, args, context, info);
              }

              // Check if user has any of the required roles
              const hasRole = requires.some((role: UserRole) =>
                context.userRoles.includes(role)
              );

              if (!hasRole) {
                throw new ForbiddenError('You do not have the required role for this operation');
              }
            }

            // Call the original resolver
            return originalResolver(source, args, context, info);
          };

          return fieldConfig;
        }
      },
    });
  };
}