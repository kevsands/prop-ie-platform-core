'use client';

import React from 'react';
import { PropertyManagement } from '@/components/developer/PropertyManagement';
import { ArrowLeft, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function PropertyManagementPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with Back Button */}
        <div className="mb-6">
          <Link 
            href="/developer"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Property Management</h1>
              <p className="text-gray-600 mt-1">
                Comprehensive management of all property units across your developments
              </p>
            </div>
          </div>
        </div>

        {/* Property Management Component */}
        <PropertyManagement />

        {/* Additional Resources */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-3">
              <Link 
                href="/developer/properties/bulk-import"
                className="block text-blue-600 hover:text-blue-700 text-sm"
              >
                Bulk Import Properties
              </Link>
              <Link 
                href="/developer/properties/pricing-tool"
                className="block text-blue-600 hover:text-blue-700 text-sm"
              >
                Pricing Strategy Tool
              </Link>
              <Link 
                href="/developer/properties/marketing"
                className="block text-blue-600 hover:text-blue-700 text-sm"
              >
                Marketing Materials
              </Link>
              <Link 
                href="/developer/properties/reports"
                className="block text-blue-600 hover:text-blue-700 text-sm"
              >
                Sales Reports
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Property Performance</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Sales Velocity</span>
                <span className="font-medium">2.3 units/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Avg. Time on Market</span>
                <span className="font-medium">45 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Price Appreciation</span>
                <span className="font-medium text-green-600">+8.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Reservation Rate</span>
                <span className="font-medium">92%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Market Intelligence</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Market Avg. Price</span>
                <span className="font-medium">€3,650/m²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Our Avg. Price</span>
                <span className="font-medium text-green-600">€3,818/m²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Market Demand</span>
                <span className="font-medium text-green-600">High</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Competition</span>
                <span className="font-medium text-amber-600">Medium</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}