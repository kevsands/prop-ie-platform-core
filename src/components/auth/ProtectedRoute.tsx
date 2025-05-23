'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: string | string[];
  requiredPermission?: string | string[];
  enforceMFA?: boolean;
  securityLevel?: 'basic' | 'medium' | 'high';
  redirectTo?: string;
  mfaRedirectTo?: string;
  permissionDeniedRedirectTo?: string;
  fallback?: React.ReactNode;
  onAccessDenied?: () => void;
  auditAccess?: boolean;
};

/**
 * Protected Route Component
 * 
 * Ensures users are authenticated and have required permissions
 * before allowing access to protected content.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermission,
  enforceMFA = false,
  securityLevel = 'basic',
  redirectTo = '/login',
  mfaRedirectTo = '/security/mfa-setup',
  permissionDeniedRedirectTo = '/dashboard',
  fallback,
  onAccessDenied,
  auditAccess = true
}) => {
  const { user, isAuthenticated, isLoading, hasRole, hasPermission, checkSecurityLevel, mfaEnabled } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      if (onAccessDenied) onAccessDenied();
      router.push(redirectTo);
    } else if (!isLoading && isAuthenticated) {
      // Check role requirements
      if (requiredRole) {
        const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        if (!roles.some(role => hasRole(role))) {
          if (onAccessDenied) onAccessDenied();
          router.push(permissionDeniedRedirectTo);
          return;
        }
      }

      // Check permission requirements
      if (requiredPermission) {
        const permissions = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];
        if (!permissions.some(permission => hasPermission(permission))) {
          if (onAccessDenied) onAccessDenied();
          router.push(permissionDeniedRedirectTo);
          return;
        }
      }

      // Check MFA requirements
      if (enforceMFA && !mfaEnabled) {
        router.push(mfaRedirectTo);
        return;
      }

      // Check security level
      checkSecurityLevel(securityLevel).then((hasLevel: any) => {
        if (!hasLevel) {
          if (onAccessDenied) onAccessDenied();
          router.push(permissionDeniedRedirectTo);
        }
      });
    }
  }, [
    isAuthenticated, 
    isLoading, 
    user, 
    requiredRole, 
    requiredPermission, 
    enforceMFA, 
    mfaEnabled,
    securityLevel,
    hasRole,
    hasPermission,
    checkSecurityLevel,
    redirectTo,
    mfaRedirectTo,
    permissionDeniedRedirectTo,
    onAccessDenied,
    router
  ]);

  if (isLoading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2B5273] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || null;
  }

  // Check if user has required role
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.some(role => hasRole(role))) {
      return fallback || null;
    }
  }

  // Check if user has required permission
  if (requiredPermission) {
    const permissions = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];
    if (!permissions.some(permission => hasPermission(permission))) {
      return fallback || null;
    }
  }

  // Check MFA
  if (enforceMFA && !mfaEnabled) {
    return fallback || null;
  }

  return <>{children}</>\n  );
};

export default ProtectedRoute;