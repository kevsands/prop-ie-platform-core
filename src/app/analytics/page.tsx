/**
 * Analytics Dashboard Page
 * 
 * Executive analytics dashboard leveraging AI-enhanced multi-professional coordination
 * Provides comprehensive business intelligence and predictive insights
 */

'use client';

import React from 'react';
import ExecutiveAnalyticsDashboard from '@/components/analytics/ExecutiveAnalyticsDashboard';

export default function AnalyticsPage() {
  return (
    <ExecutiveAnalyticsDashboard 
      refreshInterval={300000} // 5 minutes
      defaultView="overview"
      compactMode={false}
    />
  );
}