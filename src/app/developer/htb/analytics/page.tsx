'use client';

import React from 'react';
// Temporarily comment out problematic imports for build testing
// // Removed import for build testing;
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Badge } from '@/components/ui/badge';
import { 
  PieChart, 
  Pie, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

// Simplified component definitions for build testing

// Simplified Card components
const Card = ({ className = "", children }) => (
  <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ className = "", children }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ className = "", children }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ className = "", children }) => (
  <p className={`text-sm text-gray-500 ${className}`}>
    {children}
  </p>
);

const CardContent = ({ className = "", children }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ className = "", children }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`}>
    {children}
  </div>
);

// Mock data for HTB analytics
const statusData = [
  { name: 'Pending', value: 12, fill: '#FFBF00' },
  { name: 'Processing', value: 24, fill: '#3B82F6' },
  { name: 'Completed', value: 45, fill: '#10B981' },
  { name: 'Rejected', value: 8, fill: '#EF4444' }];

export default function HTBAnalyticsPage() {
  // Simplified placeholder implementation for build testing
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">HTB Analytics</h1>
          <p className="mt-1 text-gray-500">
            Performance metrics and insights for Help-to-Buy claims
          </p>
        </div>
        <select className="border rounded-md px-3 py-2 w-[180px]">
          <option value="year">Last Year</option>
          <option value="month">Last Month</option>
          <option value="quarter">Last Quarter</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Card 1 */}
        <div className="border rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <div className="text-sm font-medium text-gray-500">Total Claims</div>
          </div>
          <div>
            <div className="text-3xl font-semibold text-gray-900">89</div>
            <div className="mt-1 flex items-center text-sm">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">+12.5%</span>
              <span className="text-gray-500 ml-2">vs previous period</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="border rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <div className="text-sm font-medium text-gray-500">Total HTB Amount</div>
          </div>
          <div>
            <div className="text-3xl font-semibold text-gray-900">€2.67M</div>
            <div className="mt-1 flex items-center text-sm">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">+8.2%</span>
              <span className="text-gray-500 ml-2">vs previous period</span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="border rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <div className="text-sm font-medium text-gray-500">Avg. Claim Value</div>
          </div>
          <div>
            <div className="text-3xl font-semibold text-gray-900">€30,000</div>
            <div className="mt-1 flex items-center text-sm">
              <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">-2.1%</span>
              <span className="text-gray-500 ml-2">vs previous period</span>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="border rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <div className="text-sm font-medium text-gray-500">Avg. Processing Time</div>
          </div>
          <div>
            <div className="text-3xl font-semibold text-gray-900">26 days</div>
            <div className="mt-1 flex items-center text-sm">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">-4.3%</span>
              <span className="text-gray-500 ml-2">vs previous period</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        {/* Simplified Pie Chart */}
        <div className="border rounded-lg p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-medium">Help To Buy Status Distribution</h2>
            <p className="text-sm text-gray-500">Overview of claim statuses</p>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                />
                <Tooltip formatter={(value: any) => [`${value} claims`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-md bg-amber-100 p-4 text-amber-800 mb-6">
        <p className="font-medium">Temporarily simplified for build testing</p>
        <p className="text-sm mt-1">The full dashboard with all charts and interactive features will be restored later.</p>
      </div>
    </div>
  );
}