"use client";

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface PerformanceChartProps {
  data: {
    date: string;
    sales: number;
    reservations: number;
    inquiries: number;
  }[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  const [timeRangesetTimeRange] = useState<'30d' | '90d' | '1y' | 'all'>('30d');

  // Filter data based on time range
  const filteredData = (() => {
    if (timeRange === 'all') return data;

    const now = new Date();
    const cutoffDate = new Date();

    switch (timeRange) {
      case '30d':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        cutoffDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return data.filter(item => new Date(item.date) >= cutoffDate);
  })();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <div className="mt-2 space-y-1">
            {payload.map((entry: any, index: number) => (
              <p key={`item-${index}`} className="text-sm" style={ color: entry.color }>
                {entry.name}: {entry.value}
              </p>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <div className="flex space-x-1 bg-gray-100 rounded-md p-1">
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1 text-xs font-medium rounded-md ${
              timeRange === '30d'
                ? 'bg-white shadow-sm text-gray-800'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            30d
          </button>
          <button
            onClick={() => setTimeRange('90d')}
            className={`px-3 py-1 text-xs font-medium rounded-md ${
              timeRange === '90d'
                ? 'bg-white shadow-sm text-gray-800'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            90d
          </button>
          <button
            onClick={() => setTimeRange('1y')}
            className={`px-3 py-1 text-xs font-medium rounded-md ${
              timeRange === '1y'
                ? 'bg-white shadow-sm text-gray-800'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            1y
          </button>
          <button
            onClick={() => setTimeRange('all')}
            className={`px-3 py-1 text-xs font-medium rounded-md ${
              timeRange === 'all'
                ? 'bg-white shadow-sm text-gray-800'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={filteredData} margin={ top: 5, right: 20, bottom: 5, left: 0 }>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={ fontSize: 12 }
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="sales" 
            stroke="#2B5273" 
            activeDot={ r: 8 } 
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="reservations" 
            stroke="#EF4444" 
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="inquiries" 
            stroke="#10B981" 
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;