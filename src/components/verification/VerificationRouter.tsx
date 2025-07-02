'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useVerification } from '@/context/VerificationContext';
import { useEnterpriseAuth } from '@/context/EnterpriseAuthContext';

interface VerificationRouterProps {
  children: React.ReactNode;
  requiresVerification?: boolean;
  fallbackRoute?: string;
  onVerificationComplete?: () => void;
}

/**
 * VerificationRouter - Smart routing component that handles verification requirements
 * 
 * Features:
 * - Redirects to verification if required and not complete
 * - Handles return URLs after verification completion
 * - Integrates with buyer journey tracking
 * - Supports fallback routes for different scenarios
 */
export default function VerificationRouter({
  children,
  requiresVerification = false,
  fallbackRoute = '/buyer/dashboard',
  onVerificationComplete
}: VerificationRouterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useEnterpriseAuth();
  const { 
    profile, 
    loading, 
    isVerificationComplete, 
    getOverallProgress 
  } = useVerification();

  useEffect(() => {
    if (!isAuthenticated) {
      // Not authenticated - redirect to login with return URL
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (loading || !profile) {
      // Still loading verification status
      return;
    }

    // Check if verification is required and not complete
    if (requiresVerification && !isVerificationComplete()) {
      const currentPath = window.location.pathname + window.location.search;
      const returnUrl = searchParams.get('return') || currentPath;
      
      // Redirect to unified verification with return URL
      router.push(`/buyer/verification/unified?return=${encodeURIComponent(returnUrl)}`);
      return;
    }

    // Check if user just completed verification and should be redirected
    if (isVerificationComplete() && onVerificationComplete) {
      onVerificationComplete();
    }

    // Handle return URL from verification completion
    const returnUrl = searchParams.get('return');
    if (returnUrl && isVerificationComplete()) {
      router.push(returnUrl);
    }

  }, [
    isAuthenticated, 
    loading, 
    profile, 
    requiresVerification, 
    isVerificationComplete, 
    router, 
    searchParams, 
    onVerificationComplete
  ]);

  // Show loading state while checking verification status
  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking verification status...</p>
        </div>
      </div>
    );
  }

  // If verification is required but not complete, show redirect message
  if (requiresVerification && !isVerificationComplete()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Verification Required</h2>
          <p className="text-gray-600 mb-4">
            This feature requires identity verification. You'll be redirected to complete the verification process.
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: '75%' }}
            />
          </div>
          <p className="text-sm text-gray-500">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Render children if verification requirements are met
  return <>{children}</>;
}

/**
 * HOC for pages that require verification
 */
export function withVerificationRequired<T extends object>(
  Component: React.ComponentType<T>,
  options: {
    fallbackRoute?: string;
    onVerificationComplete?: () => void;
  } = {}
) {
  return function VerificationRequiredComponent(props: T) {
    return (
      <VerificationRouter
        requiresVerification={true}
        fallbackRoute={options.fallbackRoute}
        onVerificationComplete={options.onVerificationComplete}
      >
        <Component {...props} />
      </VerificationRouter>
    );
  };
}

/**
 * Hook for components that need to check verification status
 */
export function useVerificationRouting() {
  const router = useRouter();
  const { isVerificationComplete, getOverallProgress } = useVerification();

  const redirectToVerification = (returnUrl?: string) => {
    const currentPath = returnUrl || window.location.pathname + window.location.search;
    router.push(`/buyer/verification/unified?return=${encodeURIComponent(currentPath)}`);
  };

  const redirectAfterVerification = (targetUrl: string) => {
    if (isVerificationComplete()) {
      router.push(targetUrl);
    } else {
      redirectToVerification(targetUrl);
    }
  };

  return {
    isVerificationComplete: isVerificationComplete(),
    verificationProgress: getOverallProgress(),
    redirectToVerification,
    redirectAfterVerification
  };
}