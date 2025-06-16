'use client';

import React from 'react';
import { useGraphQLQuery, useGraphQLMutation } from '@/hooks/useGraphQL';
import { MetricCard } from '@/components/ui/metric-card';
import { FinancialChart } from '@/components/finance/FinancialChart';
import { CashFlowSummaryCard } from '@/components/finance/CashFlowSummaryCard';
import { BudgetVsActualCard } from '@/components/finance/BudgetVsActualCard';
import { FinancialMetricCard } from '@/components/finance/FinancialMetricCard';
import type { FinancialMetricDataPoint } from '@/types/finance/dashboard';

// GraphQL query definitions
const GET_DEVELOPMENT_FINANCIAL_METRICS = /* GraphQL */ `
  query GetDevelopmentFinancialMetrics($developmentId: ID!) {
    getDevelopmentFinancialMetrics(developmentId: $developmentId) {
      totalBudget {
        amount
        currency
      }
      totalSpent {
        amount
        currency
      }
      cashFlow {
        inflows {
          amount
          currency
        }
        outflows {
          amount
          currency
        }
        netFlow {
          amount
          currency
        }
      }
      budgetVsActual {
        categories {
          name
          budget {
            amount
            currency
          }
          actual {
            amount
            currency
          }
          variance {
            amount
            currency
          }
          variancePercentage
          isOverBudget
        }
        totalBudget {
          amount
          currency
        }
        totalActual {
          amount
          currency
        }
        totalVariance {
          amount
          currency
        }
        totalVariancePercentage
        completionPercentage
      }
      metrics {
        roi
        margin
        profitOnCost
      }
      trendData {
        cashFlow {
          date
          inflows
          outflows
          netFlow
        }
        budget {
          date
          planned
          actual
        }
      }
    }
  }
`;

/**
 * Example component showing how to integrate UI components with GraphQL data
 */
export const DevelopmentFinancialDashboard: React.FC<{ developmentId: string }> = ({ 
  developmentId 
}) => {
  // Fetch financial data using GraphQL
  const { data, isLoading, error } = useGraphQLQuery(
    ['developmentFinancials', developmentId],
    GET_DEVELOPMENT_FINANCIAL_METRICS,
    { developmentId }
  );

  // Handle loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Budget" value="Loading..." loading />
        <MetricCard title="Spent" value="Loading..." loading />
        <MetricCard title="ROI" value="Loading..." loading />
        <MetricCard title="Margin" value="Loading..." loading />
        <div className="col-span-1 md:col-span-2 lg:col-span-4">
          <FinancialChart 
            title="Financial Trends"
            data={[]}
            chartType="line"
            isLoading={true}
          />
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return <div>Error loading financial data: {error.toString()}</div>\n  );
  }

  // Extract data from the query results
  const financialData = data?.getDevelopmentFinancialMetrics;
  if (!financialData) {
    return <div>No financial data available</div>\n  );
  }

  // Transform the data for the trend chart
  const cashFlowChartData: FinancialMetricDataPoint[] = financialData.trendData.cashFlow.map(item: any => ({
    date: new Date(item.date).toISOString(),
    value: item.netFlow,
    category: 'Net Cash Flow'
  }));

  const budgetChartData: FinancialMetricDataPoint[] = financialData.trendData.budget.map(item: any => ({
    date: new Date(item.date).toISOString(),
    value: item.actual,
    category: 'Actual',
    isProjected: false
  })).concat(
    financialData.trendData.budget.map(item: any => ({
      date: new Date(item.date).toISOString(),
      value: item.planned,
      category: 'Planned',
      isProjected: true
    }))
  );

  // Format currency values
  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('en-IE', { 
      style: 'currency', 
      currency 
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Development Financial Dashboard</h1>
      
      {/* Top metrics row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Budget" 
          value={formatCurrency(financialData.totalBudget.amount, financialData.totalBudget.currency)}
          variant="default"
        />
        
        <MetricCard 
          title="Total Spent" 
          value={formatCurrency(financialData.totalSpent.amount, financialData.totalSpent.currency)}
          trendValue={financialData.budgetVsActual.completionPercentage}
          trendLabel="of budget"
          variant={financialData.budgetVsActual.totalVariancePercentage> 0 ? "danger" : "success"
        />
        
        <FinancialMetricCard 
          title="ROI" 
          value={financialData.metrics.roi}
          suffix="%"
          isPositiveTrend={true}
        />
        
        <FinancialMetricCard 
          title="Profit Margin" 
          value={financialData.metrics.margin}
          suffix="%"
          isPositiveTrend={true}
        />
      </div>
      
      {/* Cash flow summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CashFlowSummaryCard 
          inflows={financialData.cashFlow.inflows}
          outflows={financialData.cashFlow.outflows}
          netCashFlow={financialData.cashFlow.netFlow}
          cashFlowData={financialData.trendData.cashFlow}
        />
        
        <BudgetVsActualCard 
          totalBudget={financialData.budgetVsActual.totalBudget}
          totalActual={financialData.budgetVsActual.totalActual}
          totalVariance={financialData.budgetVsActual.totalVariance}
          totalVariancePercentage={financialData.budgetVsActual.totalVariancePercentage}
          categories={financialData.budgetVsActual.categories}
          completionPercentage={financialData.budgetVsActual.completionPercentage}
        />
      </div>
      
      {/* Charts */}
      <div className="space-y-6">
        <FinancialChart 
          title="Cash Flow Trends"
          description="Monthly net cash flow"
          data={cashFlowChartData}
          chartType="line"
          xAxisLabel="Date"
          yAxisLabel="Amount"
          showLegend={true}
        />
        
        <FinancialChart 
          title="Budget vs. Actual"
          description="Planned and actual expenditure over time"
          data={budgetChartData}
          chartType="bar"
          xAxisLabel="Date"
          yAxisLabel="Amount"
          isStacked={false}
          showLegend={true}
        />
      </div>
    </div>
  );
};