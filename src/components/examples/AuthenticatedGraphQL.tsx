import React from 'react';
'use client';

/**
 * Authenticated GraphQL Example Component
 * 
 * This component demonstrates integrating GraphQL with Amplify v6 authentication:
 * - Authenticating GraphQL requests with tokens
 * - Role-based component rendering
 * - Role-filtered data queries
 * - Error handling for authentication failures
 */

import { useState } from 'react';
import { useCurrentUser, useUserRoles, useAuthenticatedGraphQL } from '@/hooks/api/useAuth';
import { useDevelopments, useDevelopment } from '@/hooks/api/useGraphQLQueries';
import { useCreateDevelopment } from '@/hooks/api/useGraphQLMutations';
import { developmentRoleFilter } from '@/lib/graphql/auth-client';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { UserRole } from '@/types/core/user';
import { DevelopmentStatus } from '@/types/graphql';

/**
 * Main Authenticated GraphQL Example
 */
export function AuthenticatedGraphQL() {
  // Get current user and authentication state
  const { data: userData, isLoading: userLoading, error: userError } = useCurrentUser();
  const { isAuthenticated, signIn, signOut } = useAuthenticatedGraphQL();
  const { roles, isAdmin, isDeveloper } = useUserRoles();

  // Login form state
  const [emailsetEmail] = useState('');
  const [passwordsetPassword] = useState('');
  const [loginErrorsetLoginError] = useState<string | null>(null);

  // Login form handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const result = await signIn(emailpassword);

      if (!result.success) {
        setLoginError(result.error || 'Login failed');
      }
    } catch (error) {
      setLoginError('Unexpected error during login');

    }
  };

  // If loading user data
  if (userLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Spinner />
        <span className="ml-2">Loading user data...</span>
      </div>
    );
  }

  // If not authenticated, show login form
  if (!isAuthenticated || !userData?.data?.me) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
          <h2 className="text-2xl font-bold">Login</h2>
          <p className="text-sm text-gray-500">Authenticate to access GraphQL API</p>
        </CardHeader>
        <CardContent>
          {loginError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  // Authenticated UI
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Welcome, {userData.data.me.firstName}</h2>
          <p className="text-sm text-gray-500">
            Roles: {roles.join(', ')}
          </p>
        </div>
        <Button variant="outline" onClick={signOut}>Logout</Button>
      </div>

      {/* Role-based content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Administrative panel - Admin only */}
        {isAdmin && (
          <AdminPanel />
        )}

        {/* Developer panel - Developer or Admin */}
        {(isDeveloper || isAdmin) && (
          <DeveloperPanel />
        )}

        {/* Buyer panel - Available to all authenticated users */}
        <BuyerPanel />
      </div>
    </div>
  );
}

/**
 * Admin Panel - With admin-specific GraphQL operations 
 */
function AdminPanel() {
  // Admin-specific query with role requirements
  const { roles, isLoading } = useUserRoles();

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-bold">Admin Panel</h3>
        <p className="text-sm text-gray-500">Admin-only GraphQL operations</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center">
            <Spinner className="mr-2" />
            <span>Loading admin data...</span>
          </div>
        ) : (
          <div>
            <p>Admin-specific GraphQL data</p>
            <p className="font-semibold mt-2">Your roles include:</p>
            <ul className="list-disc list-inside">
              {roles.map((role: string) => (
                <li key={role}>{role}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="text-xs text-gray-500">
          This panel only appears for users with ADMIN role
        </div>
      </CardFooter>
    </Card>
  );
}

/**
 * Developer Panel - With role-filtered GraphQL data
 */
function DeveloperPanel() {
  const { roles } = useUserRoles();

  // Use role-based filtering for developments query
  const filter = developmentRoleFilter(roles, {
    status: [DevelopmentStatus.PLANNING, DevelopmentStatus.CONSTRUCTION]
  });

  // Query with role-filtered data
  const { data, isLoading, error } = useDevelopments(filter);

  // Create development mutation
  const createDevelopment = useCreateDevelopment();

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-bold">Developer Panel</h3>
        <p className="text-sm text-gray-500">Developer operations with role-filtered data</p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center">
            <Spinner className="mr-2" />
            <span>Loading developments...</span>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Failed to load developments</AlertDescription>
          </Alert>
        ) : (
          <div>
            <p className="font-semibold">Your Developments:</p>
            {data?.data?.developments?.developments?.length ? (
              <ul className="list-disc list-inside mt-2">
                {data.data.developments.developments.map((dev: any) => (
                  <li key={dev.id}>
                    {dev.name} - {dev.status}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm italic mt-2">No developments found</p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          size="sm" 
          disabled={createDevelopment.isPending}
          onClick={() => {
            createDevelopment.mutate({
              input: {
                name: `New Development ${Date.now()}`,
                description: "Sample development created through GraphQL API",
                shortDescription: "Sample development",
                mainImage: "/images/placeholder.jpg",
                status: DevelopmentStatus.PLANNING,
                totalUnits: 10,
                features: ["Feature 1", "Feature 2"],
                Amenity: ["Amenity 1"],
                location: {
                  address: "123 Sample St",
                  city: "Dublin",
                  county: "Dublin",
                  country: "Ireland"
                }
              }
            });
          }
        >
          {createDevelopment.isPending ? (
            <><Spinner className="mr-2" size="sm" /> Creating...</>
          ) : (
            <>Create Sample Development</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

/**
 * Buyer Panel - With standard authenticated GraphQL queries
 */
function BuyerPanel() {
  // Public developments query (available to all authenticated users)
  // Uses default role filtering based on the user's role
  const { data, isLoading } = useDevelopments({
    status: [DevelopmentStatus.SALES, DevelopmentStatus.HANDOVER],
    isPublished: true
  });

  // State for selected development
  const [selectedIdsetSelectedId] = useState<string | null>(null);

  // Get development details when selected
  const { data: developmentData, isLoading: developmentLoading } = 
    useDevelopment(selectedId || '', { 
      enabled: !!selectedId 
    });

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-bold">Available Properties</h3>
        <p className="text-sm text-gray-500">For all authenticated users</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center">
            <Spinner className="mr-2" />
            <span>Loading properties...</span>
          </div>
        ) : (
          <>
            <div>
              <p className="font-semibold">Available Developments:</p>
              {data?.data?.developments?.developments?.length ? (
                <ul className="list-disc list-inside mt-2">
                  {data.data.developments.developments.map((dev: any) => (
                    <li 
                      key={dev.id}
                      className="cursor-pointer hover:text-blue-600"
                      onClick={() => setSelectedId(dev.id)}
                    >
                      {dev.name} - {dev.totalUnits} units
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm italic mt-2">No available properties</p>
              )}
            </div>

            {selectedId && developmentData?.data?.development && (
              <div className="mt-4 p-4 border rounded-md">
                <h4 className="font-semibold">{developmentData.data.development.name}</h4>
                <p className="text-sm mt-1">
                  {developmentData.data.development.shortDescription || 
                   developmentData.data.development.description}
                </p>
                {developmentData.data.development.location && (
                  <div className="text-xs text-gray-500 mt-1">
                    Location: {developmentData.data.development.location.city}, 
                    {developmentData.data.development.location.county}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default AuthenticatedGraphQL;