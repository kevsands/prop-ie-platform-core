'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/useToast';
import {
  Calculator,
  Euro,
  Home,
  TrendingUp,
  TrendingDown,
  Info,
  HelpCircle,
  Download,
  Share2,
  Save,
  PiggyBank,
  Banknote,
  Receipt,
  BarChart3,
  LineChart,
  Calendar,
  FileText,
  Shield,
  AlertCircle,
  CheckCircle2,
  Building,
  Users,
  Briefcase,
  Car,
  Baby,
  GraduationCap
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface MortgageCalculatorProps {
  propertyPrice?: number;
  propertyId?: string;
  onCalculate?: (results: MortgageResults) => void;
}

interface MortgageResults {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  loanAmount: number;
  deposit: number;
  affordabilityScore: number;
  maxBorrowingCapacity: number;
  stressTestResult: boolean;
  timeline: PaymentSchedule[];
}

interface PaymentSchedule {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

interface AffordabilityFactors {
  income: number;
  partnerIncome: number;
  otherIncome: number;
  monthlyExpenses: number;
  existingLoans: number;
  creditCardDebt: number;
  dependents: number;
  savingsGoal: number;
}

const lenderProfiles = [
  { id: 'aib', name: 'AIB', rates: { variable: 3.15, fixed1: 2.95, fixed3: 3.25, fixed5: 3.45 } },
  { id: 'boi', name: 'Bank of Ireland', rates: { variable: 3.25, fixed1: 3.05, fixed3: 3.35, fixed5: 3.55 } },
  { id: 'ptsb', name: 'PTSB', rates: { variable: 3.35, fixed1: 3.15, fixed3: 3.45, fixed5: 3.65 } },
  { id: 'ulster', name: 'Ulster Bank', rates: { variable: 3.20, fixed1: 3.00, fixed3: 3.30, fixed5: 3.50 } },
  { id: 'avant', name: 'Avant Money', rates: { variable: 2.95, fixed1: 2.75, fixed3: 3.05, fixed5: 3.25 } }
];

const firstTimeBuyerSchemes = [
  {
    id: 'htb',
    name: 'Help to Buy',
    description: 'Tax rebate for first-time buyers',
    maxAmount: 30000,
    conditions: ['First-time buyer', 'New build property', 'Property value ≤ €500,000']
  },
  {
    id: 'fhbs',
    name: 'First Home Scheme',
    description: 'Shared equity scheme',
    maxEquity: 30,
    conditions: ['First-time buyer', 'New build property', 'Income limits apply']
  },
  {
    id: 'local-authority',
    name: 'Local Authority Loan',
    description: 'Lower interest rates for eligible buyers',
    maxLoan: 320000,
    conditions: ['Income limits apply', 'Must be refused by two banks']
  }
];

export default function MortgageCalculator({
  propertyPrice = 350000,
  propertyId,
  onCalculate
}: MortgageCalculatorProps) {
  const { toast } = useToast();
  const [activeTabsetActiveTab] = useState('calculator');

  // Mortgage parameters
  const [purchasePricesetPurchasePrice] = useState(propertyPrice);
  const [depositsetDeposit] = useState(propertyPrice * 0.1);
  const [loanTermsetLoanTerm] = useState(30);
  const [interestRatesetInterestRate] = useState(3.5);
  const [rateTypesetRateType] = useState<'variable' | 'fixed'>('variable');
  const [fixedPeriodsetFixedPeriod] = useState(3);
  const [selectedLendersetSelectedLender] = useState('aib');

  // Affordability parameters
  const [affordabilityFactorssetAffordabilityFactors] = useState<AffordabilityFactors>({
    income: 50000,
    partnerIncome: 0,
    otherIncome: 0,
    monthlyExpenses: 1500,
    existingLoans: 0,
    creditCardDebt: 0,
    dependents: 0,
    savingsGoal: 500
  });

  // First-time buyer options
  const [isFirstTimeBuyersetIsFirstTimeBuyer] = useState(true);
  const [selectedSchemessetSelectedSchemes] = useState<string[]>(['htb']);

  // Additional costs
  const [includeCostssetIncludeCosts] = useState(true);
  const [stampDutysetStampDuty] = useState(0);
  const [legalFeessetLegalFees] = useState(2500);
  const [surveyFeessetSurveyFees] = useState(500);
  const [otherFeessetOtherFees] = useState(1000);

  // Calculate mortgage details
  const mortgageResults = useMemo(() => {
    const loanAmount = purchasePrice - deposit;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;

    // Monthly payment calculation
    const monthlyPayment = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRatenumPayments)) /
      (Math.pow(1 + monthlyRatenumPayments) - 1);

    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - loanAmount;

    // Generate payment schedule
    const timeline: PaymentSchedule[] = [];
    let remainingBalance = loanAmount;

    for (let month = 1; month <= numPayments; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;

      timeline.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0remainingBalance)
      });
    }

    // Affordability calculation
    const totalIncome = affordabilityFactors.income + 
      affordabilityFactors.partnerIncome + 
      affordabilityFactors.otherIncome;

    const monthlyIncome = totalIncome / 12;
    const monthlyDebts = affordabilityFactors.existingLoans + 
      (affordabilityFactors.creditCardDebt / 12);

    const availableIncome = monthlyIncome - 
      affordabilityFactors.monthlyExpenses - 
      monthlyDebts - 
      affordabilityFactors.savingsGoal;

    const affordabilityRatio = monthlyPayment / availableIncome;
    const affordabilityScore = Math.max(0, Math.min(100, (1 - affordabilityRatio) * 100));

    // Max borrowing capacity (typically 3.5x income in Ireland)
    const maxBorrowingCapacity = totalIncome * 3.5;

    // Stress test (typically 2% increase)
    const stressRate = interestRate + 2;
    const stressMonthlyRate = stressRate / 100 / 12;
    const stressPayment = loanAmount * 
      (stressMonthlyRate * Math.pow(1 + stressMonthlyRatenumPayments)) /
      (Math.pow(1 + stressMonthlyRatenumPayments) - 1);

    const stressTestResult = stressPayment <= availableIncome;

    return {
      monthlyPayment,
      totalPayment,
      totalInterest,
      loanAmount,
      deposit,
      affordabilityScore,
      maxBorrowingCapacity,
      stressTestResult,
      timeline
    };
  }, [purchasePrice, deposit, loanTerm, interestRateaffordabilityFactors]);

  // Calculate stamp duty
  useEffect(() => {
    if (purchasePrice <= 1000000) {
      setStampDuty(purchasePrice * 0.01);
    } else {
      setStampDuty(10000 + (purchasePrice - 1000000) * 0.02);
    }
  }, [purchasePrice]);

  // Handle calculation
  const handleCalculate = () => {
    onCalculate?.(mortgageResults);
    toast({
      title: 'Calculation Complete',
      description: `Monthly payment: €${mortgageResults.monthlyPayment.toFixed(2)}`
    });
  };

  // Save calculation
  const handleSaveCalculation = async () => {
    try {
      const response = await fetch('/api/mortgage-calculations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          purchasePrice,
          deposit,
          loanTerm,
          interestRate,
          results: mortgageResults
        })
      });

      if (response.ok) {
        toast({
          title: 'Calculation Saved',
          description: 'Your mortgage calculation has been saved'
        });
      }
    } catch (error) {
      toast({
        title: 'Save Failed',
        description: 'Failed to save calculation',
        variant: 'destructive'
      });
    }
  };

  // Export calculation
  const handleExport = () => {
    const data = {
      property: { price: purchasePrice },
      mortgage: {
        deposit,
        loanAmount: mortgageResults.loanAmount,
        term: loanTerm,
        rate: interestRate,
        monthlyPayment: mortgageResults.monthlyPayment,
        totalPayment: mortgageResults.totalPayment,
        totalInterest: mortgageResults.totalInterest
      },
      affordability: {
        score: mortgageResults.affordabilityScore,
        maxBorrowing: mortgageResults.maxBorrowingCapacity,
        stressTest: mortgageResults.stressTestResult
      }
    };

    const blob = new Blob([JSON.stringify(data, null2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mortgage-calculation.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-6 w-6" />
            <span>Mortgage Calculator</span>
          </CardTitle>
          <CardDescription>
            Calculate your mortgage payments and affordability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="calculator">Calculator</TabsTrigger>
              <TabsTrigger value="affordability">Affordability</TabsTrigger>
              <TabsTrigger value="schemes">Schemes</TabsTrigger>
              <TabsTrigger value="comparison">Compare</TabsTrigger>
            </TabsList>

            {/* Main Calculator */}
            <TabsContent value="calculator" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Purchase Price</Label>
                    <div className="flex items-center space-x-2">
                      <Euro className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={purchasePrice}
                        onChange={(e: any) => setPurchasePrice(Number(e.target.value))}
                        className="flex-1"
                      />
                    </div>
                    <Slider
                      value={[purchasePrice]}
                      onValueChange={([value]) => setPurchasePrice(value)}
                      min={100000}
                      max={1000000}
                      step={5000}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Deposit Amount ({((deposit / purchasePrice) * 100).toFixed(0)}%)</Label>
                    <div className="flex items-center space-x-2">
                      <Euro className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={deposit}
                        onChange={(e: any) => setDeposit(Number(e.target.value))}
                        className="flex-1"
                      />
                    </div>
                    <Slider
                      value={[deposit]}
                      onValueChange={([value]) => setDeposit(value)}
                      min={purchasePrice * 0.1}
                      max={purchasePrice * 0.5}
                      step={1000}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Loan Term (Years)</Label>
                    <Select value={loanTerm.toString()} onValueChange={(value: any) => setLoanTerm(Number(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[15, 20, 25, 3035].map((years: any) => (
                          <SelectItem key={years} value={years.toString()}>
                            {years} years
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Interest Rate Type</Label>
                    <RadioGroup value={rateType} onValueChange={setRateType}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="variable" id="variable" />
                        <Label htmlFor="variable" className="cursor-pointer">
                          Variable Rate
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fixed" id="fixed" />
                        <Label htmlFor="fixed" className="cursor-pointer">
                          Fixed Rate
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {rateType === 'fixed' && (
                    <div>
                      <Label>Fixed Period</Label>
                      <Select value={fixedPeriod.toString()} onValueChange={(value: any) => setFixedPeriod(Number(value))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 year</SelectItem>
                          <SelectItem value="3">3 years</SelectItem>
                          <SelectItem value="5">5 years</SelectItem>
                          <SelectItem value="7">7 years</SelectItem>
                          <SelectItem value="10">10 years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label>Interest Rate (%)</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={interestRate}
                        onChange={(e: any) => setInterestRate(Number(e.target.value))}
                        step="0.1"
                        min="0"
                        max="10"
                      />
                      <span className="text-muted-foreground">%</span>
                    </div>
                    <Slider
                      value={[interestRate]}
                      onValueChange={([value]) => setInterestRate(value)}
                      min={1}
                      max={7}
                      step={0.05}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Results Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Payment Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Loan Amount</span>
                        <span className="font-semibold">
                          €{mortgageResults.loanAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg">
                        <span className="text-muted-foreground">Monthly Payment</span>
                        <span className="font-bold text-primary">
                          €{mortgageResults.monthlyPayment.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Payment</span>
                        <span className="font-semibold">
                          €{mortgageResults.totalPayment.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Interest</span>
                        <span className="font-semibold">
                          €{mortgageResults.totalInterest.toLocaleString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Additional Costs */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>Additional Costs</span>
                        <Switch
                          checked={includeCosts}
                          onCheckedChange={setIncludeCosts}
                        />
                      </CardTitle>
                    </CardHeader>
                    {includeCosts && (
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Stamp Duty</span>
                          <span>€{stampDuty.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Legal Fees</span>
                          <Input
                            type="number"
                            value={legalFees}
                            onChange={(e: any) => setLegalFees(Number(e.target.value))}
                            className="w-24 text-right"
                          />
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Survey Fees</span>
                          <Input
                            type="number"
                            value={surveyFees}
                            onChange={(e: any) => setSurveyFees(Number(e.target.value))}
                            className="w-24 text-right"
                          />
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Other Fees</span>
                          <Input
                            type="number"
                            value={otherFees}
                            onChange={(e: any) => setOtherFees(Number(e.target.value))}
                            className="w-24 text-right"
                          />
                        </div>
                        <div className="border-t pt-3 flex justify-between font-semibold">
                          <span>Total Additional</span>
                          <span>
                            €{(stampDuty + legalFees + surveyFees + otherFees).toLocaleString()}
                          </span>
                        </div>
                      </CardContent>
                    )}
                  </Card>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={handleCalculate} className="flex-1">
                      <Calculator className="h-4 w-4 mr-2" />
                      Calculate
                    </Button>
                    <Button variant="outline" onClick={handleSaveCalculation}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={handleExport}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>

              {/* Payment Schedule Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Breakdown Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Line
                      data={
                        labels: mortgageResults.timeline
                          .filter((_index: any) => index % 12 === 0)
                          .map((item: any) => `Year ${item.month / 12}`),
                        datasets: [
                          {
                            label: 'Principal',
                            data: mortgageResults.timeline
                              .filter((_index: any) => index % 12 === 0)
                              .map((item: any) => item.principal * 12),
                            borderColor: 'rgb(59, 130246)',
                            backgroundColor: 'rgba(59, 130, 246, 0.5)'},
                          {
                            label: 'Interest',
                            data: mortgageResults.timeline
                              .filter((_index: any) => index % 12 === 0)
                              .map((item: any) => item.interest * 12),
                            borderColor: 'rgb(239, 6868)',
                            backgroundColor: 'rgba(239, 68, 68, 0.5)'}
                        ]
                      }
                      options={
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top'},
                          title: {
                            display: false
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              callback: (value: any) => `€${value.toLocaleString()}`
                            }
                          }
                        }
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Affordability Assessment */}
            <TabsContent value="affordability" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Income Details</h3>

                  <div>
                    <Label>Your Annual Income</Label>
                    <div className="flex items-center space-x-2">
                      <Euro className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={affordabilityFactors.income}
                        onChange={(e: any) => setAffordabilityFactors({
                          ...affordabilityFactors,
                          income: Number(e.target.value)
                        })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Partner's Annual Income</Label>
                    <div className="flex items-center space-x-2">
                      <Euro className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={affordabilityFactors.partnerIncome}
                        onChange={(e: any) => setAffordabilityFactors({
                          ...affordabilityFactors,
                          partnerIncome: Number(e.target.value)
                        })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Other Income (Annual)</Label>
                    <div className="flex items-center space-x-2">
                      <Euro className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={affordabilityFactors.otherIncome}
                        onChange={(e: any) => setAffordabilityFactors({
                          ...affordabilityFactors,
                          otherIncome: Number(e.target.value)
                        })}
                      />
                    </div>
                  </div>

                  <h3 className="font-semibold pt-4">Monthly Expenses</h3>

                  <div>
                    <Label>Living Expenses</Label>
                    <div className="flex items-center space-x-2">
                      <Euro className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={affordabilityFactors.monthlyExpenses}
                        onChange={(e: any) => setAffordabilityFactors({
                          ...affordabilityFactors,
                          monthlyExpenses: Number(e.target.value)
                        })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Existing Loan Payments</Label>
                    <div className="flex items-center space-x-2">
                      <Euro className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={affordabilityFactors.existingLoans}
                        onChange={(e: any) => setAffordabilityFactors({
                          ...affordabilityFactors,
                          existingLoans: Number(e.target.value)
                        })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Number of Dependents</Label>
                    <Select 
                      value={affordabilityFactors.dependents.toString()}
                      onValueChange={(value: any) => setAffordabilityFactors({
                        ...affordabilityFactors,
                        dependents: Number(value)
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3, 45].map((num: any) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'dependent' : 'dependents'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Affordability Score */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Affordability Assessment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span>Affordability Score</span>
                          <span className="font-semibold">
                            {mortgageResults.affordabilityScore.toFixed(0)}%
                          </span>
                        </div>
                        <Progress 
                          value={mortgageResults.affordabilityScore} 
                          className="h-3"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          {mortgageResults.affordabilityScore>= 70 
                            ? 'Excellent affordability'
                            : mortgageResults.affordabilityScore>= 50
                            ? 'Good affordability'
                            : mortgageResults.affordabilityScore>= 30
                            ? 'Moderate affordability'
                            : 'Poor affordability'}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Max Borrowing</span>
                          <span className="font-semibold">
                            €{mortgageResults.maxBorrowingCapacity.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Stress Test</span>
                          <Badge variant={mortgageResults.stressTestResult ? 'success' : 'destructive'}>
                            {mortgageResults.stressTestResult ? 'Pass' : 'Fail'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Monthly Budget Breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Monthly Budget</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px]">
                        <Doughnut
                          data={
                            labels: ['Mortgage', 'Living Expenses', 'Other Loans', 'Savings', 'Remaining'],
                            datasets: [{
                              data: [
                                mortgageResults.monthlyPayment,
                                affordabilityFactors.monthlyExpenses,
                                affordabilityFactors.existingLoans,
                                affordabilityFactors.savingsGoal,
                                Math.max(0, 
                                  (affordabilityFactors.income + 
                                   affordabilityFactors.partnerIncome + 
                                   affordabilityFactors.otherIncome) / 12 -
                                  mortgageResults.monthlyPayment -
                                  affordabilityFactors.monthlyExpenses -
                                  affordabilityFactors.existingLoans -
                                  affordabilityFactors.savingsGoal
                                )
                              ],
                              backgroundColor: [
                                'rgba(59, 130, 246, 0.8)',
                                'rgba(239, 68, 68, 0.8)',
                                'rgba(251, 191, 36, 0.8)',
                                'rgba(34, 197, 94, 0.8)',
                                'rgba(156, 163, 175, 0.8)'
                              ],
                              borderColor: [
                                'rgb(59, 130246)',
                                'rgb(239, 6868)',
                                'rgb(251, 19136)',
                                'rgb(34, 19794)',
                                'rgb(156, 163175)'
                              ],
                              borderWidth: 1
                            }]
                          }
                          options={
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'right'}
                            }
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Info className="h-5 w-5 mr-2" />
                        Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {mortgageResults.affordabilityScore <50 && (
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
                          <p className="text-sm">
                            Consider increasing your deposit to reduce monthly payments
                          </p>
                        </div>
                      )}
                      {mortgageResults.monthlyPayment> (affordabilityFactors.income + affordabilityFactors.partnerIncome) / 12 * 0.35 && (
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
                          <p className="text-sm">
                            Monthly payment exceeds 35% of income - this may be challenging
                          </p>
                        </div>
                      )}
                      {!mortgageResults.stressTestResult && (
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                          <p className="text-sm">
                            Failed stress test - consider a longer loan term or larger deposit
                          </p>
                        </div>
                      )}
                      {mortgageResults.affordabilityScore>= 70 && (
                        <div className="flex items-start space-x-2">
                          <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                          <p className="text-sm">
                            Excellent affordability - you're in a strong position
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* First-Time Buyer Schemes */}
            <TabsContent value="schemes" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={isFirstTimeBuyer}
                      onCheckedChange={setIsFirstTimeBuyer}
                    />
                    <Label>I am a first-time buyer</Label>
                  </div>

                  {isFirstTimeBuyer && (
                    <div className="space-y-4">
                      {firstTimeBuyerSchemes.map((scheme: any) => (
                        <Card key={scheme.id}>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center justify-between">
                              <span>{scheme.name}</span>
                              <Switch
                                checked={selectedSchemes.includes(scheme.id)}
                                onCheckedChange={(checked: any) => {
                                  if (checked) {
                                    setSelectedSchemes([...selectedSchemes, scheme.id]);
                                  } else {
                                    setSelectedSchemes(selectedSchemes.filter(s => s !== scheme.id));
                                  }
                                }
                              />
                            </CardTitle>
                            <CardDescription>{scheme.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {scheme.maxAmount && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Max Amount</span>
                                  <span>€{scheme.maxAmount.toLocaleString()}</span>
                                </div>
                              )}
                              {scheme.maxEquity && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Max Equity</span>
                                  <span>{scheme.maxEquity}%</span>
                                </div>
                              )}
                              {scheme.maxLoan && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Max Loan</span>
                                  <span>€{scheme.maxLoan.toLocaleString()}</span>
                                </div>
                              )}
                            </div>
                            <div className="mt-3 space-y-1">
                              {scheme.conditions.map((conditionindex: any) => (
                                <div key={index} className="flex items-start space-x-2">
                                  <CheckCircle2 className="h-3 w-3 text-muted-foreground mt-0.5" />
                                  <p className="text-sm text-muted-foreground">{condition}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Impact of Selected Schemes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedSchemes.length === 0 ? (
                        <p className="text-muted-foreground">
                          No schemes selected. Enable first-time buyer status and select schemes to see their impact.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {selectedSchemes.includes('htb') && (
                            <div>
                              <h4 className="font-medium mb-1">Help to Buy</h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span>Tax Rebate</span>
                                  <span>€{Math.min(30000, purchasePrice * 0.1).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>New Deposit</span>
                                  <span>€{(deposit + Math.min(30000, purchasePrice * 0.1)).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {selectedSchemes.includes('fhbs') && (
                            <div>
                              <h4 className="font-medium mb-1">First Home Scheme</h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span>Equity Share</span>
                                  <span>€{(purchasePrice * 0.3).toLocaleString()} (30%)</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Reduced Loan</span>
                                  <span>€{(purchasePrice * 0.7 - deposit).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Eligibility Checker</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span>First-time buyer</span>
                          <Badge variant={isFirstTimeBuyer ? 'success' : 'secondary'}>
                            {isFirstTimeBuyer ? 'Yes' : 'No'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Property value ≤ €500,000</span>
                          <Badge variant={purchasePrice <= 500000 ? 'success' : 'secondary'}>
                            {purchasePrice <= 500000 ? 'Yes' : 'No'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>New build property</span>
                          <Badge variant="secondary">Check property</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Income within limits</span>
                          <Badge variant="secondary">Check limits</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Lender Comparison */}
            <TabsContent value="comparison" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Compare Lenders</CardTitle>
                    <CardDescription>
                      Compare rates and monthly payments across different lenders
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-4">Lender</th>
                            <th className="text-center p-4">Variable Rate</th>
                            <th className="text-center p-4">1 Year Fixed</th>
                            <th className="text-center p-4">3 Year Fixed</th>
                            <th className="text-center p-4">5 Year Fixed</th>
                            <th className="text-center p-4">Monthly Payment</th>
                            <th className="text-center p-4">Total Cost</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lenderProfiles.map((lender: any) => {
                            const rate = rateType === 'variable' 
                              ? lender.rates.variable 
                              : lender.rates[`fixed${fixedPeriod}`];

                            const monthlyRate = rate / 100 / 12;
                            const numPayments = loanTerm * 12;
                            const loanAmount = purchasePrice - deposit;

                            const monthlyPayment = loanAmount * 
                              (monthlyRate * Math.pow(1 + monthlyRatenumPayments)) /
                              (Math.pow(1 + monthlyRatenumPayments) - 1);

                            const totalPayment = monthlyPayment * numPayments;

                            return (
                              <tr key={lender.id} className="border-b">
                                <td className="p-4 font-medium">{lender.name}</td>
                                <td className="text-center p-4">{lender.rates.variable}%</td>
                                <td className="text-center p-4">{lender.rates.fixed1}%</td>
                                <td className="text-center p-4">{lender.rates.fixed3}%</td>
                                <td className="text-center p-4">{lender.rates.fixed5}%</td>
                                <td className="text-center p-4 font-semibold">
                                  €{monthlyPayment.toFixed(2)}
                                </td>
                                <td className="text-center p-4">
                                  €{totalPayment.toLocaleString()}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Rate Comparison Chart</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <Bar
                          data={
                            labels: lenderProfiles.map(l => l.name),
                            datasets: [
                              {
                                label: 'Variable',
                                data: lenderProfiles.map(l => l.rates.variable),
                                backgroundColor: 'rgba(59, 130, 246, 0.8)'},
                              {
                                label: '3 Year Fixed',
                                data: lenderProfiles.map(l => l.rates.fixed3),
                                backgroundColor: 'rgba(34, 197, 94, 0.8)'},
                              {
                                label: '5 Year Fixed',
                                data: lenderProfiles.map(l => l.rates.fixed5),
                                backgroundColor: 'rgba(251, 191, 36, 0.8)'}
                            ]
                          }
                          options={
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'top'}
                            },
                            scales: {
                              y: {
                                beginAtZero: true,
                                ticks: {
                                  callback: (value: any) => `${value}%`
                                }
                              }
                            }
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Additional Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Cashback offers</span>
                          <Badge>Up to €2,000</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Overpayment allowed</span>
                          <Badge variant="success">Yes</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Payment holidays</span>
                          <Badge variant="success">Available</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Online application</span>
                          <Badge variant="success">Yes</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Approval time</span>
                          <Badge>3-5 days</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" size="sm">
              <Building className="h-4 w-4 mr-2" />
              Contact Lender
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Get Pre-Approval
            </Button>
            <Button variant="outline" size="sm">
              <Shield className="h-4 w-4 mr-2" />
              Insurance Quote
            </Button>
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Find Advisor
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Educational Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mortgage Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Guides</h4>
              <ul className="space-y-1 text-sm">
                <li>
                  <a href="#" className="text-primary hover:underline">
                    First-Time Buyer's Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline">
                    Understanding Interest Rates
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline">
                    Mortgage Application Process
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Tools</h4>
              <ul className="space-y-1 text-sm">
                <li>
                  <a href="#" className="text-primary hover:underline">
                    Stamp Duty Calculator
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline">
                    Budget Planner
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline">
                    Document Checklist
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Support</h4>
              <ul className="space-y-1 text-sm">
                <li>
                  <a href="#" className="text-primary hover:underline">
                    Schedule Consultation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline">
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}