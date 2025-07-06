'use client';

import React from 'react';
// Temporarily comment out problematic import for build testing
// import { EnhancedDeveloperDashboard } from '@/components/dashboard/EnhancedDeveloperDashboard';

export default function DeveloperDashboardTestPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Developer Dashboard Preview</h1>
      <p className="text-gray-600 mb-6">This page shows the enhanced developer dashboard with mock data for testing purposes.</p>
      {/* <EnhancedDeveloperDashboard userId="test-user-id" /> */}
      <div className="p-4 border rounded bg-gray-100 text-gray-700">
        Dashboard temporarily disabled for build testing
      </div>
    </div>
  );
}