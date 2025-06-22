/**
 * Executive Analytics Dashboard Page
 * 
 * High-level executive dashboard with key performance indicators
 * and strategic business intelligence
 */

'use client';

import React from 'react';
import ExecutiveAnalyticsDashboard from '@/components/analytics/ExecutiveAnalyticsDashboard';

export default function ExecutiveAnalyticsPage() {
  return (
    <ExecutiveAnalyticsDashboard 
      refreshInterval={180000} // 3 minutes for executives
      defaultView="overview"
      compactMode={false}
    />
  );
}