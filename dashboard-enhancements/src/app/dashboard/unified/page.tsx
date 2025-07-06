'use client';

import React, { Suspense } from 'react';
import { UserJourneyOrchestrator } from '@/features/user-journey/UserJourneyOrchestrator';
import { useSearchParams } from 'next/navigation';

function UnifiedDashboardContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || undefined;
  const journeyId = searchParams.get('id') || undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      <UserJourneyOrchestrator role={role} journeyId={journeyId} />
    </div>
  );
}

export default function UnifiedDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-12 w-48 bg-gray-200 rounded mx-auto mb-4"></div>
            <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
          </div>
        </div>
      </div>
    }>
      <UnifiedDashboardContent />
    </Suspense>
  );
}