import React from 'react';
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function AuthTestPage() {
  const { data: session, status } = useSession();
  const [errorsetError] = useState('');
  const [successsetSuccess] = useState('');

  const handleLogin = async (email: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password: 'password123',
        redirect: false});

      if (result?.error) {
        setError(result.error);
        setSuccess('');
      } else {
        setSuccess('Login successful!');
        setError('');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Auth System Test</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Session</h2>
          <div className="text-gray-700">
            <p><strong>Status:</strong> {status}</p>
            {session && (
              <>
                <p><strong>User:</strong> {session.user?.email}</p>
                <p><strong>Role:</strong> {session.user?.role || 'No role'}</p>
              </>
            )}
          </div>
        </div>

        {!session && (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Quick Login Options</h2>
              <div className="space-y-3">
                <button
                  onClick={() => handleLogin('buyer@example.com')}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Login as Buyer
                </button>
                <button
                  onClick={() => handleLogin('developer@example.com')}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Login as Developer
                </button>
                <button
                  onClick={() => handleLogin('agent@example.com')}
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                  Login as Estate Agent
                </button>
                <button
                  onClick={() => handleLogin('solicitor@example.com')}
                  className="w-full bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
                >
                  Login as Solicitor
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Navigation Links</h2>
              <div className="space-y-2">
                <Link href="/login" className="block text-blue-600 hover:text-blue-800">
                  → Standard Login Page
                </Link>
                <Link href="/auth/register" className="block text-blue-600 hover:text-blue-800">
                  → Register New Account
                </Link>
              </div>
            </div>
          </>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {session && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <button
              onClick={() => signIn('credentials', { callbackUrl: '/' })}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}