'use client';

import React from 'react';
import { useUserRole } from '@/context/UserRoleContext';
import { useAuth } from '@/context/AuthContext';

export default function TestNavigation() {
  const { role, setRole } = useUserRole();
  const { isAuthenticated, user } = useAuth();

  const roles = ['BUYER', 'INVESTOR', 'DEVELOPER', 'AGENT', 'SOLICITOR'];

  return (
    <div className="pt-20 px-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Navigation Testing Page</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
        <p className="mb-2">Authenticated: <span className="font-bold">{isAuthenticated ? 'Yes' : 'No'}</span></p>
        {user && (
          <>
            <p className="mb-2">User Email: <span className="font-bold">{user.email}</span></p>
            <p className="mb-2">User Role: <span className="font-bold">{user.role}</span></p>
          </>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Role Selection</h2>
        <p className="mb-4">Current Role: <span className="font-bold text-[#2B5273]">{role}</span></p>
        <div className="flex flex-wrap gap-3">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-4 py-2 rounded-md transition-colors ${
                role === r
                  ? 'bg-[#2B5273] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Navigation Features</h2>
        <ul className="space-y-2">
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Role-specific navigation items
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Dynamic mega menus
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            User flow integration
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Notification center
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Search functionality
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Mobile responsive menu
          </li>
        </ul>
      </div>

      <div className="mt-8 p-6 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Testing Instructions:</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Try switching between different roles using the buttons above</li>
          <li>Observe how the navigation changes for each role</li>
          <li>Hover over navigation items to see mega menus</li>
          <li>Test the search functionality</li>
          <li>Check the notification center</li>
          <li>Test mobile responsiveness by resizing the window</li>
        </ol>
      </div>
    </div>
  );
}