/**
 * Base resolver utilities for PropIE GraphQL API
 * 
 * This file provides helper functions and authentication utilities
 * for GraphQL resolvers.
 */

import { GraphQLContext } from '../server';
import { GraphQLError } from 'graphql';
import db from '@/lib/db';
import { User, UserRole } from '@/types/core/user';

/**
 * Authentication error with custom message
 */
export class AuthenticationError extends GraphQLError {
  constructor(message = 'Not authenticated') {
    super(message, {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });
  }
}

/**
 * Authorization error with custom message
 */
export class ForbiddenError extends GraphQLError {
  constructor(message = 'Not authorized') {
    super(message, {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  }
}

/**
 * Not found error with custom message
 */
export class NotFoundError extends GraphQLError {
  constructor(entity: string, id: string) {
    super(`${entity} with ID ${id} not found`, {
      extensions: {
        code: 'NOT_FOUND',
      },
    });
  }
}

/**
 * Validation error with custom message
 */
export class ValidationError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: 'BAD_USER_INPUT',
      },
    });
  }
}

/**
 * Checks if the user is authenticated
 * @param context GraphQL context with user info
 * @throws AuthenticationError if user is not authenticated
 */
export function requireAuth(context: GraphQLContext): void {
  if (!context.isAuthenticated || !context.user) {
    throw new AuthenticationError();
  }
}

/**
 * Checks if the user has any of the required roles
 * @param context GraphQL context with user info
 * @param roles Array of required roles
 * @throws AuthenticationError if user is not authenticated
 * @throws ForbiddenError if user doesn't have the required role
 */
export function requireRole(context: GraphQLContext, roles: UserRole[]): void {
  requireAuth(context);

  // Admin can access everything
  if (context.userRoles.includes(UserRole.ADMIN)) {
    return;
  }

  // Check if user has any of the required roles
  const hasRole = roles.some(role =>
    context.userRoles.includes(role)
  );

  if (!hasRole) {
    throw new ForbiddenError('You do not have the required role for this operation');
  }
}

/**
 * Checks if the user is the owner of a resource
 * @param context GraphQL context with user info
 * @param ownerId ID of the resource owner
 * @throws AuthenticationError if user is not authenticated
 * @throws ForbiddenError if user is not the owner
 */
export function requireOwner(context: GraphQLContext, ownerId: string): void {
  requireAuth(context);

  // Admin and Developer roles can access any resource
  if (
    context.userRoles.includes(UserRole.ADMIN) ||
    context.userRoles.includes(UserRole.DEVELOPER)
  ) {
    return;
  }

  if (context.user?.userId !== ownerId) {
    throw new ForbiddenError('You are not the owner of this resource');
  }
}

/**
 * Base resolvers with common scalars
 */
export const baseResolvers = {
  DateTime: {
    // Serialize Date as ISO string
    serialize(date: Date) {
      return date instanceof Date ? date.toISOString() : null;
    },
    // Parse ISO string to Date
    parseValue(value: string) {
      return new Date(value);
    },
    // Parse AST literal to Date
    parseLiteral(ast: any) {
      if (ast.kind === 'StringValue') {
        return new Date(ast.value);
      }
      return null;
    },
  },

  JSON: {
    // Serialize JSON value
    serialize(value: any) {
      return value;
    },
    // Parse JSON value
    parseValue(value: any) {
      return value;
    },
    // Parse AST literal to JSON
    parseLiteral(ast: any) {
      switch (ast.kind) {
        case 'StringValue':
          return JSON.parse(ast.value);
        case 'IntValue':
          return parseInt(ast.value, 10);
        case 'FloatValue':
          return parseFloat(ast.value);
        case 'BooleanValue':
          return ast.value;
        case 'ObjectValue':
          const obj: Record<string, any> = {};
          ast.fields.forEach((field: any) => {
            obj[field.name.value] = this.parseLiteral(field.value);
          });
          return obj;
        case 'ListValue':
          return ast.values.map((value: any) => this.parseLiteral(value));
        default:
          return null;
      }
    },
  },

  Query: {
    // Base health check query
    health: () => 'GraphQL API is operational',
  },
};

/**
 * Helper function to handle pagination
 * @param data Array of data items
 * @param first Number of items to return from the beginning
 * @param after Cursor to start after
 * @param last Number of items to return from the end
 * @param before Cursor to end before
 * @returns Paginated data with page info
 */
export function paginateResults<T extends { id: string }>(
  data: T[],
  { first, after, last, before }: { first?: number; after?: string; last?: number; before?: string }
) {
  let paginatedData = [...data];

  // Apply 'after' cursor
  if (after) {
    const afterIndex = paginatedData.findIndex(item => item.id === after);
    if (afterIndex >= 0) {
      paginatedData = paginatedData.slice(afterIndex + 1);
    }
  }

  // Apply 'before' cursor
  if (before) {
    const beforeIndex = paginatedData.findIndex(item => item.id === before);
    if (beforeIndex >= 0) {
      paginatedData = paginatedData.slice(0, beforeIndex);
    }
  }

  // Store the edges before pagination
  const edges = paginatedData.map(item => ({
    cursor: item.id,
    node: item,
  }));

  // Apply 'first' limit
  if (first !== undefined && first > 0) {
    paginatedData = paginatedData.slice(0, first);
  }

  // Apply 'last' limit
  if (last !== undefined && last > 0) {
    paginatedData = paginatedData.slice(-last);
  }

  // Calculate page info
  const startCursor = paginatedData.length > 0 ? paginatedData[0].id : null;
  const endCursor = paginatedData.length > 0 ? paginatedData[paginatedData.length - 1].id : null;
  const hasNextPage = endCursor ? edges.some(edge => edge.cursor === endCursor) && edges.indexOf(edges.find(edge => edge.cursor === endCursor)!) < edges.length - 1 : false;
  const hasPreviousPage = startCursor ? edges.some(edge => edge.cursor === startCursor) && edges.indexOf(edges.find(edge => edge.cursor === startCursor)!) > 0 : false;

  return {
    items: paginatedData,
    pageInfo: {
      hasNextPage,
      hasPreviousPage,
      startCursor,
      endCursor,
    },
    totalCount: data.length,
  };
}

/**
 * Helper function to process pagination input
 * @param paginationInput Pagination input from GraphQL query
 * @returns Processed pagination parameters for database
 */
export function processPaginationInput(paginationInput?: {
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}) {
  if (!paginationInput) {
    return { limit: 20, offset: 0 };
  }

  const { first, after, last, before } = paginationInput;

  // Default limit
  let limit = first || 20;
  let offset = 0;

  // Process cursor-based pagination
  if (after) {
    // For cursor-based pagination, we'll need to fetch the cursor's position
    // This is a simplified version; in a real implementation, you'd look up the cursor
    offset = 1; // Placeholder
  }

  // If 'last' is provided, it overrides 'first'
  if (last) {
    limit = last;
    // For 'last', we need more complex logic to find the right offset
    // This is a simplified version
    offset = 0; // Placeholder
  }

  return { limit, offset };
}