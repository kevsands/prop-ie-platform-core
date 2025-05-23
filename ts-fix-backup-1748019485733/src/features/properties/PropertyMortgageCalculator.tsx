'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  CurrencyEuroIcon,
  CalculatorIcon,
  BanknotesIcon,
  ChartBarIcon,
  InformationCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PropertyMortgageCalculatorProps {
  propertyPrice: number;
}

interface MortgageCalculation {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  affordabilityRatio: number;
  loanToValue: number;
  effectiveRate: number;
}

interface AmortizationEntry {
  month: number;
  principal: number;
  interest: number;
  balance: number;
  cumulativeInterest: number;
}

export default function PropertyMortgageCalculator({ propertyPrice }: PropertyMortgageCalculatorProps) {
  const [depositsetDeposit] = useState(propertyPrice * 0.1); // 10% default
  const [loanAmountsetLoanAmount] = useState(propertyPrice - deposit);
  const [interestRatesetInterestRate] = useState(4.5);
  const [loanTermsetLoanTerm] = useState(30);
  const [monthlyIncomesetMonthlyIncome] = useState(5000);
  const [monthlyExpensessetMonthlyExpenses] = useState(1500);
  const [propertyTaxsetPropertyTax] = useState(200);
  const [homeInsurancesetHomeInsurance] = useState(100);
  const [isFirstTimeBuyersetIsFirstTimeBuyer] = useState(true);
  const [showAmortizationsetShowAmortization] = useState(false);

  // Calculate mortgage details
  const calculation = useMemo((): MortgageCalculation => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    // Monthly payment calculation (P&I)
    const monthlyPayment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRatenumberOfPayments)) / 
      (Math.pow(1 + monthlyRatenumberOfPayments) - 1);

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    // Total monthly housing cost (PITI)
    const totalMonthlyPayment = monthlyPayment + propertyTax + homeInsurance;

    // Affordability calculation
    const availableIncome = monthlyIncome - monthlyExpenses;
    const affordabilityRatio = (totalMonthlyPayment / availableIncome) * 100;

    // Loan to value ratio
    const loanToValue = (loanAmount / propertyPrice) * 100;

    // Effective annual rate
    const effectiveRate = (Math.pow(1 + monthlyRate12) - 1) * 100;

    return {
      monthlyPayment: totalMonthlyPayment,
      totalInterest,
      totalPayment,
      affordabilityRatio,
      loanToValue,
      effectiveRate
    };
  }, [loanAmount, interestRate, loanTerm, propertyTax, homeInsurance, monthlyIncome, monthlyExpensespropertyPrice]);

  // Generate amortization schedule
  const amortizationSchedule = useMemo((): AmortizationEntry[] => {
    const schedule: AmortizationEntry[] = [];
    let balance = loanAmount;
    let cumulativeInterest = 0;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    const monthlyPayment = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRatenumberOfPayments)) / 
      (Math.pow(1 + monthlyRatenumberOfPayments) - 1);

    for (let month = 1; month <= Math.min(numberOfPayments60); month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
      cumulativeInterest += interestPayment;

      schedule.push({
        month,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0balance),
        cumulativeInterest
      });
    }

    return schedule;
  }, [loanAmount, interestRateloanTerm]);

  const handleDepositChange = (value: number[]) => {
    const newDeposit = value[0];
    setDeposit(newDeposit);
    setLoanAmount(propertyPrice - newDeposit);
  };

  const getAffordabilityStatus = () => {
    if (calculation.affordabilityRatio <35) return { status: 'Comfortable', color: 'green' };
    if (calculation.affordabilityRatio <50) return { status: 'Manageable', color: 'yellow' };
    return { status: 'Stretched', color: 'red' };
  };

  const affordabilityStatus = getAffordabilityStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalculatorIcon className="h-5 w-5" />
          Mortgage Calculator
        </CardTitle>
        <CardDescription>
          Calculate your monthly payments and affordability
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="affordability">Affordability</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            {/* Deposit Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Deposit Amount</Label>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">€{deposit.toLocaleString()}</span>
                  <Badge variant="secondary">{Math.round((deposit / propertyPrice) * 100)}%</Badge>
                </div>
              </div>
              <Slider
                value={[deposit]}
                onValueChange={handleDepositChange}
                max={propertyPrice * 0.5}
                min={propertyPrice * 0.05}
                step={1000}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>5%</span>
                <span>50%</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Interest Rate</Label>
                <span className="text-2xl font-bold">{interestRate.toFixed(2)}%</span>
              </div>
              <Slider
                value={[interestRate]}
                onValueChange={(value) => setInterestRate(value[0])}
                max={8}
                min={2}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>2%</span>
                <span>8%</span>
              </div>
            </div>

            {/* Loan Term */}
            <div className="space-y-2">
              <Label>Loan Term</Label>
              <Select value={loanTerm.toString()} onValueChange={(value) => setLoanTerm(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 years</SelectItem>
                  <SelectItem value="20">20 years</SelectItem>
                  <SelectItem value="25">25 years</SelectItem>
                  <SelectItem value="30">30 years</SelectItem>
                  <SelectItem value="35">35 years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Additional Costs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Property Tax (Monthly)</Label>
                <Input
                  type="number"
                  value={propertyTax}
                  onChange={(e) => setPropertyTax(parseFloat(e.target.value) || 0)}
                  prefix="€"
                />
              </div>
              <div className="space-y-2">
                <Label>Home Insurance (Monthly)</Label>
                <Input
                  type="number"
                  value={homeInsurance}
                  onChange={(e) => setHomeInsurance(parseFloat(e.target.value) || 0)}
                  prefix="€"
                />
              </div>
            </div>

            {/* Results Summary */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Monthly Payment (PITI)</p>
                  <p className="text-2xl font-bold text-blue-900">
                    €{Math.round(calculation.monthlyPayment).toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Interest</p>
                  <p className="text-2xl font-bold text-green-900">
                    €{Math.round(calculation.totalInterest).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Loan Amount</span>
                  <span className="font-semibold">€{loanAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Payment</span>
                  <span className="font-semibold">€{Math.round(calculation.totalPayment).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Loan-to-Value (LTV)</span>
                  <Badge variant={calculation.loanToValue> 80 ? 'destructive' : 'secondary'}>
                    {calculation.loanToValue.toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Effective Annual Rate</span>
                  <span className="font-semibold">{calculation.effectiveRate.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="affordability" className="space-y-6">
            {/* Income and Expenses */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Monthly Income (After Tax)</Label>
                <Input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(parseFloat(e.target.value) || 0)}
                  prefix="€"
                />
              </div>
              <div className="space-y-2">
                <Label>Monthly Expenses</Label>
                <Input
                  type="number"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(parseFloat(e.target.value) || 0)}
                  prefix="€"
                />
              </div>
            </div>

            {/* First Time Buyer */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="firstTimeBuyer"
                checked={isFirstTimeBuyer}
                onChange={(e) => setIsFirstTimeBuyer(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="firstTimeBuyer">I'm a first-time buyer</Label>
              <HoverCard>
                <HoverCardTrigger>
                  <InformationCircleIcon className="h-4 w-4 text-gray-500" />
                </HoverCardTrigger>
                <HoverCardContent>
                  <p className="text-sm">First-time buyers may be eligible for reduced stamp duty and special mortgage rates.</p>
                </HoverCardContent>
              </HoverCard>
            </div>

            {/* Affordability Analysis */}
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Affordability Analysis</h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`p-4 rounded-lg ${
                  affordabilityStatus.color === 'green' ? 'bg-green-50' :
                  affordabilityStatus.color === 'yellow' ? 'bg-yellow-50' :
                  'bg-red-50'
                }`}>
                  <p className="text-sm text-gray-600 mb-1">Affordability Status</p>
                  <p className={`text-xl font-bold ${
                    affordabilityStatus.color === 'green' ? 'text-green-900' :
                    affordabilityStatus.color === 'yellow' ? 'text-yellow-900' :
                    'text-red-900'
                  }`}>
                    {affordabilityStatus.status}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Housing Cost Ratio</p>
                  <p className="text-xl font-bold text-gray-900">
                    {calculation.affordabilityRatio.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Available Income</span>
                    <span className="text-sm font-semibold">
                      €{(monthlyIncome - monthlyExpenses).toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        affordabilityStatus.color === 'green' ? 'bg-green-600' :
                        affordabilityStatus.color === 'yellow' ? 'bg-yellow-600' :
                        'bg-red-600'
                      }`}
                      style={ width: `${Math.min(calculation.affordabilityRatio100)}%` }
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-900 mb-2">
                    <strong>Recommendation:</strong>
                  </p>
                  {calculation.affordabilityRatio <35 && (
                    <p className="text-sm text-blue-800">
                      Your mortgage payment is well within your budget. You have room for additional savings or investments.
                    </p>
                  )}
                  {calculation.affordabilityRatio>= 35 && calculation.affordabilityRatio <50 && (
                    <p className="text-sm text-blue-800">
                      Your mortgage payment is manageable, but consider maintaining an emergency fund for unexpected expenses.
                    </p>
                  )}
                  {calculation.affordabilityRatio>= 50 && (
                    <p className="text-sm text-blue-800">
                      Your mortgage payment may strain your budget. Consider a larger deposit or a longer loan term to reduce monthly payments.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Amortization Schedule</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAmortization(!showAmortization)}
              >
                {showAmortization ? 'Hide' : 'Show'} Details
              </Button>
            </div>

            {/* Payment Breakdown Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={amortizationSchedule.filter((_index) => index % 3 === 0)}
                  margin={ top: 5, right: 30, left: 20, bottom: 5 }
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" label={ value: 'Month', position: 'insideBottom', offset: -5 } />
                  <YAxis label={ value: 'Amount (€)', angle: -90, position: 'insideLeft' } />
                  <Tooltip formatter={(value) => `€${Math.round(value).toLocaleString()}`} />
                  <Legend />
                  <Line type="monotone" dataKey="principal" stroke="#3B82F6" strokeWidth={2} name="Principal" />
                  <Line type="monotone" dataKey="interest" stroke="#EF4444" strokeWidth={2} name="Interest" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Detailed Schedule Table */}
            {showAmortization && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Month</th>
                      <th className="text-right py-2">Principal</th>
                      <th className="text-right py-2">Interest</th>
                      <th className="text-right py-2">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {amortizationSchedule.slice(012).map((entry) => (
                      <tr key={entry.month} className="border-b">
                        <td className="py-2">{entry.month}</td>
                        <td className="text-right py-2">€{Math.round(entry.principal).toLocaleString()}</td>
                        <td className="text-right py-2">€{Math.round(entry.interest).toLocaleString()}</td>
                        <td className="text-right py-2">€{Math.round(entry.balance).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-600">First Year Interest</p>
                <p className="text-lg font-semibold">
                  €{Math.round(amortizationSchedule[11]?.cumulativeInterest || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">First Year Principal</p>
                <p className="text-lg font-semibold">
                  €{Math.round(loanAmount - (amortizationSchedule[11]?.balance || 0)).toLocaleString()}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}