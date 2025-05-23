
'use client';

import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Lazy load heavy components
const PropertyViewer = lazy(() => import('@/components/property/PropertyViewer'));
const Analytics = lazy(() => import('@/components/analytics/Dashboard'));

export default function OptimizedPage() {
  return (
    <div>
      <Suspense fallback={<LoadingSpinner />}>
        <PropertyViewer />
      </Suspense>
      
      <Suspense fallback={<div>Loading analytics...</div>}>
        <Analytics />
      </Suspense>
    </div>
  );
}
