'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEnterpriseAuth } from '@/context/EnterpriseAuthContext';
import { UserRole } from '@/types/auth';

interface EnterpriseProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: {
    resource: string;
    action: string;
  };
  fallbackRoute?: string;
  loadingComponent?: React.ReactNode;
}

export default function EnterpriseProtectedRoute({
  children,
  requiredRole,
  requiredPermission,
  fallbackRoute = '/auth/login',
  loadingComponent
}: EnterpriseProtectedRouteProps) {
  const { user, isAuthenticated, isLoading, hasRole, hasPermission } = useEnterpriseAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Not authenticated - redirect to login
    if (!isAuthenticated || !user) {
      router.push(fallbackRoute);
      return;
    }

    // Check role requirement
    if (requiredRole && !hasRole(requiredRole)) {
      console.warn(`Access denied: User role ${user.role} does not match required role ${requiredRole}`);
      router.push('/dashboard'); // Redirect to generic dashboard
      return;
    }

    // Check permission requirement
    if (requiredPermission && !hasPermission(requiredPermission.resource, requiredPermission.action)) {
      console.warn(`Access denied: User lacks permission ${requiredPermission.action} on ${requiredPermission.resource}`);
      router.push('/dashboard'); // Redirect to generic dashboard
      return;
    }
  }, [
    isAuthenticated, 
    isLoading, 
    user, 
    requiredRole, 
    requiredPermission, 
    hasRole, 
    hasPermission, 
    router, 
    fallbackRoute
  ]);

  // Show loading state
  if (isLoading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B5273] mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
          <p className="mt-2 text-sm text-gray-500">Verifying your access</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 w-8 bg-gray-300 rounded-full mx-auto mb-4"></div>
          </div>
          <p className="text-lg text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Role check failed
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-6">
              You don't have the required permissions to access this page.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-[#2B5273] text-white py-2 px-4 rounded-lg hover:bg-[#1a3a52] transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Permission check failed
  if (requiredPermission && !hasPermission(requiredPermission.resource, requiredPermission.action)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Insufficient Permissions</h1>
            <p className="text-gray-600 mb-6">
              You need additional permissions to access this resource.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-[#2B5273] text-white py-2 px-4 rounded-lg hover:bg-[#1a3a52] transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // All checks passed - render children
  return <>{children}</>;
}