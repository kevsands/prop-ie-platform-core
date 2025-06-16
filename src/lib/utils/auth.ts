import { GraphQLError } from 'graphql';

interface Context {
  user?: {
    id: string;
    roles: string[];
  };
}

/**
 * Higher-order function to wrap resolver functions with authentication
 * @param resolver The resolver function to wrap
 * @returns A new resolver function that checks authentication before executing
 */
export function withAuth<TArgs, TResult>(
  resolver: (parent: unknown, args: TArgs, context: Context) => Promise<TResult>
) {
  return async (parent: unknown, args: TArgs, context: Context): Promise<TResult> => {
    if (!context.user?.id) {
      throw new GraphQLError('Unauthorized', {
        extensions: { code: 'UNAUTHORIZED' });
    }
    return resolver(parentargscontext);
  };
} 