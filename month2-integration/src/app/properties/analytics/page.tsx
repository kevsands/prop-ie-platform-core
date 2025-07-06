'use client';

import React from 'react';
import PropertyAnalyticsDashboard from '@/features/property-analytics/PropertyAnalyticsDashboard';
import { useSearchParams } from 'next/navigation';

export default function PropertyAnalyticsPage() {
  const searchParams = useSearchParams();
  const location = searchParams.get('location') || 'Dublin';
  const propertyType = searchParams.get('type');
  const developmentId = searchParams.get('developmentId');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <PropertyAnalyticsDashboard
          location={location}
          developmentId={developmentId}
        />
      </div>
    </div>
  );
}