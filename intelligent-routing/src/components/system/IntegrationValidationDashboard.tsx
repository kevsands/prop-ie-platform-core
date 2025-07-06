'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Clock,
  Activity,
  Database,
  Server,
  Users,
  Heart,
  Bell,
  Home,
  TrendingUp,
  AlertCircle,
  Eye,
  Settings,
  FileText,
  Zap
} from 'lucide-react';

interface IntegrationTestResult {
  endpoint: string;
  name: string;
  status: 'pass' | 'fail' | 'warning';
  responseTime: number;
  data?: any;
  error?: string;
  dependencies?: string[];
}

interface SystemHealthReport {
  timestamp: Date;
  overallStatus: 'healthy' | 'degraded' | 'critical';
  totalTests: number;
  passed: number;
  failed: number;
  warnings: number;
  tests: IntegrationTestResult[];
  integrationMatrix: {
    buyerToHTB: boolean;
    buyerToNotifications: boolean;
    buyerToProperties: boolean;
    developerToHTB: boolean;
    developerToNotifications: boolean;
    developerToProperties: boolean;
    htbToNotifications: boolean;
    propertiesRealTime: boolean;
  };
  executionTime?: number;
  systemInfo?: any;
  recommendations?: string[];
}

export default function IntegrationValidationDashboard() {
  const [healthReport, setHealthReport] = useState<SystemHealthReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  const runHealthCheck = async (detailed = true) => {
    try {
      setError(null);
      const response = await fetch(`/api/system/integration-test?detailed=${detailed}`);
      
      if (!response.ok) {
        throw new Error('Health check failed');
      }

      const data = await response.json();
      setHealthReport({
        ...data,
        timestamp: new Date(data.timestamp)
      });
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Health check error:', err);
      setError(err instanceof Error ? err.message : 'Health check failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      runHealthCheck(false);
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'fail':
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
      case 'healthy':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'warning':
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'fail':
      case 'critical':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getIntegrationIcon = (integration: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      buyerToHTB: <Heart className="h-4 w-4" />,
      buyerToNotifications: <Bell className="h-4 w-4" />,
      buyerToProperties: <Home className="h-4 w-4" />,
      developerToHTB: <Heart className="h-4 w-4" />,
      developerToNotifications: <Bell className="h-4 w-4" />,
      developerToProperties: <TrendingUp className="h-4 w-4" />,
      htbToNotifications: <Zap className="h-4 w-4" />,
      propertiesRealTime: <Activity className="h-4 w-4" />
    };
    return iconMap[integration] || <Settings className="h-4 w-4" />;
  };

  const formatIntegrationName = (key: string) => {
    const nameMap: { [key: string]: string } = {
      buyerToHTB: 'Buyer → HTB',
      buyerToNotifications: 'Buyer → Notifications',
      buyerToProperties: 'Buyer → Properties',
      developerToHTB: 'Developer → HTB',
      developerToNotifications: 'Developer → Notifications',
      developerToProperties: 'Developer → Properties',
      htbToNotifications: 'HTB → Notifications',
      propertiesRealTime: 'Real-time Properties'
    };
    return nameMap[key] || key;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Running integration validation...</p>
        </div>
      </div>
    );
  }

  if (error && !healthReport) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-600 mb-4" />
        <h3 className="text-lg font-medium text-red-900 mb-2">Integration Test Failed</h3>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={() => runHealthCheck()}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Activity className="text-blue-500" />
            System Integration Validation
          </h1>
          <p className="mt-2 text-gray-600">
            Comprehensive testing of all integrated services and APIs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-300"
            />
            Auto-refresh
          </label>
          <button
            onClick={() => runHealthCheck()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Run Tests
          </button>
        </div>
      </div>

      {healthReport && (
        <>
          {/* Overall Status */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">System Health Overview</h2>
              <div className="flex items-center gap-2">
                {getStatusIcon(healthReport.overallStatus)}
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(healthReport.overallStatus)}`}>
                  {healthReport.overallStatus.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{healthReport.totalTests}</div>
                <div className="text-sm text-gray-600">Total Tests</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{healthReport.passed}</div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">{healthReport.warnings}</div>
                <div className="text-sm text-gray-600">Warnings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{healthReport.failed}</div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
            </div>

            {healthReport.executionTime && (
              <div className="mt-4 text-center text-sm text-gray-600">
                Executed in {healthReport.executionTime}ms
                {lastUpdate && ` • Last updated: ${lastUpdate.toLocaleTimeString()}`}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* API Tests */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">API Endpoint Tests</h2>
                <div className="space-y-4">
                  {healthReport.tests.map((test) => (
                    <div
                      key={test.endpoint}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedTest === test.endpoint ? 'border-blue-300 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedTest(selectedTest === test.endpoint ? null : test.endpoint)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(test.status)}
                          <div>
                            <h3 className="font-medium text-gray-900">{test.name}</h3>
                            <p className="text-sm text-gray-600">{test.endpoint}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">{test.responseTime}ms</div>
                          {test.data?.recordCount && (
                            <div className="text-xs text-gray-500">{test.data.recordCount} records</div>
                          )}
                        </div>
                      </div>

                      {selectedTest === test.endpoint && (
                        <div className="mt-4 pt-4 border-t space-y-3">
                          {test.dependencies && (
                            <div>
                              <span className="text-sm font-medium text-gray-700">Dependencies:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {test.dependencies.map((dep) => (
                                  <span key={dep} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                    {dep}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {test.error && (
                            <div>
                              <span className="text-sm font-medium text-red-700">Error:</span>
                              <p className="text-sm text-red-600 mt-1">{test.error}</p>
                            </div>
                          )}

                          {test.data && (
                            <div>
                              <span className="text-sm font-medium text-gray-700">Response Data:</span>
                              <div className="mt-1 text-xs text-gray-600">
                                {test.data.hasRequiredFields ? (
                                  <span className="text-green-600">✓ All required fields present</span>
                                ) : (
                                  <span className="text-yellow-600">
                                    ⚠ Missing fields: {test.data.missingFields?.join(', ')}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Integration Matrix & Recommendations */}
            <div className="space-y-6">
              {/* Integration Matrix */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Integration Matrix</h2>
                <div className="space-y-3">
                  {Object.entries(healthReport.integrationMatrix).map(([key, status]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getIntegrationIcon(key)}
                        <span className="text-sm text-gray-700">{formatIntegrationName(key)}</span>
                      </div>
                      {status ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {healthReport.recommendations && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h2>
                  <div className="space-y-3">
                    {healthReport.recommendations.map((rec, index) => (
                      <div key={index} className={`p-3 rounded-lg text-sm ${
                        rec.includes('✅') ? 'bg-green-50 text-green-800' :
                        rec.includes('Critical') ? 'bg-red-50 text-red-800' :
                        rec.includes('Performance') ? 'bg-yellow-50 text-yellow-800' :
                        'bg-blue-50 text-blue-800'
                      }`}>
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* System Info */}
              {healthReport.systemInfo && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Environment:</span>
                      <span className="font-medium">{healthReport.systemInfo.nodeEnv}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Version:</span>
                      <span className="font-medium">{healthReport.systemInfo.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Timestamp:</span>
                      <span className="font-medium">
                        {new Date(healthReport.systemInfo.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}