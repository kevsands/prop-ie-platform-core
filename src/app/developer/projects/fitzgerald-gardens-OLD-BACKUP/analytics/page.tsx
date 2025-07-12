'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Target, 
  Users, 
  Eye,
  Radar,
  Activity
} from 'lucide-react';
import AdvancedInvestmentPerformanceDashboard from '@/components/analytics/AdvancedInvestmentPerformanceDashboard';
import RealTimeMarketIntelligenceDashboard from '@/components/analytics/RealTimeMarketIntelligenceDashboard';
import BuyerJourneyTracker from '@/components/developer/BuyerJourneyTracker';
import { fitzgeraldGardensConfig } from '@/data/fitzgerald-gardens-config';
import { realDataService } from '@/services/RealDataService';

// Disable static generation for data service pages
export const dynamic = 'force-dynamic';

export default function FitzgeraldGardensAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'investment' | 'market' | 'competitive' | 'buyers' | 'overview'>('overview');
  const [units, setUnits] = useState([]);
  
  const config = fitzgeraldGardensConfig;

  // Load units on client side to avoid build-time service calls
  useEffect(() => {
    if (typeof realDataService?.getUnits === 'function') {
      setUnits(realDataService.getUnits());
    }
  }, []);

  // Quick stats for overview
  const quickStats = {
    totalInvestment: config.totalInvestment,
    projectedRevenue: config.totalRevenue,
    roi: ((config.totalRevenue - config.totalInvestment) / config.totalInvestment * 100),
    soldUnits: units.filter(u => u.status === 'sold').length,
    totalUnits: units.length,
    absorptionRate: 6.5, // From our analytics
    marketSentiment: 0.73
  };

  const tabs = [
    { 
      key: 'overview', 
      label: 'Overview', 
      icon: Eye,
      description: 'Executive summary of all analytics'
    },
    { 
      key: 'investment', 
      label: 'Investment Performance', 
      icon: TrendingUp,
      description: 'ROI, financial metrics, and performance analysis'
    },
    { 
      key: 'market', 
      label: 'Market Intelligence', 
      icon: Radar,
      description: 'Real-time market data and competitive insights'
    },
    { 
      key: 'buyers', 
      label: 'Buyer Analytics', 
      icon: Users,
      description: 'Buyer behavior and journey optimization'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Fitzgerald Gardens Analytics</h1>
              <p className="text-gray-600">Advanced analytics and market intelligence</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm text-gray-500">Project Status</div>
            <div className="text-lg font-semibold text-green-600">Active Development</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Executive Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Investment</p>
                  <p className="text-2xl font-bold text-gray-900">
                    €{(quickStats.totalInvestment / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Projected ROI</p>
                  <p className="text-2xl font-bold text-green-600">
                    {quickStats.roi.toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sales Progress</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {quickStats.soldUnits}/{quickStats.totalUnits}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-xs text-gray-500">
                  {((quickStats.soldUnits / quickStats.totalUnits) * 100).toFixed(1)}% sold
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Market Sentiment</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {(quickStats.marketSentiment * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="p-3 bg-amber-100 rounded-full">
                  <Activity className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {tabs.slice(1).map(tab => (
              <div key={tab.key} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                   onClick={() => setActiveTab(tab.key as any)}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <tab.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{tab.label}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">{tab.description}</p>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                  View Analysis →
                </button>
              </div>
            ))}
          </div>

          {/* Key Insights Summary */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Performance Highlights</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Strong ROI of {quickStats.roi.toFixed(1)}% projected
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    {((quickStats.soldUnits / quickStats.totalUnits) * 100).toFixed(1)}% of units sold
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    Absorption rate below market average
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Action Items</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Accelerate sales and marketing efforts
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    Monitor competitive pricing changes
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Leverage buyer behavior insights
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'investment' && (
        <AdvancedInvestmentPerformanceDashboard 
          projectId="fitzgerald-gardens"
          viewMode="project"
        />
      )}

      {activeTab === 'market' && (
        <RealTimeMarketIntelligenceDashboard 
          refreshInterval={60}
          alertThresholds={{
            'average-price': 430000,
            'absorption-rate': 8.0
          }}
        />
      )}

      {activeTab === 'buyers' && (
        <BuyerJourneyTracker 
          projectId="fitzgerald-gardens"
          units={units}
        />
      )}
    </div>
  );
}