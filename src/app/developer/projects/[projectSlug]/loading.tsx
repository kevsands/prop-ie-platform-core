import React from 'react';

export default function ProjectLoading() {
  return (
    <div className="space-y-6">
      {/* Project Header Skeleton */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              <div>
                <div className="h-8 bg-gray-200 rounded w-64 animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>

        {/* Progress Bar Skeleton */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 animate-pulse"></div>
        </div>
      </div>

      {/* Quick Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-12 animate-pulse"></div>
              </div>
              <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="flex min-h-[700px]">
          {/* Sidebar Skeleton */}
          <div className="w-72 bg-gradient-to-b from-gray-50 to-gray-100 border-r border-gray-200">
            {/* Sidebar Header Skeleton */}
            <div className="p-4 bg-gray-300 animate-pulse">
              <div className="h-6 bg-gray-400 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-400 rounded w-32"></div>
            </div>

            {/* Navigation Skeleton */}
            <div className="p-4">
              <div className="space-y-6">
                {Array.from({ length: 4 }, (_, sectionIndex) => (
                  <div key={sectionIndex}>
                    <div className="h-3 bg-gray-200 rounded w-24 animate-pulse mb-3"></div>
                    <div className="space-y-1">
                      {Array.from({ length: 3 }, (_, itemIndex) => (
                        <div key={itemIndex} className="flex items-center gap-3 px-3 py-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="flex-1 p-6 bg-white">
            <div className="space-y-6">
              {/* Header Skeleton */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="h-8 bg-gray-200 rounded w-64 animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>

              {/* Content Skeleton */}
              <div className="space-y-4">
                {Array.from({ length: 6 }, (_, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="h-6 bg-gray-200 rounded w-40 animate-pulse mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}