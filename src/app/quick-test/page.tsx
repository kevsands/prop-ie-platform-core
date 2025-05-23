'use client';

import React from 'react';

export default function QuickTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Platform Quick Test</h1>

      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        <p className="font-bold">✓ App is running successfully on port 3000!</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Navigation Status</h2>
        <p className="mb-2">Using simplified navigation that should work immediately.</p>
        <p className="text-sm text-gray-600">Hover over "Properties" or "Solutions" to see dropdowns.</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Key Demo Pages</h2>
        <ul className="space-y-2">
          <li><a href="/" className="text-blue-600 hover:underline">Home Page</a></li>
          <li><a href="/first-time-buyers/register" className="text-blue-600 hover:underline">First Time Buyers Registration</a></li>
          <li><a href="/login" className="text-blue-600 hover:underline">Login</a></li>
          <li><a href="/properties/search" className="text-blue-600 hover:underline">Property Search</a></li>
          <li><a href="/buyer" className="text-blue-600 hover:underline">Buyer Dashboard</a></li>
        </ul>
      </div>
    </div>
  );
}