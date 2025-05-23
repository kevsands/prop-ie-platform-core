'use client';

import { useAuth } from '@/context/AuthContext';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthDebugPage() {
  const { user: authContextUser, isAuthenticated: authContextAuth } = useAuth();
  const { data: nextAuthSession, status: nextAuthStatus } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const navigateToDeveloper = () => {
    router.push('/developer');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Authentication Debug Page</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* AuthContext Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">AuthContext (Current System)</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Authenticated:</strong> {authContextAuth ? 'Yes' : 'No'}</p>
              {authContextUser && (
                <>
                  <p><strong>User ID:</strong> {authContextUser.id}</p>
                  <p><strong>Email:</strong> {authContextUser.email}</p>
                  <p><strong>Role:</strong> {authContextUser.role}</p>
                  <p><strong>Name:</strong> {authContextUser.name}</p>
                  <p><strong>Status:</strong> {authContextUser.status}</p>
                  <p><strong>Permissions:</strong></p>
                  <ul className="list-disc list-inside ml-4">
                    {authContextUser.permissions.map(perm => (
                      <li key={perm}>{perm}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* NextAuth Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">NextAuth (For Reference)</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Status:</strong> {nextAuthStatus}</p>
              <p><strong>Session:</strong> {nextAuthSession ? 'Active' : 'None'}</p>
              {nextAuthSession?.user && (
                <>
                  <p><strong>Email:</strong> {nextAuthSession.user.email}</p>
                  <p><strong>Role:</strong> {nextAuthSession.user.role || 'No role'}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Navigation Info</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Current Path:</strong> {pathname}</p>
            <p><strong>Expected Developer Path:</strong> /developer</p>
            {authContextUser?.role === 'developer' && (
              <div className="mt-4">
                <p className="text-green-600 font-medium mb-2">✓ You are logged in as a developer</p>
                <button
                  onClick={navigateToDeveloper}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Go to Developer Portal
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Navigation Links */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/developer" className="block p-4 border rounded hover:bg-gray-50">
              <h3 className="font-medium text-blue-600">Developer Portal</h3>
              <p className="text-sm text-gray-600">/developer</p>
            </Link>
            <Link href="/login" className="block p-4 border rounded hover:bg-gray-50">
              <h3 className="font-medium text-blue-600">Login Page</h3>
              <p className="text-sm text-gray-600">/login</p>
            </Link>
            <Link href="/" className="block p-4 border rounded hover:bg-gray-50">
              <h3 className="font-medium text-blue-600">Home Page</h3>
              <p className="text-sm text-gray-600">/</p>
            </Link>
          </div>
        </div>

        {/* Test Login Instructions */}
        <div className="bg-blue-50 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold mb-2">To Test Developer Login:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Go to <Link href="/login" className="text-blue-600 hover:underline">/login</Link></li>
            <li>Enter email: <code className="bg-white px-2 py-1 rounded">developer@example.com</code></li>
            <li>Enter any password</li>
            <li>Click Sign In</li>
            <li>You should be redirected to <code className="bg-white px-2 py-1 rounded">/developer</code></li>
          </ol>
        </div>
      </div>
    </div>
  );
}