import React from 'react';
import { Suspense } from 'react';
import { getSecurityMetrics, getSecurityEvents, getAnomalyDetections, getThreatIndicators, getSecuritySnapshot } from '@/lib/security/securityAnalyticsServer';
import { SecurityMetricsSkeleton } from '@/components/security/SecurityMetricsSkeleton';
import { Metadata } from 'next';
import SecurityDashboardClient from './SecurityDashboardClient';
import { AnalyticsTimeframe } from '@/lib/security/securityAnalyticsTypes';

/**
 * Enhanced Security Dashboard Page (Server Component)
 * Compatible with AWS Amplify v6 and Next.js App Router
 * 
 * This server component fetches the initial security data and passes it to the client
 * component for hydration. The client component can then subscribe to real-time updates.
 * 
 * Benefits:
 * - Initial data is loaded on the server for faster page loads and better SEO
 * - Client component can hydrate with server data and then update with real-time data
 * - Optimized for performance with proper error handling and loading states
 * - Implements proper Next.js App Router patterns with Suspense
 */
export default async function EnhancedSecurityDashboardPage() {
  // Fetch initial security data on the server
  // This uses the React cache() function internally for optimized data fetching
  const securitySnapshot = await getSecuritySnapshot({ 
    timeframe: AnalyticsTimeframe.LAST_24_HOURS,
    includeResolved: false,
    withRecommendations: true
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Security Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Monitor and respond to security events with real-time analytics.
      </p>

      <Suspense fallback={<SecurityMetricsSkeleton showCharts={true} showTimeline={true} />}>
        <SecurityDashboardClient 
          initialMetrics={securitySnapshot.metrics}
          initialEvents={securitySnapshot.recentEvents}
          initialAnomalies={securitySnapshot.activeAnomalies}
          initialThreats={securitySnapshot.activeThreatIndicators}
          securityScore={securitySnapshot.securityScore}
          securityStatus={securitySnapshot.securityStatus}
        />
      </Suspense>
    </div>
  );
}

// Export metadata for SEO optimization
export const metadata: Metadata = {
  title: 'Security Dashboard | PropIE AWS Platform',
  description: 'Monitor and respond to security events and threats in real-time with comprehensive analytics.',
  keywords: 'security, monitoring, threat detection, analytics, dashboard'};