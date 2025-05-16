'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
// Temporarily comment out problematic imports for build testing
// // Removed import for build testing;
// // Removed import for build testing;
import { Building, FileText, Euro, Clock, Info, ChevronRight } from 'lucide-react';

// Simplified component definitions for build testing

// Simplified Card components
const Card = ({ className = "", children }) => (
  <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ className = "", children }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ className = "", children }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ className = "", children }) => (
  <p className={`text-sm text-gray-500 ${className}`}>
    {children}
  </p>
);

const CardContent = ({ className = "", children }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ className = "", children }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`}>
    {children}
  </div>
);

// Simplified Button component
const Button = ({ 
  className = "", 
  variant = "default", 
  children, 
  disabled = false, 
  onClick,
  ...props 
}) => (
  <button
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${
      variant === "outline" 
        ? "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700" 
        : "bg-blue-600 text-white hover:bg-blue-700"
    } h-10 px-4 py-2 ${className}`}
    disabled={disabled}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

export default function DeveloperHTBPage() {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Help-to-Buy Scheme</h1>
          <p className="mt-1 text-gray-500">
            Manage Help-to-Buy claims and track application status
          </p>
        </div>
        <button 
          onClick={() => router.push('/developer/htb/claims')}
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          <FileText className="mr-2 h-4 w-4" />
          View All Claims
        </button>
      </div>

      {/* HTB Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {/* Card 1 */}
        <div className="border rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 pb-2">
            <h3 className="text-lg font-semibold">Claims Management</h3>
            <p className="text-sm text-gray-500">Track and manage buyer HTB claims</p>
          </div>
          <div className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Process applications, verify documentation, and track claim status.</p>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t">
            <button 
              className="w-full text-gray-700 hover:text-gray-900 border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-md flex justify-center items-center"
              onClick={() => router.push('/developer/htb/claims')}
            >
              View Claims
              <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="border rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 pb-2">
            <h3 className="text-lg font-semibold">Revenue Guide</h3>
            <p className="text-sm text-gray-500">Official HTB documentation</p>
          </div>
          <div className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-100 text-amber-600 mr-4">
                <Info className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Access the latest Revenue guide on HTB scheme requirements and procedures.</p>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t">
            <button 
              className="w-full text-gray-700 hover:text-gray-900 border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-md flex justify-center items-center"
              onClick={() => router.push('/developer/htb/revenue-guide')}
            >
              View Guide
              <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Card 3 */}
        <div className="border rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 pb-2">
            <h3 className="text-lg font-semibold">HTB Analytics</h3>
            <p className="text-sm text-gray-500">Claim statistics and insights</p>
          </div>
          <div className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <Euro className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">View analytics on HTB claims, approval rates, and average processing times.</p>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t">
            <button 
              className="w-full text-gray-700 hover:text-gray-900 border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-md flex justify-center items-center"
              onClick={() => router.push('/developer/htb/analytics')}
            >
              View Analytics
              <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            className="flex items-center justify-center h-16 border border-gray-300 hover:bg-gray-100 rounded-md"
            onClick={() => router.push('/developer/htb/claims')}
          >
            <Clock className="mr-2 h-5 w-5" />
            <span>Pending Reviews</span>
          </button>
          <button 
            className="flex items-center justify-center h-16 border border-gray-300 hover:bg-gray-100 rounded-md"
            onClick={() => router.push('/developer/htb/claims')}
          >
            <Euro className="mr-2 h-5 w-5" />
            <span>Process Payments</span>
          </button>
          <button 
            className="flex items-center justify-center h-16 border border-gray-300 hover:bg-gray-100 rounded-md"
            onClick={() => router.push('/developer/documents')}
          >
            <FileText className="mr-2 h-5 w-5" />
            <span>HTB Documentation</span>
          </button>
          <button 
            className="flex items-center justify-center h-16 border border-gray-300 hover:bg-gray-100 rounded-md"
            onClick={() => router.push('/developer/htb/revenue-guide')}
          >
            <Info className="mr-2 h-5 w-5" />
            <span>HTB Guidelines</span>
          </button>
        </div>
      </div>

      {/* Recent Claims */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent HTB Activity</h2>
        <div className="space-y-4">
          <div className="flex items-start p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
            <Building className="h-5 w-5 text-blue-500 mt-1 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">New HTB claim submitted</p>
              <p className="text-sm text-gray-500">Property: Fitzgerald Gardens - Unit 102</p>
              <p className="text-xs text-gray-400 mt-1">Today, 10:23 AM</p>
            </div>
          </div>

          <div className="flex items-start p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
            <Euro className="h-5 w-5 text-green-500 mt-1 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">HTB funds received</p>
              <p className="text-sm text-gray-500">€30,000 for Riverside Manor - Unit 15</p>
              <p className="text-xs text-gray-400 mt-1">Yesterday, 3:45 PM</p>
            </div>
          </div>

          <div className="flex items-start p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
            <Clock className="h-5 w-5 text-amber-500 mt-1 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">HTB claim ready for processing</p>
              <p className="text-sm text-gray-500">Access code verified for Ballymakenny View - Unit 7</p>
              <p className="text-xs text-gray-400 mt-1">May 2, 2023</p>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <button className="text-blue-600 hover:text-blue-800 flex items-center mx-auto" onClick={() => router.push('/developer/htb/claims')}>
            View all HTB activity
            <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="bg-amber-100 p-3 mt-6 rounded-md text-amber-800">
        Note: UI components temporarily simplified for build testing - full functionality will be restored later.
      </div>
    </div>
  );
}