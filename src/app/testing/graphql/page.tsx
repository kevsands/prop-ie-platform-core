'use client';

import React from 'react';

// Inline simplified QueryClientWrapper for build testing
const QueryClientWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <div className="bg-amber-50 p-3 mb-2 rounded text-amber-800 text-sm">
        <div className="font-medium">Simplified QueryClientWrapper</div>
        <div>This is a simplified version for build testing. No actual query client is provided.</div>
      </div>
      {children}
    </>
  );
};

// Inline simplified GraphQLTester component for build testing
const GraphQLTester: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-amber-50 p-3 mb-4 rounded text-amber-800 text-sm">
        <div className="font-medium">Simplified GraphQL Tester</div>
        <div>This is a simplified version for build testing. No actual GraphQL queries are performed.</div>
      </div>

      <h1 className="text-2xl font-bold mb-6">GraphQL Connection Tester</h1>

      <div className="bg-white p-4 rounded shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-2">Test Controls</h2>
        <p className="text-gray-600 mb-4">Here you would see controls to test different GraphQL queries.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border p-3 rounded">
            <h3 className="font-medium">Development ID Query</h3>
            <p className="mt-1 text-sm text-gray-600">Query a development by ID</p>
          </div>

          <div className="border p-3 rounded">
            <h3 className="font-medium">Development Slug Query</h3>
            <p className="mt-1 text-sm text-gray-600">Query a development by slug</p>
          </div>

          <div className="border p-3 rounded">
            <h3 className="font-medium">All Developments Query</h3>
            <p className="mt-1 text-sm text-gray-600">Query all developments</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-lg font-semibold mb-2">Mock Data Display</h2>
        <p className="text-gray-600 mb-4">
          In this section, you would see the results of GraphQL queries displayed.
          For build testing, we're showing a simplified version.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {[12].map(id => (
            <div key={id} className="border p-4 rounded">
              <h3 className="text-lg font-bold">Sample Development {id}</h3>
              <p className="mt-2 text-gray-600">This is a sample development for build testing.</p>
              <div className="mt-2">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  AVAILABLE
                </span>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <p>Location: Dublin, Ireland</p>
                <p>Units: 24 total, 8 available</p>
                <p>Price Range: €350,000 - €450,000</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * GraphQL Testing Page
 * 
 * This page is used to test the GraphQL integration with the UI components
 * and ensure that data flows correctly between the API and UI.
 */
export default function GraphQLTestingPage() {
  return (
    <QueryClientWrapper>
      <GraphQLTester />
    </QueryClientWrapper>
  );
}