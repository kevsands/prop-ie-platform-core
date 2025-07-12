'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import useProjectData from '@/hooks/useProjectData';
import { Camera } from 'lucide-react';

export default function MediaPlansPage() {
  const params = useParams();
  const projectSlug = params.projectSlug as string;

  const {
    project,
    isLoading,
    error
  } = useProjectData(projectSlug);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading media & plans...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600">Error loading media & plans</p>
        </div>
      </div>
    );
  }

  // Dynamic unit type breakdown from real data
  const unitTypes = project.unitBreakdown;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Media & Plans</h2>
          <p className="text-gray-600 mt-1">Manage project media, floor plans, and marketing materials for {project.name}</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Camera size={16} />
          Upload Media
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Floor Plans */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Floor Plans</h4>
          <div className="space-y-3">
            {unitTypes.map((unit, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{unit.type}</span>
                  <div className="flex gap-2">
                    <button className="text-sm text-blue-600 hover:text-blue-800">View</button>
                    <button className="text-sm text-gray-600 hover:text-gray-800">Download</button>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  PDF • Updated 2 weeks ago
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unit Plans */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Unit Plans</h4>
          <div className="space-y-3">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Site Layout Plan</span>
                <div className="flex gap-2">
                  <button className="text-sm text-blue-600 hover:text-blue-800">View</button>
                  <button className="text-sm text-gray-600 hover:text-gray-800">Download</button>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                DWG • Updated 1 week ago
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Landscape Plan</span>
                <div className="flex gap-2">
                  <button className="text-sm text-blue-600 hover:text-blue-800">View</button>
                  <button className="text-sm text-gray-600 hover:text-gray-800">Download</button>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                PDF • Updated 3 days ago
              </div>
            </div>
          </div>
        </div>

        {/* Photos & Videos */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Photos & Videos</h4>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                <Camera size={24} className="text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Marketing Materials */}
      <div className="border-t pt-6">
        <h4 className="font-medium text-gray-900 mb-4">Marketing Materials</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-2">Sales Brochure</h5>
            <p className="text-sm text-gray-600 mb-3">Main marketing brochure with project overview and pricing</p>
            <div className="flex gap-2">
              <button className="text-sm text-blue-600 hover:text-blue-800">View</button>
              <button className="text-sm text-gray-600 hover:text-gray-800">Download</button>
              <button className="text-sm text-green-600 hover:text-green-800">Update</button>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-2">Virtual Tour</h5>
            <p className="text-sm text-gray-600 mb-3">Interactive 3D virtual tour of show homes</p>
            <div className="flex gap-2">
              <button className="text-sm text-blue-600 hover:text-blue-800">View</button>
              <button className="text-sm text-gray-600 hover:text-gray-800">Share</button>
              <button className="text-sm text-green-600 hover:text-green-800">Update</button>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-2">Price List</h5>
            <p className="text-sm text-gray-600 mb-3">Current pricing for all unit types and availability</p>
            <div className="flex gap-2">
              <button className="text-sm text-blue-600 hover:text-blue-800">View</button>
              <button className="text-sm text-gray-600 hover:text-gray-800">Download</button>
              <button className="text-sm text-green-600 hover:text-green-800">Update</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}