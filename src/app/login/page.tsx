'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import ClientLayout from '../ClientLayout';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const hint = searchParams.get('hint');
    if (hint) {
      setEmail(hint);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = await signIn(email, password);
      
      if (result.isSignedIn) {
        // Navigate based on user role
        if (email.includes('buyer')) {
          router.push('/buyer');
        } else if (email.includes('developer')) {
          router.push('/developer');
        } else if (email.includes('agent')) {
          router.push('/agents');
        } else if (email.includes('solicitor')) {
          router.push('/solicitor');
        } else if (email.includes('admin')) {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else if (result.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_SMS_CODE') {
        // Handle MFA
        router.push('/auth/mfa');
      }
    } catch (err) {
      setError('Invalid email or password');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
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
              <p className="text-sm text-blue-900 font-medium mb-2">Test Credentials:</p>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• buyer@example.com - Buyer Dashboard</p>
                <p>• developer@example.com - Developer Dashboard</p>
                <p>• agent@example.com - Agent Dashboard</p>
                <p>• solicitor@example.com - Solicitor Dashboard</p>
                <p>• admin@example.com - Admin Dashboard</p>
                <p className="mt-2 text-xs">Password: any value</p>
              </div>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md text-sm">
                {error}
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
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium mb-2">Development Mode - Quick Login</p>
                <div className="text-xs text-blue-600 space-y-1">
                  <p>Use any password. Login with:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>buyer@example.com - Buyer Dashboard</li>
                    <li>developer@example.com - Developer Dashboard</li>
                    <li>agent@example.com - Agent Dashboard</li>
                    <li>solicitor@example.com - Solicitor Dashboard</li>
                    <li>admin@example.com - Admin Dashboard</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}