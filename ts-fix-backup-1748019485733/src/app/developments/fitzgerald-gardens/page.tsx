'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamically import the BuyerJourneyPage component
const BuyerJourneyPage = dynamic(
  () => import('./BuyerJourneyPage'),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#2B5273]" />
          <p className="text-gray-600">Loading Fitzgerald Gardens...</p>
        </div>
      </div>
    ),
    ssr: false
  }
);

export default function FitzgeraldGardensPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#2B5273]" />
            <p className="text-gray-600">Loading Fitzgerald Gardens...</p>
          </div>
        </div>
      }
    >
      <BuyerJourneyPage />
    </Suspense>
  );
}