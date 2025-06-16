import React from 'react';
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
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  ChevronsUpDown, 
  Download, 
  HelpCircle, 
  Info, 
  Save, 
  Trash, 
  Calculator,
  Plus
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger} from "@/components/ui/dialog";
import { 
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger} from "@/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger} from "@/components/ui/popover";

// Types
interface FinancingOption {
  id: string;
  name: string;
  loanAmount: number;
  interestRate: number;
  termYears: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  amortization: {
    year: number;
    principal: number;
    interest: number;
    balance: number;
  }[];
  roi: number;
  irr: number;
  equityRequired: number;
  cashOnCashReturn: number;
  debtServiceCoverageRatio: number;
  loanToValue: number;
  debtYield: number;
  breakEvenOccupancy: number;
}

interface Project {
  id: string;
  name: string;
  value: number;
  annualIncome: number;
  annualExpenses: number;
  expectedAppreciation: number;
  propertyType: 'residential' | 'commercial' | 'mixed';
  options: FinancingOption[];
}

interface ROICalculatorProps {
  projectId?: string;
  className?: string;
}

// Main component
export default function ROICalculator({
  projectId,
  className
}: ROICalculatorProps) {
  // State for active project
  const [activeProjectsetActiveProject] = useState<Project>({
    id: 'project-1',
    name: 'Fitzgerald Gardens',
    value: 5000000,
    annualIncome: 350000,
    annualExpenses: 120000,
    expectedAppreciation: 3.5,
    propertyType: 'residential',
    options: [
      {
        id: 'option-1',
        name: 'Conventional Mortgage',
        loanAmount: 3750000,
        interestRate: 5.5,
        termYears: 30,
        monthlyPayment: 21294,
        totalInterest: 3915803,
        totalPayment: 7665803,
        amortization: [
          { year: 1, principal: 44035, interest: 211488, balance: 3705965 },
          { year: 2, principal: 46505, interest: 209018, balance: 3659460 },
          { year: 3, principal: 49124, interest: 206399, balance: 3610336 },
          { year: 4, principal: 51900, interest: 203623, balance: 3558436 },
          { year: 5, principal: 54843, interest: 200680, balance: 3503593 },
          { year: 10, principal: 72009, interest: 183515, balance: 3172589 },
          { year: 15, principal: 94526, interest: 160997, balance: 2738037 },
          { year: 20, principal: 124091, interest: 131433, balance: 2169764 },
          { year: 25, principal: 162893, interest: 92631, balance: 1425188 },
          { year: 30, principal: 213865, interest: 41658, balance: 0 }
        ],
        roi: 12.5,
        irr: 8.7,
        equityRequired: 1250000,
        cashOnCashReturn: 9.7,
        debtServiceCoverageRatio: 1.37,
        loanToValue: 75,
        debtYield: 6.1,
        breakEvenOccupancy: 72.4
      },
      {
        id: 'option-2',
        name: 'Interest-Only',
        loanAmount: 3500000,
        interestRate: 6.0,
        termYears: 10,
        monthlyPayment: 17500,
        totalInterest: 2100000,
        totalPayment: 5600000,
        amortization: [
          { year: 1, principal: 0, interest: 210000, balance: 3500000 },
          { year: 2, principal: 0, interest: 210000, balance: 3500000 },
          { year: 3, principal: 0, interest: 210000, balance: 3500000 },
          { year: 4, principal: 0, interest: 210000, balance: 3500000 },
          { year: 5, principal: 0, interest: 210000, balance: 3500000 },
          { year: 10, principal: 3500000, interest: 210000, balance: 0 }
        ],
        roi: 14.2,
        irr: 10.1,
        equityRequired: 1500000,
        cashOnCashReturn: 11.3,
        debtServiceCoverageRatio: 1.67,
        loanToValue: 70,
        debtYield: 7.4,
        breakEvenOccupancy: 68.9
      },
      {
        id: 'option-3',
        name: 'Developer Financing',
        loanAmount: 4000000,
        interestRate: 7.0,
        termYears: 5,
        monthlyPayment: 79109,
        totalInterest: 746513,
        totalPayment: 4746513,
        amortization: [
          { year: 1, principal: 696329, interest: 252971, balance: 3303671 },
          { year: 2, principal: 746969, interest: 202331, balance: 2556702 },
          { year: 3, principal: 801203, interest: 148097, balance: 1755499 },
          { year: 4, principal: 859342, interest: 89958, balance: 896157 },
          { year: 5, principal: 896157, interest: 53156, balance: 0 }
        ],
        roi: 15.7,
        irr: 9.3,
        equityRequired: 1000000,
        cashOnCashReturn: 15.1,
        debtServiceCoverageRatio: 0.93,
        loanToValue: 80,
        debtYield: 5.8,
        breakEvenOccupancy: 81.2
      }
    ]
  });

  // State for new financing option
  const [newOptionsetNewOption] = useState<Partial<FinancingOption>>({
    name: '',
    loanAmount: 3500000,
    interestRate: 5.75,
    termYears: 25
  });

  // State for custom parameters
  const [customParamssetCustomParams] = useState<{
    propertyValue: number;
    annualIncome: number;
    annualExpenses: number;
    appreciation: number;
  }>({
    propertyValue: activeProject.value,
    annualIncome: activeProject.annualIncome,
    annualExpenses: activeProject.annualExpenses,
    appreciation: activeProject.expectedAppreciation
  });

  // State for dialog open
  const [newOptionDialogOpensetNewOptionDialogOpen] = useState(false);

  // State for selected option IDs
  const [selectedOptionIdssetSelectedOptionIds] = useState<string[]>(['option-1', 'option-2', 'option-3']);

  // State for active option ID
  const [activeOptionIdsetActiveOptionId] = useState<string>('option-1');

  // State for active tab
  const [activeTabsetActiveTab] = useState<'compare' | 'detail' | 'amortization'>('compare');

  // Get active options for comparison
  const activeOptions = useMemo(() => {
    return activeProject.options.filter(option => selectedOptionIds.includes(option.id));
  }, [activeProject.optionsselectedOptionIds]);

  // Get active option for detailed view
  const activeOption = useMemo(() => {
    return activeProject.options.find(option => option.id === activeOptionId) || activeProject.options[0];
  }, [activeProject.optionsactiveOptionId]);

  // Calculate monthly payment for a loan
  const calculateMonthlyPayment = (loanAmount: number, interestRate: number, termYears: number): number => {
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = termYears * 12;
    return loanAmount * monthlyRate * Math.pow(1 + monthlyRatenumPayments) / (Math.pow(1 + monthlyRatenumPayments) - 1);
  };

  // Calculate amortization schedule
  const calculateAmortization = (loanAmount: number, interestRate: number, termYears: number, monthlyPayment: number) => {
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = termYears * 12;
    let balance = loanAmount;
    const amortization = [];

    // For interest-only loan
    if (monthlyPayment === loanAmount * monthlyRate) {
      for (let year = 1; year <= termYears; year++) {
        const annualInterest = loanAmount * interestRate / 100;
        const annualPrincipal = year === termYears ? loanAmount : 0;

        amortization.push({
          year,
          principal: annualPrincipal,
          interest: annualInterest,
          balance: year === termYears ? 0 : loanAmount
        });
      }
      return amortization;
    }

    // For standard amortizing loan
    for (let year = 1; year <= termYears; year++) {
      let annualPrincipal = 0;
      let annualInterest = 0;

      for (let month = 1; month <= 12 && balance> 0; month++) {
        const interestPayment = balance * monthlyRate;
        let principalPayment = monthlyPayment - interestPayment;

        if (principalPayment> balance) {
          principalPayment = balance;
        }

        balance -= principalPayment;
        annualPrincipal += principalPayment;
        annualInterest += interestPayment;
      }

      amortization.push({
        year,
        principal: Math.round(annualPrincipal),
        interest: Math.round(annualInterest),
        balance: Math.round(balance)
      });
    }

    return amortization;
  };

  // Calculate ROI and other metrics for a financing option
  const calculateROI = (
    propertyValue: number, 
    loanAmount: number, 
    annualIncome: number, 
    annualExpenses: number, 
    annualDebtService: number,
    appreciation: number
  ) => {
    const equityRequired = propertyValue - loanAmount;
    const annualCashFlow = annualIncome - annualExpenses - annualDebtService;
    const cashOnCashReturn = (annualCashFlow / equityRequired) * 100;
    const appreciationReturn = (propertyValue * appreciation / 100) / equityRequired * 100;
    const roi = cashOnCashReturn + appreciationReturn;

    // Simplified IRR calculation (not a true IRR, just an approximation)
    const irr = roi * 0.75; // Discounted for time value of money

    const dscr = (annualIncome - annualExpenses) / annualDebtService;
    const ltv = (loanAmount / propertyValue) * 100;
    const debtYield = annualCashFlow / loanAmount * 100;

    // Break-even occupancy
    const breakEvenOccupancy = ((annualExpenses + annualDebtService) / annualIncome) * 100;

    return {
      roi,
      irr,
      equityRequired,
      cashOnCashReturn,
      debtServiceCoverageRatio: dscr,
      loanToValue: ltv,
      debtYield,
      breakEvenOccupancy
    };
  };

  // Handle adding new financing option
  const handleAddOption = () => {
    if (!newOption.name || !newOption.loanAmount || !newOption.interestRate || !newOption.termYears) return;

    // Calculate monthly payment
    const isInterestOnly = newOption.name?.toLowerCase().includes('interest-only');
    const monthlyRate = newOption.interestRate! / 100 / 12;
    const monthlyPayment = isInterestOnly
      ? Math.round(newOption.loanAmount! * monthlyRate)
      : calculateMonthlyPayment(newOption.loanAmount!, newOption.interestRate!, newOption.termYears!);

    // Generate amortization schedule
    const amortization = calculateAmortization(
      newOption.loanAmount!,
      newOption.interestRate!,
      newOption.termYears!,
      monthlyPayment
    );

    // Calculate total interest and total payment
    const totalInterest = amortization.reduce((sumyear: any) => sum + year.interest0);
    const totalPayment = newOption.loanAmount! + totalInterest;

    // Calculate ROI and other metrics
    const annualDebtService = monthlyPayment * 12;
    const metrics = calculateROI(
      customParams.propertyValue,
      newOption.loanAmount!,
      customParams.annualIncome,
      customParams.annualExpenses,
      annualDebtService,
      customParams.appreciation
    );

    // Create new option
    const newId = `option-${Date.now()}`;
    const option: FinancingOption = {
      id: newId,
      name: newOption.name,
      loanAmount: newOption.loanAmount!,
      interestRate: newOption.interestRate!,
      termYears: newOption.termYears!,
      monthlyPayment: Math.round(monthlyPayment),
      totalInterest,
      totalPayment,
      amortization,
      ...metrics
    };

    // Add to options and select it
    const updatedOptions = [...activeProject.optionsoption];
    setActiveProject({ ...activeProject, options: updatedOptions });
    setSelectedOptionIds([...selectedOptionIdsnewId]);
    setActiveOptionId(newId);
    setActiveTab('detail');

    // Close dialog and reset form
    setNewOptionDialogOpen(false);
    setNewOption({
      name: '',
      loanAmount: 3500000,
      interestRate: 5.75,
      termYears: 25
    });
  };

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

  // Colors for charts
  const optionColors = {
    'option-1': '#0088FE',
    'option-2': '#00C49F',
    'option-3': '#FF8042'};

  const getOptionColor = (optionId: string) => {
    if (optionId.startsWith('option-') && !Object.keys(optionColors).includes(optionId)) {
      // Generate a color based on the ID to keep it consistent
      const hash = optionId.split('-')[1];
      const hue = parseInt(hash.slice(0), 16) % 360;
      return `hsl(${hue}, 70%, 50%)`;
    }
    return (optionColors as any)[optionId] || '#8884d8';
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <CardTitle>ROI Calculator</CardTitle>
            <CardDescription>
              Compare different financing options and their return on investment
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setNewOptionDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              New Option
            </Button>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export analysis</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Property Parameters */}
        <Collapsible className="w-full">
          <div className="flex items-center justify-between space-x-4 px-4">
            <h4 className="text-sm font-semibold">Property Parameters</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                <ChevronsUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="px-4 pt-2 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="propertyValue">Property Value</Label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2.5 text-muted-foreground">$</span>
                  <Input 
                    id="propertyValue"
                    type="number"
                    value={customParams.propertyValue}
                    onChange={(e: any) => setCustomParams({
                      ...customParams,
                      propertyValue: parseInt(e.target.value) || 0
                    })}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="annualIncome">Annual Income</Label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2.5 text-muted-foreground">$</span>
                  <Input 
                    id="annualIncome"
                    type="number"
                    value={customParams.annualIncome}
                    onChange={(e: any) => setCustomParams({
                      ...customParams,
                      annualIncome: parseInt(e.target.value) || 0
                    })}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="annualExpenses">Annual Expenses</Label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2.5 text-muted-foreground">$</span>
                  <Input 
                    id="annualExpenses"
                    type="number"
                    value={customParams.annualExpenses}
                    onChange={(e: any) => setCustomParams({
                      ...customParams,
                      annualExpenses: parseInt(e.target.value) || 0
                    })}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="appreciation">Annual Appreciation</Label>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground ml-1 cursor-help" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">Property Appreciation</h4>
                        <p className="text-sm">
                          The expected annual increase in property value, which contributes to your overall return on investment.
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <div className="flex items-center space-x-3">
                  <Slider
                    id="appreciation"
                    min={0}
                    max={10}
                    step={0.1}
                    value={[customParams.appreciation]}
                    onValueChange={(value: any) => setCustomParams({
                      ...customParams,
                      appreciation: value[0]
                    })}
                    className="flex-1"
                  />
                  <div className="w-16 text-right">
                    {customParams.appreciation.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v as any)} className="space-y-4">
          <TabsList>
            <TabsTrigger value="compare">Compare Options</TabsTrigger>
            <TabsTrigger value="detail">Option Details</TabsTrigger>
            <TabsTrigger value="amortization">Amortization</TabsTrigger>
          </TabsList>

          {/* Compare Options Tab */}
          <TabsContent value="compare" className="space-y-6">
            {/* Financing Options Selection */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base">Select Financing Options to Compare</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-64">
                  <div className="space-y-2">
                    {activeProject.options.map((option: any) => (
                      <div 
                        key={option.id} 
                        className={cn(
                          "flex items-center p-2 rounded-md",
                          selectedOptionIds.includes(option.id) && "bg-muted/50"
                        )}
                      >
                        <input
                          type="checkbox"
                          id={`option-${option.id}`}
                          checked={selectedOptionIds.includes(option.id)}
                          onChange={(e: any) => {
                            if (e.target.checked) {
                              setSelectedOptionIds([...selectedOptionIds, option.id]);
                            } else {
                              setSelectedOptionIds(selectedOptionIds.filter(id => id !== option.id));
                            }
                          }
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor={`option-${option.id}`} className="ml-2 flex-grow cursor-pointer">
                          <div className="flex items-center">
                            <span 
                              className="h-3 w-3 rounded-full mr-2"
                              style={ backgroundColor: getOptionColor(option.id) }
                            ></span>
                            <span>{option.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground ml-5">
                            {formatCurrency(option.loanAmount)} at {option.interestRate}% for {option.termYears} years
                          </p>
                        </label>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setActiveOptionId(option.id)}
                          >
                            <Calculator className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Comparison Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* ROI Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Return on Investment Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={activeOptions.map(option => ({
                          name: option.name,
                          id: option.id,
                          roi: option.roi,
                          cashOnCash: option.cashOnCashReturn,
                          appreciation: option.roi - option.cashOnCashReturn
                        }))}
                        margin={ top: 20, right: 30, left: 40, bottom: 10 }
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tickFormatter={(value: any) => `${value}%`} />
                        <YAxis type="category" dataKey="name" width={100} />
                        <RechartsTooltip formatter={(value: any) => [`${value.toFixed(2)}%`, '']} />
                        <Legend />
                        <Bar dataKey="cashOnCash" stackId="a" name="Cash on Cash Return" fill="#0088FE">
                          {activeOptions.map((optionindex: any) => (
                            <Cell key={`cell-cash-${index}`} fill={getOptionColor(option.id)} />
                          ))}
                        </Bar>
                        <Bar dataKey="appreciation" stackId="a" name="Appreciation" fill="#00C49F" opacity={0.7}>
                          {activeOptions.map((optionindex: any) => (
                            <Cell key={`cell-appr-${index}`} fill={getOptionColor(option.id)} opacity={0.7} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Metrics Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Financial Metrics Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart 
                        outerRadius={90} 
                        data={[
                          { metric: 'ROI (%)', fullMark: 20 },
                          { metric: 'IRR (%)', fullMark: 15 },
                          { metric: 'Cash-on-Cash (%)', fullMark: 20 },
                          { metric: 'DSCR', fullMark: 2, inverse: false },
                          { metric: 'Debt Yield (%)', fullMark: 10 }
                        ].map(metric => {
                          const result: any = { metric: metric.metric };
                          activeOptions.forEach(option => {
                            let value = 0;
                            if (metric.metric === 'ROI (%)') value = option.roi;
                            else if (metric.metric === 'IRR (%)') value = option.irr;
                            else if (metric.metric === 'Cash-on-Cash (%)') value = option.cashOnCashReturn;
                            else if (metric.metric === 'DSCR') value = option.debtServiceCoverageRatio;
                            else if (metric.metric === 'Debt Yield (%)') value = option.debtYield;
                            result[option.id] = value;
                          });
                          return result;
                        })}
                      >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" />
                        <PolarRadiusAxis />
                        {activeOptions.map(option => (
                          <Radar 
                            key={option.id}
                            name={option.name} 
                            dataKey={option.id} 
                            stroke={getOptionColor(option.id)} 
                            fill={getOptionColor(option.id)} 
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
                <CardTitle className="text-base">Detailed Financing Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Metric</TableHead>
                      {activeOptions.map((option: any) => (
                        <TableHead key={option.id} className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span
                              className="h-3 w-3 rounded-full"
                              style={ backgroundColor: getOptionColor(option.id) }
                            ></span>
                            <span>{option.name}</span>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Loan Parameters section */}
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={activeOptions.length + 1} className="font-semibold">
                        Loan Parameters
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Loan Amount</TableCell>
                      {activeOptions.map((option: any) => (
                        <TableCell key={option.id} className="text-right">
                          {formatCurrency(option.loanAmount)}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>Interest Rate</TableCell>
                      {activeOptions.map((option: any) => (
                        <TableCell key={option.id} className="text-right">
                          {option.interestRate.toFixed(2)}%
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>Term (Years)</TableCell>
                      {activeOptions.map((option: any) => (
                        <TableCell key={option.id} className="text-right">
                          {option.termYears}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>Monthly Payment</TableCell>
                      {activeOptions.map((option: any) => (
                        <TableCell key={option.id} className="text-right">
                          {formatCurrency(option.monthlyPayment)}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>Total Interest</TableCell>
                      {activeOptions.map((option: any) => (
                        <TableCell key={option.id} className="text-right">
                          {formatCurrency(option.totalInterest)}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>Total Payment</TableCell>
                      {activeOptions.map((option: any) => (
                        <TableCell key={option.id} className="text-right">
                          {formatCurrency(option.totalPayment)}
                        </TableCell>
                      ))}
                    </TableRow>

                    {/* Investment Performance section */}
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={activeOptions.length + 1} className="font-semibold">
                        Investment Performance
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Equity Required</TableCell>
                      {activeOptions.map((option: any) => (
                        <TableCell key={option.id} className="text-right">
                          {formatCurrency(option.equityRequired)}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>Annual Cash Flow</TableCell>
                      {activeOptions.map((option: any) => (
                        <TableCell key={option.id} className="text-right">
                          {formatCurrency(customParams.annualIncome - customParams.annualExpenses - (option.monthlyPayment * 12))}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Return on Investment (ROI)</TableCell>
                      {activeOptions.map((option: any) => (
                        <TableCell key={option.id} className="text-right font-medium">
                          {formatPercentage(option.roi)}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>Internal Rate of Return (IRR)</TableCell>
                      {activeOptions.map((option: any) => (
                        <TableCell key={option.id} className="text-right">
                          {formatPercentage(option.irr)}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>Cash-on-Cash Return</TableCell>
                      {activeOptions.map((option: any) => (
                        <TableCell key={option.id} className="text-right">
                          {formatPercentage(option.cashOnCashReturn)}
                        </TableCell>
                      ))}
                    </TableRow>

                    {/* Risk Metrics section */}
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={activeOptions.length + 1} className="font-semibold">
                        Risk Analysis
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Loan-to-Value (LTV)</TableCell>
                      {activeOptions.map((option: any) => (
                        <TableCell key={option.id} className="text-right">
                          {formatPercentage(option.loanToValue)}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>Debt Service Coverage Ratio</TableCell>
                      {activeOptions.map((option: any) => (
                        <TableCell key={option.id} className="text-right">
                          <span className={option.debtServiceCoverageRatio <1.2 ? 'text-red-500' : 'text-green-500'}>
                            {option.debtServiceCoverageRatio.toFixed(2)}
                          </span>
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>Debt Yield</TableCell>
                      {activeOptions.map((option: any) => (
                        <TableCell key={option.id} className="text-right">
                          {formatPercentage(option.debtYield)}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>Break-Even Occupancy</TableCell>
                      {activeOptions.map((option: any) => (
                        <TableCell key={option.id} className="text-right">
                          {formatPercentage(option.breakEvenOccupancy)}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Option Details Tab */}
          <TabsContent value="detail" className="space-y-6">
            {/* Option Selection */}
            <div className="flex justify-between items-center">
              <Select 
                value={activeOptionId} 
                onValueChange={setActiveOptionId}
              >
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select financing option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Financing Options</SelectLabel>
                    {activeProject.options.map((option: any) => (
                      <SelectItem key={option.id} value={option.id}>
                        <div className="flex items-center">
                          <span 
                            className="h-2 w-2 rounded-full mr-2"
                            style={ backgroundColor: getOptionColor(option.id) }
                          ></span>
                          {option.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4 mr-1.5" />
                  Save
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash className="h-4 w-4 mr-1.5" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the financing option.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* Option Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Loan Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Loan Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Loan Amount</Label>
                        <div className="text-xl font-semibold">
                          {formatCurrency(activeOption.loanAmount)}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Interest Rate</Label>
                        <div className="text-xl font-semibold">
                          {activeOption.interestRate.toFixed(2)}%
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Term (Years)</Label>
                        <div className="text-xl font-semibold">
                          {activeOption.termYears}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Monthly Payment</Label>
                        <div className="text-xl font-semibold">
                          {formatCurrency(activeOption.monthlyPayment)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Total Interest</Label>
                        <div className="text-xl font-semibold">
                          {formatCurrency(activeOption.totalInterest)}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Total Payment</Label>
                        <div className="text-xl font-semibold">
                          {formatCurrency(activeOption.totalPayment)}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="text-sm font-medium pb-2">Payment Breakdown</div>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Principal', value: activeOption.loanAmount },
                                { name: 'Interest', value: activeOption.totalInterest }]}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              <Cell key="cell-principal" fill="#0088FE" />
                              <Cell key="cell-interest" fill="#FF8042" />
                            </Pie>
                            <RechartsTooltip formatter={(value: any) => [formatCurrency(value as number), '']} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Investment Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Investment Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Label className="text-sm text-muted-foreground">ROI</Label>
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <Info className="h-3.5 w-3.5 text-muted-foreground ml-1 cursor-help" />
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                              <div className="space-y-1">
                                <h4 className="text-sm font-semibold">Return on Investment</h4>
                                <p className="text-sm">
                                  The annual return (cash flow + appreciation) as a percentage of your equity investment.
                                </p>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </div>
                        <div className="text-2xl font-semibold">
                          {formatPercentage(activeOption.roi)}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Label className="text-sm text-muted-foreground">IRR</Label>
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <Info className="h-3.5 w-3.5 text-muted-foreground ml-1 cursor-help" />
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                              <div className="space-y-1">
                                <h4 className="text-sm font-semibold">Internal Rate of Return</h4>
                                <p className="text-sm">
                                  A metric that accounts for the time value of money, showing the annualized return over the investment period.
                                </p>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </div>
                        <div className="text-2xl font-semibold">
                          {formatPercentage(activeOption.irr)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-sm text-muted-foreground">Equity Required</Label>
                        <div className="text-2xl font-semibold">
                          {formatCurrency(activeOption.equityRequired)}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm text-muted-foreground">Cash-on-Cash Return</Label>
                        <div className="text-2xl font-semibold">
                          {formatPercentage(activeOption.cashOnCashReturn)}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="text-sm font-medium pb-2">Return Breakdown</div>
                      <div className="h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { 
                                name: 'ROI Components', 
                                cashFlow: activeOption.cashOnCashReturn,
                                appreciation: activeOption.roi - activeOption.cashOnCashReturn
                              }]}
                            layout="vertical"
                            margin={ top: 20, right: 30, left: 20, bottom: 5 }
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" tickFormatter={(value: any) => `${value}%`} />
                            <YAxis type="category" dataKey="name" tick={false} />
                            <RechartsTooltip formatter={(value: any) => [`${value.toFixed(2)}%`, '']} />
                            <Legend />
                            <Bar dataKey="cashFlow" stackId="a" name="Cash Flow Return" fill="#0088FE" />
                            <Bar dataKey="appreciation" stackId="a" name="Appreciation Return" fill="#00C49F" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Risk Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Risk Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Label className="text-sm text-muted-foreground">Loan-to-Value (LTV)</Label>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground ml-1 cursor-help" />
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold">Loan-to-Value Ratio</h4>
                            <p className="text-sm">
                              The ratio of the loan amount to the property value. Lower LTV indicates less financing risk.
                            </p>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                    <div className="text-2xl font-semibold">
                      {formatPercentage(activeOption.loanToValue)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {activeOption.loanToValue> 80 
                        ? "High leverage (higher risk)"
                        : activeOption.loanToValue> 70
                        ? "Moderate leverage"
                        : "Conservative leverage (lower risk)"
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Label className="text-sm text-muted-foreground">Debt Service Coverage Ratio</Label>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground ml-1 cursor-help" />
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold">Debt Service Coverage Ratio</h4>
                            <p className="text-sm">
                              The ratio of net operating income to debt service. A ratio above 1.25 is generally considered healthy.
                            </p>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                    <div className={cn(
                      "text-2xl font-semibold",
                      activeOption.debtServiceCoverageRatio <1.2 ? "text-red-500" : "text-green-500"
                    )}>
                      {activeOption.debtServiceCoverageRatio.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {activeOption.debtServiceCoverageRatio <1.0
                        ? "Negative cash flow (high risk)"
                        : activeOption.debtServiceCoverageRatio <1.2
                        ? "Thin coverage (moderate risk)"
                        : "Good coverage (lower risk)"
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Label className="text-sm text-muted-foreground">Debt Yield</Label>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground ml-1 cursor-help" />
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold">Debt Yield</h4>
                            <p className="text-sm">
                              The ratio of net operating income to the loan amount. Higher yields generally indicate lower risk.
                            </p>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                    <div className="text-2xl font-semibold">
                      {formatPercentage(activeOption.debtYield)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {activeOption.debtYield <5
                        ? "Low yield (higher risk)"
                        : activeOption.debtYield <7
                        ? "Moderate yield"
                        : "High yield (lower risk)"
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Label className="text-sm text-muted-foreground">Break-Even Occupancy</Label>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground ml-1 cursor-help" />
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold">Break-Even Occupancy</h4>
                            <p className="text-sm">
                              The occupancy rate required to cover all operating expenses and debt service. Lower is better.
                            </p>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                    <div className="text-2xl font-semibold">
                      {formatPercentage(activeOption.breakEvenOccupancy)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {activeOption.breakEvenOccupancy> 85
                        ? "High break-even (higher risk)"
                        : activeOption.breakEvenOccupancy> 75
                        ? "Moderate break-even"
                        : "Low break-even (lower risk)"
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Amortization Tab */}
          <TabsContent value="amortization" className="space-y-6">
            {/* Option Selection */}
            <div className="flex justify-between items-center">
              <Select 
                value={activeOptionId} 
                onValueChange={setActiveOptionId}
              >
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select financing option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Financing Options</SelectLabel>
                    {activeProject.options.map((option: any) => (
                      <SelectItem key={option.id} value={option.id}>
                        <div className="flex items-center">
                          <span 
                            className="h-2 w-2 rounded-full mr-2"
                            style={ backgroundColor: getOptionColor(option.id) }
                          ></span>
                          {option.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1.5" />
                Export Schedule
              </Button>
            </div>

            {/* Amortization Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Principal vs Interest */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Principal vs Interest Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={activeOption.amortization.filter(year => 
                          year.year <= 5 || 
                          year.year % 5 === 0 || 
                          year.year === activeOption.termYears
                        )}
                        margin={ top: 20, right: 30, left: 20, bottom: 5 }
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" label={ value: 'Year', position: 'insideBottom', offset: -5 } />
                        <YAxis tickFormatter={(value: any) => `$${(value / 1000).toFixed(0)}k`} />
                        <RechartsTooltip formatter={(value: any) => [formatCurrency(value as number), '']} />
                        <Legend />
                        <Bar dataKey="principal" stackId="a" name="Principal" fill="#0088FE" />
                        <Bar dataKey="interest" stackId="a" name="Interest" fill="#FF8042" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Loan Balance */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Loan Balance Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={activeOption.amortization}
                        margin={ top: 20, right: 30, left: 20, bottom: 5 }
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" label={ value: 'Year', position: 'insideBottom', offset: -5 } />
                        <YAxis tickFormatter={(value: any) => `$${(value / 1000000).toFixed(1)}M`} />
                        <RechartsTooltip formatter={(value: any) => [formatCurrency(value as number), '']} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="balance" 
                          name="Loan Balance" 
                          stroke="#8884d8"
                          strokeWidth={2}
                          dot={ r: 3 }
                          activeDot={ r: 8 }
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Amortization Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Amortization Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Year</TableHead>
                        <TableHead className="text-right">Principal</TableHead>
                        <TableHead className="text-right">Interest</TableHead>
                        <TableHead className="text-right">Total Payment</TableHead>
                        <TableHead className="text-right">Remaining Balance</TableHead>
                        <TableHead className="text-right">Equity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeOption.amortization.map((year: any) => (
                        <TableRow key={year.year}>
                          <TableCell>{year.year}</TableCell>
                          <TableCell className="text-right">{formatCurrency(year.principal)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(year.interest)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(year.principal + year.interest)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(year.balance)}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(customParams.propertyValue * Math.pow(1 + customParams.appreciation / 100, year.year) - year.balance)}
                          </TableCell>
                        </TableRow>
                      ))}

                      {/* Total row */}
                      <TableRow className="font-bold border-t-2">
                        <TableCell>Total</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(activeOption.loanAmount)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(activeOption.totalInterest)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(activeOption.totalPayment)}
                        </TableCell>
                        <TableCell className="text-right">
                          $0
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(customParams.propertyValue * Math.pow(1 + customParams.appreciation / 100, activeOption.termYears))}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  <Badge variant="outline" className="mr-2">Note</Badge>
                  Property value is projected to grow at {customParams.appreciation}% annually, affecting the equity calculation.
                  The final property value is estimated at {formatCurrency(customParams.propertyValue * Math.pow(1 + customParams.appreciation / 100, activeOption.termYears))}.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* New Financing Option Dialog */}
      <Dialog open={newOptionDialogOpen} onOpenChange={setNewOptionDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create New Financing Option</DialogTitle>
            <DialogDescription>
              Define parameters for your new financing option.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Option Name
              </Label>
              <Input
                id="name"
                value={newOption.name}
                onChange={(e: any) => setNewOption({ ...newOption, name: e.target.value })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="loanAmount" className="text-right">
                Loan Amount
              </Label>
              <div className="col-span-3 relative">
                <span className="absolute left-2.5 top-2.5 text-muted-foreground">$</span>
                <Input
                  id="loanAmount"
                  type="number"
                  value={newOption.loanAmount}
                  onChange={(e: any) => setNewOption({ 
                    ...newOption, 
                    loanAmount: parseInt(e.target.value) || 0
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
                step="0.05"
                value={newOption.interestRate}
                onChange={(e: any) => setNewOption({ 
                  ...newOption, 
                  interestRate: parseFloat(e.target.value) || 0
                })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="termYears" className="text-right">
                Term (Years)
              </Label>
              <Input
                id="termYears"
                type="number"
                value={newOption.termYears}
                onChange={(e: any) => setNewOption({ 
                  ...newOption, 
                  termYears: parseInt(e.target.value) || 0
                })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-4 text-sm text-muted-foreground">
                <HelpCircle className="h-4 w-4 inline mr-1" />
                The calculator will automatically determine monthly payments, total interest,
                and projected returns based on the property details and loan parameters.
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setNewOptionDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleAddOption}>
              Create Option
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CardFooter className="border-t p-4">
        <div className="flex flex-col xs:flex-row justify-between w-full text-sm text-muted-foreground gap-2">
          <div className="flex items-center">
            <Calculator className="h-4 w-4 mr-2" />
            <span>Calculations based on current market rates and conditions</span>
          </div>
          <div>
            Last updated: April 30, 2023
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}