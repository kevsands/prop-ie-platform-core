'use client';

import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Target, 
  Calendar, 
  AlertCircle, 
  CheckCircle,
  Eye,
  Download,
  RefreshCw,
  Settings,
  Filter,
  Zap,
  Clock,
  MapPin,
  Building,
  Home,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Layers,
  Globe,
  Star,
  Award,
  Gauge,
  Database,
  Shield,
  Cpu,
  Lightbulb,
  Search,
  Bell,
  Calculator,
  Briefcase,
  LineChart,
  Plus,
  Minus,
  Info,
  Percent,
  CreditCard,
  FileText,
  Users,
  Building2,
  Banknote,
  Wallet,
  PiggyBank,
  TrendingUp as Growth,
  BarChart,
  Maximize,
  Minimize,
  RotateCcw,
  Sliders,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Scatter,
  ScatterChart,
  ReferenceLine
} from 'recharts';
import { fitzgeraldGardensConfig } from '@/data/fitzgerald-gardens-config';
import { realDataService } from '@/services/RealDataService';
import { Unit } from '@/types/project';

interface InvestmentScenario {
  id: string;
  name: string;
  description: string;
  unitMix: {
    unitType: string;
    quantity: number;
    avgPrice: number;
    rentEstimate: number;
  }[];
  totalInvestment: number;
  expectedROI: number;
  riskLevel: 'low' | 'medium' | 'high';
  timeframe: number; // years
  cashFlow: {
    year: number;
    income: number;
    expenses: number;
    netCashFlow: number;
    cumulativeReturn: number;
  }[];
  metrics: {
    npv: number;
    irr: number;
    paybackPeriod: number;
    capitalGain: number;
    rentalYield: number;
    totalReturn: number;
  };
}

interface PortfolioOptimization {
  recommendedMix: {
    unitType: string;
    allocation: number;
    reasoning: string;
  }[];
  riskReturn: {
    conservative: { risk: number; return: number; };
    balanced: { risk: number; return: number; };
    aggressive: { risk: number; return: number; };
  };
  diversificationScore: number;
  liquidityAnalysis: string;
  taxOptimization: string[];
}

interface MarketComparison {
  location: string;
  avgPrice: number;
  rentalYield: number;
  capitalGrowth: number;
  riskScore: number;
  liquidityScore: number;
  overallScore: number;
}

interface InvestmentAnalysisProps {
  projectId: string;
  units: Unit[];
  totalRevenue: number;
  averageUnitPrice: number;
}

