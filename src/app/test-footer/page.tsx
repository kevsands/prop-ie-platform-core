import React from 'react';
/**
 * Test page to verify the Footer component is working
 */
export default function TestFooterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Footer Test Page</h1>
        <p className="text-lg text-gray-700 mb-4">
          This is a test page to verify that the new Footer component is working correctly.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Scroll down to see the footer with:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-8">
          <li>Gradient background (slate-800 to slate-900)</li>
          <li>Three-section layout</li>
          <li>Responsive column grid</li>
          <li>Social media icons</li>
          <li>Newsletter signup (mobile only)</li>
          <li>Hover animations</li>
          <li>Legal links</li>
        </ul>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Design</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Modern gradient background</li>
                <li>Clean typography</li>
                <li>Micro-interactions</li>
                <li>2026 design principles</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Technical</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>TypeScript React component</li>
                <li>Tailwind CSS styling</li>
                <li>Full accessibility</li>
                <li>Responsive layout</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
          <p className="text-blue-800">
            <strong>Note:</strong> The footer is rendered through the ClientLayout component, 
            which wraps all pages in the application.
          </p>
        </div>
      </main>
    </div>
  );
}