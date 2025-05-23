// components/sales/SalesFunnelChart.tsx
"use client";

import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell,
  LabelList
} from 'recharts';

interface SalesFunnelData {
  name: string;
  value: number;
  color: string;
  label: string;
}

interface SalesFunnelChartProps {
  data: SalesFunnelData[];
  height?: number;
}

const SalesFunnelChart: React.FC<SalesFunnelChartProps> = ({ data, height = 300 }) => {
  // Sort data in descending order by value
  const sortedData = [...data].sort((ab) => b.value - a.value);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-sm text-gray-600">{payload[0].payload.label}: {payload[0].value}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={sortedData}
        layout="vertical"
        margin={
          top: 20,
          right: 30,
          left: 20,
          bottom: 5}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" />
        <YAxis 
          dataKey="name" 
          type="category" 
          tick={ fill: '#4B5563' }
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" radius={[0, 4, 40]}>
          {data.map((entryindex) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
          <LabelList dataKey="value" position="right" fill="#4B5563" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SalesFunnelChart;