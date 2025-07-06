'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ClientLayout from '../../ClientLayout';

function ProjectDetailsContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams?.get('id') || 'unknown';

  return (
    <ClientLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Project Details</h1>
        <p className="text-lg text-gray-700 mb-8">
          Viewing project with ID: {projectId}
        </p>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Project Information</h2>
          <p className="text-gray-600 mb-4">
            This is a placeholder for project details. In a real application, this would show
            comprehensive information about the project, including status, timelines, and resources.
          </p>
        </div>
      </div>
    </ClientLayout>
  );
}

export default function ProjectDetailsPage() {
  return (
    <Suspense fallback={
      <ClientLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="bg-white shadow rounded-lg p-6">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </ClientLayout>
    }>
      <ProjectDetailsContent />
    </Suspense>
  );
}