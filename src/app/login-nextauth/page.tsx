import React from 'react';
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default async function NextAuthLoginPagesignIn('credentials', {
        email,
        password,
        redirect: false});

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        // The middleware will handle routing based on role
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (email: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password: 'password123',
        redirect: false});

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        // The middleware will handle routing based on role
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          NextAuth Login
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Sign In</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Test Logins</h2>
          <p className="text-sm text-gray-600 mb-4">All use password: password123</p>

          <div className="space-y-3">
            <button
              onClick={() => handleQuickLogin('developer@example.com')}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Login as Developer
            </button>
            <button
              onClick={() => handleQuickLogin('buyer@example.com')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Login as Buyer
            </button>
            <button
              onClick={() => handleQuickLogin('agent@example.com')}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Login as Estate Agent
            </button>
            <button
              onClick={() => handleQuickLogin('solicitor@example.com')}
              className="w-full bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
            >
              Login as Solicitor
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Other login pages:{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Original Login
            </Link>
            {' | '}
            <Link href="/debug/auth" className="text-blue-600 hover:underline">
              Debug Auth
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}