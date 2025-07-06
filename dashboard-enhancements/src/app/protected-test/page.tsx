'use client';

import React from 'react';

// Inline simplified ProtectedRoute component for build testing
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
  enforceMFA?: boolean;
  securityLevel?: string;
  permissionDeniedRedirectTo?: string;
  mfaRedirectTo?: string;
}> = ({ children }) => {
  return (
    <>
      <div className="bg-amber-50 p-1 mb-2 rounded text-amber-800 text-xs">
        <div className="font-medium">Simplified Protected Section</div>
      </div>
      {children}
    </>
  );
};

// Mock auth context
const useAuth = () => {
  return {
    user: { 
      id: 'mock-user-id', 
      email: 'user@example.com',
      username: 'mockuser',
      role: 'ADMIN',
      permissions: ['read:all', 'write:all']
    },
    isAuthenticated: true,
    mfaEnabled: true,
    securityLevel: 'high'
  };
};

/**
 * Protected Test Page
 * 
 * This page demonstrates different types of route protection options.
 * It uses the ProtectedRoute component with various protection settings.
 */
export default function ProtectedTestPage() {
  const { user, mfaEnabled, securityLevel } = useAuth();
  
  return (
    <div className="container mx-auto p-6">
      <div className="bg-amber-50 p-3 mb-4 rounded text-amber-800 text-sm">
        <div className="font-medium">Simplified Protected Test Page</div>
        <div>This is a simplified version for build testing. No actual authentication is performed.</div>
      </div>

      <h1 className="text-3xl font-bold mb-8">Protected Route Testing</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Protection (Authentication Only) */}
        <ProtectedRoute>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Basic Protection</h2>
            <p className="mb-2">You can see this section because you are authenticated.</p>
            <p className="text-sm text-gray-600">No special roles or permissions required.</p>
          </div>
        </ProtectedRoute>
        
        {/* Role-Based Protection (Admin Only) */}
        <ProtectedRoute 
          requiredRole="ADMIN"
          permissionDeniedRedirectTo="/protected-test"
        >
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Admin Only</h2>
            <p className="mb-2">You can see this section because you have the ADMIN role.</p>
            <p className="text-sm text-gray-600">Only visible to administrators.</p>
          </div>
        </ProtectedRoute>
        
        {/* Role-Based Protection (Developer Only) */}
        <ProtectedRoute 
          requiredRole="DEVELOPER"
          permissionDeniedRedirectTo="/protected-test"
        >
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Developer Only</h2>
            <p className="mb-2">You can see this section because you have the DEVELOPER role.</p>
            <p className="text-sm text-gray-600">Only visible to developers.</p>
          </div>
        </ProtectedRoute>
        
        {/* Permission-Based Protection */}
        <ProtectedRoute 
          requiredPermission="read:all"
          permissionDeniedRedirectTo="/protected-test"
        >
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Permission-Based</h2>
            <p className="mb-2">You can see this section because you have the "read:all" permission.</p>
            <p className="text-sm text-gray-600">Requires specific permissions.</p>
          </div>
        </ProtectedRoute>
        
        {/* MFA Protection */}
        <ProtectedRoute 
          enforceMFA={true}
          mfaRedirectTo="/security/mfa-setup"
        >
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">MFA Protected</h2>
            <p className="mb-2">You can see this section because you have MFA enabled.</p>
            <p className="text-sm text-gray-600">Requires multi-factor authentication.</p>
          </div>
        </ProtectedRoute>
        
        {/* Security Level Protection */}
        <ProtectedRoute 
          securityLevel="medium"
          mfaRedirectTo="/security/mfa-setup"
        >
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Medium Security</h2>
            <p className="mb-2">You can see this section because you meet the medium security level.</p>
            <p className="text-sm text-gray-600">Requires enhanced security measures.</p>
          </div>
        </ProtectedRoute>
      </div>
      
      {/* User Information Panel */}
      <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Your Authentication Status</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-700">User Information</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li><span className="font-medium">Username:</span> {user?.username || 'Not authenticated'}</li>
              <li><span className="font-medium">Role:</span> {user?.role || 'None'}</li>
              <li><span className="font-medium">Email:</span> {user?.email || 'Not available'}</li>
              <li><span className="font-medium">ID:</span> {user?.id || 'Not available'}</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700">Security Status</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                <span className="font-medium">MFA Enabled:</span> 
                <span className={mfaEnabled ? 'text-green-600' : 'text-red-600'}>
                  {mfaEnabled ? 'Yes' : 'No'}
                </span>
              </li>
              <li>
                <span className="font-medium">Security Level:</span> 
                <span className={`${securityLevel === 'high' ? 'text-green-600' : securityLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                  {securityLevel}
                </span>
              </li>
              <li>
                <span className="font-medium">Permissions:</span> 
                {user?.permissions && user.permissions.length > 0 ? (
                  <ul className="ml-4 mt-1">
                    {user.permissions.map((perm, i) => (
                      <li key={i} className="text-xs">{perm}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-red-600">None</span>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}