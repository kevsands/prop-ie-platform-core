/**
 * Irish Tax Compliance Dashboard
 * 
 * Comprehensive RCT and VAT management for construction projects
 * Integrates with Revenue Online Service (ROS) requirements
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  Calculator,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Euro,
  Building2,
  Users,
  Calendar,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Settings,
  Shield,
  TrendingUp,
  Receipt,
  CreditCard,
  Activity,
  Target,
  Archive,
  Search
} from 'lucide-react';

interface TaxSummary {
  projectId: string;
  taxYear: number;
  summary: {
    totalGrossPayments: number;
    totalNetPayments: number;
    totalVATLiable: number;
    totalRCTDeducted: number;
    totalTaxesDeducted: number;
  };
  complianceStatus: {
    vatCompliant: boolean;
    rctCompliant: boolean;
    lastVATReturn: string;
    lastRCTReturn: string;
    nextActions: string[];
  };
  recentActivity: {
    contractorPayments: any[];
    professionalInvoices: any[];
  };
}

interface TaxCalculation {
  grossAmount: number;
  vatCalculation: {
    rate: number;
    amount: number;
    applicable: boolean;
  };
  rctCalculation: {
    rate: number;
    amount: number;
    applicable: boolean;
    certificateType: string;
  };
  netAmount: number;
  finalPaymentAmount: number;
  taxesDeducted: number;
  complianceFlags: {
    vatRegistrationRequired: boolean;
    rctCertificateRequired: boolean;
    monthlyReturnsRequired: boolean;
    quarterlyReturnsRequired: boolean;
  };
}

export default function IrishTaxComplianceDashboard() {
  const [taxSummary, setTaxSummary] = useState<TaxSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculatorData, setCalculatorData] = useState({
    grossAmount: '',
    contractorType: 'standard',
    serviceType: 'construction',
    vatRegistered: true,
    isResident: true
  });
  const [taxCalculation, setTaxCalculation] = useState<TaxCalculation | null>(null);
  const { toast } = useToast();

  const loadTaxData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/finance/tax-compliance?projectId=fitzgerald-gardens');
      const data = await response.json();
      
      if (data.success) {
        setTaxSummary(data.data);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error loading tax compliance data:', error);
      toast({
        title: "Error",
        description: "Failed to load tax compliance data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateTaxes = async () => {
    if (!calculatorData.grossAmount || Number(calculatorData.grossAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid gross amount",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/finance/tax-compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'calculate_taxes',
          data: {
            contractorId: 'calc-contractor',
            grossAmount: Number(calculatorData.grossAmount),
            contractorType: calculatorData.contractorType,
            serviceType: calculatorData.serviceType,
            vatRegistered: calculatorData.vatRegistered,
            isResident: calculatorData.isResident
          }
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setTaxCalculation(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error calculating taxes:', error);
      toast({
        title: "Calculation Error",
        description: "Failed to calculate taxes",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadTaxData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (rate: number) => {
    return `${rate.toFixed(1)}%`;
  };

  // Chart data
  const taxBreakdownData = taxSummary ? [
    { name: 'VAT Liable', value: taxSummary.summary.totalVATLiable, color: '#3B82F6' },
    { name: 'RCT Deducted', value: taxSummary.summary.totalRCTDeducted, color: '#EF4444' },
    { name: 'Net Payments', value: taxSummary.summary.totalNetPayments, color: '#10B981' }
  ] : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading tax compliance dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Irish Tax Compliance</h1>
              <p className="text-gray-600">RCT & VAT management for construction projects</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-green-100 text-green-800">
                <Shield className="h-3 w-3 mr-1" />
                Revenue Compliant
              </Badge>
              <Button onClick={loadTaxData} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Key Tax Metrics */}
        {taxSummary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total VAT Liable</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(taxSummary.summary.totalVATLiable)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Receipt className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">RCT Deducted</p>
                    <p className="text-2xl font-bold text-red-600">
                      {formatCurrency(taxSummary.summary.totalRCTDeducted)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Net Payments</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(taxSummary.summary.totalNetPayments)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Euro className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Taxes</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(taxSummary.summary.totalTaxesDeducted)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {((taxSummary.summary.totalTaxesDeducted / taxSummary.summary.totalGrossPayments) * 100).toFixed(1)}% of gross
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Calculator className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="calculator">Tax Calculator</TabsTrigger>
            <TabsTrigger value="rct">RCT Management</TabsTrigger>
            <TabsTrigger value="vat">VAT Returns</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {taxSummary && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tax Breakdown Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Tax Breakdown
                    </CardTitle>
                    <CardDescription>
                      Distribution of taxes across the project
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={taxBreakdownData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                        >
                          {taxBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Compliance Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Compliance Status
                    </CardTitle>
                    <CardDescription>
                      Current compliance with Irish tax requirements
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium">VAT Compliance</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Up to Date</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium">RCT Compliance</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Up to Date</Badge>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Next Actions:</h4>
                      {taxSummary.complianceStatus.nextActions.map((action, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          {action}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recent Activity */}
            {taxSummary && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Recent Tax Activity
                  </CardTitle>
                  <CardDescription>
                    Latest contractor payments and professional invoices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {taxSummary.recentActivity.contractorPayments.map((payment, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium">Contractor Payment #{payment.valuationNumber}</p>
                            <p className="text-sm text-gray-600">RCT Deducted: {formatCurrency(payment.rctDeducted)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(payment.netPayable)}</p>
                          <p className="text-sm text-gray-600">Net Payable</p>
                        </div>
                      </div>
                    ))}
                    
                    {taxSummary.recentActivity.professionalInvoices.map((invoice, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Receipt className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Professional Invoice #{invoice.invoiceNumber}</p>
                            <p className="text-sm text-gray-600">VAT: {formatCurrency(invoice.vatAmount)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(invoice.grossAmount)}</p>
                          <p className="text-sm text-gray-600">Gross Amount</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="calculator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tax Calculator Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Irish Tax Calculator
                  </CardTitle>
                  <CardDescription>
                    Calculate RCT and VAT for payments
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="grossAmount">Gross Amount (EUR)</Label>
                    <Input
                      id="grossAmount"
                      type="number"
                      value={calculatorData.grossAmount}
                      onChange={(e) => setCalculatorData({...calculatorData, grossAmount: e.target.value})}
                      placeholder="Enter gross amount..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="contractorType">Contractor Type</Label>
                    <Select 
                      value={calculatorData.contractorType} 
                      onValueChange={(value) => setCalculatorData({...calculatorData, contractorType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="c2_certificate">C2 Certificate Holder (0% RCT)</SelectItem>
                        <SelectItem value="standard">Standard Contractor (20% RCT)</SelectItem>
                        <SelectItem value="subcontractor">Subcontractor (20% RCT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="serviceType">Service Type</Label>
                    <Select 
                      value={calculatorData.serviceType} 
                      onValueChange={(value) => setCalculatorData({...calculatorData, serviceType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="construction">Construction Services (13.5% VAT)</SelectItem>
                        <SelectItem value="professional">Professional Services (23% VAT)</SelectItem>
                        <SelectItem value="consultancy">Consultancy (23% VAT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="vatRegistered"
                      checked={calculatorData.vatRegistered}
                      onChange={(e) => setCalculatorData({...calculatorData, vatRegistered: e.target.checked})}
                    />
                    <Label htmlFor="vatRegistered">VAT Registered</Label>
                  </div>

                  <Button onClick={calculateTaxes} className="w-full">
                    Calculate Taxes
                  </Button>
                </CardContent>
              </Card>

              {/* Tax Calculation Results */}
              {taxCalculation && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Tax Calculation Results
                    </CardTitle>
                    <CardDescription>
                      Breakdown of taxes and net payment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Gross Amount</p>
                        <p className="text-xl font-bold">{formatCurrency(taxCalculation.grossAmount)}</p>
                      </div>
                      
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">VAT ({formatPercentage(taxCalculation.vatCalculation.rate)})</p>
                        <p className="text-xl font-bold text-blue-600">
                          {formatCurrency(taxCalculation.vatCalculation.amount)}
                        </p>
                      </div>
                      
                      <div className="p-4 bg-red-50 rounded-lg">
                        <p className="text-sm text-gray-600">RCT ({formatPercentage(taxCalculation.rctCalculation.rate)})</p>
                        <p className="text-xl font-bold text-red-600">
                          {formatCurrency(taxCalculation.rctCalculation.amount)}
                        </p>
                      </div>
                      
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600">Net Payable</p>
                        <p className="text-xl font-bold text-green-600">
                          {formatCurrency(taxCalculation.finalPaymentAmount)}
                        </p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Compliance Requirements:</h4>
                      <div className="space-y-2 text-sm">
                        {taxCalculation.complianceFlags.vatRegistrationRequired && (
                          <div className="flex items-center gap-2 text-orange-600">
                            <AlertTriangle className="h-4 w-4" />
                            VAT registration required (&gt;€37,500)
                          </div>
                        )}
                        {taxCalculation.complianceFlags.rctCertificateRequired && (
                          <div className="flex items-center gap-2 text-orange-600">
                            <AlertTriangle className="h-4 w-4" />
                            RCT certificate required (&gt;€10,000)
                          </div>
                        )}
                        {taxCalculation.complianceFlags.monthlyReturnsRequired && (
                          <div className="flex items-center gap-2 text-blue-600">
                            <Calendar className="h-4 w-4" />
                            Monthly VAT returns required
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="rct">
            <Card>
              <CardHeader>
                <CardTitle>RCT Management</CardTitle>
                <CardDescription>
                  Relevant Contracts Tax for construction services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Standard Rate</h4>
                      <p className="text-2xl font-bold text-red-600">20%</p>
                      <p className="text-sm text-gray-600">For non-C2 certificate holders</p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">C2 Certificate</h4>
                      <p className="text-2xl font-bold text-green-600">0%</p>
                      <p className="text-sm text-gray-600">For qualifying contractors</p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Threshold</h4>
                      <p className="text-2xl font-bold text-blue-600">€10,000</p>
                      <p className="text-sm text-gray-600">Minimum for RCT application</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Recent RCT Deductions</h4>
                    {taxSummary?.recentActivity.contractorPayments.map((payment, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg mb-2">
                        <div>
                          <p className="font-medium">Valuation #{payment.valuationNumber}</p>
                          <p className="text-sm text-gray-600">Gross: {formatCurrency(payment.grossAmount)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-red-600">-{formatCurrency(payment.rctDeducted)}</p>
                          <p className="text-sm text-gray-600">RCT Deducted</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vat">
            <Card>
              <CardHeader>
                <CardTitle>VAT Returns</CardTitle>
                <CardDescription>
                  Value Added Tax management and returns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Standard Rate</h4>
                      <p className="text-2xl font-bold text-blue-600">23%</p>
                      <p className="text-sm text-gray-600">Professional services</p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Reduced Rate</h4>
                      <p className="text-2xl font-bold text-green-600">13.5%</p>
                      <p className="text-sm text-gray-600">Construction services</p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Next Return Due</h4>
                      <p className="text-lg font-bold text-orange-600">July 23</p>
                      <p className="text-sm text-gray-600">Monthly return</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">VAT Liable Invoices</h4>
                    {taxSummary?.recentActivity.professionalInvoices.map((invoice, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg mb-2">
                        <div>
                          <p className="font-medium">Invoice #{invoice.invoiceNumber}</p>
                          <p className="text-sm text-gray-600 capitalize">{invoice.professionalRole}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-blue-600">{formatCurrency(invoice.vatAmount)}</p>
                          <p className="text-sm text-gray-600">VAT Amount</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Tax Reports</CardTitle>
                <CardDescription>
                  Generate compliance reports for Revenue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Button className="h-20 flex flex-col items-center justify-center">
                      <Download className="h-6 w-6 mb-2" />
                      Download VAT Return
                    </Button>
                    
                    <Button className="h-20 flex flex-col items-center justify-center" variant="outline">
                      <Download className="h-6 w-6 mb-2" />
                      Download RCT Return
                    </Button>
                    
                    <Button className="h-20 flex flex-col items-center justify-center" variant="outline">
                      <FileText className="h-6 w-6 mb-2" />
                      Monthly Summary
                    </Button>
                    
                    <Button className="h-20 flex flex-col items-center justify-center" variant="outline">
                      <Archive className="h-6 w-6 mb-2" />
                      Annual Report
                    </Button>
                  </div>

                  {taxSummary && (
                    <div className="p-6 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-4">Tax Year {taxSummary.taxYear} Summary</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Total VAT</p>
                          <p className="font-medium">{formatCurrency(taxSummary.summary.totalVATLiable)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total RCT</p>
                          <p className="font-medium">{formatCurrency(taxSummary.summary.totalRCTDeducted)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Gross Payments</p>
                          <p className="font-medium">{formatCurrency(taxSummary.summary.totalGrossPayments)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Net Payments</p>
                          <p className="font-medium">{formatCurrency(taxSummary.summary.totalNetPayments)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}