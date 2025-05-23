import React from 'react';
'use client';

export default function DebugPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
      <div className="space-y-4">
        <a href="/first-time-buyers" className="block p-4 bg-blue-500 text-white rounded hover:bg-blue-600">
          Go to First Time Buyers Page
        </a>
        <div className="p-4 bg-gray-100 rounded">
          <p>App is running on port: 3001</p>
          <p>Environment: Development</p>
        </div>
      </div>
    </div>
  );
}