/**
 * ================================================================================
 * WEBSOCKET SCALING DASHBOARD
 * Real-time monitoring for WebSocket connection pools at extreme scale
 * Monitors 10,000+ concurrent connections with performance metrics
 * ================================================================================
 */

"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Activity, 
  Users, 
  MessageSquare, 
  Server, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Network,
  Gauge,
  BarChart3,
  Zap,
  Globe,
  RefreshCw
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Types for WebSocket metrics
interface WebSocketMetrics {
  totalConnections: number;
  activeConnections: number;
  connectionsPerSecond: number;
  messagesPerSecond: number;
  averageLatency: number;
  connectionUptime: number;
  errorRate: number;
  poolUtilization: number;
  poolCount: number;
  systemCapacity: {
    maxTotalConnections: number;
    currentUtilization: number;
    remainingCapacity: number;
  };
  performance: {
    queueLength: number;
    compressionEnabled: boolean;
    clusterNodes: number;
  };
  health: {
    allPoolsHealthy: boolean;
    throttleActive: boolean;
  };
}

interface PoolStatus {
  poolId: string;
  connections: number;
  maxConnections: number;
  utilization: number;
  healthyConnections: number;
  isShuttingDown: boolean;
}

interface ConnectionTrend {
  timestamp: string;
  connections: number;
  messagesPerSecond: number;
  latency: number;
  utilization: number;
}

/**
 * WebSocket Scaling Dashboard Component
 */
