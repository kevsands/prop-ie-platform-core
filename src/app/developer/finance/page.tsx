'use client';

import React from 'react';
import { FinancialDashboard } from '../../../components/finance';
// Removed import for build testing;
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../components/ui/select';
import { 
  Building, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Wallet,
  PieChart
} from 'lucide-react';

// Simplified component definitions for build testing

// Define interface for Button props
interface ButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'secondary';
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  );
  [key: string]: any; // For additional props
}

// Simplified Button component
const Button = ({ 
  className = "", 
  variant = "default", 
  children, 
  disabled = false, 
  onClick,
  ...props 
}: ButtonProps) => (
  <button
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${
      variant === "outline" 
        ? "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700" 
        : "bg-blue-600 text-white hover:bg-blue-700"
    } h-10 px-4 py-2 ${className}`}
    disabled={disabled}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

// Mock data for demonstration
const DEMO_PROJECTS = [
  { id: 'proj1', name: 'Fitzgerald Gardens' },
  { id: 'proj2', name: 'Ballymakenny View' },
  { id: 'proj3', name: 'Riverside Manor' }];

// Sample metric data
const METRICS = [
  {
    title: 'Total Revenue',
    value: 1250000,
    previousValue: 1100000,
    percentChange: 13.64,
    isCurrency: true,
    icon: <DollarSign className="h-4 w-4" />,
    trendData: [
      { value: 980000 },
      { value: 1050000 },
      { value: 1020000 },
      { value: 1100000 },
      { value: 1250000 }]
  },
  {
    title: 'Expenses',
    value: 780000,
    previousValue: 740000,
    percentChange: 5.41,
    isCurrency: true,
    icon: <Wallet className="h-4 w-4" />,
    trendData: [
      { value: 680000 },
      { value: 710000 },
      { value: 750000 },
      { value: 740000 },
      { value: 780000 }],
    invertTrend: true
  },
  {
    title: 'Profit Margin',
    value: 37.6,
    previousValue: 32.7,
    percentChange: 14.98,
    isPercentage: true,
    suffix: '%',
    icon: <TrendingUp className="h-4 w-4" />,
    trendData: [
      { value: 30.6 },
      { value: 32.4 },
      { value: 26.5 },
      { value: 32.7 },
      { value: 37.6 }]
  },
  {
    title: 'Units Sold',
    value: 42,
    previousValue: 38,
    percentChange: 10.53,
    icon: <Building className="h-4 w-4" />,
    trendData: [
      { value: 32 },
      { value: 35 },
      { value: 40 },
      { value: 38 },
      { value: 42 }]
  }];

// Sample budget vs actual data
const BUDGET_VS_ACTUALS = [
  {
    title: 'Construction Costs',
    budgetValue: 650000,
    actualValue: 680000,
    category: 'Development',
    invertComparison: true
  },
  {
    title: 'Land Acquisition',
    budgetValue: 350000,
    actualValue: 350000,
    category: 'Development',
    invertComparison: true
  },
  {
    title: 'Permits & Fees',
    budgetValue: 45000,
    actualValue: 42000,
    category: 'Development',
    invertComparison: true
  },
  {
    title: 'Marketing Budget',
    budgetValue: 80000,
    actualValue: 75000,
    category: 'Marketing',
    invertComparison: true
  },
  {
    title: 'Sales Costs',
    budgetValue: 120000,
    actualValue: 115000,
    category: 'Sales',
    invertComparison: true
  },
  {
    title: 'Administrative Costs',
    budgetValue: 90000,
    actualValue: 98000,
    category: 'Administrative',
    invertComparison: true
  },
  {
    title: 'Legal Fees',
    budgetValue: 35000,
    actualValue: 38000,
    category: 'Administrative',
    invertComparison: true
  },
  {
    title: 'Revenue - Phase 1',
    budgetValue: 800000,
    actualValue: 850000,
    category: 'Revenue'
  },
  {
    title: 'Revenue - Phase 2',
    budgetValue: 450000,
    actualValue: 400000,
    category: 'Revenue'
  }];

// Revenue data for charts
const REVENUE_DATA = {
  data: [
    { month: 'Jan', residential: 180000, commercial: 0, land: 0 },
    { month: 'Feb', residential: 210000, commercial: 0, land: 0 },
    { month: 'Mar', residential: 250000, commercial: 0, land: 0 },
    { month: 'Apr', residential: 280000, commercial: 0, land: 0 },
    { month: 'May', residential: 330000, commercial: 0, land: 0 }],
  dataKeys: [
    { dataKey: 'residential', name: 'Residential' },
    { dataKey: 'commercial', name: 'Commercial' },
    { dataKey: 'land', name: 'Land Sales' }]
};

// Cost data for charts
const COST_DATA = {
  data: [
    { month: 'Jan', construction: 120000, marketing: 15000, administration: 30000 },
    { month: 'Feb', construction: 140000, marketing: 18000, administration: 30000 },
    { month: 'Mar', construction: 150000, marketing: 20000, administration: 32000 },
    { month: 'Apr', construction: 160000, marketing: 22000, administration: 32000 },
    { month: 'May', construction: 180000, marketing: 25000, administration: 35000 }],
  dataKeys: [
    { dataKey: 'construction', name: 'Construction' },
    { dataKey: 'marketing', name: 'Marketing' },
    { dataKey: 'administration', name: 'Administration' }]
};

// Profit data for charts
const PROFIT_DATA = {
  data: [
    { month: 'Jan', profit: 45000, margin: 12.5 },
    { month: 'Feb', profit: 52000, margin: 14.0 },
    { month: 'Mar', profit: 68000, margin: 16.7 },
    { month: 'Apr', profit: 98000, margin: 19.8 },
    { month: 'May', profit: 120000, margin: 22.4 }],
  dataKeys: [
    { dataKey: 'profit', name: 'Net Profit' },
    { dataKey: 'margin', name: 'Profit Margin %' }],
  // Projections
  revenueProjection: {
    data: [
      { month: 'Jun', baseline: 350000, optimistic: 380000, pessimistic: 320000 },
      { month: 'Jul', baseline: 370000, optimistic: 400000, pessimistic: 330000 },
      { month: 'Aug', baseline: 390000, optimistic: 430000, pessimistic: 340000 },
      { month: 'Sep', baseline: 410000, optimistic: 460000, pessimistic: 350000 },
      { month: 'Oct', baseline: 430000, optimistic: 490000, pessimistic: 360000 },
      { month: 'Nov', baseline: 450000, optimistic: 520000, pessimistic: 370000 }],
    dataKeys: [
      { dataKey: 'baseline', name: 'Baseline' },
      { dataKey: 'optimistic', name: 'Optimistic' },
      { dataKey: 'pessimistic', name: 'Pessimistic' }]
  },
  profitProjection: {
    data: [
      { month: 'Jun', baseline: 105000, optimistic: 120000, pessimistic: 90000 },
      { month: 'Jul', baseline: 110000, optimistic: 130000, pessimistic: 95000 },
      { month: 'Aug', baseline: 115000, optimistic: 140000, pessimistic: 100000 },
      { month: 'Sep', baseline: 120000, optimistic: 150000, pessimistic: 105000 },
      { month: 'Oct', baseline: 125000, optimistic: 160000, pessimistic: 110000 },
      { month: 'Nov', baseline: 130000, optimistic: 170000, pessimistic: 115000 }],
    dataKeys: [
      { dataKey: 'baseline', name: 'Baseline' },
      { dataKey: 'optimistic', name: 'Optimistic' },
      { dataKey: 'pessimistic', name: 'Pessimistic' }]
  },
  sensitivityAnalysis: {
    data: [
      { variable: '-10%', profitMargin: 14, returnOnInvestment: 8 },
      { variable: '-5%', profitMargin: 18, returnOnInvestment: 12 },
      { variable: '0%', profitMargin: 22, returnOnInvestment: 16 },
      { variable: '+5%', profitMargin: 26, returnOnInvestment: 20 },
      { variable: '+10%', profitMargin: 30, returnOnInvestment: 24 }],
    dataKeys: [
      { dataKey: 'profitMargin', name: 'Profit Margin %' },
      { dataKey: 'returnOnInvestment', name: 'ROI %' }]
  }
};

// Cash flow data
const CASH_FLOW_DATA = {
  summary: {
    inflows: 1250000,
    outflows: 780000,
    netCashFlow: 470000
  },
  data: [
    { date: 'Jan', inflow: 230000, outflow: 170000, netflow: 60000 },
    { date: 'Feb', inflow: 250000, outflow: 180000, netflow: 70000 },
    { date: 'Mar', inflow: 270000, outflow: 190000, netflow: 80000 },
    { date: 'Apr', inflow: 290000, outflow: 200000, netflow: 90000 },
    { date: 'May', inflow: 310000, outflow: 210000, netflow: 100000 }],
  inflowsByCategory: {
    data: [
      { month: 'Jan', sales: 220000, investments: 10000 },
      { month: 'Feb', sales: 240000, investments: 10000 },
      { month: 'Mar', sales: 260000, investments: 10000 },
      { month: 'Apr', sales: 280000, investments: 10000 },
      { month: 'May', sales: 300000, investments: 10000 }],
    dataKeys: [
      { dataKey: 'sales', name: 'Sales Revenue' },
      { dataKey: 'investments', name: 'Investment Income' }]
  },
  outflowsByCategory: {
    data: [
      { month: 'Jan', construction: 120000, marketing: 20000, administration: 30000 },
      { month: 'Feb', construction: 125000, marketing: 25000, administration: 30000 },
      { month: 'Mar', construction: 130000, marketing: 30000, administration: 30000 },
      { month: 'Apr', construction: 135000, marketing: 35000, administration: 30000 },
      { month: 'May', construction: 140000, marketing: 40000, administration: 30000 }],
    dataKeys: [
      { dataKey: 'construction', name: 'Construction' },
      { dataKey: 'marketing', name: 'Marketing' },
      { dataKey: 'administration', name: 'Administration' }]
  },
  projection: {
    data: [
      { month: 'Jun', cashPosition: 600000 },
      { month: 'Jul', cashPosition: 720000 },
      { month: 'Aug', cashPosition: 840000 },
      { month: 'Sep', cashPosition: 960000 },
      { month: 'Oct', cashPosition: 1080000 },
      { month: 'Nov', cashPosition: 1200000 },
      { month: 'Dec', cashPosition: 1320000 }],
    dataKeys: [
      { dataKey: 'cashPosition', name: 'Cash Position' }]
  }
};

/**
 * Developer Financial Dashboard Page
 */
const FinancialDashboardPage = () => {
  const [selectedProjectsetSelectedProject] = React.useState(DEMO_PROJECTS[0].id);
  const [isLoadingsetIsLoading] = React.useState(false);

  // Handle project change
  const handleProjectChange = (projectId: string) => {
    setIsLoading(true);
    setSelectedProject(projectId);

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  // Get project name
  const projectName = DEMO_PROJECTS.find(p => p.id === selectedProject)?.name || '';

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Developer Dashboard</h1>

        <div className="flex items-center gap-2">
          <Select value={selectedProject} onValueChange={handleProjectChange}>
            <SelectTrigger className="w-[240px]">
              <Building className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {DEMO_PROJECTS.map((project: any) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline">
            <PieChart className="h-4 w-4 mr-2" />
            Reports
          </Button>
        </div>
      </div>

      <FinancialDashboard
        title="Financial Dashboard"
        description="Financial overview and analysis"
        developmentName={projectName}
        metrics={METRICS}
        budgetVsActuals={BUDGET_VS_ACTUALS}
        revenueData={REVENUE_DATA}
        costData={COST_DATA}
        profitData={PROFIT_DATA}
        cashFlowData={CASH_FLOW_DATA}
        isLoading={isLoading}
      />
    </div>
  );
};

export default FinancialDashboardPage;