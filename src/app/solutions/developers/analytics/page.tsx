'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BarChart3, LineChart, PieChart, TrendingUp, TrendingDown, 
  DollarSign, Users, Home, Clock, Target, Calendar,
  Activity, ArrowRight, ChevronRight, Download, Filter,
  Settings, RefreshCw, Eye, AlertCircle, CheckCircle,
  Map, Zap, Trophy, Shield, Brain, Sparkles,
  Package, ShoppingCart, Gauge, Timer, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for demonstrations
const performanceMetrics = {
  totalRevenue: 125500000,
  totalUnits: 450,
  soldUnits: 387,
  averagePrice: 324250,
  conversionRate: 0.68,
  averageDaysToSale: 45,
  yearOverYearGrowth: 23.5,
  projectedRevenue: 145000000
};

const salesVelocity = [
  { month: 'Jan', units: 12, revenue: 3900000 },
  { month: 'Feb', units: 18, revenue: 5850000 },
  { month: 'Mar', units: 25, revenue: 8125000 },
  { month: 'Apr', units: 32, revenue: 10400000 },
  { month: 'May', units: 28, revenue: 9100000 },
  { month: 'Jun', units: 35, revenue: 11375000 },
  { month: 'Jul', units: 42, revenue: 13650000 },
  { month: 'Aug', units: 38, revenue: 12350000 },
  { month: 'Sep', units: 45, revenue: 14625000 },
  { month: 'Oct', units: 52, revenue: 16900000 },
  { month: 'Nov', units: 48, revenue: 15600000 },
  { month: 'Dec', units: 60, revenue: 19500000 }
];

const projectPerformance = [
  { name: 'Fitzgerald Gardens', units: 120, sold: 118, revenue: 42000000, roi: 28.5 },
  { name: 'Ballymakenny View', units: 80, sold: 75, revenue: 26250000, roi: 22.3 },
  { name: 'Riverside Manor', units: 150, sold: 142, revenue: 51100000, roi: 31.2 },
  { name: 'Ellwood Apartments', units: 100, sold: 52, revenue: 18200000, roi: 19.8 }
];

const marketSegments = [
  { segment: 'First-Time Buyers', percentage: 45, value: 56500000, growth: 12.5 },
  { segment: 'Investors', percentage: 25, value: 31375000, growth: 8.2 },
  { segment: 'Downsizers', percentage: 20, value: 25100000, growth: 15.3 },
  { segment: 'Upgraders', percentage: 10, value: 12525000, growth: 5.7 }
];

const leadSources = [
  { source: 'Website', leads: 1250, conversions: 425, rate: 34 },
  { source: 'Agents', leads: 850, conversions: 380, rate: 44.7 },
  { source: 'Digital Ads', leads: 620, conversions: 186, rate: 30 },
  { source: 'Email', leads: 480, conversions: 168, rate: 35 },
  { source: 'Events', leads: 320, conversions: 160, rate: 50 },
  { source: 'Referrals', leads: 280, conversions: 182, rate: 65 }
];

