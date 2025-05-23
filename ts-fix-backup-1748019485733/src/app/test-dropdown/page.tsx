'use client';

import TestNavigation from '@/components/navigation/TestNavigation';

export default function TestDropdownPage() {
  return (
    <div className="min-h-screen">
      <TestNavigation />

      <div className="pt-20 p-8">
        <h1 className="text-3xl font-bold mb-4">Navigation Dropdown Test</h1>
        <p className="mb-4">Testing if the dropdown navigation works correctly.</p>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Instructions:</h2>
          <ul className="list-disc pl-5">
            <li>Hover over the "Test Dropdown" button in the navigation</li>
            <li>The dropdown menu should appear smoothly</li>
            <li>You should be able to move your mouse into the dropdown without it closing</li>
            <li>The dropdown should close when you move your mouse away</li>
          </ul>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Common Issues:</h2>
          <ul className="list-disc pl-5">
            <li>Z-index conflicts with other elements</li>
            <li>Pointer-events being disabled</li>
            <li>Event handlers not properly attached</li>
            <li>CSS transitions causing timing issues</li>
          </ul>
        </div>
      </div>
    </div>
  );
}