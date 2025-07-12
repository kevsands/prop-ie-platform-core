'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import useProjectData from '@/hooks/useProjectData';
import BuyerJourneyTracker from '@/components/developer/BuyerJourneyTracker';

export default function BuyerJourneyTrackingPage() {
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
          <p className="text-gray-600">Loading buyer journey tracking...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600">Error loading buyer journey tracking</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Buyer Journey Tracking</h2>
          <p className="text-gray-600 mt-1">Track and manage buyer journeys for {project.name}</p>
        </div>
        <div className="text-sm text-gray-500 text-right">
          <div>Active Buyers: {soldUnits + reservedUnits}</div>
          <div>Conversion Rate: {(conversionRate * 100).toFixed(1)}%</div>
        </div>
      </div>

      <BuyerJourneyTracker
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