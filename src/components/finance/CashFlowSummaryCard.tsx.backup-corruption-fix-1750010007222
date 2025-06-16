'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { ArrowDownRight, ArrowUpRight, Banknote, CreditCard } from 'lucide-react';
import { CashFlowSummaryProps } from '../../types/finance/dashboard';
import { formatCurrency } from '../../utils/finance/formatting';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { cn } from '../../lib/utils';

/**
 * Cash Flow Summary Card Component
 * 
 * Displays a summary of cash inflows and outflows with a trend chart
 */
const CashFlowSummaryCard = ({
  title = "Cash Flow Summary",
  inflows,
  outflows,
  netCashFlow,
  timeRange,
  className,
  isLoading = false,
  // Extended props with defaults
  description = "",
  period = "Last 30 days",
  inflowLabel = "Total Inflows",
  outflowLabel = "Total Outflows",
  netCashFlowLabel = "Net Cash Flow",
  data = [],
  onClick
}: CashFlowSummaryProps & {
  description?: string;
  period?: string;
  inflowLabel?: string;
  outflowLabel?: string;
  netCashFlowLabel?: string;
  data?: Array<{
    date: string;
    inflow: number;
    outflow: number;
    netflow: number;
  }>\n  );
  onClick?: () => void;
}) => {
  // Calculate if net cash flow is positive
  const isPositive = netCashFlow>= 0;

  // Format values for display
  const formattedInflows = formatCurrency(inflows);
  const formattedOutflows = formatCurrency(outflows);
  const formattedNetCashFlow = formatCurrency(Math.abs(netCashFlow));

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-md shadow-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <p className="font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={ backgroundColor: entry.color }
              />
              <p className="text-sm">
                <span className="font-medium">{entry.name}:</span>{' '}
                {formatCurrency(entry.value)}
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card 
      className={cn(
        "transition-all hover:shadow-md",
        onClick ? "cursor-pointer" : "",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-slate-700 dark:text-slate-300">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-sm mt-0">
            {description}
          </CardDescription>
        )}
        {!description && (
          <CardDescription className="text-sm mt-0">
            {timeRange || period}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {/* Inflows */}
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center mb-1 text-green-600 dark:text-green-400">
              <ArrowDownRight className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">{inflowLabel}</span>
            </div>
            <div className="flex items-center">
              <Banknote className="h-4 w-4 mr-1.5 text-green-500 dark:text-green-400" />
              <span className="font-semibold">{formattedInflows}</span>
            </div>
          </div>

          {/* Outflows */}
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center mb-1 text-red-600 dark:text-red-400">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">{outflowLabel}</span>
            </div>
            <div className="flex items-center">
              <CreditCard className="h-4 w-4 mr-1.5 text-red-500 dark:text-red-400" />
              <span className="font-semibold">{formattedOutflows}</span>
            </div>
          </div>

          {/* Net Cash Flow */}
          <div className={`p-3 rounded-lg ${isPositive ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
            <div className={`flex items-center mb-1 ${isPositive ? 'text-blue-600 dark:text-blue-400' : 'text-amber-600 dark:text-amber-400'}`}>
              <span className="text-xs font-medium">{netCashFlowLabel}</span>
            </div>
            <div className="flex items-center">
              {isPositive ? (
                <ArrowDownRight className="h-4 w-4 mr-1.5 text-blue-500 dark:text-blue-400" />
              ) : (
                <ArrowUpRight className="h-4 w-4 mr-1.5 text-amber-500 dark:text-amber-400" />
              )}
              <span className={`font-semibold ${isPositive ? 'text-blue-600 dark:text-blue-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {isPositive ? '+' : '-'} {formattedNetCashFlow}
              </span>
            </div>
          </div>
        </div>

        {/* Cash Flow Chart */}
        {data.length> 0 && (
          <div className="h-52 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={ top: 5, right: 20, left: 0, bottom: 5 }
              >
                <defs>
                  <linearGradient id="inflow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="outflow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="netflow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="date" 
                  tick={ fontSize: 12 }
                  tickLine={ stroke: '#e2e8f0' }
                />
                <YAxis 
                  tickFormatter={(value: any) => formatCurrency(valuetrue)}
                  tick={ fontSize: 12 }
                  tickLine={ stroke: '#e2e8f0' }
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="inflow"
                  name="Inflows"
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#inflow)"
                />
                <Area
                  type="monotone"
                  dataKey="outflow"
                  name="Outflows"
                  stroke="#EF4444"
                  fillOpacity={1}
                  fill="url(#outflow)"
                />
                <Area
                  type="monotone"
                  dataKey="netflow"
                  name="Net Cash Flow"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#netflow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CashFlowSummaryCard;