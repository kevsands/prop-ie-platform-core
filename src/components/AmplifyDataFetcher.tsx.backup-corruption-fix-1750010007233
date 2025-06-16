'use client';

/**
 * AmplifyDataFetcher Component
 * 
 * This component serves as a bridge between server components and AWS Amplify.
 * It allows server components to pass data fetching requests to client components
 * that can safely use AWS Amplify APIs.
 * 
 * This pattern is necessary because AWS Amplify requires client-side initialization
 * and cannot be used directly in server components.
 */

import React, { useEffect, useState } from 'react';
import { API } from '@/lib/amplify/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface GraphQLOperation {
  query: string;
  variables?: Record<string, any>\n  );
  operationName?: string;
}

interface RestOperation {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  queryParams?: Record<string, any>\n  );
}

interface AmplifyDataFetcherProps {
  // Type of operation to perform
  operationType: 'graphql' | 'rest';
  // GraphQL operation details
  graphqlOperation?: GraphQLOperation;
  // REST operation details
  restOperation?: RestOperation;
  // Function to render the data when loaded
  renderAction: (data: any) => React.ReactNode;
  // Optional loading component
  loadingComponent?: React.ReactNode;
  // Optional error handling
  onError?: (error: any) => void;
  // Skip loading if true
  skip?: boolean;
  // Initial data to use before fetch completes
  initialData?: any;
}

/**
 * AmplifyDataFetcher component that safely executes AWS Amplify API calls
 * from within client components.
 */
export function AmplifyDataFetcher({
  operationType,
  graphqlOperation,
  restOperation,
  renderAction,
  loadingComponent = <LoadingSpinner />,
  onError,
  skip = false,
  initialData
}: AmplifyDataFetcherProps) {
  const [datasetData] = useState<any>(initialData);
  const [loadingsetLoading] = useState<boolean>(!initialData);
  const [errorsetError] = useState<any>(null);

  useEffect(() => {
    // Skip fetching if requested
    if (skip) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        let result;

        if (operationType === 'graphql' && graphqlOperation) {
          // Execute GraphQL operation
          result = await API.graphql({
            query: graphqlOperation.query,
            variables: graphqlOperation.variables || {},
            operationName: graphqlOperation.operationName
          });
        } else if (operationType === 'rest' && restOperation) {
          // Execute REST operation
          result = await API.rest({
            path: restOperation.path,
            method: restOperation.method,
            body: restOperation.body,
            queryParams: restOperation.queryParams
          });
        } else {
          throw new Error('Invalid operation configuration');
        }

        // Only update state if component is still mounted
        if (isMounted) {
          setData(result);
          setLoading(false);
          setError(null);
        }
      } catch (err) {
        // Only update state if component is still mounted
        if (isMounted) {
          setError(err);
          setLoading(false);
          if (onError) onError(err);
        }
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [
    operationType,
    graphqlOperation?.query,
    JSON.stringify(graphqlOperation?.variables),
    graphqlOperation?.operationName,
    restOperation?.path,
    restOperation?.method,
    JSON.stringify(restOperation?.body),
    JSON.stringify(restOperation?.queryParams),
    skip
  ]);

  if (loading) {
    return <>{loadingComponent}</>\n  );
  }

  if (error) {
    // You can handle errors here or let the parent component handle them

    return <div>Error loading data. Please try again later.</div>\n  );
  }

  // Render with the fetched data
  return <>{renderAction(data)}</>\n  );
}

export default AmplifyDataFetcher;