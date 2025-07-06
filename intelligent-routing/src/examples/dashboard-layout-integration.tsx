'use client';

import React, { useState } from 'react';
import { DashboardGrid, DashboardItem } from '@/components/dashboard/DashboardGrid';
import { MetricCard } from '@/components/ui/metric-card';
import FinancialChart from '@/components/finance/FinancialChart';
import FinancialMetricCard from '@/components/finance/FinancialMetricCard';
import CashFlowSummaryCard from '@/components/finance/CashFlowSummaryCard';
import BudgetVsActualCard from '@/components/finance/BudgetVsActualCard';
import { 
  useFinancialMetrics, 
  useCashFlowData, 
  useBudgetVsActualData 
} from '@/hooks/useFinancialData';
import type { 
  FinancialDashboardFilters 
} from '@/types/finance/dashboard';

/**
 * Example of a financial dashboard layout with integrated data fetching
 * Shows how to connect dashboard widgets to GraphQL data sources
 */
export const FinancialDashboardLayout: React.FC<{
  developmentId: string;
}> = ({ developmentId }) => {
  // Dashboard filter state
  const [filters, setFilters] = useState<FinancialDashboardFilters>({
    dateRange: {
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)),
      endDate: new Date()
    },
    granularity: 'month',
    includeForecast: true,
    viewAs: 'amount'
  });

  // Fetch data using custom hooks
  const { 
    data: metricsData, 
    isLoading: isLoadingMetrics 
  } = useFinancialMetrics(developmentId);
  
  const { 
    data: cashFlowData, 
    isLoading: isLoadingCashFlow 
  } = useCashFlowData(developmentId, filters.granularity || 'month');
  
  const { 
    data: budgetData, 
    isLoading: isLoadingBudget 
  } = useBudgetVsActualData(developmentId);

  // Handler for filter changes
  const handleFilterChange = (newFilters: Partial<FinancialDashboardFilters>) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  };

  // Format currency values
  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('en-IE', { 
      style: 'currency', 
      currency 
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Financial Dashboard</h1>
        
        <div className="flex gap-4">
          <select 
            value={filters.granularity} 
            onChange={(e) => handleFilterChange({ granularity: e.target.value as any })}
            className="px-3 py-2 border rounded-md"
          >
            <option value="day">Daily</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="quarter">Quarterly</option>
            <option value="year">Yearly</option>
          </select>
          
          <label className="flex items-center gap-2">
            <input 
              type="checkbox"
              checked={filters.includeForecast}
              onChange={(e) => handleFilterChange({ includeForecast: e.target.checked })}
            />
            <span>Include Forecast</span>
          </label>
        </div>
      </div>
      
      {/* Dashboard grid layout */}
      <DashboardGrid>
        {/* Top row - Key metrics */}
        <DashboardItem colSpan={1} rowSpan={1}>
          <FinancialMetricCard
            title="Return on Investment"
            value={metricsData?.roi?.value || 0}
            previousValue={metricsData?.roi?.previousValue}
            percentChange={metricsData?.roi?.percentageChange}
            prefix=""
            suffix="%"
            isLoading={isLoadingMetrics}
            trendData={metricsData?.trendData?.roi}
          />
        </DashboardItem>
        
        <DashboardItem colSpan={1} rowSpan={1}>
          <FinancialMetricCard
            title="Profit Margin"
            value={metricsData?.profitMargin?.value || 0}
            previousValue={metricsData?.profitMargin?.previousValue}
            percentChange={metricsData?.profitMargin?.percentageChange}
            prefix=""
            suffix="%"
            isLoading={isLoadingMetrics}
            trendData={metricsData?.trendData?.profitMargin}
          />
        </DashboardItem>
        
        <DashboardItem colSpan={1} rowSpan={1}>
          <FinancialMetricCard
            title="Construction Costs"
            value={metricsData?.constructionCosts?.value || 0}
            previousValue={metricsData?.constructionCosts?.previousValue}
            percentChange={metricsData?.constructionCosts?.percentageChange}
            prefix="€"
            suffix=""
            isLoading={isLoadingMetrics}
            trendData={metricsData?.trendData?.constructionCosts}
          />
        </DashboardItem>
        
        <DashboardItem colSpan={1} rowSpan={1}>
          <FinancialMetricCard
            title="Sales Velocity"
            value={metricsData?.salesVelocity?.value || 0}
            previousValue={metricsData?.salesVelocity?.previousValue}
            percentChange={metricsData?.salesVelocity?.percentageChange}
            prefix=""
            suffix=" units/month"
            isLoading={isLoadingMetrics}
            trendData={metricsData?.trendData?.salesVelocity}
          />
        </DashboardItem>
        
        {/* Cash Flow Summary - 2 columns wide */}
        <DashboardItem colSpan={2} rowSpan={2}>
          {cashFlowData ? (
            <CashFlowSummaryCard
              inflows={cashFlowData.inflows}
              outflows={cashFlowData.outflows}
              netCashFlow={cashFlowData.netCashFlow}
              cashFlowData={cashFlowData.cashFlowData}
              inflowCategories={cashFlowData.inflowCategories}
              outflowCategories={cashFlowData.outflowCategories}
              peakNegativeCashFlow={cashFlowData.peakNegativeCashFlow}
              projectedBreakEvenDate={cashFlowData.projectedBreakEvenDate ? new Date(cashFlowData.projectedBreakEvenDate) : undefined}
              isLoading={isLoadingCashFlow}
              title="Cash Flow Summary"
              timeRange={filters.granularity === 'day' ? 'week' : filters.granularity}
              developmentId={developmentId}
            />
          ) : (
            <MetricCard
              title="Cash Flow Summary"
              value="Loading..."
              loading={true}
              className="h-full"
            />
          )}
        </DashboardItem>
        
        {/* Budget vs Actual - 2 columns wide */}
        <DashboardItem colSpan={2} rowSpan={2}>
          {budgetData ? (
            <BudgetVsActualCard
              title="Budget vs Actual"
              budgetValue={budgetData.totalBudget}
              actualValue={budgetData.totalActual}
              isLoading={isLoadingBudget}
            />
          ) : (
            <MetricCard
              title="Budget vs Actual"
              value="Loading..."
              loading={true}
              className="h-full"
            />
          )}
        </DashboardItem>
        
        {/* Full-width chart at bottom */}
        <DashboardItem colSpan={4} rowSpan={2}>
          {metricsData ? (
            <FinancialChart
              title="Financial Performance Trends"
              description="Key metrics over time"
              data={[
                ...metricsData.trendData.roi.map((item: any) => ({
                  ...item,
                  category: 'ROI'
                })),
                ...metricsData.trendData.profitMargin.map((item: any) => ({
                  ...item,
                  category: 'Profit Margin'
                }))
              ]}
              chartType="line"
              dataKeys={[
                { dataKey: 'value', name: 'ROI' },
                { dataKey: 'value', name: 'Profit Margin' }
              ]}
              xAxisKey="date"
              height={300}
            />
          ) : (
            <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg"></div>
          )}
        </DashboardItem>
      </DashboardGrid>
    </div>
  );
};