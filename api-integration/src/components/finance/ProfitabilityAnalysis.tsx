'use client';

import { useState, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue, 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LineChart,
  Line
} from 'recharts';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  ChevronDown,
  TrendingUp,
  TrendingDown,
  HelpCircle,
  Download,
  Filter,
  Info
} from 'lucide-react';
import { 
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

// Types
interface CostBreakdown {
  category: string;
  amount: number;
  percentage: number;
  variance: number;
  subcategories?: {
    name: string;
    amount: number;
    percentage: number;
    variance: number;
  }[];
}

interface ProfitabilityMetrics {
  revenue: number;
  costs: number;
  profit: number;
  margin: number;
  targetMargin: number;
  roi: number;
  costBreakdown: CostBreakdown[];
  monthlyTrends: {
    month: string;
    revenue: number;
    costs: number;
    profit: number;
    margin: number;
  }[];
}

// Define our own types for formatting
type ChartValue = number | string | [number | string, number | string];
type ChartName = string | number;

// Prop interface
interface ProfitabilityAnalysisProps {
  projectId?: string;
  initialPeriod?: 'monthly' | 'quarterly' | 'yearly';
  className?: string;
}

// Main component
export default function ProfitabilityAnalysis({
  projectId,
  initialPeriod = 'monthly',
  className
}: ProfitabilityAnalysisProps) {
  // State for time period filter
  const [period, setPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>(initialPeriod);
  
  // State for expanded cost categories
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Mock data - in a real implementation, this would come from an API
  const profitabilityData: ProfitabilityMetrics = {
    revenue: 4250000,
    costs: 2975000,
    profit: 1275000,
    margin: 30,
    targetMargin: 32,
    roi: 42.86,
    costBreakdown: [
      {
        category: 'Land Acquisition',
        amount: 1000000,
        percentage: 33.61,
        variance: -2.5,
        subcategories: [
          { name: 'Purchase Price', amount: 950000, percentage: 31.93, variance: -2.1 },
          { name: 'Legal Fees', amount: 25000, percentage: 0.84, variance: -5.2 },
          { name: 'Taxes & Duties', amount: 25000, percentage: 0.84, variance: -3.8 }
        ]
      },
      {
        category: 'Construction',
        amount: 1500000,
        percentage: 50.42,
        variance: 3.2,
        subcategories: [
          { name: 'Materials', amount: 800000, percentage: 26.89, variance: 5.3 },
          { name: 'Labor', amount: 600000, percentage: 20.17, variance: 1.8 },
          { name: 'Equipment', amount: 100000, percentage: 3.36, variance: -1.5 }
        ]
      },
      {
        category: 'Professional Fees',
        amount: 175000,
        percentage: 5.88,
        variance: -1.3,
        subcategories: [
          { name: 'Architects', amount: 75000, percentage: 2.52, variance: -1.0 },
          { name: 'Engineers', amount: 60000, percentage: 2.02, variance: -2.1 },
          { name: 'Project Management', amount: 40000, percentage: 1.34, variance: -0.8 }
        ]
      },
      {
        category: 'Marketing & Sales',
        amount: 150000,
        percentage: 5.04,
        variance: 0.8,
        subcategories: [
          { name: 'Advertising', amount: 70000, percentage: 2.35, variance: 1.2 },
          { name: 'Sales Office', amount: 50000, percentage: 1.68, variance: 0.5 },
          { name: 'Commissions', amount: 30000, percentage: 1.01, variance: 0.4 }
        ]
      },
      {
        category: 'Finance & Insurance',
        amount: 125000,
        percentage: 4.20,
        variance: 0.4,
        subcategories: [
          { name: 'Interest', amount: 85000, percentage: 2.86, variance: 0.6 },
          { name: 'Insurance', amount: 40000, percentage: 1.34, variance: 0.0 }
        ]
      },
      {
        category: 'Contingency',
        amount: 25000,
        percentage: 0.84,
        variance: -4.2,
        subcategories: [
          { name: 'General Contingency', amount: 25000, percentage: 0.84, variance: -4.2 }
        ]
      }
    ],
    monthlyTrends: [
      { month: 'Jan', revenue: 350000, costs: 245000, profit: 105000, margin: 30 },
      { month: 'Feb', revenue: 320000, costs: 221000, profit: 99000, margin: 30.94 },
      { month: 'Mar', revenue: 380000, costs: 266000, profit: 114000, margin: 30 },
      { month: 'Apr', revenue: 410000, costs: 283000, profit: 127000, margin: 30.98 },
      { month: 'May', revenue: 440000, costs: 310000, profit: 130000, margin: 29.55 },
      { month: 'Jun', revenue: 470000, costs: 339000, profit: 131000, margin: 27.87 },
      { month: 'Jul', revenue: 410000, costs: 291000, profit: 119000, margin: 29.02 },
      { month: 'Aug', revenue: 390000, costs: 271000, profit: 119000, margin: 30.51 },
      { month: 'Sep', revenue: 360000, costs: 249000, profit: 111000, margin: 30.83 },
      { month: 'Oct', revenue: 335000, costs: 231000, profit: 104000, margin: 31.04 },
      { month: 'Nov', revenue: 320000, costs: 219000, profit: 101000, margin: 31.56 },
      { month: 'Dec', revenue: 365000, costs: 250000, profit: 115000, margin: 31.51 }
    ]
  };

  // Create data for the cost breakdown pie chart
  const costPieData = useMemo(() => {
    return profitabilityData.costBreakdown.map(category => ({
      name: category.category,
      value: category.amount
    }));
  }, [profitabilityData.costBreakdown]);

  // Calculate margin variance from target
  const marginVariance = profitabilityData.margin - profitabilityData.targetMargin;
  
  // Format currency with locale
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  // Add type guards for value formatting
  const formatValue = (value: any) => {
    if (Array.isArray(value)) {
      return value.map(v => typeof v === 'number' ? v.toFixed(2) : v).join(' ~ ');
    }
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return value;
  };

  const formatName = (name: any) => {
    const strName = String(name);
    return strName.charAt(0).toUpperCase() + strName.slice(1);
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <CardTitle>Profitability Analysis</CardTitle>
            <CardDescription>
              Detailed breakdown of revenue, costs, and profit margins
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select 
              value={period} 
              onValueChange={(value) => setPeriod(value as 'monthly' | 'quarterly' | 'yearly')}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Time Period</SelectLabel>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export report</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Revenue Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(profitabilityData.revenue)}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                <span className="text-green-600 dark:text-green-400">↑ 8.2%</span> from previous period
              </div>
            </CardContent>
          </Card>
          
          {/* Costs Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Costs</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(profitabilityData.costs)}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                <span className="text-amber-600 dark:text-amber-400">↑ 5.7%</span> from previous period
              </div>
            </CardContent>
          </Card>
          
          {/* Profit Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Profit</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(profitabilityData.profit)}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                <span className="text-blue-600 dark:text-blue-400">↑ 12.3%</span> from previous period
              </div>
            </CardContent>
          </Card>
          
          {/* Margin Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">Profit Margin</p>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="flex justify-between space-x-4">
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold">Profit Margin</h4>
                            <p className="text-sm">
                              The profit margin is calculated as (Revenue - Costs) / Revenue. 
                              Your target margin is {formatPercentage(profitabilityData.targetMargin)}.
                            </p>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                  <p className="text-2xl font-bold mt-1">{formatPercentage(profitabilityData.margin)}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  {marginVariance >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                  )}
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {marginVariance >= 0 ? (
                  <span className="text-green-600 dark:text-green-400">
                    ↑ {formatPercentage(Math.abs(marginVariance))}
                  </span>
                ) : (
                  <span className="text-red-600 dark:text-red-400">
                    ↓ {formatPercentage(Math.abs(marginVariance))}
                  </span>
                )} vs target
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts and Breakdown */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="costs">Cost Breakdown</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Margin Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Margin Analysis</CardTitle>
                  <CardDescription>
                    Revenue, costs, and margin breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          {
                            name: 'Actual',
                            revenue: profitabilityData.revenue,
                            costs: profitabilityData.costs,
                            profit: profitabilityData.profit,
                            margin: profitabilityData.margin
                          },
                          {
                            name: 'Target',
                            revenue: profitabilityData.revenue,
                            costs: profitabilityData.revenue * (1 - (profitabilityData.targetMargin / 100)),
                            profit: profitabilityData.revenue * (profitabilityData.targetMargin / 100),
                            margin: profitabilityData.targetMargin
                          },
                          {
                            name: 'Previous',
                            revenue: profitabilityData.revenue * 0.92,
                            costs: profitabilityData.costs * 0.95,
                            profit: profitabilityData.revenue * 0.92 - profitabilityData.costs * 0.95,
                            margin: ((profitabilityData.revenue * 0.92 - profitabilityData.costs * 0.95) / (profitabilityData.revenue * 0.92)) * 100
                          }
                        ]}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip 
                          formatter={(value, name) => {
                            if (name === 'margin') {
                              return [`${value.toFixed(2)}%`, 'Margin'];
                            }
                            return [formatCurrency(value as number), name.charAt(0).toUpperCase() + name.slice(1)];
                          }}
                        />
                        <Legend />
                        <Bar dataKey="costs" stackId="a" fill="#FFBB28" name="Costs" />
                        <Bar dataKey="profit" stackId="a" fill="#0088FE" name="Profit" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Cost Breakdown Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Cost Distribution</CardTitle>
                  <CardDescription>
                    Breakdown of costs by category
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={costPieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {costPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [formatCurrency(value as number), 'Amount']}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Cost Breakdown Tab */}
          <TabsContent value="costs" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Cost Categories Breakdown</CardTitle>
                  <div className="text-xs text-muted-foreground">
                    <span>Total: {formatCurrency(profitabilityData.costs)}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/2">Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">% of Total</TableHead>
                      <TableHead className="text-right">Variance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profitabilityData.costBreakdown.map((category) => (
                      <>
                        <TableRow key={category.category} className="group">
                          <TableCell>
                            <Collapsible>
                              <div className="flex items-center">
                                <CollapsibleTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6 p-0 mr-2 hover:bg-muted"
                                    onClick={() => toggleCategory(category.category)}
                                  >
                                    <ChevronDown 
                                      className={cn(
                                        "h-4 w-4 text-muted-foreground transition-transform",
                                        expandedCategories[category.category] && "transform rotate-180"
                                      )} 
                                    />
                                    <span className="sr-only">Toggle</span>
                                  </Button>
                                </CollapsibleTrigger>
                                <span className="font-medium">{category.category}</span>
                              </div>
                            </Collapsible>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(category.amount)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatPercentage(category.percentage)}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={cn(
                              category.variance > 0 ? "text-red-600 dark:text-red-400" : 
                              category.variance < 0 ? "text-green-600 dark:text-green-400" : 
                              "text-muted-foreground"
                            )}>
                              {category.variance > 0 ? `↑ ${category.variance}%` : 
                               category.variance < 0 ? `↓ ${Math.abs(category.variance)}%` : 
                               `${category.variance}%`}
                            </span>
                          </TableCell>
                        </TableRow>
                        {/* Subcategories */}
                        {expandedCategories[category.category] && category.subcategories && (
                          <CollapsibleContent asChild forceMount>
                            <>
                              {category.subcategories.map((sub) => (
                                <TableRow key={`${category.category}-${sub.name}`} className="bg-muted/50">
                                  <TableCell className="pl-10">
                                    {sub.name}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {formatCurrency(sub.amount)}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {formatPercentage(sub.percentage)}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <span className={cn(
                                      sub.variance > 0 ? "text-red-600 dark:text-red-400" : 
                                      sub.variance < 0 ? "text-green-600 dark:text-green-400" : 
                                      "text-muted-foreground"
                                    )}>
                                      {sub.variance > 0 ? `↑ ${sub.variance}%` : 
                                       sub.variance < 0 ? `↓ ${Math.abs(sub.variance)}%` : 
                                       `${sub.variance}%`}
                                    </span>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </>
                          </CollapsibleContent>
                        )}
                      </>
                    ))}
                    {/* Total Row */}
                    <TableRow className="font-bold border-t-2">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">{formatCurrency(profitabilityData.costs)}</TableCell>
                      <TableCell className="text-right">100.00%</TableCell>
                      <TableCell className="text-right">
                        <span className={cn(
                          0.4 > 0 ? "text-red-600 dark:text-red-400" : 
                          0.4 < 0 ? "text-green-600 dark:text-green-400" : 
                          "text-muted-foreground"
                        )}>
                          ↑ 0.4%
                        </span>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div className="mt-4 text-sm text-muted-foreground">
                  <Badge variant="outline" className="mr-2">Note</Badge>
                  Variance values show the percentage difference from the budget. 
                  Negative values (↓) indicate cost savings, while positive values (↑) indicate overruns.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-base">Profitability Trends</CardTitle>
                    <CardDescription>
                      Monthly revenue, costs, and profit trends
                    </CardDescription>
                  </div>
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                          <Filter className="h-3.5 w-3.5 mr-2" />
                          Customize
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Customize chart parameters</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={profitabilityData.monthlyTrends}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" tickFormatter={(value) => `$${value / 1000}k`} />
                      <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === 'margin') {
                            return [`${value}%`, 'Margin'];
                          }
                          return [formatCurrency(value as number), name.charAt(0).toUpperCase() + name.slice(1)];
                        }}
                      />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#0088FE" 
                        name="Revenue" 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="costs" 
                        stroke="#FFBB28" 
                        name="Costs" 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="profit" 
                        stroke="#00C49F" 
                        name="Profit" 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="margin" 
                        stroke="#FF8042" 
                        name="Margin" 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t p-4">
        <div className="flex flex-col xs:flex-row justify-between w-full text-sm text-muted-foreground gap-2">
          <div className="flex items-center">
            <HelpCircle className="h-4 w-4 mr-2" />
            <span>Based on current {period} financials</span>
          </div>
          <div>
            Last updated: April 30, 2023
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}