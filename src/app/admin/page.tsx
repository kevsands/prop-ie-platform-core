'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Shield, 
  BarChart3, 
  Users, 
  FileCheck, 
  Activity, 
  Database,
  Settings,
  Globe,
  Lock,
  AlertTriangle
} from 'lucide-react';

export default function AdminPortal() {
  return (
    <main className="max-w-7xl mx-auto py-10 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Enterprise Admin Portal</h1>
        <p className="text-gray-600">Advanced administration and monitoring tools for Prop.ie platform</p>
      </div>

      {/* Admin Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-full mr-3">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Security Status</p>
              <p className="text-lg font-semibold">Secure</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-full mr-3">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Users</p>
              <p className="text-lg font-semibold">1,247</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-full mr-3">
              <Activity className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">System Health</p>
              <p className="text-lg font-semibold">99.9%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-full mr-3">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Alerts</p>
              <p className="text-lg font-semibold">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Admin Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link href="/admin/security" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg border border-gray-100 transition">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-red-100 rounded-full mr-4">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="font-semibold text-lg mb-1">Security Dashboard</h2>
              <p className="text-sm text-gray-500">Real-time security monitoring</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Monitor security events, failed logins, IP blocks, and threat detection
          </p>
        </Link>

        <Link href="/admin/analytics" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg border border-gray-100 transition">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-lg mb-1">Analytics Dashboard</h2>
              <p className="text-sm text-gray-500">Platform analytics and insights</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            User behavior, performance metrics, and business intelligence
          </p>
        </Link>

        <Link href="/admin/compliance" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg border border-gray-100 transition">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-100 rounded-full mr-4">
              <FileCheck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="font-semibold text-lg mb-1">Compliance Dashboard</h2>
              <p className="text-sm text-gray-500">GDPR, AML/KYC monitoring</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Regulatory compliance tracking, audit trails, and reporting
          </p>
        </Link>

        <Link href="/admin/users" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg border border-gray-100 transition">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-purple-100 rounded-full mr-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="font-semibold text-lg mb-1">User Management</h2>
              <p className="text-sm text-gray-500">User accounts and permissions</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Manage user accounts, roles, permissions, and authentication
          </p>
        </Link>

        <Link href="/admin/system" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg border border-gray-100 transition">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-orange-100 rounded-full mr-4">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h2 className="font-semibold text-lg mb-1">System Monitoring</h2>
              <p className="text-sm text-gray-500">Performance and health</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            System performance, API health, database status, and alerts
          </p>
        </Link>

        <Link href="/admin/content" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg border border-gray-100 transition">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-gray-100 rounded-full mr-4">
              <Settings className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h2 className="font-semibold text-lg mb-1">Content Management</h2>
              <p className="text-sm text-gray-500">Platform configuration</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Configure system settings, integrations, and platform parameters
          </p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Admin Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Shield className="h-5 w-5 text-red-500 mr-3" />
            <div className="flex-1">
              <p className="text-sm font-medium">Security scan completed</p>
              <p className="text-xs text-gray-500">No threats detected - All systems secure</p>
            </div>
            <span className="text-xs text-gray-400">2 hours ago</span>
          </div>
          
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Users className="h-5 w-5 text-blue-500 mr-3" />
            <div className="flex-1">
              <p className="text-sm font-medium">New user registrations</p>
              <p className="text-xs text-gray-500">15 new users registered today</p>
            </div>
            <span className="text-xs text-gray-400">4 hours ago</span>
          </div>
          
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Database className="h-5 w-5 text-green-500 mr-3" />
            <div className="flex-1">
              <p className="text-sm font-medium">Database backup completed</p>
              <p className="text-xs text-gray-500">Daily backup successful - 2.4GB</p>
            </div>
            <span className="text-xs text-gray-400">6 hours ago</span>
          </div>
        </div>
      </div>
    </main>
  );
} 