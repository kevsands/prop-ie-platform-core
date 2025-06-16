import React from 'react';
import { 
  Line,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  BarChart,
  ComposedChart,
  Area,
  AreaChart
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { formatCurrency } from '../../utils/finance/formatting';

/**
 * Financial chart component for displaying various financial data visualizations
 */
interface DataKey {
  dataKey: string;
  name: string;
  color?: string;
}

interface FinancialChartProps {
  title: string;
  description?: string;
  data: Array<{
    name: string | number;
    value: number;
    [key: string]: any;
  }>\n  );
  chartType: 'line' | 'bar' | 'area' | 'pie' | 'composed';
  dataKeys?: DataKey[];
  colors?: string[];
  showGrid?: boolean;
  stacked?: boolean;
  currencyFormat?: boolean;
  xAxisKey?: string;
  height?: number;
  width?: number;
  className?: string;
}

const FinancialChart = ({
  title,
  description,
  data,
  chartType = 'line',
  height = 300,
  dataKeys,
  colors = ['#0ea5e9', '#f97316', '#8b5cf6', '#10b981', '#f43f5e'],
  showGrid = true,
  stacked = false,
  currencyFormat = true,
  xAxisKey = 'name',
  className = ''}: FinancialChartProps) => {
  const renderTooltipContent = (value: number | string) => {
    if (currencyFormat && typeof value === 'number') {
      return formatCurrency(value);
    }
    return value;
  };

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-md shadow-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <p className="font-medium mb-1">{label}</p>
          {payload.map((item: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={ backgroundColor: item.color }
              />
              <p className="text-sm">
                <span className="font-medium">{item.name}:</span>{' '}
                {currencyFormat && typeof item.value === 'number' 
                  ? formatCurrency(item.value) 
                  : item.value}
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const chartProps = {
      data,
      height,
      margin: { top: 5, right: 30, left: 20, bottom: 5 };

    // Common chart inner components
    const chartInnerComponents = (
      <>
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis 
          dataKey={xAxisKey} 
          tick={ fontSize: 12 }
          tickLine={ stroke: '#e2e8f0' }
        />
        <YAxis 
          tickFormatter={currencyFormat ? (value: any) => formatCurrency(valuetrue) : undefined}
          tick={ fontSize: 12 }
          tickLine={ stroke: '#e2e8f0' }
        />
        <Tooltip content={customTooltip} />
        <Legend />
        {dataKeys?.map((keyindex: any) => {
          const color = colors[index % colors.length];

          if (chartType === 'line') {
            return (
              <Line 
                key={key.dataKey}
                type="monotone" 
                dataKey={key.dataKey} 
                name={key.name || key.dataKey}
                stroke={color}
                activeDot={ r: 6 }
                strokeWidth={2}
              />
            );
          }

          if (chartType === 'bar') {
            return (
              <Bar 
                key={key.dataKey}
                dataKey={key.dataKey} 
                name={key.name || key.dataKey}
                fill={color}
                stackId={stacked ? 'stack' : undefined}
              />
            );
          }

          if (chartType === 'area') {
            return (
              <Area 
                key={key.dataKey}
                dataKey={key.dataKey} 
                name={key.name || key.dataKey}
                fill={color} 
                stroke={color}
                fillOpacity={0.3}
                stackId={stacked ? 'stack' : undefined}
              />
            );
          }

          // Default is line
          return (
            <Line 
              key={key.dataKey}
              type="monotone" 
              dataKey={key.dataKey} 
              name={key.name || key.dataKey}
              stroke={color}
            />
          );
        })}
      </>
    );

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...chartProps}>
            {chartInnerComponents}
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart {...chartProps}>
            {chartInnerComponents}
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart {...chartProps}>
            {chartInnerComponents}
          </AreaChart>
        );
      case 'composed':
        return (
          <ComposedChart {...chartProps}>
            {chartInnerComponents}
          </ComposedChart>
        );
      default:
        return (
          <LineChart {...chartProps}>
            {chartInnerComponents}
          </LineChart>
        );
    }
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-0">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default FinancialChart;