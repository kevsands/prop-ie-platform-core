import React from 'react';
'use client';

import TestDashboard from '../../../tests/dashboard/TestDashboard';

/**
 * Testing Dashboard Page
 * 
 * This page provides development teams with a comprehensive view of:
 * - Test coverage metrics
 * - Performance test results
 * - Test execution results
 * - Historical trends
 */
export default function TestingDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <TestDashboard />
    </div>
  );
}