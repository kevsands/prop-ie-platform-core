'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import useProjectData from '@/hooks/useProjectData';
import { Edit3 } from 'lucide-react';
import EditableProjectOverview from '@/components/developer/EditableProjectOverview';
import PropertyDataManager from '@/components/developer/PropertyDataManager';

export default function ProjectOverviewPage() {
  const params = useParams();
  const projectSlug = params.projectSlug as string;

  const {
    project,
    units,
    isLoading,
    error,
    averageUnitPrice
  } = useProjectData(projectSlug);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project overview...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600">Error loading project overview</p>
        </div>
      </div>
    );
  }

  // Dynamic unit type breakdown from real data
  const unitTypes = project.unitBreakdown;

  return (
    <div className="space-y-6">
      {/* Quick Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Project Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Project Details</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-gray-600">Project Start</span>
              <span className="font-medium">{new Date(project.timeline.projectStart).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-gray-600">Expected Completion</span>
              <span className="font-medium">{new Date(project.timeline.plannedCompletion).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-gray-600">Average Unit Price</span>
              <span className="font-medium">€{Math.round(averageUnitPrice).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-gray-600">Current Phase</span>
              <span className="font-medium">{project.timeline.currentPhase}</span>
            </div>
          </div>
        </div>

        {/* Sales Summary */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Sales Summary</h3>
          <div className="space-y-3">
            {unitTypes.map((unit, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-900">{unit.type}</h4>
                  <span className="text-sm text-gray-600">{unit.totalCount} units</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Sold: {unit.sold}</span>
                  <span>Reserved: {unit.reserved}</span>
                  <span>Available: {unit.available}</span>
                </div>
                <div className="text-sm font-medium text-blue-600">
                  {typeof unit.priceRange === 'object' 
                    ? `€${Math.round(unit.priceRange.min).toLocaleString()} - €${Math.round(unit.priceRange.max).toLocaleString()}`
                    : unit.priceRange
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Comprehensive Editable Project Management */}
      <div className="border-t pt-6">
        <div className="flex items-center gap-3 mb-6">
          <Edit3 className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">Comprehensive Project Management</h3>
        </div>
        <EditableProjectOverview
          projectId={project.id}
          onSave={async (data) => {
            try {
              const response = await fetch(`/api/projects/${project.id}/comprehensive`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
              });
              return response.ok;
            } catch (error) {
              console.error('Failed to save project data:', error);
              return false;
            }
          }}
        />
      </div>

      {/* Property Data Manager */}
      <div className="border-t pt-6">
        <div className="flex items-center gap-3 mb-6">
          <Edit3 className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">Property Data Manager</h3>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
            LIVE DATA
          </span>
        </div>
        <PropertyDataManager
          projectId={project.id}
          onDataUpdate={async (dataType, updates) => {
            try {
              const response = await fetch(`/api/projects/${project.id}/data`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ dataType, updates })
              });
              const result = await response.json();
              return result.success;
            } catch (error) {
              console.error('Failed to update property data:', error);
              return false;
            }
          }}
        />
      </div>
    </div>
  );
}