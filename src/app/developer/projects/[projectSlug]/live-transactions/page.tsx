'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import useProjectData from '@/hooks/useProjectData';
import TransactionTriangleDashboard from '@/components/developer/TransactionTriangleDashboard';

export default function LiveTransactionsPage() {
  const params = useParams();
  const projectSlug = params.projectSlug as string;

  const {
    project,
    units,
    isLoading,
    error,
    soldUnits,
    reservedUnits,
    totalRevenue,
    salesVelocity,
    conversionRate
  } = useProjectData(projectSlug);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading live transactions...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600">Error loading live transactions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Transactions</h2>
          <p className="text-gray-600 mt-1">Real-time transaction monitoring for {project.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
            LIVE
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
            REAL-TIME
          </span>
        </div>
      </div>

      <TransactionTriangleDashboard
        projectId={project.id}
        units={units}
        soldUnits={soldUnits}
        reservedUnits={reservedUnits}
        totalRevenue={totalRevenue}
        salesVelocity={salesVelocity}
        conversionRate={conversionRate}
      />
    </div>
  );
}