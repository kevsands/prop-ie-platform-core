'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import useProjectData from '@/hooks/useProjectData';
import EnterpriseTeamManager from '@/components/developer/EnterpriseTeamManager';

export default function EnterpriseTeamManagerPage() {
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
          <p className="text-gray-600">Loading enterprise team manager...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600">Error loading enterprise team manager</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Enterprise Team Manager</h2>
          <p className="text-gray-600 mt-1">Advanced team management and collaboration for {project.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
            ENTERPRISE
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
            COLLABORATIVE
          </span>
        </div>
      </div>

      <EnterpriseTeamManager
        projectId={project.id}
        onTeamUpdate={async (memberId, updates) => {
          try {
            const response = await fetch(`/api/projects/${project.id}/team/${memberId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(updates)
            });
            const result = await response.json();
            return result.success;
          } catch (error) {
            console.error('Failed to update team member:', error);
            return false;
          }
        }}
      />
    </div>
  );
}