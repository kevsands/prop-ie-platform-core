'use client';

import React, { useState, useMemo, useCallback } from 'react';
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
  ChevronDown,
  PlayCircle,
  PauseCircle,
  Square,
  SkipForward,
  Rewind,
  FastForward
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
  ReferenceLine,
  TreeMap,
  Sankey,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts';
import { fitzgeraldGardensConfig } from '@/data/fitzgerald-gardens-config';
import { realDataService } from '@/services/RealDataService';
import { aiMarketAnalysisEngine } from '@/services/AIMarketAnalysisEngine';

interface InvestmentPerformanceMetrics {
  currentValue: number;
  initialInvestment: number;
  totalReturn: number;
  totalReturnPercentage: number;
  annualizedReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  roi: number;
  irr: number;
  npv: number;
  paybackPeriod: number;
  cashOnCashReturn: number;
  leveragedReturn: number;
  riskAdjustedReturn: number;
  marketComparison: number;
}

interface PerformanceTimeframe {
  period: string;
  value: number;
  return: number;
  benchmark: number;
  volatility: number;
  date: Date;
}

interface AssetAllocation {
  category: string;
  allocation: number;
  performance: number;
  risk: number;
  target: number;
  variance: number;
}

interface RiskMetrics {
  overallRisk: number;
  marketRisk: number;
  creditRisk: number;
  liquidityRisk: number;
  operationalRisk: number;
  concentrationRisk: number;
  var95: number;
  var99: number;
  conditionalVar: number;
  stressTestResults: StressTestResult[];
}

interface StressTestResult {
  scenario: string;
  impact: number;
  probability: number;
  description: string;
  mitigation: string[];
}

interface BenchmarkComparison {
  benchmark: string;
  period: string;
  portfolioReturn: number;
  benchmarkReturn: number;
  activeReturn: number;
  trackingError: number;
  informationRatio: number;
}

interface CashFlowProjection {
  date: Date;
  operatingCashFlow: number;
  capitalExpenditure: number;
  financingCashFlow: number;
  netCashFlow: number;
  cumulativeCashFlow: number;
  discountedCashFlow: number;
}

interface InvestmentScenario {
  scenarioId: string;
  name: string;
  probability: number;
  expectedReturn: number;
  worstCase: number;
  bestCase: number;
  volatility: number;
  description: string;
  keyAssumptions: string[];
}

interface PortfolioOptimization {
  currentAllocation: AssetAllocation[];
  optimizedAllocation: AssetAllocation[];
  improvementPotential: number;
  riskReduction: number;
  returnEnhancement: number;
  recommendations: OptimizationRecommendation[];
}

interface OptimizationRecommendation {
  action: string;
  asset: string;
  currentWeight: number;
  recommendedWeight: number;
  expectedImpact: number;
  rationale: string;
  timeframe: string;
}

interface AdvancedInvestmentPerformanceDashboardProps {
  portfolioId?: string;
  projectId?: string;
  viewMode?: 'portfolio' | 'project' | 'comparative';
}

