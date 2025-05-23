// components/analytics/DashboardMetricCard.tsx
import React from 'react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

interface DashboardMetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  className?: string;
}

const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-[#2B5273]">{value}</h3>
        </div>
        {icon && (
          <div className="p-3 bg-blue-100 rounded-full">
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? <FiTrendingUp className="inline mr-1" size={14} /> : <FiTrendingDown className="inline mr-1" size={14} />}
            {Math.abs(trend.value)}% 
          </span>
          {trend.label && (
            <span className="text-sm text-gray-500 ml-1">{trend.label}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardMetricCard;