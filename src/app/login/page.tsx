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

  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the callback URL if it exists
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  // If user is already logged in, redirect to appropriate dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      const role = user.role?.toLowerCase();
      redirectByRole(role);
    }
  }, [user, isAuthenticated, router]);

  // Set email from query parameter if present
  useEffect(() => {
    const hint = searchParams.get('hint');
    if (hint) {
      setEmail(hint);
    }
  }, [searchParams]);

  // Redirect based on user role
  const redirectByRole = (role?: string) => {
    if (!role) {
      router.push('/buyer');
      return;
    }

    switch (role) {
      case 'developer':
        router.push('/developer');
        break;
      case 'agent':
        router.push('/agents');
        break;
      case 'estate_agent':
        router.push('/agents');
        break;
      case 'solicitor':
        router.push('/solicitor');
        break;
      case 'admin':
        router.push('/admin');
        break;
      case 'buyer':
      default:
        router.push('/buyer');
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Form submitted!');
    console.log('Email:', email);
    console.log('Password:', password);
    
    setIsLoading(true);
    setError('');

    try {
      // Test direct API call first
      console.log('🔄 Making direct API call...');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      console.log('📡 API Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Login successful:', data);
        
        // Simple redirect based on email
        if (email.includes('developer') || email.includes('kevin')) {
          console.log('🔄 Redirecting to developer dashboard...');
          router.push('/developer');
        } else {
          console.log('🔄 Redirecting to buyer dashboard...');
          router.push('/buyer');
        }
      } else {
        const errorData = await response.json();
        console.log('❌ Login failed:', errorData);
        setError(errorData.error || 'Login failed');
      }
    } catch (err) {
      console.log('💥 Exception:', err);
      setError(err instanceof Error ? err.message : 'Network error');
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

            {/* Debug button */}
            <div className="mb-4 p-3 bg-yellow-50 rounded-md">
              <button 
                type="button"
                onClick={() => {
                  console.log('🧪 Test button clicked!');
                  alert('JavaScript is working!');
                }}
                className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600"
              >
                🧪 Test JavaScript (Click Me!)
              </button>
            </div>

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
                  onChange={(e: any) => setEmail(e.target.value)}
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
                  onChange={(e: any) => setPassword(e.target.value)}
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