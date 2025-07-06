'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Auth } from '@/lib/auth';

/**
 * Sign-out Confirmation Page
 * Handles post-signout redirects and cleanup
 */
export default function AuthSignOutPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'complete'>('loading');

  useEffect(() => {
    const handleSignOutCleanup = async () => {
      try {
        setStatus('loading');
        
        // Additional cleanup can be done here
        // Clear any local storage, session data, etc.
        localStorage.clear();
        sessionStorage.clear();
        
        setStatus('complete');
        
        // Redirect to home page after a brief delay
        setTimeout(() => {
          router.push('/?signout=success');
        }, 2000);
      } catch (error) {
        console.error('Sign-out cleanup error:', error);
        setStatus('complete');
        
        // Still redirect even if cleanup fails
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    };

    handleSignOutCleanup();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {status === 'loading' ? (
          <>
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Signing you out...
            </h2>
            <p className="mt-2 text-gray-600">
              Please wait while we complete the sign-out process.
            </p>
          </>
        ) : (
          <>
            <div className="w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              You have been signed out
            </h2>
            <p className="mt-2 text-gray-600">
              Thank you for using PROP.ie. Redirecting to homepage...
            </p>
          </>
        )}
      </div>
    </div>
  );
}