export default function InvestmentAnalysisTools({ 
  projectId, 
  units, 
  totalRevenue, 
  averageUnitPrice 
}: InvestmentAnalysisProps) {
  const [viewMode, setViewMode] = useState<'scenarios' | 'optimization' | 'comparison' | 'calculator'>('scenarios');
  const [selectedScenario, setSelectedScenario] = useState<string>('scenario-1');
  const [calculatorParams, setCalculatorParams] = useState({
    investmentAmount: 500000,
    loanToValue: 80,
    interestRate: 4.2,
    loanTerm: 25,
    expectedGrowth: 5,
    rentalYield: 6.5,
    managementFees: 10,
    maintenanceCosts: 1.5,
    insurance: 0.8,
    taxRate: 20
  });

  // Get real project data
  const config = fitzgeraldGardensConfig;

  // Generate investment scenarios
  const investmentScenarios: InvestmentScenario[] = useMemo(() => [
    {
      id: 'scenario-1',
      name: 'Conservative Portfolio',
      description: 'Low-risk mix focused on steady rental income with 1-2 bedroom units',
      unitMix: [
        { unitType: '1-bed apartment', quantity: 3, avgPrice: 380000, rentEstimate: 1800 },
        { unitType: '2-bed apartment', quantity: 2, avgPrice: 450000, rentEstimate: 2200 }
      ],
      totalInvestment: 2040000,
      expectedROI: 8.2,
      riskLevel: 'low',
      timeframe: 10,
      cashFlow: Array.from({ length: 10 }, (_, i) => {
        const year = i + 1;
        const income = (3 * 1800 + 2 * 2200) * 12 * Math.pow(1.03, year - 1);
        const expenses = income * 0.25;
        const netCashFlow = income - expenses;
        const cumulativeReturn = year === 1 ? netCashFlow : netCashFlow * year * 0.8;
        return { year, income, expenses, netCashFlow, cumulativeReturn };
      }),
      metrics: {
        npv: 485000,
        irr: 8.2,
        paybackPeriod: 12.5,
        capitalGain: 680000,
        rentalYield: 6.3,
        totalReturn: 168.5
      }
    },
    {
      id: 'scenario-2',
      name: 'Balanced Growth',
      description: 'Balanced mix targeting both income and capital appreciation',
      unitMix: [
        { unitType: '1-bed apartment', quantity: 2, avgPrice: 380000, rentEstimate: 1800 },
        { unitType: '2-bed apartment', quantity: 2, avgPrice: 450000, rentEstimate: 2200 },
        { unitType: '3-bed house', quantity: 1, avgPrice: 520000, rentEstimate: 2800 }
      ],
      totalInvestment: 2380000,
      expectedROI: 9.8,
      riskLevel: 'medium',
      timeframe: 10,
      cashFlow: Array.from({ length: 10 }, (_, i) => {
        const year = i + 1;
        const income = (2 * 1800 + 2 * 2200 + 1 * 2800) * 12 * Math.pow(1.035, year - 1);
        const expenses = income * 0.28;
        const netCashFlow = income - expenses;
        const cumulativeReturn = year === 1 ? netCashFlow : netCashFlow * year * 0.85;
        return { year, income, expenses, netCashFlow, cumulativeReturn };
      }),
      metrics: {
        npv: 625000,
        irr: 9.8,
        paybackPeriod: 10.8,
        capitalGain: 890000,
        rentalYield: 6.8,
        totalReturn: 198.2
      }
    },
    {
      id: 'scenario-3',
      name: 'Growth Focused',
      description: 'Higher-risk strategy targeting maximum capital appreciation',
      unitMix: [
        { unitType: '2-bed apartment', quantity: 1, avgPrice: 450000, rentEstimate: 2200 },
        { unitType: '3-bed house', quantity: 2, avgPrice: 520000, rentEstimate: 2800 },
        { unitType: '3-bed penthouse', quantity: 1, avgPrice: 680000, rentEstimate: 3500 }
      ],
      totalInvestment: 2170000,
      expectedROI: 11.5,
      riskLevel: 'high',
      timeframe: 10,
      cashFlow: Array.from({ length: 10 }, (_, i) => {
        const year = i + 1;
        const income = (1 * 2200 + 2 * 2800 + 1 * 3500) * 12 * Math.pow(1.04, year - 1);
        const expenses = income * 0.32;
        const netCashFlow = income - expenses;
        const cumulativeReturn = year === 1 ? netCashFlow : netCashFlow * year * 0.9;
        return { year, income, expenses, netCashFlow, cumulativeReturn };
      }),
      metrics: {
        npv: 720000,
        irr: 11.5,
        paybackPeriod: 8.9,
        capitalGrowth: 1250000,
        rentalYield: 7.2,
        totalReturn: 235.8
      }
    }
  ], []);

  // Portfolio optimization analysis
  const portfolioOptimization: PortfolioOptimization = useMemo(() => ({
    recommendedMix: [
      {
        unitType: '1-bed apartments',
        allocation: 25,
        reasoning: 'High rental demand, lower entry cost, good liquidity'
      },
      {
        unitType: '2-bed apartments',
        allocation: 45,
        reasoning: 'Optimal balance of rental yield and capital growth potential'
      },
      {
        unitType: '3-bed houses',
        allocation: 30,
        reasoning: 'Strong capital appreciation, family market stability'
      }
    ],
    riskReturn: {
      conservative: { risk: 15, return: 7.2 },
      balanced: { risk: 25, return: 9.8 },
      aggressive: { risk: 35, return: 12.5 }
    },
    diversificationScore: 82,
    liquidityAnalysis: 'Good liquidity expected due to Cork market demand and university proximity',
    taxOptimization: [
      'Section 23 relief potential for qualifying properties',
      'Rent-a-room relief for owner-occupiers',
      'Capital gains tax planning for disposal timing',
      'Interest deductibility on investment loans'
    ]
  }), []);

  // Market comparison data
  const marketComparisons: MarketComparison[] = useMemo(() => [
    {
      location: 'Fitzgerald Gardens, Cork',
      avgPrice: averageUnitPrice,
      rentalYield: 6.8,
      capitalGrowth: 8.5,
      riskScore: 25,
      liquidityScore: 85,
      overallScore: 88
    },
    {
      location: 'Dublin City Centre',
      avgPrice: 650000,
      rentalYield: 4.2,
      capitalGrowth: 6.8,
      riskScore: 35,
      liquidityScore: 95,
      overallScore: 75
    },
    {
      location: 'Galway City',
      avgPrice: 420000,
      rentalYield: 7.2,
      capitalGrowth: 7.5,
      riskScore: 28,
      liquidityScore: 75,
      overallScore: 82
    },
    {
      location: 'Limerick City',
      avgPrice: 350000,
      rentalYield: 8.1,
      capitalGrowth: 6.2,
      riskScore: 30,
      liquidityScore: 70,
      overallScore: 78
    },
    {
      location: 'Waterford City',
      avgPrice: 320000,
      rentalYield: 7.8,
      capitalGrowth: 5.8,
      riskScore: 32,
      liquidityScore: 65,
      overallScore: 72
    }
  ], [averageUnitPrice]);

  // Investment calculator
  const calculateInvestmentMetrics = useMemo(() => {
    const {
      investmentAmount,
      loanToValue,
      interestRate,
      loanTerm,
      expectedGrowth,
      rentalYield,
      managementFees,
      maintenanceCosts,
      insurance,
      taxRate
    } = calculatorParams;

    const loanAmount = (investmentAmount * loanToValue) / 100;
    const equity = investmentAmount - loanAmount;
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    // Monthly mortgage payment
    const monthlyPayment = loanAmount * 
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    // Annual calculations
    const annualRent = (investmentAmount * rentalYield) / 100;
    const annualMortgage = monthlyPayment * 12;
    const annualManagement = (annualRent * managementFees) / 100;
    const annualMaintenance = (investmentAmount * maintenanceCosts) / 100;
    const annualInsurance = (investmentAmount * insurance) / 100;
    
    const grossCashFlow = annualRent - annualMortgage - annualManagement - annualMaintenance - annualInsurance;
    const taxOnRent = (annualRent * taxRate) / 100;
    const netCashFlow = grossCashFlow - taxOnRent;
    
    const cashOnCashReturn = (netCashFlow / equity) * 100;
    const capRate = (annualRent / investmentAmount) * 100;
    
    // 10-year projection
    const projectionYears = Array.from({ length: 10 }, (_, i) => {
      const year = i + 1;
      const propertyValue = investmentAmount * Math.pow(1 + expectedGrowth / 100, year);
      const equity = propertyValue - (loanAmount * Math.max(0, 1 - (year / loanTerm)));
      const totalReturn = equity - investmentAmount + (netCashFlow * year);
      
      return {
        year,
        propertyValue,
        equity,
        totalReturn,
        roi: ((totalReturn / investmentAmount) * 100)
      };
    });

    return {
      loanAmount,
      equity,
      monthlyPayment,
      annualRent,
      netCashFlow,
      cashOnCashReturn,
      capRate,
      projectionYears
    };
  }, [calculatorParams]);

  const selectedScenarioData = investmentScenarios.find(s => s.id === selectedScenario);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount: number) => {
    return `€${(amount / 1000).toFixed(0)}K`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Investment Analysis Tools</h2>
              <p className="text-gray-600">Advanced portfolio optimization & ROI modeling</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['scenarios', 'optimization', 'comparison', 'calculator'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-3 py-1 rounded text-sm transition-colors capitalize ${
                  viewMode === mode ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          
          <button className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Investment Scenarios */}
      {viewMode === 'scenarios' && (
        <div className="space-y-6">
          {/* Scenario Selector */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Scenarios</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {investmentScenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedScenario === scenario.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{scenario.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(scenario.riskLevel)}`}>
                      {scenario.riskLevel} risk
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Investment:</span>
                      <div className="font-semibold">{formatCurrency(scenario.totalInvestment)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Expected ROI:</span>
                      <div className="font-semibold text-green-600">{formatPercentage(scenario.expectedROI)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Scenario Details */}
          {selectedScenarioData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cash Flow Chart */}
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {selectedScenarioData.name} - Cash Flow Projection
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={selectedScenarioData.cashFlow}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`€${(value / 1000).toFixed(0)}K`, '']} />
                    <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} name="Income" />
                    <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} name="Expenses" />
                    <Line type="monotone" dataKey="netCashFlow" stroke="#3B82F6" strokeWidth={3} name="Net Cash Flow" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>

              {/* Key Metrics */}
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Investment Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium">NPV</div>
                    <div className="text-xl font-bold text-blue-600">
                      {formatCurrency(selectedScenarioData.metrics.npv)}
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-600 font-medium">IRR</div>
                    <div className="text-xl font-bold text-green-600">
                      {formatPercentage(selectedScenarioData.metrics.irr)}
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="text-sm text-purple-600 font-medium">Payback Period</div>
                    <div className="text-xl font-bold text-purple-600">
                      {selectedScenarioData.metrics.paybackPeriod.toFixed(1)} years
                    </div>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <div className="text-sm text-amber-600 font-medium">Rental Yield</div>
                    <div className="text-xl font-bold text-amber-600">
                      {formatPercentage(selectedScenarioData.metrics.rentalYield)}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium text-gray-700 mb-3">Unit Mix</h4>
                  <div className="space-y-2">
                    {selectedScenarioData.unitMix.map((unit, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">
                          {unit.quantity}x {unit.unitType}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(unit.avgPrice)} / €{unit.rentEstimate}/mo
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Portfolio Optimization */}
      {viewMode === 'optimization' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recommended Mix */}
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimal Portfolio Mix</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RechartsPieChart>
                  <Pie
                    data={portfolioOptimization.recommendedMix.map((item, index) => ({
                      name: item.unitType,
                      value: item.allocation,
                      color: ['#3B82F6', '#10B981', '#F59E0B'][index]
                    }))}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {portfolioOptimization.recommendedMix.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B'][index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>

            {/* Risk-Return Analysis */}
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk-Return Profiles</h3>
              <ResponsiveContainer width="100%" height={250}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="risk" name="Risk %" />
                  <YAxis dataKey="return" name="Return %" />
                  <Tooltip formatter={(value, name) => [`${value}%`, name === 'risk' ? 'Risk' : 'Return']} />
                  <Scatter 
                    data={[
                      { risk: portfolioOptimization.riskReturn.conservative.risk, return: portfolioOptimization.riskReturn.conservative.return, name: 'Conservative' },
                      { risk: portfolioOptimization.riskReturn.balanced.risk, return: portfolioOptimization.riskReturn.balanced.return, name: 'Balanced' },
                      { risk: portfolioOptimization.riskReturn.aggressive.risk, return: portfolioOptimization.riskReturn.aggressive.return, name: 'Aggressive' }
                    ]}
                    fill="#3B82F6" 
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {portfolioOptimization.recommendedMix.map((mix, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'][index] }}></div>
                  <h4 className="font-semibold text-gray-900">{mix.unitType}</h4>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{mix.allocation}%</div>
                <p className="text-sm text-gray-600">{mix.reasoning}</p>
              </div>
            ))}
          </div>

          {/* Additional Insights */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Diversification Analysis</h4>
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-green-600">{portfolioOptimization.diversificationScore}</div>
                  <div className="text-sm text-gray-600">Diversification Score (out of 100)</div>
                </div>
                <div className="mt-2 text-sm text-gray-600">{portfolioOptimization.liquidityAnalysis}</div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Tax Optimization Opportunities</h4>
                <div className="space-y-2">
                  {portfolioOptimization.taxOptimization.map((item, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle size={14} className="text-green-500 mt-0.5" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Market Comparison */}
      {viewMode === 'comparison' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Comparison Analysis</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Location</th>
                    <th className="text-left py-3 px-4">Avg Price</th>
                    <th className="text-left py-3 px-4">Rental Yield</th>
                    <th className="text-left py-3 px-4">Capital Growth</th>
                    <th className="text-left py-3 px-4">Risk Score</th>
                    <th className="text-left py-3 px-4">Liquidity</th>
                    <th className="text-left py-3 px-4">Overall Score</th>
                  </tr>
                </thead>
                <tbody>
                  {marketComparisons.map((market, index) => (
                    <tr key={index} className={`border-b hover:bg-gray-50 ${index === 0 ? 'bg-blue-50' : ''}`}>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{market.location}</div>
                        {index === 0 && <div className="text-xs text-blue-600">Current Project</div>}
                      </td>
                      <td className="py-3 px-4">{formatCurrency(market.avgPrice)}</td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${market.rentalYield > 6 ? 'text-green-600' : market.rentalYield > 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {formatPercentage(market.rentalYield)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${market.capitalGrowth > 7 ? 'text-green-600' : market.capitalGrowth > 6 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {formatPercentage(market.capitalGrowth)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${market.riskScore < 30 ? 'text-green-600' : market.riskScore < 35 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {market.riskScore}/100
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${market.liquidityScore > 80 ? 'text-green-600' : market.liquidityScore > 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {market.liquidityScore}/100
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-bold text-xl ${market.overallScore > 85 ? 'text-green-600' : market.overallScore > 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {market.overallScore}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Market Analysis Chart */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk vs Return Analysis</h3>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart data={marketComparisons}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="riskScore" name="Risk Score" />
                <YAxis dataKey="rentalYield" name="Rental Yield %" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'riskScore' ? `${value}/100` : `${value}%`,
                    name === 'riskScore' ? 'Risk Score' : 'Rental Yield'
                  ]}
                  labelFormatter={(label) => `Location: ${label}`}
                />
                <Scatter dataKey="capitalGrowth" fill="#3B82F6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Investment Calculator */}
      {viewMode === 'calculator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calculator Inputs */}
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Calculator</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Investment Amount (€)</label>
                    <input
                      type="number"
                      value={calculatorParams.investmentAmount}
                      onChange={(e) => setCalculatorParams({...calculatorParams, investmentAmount: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loan to Value (%)</label>
                    <input
                      type="number"
                      value={calculatorParams.loanToValue}
                      onChange={(e) => setCalculatorParams({...calculatorParams, loanToValue: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={calculatorParams.interestRate}
                      onChange={(e) => setCalculatorParams({...calculatorParams, interestRate: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term (years)</label>
                    <input
                      type="number"
                      value={calculatorParams.loanTerm}
                      onChange={(e) => setCalculatorParams({...calculatorParams, loanTerm: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Growth (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={calculatorParams.expectedGrowth}
                      onChange={(e) => setCalculatorParams({...calculatorParams, expectedGrowth: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rental Yield (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={calculatorParams.rentalYield}
                      onChange={(e) => setCalculatorParams({...calculatorParams, rentalYield: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Management Fees (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={calculatorParams.managementFees}
                      onChange={(e) => setCalculatorParams({...calculatorParams, managementFees: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={calculatorParams.taxRate}
                      onChange={(e) => setCalculatorParams({...calculatorParams, taxRate: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Calculator Results */}
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Analysis Results</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Monthly Payment</div>
                  <div className="text-xl font-bold text-blue-600">
                    €{calculateInvestmentMetrics.monthlyPayment.toFixed(0)}
                  </div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">Annual Rent</div>
                  <div className="text-xl font-bold text-green-600">
                    €{calculateInvestmentMetrics.annualRent.toFixed(0)}
                  </div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-sm text-purple-600 font-medium">Net Cash Flow</div>
                  <div className="text-xl font-bold text-purple-600">
                    €{calculateInvestmentMetrics.netCashFlow.toFixed(0)}
                  </div>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <div className="text-sm text-amber-600 font-medium">Cash-on-Cash Return</div>
                  <div className="text-xl font-bold text-amber-600">
                    {calculateInvestmentMetrics.cashOnCashReturn.toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="text-sm text-red-600 font-medium">Cap Rate</div>
                  <div className="text-xl font-bold text-red-600">
                    {calculateInvestmentMetrics.capRate.toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <div className="text-sm text-indigo-600 font-medium">Initial Equity</div>
                  <div className="text-xl font-bold text-indigo-600">
                    {formatCurrency(calculateInvestmentMetrics.equity)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 10-Year Projection Chart */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">10-Year Investment Projection</h3>
            <ResponsiveContainer width="100%" height={400}>
              <RechartsLineChart data={calculateInvestmentMetrics.projectionYears}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  typeof value === 'number' && value > 100000 ? formatCurrency(value) : `${value.toFixed(1)}%`,
                  name === 'propertyValue' ? 'Property Value' : 
                  name === 'equity' ? 'Equity' : 
                  name === 'totalReturn' ? 'Total Return' : 'ROI'
                ]} />
                <Line type="monotone" dataKey="propertyValue" stroke="#3B82F6" strokeWidth={2} name="propertyValue" />
                <Line type="monotone" dataKey="equity" stroke="#10B981" strokeWidth={2} name="equity" />
                <Line type="monotone" dataKey="totalReturn" stroke="#F59E0B" strokeWidth={2} name="totalReturn" />
                <Line type="monotone" dataKey="roi" stroke="#EF4444" strokeWidth={2} name="roi" />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}