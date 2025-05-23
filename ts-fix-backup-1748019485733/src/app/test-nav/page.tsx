'use client';

export default function TestNavPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Navigation Test Page</h1>
        <p className="text-lg mb-2">This page is to test if the navigation is visible.</p>
        <p>If you can see the navigation bar at the top of this page with:</p>
        <ul className="list-disc ml-8 mt-2">
          <li>Prop.ie logo on the left</li>
          <li>Home Buyers dropdown</li>
          <li>Developments dropdown</li>
          <li>Professionals dropdown</li>
          <li>Log In button on the right</li>
        </ul>
        <p className="mt-4">Then the navigation is working correctly.</p>
        <div className="mt-8 p-4 bg-yellow-100 border border-yellow-400 rounded">
          <p className="font-semibold">Debug Info:</p>
          <p>Current URL: {typeof window !== 'undefined' ? window.location.href : 'Server Side'}</p>
          <p>Nav should be visible with z-index: 100</p>
        </div>
      </div>
    </div>
  );
}