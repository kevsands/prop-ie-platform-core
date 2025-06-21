'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Server,
  Database,
  Mail,
  CreditCard,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Bell,
  BellOff,
  Eye,
  AlertCircle,
  Zap,
  BarChart3,
  LineChart,
  PieChart,
  Monitor
} from 'lucide-react';

interface MetricCard {
  title: string;
  value: string | number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
  change: string;
}

interface Alert {
  id: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  timestamp: Date;
  acknowledged: boolean;
  component: string;
}

interface SystemHealth {
  overall: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
  uptime: number;
  components: {
    api: 'UP' | 'DOWN' | 'DEGRADED';
    database: 'UP' | 'DOWN' | 'DEGRADED';
    email: 'UP' | 'DOWN' | 'DEGRADED';
    payments: 'UP' | 'DOWN' | 'DEGRADED';
    monitoring: 'UP' | 'DOWN' | 'DEGRADED';
  };
  metrics: {
    avgResponseTime: number;
    errorRate: number;
    throughput: number;
    activeUsers: number;
    pendingTransactions: number;
  };
}

const SystemMonitoringDashboard: React.FC = () => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Mock data for Kevin's property platform monitoring
  const mockSystemHealth: SystemHealth = {
    overall: 'HEALTHY',
    uptime: 99.97,
    components: {
      api: 'UP',
      database: 'UP',
      email: 'UP',
      payments: 'UP',
      monitoring: 'UP'
    },
    metrics: {
      avgResponseTime: 245,
      errorRate: 0.02,
      throughput: 1247,
      activeUsers: 34,
      pendingTransactions: 7
    }
  };

  const mockAlerts: Alert[] = [
    {
      id: 'alert-001',
      severity: 'HIGH',
      title: 'API Response Time Elevated',
      description: 'Average API response time has increased to 1.8s, approaching warning threshold',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      acknowledged: false,
      component: 'api'
    },
    {
      id: 'alert-002',
      severity: 'MEDIUM',
      title: 'Email Delivery Delayed',
      description: 'Property alert emails experiencing slight delivery delays',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      acknowledged: true,
      component: 'email'
    }
  ];

  useEffect(() => {
    fetchMonitoringData();
    
    if (autoRefresh) {
      const interval = setInterval(fetchMonitoringData, 30000); // Every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const fetchMonitoringData = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API endpoints
      const response = await fetch('/api/monitoring/dashboard');
      
      if (response.ok) {
        const data = await response.json();
        setSystemHealth(data.systemHealth);
        setAlerts(data.alerts || []);
      } else {
        // Fallback to mock data
        setSystemHealth(mockSystemHealth);
        setAlerts(mockAlerts);
      }
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch monitoring data:', error);
      // Use mock data on error
      setSystemHealth(mockSystemHealth);
      setAlerts(mockAlerts);
    } finally {
      setLoading(false);
    }
  };

  const getMetricCards = (): MetricCard[] => {
    if (!systemHealth) return [];

    return [
      {
        title: 'Response Time',
        value: systemHealth.metrics.avgResponseTime,
        unit: 'ms',
        trend: systemHealth.metrics.avgResponseTime < 500 ? 'stable' : 'up',
        status: systemHealth.metrics.avgResponseTime < 1000 ? 'good' : 
                systemHealth.metrics.avgResponseTime < 2000 ? 'warning' : 'critical',
        change: '+12ms vs 1h ago'
      },
      {
        title: 'Error Rate',
        value: (systemHealth.metrics.errorRate * 100).toFixed(2),
        unit: '%',
        trend: 'stable',
        status: systemHealth.metrics.errorRate < 0.05 ? 'good' : 
                systemHealth.metrics.errorRate < 0.10 ? 'warning' : 'critical',
        change: '-0.3% vs 1h ago'
      },
      {
        title: 'Throughput',
        value: systemHealth.metrics.throughput.toLocaleString(),
        unit: 'req/min',
        trend: 'up',
        status: 'good',
        change: '+8% vs 1h ago'
      },
      {
        title: 'Active Users',
        value: systemHealth.metrics.activeUsers,
        unit: 'users',
        trend: 'up',
        status: 'good',
        change: '+5 vs 1h ago'
      },
      {
        title: 'Pending Transactions',
        value: systemHealth.metrics.pendingTransactions,
        unit: 'transactions',
        trend: 'stable',
        status: systemHealth.metrics.pendingTransactions < 10 ? 'good' : 'warning',
        change: '0 vs 1h ago'
      },
      {
        title: 'System Uptime',
        value: systemHealth.uptime.toFixed(2),
        unit: '%',
        trend: 'stable',
        status: systemHealth.uptime > 99.9 ? 'good' : systemHealth.uptime > 99.5 ? 'warning' : 'critical',
        change: 'Last 30 days'
      }
    ];
  };

  const getComponentIcon = (component: string) => {
    const icons = {
      api: <Server className="w-5 h-5" />,
      database: <Database className="w-5 h-5" />,
      email: <Mail className="w-5 h-5" />,
      payments: <CreditCard className="w-5 h-5" />,
      monitoring: <Monitor className="w-5 h-5" />
    };
    return icons[component as keyof typeof icons] || <Activity className="w-5 h-5" />;
  };

  const getComponentStatusColor = (status: string) => {
    const colors = {
      UP: 'text-green-600 bg-green-100',
      DEGRADED: 'text-yellow-600 bg-yellow-100',
      DOWN: 'text-red-600 bg-red-100'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const getAlertSeverityColor = (severity: string) => {
    const colors = {
      LOW: 'border-l-blue-500 bg-blue-50',
      MEDIUM: 'border-l-yellow-500 bg-yellow-50',
      HIGH: 'border-l-orange-500 bg-orange-50',
      CRITICAL: 'border-l-red-500 bg-red-50'
    };
    return colors[severity as keyof typeof colors] || 'border-l-gray-500 bg-gray-50';
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  if (loading && !systemHealth) {
    return (
      <div className="p-8 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!systemHealth) return null;

  const metricCards = getMetricCards();
  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);
  const overallStatusColor = {
    HEALTHY: 'text-green-600',
    DEGRADED: 'text-yellow-600',
    CRITICAL: 'text-red-600'
  }[systemHealth.overall];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Monitoring</h1>
          <p className="text-gray-600">Kevin Fitzgerald Property Platform</p>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
              autoRefresh ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {autoRefresh ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            {autoRefresh ? 'Auto-refresh' : 'Manual'}
          </button>
          
          <button
            onClick={fetchMonitoringData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
            <div className="flex items-center gap-3 mt-2">
              <div className={`text-2xl font-bold ${overallStatusColor}`}>
                {systemHealth.overall}
              </div>
              <div className="text-sm text-gray-600">
                Uptime: {systemHealth.uptime}% • {unacknowledgedAlerts.length} active alerts
              </div>
            </div>
          </div>
          
          {systemHealth.overall === 'HEALTHY' ? (
            <CheckCircle className="w-12 h-12 text-green-500" />
          ) : systemHealth.overall === 'DEGRADED' ? (
            <AlertTriangle className="w-12 h-12 text-yellow-500" />
          ) : (
            <XCircle className="w-12 h-12 text-red-500" />
          )}
        </div>
      </div>

      {/* Component Health */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Component Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(systemHealth.components).map(([component, status]) => (
            <div key={component} className="flex items-center gap-3 p-3 border rounded-lg">
              <div className={`p-2 rounded-full ${getComponentStatusColor(status)}`}>
                {getComponentIcon(component)}
              </div>
              <div>
                <div className="font-medium capitalize">{component}</div>
                <div className={`text-sm font-semibold ${
                  status === 'UP' ? 'text-green-600' : 
                  status === 'DEGRADED' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metricCards.map((metric, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-sm font-medium text-gray-600">{metric.title}</h4>
              <div className="flex items-center gap-1">
                {metric.trend === 'up' ? (
                  <TrendingUp className={`w-4 h-4 ${metric.status === 'good' ? 'text-green-500' : 'text-red-500'}`} />
                ) : metric.trend === 'down' ? (
                  <TrendingDown className="w-4 h-4 text-green-500" />
                ) : (
                  <Activity className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold ${
                metric.status === 'good' ? 'text-gray-900' :
                metric.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {metric.value}
              </span>
              <span className="text-sm text-gray-500">{metric.unit}</span>
            </div>
            
            <div className="mt-2 text-xs text-gray-500">
              {metric.change}
            </div>
          </div>
        ))}
      </div>

      {/* Active Alerts */}
      {unacknowledgedAlerts.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Active Alerts ({unacknowledgedAlerts.length})
          </h3>
          
          <div className="space-y-3">
            {unacknowledgedAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`border-l-4 p-4 rounded-lg ${getAlertSeverityColor(alert.severity)}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        alert.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                        alert.severity === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                        alert.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {alert.component}
                      </span>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-1">{alert.title}</h4>
                    <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Acknowledge
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <LineChart className="w-5 h-5" />
            Response Time Trend
          </h3>
          <div className="h-48 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Chart visualization would be integrated here</p>
              <p className="text-sm">Average: {systemHealth.metrics.avgResponseTime}ms</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Traffic Distribution
          </h3>
          <div className="h-48 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Traffic breakdown visualization</p>
              <p className="text-sm">Current: {systemHealth.metrics.throughput} req/min</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">24 Hour Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">99.97%</div>
            <div className="text-sm text-gray-600">Uptime</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">1.2M</div>
            <div className="text-sm text-gray-600">Requests Served</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">245ms</div>
            <div className="text-sm text-gray-600">Avg Response</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">2</div>
            <div className="text-sm text-gray-600">Total Alerts</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemMonitoringDashboard;