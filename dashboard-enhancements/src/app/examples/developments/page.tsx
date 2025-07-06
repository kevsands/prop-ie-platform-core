'use client';

import { Suspense } from 'react';
import DevelopmentList from '../../../components/examples/DevelopmentList';
import { Toaster } from 'sonner';

export default function DevelopmentsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Suspense fallback={<div>Loading...</div>}>
        <DevelopmentList />
      </Suspense>
      <Toaster position="top-right" />
    </div>
  );
}