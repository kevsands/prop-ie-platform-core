'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calculator,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  BarChart3,
  Building2,
  Download,
  Eye,
  LineChart
} from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export function DevelopmentAppraisal() {
  const [activeTabsetActiveTab] = useState('financial');
  const [appraisalDatasetAppraisalData] = useState({
    landCost: 2500000,
    constructionCost: 8500000,
    professionalFees: 850000,
    marketingCost: 450000,
    financeCost: 650000,
    totalUnits: 45,
    averageUnitPrice: 385000,
    salesPeriod: 18,
    constructionPeriod: 24
  });

  // Calculate key metrics
  const totalCost = appraisalData.landCost + appraisalData.constructionCost + 
                   appraisalData.professionalFees + appraisalData.marketingCost + 
                   appraisalData.financeCost;
  const totalRevenue = appraisalData.totalUnits * appraisalData.averageUnitPrice;
  const grossProfit = totalRevenue - totalCost;
  const profitMargin = (grossProfit / totalRevenue) * 100;
  const roi = (grossProfit / totalCost) * 100;

  // Cash flow data
  const cashFlowData = [
    { month: 'M1', cashIn: 0, cashOut: -2500000, netCash: -2500000 },
    { month: 'M6', cashIn: 0, cashOut: -1500000, netCash: -4000000 },
    { month: 'M12', cashIn: 1925000, cashOut: -2000000, netCash: -4075000 },
    { month: 'M18', cashIn: 3850000, cashOut: -1500000, netCash: -1725000 },
    { month: 'M24', cashIn: 5775000, cashOut: -500000, netCash: 3550000 },
    { month: 'M30', cashIn: 3850000, cashOut: -200000, netCash: 7200000 },
    { month: 'M36', cashIn: 1925000, cashOut: -100000, netCash: 9025000 }
  ];

  // Sensitivity data
  const sensitivityData = [
    { factor: 'Price -10%', roi: 15.2, profit: 1500000 },
    { factor: 'Price -5%', roi: 20.5, profit: 2200000 },
    { factor: 'Base Case', roi: 25.8, profit: 2900000 },
    { factor: 'Price +5%', roi: 31.1, profit: 3600000 },
    { factor: 'Price +10%', roi: 36.4, profit: 4300000 }
  ];

  // Cost breakdown for pie chart
  const costBreakdown = [
    { name: 'Land', value: appraisalData.landCost, percentage: 20 },
    { name: 'Construction', value: appraisalData.constructionCost, percentage: 68 },
    { name: 'Professional', value: appraisalData.professionalFees, percentage: 7 },
    { name: 'Marketing', value: appraisalData.marketingCost, percentage: 3 },
    { name: 'Finance', value: appraisalData.financeCost, percentage: 5 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Development Appraisal Tool</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            View Report
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Analysis
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Investment</p>
                <p className="text-2xl font-bold">{formatCurrency(totalCost)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expected Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(grossProfit)}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ROI</p>
                <p className="text-2xl font-bold text-blue-600">
                  {roi.toFixed(1)}%
                </p>
              </div>
              <Calculator className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="financial">Financial Model</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="sensitivity">Sensitivity Analysis</TabsTrigger>
          <TabsTrigger value="market">Market Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Development Costs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="landCost">Land Cost</Label>
                    <Input
                      id="landCost"
                      type="number"
                      value={appraisalData.landCost}
                      onChange={(e) => setAppraisalData(prev => ({
                        ...prev,
                        landCost: Number(e.target.value)
                      }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="constructionCost">Construction Cost</Label>
                    <Input
                      id="constructionCost"
                      type="number"
                      value={appraisalData.constructionCost}
                      onChange={(e) => setAppraisalData(prev => ({
                        ...prev,
                        constructionCost: Number(e.target.value)
                      }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="professionalFees">Professional Fees</Label>
                    <Input
                      id="professionalFees"
                      type="number"
                      value={appraisalData.professionalFees}
                      onChange={(e) => setAppraisalData(prev => ({
                        ...prev,
                        professionalFees: Number(e.target.value)
                      }))}
                    />
                  </div>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={costBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name} (${entry.percentage}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {costBreakdown.map((entryindex) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Projections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="totalUnits">Total Units</Label>
                  <Input
                    id="totalUnits"
                    type="number"
                    value={appraisalData.totalUnits}
                    onChange={(e) => setAppraisalData(prev => ({
                      ...prev,
                      totalUnits: Number(e.target.value)
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="averageUnitPrice">Average Unit Price</Label>
                  <Input
                    id="averageUnitPrice"
                    type="number"
                    value={appraisalData.averageUnitPrice}
                    onChange={(e) => setAppraisalData(prev => ({
                      ...prev,
                      averageUnitPrice: Number(e.target.value)
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="salesPeriod">Sales Period (months)</Label>
                  <Input
                    id="salesPeriod"
                    type="number"
                    value={appraisalData.salesPeriod}
                    onChange={(e) => setAppraisalData(prev => ({
                      ...prev,
                      salesPeriod: Number(e.target.value)
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashflow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={cashFlowData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis 
                      tickFormatter={(value) => `€${(value / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip 
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="cashIn" 
                      stroke="#22c55e" 
                      name="Cash In"
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cashOut" 
                      stroke="#ef4444" 
                      name="Cash Out"
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="netCash" 
                      stroke="#3b82f6" 
                      name="Net Cash Position"
                      strokeWidth={3}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Peak Cash Requirement</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(4075000)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Month 12</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Break-even Point</p>
                <p className="text-2xl font-bold text-blue-600">Month 24</p>
                <p className="text-sm text-muted-foreground mt-1">After construction</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Cash Multiple</p>
                <p className="text-2xl font-bold text-green-600">2.2x</p>
                <p className="text-sm text-muted-foreground mt-1">On total investment</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sensitivity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Price Sensitivity Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sensitivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="factor" />
                    <YAxis 
                      yAxisId="left" 
                      tickFormatter={(value) => `${value}%`}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right"
                      tickFormatter={(value) => `€${(value / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      yAxisId="left"
                      dataKey="roi" 
                      fill="#3b82f6" 
                      name="ROI %"
                    />
                    <Bar 
                      yAxisId="right"
                      dataKey="profit" 
                      fill="#22c55e" 
                      name="Profit"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Factors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium">Construction Cost Overrun</p>
                      <p className="text-sm text-muted-foreground">
                        10% increase would reduce ROI to 18.5%
                      </p>
                    </div>
                  </div>
                  <Badge variant="warning">Medium Risk</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium">Sales Velocity</p>
                      <p className="text-sm text-muted-foreground">
                        6-month delay increases finance costs by €325k
                      </p>
                    </div>
                  </div>
                  <Badge variant="destructive">High Risk</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Market Appreciation</p>
                      <p className="text-sm text-muted-foreground">
                        5% annual growth adds €865k to revenue
                      </p>
                    </div>
                  </div>
                  <Badge variant="success">Opportunity</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Comparables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4 font-medium text-sm text-muted-foreground">
                  <div>Development</div>
                  <div>Price/sqft</div>
                  <div>Units</div>
                  <div>Completion</div>
                </div>

                <div className="grid grid-cols-4 gap-4 p-3 bg-muted rounded-lg">
                  <div className="font-medium">Your Project</div>
                  <div>€385/sqft</div>
                  <div>45 units</div>
                  <div>Q4 2025</div>
                </div>

                <div className="grid grid-cols-4 gap-4 p-3 border rounded-lg">
                  <div>Riverside Quarter</div>
                  <div>€378/sqft</div>
                  <div>62 units</div>
                  <div>Q2 2025</div>
                </div>

                <div className="grid grid-cols-4 gap-4 p-3 border rounded-lg">
                  <div>Parkside Residences</div>
                  <div>€392/sqft</div>
                  <div>38 units</div>
                  <div>Q3 2025</div>
                </div>

                <div className="grid grid-cols-4 gap-4 p-3 border rounded-lg">
                  <div>Urban Heights</div>
                  <div>€401/sqft</div>
                  <div>55 units</div>
                  <div>Q1 2026</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Market Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Demand Indicators</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Average Days on Market</span>
                      <span className="font-medium">45 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Absorption Rate</span>
                      <span className="font-medium">3.2 units/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Price Growth (YoY)</span>
                      <span className="font-medium text-green-600">+6.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Rental Yield</span>
                      <span className="font-medium">5.2%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Supply Analysis</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Active Developments</span>
                      <span className="font-medium">12 projects</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Units in Pipeline</span>
                      <span className="font-medium">450 units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Completion Rate</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Market Saturation</span>
                      <span className="font-medium text-yellow-600">Medium</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}