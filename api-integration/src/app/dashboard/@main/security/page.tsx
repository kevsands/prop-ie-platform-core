'use client';

import React, { useState } from 'react';
import { MFASetup } from '../../../../components/security/MFASetup';
import TrustedDevices from '../../../../components/security/TrustedDevices';
// Removed import for build testing;

// Simplified component definitions for build testing

// Simplified Card components with proper TypeScript types
interface CardProps {
  className?: string;
  children: React.ReactNode;
}

const Card = ({ className = "", children }: CardProps) => (
  <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ className = "", children }: CardProps) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ className = "", children }: CardProps) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ className = "", children }: CardProps) => (
  <p className={`text-sm text-gray-500 ${className}`}>
    {children}
  </p>
);

const CardContent = ({ className = "", children }: CardProps) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ className = "", children }: CardProps) => (
  <div className={`flex items-center p-6 pt-0 ${className}`}>
    {children}
  </div>
);

/**
 * Simplified stub implementation of Security Settings Page
 * 
 * This page displays a basic security dashboard without complex functionality.
 */
export default function SecuritySettings() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showMFASetup, setShowMFASetup] = useState(false);
  
  // Mock security metrics
  const securityScore = 85;
  const securityRecommendations = [
    'Add a backup phone number for account recovery',
    'Review recent account activity regularly'
  ];
  const trustedDevicesCount = 2;
  
  // Mock MFA status
  const mfaEnabled = true;
  
  // Mock session status
  const fingerprintValid = true;
  
  // Mock activity logging status
  const activityLoggingEnabled = true;

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account security and privacy
        </p>
      </header>

      {/* Simple Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px space-x-8">
            {['overview', 'authentication', 'devices', 'activity'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 font-medium text-sm capitalize border-b-2 ${
                  activeTab === tab 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Security Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Security Status</CardTitle>
              <CardDescription>
                Your account security overview
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Security Score */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold">Security Score</h3>
                  <span className="text-sm font-medium">{securityScore}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="h-2.5 rounded-full bg-green-600"
                    style={{ width: `${securityScore}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Multi-Factor Authentication</span>
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    Enabled
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Trusted Devices</span>
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    2 Devices
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Session Security</span>
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    Valid
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Activity Monitoring</span>
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    Active
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Password Status</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                    Active
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold mb-2">Recommendations</h3>
                <ul className="space-y-2 text-sm">
                  {securityRecommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-500 mr-2">⚠️</span>
                      <span>{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common security management tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <button 
                  onClick={() => setShowMFASetup(true)} 
                  className="w-full text-left px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Manage Multi-Factor Authentication
                </button>
                
                <button 
                  onClick={() => setActiveTab('devices')} 
                  className="w-full text-left px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Manage Trusted Devices
                </button>
                
                <button 
                  className="w-full text-left px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Change Password
                </button>
                
                <button 
                  onClick={() => setActiveTab('activity')} 
                  className="w-full text-left px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  View Account Activity
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Authentication Tab */}
      {activeTab === 'authentication' && (
        <div className="space-y-6">
          {/* MFA Section */}
          <Card>
            <CardHeader>
              <CardTitle>Multi-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account with MFA
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showMFASetup ? (
                <MFASetup 
                  onComplete={() => setShowMFASetup(false)} 
                  onCancel={() => setShowMFASetup(false)} 
                />
              ) : (
                <div className="space-y-4">
                  <p>
                    Multi-factor authentication adds an additional layer of security to your
                    account by requiring more than just a password to sign in.
                  </p>
                  
                  <button 
                    onClick={() => setShowMFASetup(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Manage MFA Settings
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Password Section */}
          <Card>
            <CardHeader>
              <CardTitle>Password Management</CardTitle>
              <CardDescription>
                Regularly update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  It's a good security practice to change your password regularly.
                  Your password should be unique and not used for other accounts.
                </p>
                
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Change Password
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Trusted Devices Tab */}
      {activeTab === 'devices' && (
        <Card>
          <CardHeader>
            <CardTitle>Trusted Devices</CardTitle>
            <CardDescription>
              Manage devices that are trusted to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrustedDevices />
          </CardContent>
        </Card>
      )}

      {/* Account Activity Tab */}
      {activeTab === 'activity' && (
        <Card>
          <CardHeader>
            <CardTitle>Account Activity</CardTitle>
            <CardDescription>
              Review recent account activity and security events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Activity
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP Address
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date().toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Security settings viewed
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        127.0.0.1
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Local
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(Date.now() - 86400000).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Login successful
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        127.0.0.1
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Local
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="text-center">
                <button className="px-4 py-2 border rounded-md hover:bg-gray-50">
                  Load More
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}