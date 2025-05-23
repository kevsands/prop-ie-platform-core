'use client';

import React from 'react';

/**
 * Simplified stub implementation of Trusted Devices Component
 * 
 * This component displays a list of trusted devices without the actual
 * functionality of managing them.
 */
const TrustedDevices: React.FC = () => {
  // Mock data for display purposes
  const mockDevices = [
    {
      id: 'device-1',
      name: 'Current Device',
      location: 'Dublin, Ireland',
      firstSeen: 'Today',
      lastSeen: 'Now',
      isCurrent: true
    },
    {
      id: 'device-2',
      name: 'iPhone',
      location: 'Dublin, Ireland',
      firstSeen: '1 month ago',
      lastSeen: '2 days ago',
      isCurrent: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="border rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Trusted Devices</h2>
          <p className="text-sm text-gray-500">
            Manage devices that are trusted for accessing your account
          </p>
        </div>

        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Device</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Location</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">First Seen</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Last Active</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {mockDevices.map((device: any) => (
                  <tr key={device.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <span className="ml-2">{device.name}</span>
                        {device.isCurrent && (
                          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{device.location}</td>
                    <td className="px-4 py-3 text-sm">{device.firstSeen}</td>
                    <td className="px-4 py-3 text-sm">{device.lastSeen}</td>
                    <td className="px-4 py-3 text-sm">
                      {!device.isCurrent && (
                        <button className="text-red-600 hover:text-red-800">
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-between">
          <div className="text-sm text-gray-500">
            Trusted devices help improve your account security
          </div>
          <button className="px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
            Trust Current Device
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrustedDevices;