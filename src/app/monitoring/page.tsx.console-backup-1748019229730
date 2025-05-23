'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell 
} from 'recharts';

interface HealthData {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  service: string;
  version: string;
  uptime: number;
  environment: string;
  checks: {
    [key: string]: {
      status: 'ok' | 'error' | 'warning';
      message?: string;
      responseTime?: number;
    };
  };
  system: {
    memory: {
      total: number;
      free: number;
      used: number;
      percentUsed: number;
    };
    cpu: {
      cores: number;
      loadAverage: number[];
      percentUsed: number;
    };
    process: {
      memoryUsage: NodeJS.MemoryUsage;
      uptime: number;
      pid: number;
    };
  };
}

interface MetricsData {
  timestamp: string;
  performance: {
    averageResponseTime: number;
    requestsPerSecond: number;
    errorRate: number;
    successRate: number;
    activeConnections: number;
    totalRequests: number;
    totalErrors: number;
  };
  resources: {
    memory: {
      used: number;
      total: number;
      percentUsed: number;
    };
    cpu: {
      cores: number;
      usage: number;
      loadAverage: number[];
    };
  };
  database: {
    connections: {
      active: number;
      idle: number;
      total: number;
    };
    queryPerformance: {
      averageTime: number;
      slowQueries: number;
    };
  };
  cache: {
    hitRate: number;
    missRate: number;
    evictions: number;
    keys: number;
  };
  endpoints: Array<{
    path: string;
    method: string;
    count: number;
    averageTime: number;
    errorRate: number;
  }>;
}

export default function MonitoringDashboard() {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [metricsData, setMetricsData] = useState<MetricsData | null>(null);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch data
  const fetchData = async () => {
    try {
      const [healthResponse, metricsResponse] = await Promise.all([
        fetch('/api/health'),
        fetch('/api/metrics')
      ]);
      
      if (!healthResponse.ok || !metricsResponse.ok) {
        throw new Error('Failed to fetch monitoring data');
      }
      
      const health = await healthResponse.json();
      const metrics = await metricsResponse.json();
      
      setHealthData(health);
      setMetricsData(metrics);
      
      // Update historical data
      setHistoricalData(prev => {
        const newEntry = {
          timestamp: new Date().toLocaleTimeString(),
          responseTime: metrics.performance.averageResponseTime,
          requestsPerSecond: metrics.performance.requestsPerSecond,
          errorRate: metrics.performance.errorRate * 100,
          cpuUsage: metrics.resources.cpu.usage,
          memoryUsage: metrics.resources.memory.percentUsed
        };
        
        const updated = [...prev, newEntry];
        return updated.slice(-20); // Keep last 20 entries
      });
      
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading monitoring data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">Error loading monitoring data</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'ok':
        return '#10b981';
      case 'degraded':
      case 'warning':
        return '#f59e0b';
      case 'unhealthy':
      case 'error':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };
  
  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };
  
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">System Monitoring Dashboard</h1>
        <div className="text-sm text-gray-600">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
      
      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">System Status</h3>
          <div className="flex items-center">
            <div 
              className="h-4 w-4 rounded-full mr-2" 
              style={{ backgroundColor: getStatusColor(healthData?.status || 'unknown') }}
            ></div>
            <span className="text-xl font-medium capitalize">{healthData?.status}</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Uptime: {formatUptime(healthData?.uptime || 0)}
          </p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Performance</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Avg Response Time:</span>
              <span className="font-medium">{metricsData?.performance.averageResponseTime.toFixed(2)} ms</span>
            </div>
            <div className="flex justify-between">
              <span>Requests/sec:</span>
              <span className="font-medium">{metricsData?.performance.requestsPerSecond.toFixed(2)}</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Error Rate</h3>
          <div className="text-2xl font-bold">
            {((metricsData?.performance.errorRate || 0) * 100).toFixed(2)}%
          </div>
          <p className="text-sm text-gray-600">
            {metricsData?.performance.totalErrors} errors / {metricsData?.performance.totalRequests} requests
          </p>
        </Card>
      </div>
      
      {/* Service Health Checks */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Service Health Checks</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {healthData && Object.entries(healthData.checks).map(([service, check]) => (
            <div key={service} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div 
                  className="h-3 w-3 rounded-full mr-2" 
                  style={{ backgroundColor: getStatusColor(check.status) }}
                ></div>
                <span className="font-medium capitalize">{service}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{check.status}</p>
                {check.responseTime && (
                  <p className="text-xs text-gray-600">{check.responseTime}ms</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Performance Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Response Time Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="responseTime" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Response Time (ms)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Request Rate</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="requestsPerSecond" 
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.3}
                name="Requests/sec"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
      
      {/* Resource Usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">CPU & Memory Usage</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="cpuUsage" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="CPU %"
              />
              <Line 
                type="monotone" 
                dataKey="memoryUsage" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                name="Memory %"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Current Resource Usage</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>CPU Usage</span>
                <span>{healthData?.system.cpu.percentUsed.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${healthData?.system.cpu.percentUsed}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Memory Usage</span>
                <span>{healthData?.system.memory.percentUsed.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${healthData?.system.memory.percentUsed}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {formatBytes(healthData?.system.memory.used || 0)} / {formatBytes(healthData?.system.memory.total || 0)}
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Database & Cache */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Database Connections</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Active Connections:</span>
              <span className="font-medium">{metricsData?.database.connections.active}</span>
            </div>
            <div className="flex justify-between">
              <span>Idle Connections:</span>
              <span className="font-medium">{metricsData?.database.connections.idle}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Pool Size:</span>
              <span className="font-medium">{metricsData?.database.connections.total}</span>
            </div>
            <div className="flex justify-between">
              <span>Avg Query Time:</span>
              <span className="font-medium">{metricsData?.database.queryPerformance.averageTime.toFixed(2)} ms</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Cache Performance</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Hit Rate:</span>
              <span className="font-medium text-green-600">
                {((metricsData?.cache.hitRate || 0) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Miss Rate:</span>
              <span className="font-medium text-red-600">
                {((metricsData?.cache.missRate || 0) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Active Keys:</span>
              <span className="font-medium">{metricsData?.cache.keys}</span>
            </div>
            <div className="flex justify-between">
              <span>Evictions:</span>
              <span className="font-medium">{metricsData?.cache.evictions}</span>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Top Endpoints */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Top Endpoints</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Endpoint</th>
                <th className="text-left py-2">Method</th>
                <th className="text-right py-2">Count</th>
                <th className="text-right py-2">Avg Time (ms)</th>
                <th className="text-right py-2">Error Rate</th>
              </tr>
            </thead>
            <tbody>
              {metricsData?.endpoints.map((endpoint, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{endpoint.path}</td>
                  <td className="py-2">{endpoint.method}</td>
                  <td className="text-right py-2">{endpoint.count}</td>
                  <td className="text-right py-2">{endpoint.averageTime.toFixed(2)}</td>
                  <td className="text-right py-2">
                    <span className={endpoint.errorRate > 0.05 ? 'text-red-600' : ''}>
                      {(endpoint.errorRate * 100).toFixed(2)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}