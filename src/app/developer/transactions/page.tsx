'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Building2,
  Euro,
  Activity,
  Target,
  Filter,
  Search,
  RefreshCw,
  Download,
  Eye,
  ArrowRight,
  MapPin,
  Calendar,
  Zap,
  Scale,
  Bell,
  Home,
  DollarSign,
  FileText,
  MessageSquare,
  Settings,
  Sparkles
} from 'lucide-react';
import { universalTransactionService, UniversalTransactionData, ProjectTransactionSummary } from '@/services/UniversalTransactionService';

interface DeveloperTransactionsPageProps {}

export default function DeveloperTransactionsPage({}: DeveloperTransactionsPageProps) {
  const [dashboardData, setDashboardData] = useState<UniversalTransactionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'portfolio' | 'projects' | 'analytics' | 'risks'>('portfolio');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUniversalData();
    
    // Set up real-time updates
    const interval = setInterval(loadUniversalData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const loadUniversalData = async () => {
    try {
      setLoading(true);
      const data = await universalTransactionService.getUniversalTransactionData();
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading universal transaction data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `€${(amount / 1000000).toFixed(1)}M`;
    }
    return `€${(amount / 1000).toFixed(0)}K`;
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const filteredProjects = dashboardData ? 
    Array.from(dashboardData.projectTransactions.values()).filter(project => {
      const matchesSearch = searchQuery === '' || 
        project.projectName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProject = selectedProject === 'all' || project.projectId === selectedProject;
      return matchesSearch && matchesProject;
    }) : [];

  if (loading || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading portfolio transaction data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Transactions</h1>
          <p className="text-gray-600 mt-1">
            Universal transaction management across all development projects
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadUniversalData}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Portfolio Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(dashboardData.crossProjectMetrics.totalPortfolioValue)}
              </p>
              <p className="text-xs text-green-600 mt-1">
                ↗ {(dashboardData.crossProjectMetrics.yearOverYearGrowth * 100).toFixed(1)}% YoY
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Euro className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Transactions</p>
              <p className="text-2xl font-bold text-purple-600">
                {dashboardData.crossProjectMetrics.totalActiveTransactions}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Across {dashboardData.projectTransactions.size} projects
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {(dashboardData.crossProjectMetrics.averageCompletionRate * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Portfolio average
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Risk Score</p>
              <p className="text-2xl font-bold text-red-600">
                {dashboardData.crossProjectMetrics.portfolioRiskScore.toFixed(0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {dashboardData.globalRiskAlerts.length} alerts
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Global Risk Alerts */}
      {dashboardData.globalRiskAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-red-900">Portfolio Risk Alerts</h3>
          </div>
          <div className="space-y-2">
            {dashboardData.globalRiskAlerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-red-900">{alert.description}</p>
                  <p className="text-xs text-red-700">
                    Impact: {alert.affectedTransactions} transactions • {formatCurrency(alert.potentialRevenueLoss)} at risk
                  </p>
                </div>
                <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Performer Highlight */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">Top Performing Project</h3>
            <p className="text-green-100 mb-4">
              {dashboardData.crossProjectMetrics.topPerformingProject} is leading the portfolio
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                <span>{(dashboardData.crossProjectMetrics.averageCompletionRate * 100).toFixed(1)}% completion rate</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>Strong sales velocity</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2">
              <Sparkles className="w-8 h-8" />
            </div>
            <Link 
              href={`/developer/projects/${dashboardData.crossProjectMetrics.topPerformingProject.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors"
            >
              View Project
            </Link>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="border-b">
          <nav className="flex">
            {[
              { id: 'portfolio', label: 'Portfolio Overview', icon: BarChart3 },
              { id: 'projects', label: 'Project Details', icon: Building2 },
              { id: 'analytics', label: 'Advanced Analytics', icon: TrendingUp },
              { id: 'risks', label: 'Risk Management', icon: AlertTriangle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedView(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                  selectedView === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {selectedView === 'portfolio' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Portfolio Composition */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Portfolio Composition</h3>
                <div className="space-y-3">
                  {Array.from(dashboardData.projectTransactions.values()).map((project) => (
                    <div key={project.projectId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{project.projectName}</h4>
                          <p className="text-sm text-gray-600">{project.totalUnits} units</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(project.pipelineValue)}</p>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getRiskColor(project.riskLevel)}`}>
                          {getRiskIcon(project.riskLevel)}
                          {project.riskLevel}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Monthly Velocity</span>
                      <span className="text-lg font-bold text-blue-600">
                        {dashboardData.crossProjectMetrics.monthlyVelocity.toFixed(1)} units/month
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (dashboardData.crossProjectMetrics.monthlyVelocity / 10) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Portfolio Health</span>
                      <span className={`text-lg font-bold ${
                        dashboardData.crossProjectMetrics.portfolioRiskScore < 30 ? 'text-green-600' :
                        dashboardData.crossProjectMetrics.portfolioRiskScore < 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {dashboardData.crossProjectMetrics.portfolioRiskScore < 30 ? 'Excellent' :
                         dashboardData.crossProjectMetrics.portfolioRiskScore < 60 ? 'Good' : 'Needs Attention'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          dashboardData.crossProjectMetrics.portfolioRiskScore < 30 ? 'bg-green-600' :
                          dashboardData.crossProjectMetrics.portfolioRiskScore < 60 ? 'bg-yellow-600' :
                          'bg-red-600'
                        }`}
                        style={{ width: `${100 - dashboardData.crossProjectMetrics.portfolioRiskScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedView === 'projects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Project Transaction Details</h3>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="all">All Projects</option>
                    {Array.from(dashboardData.projectTransactions.values()).map((project) => (
                      <option key={project.projectId} value={project.projectId}>
                        {project.projectName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <div key={project.projectId} className="bg-gray-50 rounded-lg p-6 border">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900">{project.projectName}</h4>
                          <p className="text-gray-600">{project.totalUnits} total units</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm border ${getRiskColor(project.riskLevel)}`}>
                          {getRiskIcon(project.riskLevel)}
                          {project.riskLevel.toUpperCase()} RISK
                        </div>
                        <Link
                          href={`/developer/projects/${project.projectId}`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Project
                        </Link>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <p className="text-2xl font-bold text-blue-600">{project.activeTransactions}</p>
                        <p className="text-sm text-gray-600">Active Transactions</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <p className="text-2xl font-bold text-green-600">{project.completedTransactions}</p>
                        <p className="text-sm text-gray-600">Completed</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <p className="text-2xl font-bold text-purple-600">{formatCurrency(project.pipelineValue)}</p>
                        <p className="text-sm text-gray-600">Pipeline Value</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <p className="text-2xl font-bold text-orange-600">{(project.completionRate * 100).toFixed(1)}%</p>
                        <p className="text-sm text-gray-600">Completion Rate</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Solicitor Cases</h5>
                        <div className="space-y-2">
                          {project.solicitorCases.slice(0, 3).map((solicitorCase) => (
                            <div key={solicitorCase.id} className="flex items-center justify-between p-2 bg-white rounded border">
                              <div className="flex items-center gap-2">
                                <Scale className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-medium">{solicitorCase.caseNumber}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">{solicitorCase.buyer.name}</span>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  solicitorCase.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  solicitorCase.status === 'new' ? 'bg-blue-100 text-blue-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {solicitorCase.status}
                                </span>
                              </div>
                            </div>
                          ))}
                          {project.solicitorCases.length > 3 && (
                            <p className="text-xs text-gray-500 text-center">
                              +{project.solicitorCases.length - 3} more cases
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Recent Activity</h5>
                        <div className="space-y-2">
                          {project.recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-center gap-3 p-2 bg-white rounded border">
                              <div className={`w-2 h-2 rounded-full ${
                                activity.impact === 'positive' ? 'bg-green-500' :
                                activity.impact === 'negative' ? 'bg-red-500' :
                                'bg-gray-500'
                              }`} />
                              <span className="text-sm text-gray-700">{activity.description}</span>
                              <span className="text-xs text-gray-500 ml-auto">
                                {new Date(activity.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedView === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Portfolio Analytics</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700">Market Trends</h4>
                  {dashboardData.portfolioInsights.marketTrends.map((trend) => (
                    <div key={trend.id} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{trend.trend}</span>
                        <div className="flex items-center gap-1">
                          {trend.direction === 'up' ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />
                          )}
                          <span className="text-sm text-gray-600">{(trend.confidence * 100).toFixed(0)}% confidence</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{trend.timeframe}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700">Predictive Analytics</h4>
                  {dashboardData.portfolioInsights.predictiveAnalytics.map((prediction, index) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-blue-900">{prediction.prediction}</span>
                        <span className="text-sm text-blue-600">{(prediction.probability * 100).toFixed(0)}% likely</span>
                      </div>
                      <p className="text-sm text-blue-700 mb-2">{prediction.timeframe}</p>
                      <div className="space-y-1">
                        {prediction.recommendedPreparations.map((prep, prepIndex) => (
                          <p key={prepIndex} className="text-xs text-blue-600">• {prep}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedView === 'risks' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Risk Management Dashboard</h3>
              
              {dashboardData.globalRiskAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Portfolio Risk Status: All Clear</h4>
                  <p className="text-gray-600">No significant risks detected across your development portfolio.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {dashboardData.globalRiskAlerts.map((alert) => (
                    <div key={alert.id} className={`p-6 rounded-lg border-l-4 ${
                      alert.severity === 'critical' ? 'bg-red-50 border-red-500' :
                      alert.severity === 'high' ? 'bg-orange-50 border-orange-500' :
                      'bg-yellow-50 border-yellow-500'
                    }`}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{alert.description}</h4>
                          <p className="text-gray-600 mt-1">{alert.impact}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {alert.severity.toUpperCase()}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Affected Transactions</p>
                          <p className="text-2xl font-bold text-gray-900">{alert.affectedTransactions}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Potential Revenue Loss</p>
                          <p className="text-2xl font-bold text-red-600">{formatCurrency(alert.potentialRevenueLoss)}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Recommended Actions</p>
                        <div className="space-y-1">
                          {alert.recommendedActions.map((action, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <ArrowRight className="w-4 h-4 text-blue-500" />
                              <span className="text-sm text-gray-700">{action}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}