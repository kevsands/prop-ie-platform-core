'use client';

/**
 * GraphQL Integration Example Component
 * 
 * This component demonstrates best practices for integrating GraphQL with React components:
 * - Authentication integration with Amplify v6
 * - Using typed hooks for queries and mutations
 * - Handling loading and error states
 * - Role-based query filtering
 * - Optimistic updates
 */

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query'
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Alert } from '@/components/ui/alert';
import { 
  useDevelopments, 
  useCreateDevelopment,
  useDevelopment
} from '@/hooks/api';
import { developmentRoleFilter } from '@/lib/graphql/auth-client';
import { useAuth } from '@/hooks/useAuth';
import { DevelopmentStatus } from '@/types/graphql';

// Fragment-based component props
interface DevelopmentCardProps {
  id: string;
}

// Example of component using GraphQL query
export function DevelopmentCard({ id }: DevelopmentCardProps) {
  const { data, isLoading, error } = useDevelopment(id);
  
  if (isLoading) return <Card><CardContent><Spinner /></CardContent></Card>;
  if (error) return <Alert variant="destructive">Error loading development</Alert>;
  if (!data?.development) return <Alert>Development not found</Alert>;
  
  const development = data.development;
  
  return (
    <Card>
      <CardHeader>
        <h3>{development.name}</h3>
        <div>Status: {development.status}</div>
      </CardHeader>
      <CardContent>
        <p>{development.shortDescription || development.description}</p>
        <div>Units: {development.availableUnits} available of {development.totalUnits}</div>
      </CardContent>
      <CardFooter>
        <div>Located in {development.location.city}, {development.location.county}</div>
      </CardFooter>
    </Card>
  );
}

// Example of GraphQL list with role-based filtering
export function DevelopmentsList() {
  const { user } = useAuth();
  const userRoles = user?.roles || [];
  
  // Apply role-based filtering
  const filter = developmentRoleFilter(userRoles, {
    status: [DevelopmentStatus.MARKETING, DevelopmentStatus.SALES]
  });
  
  const { 
    data, 
    isLoading, 
    error 
  } = useDevelopments(filter);
  
  if (isLoading) return <div className="p-4"><Spinner /></div>;
  if (error) return <Alert variant="destructive">Error loading developments</Alert>;
  
  const developments = data?.developments?.developments || [];
  
  if (developments.length === 0) {
    return <Alert>No developments found</Alert>;
  }
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {developments.map(dev => (
        <DevelopmentCard key={dev.id} id={dev.id} />
      ))}
    </div>
  );
}

// Example of mutation with optimistic updates
export function CreateDevelopmentButton() {
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();
  const { mutateAsync, isPending: isLoading } = useCreateDevelopment({
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['developments'] });
      
      // Get snapshot of current data
      const previousData = queryClient.getQueryData(['developments']);
      
      // Optimistically update the UI
      queryClient.setQueryData(['developments'], (old: any) => {
        if (!old || !old.developments) return old;
        
        return {
          ...old,
          developments: {
            ...old.developments,
            developments: [
              ...old.developments.developments,
              {
                id: 'temp-' + Date.now(),
                name: variables.input.name,
                status: variables.input.status,
                mainImage: variables.input.mainImage,
                shortDescription: variables.input.shortDescription,
                totalUnits: variables.input.totalUnits,
                availableUnits: variables.input.totalUnits,
                location: {
                  city: variables.input.location.city,
                  county: variables.input.location.county
                }
              }
            ],
            totalCount: old.developments.totalCount + 1
          }
        };
      });
      
      return { previousData };
    },
    onError: (err, variables, context: any) => {
      // If mutation fails, restore previous data
      if (context?.previousData) {
        queryClient.setQueryData(['developments'], context.previousData);
      }
      console.error('Failed to create development:', err);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['developments'] });
    }
  });
  
  // Example handler for quick demo
  const handleCreateSample = async () => {
    try {
      setIsCreating(true);
      
      await mutateAsync({
        input: {
          name: `New Development ${Date.now()}`,
          description: "A sample development created for demonstration",
          shortDescription: "Sample development",
          status: DevelopmentStatus.PLANNING,
          mainImage: "/images/developments/sample/main.jpg",
          totalUnits: 20,
          features: ["Sample feature 1", "Sample feature 2"],
          amenities: ["Garden", "Parking"],
          location: {
            address: "123 Sample Street",
            city: "Dublin",
            county: "Dublin",
            country: "Ireland"
          }
        }
      });
      
      setIsCreating(false);
    } catch (error) {
      setIsCreating(false);
      console.error(error);
    }
  };
  
  return (
    <Button 
      onClick={handleCreateSample}
      disabled={isLoading || isCreating}
    >
      {isLoading ? <Spinner className="mr-2" /> : null}
      Create Sample Development
    </Button>
  );
}

// Complete GraphQL integration example
export function GraphQLExample() {
  const { user, isLoading: authLoading } = useAuth();
  
  if (authLoading) {
    return <div className="p-8"><Spinner />Loading authentication status...</div>;
  }
  
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Developments</h2>
        {user && user.roles.includes('DEVELOPER') && (
          <CreateDevelopmentButton />
        )}
      </div>
      
      <DevelopmentsList />
    </div>
  );
}