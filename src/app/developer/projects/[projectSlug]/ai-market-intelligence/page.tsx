'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import useProjectData from '@/hooks/useProjectData';
import AIMarketIntelligence from '@/components/developer/AIMarketIntelligence';

export default function AIMarketIntelligencePage() {
  const params = useParams();
  const projectSlug = params.projectSlug as string;

  const {
    project,
    units,
    isLoading,
    error,
    totalRevenue,
    averageUnitPrice
  } = useProjectData(projectSlug);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI market intelligence...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600">Error loading AI market intelligence</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Market Intelligence</h2>
          <p className="text-gray-600 mt-1">AI-powered market insights and predictions for {project.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
            AI POWERED
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
            PREDICTIVE
          </span>
        </div>
      </div>

      <AIMarketIntelligence
        projectId={project.id}
        units={units}
        totalRevenue={totalRevenue}
        averageUnitPrice={averageUnitPrice}
      />
    </div>
  );
}