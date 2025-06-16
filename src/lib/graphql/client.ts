import { GraphQLClient } from 'graphql-request';
import { QueryClient } from '@tanstack/react-query';
import { setGraphQLClient as setDocumentsClient } from '@/hooks/useDocuments';

// Create the GraphQL client
export const graphqlClient = new GraphQLClient('/api/graphql', {
  headers: {
    'Content-Type': 'application/json'});

// Initialize hooks with our client
export const initializeGraphQLHooks = () => {
  // Set the client for document hooks
  setDocumentsClient(graphqlClient);

  // Additional hook initializations can be added here
};

// Create the React Query client with default configuration
export const queryClient = new QueryClient({ defaultOptions: { queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1});

// Initialize hooks on module import
initializeGraphQLHooks();