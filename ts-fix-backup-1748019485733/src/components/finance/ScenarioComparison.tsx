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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  BarChart, 
  Bar, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  ReferenceLine,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Scatter
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown, 
  Plus, 
  Save, 
  Share, 
  Download, 
  ArrowUpDown,
  Edit,
  Copy,
  Trash,
  Check,
  X,
  Calendar,
  Info
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue} from '@/components/ui/select';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger} from '@/components/ui/hover-card';
import { cn } from '@/lib/utils';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger} from '@/components/ui/context-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger} from '@/components/ui/popover';
import { 
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

// Types
interface FinancialScenario {
  id: string;
  name: string;
  description: string;
  type: 'base' | 'optimistic' | 'pessimistic' | 'custom';
  isActive: boolean;
  created: Date;
  parameters: {
    salesPrice: number;
    salesVelocity: number;
    constructionCosts: number;
    interestRate: number;
    contingency: number;
    marketingCosts: number;
  };
  results: {
    totalRevenue: number;
    totalCosts: number;
    grossProfit: number;
    margin: number;
    roi: number;
    irr: number;
    paybackPeriod: number;
    npv: number;
  };
  monthlyProjections: {
    month: string;
    revenue: number;
    costs: number;
    cashFlow: number;
    cumulativeCashFlow: number;
  }[];
}

interface ScenarioComparisonProps {
  projectId?: string;
  className?: string;
}

// Main component
export default function ScenarioComparison({
  projectId,
  className
}: ScenarioComparisonProps) {
  // State for scenarios
  const [scenariossetScenarios] = useState<FinancialScenario[]>([
    {
      id: 'base',
      name: 'Base Case',
      description: 'Expected market conditions with standard parameters',
      type: 'base',
      isActive: true,
      created: new Date('2023-03-15'),
      parameters: {
        salesPrice: 350000,
        salesVelocity: 2.5,
        constructionCosts: 2500000,
        interestRate: 5.5,
        contingency: 5,
        marketingCosts: 150000
      },
      results: {
        totalRevenue: 4250000,
        totalCosts: 2975000,
        grossProfit: 1275000,
        margin: 30,
        roi: 42.86,
        irr: 18.3,
        paybackPeriod: 2.8,
        npv: 950000
      },
      monthlyProjections: [
        { month: 'Jan', revenue: 0, costs: 250000, cashFlow: -250000, cumulativeCashFlow: -250000 },
        { month: 'Feb', revenue: 0, costs: 220000, cashFlow: -220000, cumulativeCashFlow: -470000 },
        { month: 'Mar', revenue: 350000, costs: 210000, cashFlow: 140000, cumulativeCashFlow: -330000 },
        { month: 'Apr', revenue: 320000, costs: 190000, cashFlow: 130000, cumulativeCashFlow: -200000 },
        { month: 'May', revenue: 380000, costs: 210000, cashFlow: 170000, cumulativeCashFlow: -30000 },
        { month: 'Jun', revenue: 410000, costs: 240000, cashFlow: 170000, cumulativeCashFlow: 140000 },
        { month: 'Jul', revenue: 440000, costs: 260000, cashFlow: 180000, cumulativeCashFlow: 320000 },
        { month: 'Aug', revenue: 470000, costs: 280000, cashFlow: 190000, cumulativeCashFlow: 510000 },
        { month: 'Sep', revenue: 490000, costs: 290000, cashFlow: 200000, cumulativeCashFlow: 710000 },
        { month: 'Oct', revenue: 460000, costs: 275000, cashFlow: 185000, cumulativeCashFlow: 895000 },
        { month: 'Nov', revenue: 430000, costs: 260000, cashFlow: 170000, cumulativeCashFlow: 1065000 },
        { month: 'Dec', revenue: 500000, costs: 290000, cashFlow: 210000, cumulativeCashFlow: 1275000 }
      ]
    },
    {
      id: 'optimistic',
      name: 'Optimistic',
      description: 'Strong market conditions with higher prices and faster sales',
      type: 'optimistic',
      isActive: true,
      created: new Date('2023-03-15'),
      parameters: {
        salesPrice: 385000,
        salesVelocity: 3.2,
        constructionCosts: 2550000,
        interestRate: 5.0,
        contingency: 3,
        marketingCosts: 140000
      },
      results: {
        totalRevenue: 4620000,
        totalCosts: 2980000,
        grossProfit: 1640000,
        margin: 35.5,
        roi: 55.03,
        irr: 24.7,
        paybackPeriod: 2.3,
        npv: 1350000
      },
      monthlyProjections: [
        { month: 'Jan', revenue: 0, costs: 255000, cashFlow: -255000, cumulativeCashFlow: -255000 },
        { month: 'Feb', revenue: 0, costs: 225000, cashFlow: -225000, cumulativeCashFlow: -480000 },
        { month: 'Mar', revenue: 385000, costs: 215000, cashFlow: 170000, cumulativeCashFlow: -310000 },
        { month: 'Apr', revenue: 385000, costs: 195000, cashFlow: 190000, cumulativeCashFlow: -120000 },
        { month: 'May', revenue: 420000, costs: 215000, cashFlow: 205000, cumulativeCashFlow: 85000 },
        { month: 'Jun', revenue: 450000, costs: 245000, cashFlow: 205000, cumulativeCashFlow: 290000 },
        { month: 'Jul', revenue: 480000, costs: 265000, cashFlow: 215000, cumulativeCashFlow: 505000 },
        { month: 'Aug', revenue: 510000, costs: 285000, cashFlow: 225000, cumulativeCashFlow: 730000 },
        { month: 'Sep', revenue: 530000, costs: 295000, cashFlow: 235000, cumulativeCashFlow: 965000 },
        { month: 'Oct', revenue: 500000, costs: 280000, cashFlow: 220000, cumulativeCashFlow: 1185000 },
        { month: 'Nov', revenue: 470000, costs: 265000, cashFlow: 205000, cumulativeCashFlow: 1390000 },
        { month: 'Dec', revenue: 540000, costs: 295000, cashFlow: 245000, cumulativeCashFlow: 1635000 }
      ]
    },
    {
      id: 'pessimistic',
      name: 'Pessimistic',
      description: 'Weak market conditions with lower prices and slower sales',
      type: 'pessimistic',
      isActive: true,
      created: new Date('2023-03-15'),
      parameters: {
        salesPrice: 325000,
        salesVelocity: 1.8,
        constructionCosts: 2700000,
        interestRate: 6.5,
        contingency: 10,
        marketingCosts: 170000
      },
      results: {
        totalRevenue: 3900000,
        totalCosts: 3200000,
        grossProfit: 700000,
        margin: 17.95,
        roi: 21.88,
        irr: 9.1,
        paybackPeriod: 3.5,
        npv: 450000
      },
      monthlyProjections: [
        { month: 'Jan', revenue: 0, costs: 270000, cashFlow: -270000, cumulativeCashFlow: -270000 },
        { month: 'Feb', revenue: 0, costs: 240000, cashFlow: -240000, cumulativeCashFlow: -510000 },
        { month: 'Mar', revenue: 325000, costs: 230000, cashFlow: 95000, cumulativeCashFlow: -415000 },
        { month: 'Apr', revenue: 290000, costs: 205000, cashFlow: 85000, cumulativeCashFlow: -330000 },
        { month: 'May', revenue: 340000, costs: 230000, cashFlow: 110000, cumulativeCashFlow: -220000 },
        { month: 'Jun', revenue: 370000, costs: 260000, cashFlow: 110000, cumulativeCashFlow: -110000 },
        { month: 'Jul', revenue: 400000, costs: 280000, cashFlow: 120000, cumulativeCashFlow: 10000 },
        { month: 'Aug', revenue: 420000, costs: 300000, cashFlow: 120000, cumulativeCashFlow: 130000 },
        { month: 'Sep', revenue: 440000, costs: 310000, cashFlow: 130000, cumulativeCashFlow: 260000 },
        { month: 'Oct', revenue: 410000, costs: 295000, cashFlow: 115000, cumulativeCashFlow: 375000 },
        { month: 'Nov', revenue: 390000, costs: 280000, cashFlow: 110000, cumulativeCashFlow: 485000 },
        { month: 'Dec', revenue: 450000, costs: 310000, cashFlow: 140000, cumulativeCashFlow: 625000 }
      ]
    }
  ]);

  // State for active tab
  const [activeTabsetActiveTab] = useState<'compare' | 'detail' | 'cashflow'>('compare');

  // State for selected scenarios (for comparison)
  const [selectedScenarioIdssetSelectedScenarioIds] = useState<string[]>(['base', 'optimistic', 'pessimistic']);

  // State for the active scenario in detail view
  const [activeScenarioIdsetActiveScenarioId] = useState<string>('base');

  // State for sensitivity analysis parameter
  const [sensitivityParamsetSensitivityParam] = useState<keyof FinancialScenario['parameters']>('salesPrice');

  // State for new scenario dialog
  const [newScenarioOpensetNewScenarioOpen] = useState(false);
  const [newScenariosetNewScenario] = useState<Partial<FinancialScenario>>({
    name: '',
    description: '',
    type: 'custom',
    parameters: {
      salesPrice: 350000,
      salesVelocity: 2.5,
      constructionCosts: 2500000,
      interestRate: 5.5,
      contingency: 5,
      marketingCosts: 150000
    }
  });

  // Get active scenarios for comparison
  const activeScenarios = useMemo(() => {
    return scenarios.filter(s => selectedScenarioIds.includes(s.id));
  }, [scenariosselectedScenarioIds]);

  // Get current active scenario for detail view
  const activeScenario = useMemo(() => {
    return scenarios.find(s => s.id === activeScenarioId) || scenarios[0];
  }, [scenariosactiveScenarioId]);

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

  // Add type guards for value formatting
  const formatValue = (value: any) => {
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    if (typeof value === 'string' && !isNaN(parseFloat(value))) {
      return parseFloat(value).toFixed(2);
    }
    return value;
  };

  // Handle adding a new scenario
  const handleAddScenario = () => {
    if (!newScenario.name) return;

    // Generate new scenario with basic calculations
    // In a real app this would use financial formulas based on parameters
    const baseScenario = scenarios.find(s => s.id === 'base')!;
    const newId = `custom-${Date.now()}`;

    const newParams = newScenario.parameters!;

    // Simple calculations based on parameter changes
    const priceRatio = newParams.salesPrice / baseScenario.parameters.salesPrice;
    const costRatio = newParams.constructionCosts / baseScenario.parameters.constructionCosts;
    const velocityRatio = newParams.salesVelocity / baseScenario.parameters.salesVelocity;

    // Rough estimate calculations
    const totalRevenue = Math.round(baseScenario.results.totalRevenue * priceRatio);
    const totalCosts = Math.round(baseScenario.results.totalCosts * costRatio * 
                                  (1 + (newParams.contingency - baseScenario.parameters.contingency) / 100) +
                                  (newParams.marketingCosts - baseScenario.parameters.marketingCosts));
    const grossProfit = totalRevenue - totalCosts;
    const margin = (grossProfit / totalRevenue) * 100;
    const roi = (grossProfit / totalCosts) * 100;

    // Simple IRR and NPV adjustments based on parameters
    const irr = baseScenario.results.irr * 
                (priceRatio * 0.5 + velocityRatio * 0.3 - 
                 (newParams.interestRate - baseScenario.parameters.interestRate) * 0.1);

    const npv = baseScenario.results.npv * priceRatio * velocityRatio / 
                (1 + (newParams.interestRate - baseScenario.parameters.interestRate) / 20);

    // Generate monthly projections (simplified)
    const monthlyProjections = baseScenario.monthlyProjections.map((monthi) => {
      const revenue = Math.round(month.revenue * priceRatio * (i === 0 ? 1 : velocityRatio));
      const costs = Math.round(month.costs * costRatio * (1 + (newParams.contingency - baseScenario.parameters.contingency) / 100));
      const cashFlow = revenue - costs;
      // Calculate cumulative cash flow
      const prevCumulativeCashFlow = i> 0 ? 
                    baseScenario.monthlyProjections[i-1].cumulativeCashFlow * priceRatio * velocityRatio / costRatio :
                    0;
      const cumulativeCashFlow = prevCumulativeCashFlow + cashFlow;

      return {
        month: month.month,
        revenue,
        costs,
        cashFlow,
        cumulativeCashFlow
      };
    });

    // Create the new scenario
    const scenario: FinancialScenario = {
      id: newId,
      name: newScenario.name,
      description: newScenario.description || 'Custom scenario',
      type: 'custom',
      isActive: true,
      created: new Date(),
      parameters: newParams,
      results: {
        totalRevenue,
        totalCosts,
        grossProfit,
        margin,
        roi,
        irr,
        paybackPeriod: baseScenario.results.paybackPeriod * (1 / velocityRatio) * (costRatio / priceRatio),
        npv
      },
      monthlyProjections
    };

    // Add to scenarios and select it
    setScenarios([...scenariosscenario]);
    setSelectedScenarioIds([...selectedScenarioIdsnewId]);
    setActiveScenarioId(newId);
    setActiveTab('detail');

    // Close dialog and reset form
    setNewScenarioOpen(false);
    setNewScenario({
      name: '',
      description: '',
      type: 'custom',
      parameters: {
        salesPrice: 350000,
        salesVelocity: 2.5,
        constructionCosts: 2500000,
        interestRate: 5.5,
        contingency: 5,
        marketingCosts: 150000
      }
    });
  };

  // Calculate sensitivity analysis data
  const sensitivityData = useMemo(() => {
    const baseScenario = scenarios.find(s => s.id === 'base')!;
    const baseParam = baseScenario.parameters[sensitivityParam];
    const baseResult = baseScenario.results.grossProfit;

    // Calculate profit impact for parameter changes from -20% to +20%
    return Array.from({ length: 9 }, (_i) => {
      const change = -20 + i * 5; // -20, -15, -10, -5, 0, 5, 10, 15, 20
      const paramValue = baseParam * (1 + change / 100);

      // Simplified calculation of profit impact
      let profitImpact = 0;

      if (sensitivityParam === 'salesPrice') {
        const revenueChange = baseScenario.results.totalRevenue * (change / 100);
        profitImpact = revenueChange;
      } else if (sensitivityParam === 'salesVelocity') {
        // For velocity, impact is on carrying costs and time value
        profitImpact = baseResult * (change / 200); // Simplified approximation
      } else if (sensitivityParam === 'constructionCosts') {
        const costChange = baseScenario.parameters.constructionCosts * (change / 100);
        profitImpact = -costChange; // Negative because higher costs reduce profit
      } else if (sensitivityParam === 'interestRate') {
        // Estimate interest cost change
        const financingAmount = baseScenario.parameters.constructionCosts * 0.7; // Assume 70% financing
        const interestChange = financingAmount * (change / 100) * 0.5; // Simplified for half-year average draw
        profitImpact = -interestChange;
      } else if (sensitivityParam === 'contingency') {
        const contingencyChange = baseScenario.parameters.constructionCosts * (change / 100) * 0.05;
        profitImpact = -contingencyChange;
      } else if (sensitivityParam === 'marketingCosts') {
        profitImpact = -(baseScenario.parameters.marketingCosts * (change / 100));
      }

      const newProfit = baseResult + profitImpact;
      const profitChangePercent = (profitImpact / baseResult) * 100;

      return {
        change: `${change> 0 ? '+' : ''}${change}%`,
        paramValue: sensitivityParam === 'interestRate' || sensitivityParam === 'contingency' ? 
                    baseParam + (change / 100) : paramValue,
        profit: newProfit,
        profitChange: profitImpact,
        profitChangePercent
      };
    });
  }, [sensitivityParamscenarios]);

  // Colors for charts
  const scenarioColors = {
    base: '#0088FE',
    optimistic: '#00C49F',
    pessimistic: '#FF8042'};

  const getScenarioColor = (scenarioId: string) => {
    if (scenarioId.startsWith('custom')) {
      // Generate a color based on the ID to keep it consistent
      const hash = scenarioId.split('-')[1];
      const hue = parseInt(hash.slice(04), 16) % 360;
      return `hsl(${hue}, 70%, 50%)`;
    }
    return (scenarioColors as any)[scenarioId] || '#8884d8';
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <CardTitle>Financial Scenario Comparison</CardTitle>
            <CardDescription>
              Compare different financial scenarios and analyze their impact
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setNewScenarioOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              New Scenario
            </Button>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export scenarios</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-4">
          <TabsList>
            <TabsTrigger value="compare">Compare Scenarios</TabsTrigger>
            <TabsTrigger value="detail">Scenario Details</TabsTrigger>
            <TabsTrigger value="cashflow">Cash Flow Analysis</TabsTrigger>
          </TabsList>

          {/* Scenario Comparison Tab */}
          <TabsContent value="compare" className="space-y-6">
            {/* Scenario Selection */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base">Select Scenarios to Compare</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-64">
                  <div className="space-y-2">
                    {scenarios.map((scenario) => (
                      <div 
                        key={scenario.id} 
                        className={cn(
                          "flex items-center p-2 rounded-md",
                          selectedScenarioIds.includes(scenario.id) && "bg-muted/50"
                        )}
                      >
                        <input
                          type="checkbox"
                          id={`scenario-${scenario.id}`}
                          checked={selectedScenarioIds.includes(scenario.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedScenarioIds([...selectedScenarioIds, scenario.id]);
                            } else {
                              setSelectedScenarioIds(selectedScenarioIds.filter(id => id !== scenario.id));
                            }
                          }
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor={`scenario-${scenario.id}`} className="ml-2 flex-grow cursor-pointer">
                          <div className="flex items-center">
                            <span 
                              className="h-3 w-3 rounded-full mr-2"
                              style={ backgroundColor: getScenarioColor(scenario.id) }
                            ></span>
                            <span>{scenario.name}</span>
                            {scenario.type !== 'custom' && (
                              <Badge variant="outline" className="ml-2">
                                {scenario.type.charAt(0).toUpperCase() + scenario.type.slice(1)}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground ml-5">
                            {scenario.description}
                          </p>
                        </label>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setActiveScenarioId(scenario.id)}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          {scenario.type === 'custom' && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-7 w-7"
                            >
                              <Trash className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Comparison Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Key Metrics Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Key Metrics Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={activeScenarios.map(s => ({
                          name: s.name,
                          id: s.id,
                          profit: s.results.grossProfit,
                          margin: s.results.margin,
                          roi: s.results.roi
                        }))}
                        layout="vertical"
                        margin={ top: 5, right: 30, left: 20, bottom: 5 }
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                        <YAxis type="category" dataKey="name" width={100} />
                        <Tooltip 
                          formatter={(valuename) => {
                            if (name === 'margin' || name === 'roi') {
                              return [`${value.toFixed(2)}%`, name === 'margin' ? 'Margin' : 'ROI'];
                            }
                            return [formatCurrency(value as number), name === 'profit' ? 'Profit' : name];
                          }
                        />
                        <Legend />
                        <Bar dataKey="profit" fill="#0088FE" name="Gross Profit">
                          {activeScenarios.map((sindex) => (
                            <Cell key={`cell-${index}`} fill={getScenarioColor(s.id)} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* ROI and IRR Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Return Metrics Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart 
                        outerRadius={90} 
                        width={500} 
                        height={300} 
                        data={[
                          { metric: 'ROI (%)', fullMark: 60 },
                          { metric: 'IRR (%)', fullMark: 30 },
                          { metric: 'Margin (%)', fullMark: 40 },
                          { metric: 'NPV ($000s)', fullMark: 1500 },
                          { metric: 'Payback (Years)', fullMark: 4, inverse: true }
                        ].map(metric => {
                          const result: any = { metric: metric.metric };
                          activeScenarios.forEach(s => {
                            let value = 0;
                            if (metric.metric === 'ROI (%)') value = s.results.roi;
                            else if (metric.metric === 'IRR (%)') value = s.results.irr;
                            else if (metric.metric === 'Margin (%)') value = s.results.margin;
                            else if (metric.metric === 'NPV ($000s)') value = s.results.npv / 1000;
                            else if (metric.metric === 'Payback (Years)') {
                              // For payback, lower is better, so we invert
                              value = metric.inverse ? 
                                     metric.fullMark - s.results.paybackPeriod :
                                     s.results.paybackPeriod;
                            }
                            result[s.id] = value;
                          });
                          return result;
                        })}
                      >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" />
                        <PolarRadiusAxis />
                        {activeScenarios.map(s => (
                          <Radar 
                            key={s.id}
                            name={s.name} 
                            dataKey={s.id} 
                            stroke={getScenarioColor(s.id)} 
                            fill={getScenarioColor(s.id)} 
                            fillOpacity={0.3}
                          />
                        ))}
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Comparison Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Detailed Metrics Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Metric</TableHead>
                      {activeScenarios.map((scenario) => (
                        <TableHead key={scenario.id} className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span
                              className="h-3 w-3 rounded-full"
                              style={ backgroundColor: getScenarioColor(scenario.id) }
                            ></span>
                            <span>{scenario.name}</span>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Parameters section */}
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={activeScenarios.length + 1} className="font-semibold">
                        Input Parameters
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Sales Price</TableCell>
                      {activeScenarios.map((scenario) => (
                        <TableCell key={scenario.id} className="text-right">
                          {formatCurrency(scenario.parameters.salesPrice)}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>Sales Velocity (units/month)</TableCell>
                      {activeScenarios.map((scenario) => (
                        <TableCell key={scenario.id} className="text-right">
                          {scenario.parameters.salesVelocity.toFixed(1)}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>Construction Costs</TableCell>
                      {activeScenarios.map((scenario) => (
                        <TableCell key={scenario.id} className="text-right">
                          {formatCurrency(scenario.parameters.constructionCosts)}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>Interest Rate (%)</TableCell>
                      {activeScenarios.map((scenario) => (
                        <TableCell key={scenario.id} className="text-right">
                          {scenario.parameters.interestRate.toFixed(2)}%
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>Contingency (%)</TableCell>
                      {activeScenarios.map((scenario) => (
                        <TableCell key={scenario.id} className="text-right">
                          {scenario.parameters.contingency.toFixed(1)}%
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>Marketing Costs</TableCell>
                      {activeScenarios.map((scenario) => (
                        <TableCell key={scenario.id} className="text-right">
                          {formatCurrency(scenario.parameters.marketingCosts)}
                        </TableCell>
                      ))}
                    </TableRow>

                    {/* Results section */}
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={activeScenarios.length + 1} className="font-semibold">
                        Financial Results
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total Revenue</TableCell>
                      {activeScenarios.map((scenario) => (
                        <TableCell key={scenario.id} className="text-right">
                          {formatCurrency(scenario.results.totalRevenue)}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>Total Costs</TableCell>
                      {activeScenarios.map((scenario) => (
                        <TableCell key={scenario.id} className="text-right">
                          {formatCurrency(scenario.results.totalCosts)}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>Gross Profit</TableCell>
                      {activeScenarios.map((scenario) => (
                        <TableCell key={scenario.id} className="text-right font-medium">
                          {formatCurrency(scenario.results.grossProfit)}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>Profit Margin</TableCell>
                      {activeScenarios.map((scenario) => (
                        <TableCell key={scenario.id} className="text-right">
                          {formatPercentage(scenario.results.margin)}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>ROI</TableCell>
                      {activeScenarios.map((scenario) => (
                        <TableCell key={scenario.id} className="text-right">
                          {formatPercentage(scenario.results.roi)}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>IRR</TableCell>
                      {activeScenarios.map((scenario) => (
                        <TableCell key={scenario.id} className="text-right">
                          {formatPercentage(scenario.results.irr)}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>Payback Period (years)</TableCell>
                      {activeScenarios.map((scenario) => (
                        <TableCell key={scenario.id} className="text-right">
                          {scenario.results.paybackPeriod.toFixed(1)}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>Net Present Value</TableCell>
                      {activeScenarios.map((scenario) => (
                        <TableCell key={scenario.id} className="text-right">
                          {formatCurrency(scenario.results.npv)}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scenario Details Tab */}
          <TabsContent value="detail" className="space-y-6">
            {/* Scenario Selection */}
            <div className="flex justify-between items-center">
              <Select 
                value={activeScenarioId} 
                onValueChange={setActiveScenarioId}
              >
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select scenario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Scenarios</SelectLabel>
                    {scenarios.map((scenario) => (
                      <SelectItem key={scenario.id} value={scenario.id}>
                        <div className="flex items-center">
                          <span 
                            className="h-2 w-2 rounded-full mr-2"
                            style={ backgroundColor: getScenarioColor(scenario.id) }
                          ></span>
                          {scenario.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-1.5" />
                  Duplicate
                </Button>
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4 mr-1.5" />
                  Save
                </Button>
              </div>
            </div>

            {/* Scenario Details & Sensitivity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Scenario Parameters */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Scenario Parameters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="salesPrice">Sales Price</Label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-2.5 text-muted-foreground">$</span>
                          <Input 
                            id="salesPrice"
                            type="number"
                            value={activeScenario.parameters.salesPrice}
                            className="pl-7"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="salesVelocity">Sales Velocity (units/month)</Label>
                        <Input 
                          id="salesVelocity"
                          type="number"
                          step="0.1"
                          value={activeScenario.parameters.salesVelocity}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="constructionCosts">Construction Costs</Label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-2.5 text-muted-foreground">$</span>
                          <Input 
                            id="constructionCosts"
                            type="number"
                            value={activeScenario.parameters.constructionCosts}
                            className="pl-7"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="interestRate">Interest Rate (%)</Label>
                        <Input 
                          id="interestRate"
                          type="number"
                          step="0.1"
                          value={activeScenario.parameters.interestRate}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contingency">Contingency (%)</Label>
                        <Input 
                          id="contingency"
                          type="number"
                          step="0.1"
                          value={activeScenario.parameters.contingency}
                          readOnly
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="marketingCosts">Marketing Costs</Label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-2.5 text-muted-foreground">$</span>
                          <Input 
                            id="marketingCosts"
                            type="number"
                            value={activeScenario.parameters.marketingCosts}
                            className="pl-7"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sensitivity Analysis */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">Sensitivity Analysis</CardTitle>
                    <Select 
                      value={sensitivityParam} 
                      onValueChange={(value) => setSensitivityParam(value as any)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select parameter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Parameter</SelectLabel>
                          <SelectItem value="salesPrice">Sales Price</SelectItem>
                          <SelectItem value="salesVelocity">Sales Velocity</SelectItem>
                          <SelectItem value="constructionCosts">Construction Costs</SelectItem>
                          <SelectItem value="interestRate">Interest Rate</SelectItem>
                          <SelectItem value="contingency">Contingency</SelectItem>
                          <SelectItem value="marketingCosts">Marketing Costs</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={sensitivityData}
                        margin={ top: 5, right: 30, left: 20, bottom: 5 }
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="change" />
                        <YAxis yAxisId="left" tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                        <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value.toFixed(0)}%`} />
                        <Tooltip 
                          formatter={(valuename) => {
                            if (name === 'profitChangePercent') {
                              return [`${value.toFixed(2)}%`, 'Change %'];
                            }
                            return [formatCurrency(value as number), 
                                   name === 'profit' ? 'Profit' : 
                                   name === 'profitChange' ? 'Change $' : name];
                          }
                        />
                        <Legend />
                        <Line 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="profit" 
                          stroke="#0088FE" 
                          activeDot={ r: 8 }
                          name="Gross Profit" 
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="profitChangePercent" 
                          stroke="#FF8042" 
                          name="% Change"
                        />
                        <ReferenceLine y={0} yAxisId="right" stroke="#666" strokeDasharray="3 3" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-2 text-sm text-muted-foreground">
                    <span className="font-medium">Note:</span> This chart shows how profit changes 
                    when {sensitivityParam === 'salesPrice' ? 'sales price' : 
                         sensitivityParam === 'salesVelocity' ? 'sales velocity' : 
                         sensitivityParam === 'constructionCosts' ? 'construction costs' : 
                         sensitivityParam === 'interestRate' ? 'interest rate' : 
                         sensitivityParam === 'contingency' ? 'contingency percentage' : 
                         'marketing costs'} varies from -20% to +20% of the base value.
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results and Financial Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Financial Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">Total Revenue</Label>
                      <div className="text-2xl font-semibold">
                        {formatCurrency(activeScenario.results.totalRevenue)}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">Total Costs</Label>
                      <div className="text-2xl font-semibold">
                        {formatCurrency(activeScenario.results.totalCosts)}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">Gross Profit</Label>
                      <div className="text-2xl font-semibold">
                        {formatCurrency(activeScenario.results.grossProfit)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">Profit Margin</Label>
                      <div className="text-2xl font-semibold">
                        {formatPercentage(activeScenario.results.margin)}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">Return on Investment</Label>
                      <div className="text-2xl font-semibold">
                        {formatPercentage(activeScenario.results.roi)}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">Internal Rate of Return</Label>
                      <div className="text-2xl font-semibold">
                        {formatPercentage(activeScenario.results.irr)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Label className="text-sm text-muted-foreground">Payback Period</Label>
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-muted-foreground ml-1 cursor-help" />
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <div className="space-y-1">
                              <h4 className="text-sm font-semibold">Payback Period</h4>
                              <p className="text-sm">
                                The time it takes to recover the initial investment through project cash flows.
                              </p>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                      <div className="text-2xl font-semibold">
                        {activeScenario.results.paybackPeriod.toFixed(1)} years
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Label className="text-sm text-muted-foreground">Net Present Value</Label>
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-muted-foreground ml-1 cursor-help" />
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <div className="space-y-1">
                              <h4 className="text-sm font-semibold">Net Present Value (NPV)</h4>
                              <p className="text-sm">
                                The difference between the present value of cash inflows and outflows over the project period,
                                discounted at the weighted average cost of capital (WACC).
                              </p>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                      <div className="text-2xl font-semibold">
                        {formatCurrency(activeScenario.results.npv)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cash Flow Analysis Tab */}
          <TabsContent value="cashflow" className="space-y-6">
            {/* Scenario Selection */}
            <div className="flex justify-between items-center">
              <Select 
                value={activeScenarioId} 
                onValueChange={setActiveScenarioId}
              >
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select scenario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Scenarios</SelectLabel>
                    {scenarios.map((scenario) => (
                      <SelectItem key={scenario.id} value={scenario.id}>
                        <div className="flex items-center">
                          <span 
                            className="h-2 w-2 rounded-full mr-2"
                            style={ backgroundColor: getScenarioColor(scenario.id) }
                          ></span>
                          {scenario.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1.5" />
                Export Cash Flow
              </Button>
            </div>

            {/* Cash Flow Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Cash Flow */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Monthly Cash Flows</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={activeScenario.monthlyProjections}
                        margin={ top: 20, right: 30, left: 20, bottom: 5 }
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                        <Tooltip 
                          formatter={(value) => [formatCurrency(value as number), '']}
                        />
                        <Legend />
                        <Bar dataKey="revenue" stackId="a" fill="#0088FE" name="Revenue" />
                        <Bar dataKey="costs" stackId="a" fill="#FF8042" name="Costs" />
                        <Line type="monotone" dataKey="cashFlow" stroke="#00C49F" name="Net Cash Flow" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Cumulative Cash Flow */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Cumulative Cash Flow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={activeScenario.monthlyProjections}
                        margin={ top: 20, right: 30, left: 20, bottom: 5 }
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                        <Tooltip 
                          formatter={(value) => [formatCurrency(value as number), '']}
                        />
                        <Legend />
                        <ReferenceLine y={0} stroke="#000" />
                        <Area 
                          type="monotone" 
                          dataKey="cumulativeCashFlow" 
                          stroke="#8884d8" 
                          fill="#8884d8"
                          fillOpacity={0.3}
                          name="Cumulative Cash Flow"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cash Flow Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cash Flow Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                        <TableHead className="text-right">Costs</TableHead>
                        <TableHead className="text-right">Net Cash Flow</TableHead>
                        <TableHead className="text-right">Cumulative Cash Flow</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeScenario.monthlyProjections.map((monthi) => (
                        <TableRow key={month.month}>
                          <TableCell>{month.month}</TableCell>
                          <TableCell className="text-right">{formatCurrency(month.revenue)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(month.costs)}</TableCell>
                          <TableCell className="text-right">
                            <span className={month.cashFlow>= 0 ? 'text-green-600' : 'text-red-600'}>
                              {formatCurrency(month.cashFlow)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={month.cumulativeCashFlow>= 0 ? 'text-green-600' : 'text-red-600'}>
                              {formatCurrency(month.cumulativeCashFlow)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}

                      {/* Totals row */}
                      <TableRow className="font-bold border-t-2">
                        <TableCell>Total</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(activeScenario.results.totalRevenue)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(activeScenario.results.totalCosts)}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={activeScenario.results.grossProfit>= 0 ? 'text-green-600' : 'text-red-600'}>
                            {formatCurrency(activeScenario.results.grossProfit)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={activeScenario.results.grossProfit>= 0 ? 'text-green-600' : 'text-red-600'}>
                            {formatCurrency(activeScenario.results.grossProfit)}
                          </span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  <Badge variant="outline" className="mr-2">Note</Badge>
                  Positive cash flow indicates more money coming in than going out during that period.
                  The break-even point occurs when cumulative cash flow becomes positive.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* New Scenario Dialog */}
      <Dialog open={newScenarioOpen} onOpenChange={setNewScenarioOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create New Scenario</DialogTitle>
            <DialogDescription>
              Define parameters for your new financial scenario.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newScenario.name}
                onChange={(e) => setNewScenario({ ...newScenario, name: e.target.value })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={newScenario.description}
                onChange={(e) => setNewScenario({ ...newScenario, description: e.target.value })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="salesPrice" className="text-right">
                Sales Price
              </Label>
              <div className="col-span-3 relative">
                <span className="absolute left-2.5 top-2.5 text-muted-foreground">$</span>
                <Input
                  id="salesPrice"
                  type="number"
                  value={newScenario.parameters?.salesPrice}
                  onChange={(e) => setNewScenario({ 
                    ...newScenario, 
                    parameters: { 
                      ...newScenario.parameters!, 
                      salesPrice: parseInt(e.target.value) 
                    } 
                  })}
                  className="pl-7"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="salesVelocity" className="text-right">
                Sales Velocity
              </Label>
              <Input
                id="salesVelocity"
                type="number"
                step="0.1"
                value={newScenario.parameters?.salesVelocity}
                onChange={(e) => setNewScenario({ 
                  ...newScenario, 
                  parameters: { 
                    ...newScenario.parameters!, 
                    salesVelocity: parseFloat(e.target.value) 
                  } 
                })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="constructionCosts" className="text-right">
                Construction Costs
              </Label>
              <div className="col-span-3 relative">
                <span className="absolute left-2.5 top-2.5 text-muted-foreground">$</span>
                <Input
                  id="constructionCosts"
                  type="number"
                  value={newScenario.parameters?.constructionCosts}
                  onChange={(e) => setNewScenario({ 
                    ...newScenario, 
                    parameters: { 
                      ...newScenario.parameters!, 
                      constructionCosts: parseInt(e.target.value) 
                    } 
                  })}
                  className="pl-7"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="interestRate" className="text-right">
                Interest Rate (%)
              </Label>
              <Input
                id="interestRate"
                type="number"
                step="0.1"
                value={newScenario.parameters?.interestRate}
                onChange={(e) => setNewScenario({ 
                  ...newScenario, 
                  parameters: { 
                    ...newScenario.parameters!, 
                    interestRate: parseFloat(e.target.value) 
                  } 
                })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contingency" className="text-right">
                Contingency (%)
              </Label>
              <Input
                id="contingency"
                type="number"
                step="0.1"
                value={newScenario.parameters?.contingency}
                onChange={(e) => setNewScenario({ 
                  ...newScenario, 
                  parameters: { 
                    ...newScenario.parameters!, 
                    contingency: parseFloat(e.target.value) 
                  } 
                })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="marketingCosts" className="text-right">
                Marketing Costs
              </Label>
              <div className="col-span-3 relative">
                <span className="absolute left-2.5 top-2.5 text-muted-foreground">$</span>
                <Input
                  id="marketingCosts"
                  type="number"
                  value={newScenario.parameters?.marketingCosts}
                  onChange={(e) => setNewScenario({ 
                    ...newScenario, 
                    parameters: { 
                      ...newScenario.parameters!, 
                      marketingCosts: parseInt(e.target.value) 
                    } 
                  })}
                  className="pl-7"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setNewScenarioOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleAddScenario}>
              Create Scenario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CardFooter className="border-t p-4">
        <div className="flex flex-col xs:flex-row justify-between w-full text-sm text-muted-foreground gap-2">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Financial projections as of April 30, 2023</span>
          </div>
          <div>
            Scenario data last updated: 2 days ago
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}