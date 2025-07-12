'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import useProjectData from '@/hooks/useProjectData';
import ProjectTimelineDashboard from '@/components/developer/ProjectTimelineDashboard';

export default function TimelinePage() {
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
          <p className="text-gray-600">Loading project timeline...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600">Error loading project timeline</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Timeline</h2>
          <p className="text-gray-600 mt-1">Track progress and milestones for {project.name}</p>
        </div>
        <div className="text-sm text-gray-500 text-right">
          <div>Current Phase: {project.timeline.currentPhase}</div>
          <div>Progress: {project.timeline.progressPercentage}% Complete</div>
        </div>
      </div>

      <ProjectTimelineDashboard />
    </div>
  );
}