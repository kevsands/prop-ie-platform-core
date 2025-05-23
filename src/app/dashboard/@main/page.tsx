'use client';

import React, { useEffect, useState } from 'react';
// Removed import for build testing;

// Simplified component definitions for build testing

// Mock auth context with complete User type
const useAuth = () => {
  return {
    user: { 
      id: 'mock-user-id', 
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'BUYER',
      name: 'John Doe',
      status: 'ACTIVE',
      onboardingComplete: true,
      mfaEnabled: false,
      emailVerified: true
    },
    isAuthenticated: true,
    login: async () => ({ success: true }),
    logout: async () => ({ success: true }),
    mfaEnabled: false
  };
};

/**
 * Main dashboard overview page
 * 
 * This is rendered in the @main slot of the dashboard layout
 */
export default function DashboardOverview() {
  const { user } = useAuth();
  const [statssetStats] = useState({
    properties: 0,
    documents: 0,
    purchases: 0,
    notifications: 0
  });
  const [loadingsetLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch dashboard data from API
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Mocked data - in a real app, this would be an API call
        setTimeout(() => {
          setStats({
            properties: 12,
            documents: 5,
            purchases: 2,
            notifications: 3
          });
          setLoading(false);
        }, 1000);
      } catch (error) {

        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {user?.firstName || 'User'}. Here's what's happening with your account.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Stats cards */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              {/* Property icon would go here */}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Properties</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.properties}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              {/* Document icon would go here */}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Documents</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.documents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              {/* Purchase icon would go here */}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Purchases</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.purchases}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              {/* Notification icon would go here */}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Notifications</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.notifications}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent activity section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <ul className="divide-y divide-gray-200">
              <li className="py-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <p className="text-sm text-gray-800">Property inquiry submitted</p>
                  <span className="ml-auto text-xs text-gray-500">2h ago</span>
                </div>
              </li>
              <li className="py-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <p className="text-sm text-gray-800">Document approved</p>
                  <span className="ml-auto text-xs text-gray-500">Yesterday</span>
                </div>
              </li>
              <li className="py-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <p className="text-sm text-gray-800">Purchase status updated</p>
                  <span className="ml-auto text-xs text-gray-500">3 days ago</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Quick actions section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border rounded-lg hover:bg-gray-50 text-sm text-center">
                Browse Properties
              </button>
              <button className="p-4 border rounded-lg hover:bg-gray-50 text-sm text-center">
                Upload Document
              </button>
              <button className="p-4 border rounded-lg hover:bg-gray-50 text-sm text-center">
                Track Purchase
              </button>
              <button className="p-4 border rounded-lg hover:bg-gray-50 text-sm text-center">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}