import { Suspense } from 'react';
import { getSecurityMetrics, getSecurityEvents, getAnomalyDetections } from '@/lib/security/securityAnalyticsServer';
import SecurityDashboardClient from './SecurityDashboardClient';
import { SecurityMetricsSkeleton } from '@/components/security/SecurityMetricsSkeleton';

/**
 * Security Dashboard Page (Server Component)
 * Demonstrates the proper usage of server components with security analytics
 * 
 * This server component fetches the initial security data and passes it to the client
 * component for hydration. The client component can then subscribe to real-time updates.
 * 
 * Benefits:
 * - Initial data is loaded on the server for faster page loads
 * - Client component can hydrate with server data and then update with real-time data
 * - SEO friendly since the base content is rendered on the server
 */
export default async function SecurityDashboardPage() {
  // Fetch initial data on the server for improved performance and SEO
  const [metrics, events, anomalies] = await Promise.all([
    getSecurityMetrics({ timeframe: 'last_24_hours' }),
    getSecurityEvents({ limit: 10 }),
    getAnomalyDetections({ includeResolved: false })
  ]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Security Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Monitor your security posture and respond to threats with our real-time security dashboard.
      </p>
      
      <Suspense fallback={<SecurityMetricsSkeleton />}>
        <SecurityDashboardClient 
          initialMetrics={metrics}
          initialEvents={events}
          initialAnomalies={anomalies}
        />
      </Suspense>
    </div>
  );
}

// Add metadata for SEO
export const metadata = {
  title: 'Security Dashboard | PropIE AWS Platform',
  description: 'Monitor and respond to security events and threats in real-time',
};