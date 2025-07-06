'use client';

import React, { type FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  BarChart3, 
  LineChart, 
  ArrowUpDown, 
  DollarSign, 
  Building, 
  ChevronDown,
  Filter,
  Download,
  Info,
  Calendar,
  Banknote
} from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { cn } from '../../lib/utils';
import { FinancialMetricCard } from './';
import { FinancialChart } from './';
import { BudgetVsActualCard } from './';
import { CashFlowSummaryCard } from './';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Badge } from '../ui/badge';

interface FinancialMetric {
  title: string;
  value: number;
  trend?: number;
  description?: string;
}

interface BudgetVsActual {
  title: string;
  budget: number;
  actual: number;
  variance: number;
  variancePercentage: number;
  category?: string;
}

interface ChartData {
  data: Array<{
    name: string | number;
    value: number;
    [key: string]: any;
  }>;
  dataKeys: Array<{
    dataKey: string;
    name: string;
  }>;
}

interface FinancialDashboardProps {
  title?: string;
  description?: string;
  metrics?: FinancialMetric[];
  budgetVsActuals?: BudgetVsActual[];
  projectId?: string;
  developmentName?: string;
  timeRanges?: string[];
  cashFlowData?: {
    summary: {
      inflows: number;
      outflows: number;
      netCashFlow: number;
    };
    data: Array<{
      date: string;
      inflows: number;
      outflows: number;
      netCashFlow: number;
    }>;
    inflowsByCategory: ChartData;
    outflowsByCategory: ChartData;
    projection: ChartData;
  };
  revenueData?: ChartData;
  costData?: ChartData;
  profitData?: {
    data: Array<{
      name: string | number;
      value: number;
      [key: string]: any;
    }>;
    dataKeys: Array<{
      dataKey: string;
      name: string;
    }>;
    revenueProjection?: ChartData;
    profitProjection?: ChartData;
    sensitivityAnalysis?: ChartData;
  };
  isLoading?: boolean;
  className?: string;
}

/**
 * Financial Dashboard Component
 * 
 * Comprehensive dashboard for financial data visualization and analysis
 */
