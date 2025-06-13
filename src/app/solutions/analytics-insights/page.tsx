'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BarChart3, TrendingUp, PieChart, Activity, Users, Globe,
  CheckCircle, ArrowRight, Eye, Calendar, Target, Award,
  Zap, Clock, Search, Star, ChevronRight, LineChart,
  Building, DollarSign, MapPin, Filter, Download
} from 'lucide-react';

export default function AnalyticsInsightsPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    {
      icon: BarChart3,
      title: 'Real-Time Dashboard',
      description: 'Live performance metrics across all your property developments with customizable KPI tracking.',
      benefits: ['Live sales tracking', 'Inventory management', 'Revenue forecasting', 'Market comparisons']
    },
    {
      icon: TrendingUp,
      title: 'Predictive Analytics',
      description: 'AI-powered forecasting and trend analysis to make data-driven development decisions.',
      benefits: ['Demand prediction', 'Price optimization', 'Market timing insights', 'Risk assessment']
    },
    {
      icon: PieChart,
      title: 'Customer Intelligence',
      description: 'Deep buyer behavior analysis and segmentation for targeted marketing strategies.',
      benefits: ['Buyer personas', 'Journey mapping', 'Conversion funnels', 'Retention analysis']
    },
    {
      icon: Globe,
      title: 'Market Intelligence',
      description: 'Comprehensive market data and competitive analysis across Irish property markets.',
      benefits: ['Price benchmarking', 'Competitor tracking', 'Location scoring', 'Trend analysis']
    }
  ];

  const analyticsModules = [
    {
      category: 'Sales Analytics',
      items: [
        'Real-time sales performance tracking',
        'Lead conversion funnel analysis',
        'Sales team performance metrics',
        'Revenue forecasting & projections'
      ]
    },
    {
      category: 'Market Intelligence',
      items: [
        'Competitive pricing analysis',
        'Market demand forecasting',
        'Location performance scoring',
        'Economic indicators tracking'
      ]
    },
    {
      category: 'Customer Analytics',
      items: [
        'Buyer behavior analysis',
        'Customer segmentation',
        'Journey mapping & touchpoints',
        'Satisfaction & retention metrics'
      ]
    },
    {
      category: 'Financial Analytics',
      items: [
        'ROI & profitability analysis',
        'Cost optimization insights',
        'Cash flow forecasting',
        'Investment performance tracking'
      ]
    }
  ];

  const caseStudies = [
    {
      client: 'Dublin Bay Developments',
      metrics: '+35% sales velocity',
      savings: '€2.1M optimization',
      description: 'Increased sales velocity by 35% using predictive analytics to optimize pricing and marketing timing.',
      outcomes: ['35% faster sales cycle', '€2.1M cost savings', '92% buyer satisfaction', '18% higher margins']
    },
    {
      client: 'Cork Waterfront Project',
      metrics: '+28% price premium',
      savings: '€1.8M additional revenue',
      description: 'Achieved 28% price premium through market intelligence and customer behavior insights.',
      outcomes: ['28% premium pricing', '€1.8M additional revenue', 'Zero inventory waste', '94% customer retention']
    }
  ];

  const integrations = [
    { name: 'Google Analytics', logo: '📊', description: 'Website traffic & behavior' },
    { name: 'Salesforce', logo: '⚡', description: 'CRM data integration' },
    { name: 'HubSpot', logo: '🎯', description: 'Marketing automation' },
    { name: 'PowerBI', logo: '📈', description: 'Business intelligence' },
    { name: 'Tableau', logo: '📋', description: 'Data visualization' },
    { name: 'Excel/Sheets', logo: '📑', description: 'Data export/import' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 text-white py-24">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
              <BarChart3 className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium">Analytics & Insights</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Data-Driven Property
              <span className="block text-blue-300">Development Decisions</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Transform raw data into actionable insights with our comprehensive analytics platform. 
              Make smarter development decisions with real-time market intelligence and predictive analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/developer/analytics"
                className="inline-flex items-center px-8 py-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
              >
                View Analytics Dashboard
                <BarChart3 className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/demo/analytics"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all border border-blue-500"
              >
                Interactive Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Comprehensive Analytics Suite</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From real-time dashboards to predictive modeling, get the insights you need to optimize every aspect of your property development business.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, bIndex) => (
                        <li key={bIndex} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Modules */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Analytics Modules</h2>
            <p className="text-xl text-gray-600">Specialized analytics for every aspect of your business</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {analyticsModules.map((module, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{module.category}</h3>
                <ul className="space-y-3">
                  {module.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start text-sm">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Dashboard Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Real-Time Analytics Dashboard</h2>
            <p className="text-xl text-gray-600">See your data come to life with interactive visualizations</p>
          </div>
          
          <div className="bg-gradient-to-br from-slate-100 to-blue-100 rounded-2xl p-8 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Key Metrics Cards */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Sales</p>
                    <p className="text-2xl font-bold text-green-600">€12.4M</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +18% vs last quarter
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Units Sold</p>
                    <p className="text-2xl font-bold text-blue-600">247</p>
                    <p className="text-xs text-blue-600 flex items-center mt-1">
                      <Building className="h-3 w-3 mr-1" />
                      82% of inventory
                    </p>
                  </div>
                  <Building className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Avg. Days to Sale</p>
                    <p className="text-2xl font-bold text-purple-600">23</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      -5 days vs target
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-500" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Sales Performance Trend</h3>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <Download className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="h-48 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Interactive charts and visualizations</p>
                  <Link href="/demo/analytics" className="text-blue-600 hover:underline text-sm">
                    View Live Demo →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">Real results from analytics-driven development</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {caseStudies.map((study, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-8 border border-blue-100">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{study.client}</h3>
                    <p className="text-gray-600">{study.description}</p>
                  </div>
                  <Award className="h-8 w-8 text-blue-600 flex-shrink-0" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{study.metrics}</div>
                    <div className="text-sm text-gray-500">Performance Gain</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{study.savings}</div>
                    <div className="text-sm text-gray-500">Value Created</div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Key Outcomes:</h4>
                  <ul className="space-y-1">
                    {study.outcomes.map((outcome, oIndex) => (
                      <li key={oIndex} className="flex items-center text-sm">
                        <Star className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Seamless Integrations</h2>
            <p className="text-xl text-gray-600">Connect with your existing tools and platforms</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {integrations.map((integration, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center hover:shadow-md transition-all">
                <div className="text-3xl mb-2">{integration.logo}</div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{integration.name}</h3>
                <p className="text-xs text-gray-600">{integration.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Start Making Data-Driven Decisions</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join leading developers using our analytics platform to optimize performance and maximize profits
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/developer/analytics"
              className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:scale-105 transition-all shadow-lg"
            >
              Access Analytics Dashboard
            </Link>
            <Link 
              href="/contact?solution=analytics"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-slate-900 transition-all"
            >
              Schedule Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}