export const WebSocketScalingDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<WebSocketMetrics | null>(null);
  const [poolStatuses, setPoolStatuses] = useState<PoolStatus[]>([]);
  const [connectionTrends, setConnectionTrends] = useState<ConnectionTrend[]>([]);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fetch WebSocket metrics
  const fetchMetrics = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/websocket-metrics');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data.metrics);
        setPoolStatuses(data.pools);
        
        // Add to trends (keep last 50 data points)
        const newTrend: ConnectionTrend = {
          timestamp: new Date().toLocaleTimeString(),
          connections: data.metrics.totalConnections,
          messagesPerSecond: data.metrics.messagesPerSecond,
          latency: data.metrics.averageLatency,
          utilization: data.metrics.systemCapacity.currentUtilization
        };
        
        setConnectionTrends(prev => {
          const updated = [...prev, newTrend];
          return updated.slice(-50); // Keep last 50 points
        });
        
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch WebSocket metrics:', error);
    }
  }, []);

  // Auto-refresh setup
  useEffect(() => {
    fetchMetrics(); // Initial fetch
    
    if (isAutoRefresh) {
      const interval = setInterval(fetchMetrics, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchMetrics, isAutoRefresh, refreshInterval]);

  // Get status color based on utilization
  const getStatusColor = (utilization: number) => {
    if (utilization < 50) return 'text-green-600';
    if (utilization < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get health indicator
  const getHealthStatus = () => {
    if (!metrics) return { color: 'gray', text: 'Unknown' };
    
    const utilization = metrics.systemCapacity.currentUtilization;
    const isHealthy = metrics.health.allPoolsHealthy && metrics.errorRate < 5;
    
    if (!isHealthy) return { color: 'red', text: 'Unhealthy' };
    if (utilization > 90) return { color: 'orange', text: 'Critical' };
    if (utilization > 70) return { color: 'yellow', text: 'Warning' };
    return { color: 'green', text: 'Healthy' };
  };

  const healthStatus = getHealthStatus();

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading WebSocket metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Network className="h-8 w-8 mr-3 text-blue-600" />
                WebSocket Scaling Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Real-time monitoring for {metrics.totalConnections.toLocaleString()} active connections
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center px-3 py-1 rounded-full bg-${healthStatus.color}-100`}>
                {healthStatus.color === 'green' ? (
                  <CheckCircle className={`h-4 w-4 mr-2 text-${healthStatus.color}-600`} />
                ) : (
                  <AlertTriangle className={`h-4 w-4 mr-2 text-${healthStatus.color}-600`} />
                )}
                <span className={`text-sm font-medium text-${healthStatus.color}-800`}>
                  {healthStatus.text}
                </span>
              </div>
              <button
                onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isAutoRefresh 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {isAutoRefresh ? 'Auto-Refresh On' : 'Auto-Refresh Off'}
              </button>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleString()}
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Connections</p>
                <p className="text-3xl font-bold text-gray-900">
                  {metrics.totalConnections.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {metrics.systemCapacity.remainingCapacity.toLocaleString()} remaining
                </p>
              </div>
              <Users className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Messages/Second</p>
                <p className="text-3xl font-bold text-gray-900">
                  {metrics.messagesPerSecond.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Queue: {metrics.performance.queueLength}
                </p>
              </div>
              <MessageSquare className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Utilization</p>
                <p className={`text-3xl font-bold ${getStatusColor(metrics.systemCapacity.currentUtilization)}`}>
                  {metrics.systemCapacity.currentUtilization.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {metrics.poolCount} active pools
                </p>
              </div>
              <Gauge className="h-12 w-12 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Latency</p>
                <p className="text-3xl font-bold text-gray-900">
                  {metrics.averageLatency}ms
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Error rate: {metrics.errorRate.toFixed(1)}%
                </p>
              </div>
              <Activity className="h-12 w-12 text-purple-600" />
            </div>
          </div>
        </div>

        {/* System Health Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              System Health
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">All Pools Healthy</span>
                <span className={`text-sm font-medium ${
                  metrics.health.allPoolsHealthy ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metrics.health.allPoolsHealthy ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Rate Limiting</span>
                <span className={`text-sm font-medium ${
                  metrics.health.throttleActive ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {metrics.health.throttleActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Compression</span>
                <span className={`text-sm font-medium ${
                  metrics.performance.compressionEnabled ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {metrics.performance.compressionEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cluster Nodes</span>
                <span className="text-sm font-medium text-gray-900">
                  {metrics.performance.clusterNodes}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Capacity Overview
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Connections</span>
                  <span className="text-gray-900">
                    {metrics.totalConnections} / {metrics.systemCapacity.maxTotalConnections}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      metrics.systemCapacity.currentUtilization > 80 ? 'bg-red-600' :
                      metrics.systemCapacity.currentUtilization > 60 ? 'bg-yellow-600' : 'bg-green-600'
                    }`}
                    style={{ width: `${metrics.systemCapacity.currentUtilization}%` }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Active</span>
                  <p className="text-lg font-semibold text-green-600">
                    {metrics.activeConnections.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Available</span>
                  <p className="text-lg font-semibold text-blue-600">
                    {metrics.systemCapacity.remainingCapacity.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
              Performance Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Connections/sec</span>
                <span className="text-sm font-medium text-gray-900">
                  {metrics.connectionsPerSecond.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Uptime</span>
                <span className="text-sm font-medium text-gray-900">
                  {(metrics.connectionUptime / 60).toFixed(1)}m
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pool Utilization</span>
                <span className={`text-sm font-medium ${getStatusColor(metrics.poolUtilization)}`}>
                  {metrics.poolUtilization.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Connection Trends</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={connectionTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="connections" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Connections"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Utilization</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={connectionTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'Utilization']} />
                  <Area 
                    type="monotone" 
                    dataKey="utilization" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.3}
                    name="Utilization %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Pool Status Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Server className="h-5 w-5 mr-2 text-gray-600" />
              Connection Pool Status
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pool ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Connections
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Healthy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {poolStatuses.map((pool) => (
                  <tr key={pool.poolId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {pool.poolId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pool.connections} / {pool.maxConnections}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              pool.utilization > 80 ? 'bg-red-600' :
                              pool.utilization > 60 ? 'bg-yellow-600' : 'bg-green-600'
                            }`}
                            style={{ width: `${pool.utilization}%` }}
                          />
                        </div>
                        <span className={`text-sm font-medium ${getStatusColor(pool.utilization)}`}>
                          {pool.utilization.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pool.healthyConnections} / {pool.connections}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        pool.isShuttingDown 
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {pool.isShuttingDown ? 'Shutting Down' : 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebSocketScalingDashboard;