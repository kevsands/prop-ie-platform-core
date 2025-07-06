'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import ClientLayout from '../ClientLayout';
import { EnterpriseAuthProvider, useEnterpriseAuth } from '@/context/EnterpriseAuthContext';
import AuthErrorBoundary from '@/components/auth/AuthErrorBoundary';

function LoginPageContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const { signIn, isLoading, error, clearError } = useEnterpriseAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const hint = searchParams.get('hint');
    if (hint) {
      setEmail(hint);
    }
    // Clear any existing errors when component mounts
    clearError();
  }, [searchParams, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await signIn({
        email,
        password,
        rememberMe
      });
      // Navigation is handled automatically by the enterprise auth context
    } catch (err) {
      // Error is handled by the context
      console.error('Login error:', err);
    }
  };

  return (
    <ClientLayout>
      <div className="min-h-screen pt-20 pb-12 bg-gray-50">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Sign in to your account
            </h2>
            
            {/* Test user credentials hint */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900 font-medium mb-2">Enterprise Test Credentials:</p>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• kevin@prop.ie - Real user from database</p>
                <p>• Or use any email with "buyer", "developer", "agent", etc.</p>
                <p className="mt-2 text-xs">Password: any value (development mode)</p>
              </div>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md text-sm">
                {error.message || 'Login failed'}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#2B5273] focus:border-[#2B5273]"
                  placeholder="your@email.com"
                />
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-sm text-[#2B5273] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#2B5273] focus:border-[#2B5273]"
                  placeholder="••••••••"
                />
              </div>

              <div className="mb-6 flex items-center">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#2B5273] focus:ring-[#2B5273] border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Keep me signed in for 30 days
                </label>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2B5273] text-white py-2 px-4 rounded-md hover:bg-[#1E3142] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="text-[#2B5273] hover:underline">
                  Register here
                </Link>
              </p>
            </div>
            
            {/* Development mode helper */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800 font-medium mb-2">Enterprise Authentication System</p>
                <div className="text-xs text-green-700 space-y-1">
                  <p>✅ Now using unified enterprise authentication</p>
                  <p>✅ JWT tokens with refresh capability</p>
                  <p>✅ Role-based access control (RBAC)</p>
                  <p>✅ Automatic dashboard routing by role</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}

export default function LoginPage() {
  return (
    <EnterpriseAuthProvider>
      <AuthErrorBoundary>
        <Suspense fallback={
          <ClientLayout>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
              <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded animate-pulse mx-auto mb-4"></div>
                  <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mx-auto"></div>
                  <p className="mt-4 text-sm text-gray-500">Loading enterprise authentication...</p>
                </div>
              </div>
            </div>
          </ClientLayout>
        }>
          <LoginPageContent />
        </Suspense>
      </AuthErrorBoundary>
    </EnterpriseAuthProvider>
  );
}