'use client';

// app/developer/projects/fitzgerald-gardens/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { FiHome, FiUsers, FiClipboard, FiTool, FiBarChart2 } from 'react-icons/fi';
import Link from 'next/link';
import type { IconBaseProps } from 'react-icons';

export default function FitzgeraldGardensHub() {
  const [projectStatssetProjectStats] = useState({
    totalUnits: 97,
    available: 78,
    reserved: 12,
    sold: 7,
    snags: 3,
    totalDeposits: 475000, // €5k × 12 reserved + (higher amounts for those further along)
  });

  const [salesVelocitysetSalesVelocity] = useState({
    lastWeek: 3,
    lastMonth: 8,
    trend: 'up'});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#2B5273]">Fitzgerald Gardens</h1>
          <p className="text-gray-600">Premium sustainable homes in Drogheda with connectivity to Dublin</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">ACTIVE</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">SALES OPEN</span>
        </div>
      </div>

      {/* Key Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Unit Status</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{projectStats.available}</div>
              <div className="text-sm text-gray-500">Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-500">{projectStats.reserved}</div>
              <div className="text-sm text-gray-500">Reserved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{projectStats.sold}</div>
              <div className="text-sm text-gray-500">Sold</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Sales Velocity</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#2B5273]">{salesVelocity.lastWeek}</div>
              <div className="text-sm text-gray-500">Last 7 Days</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#2B5273]">{salesVelocity.lastMonth}</div>
              <div className="text-sm text-gray-500">Last 30 Days</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <span className={`text-sm font-medium ${salesVelocity.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {salesVelocity.trend === 'up' ? '↑' : '↓'} 
              {salesVelocity.trend === 'up' ? '+18%' : '-12%'} vs Previous Period
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Financial Summary</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <div className="text-sm text-gray-500">Total Deposits Collected</div>
              <div className="text-2xl font-bold text-[#2B5273]">€{projectStats.totalDeposits.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Projected Revenue (Total)</div>
              <div className="text-2xl font-bold text-[#2B5273]">€38,250,000</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
        <Link href="/developer/projects/fitzgerald-gardens/units" className="bg-white rounded-lg shadow-md p-6 text-center hover:bg-gray-50 transition-colors">
          {FiHome({ className: "text-gray-400" })}
          <h3 className="font-medium">Units</h3>
          <p className="text-sm text-gray-500">Manage all 97 units</p>
        </Link>

        <Link href="/developer/projects/fitzgerald-gardens/sales" className="bg-white rounded-lg shadow-md p-6 text-center hover:bg-gray-50 transition-colors">
          {FiUsers({ className: "text-gray-400" })}
          <h3 className="font-medium">Sales</h3>
          <p className="text-sm text-gray-500">Track reservations & deposits</p>
        </Link>

        <Link href="/developer/projects/fitzgerald-gardens/documents" className="bg-white rounded-lg shadow-md p-6 text-center hover:bg-gray-50 transition-colors">
          {FiClipboard({ className: "text-gray-400" })}
          <h3 className="font-medium">Documents</h3>
          <p className="text-sm text-gray-500">Manage legal documents</p>
        </Link>

        <Link href="/developer/projects/fitzgerald-gardens/construction" className="bg-white rounded-lg shadow-md p-6 text-center hover:bg-gray-50 transition-colors">
          {FiTool({ className: "text-gray-400" })}
          <h3 className="font-medium">Construction</h3>
          <p className="text-sm text-gray-500">BOQ & contractor management</p>
        </Link>

        <Link href="/developer/projects/fitzgerald-gardens/analytics" className="bg-white rounded-lg shadow-md p-6 text-center hover:bg-gray-50 transition-colors">
          {FiBarChart2({ className: "text-gray-400" })}
          <h3 className="font-medium">Analytics</h3>
          <p className="text-sm text-gray-500">Sales & performance data</p>
        </Link>
      </div>
    </div>
  );
}