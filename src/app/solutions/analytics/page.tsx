'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  Target, 
  Users, 
  DollarSign, 
  Clock, 
  Brain, 
  Zap,
  CheckCircle,
  ChevronRight,
  ArrowRight,
  Eye,
  Settings,
  Shield,
  Smartphone,
  Globe,
  Award,
  Star,
  Calendar,
  FileText,
  RefreshCw,
  AlertCircle,
  Activity
} from 'lucide-react';

const analyticsFeatures = [
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: 'Sales Performance Analytics',
    description: 'Track conversion rates, sales velocity, and revenue metrics across all developments',
    features: ['Real-time dashboards', 'Custom KPI tracking', 'Comparative analysis', 'Revenue forecasting']
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Buyer Behavior Intelligence', 
    description: 'Understand your customers with advanced behavioral analytics and journey mapping',
    features: ['Journey tracking', 'Engagement heatmaps', 'Preference analysis', 'Churn prediction']
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: 'Market Trend Analysis',
    description: 'Stay ahead with predictive market insights and competitive intelligence',
    features: ['Price trend analysis', 'Market forecasting', 'Competitor tracking', 'Demand prediction']
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: 'Lead Generation Analytics',
    description: 'Optimize your marketing spend with detailed campaign performance insights',
    features: ['Campaign ROI tracking', 'Lead source analysis', 'Cost per acquisition', 'Attribution modeling']
  },
  {
    icon: <PieChart className="w-8 h-8" />,
    title: 'Portfolio Performance',
    description: 'Comprehensive overview of all your developments and investment performance',
    features: ['Portfolio dashboards', 'Asset performance', 'Risk assessment', 'Yield analysis']
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: 'AI-Powered Insights',
    description: 'Machine learning algorithms that identify opportunities and predict outcomes',
    features: ['Predictive modeling', 'Anomaly detection', 'Smart recommendations', 'Automated alerts']
  }
];

const metrics = [
  { label: 'Average Sales Increase', value: '35%', description: 'with data-driven insights' },
  { label: 'Time to Sale Reduction', value: '28 days', description: 'faster sales cycles' },
  { label: 'Marketing ROI Improvement', value: '150%', description: 'better campaign performance' },
  { label: 'Customer Satisfaction', value: '94%', description: 'client satisfaction rate' }
];

const dashboards = [
  {
    name: 'Executive Dashboard',
    description: 'High-level KPIs and strategic insights',
    features: ['Revenue overview', 'Portfolio performance', 'Market position', 'Growth trends']
  },
  {
    name: 'Sales Dashboard',
    description: 'Detailed sales performance and pipeline analysis',
    features: ['Conversion funnels', 'Sales velocity', 'Lead quality', 'Team performance']
  },
  {
    name: 'Marketing Dashboard',
    description: 'Campaign performance and customer acquisition metrics',
    features: ['Campaign ROI', 'Channel effectiveness', 'Customer journey', 'Attribution analysis']
  },
  {
    name: 'Operations Dashboard',
    description: 'Project management and operational efficiency metrics',
    features: ['Project timelines', 'Resource utilization', 'Quality metrics', 'Cost analysis']
  }
];

const integrations = [
  'Google Analytics', 'Facebook Ads', 'LinkedIn Ads', 'Mailchimp', 'HubSpot', 'Salesforce',
  'Sage Accounting', 'Xero', 'QuickBooks', 'MS Project', 'Asana', 'Slack'
];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('features');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full mb-6">
              <BarChart3 className="w-4 h-4 mr-2 text-blue-300" />
              <span className="text-blue-300 font-medium">Analytics & Insights</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Turn Data Into
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Profitable Decisions
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Unlock the power of your property data with advanced analytics, AI-driven insights, 
              and real-time dashboards that drive results and maximize ROI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/demo"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-xl"
              >
                See Analytics in Action
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/20 transition-all border border-white/30"
              >
                Get Custom Demo
                <Activity className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-blue-300 mb-2">{metric.value}</div>
                <div className="text-white font-semibold mb-1">{metric.label}</div>
                <div className="text-gray-300 text-sm">{metric.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'features', label: 'Features', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'dashboards', label: 'Dashboards', icon: <Eye className="w-4 h-4" /> },
              { id: 'insights', label: 'AI Insights', icon: <Brain className="w-4 h-4" /> },
              { id: 'integrations', label: 'Integrations', icon: <Zap className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      {activeTab === 'features' && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Comprehensive Analytics Suite</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to understand your business, optimize performance, and drive growth
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {analyticsFeatures.map((feature, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="text-blue-600 mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dashboards Section */}
      {activeTab === 'dashboards' && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Role-Based Dashboards</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Customized views for every role in your organization
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {dashboards.map((dashboard, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-blue-600">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{dashboard.name}</h3>
                  <p className="text-gray-600 mb-6">{dashboard.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    {dashboard.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-700">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* AI Insights Section */}
      {activeTab === 'insights' && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">AI-Powered Intelligence</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Machine learning algorithms that work 24/7 to identify opportunities and risks
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-600 rounded-lg p-3">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Predictive Analytics</h3>
                      <p className="text-gray-600">Forecast sales, identify market trends, and predict buyer behavior with 94% accuracy.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-600 rounded-lg p-3">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Intelligent Alerts</h3>
                      <p className="text-gray-600">Get notified about important changes, opportunities, and potential issues before they impact your business.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-600 rounded-lg p-3">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Recommendations</h3>
                      <p className="text-gray-600">Receive actionable insights and recommendations to optimize pricing, marketing, and operations.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Real-Time Intelligence</h3>
                <div className="space-y-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Sales Velocity</span>
                      <span className="text-green-300">+15%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-green-400 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Lead Quality Score</span>
                      <span className="text-blue-300">8.7/10</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-blue-400 h-2 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Market Opportunity</span>
                      <span className="text-purple-300">High</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-purple-400 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Integrations Section */}
      {activeTab === 'integrations' && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Seamless Integrations</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Connect with your existing tools and systems for a unified view of your business
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {integrations.map((integration, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-3"></div>
                  <div className="text-sm font-medium text-gray-900">{integration}</div>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <div className="bg-blue-50 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Custom Integrations Available</h3>
                <p className="text-gray-600 mb-6">Need to connect with a system not listed? Our team can build custom integrations for your specific needs.</p>
                <Link 
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Discuss Custom Integration
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Data?</h2>
          <p className="text-xl mb-8">
            Join leading property developers who use our analytics platform to make smarter decisions and drive growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/demo"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Book Free Demo
              <Calendar className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/20 transition-all border border-white/30"
            >
              Talk to Expert
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}