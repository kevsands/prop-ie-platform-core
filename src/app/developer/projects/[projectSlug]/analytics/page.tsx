'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import useProjectData from '@/hooks/useProjectData';
import EnhancedProjectAnalytics from '@/components/developer/EnhancedProjectAnalytics';

export default function AnalyticsPage() {
  const params = useParams();
  const projectSlug = params.projectSlug as string;

  const {
    project,
    units,
    isLoading,
    error,
    totalRevenue,
    averageUnitPrice,
    salesVelocity,
    conversionRate
  } = useProjectData(projectSlug);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading enhanced analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600">Error loading enhanced analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Enhanced Analytics</h2>
          <p className="text-gray-600 mt-1">Comprehensive analytics dashboard for {project.name}</p>
        </div>
        <div className="text-sm text-gray-500 text-right">
          <div>Sales Velocity: {salesVelocity} units/month</div>
          <div>Conversion Rate: {(conversionRate * 100).toFixed(1)}%</div>
        </div>
      </div>

      <EnhancedProjectAnalytics
        projectId={project.id}
        units={units}
        totalRevenue={totalRevenue}
        averageUnitPrice={averageUnitPrice}
        salesVelocity={salesVelocity}
        conversionRate={conversionRate}
      />
    </div>
  );
}