export default function AdvancedInvestmentPerformanceDashboard({ 
  portfolioId = 'default',
  projectId = 'fitzgerald-gardens',
  viewMode = 'project'
}: AdvancedInvestmentPerformanceDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'risk' | 'optimization' | 'scenarios' | 'analysis'>('overview');
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y' | '2Y' | '5Y' | 'ALL'>('1Y');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string>('totalReturn');
  const [benchmarkMode, setBenchmarkMode] = useState<'market' | 'peer' | 'custom'>('market');
  const [riskMode, setRiskMode] = useState<'absolute' | 'relative' | 'probabilistic'>('absolute');
  const [optimizationTarget, setOptimizationTarget] = useState<'return' | 'risk' | 'sharpe'>('sharpe');

  // Get project configuration
  const config = fitzgeraldGardensConfig;
  const units = realDataService.getUnits();

  // Calculate comprehensive investment metrics
  const investmentMetrics = useMemo<InvestmentPerformanceMetrics>(() => {
    const initialInvestment = config.totalInvestment;
    const currentValue = config.totalRevenue * 0.78; // 78% of total revenue as current value
    const totalReturn = currentValue - initialInvestment;
    const totalReturnPercentage = (totalReturn / initialInvestment) * 100;
    
    // Advanced calculations
    const timeInYears = 2.1; // Project duration
    const annualizedReturn = Math.pow(currentValue / initialInvestment, 1/timeInYears) - 1;
    
    return {
      currentValue,
      initialInvestment,
      totalReturn,
      totalReturnPercentage,
      annualizedReturn: annualizedReturn * 100,
      volatility: 12.5,
      sharpeRatio: 1.84,
      maxDrawdown: -8.2,
      roi: totalReturnPercentage,
      irr: 18.7,
      npv: totalReturn * 0.85, // Discounted
      paybackPeriod: 3.2,
      cashOnCashReturn: 23.1,
      leveragedReturn: 31.6,
      riskAdjustedReturn: 15.9,
      marketComparison: 5.8 // Outperformance vs market
    };
  }, [config]);

  // Performance timeline data
  const performanceTimeline = useMemo<PerformanceTimeframe[]>(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const date = new Date(2023, i, 1);
      const baseReturn = (i / 24) * investmentMetrics.totalReturnPercentage;
      const volatility = 3 + Math.sin(i * 0.5) * 2;
      const benchmark = baseReturn * 0.6; // Market benchmark lower
      
      return {
        period: date.toISOString().substring(0, 7),
        value: investmentMetrics.initialInvestment * (1 + baseReturn/100),
        return: baseReturn + (Math.random() * 4 - 2),
        benchmark: benchmark + (Math.random() * 2 - 1),
        volatility,
        date
      };
    });
  }, [investmentMetrics]);

  // Asset allocation data
  const assetAllocation = useMemo<AssetAllocation[]>(() => [
    {
      category: 'Residential Units',
      allocation: 75,
      performance: 19.2,
      risk: 14.5,
      target: 70,
      variance: 5
    },
    {
      category: 'Commercial Space',
      allocation: 15,
      performance: 12.8,
      risk: 9.2,
      target: 20,
      variance: -5
    },
    {
      category: 'Infrastructure',
      allocation: 8,
      performance: 8.5,
      risk: 6.1,
      target: 8,
      variance: 0
    },
    {
      category: 'Reserve Fund',
      allocation: 2,
      performance: 3.2,
      risk: 1.5,
      target: 2,
      variance: 0
    }
  ], []);

  // Risk metrics
  const riskMetrics = useMemo<RiskMetrics>(() => ({
    overallRisk: 7.2,
    marketRisk: 6.8,
    creditRisk: 2.1,
    liquidityRisk: 3.4,
    operationalRisk: 4.5,
    concentrationRisk: 5.2,
    var95: -4.2,
    var99: -7.8,
    conditionalVar: -9.1,
    stressTestResults: [
      {
        scenario: 'Economic Recession',
        impact: -18.5,
        probability: 0.15,
        description: 'Severe economic downturn affecting property values',
        mitigation: ['Diversification', 'Hedging strategies', 'Liquidity reserves']
      },
      {
        scenario: 'Interest Rate Shock',
        impact: -12.3,
        probability: 0.25,
        description: 'Rapid interest rate increases affecting affordability',
        mitigation: ['Fixed-rate financing', 'Pricing flexibility', 'Accelerated sales']
      },
      {
        scenario: 'Supply Oversupply',
        impact: -8.7,
        probability: 0.20,
        description: 'Market oversupply reducing demand and prices',
        mitigation: ['Differentiation strategy', 'Marketing enhancement', 'Pricing optimization']
      }
    ]
  }), []);

  // Cash flow projections
  const cashFlowProjections = useMemo<CashFlowProjection[]>(() => {
    return Array.from({ length: 36 }, (_, i) => {
      const date = new Date(2024, i, 1);
      const monthlyRevenue = (config.totalRevenue / 36) * (0.5 + i * 0.02);
      const monthlyExpenses = monthlyRevenue * 0.25;
      const capex = i < 12 ? monthlyRevenue * 0.4 : monthlyRevenue * 0.1;
      const netCashFlow = monthlyRevenue - monthlyExpenses - capex;
      const discountRate = 0.08/12;
      const discountedCashFlow = netCashFlow / Math.pow(1 + discountRate, i);
      
      return {
        date,
        operatingCashFlow: monthlyRevenue - monthlyExpenses,
        capitalExpenditure: capex,
        financingCashFlow: i === 0 ? -config.totalInvestment : 0,
        netCashFlow,
        cumulativeCashFlow: 0, // Will be calculated
        discountedCashFlow
      };
    });
  }, [config]);

  // Calculate cumulative cash flow
  cashFlowProjections.forEach((item, index) => {
    item.cumulativeCashFlow = index === 0 
      ? item.netCashFlow 
      : cashFlowProjections[index - 1].cumulativeCashFlow + item.netCashFlow;
  });

  // Investment scenarios
  const investmentScenarios = useMemo<InvestmentScenario[]>(() => [
    {
      scenarioId: 'base-case',
      name: 'Base Case',
      probability: 0.60,
      expectedReturn: investmentMetrics.totalReturnPercentage,
      worstCase: investmentMetrics.totalReturnPercentage - 8,
      bestCase: investmentMetrics.totalReturnPercentage + 12,
      volatility: 12.5,
      description: 'Most likely scenario based on current market conditions',
      keyAssumptions: ['Stable economic growth', 'Normal market conditions', 'Expected absorption rates']
    },
    {
      scenarioId: 'bull-case',
      name: 'Bull Case',
      probability: 0.25,
      expectedReturn: investmentMetrics.totalReturnPercentage + 18,
      worstCase: investmentMetrics.totalReturnPercentage + 8,
      bestCase: investmentMetrics.totalReturnPercentage + 35,
      volatility: 18.2,
      description: 'Optimistic scenario with strong market growth',
      keyAssumptions: ['Strong economic growth', 'High demand', 'Limited supply', 'Premium pricing']
    },
    {
      scenarioId: 'bear-case',
      name: 'Bear Case',
      probability: 0.15,
      expectedReturn: investmentMetrics.totalReturnPercentage - 15,
      worstCase: investmentMetrics.totalReturnPercentage - 25,
      bestCase: investmentMetrics.totalReturnPercentage - 5,
      volatility: 22.1,
      description: 'Conservative scenario with market challenges',
      keyAssumptions: ['Economic slowdown', 'Reduced demand', 'Increased competition', 'Pricing pressure']
    }
  ], [investmentMetrics]);

  // Portfolio optimization
  const portfolioOptimization = useMemo<PortfolioOptimization>(() => ({
    currentAllocation: assetAllocation,
    optimizedAllocation: assetAllocation.map(asset => ({
      ...asset,
      allocation: asset.target + (Math.random() * 4 - 2) // Slight optimization adjustments
    })),
    improvementPotential: 2.3,
    riskReduction: 8.7,
    returnEnhancement: 1.9,
    recommendations: [
      {
        action: 'Increase',
        asset: 'Commercial Space',
        currentWeight: 15,
        recommendedWeight: 20,
        expectedImpact: 1.2,
        rationale: 'Higher risk-adjusted returns and diversification benefits',
        timeframe: '6 months'
      },
      {
        action: 'Decrease',
        asset: 'Residential Units',
        currentWeight: 75,
        recommendedWeight: 70,
        expectedImpact: 0.7,
        rationale: 'Reduce concentration risk while maintaining core exposure',
        timeframe: '3 months'
      }
    ]
  }), [assetAllocation]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  }, []);

  // Color scheme for charts
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Investment Performance Analytics</h1>
          <p className="mt-2 text-gray-600">Advanced portfolio analysis and performance monitoring</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1M">1 Month</option>
            <option value="3M">3 Months</option>
            <option value="6M">6 Months</option>
            <option value="1Y">1 Year</option>
            <option value="2Y">2 Years</option>
            <option value="5Y">5 Years</option>
            <option value="ALL">All Time</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Return</p>
              <p className="text-2xl font-bold text-gray-900">
                {investmentMetrics.totalReturnPercentage.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">
              +{investmentMetrics.marketComparison.toFixed(1)}% vs market
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Annualized Return</p>
              <p className="text-2xl font-bold text-gray-900">
                {investmentMetrics.annualizedReturn.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <Target className="h-4 w-4 text-blue-500 mr-1" />
            <span className="text-sm text-gray-600">IRR: {investmentMetrics.irr.toFixed(1)}%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sharpe Ratio</p>
              <p className="text-2xl font-bold text-gray-900">
                {investmentMetrics.sharpeRatio.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <Star className="h-4 w-4 text-purple-500 mr-1" />
            <span className="text-sm text-gray-600">Risk-adjusted</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Max Drawdown</p>
              <p className="text-2xl font-bold text-red-900">
                {investmentMetrics.maxDrawdown.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <Shield className="h-4 w-4 text-red-500 mr-1" />
            <span className="text-sm text-gray-600">Risk control</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'overview', label: 'Overview', icon: Eye },
            { key: 'performance', label: 'Performance', icon: TrendingUp },
            { key: 'risk', label: 'Risk Analysis', icon: Shield },
            { key: 'optimization', label: 'Optimization', icon: Target },
            { key: 'scenarios', label: 'Scenarios', icon: Layers },
            { key: 'analysis', label: 'Analysis', icon: Calculator }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Performance Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Performance Timeline</h3>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="totalReturn">Total Return</option>
                  <option value="value">Portfolio Value</option>
                  <option value="volatility">Volatility</option>
                </select>
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={performanceTimeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="return"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="benchmark"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Asset Allocation and Cash Flow */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Asset Allocation */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Asset Allocation</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={assetAllocation}
                      dataKey="allocation"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                    >
                      {assetAllocation.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {assetAllocation.map((asset, index) => (
                  <div key={asset.category} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: colors[index % colors.length] }}
                      />
                      <span className="text-sm text-gray-600">{asset.category}</span>
                    </div>
                    <span className="text-sm font-medium">{asset.allocation}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cash Flow Projections */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Cash Flow Projections</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={cashFlowProjections.slice(0, 12)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short' })}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`€${(value/1000000).toFixed(1)}M`, '']}
                    />
                    <Bar dataKey="operatingCashFlow" fill="#10b981" name="Operating Cash Flow" />
                    <Bar dataKey="capitalExpenditure" fill="#ef4444" name="Capital Expenditure" />
                    <Bar dataKey="netCashFlow" fill="#3b82f6" name="Net Cash Flow" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="space-y-6">
          {/* Performance Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Return Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Return</span>
                  <span className="font-medium">{investmentMetrics.totalReturnPercentage.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Annualized Return</span>
                  <span className="font-medium">{investmentMetrics.annualizedReturn.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IRR</span>
                  <span className="font-medium">{investmentMetrics.irr.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cash-on-Cash Return</span>
                  <span className="font-medium">{investmentMetrics.cashOnCashReturn.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Risk Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Volatility</span>
                  <span className="font-medium">{investmentMetrics.volatility.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sharpe Ratio</span>
                  <span className="font-medium">{investmentMetrics.sharpeRatio.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Drawdown</span>
                  <span className="font-medium text-red-600">{investmentMetrics.maxDrawdown.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">VaR (95%)</span>
                  <span className="font-medium text-red-600">{riskMetrics.var95.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Value Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Value</span>
                  <span className="font-medium">€{(investmentMetrics.currentValue/1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">NPV</span>
                  <span className="font-medium">€{(investmentMetrics.npv/1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payback Period</span>
                  <span className="font-medium">{investmentMetrics.paybackPeriod.toFixed(1)} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">vs Market</span>
                  <span className="font-medium text-green-600">+{investmentMetrics.marketComparison.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Attribution */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Attribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={assetAllocation} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="category" width={120} />
                  <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                  <Bar dataKey="performance" fill="#3b82f6" name="Performance" />
                  <ReferenceLine x={investmentMetrics.totalReturnPercentage} stroke="#ef4444" strokeDasharray="5 5" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'risk' && (
        <div className="space-y-6">
          {/* Risk Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Risk Score</h4>
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">{riskMetrics.overallRisk}/10</span>
                  </div>
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#3b82f6"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${(riskMetrics.overallRisk / 10) * 351.86} 351.86`}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-center text-sm text-gray-600 mt-2">Moderate Risk</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Risk Breakdown</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Market Risk</span>
                  <div className="flex items-center">
                    <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                      <div 
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: `${(riskMetrics.marketRisk / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{riskMetrics.marketRisk}/10</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Credit Risk</span>
                  <div className="flex items-center">
                    <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                      <div 
                        className="h-2 bg-green-500 rounded-full"
                        style={{ width: `${(riskMetrics.creditRisk / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{riskMetrics.creditRisk}/10</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Liquidity Risk</span>
                  <div className="flex items-center">
                    <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                      <div 
                        className="h-2 bg-yellow-500 rounded-full"
                        style={{ width: `${(riskMetrics.liquidityRisk / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{riskMetrics.liquidityRisk}/10</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Operational Risk</span>
                  <div className="flex items-center">
                    <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                      <div 
                        className="h-2 bg-orange-500 rounded-full"
                        style={{ width: `${(riskMetrics.operationalRisk / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{riskMetrics.operationalRisk}/10</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Value at Risk</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">VaR 95%</span>
                    <span className="font-medium text-red-600">{riskMetrics.var95}%</span>
                  </div>
                  <p className="text-xs text-gray-500">5% chance of losing more than this</p>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">VaR 99%</span>
                    <span className="font-medium text-red-600">{riskMetrics.var99}%</span>
                  </div>
                  <p className="text-xs text-gray-500">1% chance of losing more than this</p>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">CVaR</span>
                    <span className="font-medium text-red-600">{riskMetrics.conditionalVar}%</span>
                  </div>
                  <p className="text-xs text-gray-500">Expected loss in worst 1% scenarios</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stress Test Results */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Stress Test Results</h3>
            <div className="space-y-4">
              {riskMetrics.stressTestResults.map((test, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{test.scenario}</h4>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        Probability: {(test.probability * 100).toFixed(0)}%
                      </span>
                      <span className={`text-sm font-medium ${
                        test.impact > -10 ? 'text-yellow-600' : 
                        test.impact > -20 ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        Impact: {test.impact.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3">{test.description}</p>
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Mitigation Strategies:</p>
                    <div className="flex flex-wrap gap-2">
                      {test.mitigation.map((strategy, strategyIndex) => (
                        <span
                          key={strategyIndex}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {strategy}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'scenarios' && (
        <div className="space-y-6">
          {/* Scenario Comparison */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Investment Scenarios</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {investmentScenarios.map((scenario) => (
                <div key={scenario.scenarioId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{scenario.name}</h4>
                    <span className="text-sm text-gray-500">
                      {(scenario.probability * 100).toFixed(0)}% chance
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Return</span>
                      <span className="font-medium">{scenario.expectedReturn.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Best Case</span>
                      <span className="font-medium text-green-600">{scenario.bestCase.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Worst Case</span>
                      <span className="font-medium text-red-600">{scenario.worstCase.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Volatility</span>
                      <span className="font-medium">{scenario.volatility.toFixed(1)}%</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">{scenario.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {scenario.keyAssumptions.slice(0, 2).map((assumption, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {assumption}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scenario Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Scenario Comparison Chart</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="volatility" 
                    name="Volatility" 
                    unit="%" 
                    domain={['dataMin - 5', 'dataMax + 5']}
                  />
                  <YAxis 
                    dataKey="expectedReturn" 
                    name="Expected Return" 
                    unit="%" 
                    domain={['dataMin - 5', 'dataMax + 5']}
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter 
                    data={investmentScenarios} 
                    fill="#3b82f6"
                    shape="circle"
                    r={8}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'optimization' && (
        <div className="space-y-6">
          {/* Optimization Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Improvement Potential</p>
                  <p className="text-2xl font-bold text-green-600">
                    +{portfolioOptimization.improvementPotential.toFixed(1)}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Risk Reduction</p>
                  <p className="text-2xl font-bold text-blue-600">
                    -{portfolioOptimization.riskReduction.toFixed(1)}%
                  </p>
                </div>
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Return Enhancement</p>
                  <p className="text-2xl font-bold text-purple-600">
                    +{portfolioOptimization.returnEnhancement.toFixed(1)}%
                  </p>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Current vs Optimized Allocation */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Current vs Optimized Allocation</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={assetAllocation}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="allocation" fill="#3b82f6" name="Current" />
                  <Bar dataKey="target" fill="#10b981" name="Target" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Optimization Recommendations */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recommendations</h3>
            <div className="space-y-4">
              {portfolioOptimization.recommendations.map((rec, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        rec.action === 'Increase' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {rec.action}
                      </span>
                      <span className="ml-3 font-medium text-gray-900">{rec.asset}</span>
                    </div>
                    <span className="text-sm text-gray-500">{rec.timeframe}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Current Weight</p>
                      <p className="font-medium">{rec.currentWeight}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Recommended Weight</p>
                      <p className="font-medium">{rec.recommendedWeight}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Expected Impact</p>
                      <p className="font-medium text-green-600">+{rec.expectedImpact.toFixed(1)}%</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm">{rec.rationale}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}