const FinancialDashboard = ({
  title = "Financial Dashboard",
  description,
  metrics = [],
  budgetVsActuals = [],
  projectId,
  developmentName,
  timeRanges = ['Last 30 Days', 'This Quarter', 'Year to Date', 'Last 12 Months'],
  cashFlowData,
  revenueData,
  costData,
  profitData,
  isLoading = false,
  className
}: FinancialDashboardProps) => {
  const [timeRange, setTimeRange] = React.useState(timeRanges[0]);
  const [activeTab, setActiveTab] = React.useState('overview');
  
  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
  };

  const renderMetrics = (metric: FinancialMetric, index: number) => (
    <FinancialMetricCard 
      key={index}
      {...metric}
      isLoading={isLoading}
    />
  );

  const renderBudgetVsActuals = (budget: BudgetVsActual, index: number) => (
    <BudgetVsActualCard 
      key={index}
      {...budget}
      isLoading={isLoading}
    />
  );

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            {title}
          </h1>
          {description && (
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {description}
            </p>
          )}
          {developmentName && (
            <Badge variant="outline" className="mt-2">
              <Building className="h-3 w-3 mr-1" />
              {developmentName}
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>All Categories</DropdownMenuItem>
              <DropdownMenuItem>Construction</DropdownMenuItem>
              <DropdownMenuItem>Sales</DropdownMenuItem>
              <DropdownMenuItem>Marketing</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Reset Filters</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="cashflow">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Cash Flow
          </TabsTrigger>
          <TabsTrigger value="budget">
            <DollarSign className="h-4 w-4 mr-2" />
            Budget
          </TabsTrigger>
          <TabsTrigger value="projections">
            <LineChart className="h-4 w-4 mr-2" />
            Projections
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.slice(0, 4).map(renderMetrics)}
          </div>

          {/* Revenue and Costs Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {revenueData && (
              <FinancialChart
                title="Revenue"
                description="Revenue by category"
                data={revenueData.data}
                dataKeys={revenueData.dataKeys}
                chartType="bar"
                height={300}
                stacked={true}
                currencyFormat={true}
              />
            )}
            
            {costData && (
              <FinancialChart
                title="Costs"
                description="Costs by category"
                data={costData.data}
                dataKeys={costData.dataKeys}
                chartType="bar"
                height={300}
                stacked={true}
                currencyFormat={true}
              />
            )}
          </div>

          {/* Profit Trend */}
          {profitData && (
            <FinancialChart
              title="Profit Margin Trend"
              description="Net profit margin over time"
              data={profitData.data}
              dataKeys={profitData.dataKeys}
              chartType="line"
              height={300}
              currencyFormat={true}
            />
          )}

          {/* Budget vs Actual Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                Budget Performance
              </h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Performance against budgeted values</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {budgetVsActuals.slice(0, 6).map(renderBudgetVsActuals)}
            </div>
          </div>
        </TabsContent>

        {/* Cash Flow Tab */}
        <TabsContent value="cashflow" className="space-y-6">
          {cashFlowData && (
            <div className="grid gap-6 md:grid-cols-2">
              <CashFlowSummaryCard
                title="Cash Flow Summary"
                inflows={cashFlowData.summary.inflows}
                outflows={cashFlowData.summary.outflows}
                netCashFlow={cashFlowData.summary.netCashFlow}
                timeRange={timeRange}
                isLoading={isLoading}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cashFlowData && (
                  <>
                    <FinancialChart
                      title="Inflows"
                      description="Cash inflows by category"
                      data={cashFlowData.inflowsByCategory.data}
                      dataKeys={cashFlowData.inflowsByCategory.dataKeys}
                      chartType="bar"
                      stacked={true}
                      height={300}
                      currencyFormat={true}
                    />
                    <FinancialChart
                      title="Outflows"
                      description="Cash outflows by category"
                      data={cashFlowData.outflowsByCategory.data}
                      dataKeys={cashFlowData.outflowsByCategory.dataKeys}
                      chartType="bar"
                      stacked={true}
                      height={300}
                      currencyFormat={true}
                    />
                  </>
                )}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Projected Cash Position</CardTitle>
                  <CardDescription>12-month cash position forecast</CardDescription>
                </CardHeader>
                <CardContent>
                  {cashFlowData && (
                    <FinancialChart
                      title=""
                      data={cashFlowData.projection.data}
                      dataKeys={cashFlowData.projection.dataKeys}
                      chartType="line"
                      height={300}
                      currencyFormat={true}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Budget Tab */}
        <TabsContent value="budget" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Banknote className="h-5 w-5 mr-2" />
                Budget Overview
              </CardTitle>
              <CardDescription>Budget allocation and performance by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-6">
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Development Costs Budget
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {budgetVsActuals.filter(b => b.category === 'Development').map(renderBudgetVsActuals)}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Marketing & Sales Budget
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {budgetVsActuals.filter(b => b.category === 'Marketing' || b.category === 'Sales').map(renderBudgetVsActuals)}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Administrative Budget
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {budgetVsActuals.filter(b => b.category === 'Administrative').map(renderBudgetVsActuals)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projections Tab */}
        <TabsContent value="projections" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {profitData && (
              <FinancialChart
                title="Revenue Projection"
                description="12-month revenue forecast"
                data={profitData.revenueProjection?.data || []}
                dataKeys={profitData.revenueProjection?.dataKeys || []}
                chartType="area"
                height={300}
                currencyFormat={true}
              />
            )}
            
            {profitData && (
              <FinancialChart
                title="Profit Projection"
                description="12-month profit forecast"
                data={profitData.profitProjection?.data || []}
                dataKeys={profitData.profitProjection?.dataKeys || []}
                chartType="area"
                height={300}
                currencyFormat={true}
              />
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sensitivity Analysis</CardTitle>
              <CardDescription>Impact of price and cost variations on profit margin</CardDescription>
            </CardHeader>
            <CardContent>
              {profitData && profitData.sensitivityAnalysis && (
                <FinancialChart
                  title=""
                  data={profitData.sensitivityAnalysis.data}
                  dataKeys={profitData.sensitivityAnalysis.dataKeys}
                  chartType="line"
                  height={300}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Advanced Financial Analysis</CardTitle>
              <CardDescription>Detailed profitability analysis, scenario comparison, and ROI calculation</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="profitability" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="profitability">Profitability</TabsTrigger>
                  <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
                  <TabsTrigger value="roi">ROI Calculator</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profitability">
                  <div className="text-sm text-muted-foreground mb-4">
                    Detailed analysis of profit margins, costs, and revenue trends
                  </div>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    Open Profitability Analysis
                  </Button>
                </TabsContent>
                
                <TabsContent value="scenarios">
                  <div className="text-sm text-muted-foreground mb-4">
                    Create and compare financial scenarios with different parameters
                  </div>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    Open Scenario Comparison
                  </Button>
                </TabsContent>
                
                <TabsContent value="roi">
                  <div className="text-sm text-muted-foreground mb-4">
                    Calculate return on investment for different financing options
                  </div>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    Open ROI Calculator
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialDashboard;