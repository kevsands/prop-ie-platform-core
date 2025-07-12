'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import useProjectData from '@/hooks/useProjectData';
import InteractiveSitePlan from '@/components/developer/InteractiveSitePlan';

export default function InteractiveSitePlanPage() {
  const params = useParams();
  const projectSlug = params.projectSlug as string;
  const [selectedUnit, setSelectedUnit] = useState(null);

  const {
    project,
    isLoading,
    error,
    getUnitsForSitePlan
  } = useProjectData(projectSlug);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interactive site plan...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600">Error loading interactive site plan</p>
        </div>
      </div>
    );
  }

  // Get optimized units for site plan from data service
  const siteUnits = getUnitsForSitePlan();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Interactive Site Plan</h2>
          <p className="text-gray-600 mt-1">Visual site plan and unit management for {project.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
            INTERACTIVE
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
            3D ENABLED
          </span>
        </div>
      </div>

      <InteractiveSitePlan 
        units={siteUnits}
        projectName={project.name}
        onUnitSelect={(unit) => setSelectedUnit(unit)}
      />

      {selectedUnit && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border">
          <h3 className="font-semibold text-blue-900">Selected Unit: {selectedUnit.number}</h3>
          <p className="text-blue-700">Click on units in the site plan to view details and manage their status.</p>
        </div>
      )}
    </div>
  );
}