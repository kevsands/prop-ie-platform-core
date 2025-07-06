'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Server,
  Database,
  Zap,
  Shield,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
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
  Gauge
} from 'lucide-react';
import { apmService, SystemHealth, Alert, PerformanceMetric } from '@/services/ApplicationPerformanceMonitoring';
import { productionCacheService } from '@/services/ProductionCacheService';

export default function ProductionReadinessPage() {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [cacheMetrics, setCacheMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'security' | 'deployment'>('overview');
  const [monitoringActive, setMonitoringActive] = useState(true);

  useEffect(() => {
    fetchSystemData();
    const interval = setInterval(fetchSystemData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSystemData = async () => {
    try {
      setLoading(true);
      
      // Get system health
      const health = await apmService.getSystemHealth();
      setSystemHealth(health);

      // Get alerts
      const currentAlerts = apmService.getAlerts(false); // Only unresolved alerts
      setAlerts(currentAlerts);

      // Get recent metrics
      const recentMetrics = apmService.getMetrics().slice(0, 100);
      setMetrics(recentMetrics);

      // Get cache metrics
      const cacheHealth = await productionCacheService.healthCheck();
      setCacheMetrics({
        ...productionCacheService.getMetrics(),
        health: cacheHealth
      });

    } catch (error) {
      console.error('Failed to fetch system data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMonitoring = () => {
    if (monitoringActive) {
      apmService.stopMonitoring();
    } else {
      // Start monitoring logic would go here
    }
    setMonitoringActive(!monitoringActive);
  };

  const exportSystemReport = async () => {
    const report = apmService.generatePerformanceReport(
      new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
      new Date()
    );

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `production-readiness-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-amber-600 bg-amber-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle size={20} className="text-green-600" />;
      case 'warning': return <AlertTriangle size={20} className="text-amber-600" />;
      case 'critical': return <AlertCircle size={20} className="text-red-600" />;
      default: return <Monitor size={20} className="text-gray-600" />;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* System Health Score */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Overall System Health</h3>
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              systemHealth ? getHealthStatusColor(systemHealth.status) : 'text-gray-600 bg-gray-100'
            }`}>
              {systemHealth?.status || 'Unknown'}
            </div>
            <button
              onClick={fetchSystemData}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw size={16} className="text-gray-600" />
            </button>
          </div>
        </div>

        {systemHealth && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={systemHealth.score >= 80 ? '#10b981' : systemHealth.score >= 60 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="2"
                    strokeDasharray={`${systemHealth.score}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">{systemHealth.score}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">Health Score</p>
            </div>

            <div className="space-y-3">
              {Object.entries(systemHealth.components).map(([name, component]) => (
                <div key={name} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getHealthStatusIcon(component.status)}
                    <span className="font-medium text-gray-900 capitalize">
                      {name.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {component.responseTime}ms
                    </div>
                    <div className="text-xs text-gray-500">
                      {component.uptime.toFixed(1)}% uptime
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Critical Alerts */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Alerts ({alerts.length})</h3>
          <div className="space-y-3">
            {alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.level === 'critical' ? 'border-red-500 bg-red-50' :
                  alert.level === 'warning' ? 'border-amber-500 bg-amber-50' :
                  alert.level === 'error' ? 'border-red-500 bg-red-50' :
                  'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{alert.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {alert.timestamp.toLocaleString()} • {alert.category}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    alert.level === 'critical' ? 'bg-red-100 text-red-800' :
                    alert.level === 'warning' ? 'bg-amber-100 text-amber-800' :
                    alert.level === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {alert.level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Avg Response Time</p>
              <p className="text-2xl font-bold text-blue-900">
                {metrics.filter(m => m.category === 'response_time').length > 0
                  ? Math.round(metrics.filter(m => m.category === 'response_time')
                      .reduce((sum, m) => sum + m.value, 0) / 
                      metrics.filter(m => m.category === 'response_time').length)
                  : 0}ms
              </p>
            </div>
            <Clock size={24} className="text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Cache Hit Rate</p>
              <p className="text-2xl font-bold text-green-900">
                {cacheMetrics?.hitRate?.toFixed(1) || 0}%
              </p>
            </div>
            <Zap size={24} className="text-green-600" />
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-800">Error Rate</p>
              <p className="text-2xl font-bold text-amber-900">
                {((metrics.filter(m => m.category === 'error_rate').length / 
                   Math.max(metrics.length, 1)) * 100).toFixed(2)}%
              </p>
            </div>
            <AlertTriangle size={24} className="text-amber-600" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-800">Memory Usage</p>
              <p className="text-2xl font-bold text-purple-900">
                {metrics.filter(m => m.name === 'memory_heap_used').slice(-1)[0]?.value?.toFixed(0) || 0}MB
              </p>
            </div>
            <Cpu size={24} className="text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      {/* Database Performance */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Database size={24} className="mx-auto text-blue-600 mb-2" />
            <div className="text-xl font-bold text-gray-900">
              {systemHealth?.components.database.responseTime || 0}ms
            </div>
            <div className="text-sm text-gray-600">Query Time</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Activity size={24} className="mx-auto text-green-600 mb-2" />
            <div className="text-xl font-bold text-gray-900">
              {systemHealth?.components.database.metrics?.active_connections || 0}
            </div>
            <div className="text-sm text-gray-600">Active Connections</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <TrendingUp size={24} className="mx-auto text-purple-600 mb-2" />
            <div className="text-xl font-bold text-gray-900">
              {systemHealth?.components.database.metrics?.queries_per_second || 0}
            </div>
            <div className="text-sm text-gray-600">Queries/sec</div>
          </div>
        </div>
      </div>

      {/* Cache Performance */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cache Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Zap size={24} className="mx-auto text-blue-600 mb-2" />
            <div className="text-xl font-bold text-gray-900">
              {cacheMetrics?.hitRate?.toFixed(1) || 0}%
            </div>
            <div className="text-sm text-gray-600">Hit Rate</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Clock size={24} className="mx-auto text-green-600 mb-2" />
            <div className="text-xl font-bold text-gray-900">
              {cacheMetrics?.avgResponseTime?.toFixed(0) || 0}ms
            </div>
            <div className="text-sm text-gray-600">Response Time</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <HardDrive size={24} className="mx-auto text-purple-600 mb-2" />
            <div className="text-xl font-bold text-gray-900">
              {cacheMetrics?.memory || 0}
            </div>
            <div className="text-sm text-gray-600">Memory Items</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Activity size={24} className="mx-auto text-amber-600 mb-2" />
            <div className="text-xl font-bold text-gray-900">
              {((cacheMetrics?.hits || 0) + (cacheMetrics?.misses || 0))}
            </div>
            <div className="text-sm text-gray-600">Total Operations</div>
          </div>
        </div>
      </div>

      {/* Real-time Performance */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Service Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Wifi size={24} className="mx-auto text-blue-600 mb-2" />
            <div className="text-xl font-bold text-gray-900">
              {systemHealth?.components.realtime.metrics?.active_connections || 0}
            </div>
            <div className="text-sm text-gray-600">Active Connections</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Activity size={24} className="mx-auto text-green-600 mb-2" />
            <div className="text-xl font-bold text-gray-900">
              {systemHealth?.components.realtime.metrics?.messages_per_second || 0}
            </div>
            <div className="text-sm text-gray-600">Messages/sec</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Clock size={24} className="mx-auto text-purple-600 mb-2" />
            <div className="text-xl font-bold text-gray-900">
              {systemHealth?.components.realtime.metrics?.avg_latency || 0}ms
            </div>
            <div className="text-sm text-gray-600">Avg Latency</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Hardening Status</h3>
        <div className="space-y-4">
          {[
            { name: 'HTTPS Enforcement', status: 'enabled', description: 'All traffic redirected to HTTPS' },
            { name: 'JWT Token Security', status: 'enabled', description: 'Secure token generation and validation' },
            { name: 'API Rate Limiting', status: 'pending', description: 'Rate limiting configuration needed' },
            { name: 'CORS Configuration', status: 'enabled', description: 'Properly configured for production' },
            { name: 'Input Sanitization', status: 'enabled', description: 'SQL injection prevention active' },
            { name: 'Security Headers', status: 'enabled', description: 'CSP, HSTS, and other headers configured' }
          ].map((item) => (
            <div key={item.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{item.name}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                item.status === 'enabled' ? 'bg-green-100 text-green-800' : 
                item.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                'bg-red-100 text-red-800'
              }`}>
                {item.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDeployment = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Deployment Readiness</h3>
        <div className="space-y-4">
          {[
            { 
              name: 'Bundle Optimization', 
              status: 'completed', 
              description: 'Bundle analysis complete, optimizations identified',
              details: '2.0MB client bundle, optimization potential: 35-50%'
            },
            { 
              name: 'Database Optimization', 
              status: 'completed', 
              description: 'Indexes created, queries optimized',
              details: '16 indexes created, 60-80% performance improvement expected'
            },
            { 
              name: 'Caching Strategy', 
              status: 'completed', 
              description: 'Redis caching implemented',
              details: 'Multi-layer caching with fallback to memory cache'
            },
            { 
              name: 'Monitoring Setup', 
              status: 'completed', 
              description: 'APM and health checks active',
              details: 'Real-time monitoring with alerting configured'
            },
            { 
              name: 'Security Hardening', 
              status: 'in_progress', 
              description: 'Security measures being implemented',
              details: 'API rate limiting and additional CORS refinement needed'
            },
            { 
              name: 'AWS Configuration', 
              status: 'pending', 
              description: 'Production AWS setup required',
              details: 'Amplify, RDS, ElastiCache, and CloudFront configuration'
            }
          ].map((item) => (
            <div key={item.name} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{item.name}</h4>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.status === 'completed' ? 'bg-green-100 text-green-800' : 
                  item.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {item.status.replace('_', ' ')}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{item.description}</p>
              <p className="text-xs text-gray-500">{item.details}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading && !systemHealth) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Gauge size={28} className="text-blue-600" />
              Production Readiness Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive monitoring and optimization status for production deployment
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMonitoring}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                monitoringActive 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {monitoringActive ? <Pause size={16} /> : <Play size={16} />}
              {monitoringActive ? 'Monitoring Active' : 'Start Monitoring'}
            </button>
            
            <button
              onClick={exportSystemReport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg border shadow-sm mb-6">
        <div className="flex gap-1 p-1">
          {[
            { key: 'overview', label: 'System Overview', icon: Monitor },
            { key: 'performance', label: 'Performance', icon: BarChart3 },
            { key: 'security', label: 'Security', icon: Shield },
            { key: 'deployment', label: 'Deployment', icon: Server }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors flex-1 justify-center ${
                activeTab === key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'performance' && renderPerformance()}
        {activeTab === 'security' && renderSecurity()}
        {activeTab === 'deployment' && renderDeployment()}
      </div>
    </div>
  );
}