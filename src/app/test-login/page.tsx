import React from 'react';
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function TestLoginPage() {
  const [emailsetEmail] = useState('testbuyer@example.com');
  const [passwordsetPassword] = useState('testpassword');
  const [errorsetError] = useState('');
  const [loadingsetLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // For testing purposes, we'll use a simplified login flow
      if (email === 'testbuyer@example.com') {
        // Mock successful login for test buyer - redirects to transactions
        router.push('/buyer/transactions');
        return;
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false});

      if (result?.error) {
        setError(result.error);
      } else {
        // Success - redirect based on role
        if (email.includes('buyer')) {
          router.push('/buyer');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Test Payment System Login</h1>

        <div className="mb-4 p-4 bg-blue-50 rounded">
          <p className="text-sm text-blue-800">
            <strong>Test Transaction Account:</strong><br />
            Email: testbuyer@example.com<br />
            Password: testpassword
          </p>
          <p className="text-sm text-blue-800 mt-2">
            This account has a test transaction setup with Fitzgerald Gardens.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <a href="/login" className="text-blue-600 hover:underline">
            Go to regular login
          </a>
        </div>
      </div>
    </div>
  );
}