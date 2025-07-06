import { GraphQLError } from 'graphql';
import type { GraphQLContext } from './server';

// Define a type that works with both AuthUser and Context types
export type AuthContext = GraphQLContext & {
  user: NonNullable<GraphQLContext['user']>;
};

export type ResolverFunction<TArgs = unknown, TResult = unknown> = (
  parent: unknown,
  args: TArgs,
  context: GraphQLContext
) => Promise<TResult>;

export type AuthResolverFunction<TArgs = unknown, TResult = unknown> = (
  parent: unknown,
  args: TArgs,
  context: AuthContext
) => Promise<TResult>;

export function withAuth<TArgs = unknown, TResult = unknown>(
  resolver: AuthResolverFunction<TArgs, TResult>
): ResolverFunction<TArgs, TResult> {
  return async (parent: unknown, args: TArgs, context: GraphQLContext): Promise<TResult> => {
    if (!context.isAuthenticated) {
      throw new GraphQLError('Not authenticated', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    }

    if (!context.user || !context.user.userId) {
      throw new GraphQLError('User not found', {
        extensions: { code: 'UNAUTHORIZED' },
      });
    }

    return resolver(parent, args, context as AuthContext);
  };
} 