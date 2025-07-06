'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Target,
  Activity,
  Calendar,
  BarChart3,
  Download,
  RefreshCw,
  Filter,
  Settings,
  Eye,
  FileText,
  Zap,
  AlertCircle,
  Award,
  Brain
} from 'lucide-react';
import { TaskMetrics, UserPerformanceMetrics, TaskTrendAnalysis, TaskBottleneckAnalysis, TaskForecast } from '@/services/TaskAnalyticsService';

interface TaskAnalyticsDashboardProps {
  className?: string;
}

interface DashboardData {
  metrics: TaskMetrics;
  userPerformance: UserPerformanceMetrics[];
  trends: TaskTrendAnalysis;
  bottlenecks: TaskBottleneckAnalysis[];
  forecast: TaskForecast;
  milestones: any[];
}

export function TaskAnalyticsDashboard({ className = '' }: TaskAnalyticsDashboardProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'overview' | 'performance' | 'trends' | 'bottlenecks' | 'forecast'>('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/analytics/tasks?type=dashboard', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const data = await response.json();
      setDashboardData(data.dashboard);
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const exportData = async (format: 'json' | 'csv') => {
    try {
      const response = await fetch('/api/analytics/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          type: 'export_data',
          exportType: format,
          dataType: 'all'
        })
      });

      if (response.ok) {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data.exportData, null, 2)], {
          type: format === 'json' ? 'application/json' : 'text/csv'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `task-analytics.${format}`;
        a.click();
      }
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const generateReport = async (reportType: string) => {
    try {
      const response = await fetch('/api/analytics/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          type: 'generate_report',
          reportType,
          title: `${reportType} Report - ${new Date().toLocaleDateString()}`,
          period: {
            from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            to: new Date().toISOString()
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Report generated:', data.report);
        // In a real app, this would open the report or show a success message
      }
    } catch (err) {
      console.error('Report generation failed:', err);
    }
  };

  const getMetricTrend = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      percentage: Math.abs(change),
      isPositive: change > 0,
      isImprovement: change > 0 // This would depend on the metric type
    };
  };

  const formatDuration = (hours: number) => {
    if (hours < 24) {
      return `${hours.toFixed(1)}h`;
    } else {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}d ${remainingHours.toFixed(0)}h`;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-amber-600 bg-amber-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border shadow-sm p-6 ${className}`}>
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

  if (error || !dashboardData) {
    return (
      <div className={`bg-white rounded-lg border shadow-sm p-6 ${className}`}>
        <div className="text-center py-8">
          <AlertCircle size={32} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Unavailable</h3>
          <p className="text-gray-600 mb-4">{error || 'Unable to load analytics data'}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Total Tasks</p>
              <p className="text-3xl font-bold text-blue-900">{dashboardData.metrics.totalTasks}</p>
              <div className="flex items-center mt-2">
                <TrendingUp size={16} className="text-green-600 mr-1" />
                <span className="text-sm text-green-600">+12% vs last month</span>
              </div>
            </div>
            <Target size={32} className="text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Completion Rate</p>
              <p className="text-3xl font-bold text-green-900">{dashboardData.metrics.completionRate.toFixed(1)}%</p>
              <div className="flex items-center mt-2">
                <TrendingUp size={16} className="text-green-600 mr-1" />
                <span className="text-sm text-green-600">+3.2% vs last month</span>
              </div>
            </div>
            <CheckCircle size={32} className="text-green-600" />
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-800">Avg Completion Time</p>
              <p className="text-3xl font-bold text-amber-900">{formatDuration(dashboardData.metrics.averageCompletionTime)}</p>
              <div className="flex items-center mt-2">
                <TrendingDown size={16} className="text-green-600 mr-1" />
                <span className="text-sm text-green-600">-5.5% vs last month</span>
              </div>
            </div>
            <Clock size={32} className="text-amber-600" />
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-800">Overdue Tasks</p>
              <p className="text-3xl font-bold text-red-900">{dashboardData.metrics.overdueTasks}</p>
              <div className="flex items-center mt-2">
                <AlertTriangle size={16} className="text-red-600 mr-1" />
                <span className="text-sm text-red-600">Needs attention</span>
              </div>
            </div>
            <AlertTriangle size={32} className="text-red-600" />
          </div>
        </div>
      </div>

      {/* Task Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Completed', value: dashboardData.metrics.completedTasks, color: '#10B981' },
                  { name: 'In Progress', value: dashboardData.metrics.inProgressTasks, color: '#3B82F6' },
                  { name: 'Pending', value: dashboardData.metrics.pendingTasks, color: '#F59E0B' },
                  { name: 'Overdue', value: dashboardData.metrics.overdueTasks, color: '#EF4444' }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {[
                  { name: 'Completed', value: dashboardData.metrics.completedTasks, color: '#10B981' },
                  { name: 'In Progress', value: dashboardData.metrics.inProgressTasks, color: '#3B82F6' },
                  { name: 'Pending', value: dashboardData.metrics.pendingTasks, color: '#F59E0B' },
                  { name: 'Overdue', value: dashboardData.metrics.overdueTasks, color: '#EF4444' }
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Completion Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dashboardData.trends.completionTrend.slice(-14)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(date) => new Date(date).getDate().toString()} />
              <YAxis />
              <Tooltip labelFormatter={(date) => new Date(date).toLocaleDateString()} />
              <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Bottlenecks */}
      {dashboardData.bottlenecks.length > 0 && (
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Active Bottlenecks</h3>
            <span className="text-sm text-gray-500">{dashboardData.bottlenecks.length} detected</span>
          </div>
          <div className="space-y-3">
            {dashboardData.bottlenecks.slice(0, 3).map((bottleneck) => (
              <div key={bottleneck.bottleneckId} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                <AlertTriangle size={20} className={`mt-0.5 ${
                  bottleneck.severity === 'high' ? 'text-red-600' : 
                  bottleneck.severity === 'medium' ? 'text-amber-600' : 'text-yellow-600'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{bottleneck.description}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getSeverityColor(bottleneck.severity)}`}>
                      {bottleneck.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{bottleneck.rootCause}</p>
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">
                      Impact: {bottleneck.impactScore}/100 • 
                      Affects {bottleneck.affectedTasks.length} tasks • 
                      ETA: {bottleneck.estimatedResolutionTime}h
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Performance Rankings</h3>
        <div className="space-y-4">
          {dashboardData.userPerformance
            .sort((a, b) => b.efficiencyScore - a.efficiencyScore)
            .slice(0, 8)
            .map((user, index) => (
            <div key={user.userId} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full font-bold text-sm">
                #{index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{user.userName}</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">{user.userRole}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.efficiencyScore >= 80 ? 'bg-green-100 text-green-800' :
                      user.efficiencyScore >= 60 ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {user.efficiencyScore.toFixed(0)}% efficiency
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Assigned:</span>
                    <span className="ml-1 font-medium">{user.assignedTasks}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Completed:</span>
                    <span className="ml-1 font-medium">{user.completedTasks}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Rate:</span>
                    <span className="ml-1 font-medium">{user.completionRate.toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Avg Time:</span>
                    <span className="ml-1 font-medium">{formatDuration(user.averageCompletionTime)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTrends = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Creation vs Completion</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dashboardData.trends.taskCreationTrend.slice(-14).map((item, index) => ({
              ...item,
              completed: dashboardData.trends.completionTrend[index]?.count || 0
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(date) => new Date(date).getDate().toString()} />
              <YAxis />
              <Tooltip labelFormatter={(date) => new Date(date).toLocaleDateString()} />
              <Area type="monotone" dataKey="count" stackId="1" stroke="#3B82F6" fill="#3B82F6" name="Created" />
              <Area type="monotone" dataKey="completed" stackId="2" stroke="#10B981" fill="#10B981" name="Completed" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Workload Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.trends.workloadDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="userId" tickFormatter={(userId) => userId.split('_')[1]} />
              <YAxis />
              <Tooltip formatter={(value, name) => [value, 'Tasks']} />
              <Bar dataKey="taskCount" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {dashboardData.trends.categoryDistribution.map((category, index) => (
            <div key={category.category} className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl font-bold" style={{ color: COLORS[index % COLORS.length] }}>
                {category.count}
              </div>
              <div className="text-sm text-gray-600 capitalize">{category.category}</div>
              <div className="text-xs text-gray-500">{category.percentage}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderForecast = () => (
    <div className="space-y-6">
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Load Forecast</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dashboardData.forecast.predictedTaskLoad.slice(0, 14)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(date) => new Date(date).getDate().toString()} />
            <YAxis />
            <Tooltip labelFormatter={(date) => new Date(date).toLocaleDateString()} />
            <Line type="monotone" dataKey="estimatedTasks" stroke="#8B5CF6" strokeWidth={2} name="Predicted Tasks" />
            <Line type="monotone" dataKey="confidence" stroke="#06B6D4" strokeWidth={1} strokeDasharray="5 5" name="Confidence" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Requirements</h3>
          <div className="space-y-4">
            {dashboardData.forecast.resourceRequirements.map((requirement) => (
              <div key={requirement.userRole} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 capitalize">{requirement.userRole}</span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    requirement.shortfall > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {requirement.shortfall > 0 ? `${requirement.shortfall} short` : 'Adequate'}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Required: {requirement.requiredCapacity} | Current: {requirement.currentCapacity}
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      requirement.shortfall > 0 ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((requirement.currentCapacity / requirement.requiredCapacity) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Actions</h3>
          <div className="space-y-3">
            {dashboardData.forecast.recommendedActions.map((action, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    action.priority === 'high' ? 'bg-red-500' :
                    action.priority === 'medium' ? 'bg-amber-500' :
                    'bg-green-500'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{action.action}</h4>
                    <p className="text-sm text-gray-600 mt-1">{action.estimatedBenefit}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>Priority: {action.priority}</span>
                      <span>Effort: {action.implementationEffort}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 size={24} className="text-blue-600" />
              Task Analytics Dashboard
            </h2>
            <p className="text-gray-600 mt-1">Comprehensive insights into task performance and trends</p>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            
            <button
              onClick={() => exportData('json')}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download size={16} />
              Export
            </button>
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mt-4">
          {[
            { key: 'overview', label: 'Overview', icon: Activity },
            { key: 'performance', label: 'Performance', icon: Award },
            { key: 'trends', label: 'Trends', icon: TrendingUp },
            { key: 'forecast', label: 'Forecast', icon: Brain }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveView(key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeView === 'overview' && renderOverview()}
        {activeView === 'performance' && renderPerformance()}
        {activeView === 'trends' && renderTrends()}
        {activeView === 'forecast' && renderForecast()}
      </div>
    </div>
  );
}