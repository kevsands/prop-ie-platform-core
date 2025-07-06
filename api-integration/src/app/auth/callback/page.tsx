'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Auth } from '@/lib/auth';

/**
 * OAuth Callback Page for Cognito Authentication
 * Handles the redirect after successful OAuth sign-in
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setStatus('loading');
        
        // Check if user is authenticated
        const isAuthenticated = await Auth.isAuthenticated();
        
        if (isAuthenticated) {
          setStatus('success');
          // Redirect to the intended destination or dashboard
          const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '/buyer/first-time-buyers/welcome';
          router.push(redirectTo);
        } else {
          throw new Error('Authentication failed after callback');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setError(error instanceof Error ? error.message : 'Authentication failed');
        setStatus('error');
        
        // Redirect to sign-in page after error
        setTimeout(() => {
          router.push('/auth?error=callback_failed');
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Completing sign-in...
          </h2>
          <p className="mt-2 text-gray-600">
            Please wait while we authenticate you.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-4">
            <svg className="w-full h-full text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Sign-in successful!
          </h2>
          <p className="mt-2 text-gray-600">
            Redirecting you to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md">
        <div className="w-32 h-32 mx-auto mb-4">
          <svg className="w-full h-full text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          Authentication failed
        </h2>
        <p className="mt-2 text-gray-600">
          {error || 'There was an error completing your sign-in.'}
        </p>
        <p className="mt-4 text-sm text-gray-500">
          Redirecting to sign-in page...
        </p>
      </div>
    </div>
  );
}