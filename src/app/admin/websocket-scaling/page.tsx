/**
 * ================================================================================
 * WEBSOCKET SCALING ADMINISTRATION PAGE
 * Admin interface for monitoring and managing WebSocket connection pools
 * Enterprise-grade real-time connection monitoring for 10,000+ connections
 * ================================================================================
 */

import { Metadata } from 'next';
import WebSocketScalingDashboard from '@/components/admin/WebSocketScalingDashboard';

export const metadata: Metadata = {
  title: 'WebSocket Scaling - PROP.ie Admin',
  description: 'Monitor and manage WebSocket connection pools for extreme scale scenarios',
};

/**
 * WebSocket Scaling Administration Page
 */
export default function WebSocketScalingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  WebSocket Connection Pool Management
                </h1>
                <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span>Real-time monitoring for enterprise-scale WebSocket infrastructure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <WebSocketScalingDashboard />
    </div>
  );
}

/**
 * Export for dynamic imports
 */
export { WebSocketScalingDashboard };