export default function DeveloperAnalyticsPage() {
  const [selectedProject, setSelectedProject] = useState('all');
  const [dateRange, setDateRange] = useState('year');
  const [activeMetric, setActiveMetric] = useState('revenue');
  const [showAIInsights, setShowAIInsights] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center px-6 py-3 bg-blue-600/20 backdrop-blur-sm border border-blue-500/50 rounded-full mb-6"
            >
              <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
              <span className="text-white font-medium">Developer Analytics Platform</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Data-Driven Development Insights
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Transform your property development strategy with real-time analytics, 
              market intelligence, and AI-powered forecasting
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-5 w-5" />
                Refresh Data
              </button>
              <button
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-xl font-medium hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                <Download className="h-5 w-5" />
                Export Report
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 relative -mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: <DollarSign className="h-8 w-8" />,
                label: 'Total Revenue',
                value: `€${(performanceMetrics.totalRevenue / 1000000).toFixed(1)}M`,
                change: '+23.5%',
                trend: 'up'
              },
              {
                icon: <Home className="h-8 w-8" />,
                label: 'Units Sold',
                value: `${performanceMetrics.soldUnits}/${performanceMetrics.totalUnits}`,
                change: '86% Sold',
                trend: 'up'
              },
              {
                icon: <Target className="h-8 w-8" />,
                label: 'Conversion Rate',
                value: `${(performanceMetrics.conversionRate * 100).toFixed(0)}%`,
                change: '+5.2%',
                trend: 'up'
              },
              {
                icon: <Clock className="h-8 w-8" />,
                label: 'Avg Days to Sale',
                value: performanceMetrics.averageDaysToSale,
                change: '-12 days',
                trend: 'down'
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-blue-600">{stat.icon}</div>
                  <div className={`flex items-center text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-orange-600'}`}>
                    {stat.trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                    {stat.change}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Analytics Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-8 items-center justify-between">
            <div className="flex gap-4">
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Projects</option>
                {projectPerformance.map(project => (
                  <option key={project.name} value={project.name}>{project.name}</option>
                ))}
              </select>
              
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
                <option value="all">All Time</option>
              </select>
            </div>
            
            <button
              onClick={() => setShowAIInsights(!showAIInsights)}
              className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                showAIInsights ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'
              }`}
            >
              <Brain className="h-5 w-5" />
              AI Insights
            </button>
          </div>

          {/* AI Insights Panel */}
          <AnimatePresence>
            {showAIInsights && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-8 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-purple-600" />
                    AI-Powered Market Insights
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Market Opportunity</p>
                          <p className="text-sm text-gray-600 mt-1">
                            First-time buyer segment showing 15% growth potential based on recent policy changes
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Price Optimization</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Units priced €10K below market average showing 40% faster sales velocity
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Sales Forecast</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Current trajectory suggests Q4 will exceed targets by 18% with 92 units
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Charts */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Sales Velocity Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center justify-between">
                <span>Sales Velocity</span>
                <div className="flex gap-2">
                  {['revenue', 'units'].map((metric) => (
                    <button
                      key={metric}
                      onClick={() => setActiveMetric(metric)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                        activeMetric === metric
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {metric === 'revenue' ? 'Revenue' : 'Units'}
                    </button>
                  ))}
                </div>
              </h3>
              
              <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <LineChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Interactive Chart Placeholder</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {activeMetric === 'revenue' ? 'Monthly Revenue Trend' : 'Monthly Units Sold'}
                  </p>
                </div>
              </div>
              
              {/* Mini trend indicators */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-lg font-bold text-gray-900">€19.5M</p>
                  <p className="text-sm text-green-600">+22%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Last Month</p>
                  <p className="text-lg font-bold text-gray-900">€15.6M</p>
                  <p className="text-sm text-gray-500">+15%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">YTD Total</p>
                  <p className="text-lg font-bold text-gray-900">€141.4M</p>
                  <p className="text-sm text-green-600">+23.5%</p>
                </div>
              </div>
            </div>

            {/* Market Segments */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6">Market Segments</h3>
              
              <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg mb-6">
                <div className="text-center">
                  <PieChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Segment Distribution Chart</p>
                </div>
              </div>
              
              {/* Segment breakdown */}
              <div className="space-y-4">
                {marketSegments.map((segment, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${
                        index === 0 ? 'bg-blue-600' :
                        index === 1 ? 'bg-green-600' :
                        index === 2 ? 'bg-purple-600' :
                        'bg-orange-600'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-900">{segment.segment}</p>
                        <p className="text-sm text-gray-600">€{(segment.value / 1000000).toFixed(1)}M</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{segment.percentage}%</p>
                      <p className="text-sm text-green-600">+{segment.growth}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Project Performance */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-6">Project Performance</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Project</th>
                    <th className="text-center py-3 px-4">Units</th>
                    <th className="text-center py-3 px-4">Sold</th>
                    <th className="text-center py-3 px-4">Progress</th>
                    <th className="text-right py-3 px-4">Revenue</th>
                    <th className="text-right py-3 px-4">ROI</th>
                    <th className="text-center py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {projectPerformance.map((project, index) => {
                    const progress = (project.sold / project.units) * 100;
                    return (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900">{project.name}</div>
                        </td>
                        <td className="text-center py-4 px-4">{project.units}</td>
                        <td className="text-center py-4 px-4">{project.sold}</td>
                        <td className="py-4 px-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{progress.toFixed(0)}%</p>
                        </td>
                        <td className="text-right py-4 px-4">
                          €{(project.revenue / 1000000).toFixed(1)}M
                        </td>
                        <td className="text-right py-4 px-4">
                          <span className="text-green-600 font-medium">{project.roi}%</span>
                        </td>
                        <td className="text-center py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            progress > 90 ? 'bg-green-100 text-green-700' :
                            progress > 50 ? 'bg-blue-100 text-blue-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {progress > 90 ? 'Near Complete' :
                             progress > 50 ? 'Active' :
                             'In Progress'}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lead Sources & Conversion */}
          <div className="grid lg:grid-cols-2 gap-8 mt-8">
            {/* Lead Sources */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6">Lead Source Performance</h3>
              
              <div className="space-y-4">
                {leadSources.map((source, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">{source.source}</span>
                      <span className="text-sm text-gray-600">{source.rate}% conversion</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full relative"
                        style={{ width: `${source.rate}%` }}
                      >
                        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-white">
                          {source.conversions} / {source.leads}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Best performing source highlight */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Trophy className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Best Performing: Referrals</p>
                    <p className="text-sm text-green-700">65% conversion rate with lowest acquisition cost</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Conversion Funnel */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6">Sales Funnel Analytics</h3>
              
              <div className="space-y-4">
                {[
                  { stage: 'Website Visits', count: 45250, percentage: 100 },
                  { stage: 'Inquiries', count: 5430, percentage: 12 },
                  { stage: 'Viewings Booked', count: 3258, percentage: 60 },
                  { stage: 'Offers Made', count: 1954, percentage: 60 },
                  { stage: 'Sales Completed', count: 1368, percentage: 70 }
                ].map((stage, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{stage.stage}</span>
                        <span className="text-sm text-gray-600">{stage.count.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full"
                          style={{ width: `${stage.percentage}%` }}
                        />
                      </div>
                    </div>
                    {index < 4 && (
                      <div className="text-gray-400">
                        <ChevronRight className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Overall Conversion</p>
                  <p className="text-2xl font-bold text-gray-900">3.02%</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Avg Time to Convert</p>
                  <p className="text-2xl font-bold text-gray-900">21 days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Predictive Analytics */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Brain className="h-8 w-8 text-purple-600" />
              Predictive Analytics & Forecasting
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Q4 Revenue Forecast</h4>
                    <p className="text-3xl font-bold text-green-600 mt-2">€52.3M</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-sm text-gray-600">Based on current velocity and seasonal trends</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Best Case</span>
                    <span className="font-medium">€58.1M</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Worst Case</span>
                    <span className="font-medium">€46.5M</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Market Risk Score</h4>
                    <p className="text-3xl font-bold text-orange-600 mt-2">Medium</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-orange-600" />
                </div>
                <p className="text-sm text-gray-600">Interest rate changes may impact buyer demand</p>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: '60%' }} />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Risk Level: 6/10</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Recommended Actions</h4>
                    <p className="text-lg font-bold text-blue-600 mt-2">3 Opportunities</p>
                  </div>
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Launch first-time buyer campaign</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Adjust pricing on slow-moving units</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Increase digital marketing budget</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Export Options */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold mb-6">Export & Sharing Options</h3>
            
            <div className="grid md:grid-cols-4 gap-4">
              <button className="flex items-center justify-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                <Download className="h-5 w-5 text-gray-600" />
                <span>PDF Report</span>
              </button>
              <button className="flex items-center justify-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                <FileText className="h-5 w-5 text-gray-600" />
                <span>Excel Export</span>
              </button>
              <button className="flex items-center justify-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                <BarChart3 className="h-5 w-5 text-gray-600" />
                <span>PowerBI Connect</span>
              </button>
              <button className="flex items-center justify-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                <Settings className="h-5 w-5 text-gray-600" />
                <span>API Access</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}