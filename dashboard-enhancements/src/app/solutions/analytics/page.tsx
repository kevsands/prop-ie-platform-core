'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BarChart3, TrendingUp, PieChart, LineChart, Activity, Eye,
  Brain, Database, Zap, Target, Users, Building, Globe,
  Gauge, ArrowUpRight, ArrowDownRight, Settings, Filter,
  Download, Share2, RefreshCw, Calendar, MapPin, DollarSign,
  AlertCircle, CheckCircle, Clock, Star, Award, Shield,
  Layers, Smartphone, Tablet, Monitor, Server, Cloud,
  Code, Api, GitBranch, Cpu, HardDrive, Network
} from 'lucide-react';

export default function EnterpriseAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('platform');
  const analyticsMetrics = {
    dataPointsProcessed: 2847000000, // 2.84B daily
    realTimeInsights: 15420,
    predictiveAccuracy: 94.7,
    dashboardUsers: 8750,
    apiCalls: 125000000, // 125M daily
    dataLatency: 0.45, // seconds
    systemUptime: 99.98,
    mlModelsActive: 47
  };

  const analyticsCapabilities = [
    {
      category: 'AI-Powered Market Intelligence',
      features: [
        'Real-time property valuation models with 94.7% accuracy',
        'Predictive demand forecasting using 200+ market indicators',
        'Automated price optimization with ML-driven recommendations',
        'Cross-market trend analysis and correlation detection'
      ],
      impact: '€125M+ in optimized property pricing decisions',
      icon: Brain,
      metrics: ['94.7% prediction accuracy', '€125M+ value optimization', '200+ data sources']
    },
    {
      category: 'Enterprise Data Pipeline',
      features: [
        'Real-time data ingestion from 500+ external sources',
        'Event-driven architecture processing 2.84B daily events',
        'Advanced ETL workflows with data quality validation',
        'Multi-tenant data isolation with enterprise security'
      ],
      impact: '99.98% data accuracy with sub-second latency',
      icon: Database,
      metrics: ['2.84B events/day', '0.45s avg latency', '500+ data sources']
    },
    {
      category: 'Advanced Visualization Engine',
      features: [
        'Interactive dashboards with 50+ chart types and widgets',
        'Custom KPI builders with drag-and-drop functionality',
        'Real-time collaboration on reports and insights',
        'White-label dashboard embedding for enterprise clients'
      ],
      impact: '85% faster decision-making across stakeholders',
      icon: BarChart3,
      metrics: ['50+ chart types', '8,750 active users', '15K+ custom dashboards']
    },
    {
      category: 'Intelligent Alerting System',
      features: [
        'Smart anomaly detection using statistical models',
        'Configurable threshold monitoring across 100+ metrics',
        'Multi-channel notifications (email, SMS, Slack, Teams)',
        'Predictive alerts for market shifts and opportunities'
      ],
      impact: '67% reduction in manual monitoring overhead',
      icon: AlertCircle,
      metrics: ['15,420 alerts/day', '67% faster response', '100+ monitoring points']
    }
  ];

  const enterpriseFeatures = [
    {
      title: 'Machine Learning Platform',
      description: 'Enterprise-grade ML infrastructure with automated model training, validation, and deployment for property analytics',
      metrics: ['47 active ML models', '94.7% avg accuracy', '15min model refresh'],
      technologies: ['TensorFlow', 'PyTorch', 'Apache Spark', 'Kubernetes'],
      capabilities: [
        'Automated feature engineering and selection',
        'A/B testing framework for model performance',
        'Real-time model scoring and inference',
        'MLOps pipeline with CI/CD integration'
      ]
    },
    {
      title: 'Real-Time Analytics Engine',
      description: 'High-performance stream processing platform handling billions of property and market events daily',
      metrics: ['2.84B events/day', '0.45s latency', '99.98% uptime'],
      technologies: ['Apache Kafka', 'Apache Flink', 'Redis', 'ClickHouse'],
      capabilities: [
        'Complex event processing with CEP rules',
        'Real-time aggregations and windowing',
        'Multi-dimensional data cubes',
        'Stream-to-batch data synchronization'
      ]
    },
    {
      title: 'Advanced Analytics API',
      description: 'RESTful and GraphQL APIs providing programmatic access to analytics insights and data pipelines',
      metrics: ['125M API calls/day', '50ms response time', '99.9% availability'],
      technologies: ['GraphQL', 'REST', 'Apollo Federation', 'Kong Gateway'],
      capabilities: [
        'Real-time query optimization',
        'Intelligent caching strategies',
        'Rate limiting and quota management',
        'Developer portal with interactive docs'
      ]
    },
    {
      title: 'Enterprise Business Intelligence',
      description: 'Comprehensive BI platform with self-service analytics, custom reporting, and executive dashboards',
      metrics: ['8,750 active users', '15K+ dashboards', '500+ reports'],
      technologies: ['Apache Superset', 'Looker', 'Tableau', 'Power BI'],
      capabilities: [
        'Drag-and-drop report builder',
        'Scheduled report delivery',
        'Role-based access controls',
        'Export to multiple formats'
      ]
    }
  ];

  const dataInsights = [
    {
      insight: 'Property Price Trends',
      description: 'AI-powered analysis of price movements across 15+ Irish counties',
      dataPoints: '2.1M properties analyzed',
      accuracy: '94.7%',
      updateFrequency: 'Real-time'
    },
    {
      insight: 'Market Demand Forecasting',
      description: 'Predictive models for buyer demand and inventory planning',
      dataPoints: '500K buyer interactions',
      accuracy: '91.2%',
      updateFrequency: 'Hourly'
    },
    {
      insight: 'Investment ROI Analysis',
      description: 'Comprehensive return calculations with risk assessment',
      dataPoints: '75K investment portfolios',
      accuracy: '89.6%',
      updateFrequency: 'Daily'
    },
    {
      insight: 'Development Viability Scoring',
      description: 'Location-based development potential assessment',
      dataPoints: '10K development sites',
      accuracy: '92.4%',
      updateFrequency: 'Weekly'
    }
  ];

  const integrationPartners = [
    {
      category: 'Data Providers',
      partners: ['Property Registration Authority', 'CSO Ireland', 'Daft.ie', 'MyHome.ie', 'Property Price Register'],
      description: 'Real-time property data feeds and market intelligence'
    },
    {
      category: 'Financial Institutions',
      partners: ['Central Bank of Ireland', 'AIB', 'Bank of Ireland', 'Ulster Bank', 'PTSB'],
      description: 'Mortgage data, lending criteria, and financial market indicators'
    },
    {
      category: 'Government Systems',
      partners: ['Revenue', 'An Bord Pleanála', 'Local Authorities', 'SEAI', 'EPA'],
      description: 'Planning data, environmental factors, and regulatory information'
    },
    {
      category: 'Technology Partners',
      partners: ['Google Cloud', 'AWS', 'Microsoft Azure', 'Snowflake', 'Databricks'],
      description: 'Cloud infrastructure, data warehousing, and ML platforms'
    }
  ];

  const tabs = [
    { id: 'platform', label: 'Analytics Platform', icon: BarChart3 },
    { id: 'insights', label: 'Market Insights', icon: TrendingUp },
    { id: 'machine-learning', label: 'Machine Learning', icon: Brain },
    { id: 'data-pipeline', label: 'Data Infrastructure', icon: Database },
    { id: 'integrations', label: 'Data Sources', icon: Globe },
    { id: 'architecture', label: 'Technical Stack', icon: Layers }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-purple-900 to-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">Enterprise Analytics Platform</h1>
              <p className="text-xl text-purple-100 mb-8">
                AI-powered property analytics platform processing {(analyticsMetrics.dataPointsProcessed / 1000000000).toFixed(1)}B+ 
                daily data points with advanced machine learning and real-time insights across Ireland's property market.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold text-green-400">{(analyticsMetrics.dataPointsProcessed / 1000000000).toFixed(1)}B</div>
                  <div className="text-purple-200">Data Points/Day</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-400">{analyticsMetrics.predictiveAccuracy}%</div>
                  <div className="text-purple-200">ML Accuracy</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400">{analyticsMetrics.mlModelsActive}</div>
                  <div className="text-purple-200">Active ML Models</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-400">{analyticsMetrics.systemUptime}%</div>
                  <div className="text-purple-200">System Uptime</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-6">Live Analytics Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Data Processing Speed</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-white/20 rounded-full h-2">
                      <div className="bg-green-400 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                    <span className="font-semibold">{analyticsMetrics.dataLatency}s</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>API Requests</span>
                  <span className="font-semibold">{(analyticsMetrics.apiCalls / 1000000).toFixed(0)}M/day</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Active Dashboard Users</span>
                  <span className="font-semibold">{(analyticsMetrics.dashboardUsers / 1000).toFixed(1)}K users</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Real-time Insights</span>
                  <span className="font-semibold">{(analyticsMetrics.realTimeInsights / 1000).toFixed(1)}K/hour</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Status */}
      <section className="bg-white border-b py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium">All Analytics Systems Operational</span>
              </div>
              <div className="text-sm text-gray-600">
                Last updated: {new Date().toLocaleTimeString()} | Processing: {(analyticsMetrics.dataPointsProcessed / 24 / 60 / 60 / 1000).toFixed(0)}K events/sec
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-green-600 font-medium">✓ Real-time Processing</div>
              <div className="text-sm text-blue-600 font-medium">✓ ML Models Active</div>
              <div className="text-sm text-purple-600 font-medium">✓ Data Quality 99.8%</div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 border-b-2 font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Area */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Platform Overview */}
          {activeTab === 'platform' && (
            <div className="space-y-12">
              <div className="text-center max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">Next-Generation Property Analytics Platform</h2>
                <p className="text-lg text-gray-700">
                  Built on cloud-native architecture with AI-powered insights, our analytics platform 
                  processes billions of property data points daily to deliver actionable intelligence 
                  across the entire property ecosystem.
                </p>
              </div>

              <div className="grid gap-8">
                {analyticsCapabilities.map((capability, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg p-8 border">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center">
                        <div className="p-4 bg-purple-100 rounded-xl mr-6">
                          <capability.icon className="h-8 w-8 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{capability.category}</h3>
                          <div className="text-green-600 font-semibold mt-1">{capability.impact}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">Enterprise Analytics</div>
                        <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          AI-Powered
                        </div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Core Capabilities</h4>
                        <ul className="space-y-2">
                          {capability.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-semibold mb-3">Performance Metrics</h4>
                        <div className="space-y-3">
                          {capability.metrics.map((metric, metricIndex) => (
                            <div key={metricIndex} className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">{metric.split(' ')[0]}</span>
                              <span className="font-semibold text-blue-600">{metric.split(' ').slice(1).join(' ')}</span>
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

          {/* Market Insights */}
          {activeTab === 'insights' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-center">Market Intelligence & Insights</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {dataInsights.map((insight, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-8 border">
                    <h3 className="text-xl font-bold mb-3">{insight.insight}</h3>
                    <p className="text-gray-700 mb-6">{insight.description}</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{insight.dataPoints}</div>
                        <div className="text-xs text-gray-500">Data Points</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{insight.accuracy}</div>
                        <div className="text-xs text-gray-500">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">{insight.updateFrequency}</div>
                        <div className="text-xs text-gray-500">Updates</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 border">
                <h3 className="text-xl font-bold mb-6">Data Integration Partners</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  {integrationPartners.map((category, index) => (
                    <div key={index} className="bg-white rounded-lg p-6">
                      <h4 className="font-semibold mb-2">{category.category}</h4>
                      <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {category.partners.map((partner, partnerIndex) => (
                          <span key={partnerIndex} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {partner}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Technical Architecture */}
          {activeTab === 'architecture' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-center">Enterprise Technical Architecture</h2>
              
              <div className="grid gap-8">
                {enterpriseFeatures.map((feature, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-8 border">
                    <div className="grid lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2">
                        <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                        <p className="text-gray-700 mb-6">{feature.description}</p>
                        <div className="mb-6">
                          <h4 className="font-semibold mb-3">Key Capabilities</h4>
                          <ul className="grid md:grid-cols-2 gap-2">
                            {feature.capabilities.map((capability, capIndex) => (
                              <li key={capIndex} className="flex items-start text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">{capability}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                          {feature.metrics.map((metric, metricIndex) => (
                            <div key={metricIndex} className="bg-gray-50 rounded-lg p-4 text-center">
                              <div className="font-bold text-lg text-purple-600">{metric.split(' ')[0]}</div>
                              <div className="text-sm text-gray-600">{metric.split(' ').slice(1).join(' ')}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-semibold mb-4">Technology Stack</h4>
                        <div className="space-y-3">
                          {feature.technologies.map((tech, techIndex) => (
                            <div key={techIndex} className="flex items-center">
                              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                              <span className="font-medium">{tech}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900 text-white rounded-xl p-8">
                <h3 className="text-xl font-bold mb-6">Platform Performance Metrics</h3>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">{analyticsMetrics.systemUptime}%</div>
                    <div className="text-gray-300">Uptime SLA</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">{analyticsMetrics.dataLatency}s</div>
                    <div className="text-gray-300">Data Latency</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400">{(analyticsMetrics.apiCalls / 1000000).toFixed(0)}M</div>
                    <div className="text-gray-300">Daily API Calls</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400">{analyticsMetrics.mlModelsActive}</div>
                    <div className="text-gray-300">ML Models</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs with enterprise content placeholder */}
          {['machine-learning', 'data-pipeline', 'integrations'].includes(activeTab) && (
            <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Enterprise Analytics Deep Dive</h2>
                <p className="text-gray-600 mb-8">
                  Access comprehensive technical documentation and implementation guides for our enterprise 
                  {activeTab === 'machine-learning' && ' machine learning platform and AI model development'}
                  {activeTab === 'data-pipeline' && ' data infrastructure and real-time processing capabilities'}
                  {activeTab === 'integrations' && ' data source integrations and API management'} 
                  capabilities.
                </p>
                <div className="flex justify-center space-x-4">
                  <Link 
                    href="/developer/documentation"
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                  >
                    Technical Documentation
                  </Link>
                  <Link 
                    href="/developer/analytics-api"
                    className="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 font-medium"
                  >
                    Analytics API Reference
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}