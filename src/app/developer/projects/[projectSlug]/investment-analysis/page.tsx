'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import useProjectData from '@/hooks/useProjectData';
import InvestmentAnalysisTools from '@/components/developer/InvestmentAnalysisTools';

export default function InvestmentAnalysisPage() {
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
          <p className="text-gray-600">Loading investment analysis...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600">Error loading investment analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Investment Analysis</h2>
          <p className="text-gray-600 mt-1">ROI analysis and investment tools for {project.name}</p>
        </div>
        <div className="text-sm text-gray-500 text-right">
          <div>Project Value: €{(totalRevenue / 1000000).toFixed(1)}M</div>
          <div>Avg. Unit Price: €{Math.round(averageUnitPrice).toLocaleString()}</div>
        </div>
      </div>

      <InvestmentAnalysisTools
        projectId={project.id}
        units={units}
        totalRevenue={totalRevenue}
        averageUnitPrice={averageUnitPrice}
      />
    </div>
  );
}