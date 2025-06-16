'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Percent,
  ArrowRight,
  Info,
  Zap
} from 'lucide-react';

interface FinancialCalculatorProps {
  projectData?: any;
  context: string;
}

export function FinancialCalculator({ projectData, context }: FinancialCalculatorProps) {
  const [activeCalcsetActiveCalc] = useState('roi');
  
  // ROI Calculator State
  const [roiInputssetRoiInputs] = useState({
    initialInvestment: '',
    totalRevenue: '',
    totalCosts: ''
  });
  
  const [roiResultssetRoiResults] = useState({
    profit: 0,
    roi: 0,
    margin: 0
  });

  // NPV Calculator State
  const [npvInputssetNpvInputs] = useState({
    initialInvestment: '',
    discountRate: '8',
    cashFlows: ['', '', '', '', '']
  });
  
  const [npvResultssetNpvResults] = useState({
    npv: 0,
    irr: 0,
    paybackPeriod: 0
  });

  // Unit Economics Calculator State
  const [unitInputssetUnitInputs] = useState({
    unitPrice: '',
    unitCost: '',
    totalUnits: '',
    salesPeriod: '24'
  });
  
  const [unitResultssetUnitResults] = useState({
    grossProfit: 0,
    profitPerUnit: 0,
    monthlyRevenue: 0,
    breakEven: 0
  });

  // Calculate ROI in real-time
  useEffect(() => {
    const investment = parseFloat(roiInputs.initialInvestment) || 0;
    const revenue = parseFloat(roiInputs.totalRevenue) || 0;
    const costs = parseFloat(roiInputs.totalCosts) || 0;
    
    const profit = revenue - costs - investment;
    const roi = investment> 0 ? (profit / investment) * 100 : 0;
    const margin = revenue> 0 ? (profit / revenue) * 100 : 0;
    
    setRoiResults({ profit, roi, margin });
  }, [roiInputs]);

  // Calculate NPV
  useEffect(() => {
    const investment = parseFloat(npvInputs.initialInvestment) || 0;
    const rate = parseFloat(npvInputs.discountRate) / 100 || 0.08;
    const flows = npvInputs.cashFlows.map(cf => parseFloat(cf) || 0);
    
    let npv = -investment;
    flows.forEach((flowindex) => {
      npv += flow / Math.pow(1 + rate, index + 1);
    });
    
    // Simple IRR approximation (simplified for demo)
    const totalCashFlow = flows.reduce((sumflow) => sum + flow0);
    const avgAnnualReturn = totalCashFlow / flows.length;
    const irr = investment> 0 ? (avgAnnualReturn / investment) * 100 : 0;
    
    // Payback period
    let cumulativeCashFlow = -investment;
    let paybackPeriod = 0;
    for (let i = 0; i <flows.length; i++) {
      cumulativeCashFlow += flows[i];
      if (cumulativeCashFlow>= 0) {
        paybackPeriod = i + 1;
        break;
      }
    }
    
    setNpvResults({ npv, irr, paybackPeriod });
  }, [npvInputs]);

  // Calculate Unit Economics
  useEffect(() => {
    const price = parseFloat(unitInputs.unitPrice) || 0;
    const cost = parseFloat(unitInputs.unitCost) || 0;
    const units = parseFloat(unitInputs.totalUnits) || 0;
    const period = parseFloat(unitInputs.salesPeriod) || 24;
    
    const profitPerUnit = price - cost;
    const grossProfit = profitPerUnit * units;
    const monthlyRevenue = (price * units) / period;
    const breakEven = cost> 0 ? price / cost : 0;
    
    setUnitResults({ grossProfit, profitPerUnit, monthlyRevenue, breakEven });
  }, [unitInputs]);

  return (
    <div className="space-y-4">
      <Tabs value={activeCalc} onValueChange={setActiveCalc}>
        <TabsList className="grid grid-cols-3 text-xs">
          <TabsTrigger value="roi">ROI</TabsTrigger>
          <TabsTrigger value="npv">NPV</TabsTrigger>
          <TabsTrigger value="unit">Units</TabsTrigger>
        </TabsList>

        {/* ROI Calculator */}
        <TabsContent value="roi" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                ROI Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="roi-investment" className="text-xs">Initial Investment (€)</Label>
                <Input
                  id="roi-investment"
                  type="number"
                  value={roiInputs.initialInvestment}
                  onChange={(e) => setRoiInputs(prev => ({ ...prev, initialInvestment: e.target.value }))}
                  className="h-8"
                  placeholder="25000000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="roi-revenue" className="text-xs">Total Revenue (€)</Label>
                <Input
                  id="roi-revenue"
                  type="number"
                  value={roiInputs.totalRevenue}
                  onChange={(e) => setRoiInputs(prev => ({ ...prev, totalRevenue: e.target.value }))}
                  className="h-8"
                  placeholder="32500000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="roi-costs" className="text-xs">Additional Costs (€)</Label>
                <Input
                  id="roi-costs"
                  type="number"
                  value={roiInputs.totalCosts}
                  onChange={(e) => setRoiInputs(prev => ({ ...prev, totalCosts: e.target.value }))}
                  className="h-8"
                  placeholder="2000000"
                />
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-muted p-2 rounded">
                  <p className="text-xs text-muted-foreground">Profit</p>
                  <p className="font-semibold text-green-600">€{roiResults.profit.toLocaleString()}</p>
                </div>
                <div className="bg-muted p-2 rounded">
                  <p className="text-xs text-muted-foreground">ROI</p>
                  <p className="font-semibold">{roiResults.roi.toFixed(1)}%</p>
                </div>
                <div className="bg-muted p-2 rounded">
                  <p className="text-xs text-muted-foreground">Margin</p>
                  <p className="font-semibold">{roiResults.margin.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NPV Calculator */}
        <TabsContent value="npv" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                NPV Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="npv-investment" className="text-xs">Investment (€)</Label>
                  <Input
                    id="npv-investment"
                    type="number"
                    value={npvInputs.initialInvestment}
                    onChange={(e) => setNpvInputs(prev => ({ ...prev, initialInvestment: e.target.value }))}
                    className="h-8"
                    placeholder="25000000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="npv-rate" className="text-xs">Discount Rate (%)</Label>
                  <Input
                    id="npv-rate"
                    type="number"
                    value={npvInputs.discountRate}
                    onChange={(e) => setNpvInputs(prev => ({ ...prev, discountRate: e.target.value }))}
                    className="h-8"
                    placeholder="8"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">Cash Flows (€) - Years 1-5</Label>
                <div className="grid grid-cols-2 gap-1">
                  {npvInputs.cashFlows.map((flowindex) => (
                    <Input
                      key={index}
                      type="number"
                      value={flow}
                      onChange={(e) => {
                        const newFlows = [...npvInputs.cashFlows];
                        newFlows[index] = e.target.value;
                        setNpvInputs(prev => ({ ...prev, cashFlows: newFlows }));
                      }
                      className="h-8 text-xs"
                      placeholder={`Year ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">NPV:</span>
                  <span className={`font-semibold ${npvResults.npv> 0 ? 'text-green-600' : 'text-red-600'}`}>
                    €{npvResults.npv.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">IRR:</span>
                  <span className="font-semibold">{npvResults.irr.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Payback:</span>
                  <span className="font-semibold">{npvResults.paybackPeriod} years</span>
                </div>
              </div>
              
              {npvResults.npv> 0 && (
                <div className="bg-green-50 border border-green-200 p-2 rounded">
                  <p className="text-xs text-green-800 flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    Positive NPV - Investment recommended
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Unit Economics */}
        <TabsContent value="unit" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Unit Economics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="unit-price" className="text-xs">Unit Price (€)</Label>
                  <Input
                    id="unit-price"
                    type="number"
                    value={unitInputs.unitPrice}
                    onChange={(e) => setUnitInputs(prev => ({ ...prev, unitPrice: e.target.value }))}
                    className="h-8"
                    placeholder="385000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit-cost" className="text-xs">Unit Cost (€)</Label>
                  <Input
                    id="unit-cost"
                    type="number"
                    value={unitInputs.unitCost}
                    onChange={(e) => setUnitInputs(prev => ({ ...prev, unitCost: e.target.value }))}
                    className="h-8"
                    placeholder="295000"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="total-units" className="text-xs">Total Units</Label>
                  <Input
                    id="total-units"
                    type="number"
                    value={unitInputs.totalUnits}
                    onChange={(e) => setUnitInputs(prev => ({ ...prev, totalUnits: e.target.value }))}
                    className="h-8"
                    placeholder="50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sales-period" className="text-xs">Sales Period (months)</Label>
                  <Input
                    id="sales-period"
                    type="number"
                    value={unitInputs.salesPeriod}
                    onChange={(e) => setUnitInputs(prev => ({ ...prev, salesPeriod: e.target.value }))}
                    className="h-8"
                    placeholder="24"
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-muted p-2 rounded text-center">
                  <p className="text-xs text-muted-foreground">Profit/Unit</p>
                  <p className="font-semibold">€{unitResults.profitPerUnit.toLocaleString()}</p>
                </div>
                <div className="bg-muted p-2 rounded text-center">
                  <p className="text-xs text-muted-foreground">Gross Profit</p>
                  <p className="font-semibold">€{unitResults.grossProfit.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Revenue:</span>
                  <span className="font-semibold">€{unitResults.monthlyRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Break-even Ratio:</span>
                  <span className="font-semibold">{unitResults.breakEven.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm">
          <Zap className="h-4 w-4 mr-1" />
          Save Calc
        </Button>
        <Button variant="outline" size="sm">
          <ArrowRight className="h-4 w-4 mr-1" />
          Apply
        </Button>
      </div>
    </div>
  );
}