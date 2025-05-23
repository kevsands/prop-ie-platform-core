import React from 'react';

/**
 * Loading component for properties page
 * 
 * App Router will automatically show this component while the page is loading
 */
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8" data-testid="loading-skeleton">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 animate-pulse">
        Loading properties...
      </h1>

      {/* Filter skeleton */}
      <div className="mb-8">
        <div className="h-10 bg-gray-200 rounded-md w-full max-w-3xl animate-pulse"></div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_index: any) => (
          <div key={index} className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-300"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3 mt-4"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-center mt-8">
        <div className="h-10 bg-gray-200 rounded-md w-64 animate-pulse"></div>
      </div>
    </div>
  );
}