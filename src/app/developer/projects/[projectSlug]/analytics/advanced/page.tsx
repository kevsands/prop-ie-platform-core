'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import useProjectData from '@/hooks/useProjectData';
import Link from 'next/link';
import { ArrowLeft, BarChart3, TrendingUp, Target, Activity } from 'lucide-react';

export default function AdvancedAnalyticsPage() {
  const params = useParams();
  const projectSlug = params.projectSlug as string;

  const {
    project,
    units,
    isLoading,
    error,
    totalRevenue,
    averageUnitPrice,
    salesVelocity,
    conversionRate,
    soldUnits,
    totalUnits
  } = useProjectData(projectSlug);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading advanced analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600">Error loading advanced analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/developer/projects/${projectSlug}/analytics`}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Analytics
          </Link>
          <div className="h-6 w-px bg-gray-300"></div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics Hub</h2>
            <p className="text-gray-600">Deep insights and predictive analytics for {project.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
            ADVANCED
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
            PREDICTIVE
          </span>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Revenue Generated</p>
              <p className="text-2xl font-bold">€{(totalRevenue / 1000000).toFixed(1)}M</p>
            </div>
            <BarChart3 size={32} className="text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Sales Performance</p>
              <p className="text-2xl font-bold">{((soldUnits / totalUnits) * 100).toFixed(1)}%</p>
            </div>
            <Target size={32} className="text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Sales Velocity</p>
              <p className="text-2xl font-bold">{salesVelocity}</p>
              <p className="text-purple-200 text-xs">units/month</p>
            </div>
            <TrendingUp size={32} className="text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Conversion Rate</p>
              <p className="text-2xl font-bold">{(conversionRate * 100).toFixed(1)}%</p>
            </div>
            <Activity size={32} className="text-orange-200" />
          </div>
        </div>
      </div>

      {/* Advanced Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Predictive Analytics */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Predictive Sales Analytics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Projected Completion Date</span>
              <span className="text-sm font-semibold text-blue-700">Q2 2025</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Expected Final Revenue</span>
              <span className="text-sm font-semibold text-green-700">€{((totalRevenue / soldUnits) * totalUnits / 1000000).toFixed(1)}M</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Optimal Pricing Strategy</span>
              <span className="text-sm font-semibold text-purple-700">Premium Phase</span>
            </div>
          </div>
        </div>

        {/* Market Intelligence */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Intelligence</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Market Position</span>
              <span className="text-sm font-semibold text-amber-700">Premium Segment</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Competition Level</span>
              <span className="text-sm font-semibold text-red-700">High</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Demand Forecast</span>
              <span className="text-sm font-semibold text-indigo-700">Strong</span>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Charts and Visualizations */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Performance Metrics</h3>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <BarChart3 size={48} className="mx-auto mb-2" />
            <p>Advanced analytics charts will be rendered here</p>
            <p className="text-sm">Real-time data visualization and predictive modeling</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href={`/developer/projects/${projectSlug}/ai-pricing-analytics`}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <h4 className="font-medium text-gray-900 mb-2">AI Pricing Optimization</h4>
            <p className="text-sm text-gray-600">Optimize unit pricing with AI recommendations</p>
          </Link>
          
          <Link
            href={`/developer/projects/${projectSlug}/ai-market-intelligence`}
            className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
          >
            <h4 className="font-medium text-gray-900 mb-2">Market Intelligence</h4>
            <p className="text-sm text-gray-600">Deep market analysis and competitor insights</p>
          </Link>
          
          <Link
            href={`/developer/projects/${projectSlug}/investment-analysis`}
            className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
          >
            <h4 className="font-medium text-gray-900 mb-2">Investment Analysis</h4>
            <p className="text-sm text-gray-600">ROI calculations and financial modeling</p>
          </Link>
        </div>
      </div>
    </div>
  );
}