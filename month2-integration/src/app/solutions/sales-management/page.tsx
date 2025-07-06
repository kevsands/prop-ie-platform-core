'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BarChart3, Users, TrendingUp, Calendar, DollarSign, 
  Target, Phone, Mail, MessageSquare, FileText, Download,
  Filter, Search, MoreHorizontal, Eye, Star, Clock, 
  ArrowRight, Home, Building, PlusCircle, Settings,
  Activity, AlertCircle, CheckCircle, Zap, Award,
  Brain, Globe, Shield, Database, Layers, Gauge,
  ArrowUpRight, ArrowDownRight, TrendingDown,
  Briefcase, UserCheck, Bell, Smartphone, Tablet
} from 'lucide-react';

export default function EnterpriseeSalesManagementPage() {
  const [activeTab, setActiveTab] = useState('platform');

  const enterpriseMetrics = {
    totalTransactionValue: 847500000, // €847.5M
    activeTransactions: 1247,
    completionRate: 94.7,
    averageDealSize: 425000,
    automationLevel: 89.3,
    stakeholderCount: 15420,
    systemUptime: 99.97,
    dataProcessingVolume: 2847000 // daily events
  };

  const platformCapabilities = [
    {
      category: 'AI-Powered Lead Scoring',
      features: [
        'Machine learning models analyze 200+ data points',
        'Predictive buyer behavior scoring (95% accuracy)',
        'Automated lead routing and prioritization',
        'Real-time conversion probability calculations'
      ],
      impact: '340% increase in qualified lead conversion',
      icon: Brain
    },
    {
      category: 'Intelligent Transaction Orchestration',
      features: [
        'Multi-party workflow automation across 15+ stakeholders',
        'Critical path analysis with risk mitigation',
        'Real-time compliance monitoring and reporting',
        'Automated milestone tracking and notifications'
      ],
      impact: '67% reduction in transaction completion time',
      icon: Zap
    },
    {
      category: 'Enterprise Data Analytics',
      features: [
        'Real-time market intelligence and price modeling',
        'Predictive demand forecasting with 92% accuracy',
        'Portfolio performance analytics and optimization',
        'Custom KPI dashboards with 50+ metrics'
      ],
      impact: '28% improvement in pricing optimization',
      icon: BarChart3
    },
    {
      category: 'Omnichannel Communication Hub',
      features: [
        'Unified messaging across email, SMS, WhatsApp, Teams',
        'AI-powered response suggestions and templates',
        'Multi-language support with real-time translation',
        'Voice-to-text transcription and sentiment analysis'
      ],
      impact: '85% faster response times to customer inquiries',
      icon: MessageSquare
    }
  ];

  const systemIntegrations = [
    {
      system: 'Financial Institution APIs',
      description: 'Real-time mortgage pre-approval and lending workflows',
      partners: ['AIB', 'Bank of Ireland', 'Ulster Bank', 'Permanent TSB'],
      dataVolume: '50,000+ daily API calls'
    },
    {
      system: 'Legal & Conveyancing Systems',
      description: 'Automated legal document generation and e-signature workflows',
      partners: ['Law Society', 'Property Registration Authority', 'Revenue'],
      dataVolume: '25,000+ documents processed monthly'
    },
    {
      system: 'Construction Management',
      description: 'Live project tracking, progress monitoring, and quality assurance',
      partners: ['Oracle Primavera', 'Procore', 'PlanGrid', 'BIM 360'],
      dataVolume: '100+ active construction projects'
    },
    {
      system: 'Government & Regulatory',
      description: 'Direct integration with planning, building control, and compliance systems',
      partners: ['An Bord Pleanála', 'Local Authorities', 'SEAI', 'CRO'],
      dataVolume: '1,000+ regulatory checks daily'
    }
  ];

  const enterpriseFeatures = [
    {
      title: 'Advanced Revenue Intelligence',
      description: 'AI-driven sales forecasting with machine learning models that analyze historical data, market trends, and external factors',
      metrics: ['€2.3B+ in sales pipeline', '94.7% forecast accuracy', '15% revenue growth YoY'],
      technologies: ['TensorFlow', 'Apache Spark', 'Elasticsearch']
    },
    {
      title: 'Blockchain Transaction Security',
      description: 'Immutable transaction records with smart contract automation for deposit management and milestone payments',
      metrics: ['100% transaction transparency', '0 security incidents', '15-second verification'],
      technologies: ['Ethereum', 'IPFS', 'Chainlink Oracles']
    },
    {
      title: 'Enterprise API Gateway',
      description: 'Microservices architecture supporting 10,000+ concurrent users with 99.97% uptime',
      metrics: ['10M+ API requests/day', '50ms average response', '99.97% uptime SLA'],
      technologies: ['Kong Gateway', 'Redis', 'PostgreSQL']
    },
    {
      title: 'Real-Time Collaboration Suite',
      description: 'Multi-stakeholder workspaces with live document collaboration, video conferencing, and progress tracking',
      metrics: ['15+ stakeholder types', '500+ concurrent sessions', '40% faster completions'],
      technologies: ['WebRTC', 'Socket.io', 'Microsoft Graph']
    }
  ];

  const tabs = [
    { id: 'platform', label: 'Platform Overview', icon: Globe },
    { id: 'intelligence', label: 'Sales Intelligence', icon: Brain },
    { id: 'automation', label: 'Process Automation', icon: Zap },
    { id: 'integrations', label: 'System Integrations', icon: Database },
    { id: 'analytics', label: 'Enterprise Analytics', icon: BarChart3 },
    { id: 'architecture', label: 'Technical Architecture', icon: Layers }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-slate-900 to-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">Enterprise Sales Management Platform</h1>
              <p className="text-xl text-blue-100 mb-8">
                AI-powered property sales orchestration platform processing €{(enterpriseMetrics.totalTransactionValue / 1000000).toFixed(1)}M+ 
                in annual transactions across Ireland's largest property developments.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold text-green-400">€{(enterpriseMetrics.totalTransactionValue / 1000000).toFixed(1)}M</div>
                  <div className="text-blue-200">Transaction Volume</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-400">{enterpriseMetrics.completionRate}%</div>
                  <div className="text-blue-200">Completion Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400">{enterpriseMetrics.activeTransactions}</div>
                  <div className="text-blue-200">Active Deals</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-400">{enterpriseMetrics.systemUptime}%</div>
                  <div className="text-blue-200">System Uptime</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-6">Live Platform Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Automation Level</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-white/20 rounded-full h-2">
                      <div className="bg-green-400 h-2 rounded-full" style={{ width: `${enterpriseMetrics.automationLevel}%` }}></div>
                    </div>
                    <span className="font-semibold">{enterpriseMetrics.automationLevel}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Data Processing</span>
                  <span className="font-semibold">{(enterpriseMetrics.dataProcessingVolume / 1000).toFixed(1)}K events/day</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Connected Stakeholders</span>
                  <span className="font-semibold">{(enterpriseMetrics.stakeholderCount / 1000).toFixed(1)}K+ users</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Deal Size</span>
                  <span className="font-semibold">€{(enterpriseMetrics.averageDealSize / 1000).toFixed(0)}K</span>
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
                <span className="text-sm font-medium">All Systems Operational</span>
              </div>
              <div className="text-sm text-gray-600">
                Last updated: {new Date().toLocaleTimeString()} | Processing: {(enterpriseMetrics.dataProcessingVolume / 24 / 60).toFixed(0)} events/min
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-green-600 font-medium">✓ SOC 2 Certified</div>
              <div className="text-sm text-blue-600 font-medium">✓ ISO 27001</div>
              <div className="text-sm text-purple-600 font-medium">✓ GDPR Compliant</div>
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
                    ? 'border-blue-600 text-blue-600'
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
                <h2 className="text-3xl font-bold mb-6">Next-Generation Property Sales Platform</h2>
                <p className="text-lg text-gray-700">
                  Built on microservices architecture with AI-powered automation, our platform handles 
                  the complete property sales lifecycle from lead generation to transaction completion 
                  across multiple stakeholder ecosystems.
                </p>
              </div>

              <div className="grid gap-8">
                {platformCapabilities.map((capability, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg p-8 border">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center">
                        <div className="p-4 bg-blue-100 rounded-xl mr-6">
                          <capability.icon className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{capability.category}</h3>
                          <div className="text-green-600 font-semibold mt-1">{capability.impact}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">Enterprise Feature</div>
                        <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
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
                        <h4 className="font-semibold mb-3">Integration Ecosystem</h4>
                        <div className="grid grid-cols-3 gap-3">
                          {['APIs', 'Webhooks', 'GraphQL', 'REST', 'WebSocket', 'gRPC'].map((tech, techIndex) => (
                            <div key={techIndex} className="text-center p-2 bg-white rounded border">
                              <div className="text-xs font-medium">{tech}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border">
                <h3 className="text-xl font-bold mb-6">Enterprise System Integrations</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  {systemIntegrations.map((integration, index) => (
                    <div key={index} className="bg-white rounded-lg p-6">
                      <h4 className="font-semibold mb-2">{integration.system}</h4>
                      <p className="text-gray-600 text-sm mb-4">{integration.description}</p>
                      <div className="space-y-2">
                        <div className="text-xs text-gray-500">Partners:</div>
                        <div className="flex flex-wrap gap-1">
                          {integration.partners.map((partner, partnerIndex) => (
                            <span key={partnerIndex} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                              {partner}
                            </span>
                          ))}
                        </div>
                        <div className="text-xs text-green-600 font-medium mt-2">{integration.dataVolume}</div>
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
                        <div className="grid md:grid-cols-3 gap-4">
                          {feature.metrics.map((metric, metricIndex) => (
                            <div key={metricIndex} className="bg-gray-50 rounded-lg p-4 text-center">
                              <div className="font-bold text-lg text-blue-600">{metric.split(' ')[0]}</div>
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
                    <div className="text-3xl font-bold text-green-400">99.97%</div>
                    <div className="text-gray-300">Uptime SLA</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">50ms</div>
                    <div className="text-gray-300">Avg Response</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400">10M+</div>
                    <div className="text-gray-300">Daily API Calls</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400">10K+</div>
                    <div className="text-gray-300">Concurrent Users</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs would be implemented similarly with enterprise-grade content */}
          {['intelligence', 'automation', 'integrations', 'analytics'].includes(activeTab) && (
            <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Enterprise Feature Deep Dive</h2>
                <p className="text-gray-600 mb-8">
                  Access comprehensive documentation and technical specifications for our enterprise 
                  {activeTab === 'intelligence' && ' sales intelligence and AI-powered lead scoring'}
                  {activeTab === 'automation' && ' process automation and workflow orchestration'}
                  {activeTab === 'integrations' && ' system integration and API management'}
                  {activeTab === 'analytics' && ' analytics platform and business intelligence'} 
                  capabilities.
                </p>
                <div className="flex justify-center space-x-4">
                  <Link 
                    href="/developer/documentation"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Technical Documentation
                  </Link>
                  <Link 
                    href="/solutions/analytics"
                    className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium"
                  >
                    Live Analytics Demo
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