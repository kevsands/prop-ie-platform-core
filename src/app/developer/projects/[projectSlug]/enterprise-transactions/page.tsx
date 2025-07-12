'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import useProjectData from '@/hooks/useProjectData';
import EnterpriseTransactionManager from '@/components/developer/EnterpriseTransactionManager';

export default function EnterpriseTransactionsPage() {
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
          <p className="text-gray-600">Loading enterprise transactions...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600">Error loading enterprise transactions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Enterprise Transaction Manager</h2>
          <p className="text-gray-600 mt-1">Advanced transaction management for {project.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
            ENTERPRISE
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
            REAL-TIME
          </span>
        </div>
      </div>

      <EnterpriseTransactionManager
        projectId={project.id}
        onTransactionUpdate={async (transactionId, updates) => {
          try {
            const response = await fetch(`/api/projects/${project.id}/transactions/${transactionId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(updates)
            });
            const result = await response.json();
            return result.success;
          } catch (error) {
            console.error('Failed to update transaction:', error);
            return false;
          }
        }}
      />
    </div>
  );
}