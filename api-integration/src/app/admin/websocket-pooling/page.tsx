'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Server,
  Users,
  Zap,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Clock,
  Globe,
  Monitor,
  Cpu,
  HardDrive,
  Wifi,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Settings,
  Play,
  Pause,
  Download,
  Eye,
  Target,
  Gauge,
  Network,
  Layers,
  Shield,
  Timer
} from 'lucide-react';

// Mock data structures for the demo
interface PoolMetrics {
  poolId: string;
  totalConnections: number;
  activeConnections: number;
  connectionsPerSecond: number;
  messagesPerSecond: number;
  averageLatency: number;
  connectionUptime: number;
  errorRate: number;
  poolUtilization: number;
  status: 'healthy' | 'warning' | 'critical';
}

interface ConnectionInfo {
  id: string;
  userId?: string;
  ipAddress: string;
  connectedAt: Date;
  lastActivity: Date;
  messagesSent: number;
  messagesReceived: number;
  isHealthy: boolean;
  poolId: string;
  subscriptions: string[];
}

interface LoadBalancerStats {
  strategy: 'round_robin' | 'least_connections' | 'weighted';
  requestsRouted: number;
  averageResponseTime: number;
  poolSelections: { [poolId: string]: number };
  efficiency: number;
}

export default function WebSocketPoolingPage() {
  const [poolMetrics, setPoolMetrics] = useState<PoolMetrics[]>([]);
  const [connections, setConnections] = useState<ConnectionInfo[]>([]);
  const [loadBalancerStats, setLoadBalancerStats] = useState<LoadBalancerStats | null>(null);
  const [selectedPool, setSelectedPool] = useState<string>('all');
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [loading, setLoading] = useState(true);

  // Simulate real-time data updates
  useEffect(() => {
    generateMockData();
    const interval = setInterval(generateMockData, 5000);
    return () => clearInterval(interval);
  }, []);

  const generateMockData = () => {
    // Generate mock pool metrics
    const pools: PoolMetrics[] = [
      {
        poolId: 'pool-primary',
        totalConnections: 487,
        activeConnections: 463,
        connectionsPerSecond: 12.3,
        messagesPerSecond: 1247,
        averageLatency: 23,
        connectionUptime: 99.2,
        errorRate: 0.8,
        poolUtilization: 48.7,
        status: 'healthy'
      },
      {
        poolId: 'pool-secondary',
        totalConnections: 312,
        activeConnections: 298,
        connectionsPerSecond: 8.7,
        messagesPerSecond: 892,
        averageLatency: 31,
        connectionUptime: 98.9,
        errorRate: 1.2,
        poolUtilization: 31.2,
        status: 'healthy'
      },
      {
        poolId: 'pool-realtime',
        totalConnections: 156,
        activeConnections: 144,
        connectionsPerSecond: 4.2,
        messagesPerSecond: 2341,
        averageLatency: 18,
        connectionUptime: 99.7,
        errorRate: 0.3,
        poolUtilization: 15.6,
        status: 'healthy'
      },
      {
        poolId: 'pool-analytics',
        totalConnections: 89,
        activeConnections: 82,
        connectionsPerSecond: 2.1,
        messagesPerSecond: 445,
        averageLatency: 67,
        connectionUptime: 97.8,
        errorRate: 2.8,
        poolUtilization: 8.9,
        status: 'warning'
      }
    ];

    // Generate mock connections
    const mockConnections: ConnectionInfo[] = [];
    pools.forEach(pool => {
      for (let i = 0; i < Math.min(pool.activeConnections, 50); i++) {
        mockConnections.push({
          id: `${pool.poolId}_conn_${i}`,
          userId: Math.random() > 0.3 ? `user_${Math.floor(Math.random() * 1000)}` : undefined,
          ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          connectedAt: new Date(Date.now() - Math.random() * 3600000),
          lastActivity: new Date(Date.now() - Math.random() * 300000),
          messagesSent: Math.floor(Math.random() * 100),
          messagesReceived: Math.floor(Math.random() * 150),
          isHealthy: Math.random() > 0.1,
          poolId: pool.poolId,
          subscriptions: ['property_updates', 'user_notifications'].slice(0, Math.floor(Math.random() * 2) + 1)
        });
      }
    });

    // Generate load balancer stats
    const lbStats: LoadBalancerStats = {
      strategy: 'least_connections',
      requestsRouted: 15623,
      averageResponseTime: 89,
      poolSelections: {
        'pool-primary': 6234,
        'pool-secondary': 4789,
        'pool-realtime': 2890,
        'pool-analytics': 1710
      },
      efficiency: 94.7
    };

    setPoolMetrics(pools);
    setConnections(mockConnections);
    setLoadBalancerStats(lbStats);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-amber-600 bg-amber-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle size={20} className="text-green-600" />;
      case 'warning': return <AlertTriangle size={20} className="text-amber-600" />;
      case 'critical': return <AlertCircle size={20} className="text-red-600" />;
      default: return <Monitor size={20} className="text-gray-600" />;
    }
  };

  const aggregatedMetrics = poolMetrics.reduce((acc, pool) => ({
    totalConnections: acc.totalConnections + pool.totalConnections,
    activeConnections: acc.activeConnections + pool.activeConnections,
    messagesPerSecond: acc.messagesPerSecond + pool.messagesPerSecond,
    averageLatency: (acc.averageLatency + pool.averageLatency) / 2,
    poolCount: acc.poolCount + 1
  }), {
    totalConnections: 0,
    activeConnections: 0,
    messagesPerSecond: 0,
    averageLatency: 0,
    poolCount: 0
  });

  const filteredConnections = selectedPool === 'all' 
    ? connections 
    : connections.filter(conn => conn.poolId === selectedPool);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Network size={28} className="text-blue-600" />
              WebSocket Connection Pooling
            </h1>
            <p className="text-gray-600 mt-1">
              Advanced connection pooling for extreme scale scenarios - monitoring {aggregatedMetrics.totalConnections} total connections
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isMonitoring 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isMonitoring ? <Pause size={16} /> : <Play size={16} />}
              {isMonitoring ? 'Monitoring Active' : 'Start Monitoring'}
            </button>
            
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Total Connections</p>
              <p className="text-2xl font-bold text-blue-900">{aggregatedMetrics.totalConnections.toLocaleString()}</p>
            </div>
            <Users size={24} className="text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Active Connections</p>
              <p className="text-2xl font-bold text-green-900">{aggregatedMetrics.activeConnections.toLocaleString()}</p>
            </div>
            <Activity size={24} className="text-green-600" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-800">Messages/Second</p>
              <p className="text-2xl font-bold text-purple-900">{aggregatedMetrics.messagesPerSecond.toLocaleString()}</p>
            </div>
            <Zap size={24} className="text-purple-600" />
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-800">Avg Latency</p>
              <p className="text-2xl font-bold text-amber-900">{Math.round(aggregatedMetrics.averageLatency)}ms</p>
            </div>
            <Clock size={24} className="text-amber-600" />
          </div>
        </div>
      </div>

      {/* Load Balancer Status */}
      {loadBalancerStats && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target size={20} className="text-blue-600" />
            Load Balancer Performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-xl font-bold text-gray-900">{loadBalancerStats.strategy.replace('_', ' ').toUpperCase()}</div>
              <div className="text-sm text-gray-600">Strategy</div>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-xl font-bold text-gray-900">{loadBalancerStats.requestsRouted.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Requests Routed</div>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-xl font-bold text-gray-900">{loadBalancerStats.averageResponseTime}ms</div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-xl font-bold text-gray-900">{loadBalancerStats.efficiency}%</div>
              <div className="text-sm text-gray-600">Efficiency</div>
            </div>
          </div>
        </div>
      )}

      {/* Connection Pool Status */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Layers size={20} className="text-blue-600" />
          Connection Pool Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {poolMetrics.map((pool) => (
            <div key={pool.poolId} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{pool.poolId}</h4>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pool.status)}`}>
                  {pool.status}
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Connections:</span>
                  <span className="font-medium">{pool.activeConnections}/{pool.totalConnections}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Utilization:</span>
                  <span className="font-medium">{pool.poolUtilization.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Latency:</span>
                  <span className="font-medium">{pool.averageLatency}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Msg/sec:</span>
                  <span className="font-medium">{pool.messagesPerSecond}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Error Rate:</span>
                  <span className="font-medium">{pool.errorRate.toFixed(1)}%</span>
                </div>
              </div>

              {/* Utilization Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Pool Utilization</span>
                  <span>{pool.poolUtilization.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      pool.poolUtilization > 80 ? 'bg-red-500' :
                      pool.poolUtilization > 60 ? 'bg-amber-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(pool.poolUtilization, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connection Details */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Monitor size={20} className="text-blue-600" />
            Active Connections ({filteredConnections.length})
          </h3>
          
          <select
            value={selectedPool}
            onChange={(e) => setSelectedPool(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Pools</option>
            {poolMetrics.map(pool => (
              <option key={pool.poolId} value={pool.poolId}>{pool.poolId}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Connection ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Pool</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">IP Address</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Connected</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Messages</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredConnections.slice(0, 20).map((connection) => (
                <tr key={connection.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-xs">{connection.id}</td>
                  <td className="py-3 px-4">{connection.userId || 'Anonymous'}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {connection.poolId.replace('pool-', '')}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs">{connection.ipAddress}</td>
                  <td className="py-3 px-4">{new Date(connection.connectedAt).toLocaleTimeString()}</td>
                  <td className="py-3 px-4">
                    <span className="text-green-600">↑{connection.messagesSent}</span>
                    {' '}
                    <span className="text-blue-600">↓{connection.messagesReceived}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        connection.isHealthy ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-xs">{connection.isHealthy ? 'Healthy' : 'Unhealthy'}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredConnections.length > 20 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              Showing 20 of {filteredConnections.length} connections
            </div>
          )}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 size={20} className="text-blue-600" />
            Pool Distribution
          </h3>
          <div className="space-y-3">
            {poolMetrics.map((pool) => (
              <div key={pool.poolId} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{pool.poolId}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${(pool.activeConnections / aggregatedMetrics.totalConnections) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12">
                    {pool.activeConnections}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield size={20} className="text-blue-600" />
            System Health
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-green-600" />
                <span className="font-medium">Connection Pools</span>
              </div>
              <span className="text-green-600 font-medium">All Healthy</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-green-600" />
                <span className="font-medium">Load Balancer</span>
              </div>
              <span className="text-green-600 font-medium">Operational</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle size={20} className="text-amber-600" />
                <span className="font-medium">Memory Usage</span>
              </div>
              <span className="text-amber-600 font-medium">72% Used</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-green-600" />
                <span className="font-medium">Network Latency</span>
              </div>
              <span className="text-green-600 font-medium">Optimal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}