import React, { Suspense } from 'react';
import StepUpAuthContent from './StepUpAuthContent';

function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">Loading authentication...</p>
      </div>
    </div>
  );
}

export default function StepUpAuthPage() {
  return (
    <Suspense fallback={<Loading />}>
      <StepUpAuthContent />
    </Suspense>
  );
}