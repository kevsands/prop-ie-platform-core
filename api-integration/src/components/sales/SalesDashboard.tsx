'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Euro, 
  Clock,
  Target,
  Zap,
  Eye,
  Heart,
  Calendar,
  Phone,
  Mail,
  MessageSquare,
  Award,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  Home,
  Star,
  Sparkles,
  Brain,
  ArrowUp,
  ArrowDown,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

interface SalesDashboardProps {
  developmentId: string;
  agentId?: string;
  timeframe?: '24h' | '7d' | '30d' | '90d';
  className?: string;
}

interface SalesMetrics {
  totalRevenue: number;
  unitsReserved: number;
  unitsSold: number;
  unitsAvailable: number;
  averagePrice: number;
  conversionRate: number;
  averageTimeToSale: number;
  totalLeads: number;
  hotLeads: number;
  viewingsScheduled: number;
  htbApplications: number;
  pipelineValue: number;
}

interface PerformanceData {
  leads: {
    total: number;
    new: number;
    contacted: number;
    qualified: number;
    converted: number;
  };
  activities: {
    viewings: number;
    htbCalculations: number;
    brochureDownloads: number;
    virtualTours: number;
    contactForms: number;
  };
  conversion: {
    leadToViewing: number;
    viewingToOffer: number;
    offerToSale: number;
    overall: number;
  };
  revenue: {
    confirmed: number;
    pipeline: number;
    target: number;
    projected: number;
  };
}

interface AgentPerformance {
  agentId: string;
  agentName: string;
  leadsAssigned: number;
  conversionRate: number;
  averageResponseTime: number;
  totalRevenue: number;
  viewingsBooked: number;
  salesClosed: number;
  rating: number;
  rank: number;
}

interface PricingInsight {
  unitId: string;
  unitNumber: string;
  currentPrice: number;
  recommendedPrice: number;
  priceChange: number;
  confidence: number;
  reasoning: string[];
  urgency: 'low' | 'medium' | 'high' | 'immediate';
}

export default function SalesDashboard({
  developmentId,
  agentId,
  timeframe = '30d',
  className = ''
}: SalesDashboardProps) {
  const [metrics, setMetrics] = useState<SalesMetrics | null>(null);
  const [performance, setPerformance] = useState<PerformanceData | null>(null);
  const [agentPerformance, setAgentPerformance] = useState<AgentPerformance[]>([]);
  const [pricingInsights, setPricingInsights] = useState<PricingInsight[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'units' | 'leads' | 'conversion'>('revenue');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadDashboardData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      loadDashboardData();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [developmentId, agentId, timeframe]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await generateDashboardData();
      setMetrics(data.metrics);
      setPerformance(data.performance);
      setAgentPerformance(data.agentPerformance);
      setPricingInsights(data.pricingInsights);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateDashboardData = async () => {
    // Simulate comprehensive dashboard data for Fitzgerald Gardens
    const metrics: SalesMetrics = {
      totalRevenue: 6480000, // €6.48M from 15 units
      unitsReserved: 3,
      unitsSold: 12, // Government sold units
      unitsAvailable: 15,
      averagePrice: 442000,
      conversionRate: 28.5, // 28.5% lead to sale conversion
      averageTimeToSale: 18, // 18 days average
      totalLeads: 127,
      hotLeads: 23,
      viewingsScheduled: 31,
      htbApplications: 18,
      pipelineValue: 2650000 // €2.65M in active pipeline
    };

    const performance: PerformanceData = {
      leads: {
        total: 127,
        new: 8,
        contacted: 34,
        qualified: 45,
        converted: 12
      },
      activities: {
        viewings: 68,
        htbCalculations: 89,
        brochureDownloads: 156,
        virtualTours: 203,
        contactForms: 67
      },
      conversion: {
        leadToViewing: 53.5, // 53.5% of leads book viewing
        viewingToOffer: 44.1, // 44.1% of viewings result in offer
        offerToSale: 85.7, // 85.7% of offers complete
        overall: 28.5 // Overall conversion rate
      },
      revenue: {
        confirmed: 6480000,
        pipeline: 2650000,
        target: 12000000, // Target for all 27 units
        projected: 11800000 // Projected based on current performance
      }
    };

    const agentPerformance: AgentPerformance[] = [
      {
        agentId: 'agent-1',
        agentName: 'Sarah Murphy',
        leadsAssigned: 45,
        conversionRate: 31.1,
        averageResponseTime: 8, // 8 minutes
        totalRevenue: 2640000,
        viewingsBooked: 28,
        salesClosed: 6,
        rating: 4.9,
        rank: 1
      },
      {
        agentId: 'agent-2', 
        agentName: 'Michael O\'Brien',
        leadsAssigned: 38,
        conversionRate: 26.3,
        averageResponseTime: 12,
        totalRevenue: 2200000,
        viewingsBooked: 22,
        salesClosed: 4,
        rating: 4.7,
        rank: 2
      },
      {
        agentId: 'agent-3',
        agentName: 'Emma Walsh',
        leadsAssigned: 44,
        conversionRate: 27.3,
        averageResponseTime: 15,
        totalRevenue: 1640000,
        viewingsBooked: 18,
        salesClosed: 2,
        rating: 4.6,
        rank: 3
      }
    ];

    const pricingInsights: PricingInsight[] = [
      {
        unitId: 'unit-25',
        unitNumber: 'FG-P1-025',
        currentPrice: 520000,
        recommendedPrice: 545000,
        priceChange: 25000,
        confidence: 92,
        reasoning: ['Penthouse premium demand', 'Only 3 penthouse units left', 'High viewing activity'],
        urgency: 'high'
      },
      {
        unitId: 'unit-15',
        unitNumber: 'FG-P1-015',
        currentPrice: 435000,
        recommendedPrice: 442000,
        priceChange: 7000,
        confidence: 85,
        reasoning: ['Strong market demand', 'Multiple viewings scheduled', 'Below market average'],
        urgency: 'medium'
      }
    ];

    return {
      metrics,
      performance,
      agentPerformance,
      pricingInsights
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getChangeIndicator = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    const isPositive = change > 0;
    
    return (
      <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
        <span>{Math.abs(change).toFixed(1)}%</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!metrics || !performance) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <p>Unable to load dashboard data</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Sales Dashboard</h2>
            <p className="text-gray-600">Fitzgerald Gardens Phase 1 Performance</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
            <button
              onClick={loadDashboardData}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Metric Selector */}
        <div className="flex gap-1 mt-4">
          {[
            { id: 'revenue', label: 'Revenue', icon: Euro },
            { id: 'units', label: 'Units', icon: Home },
            { id: 'leads', label: 'Leads', icon: Users },
            { id: 'conversion', label: 'Conversion', icon: Target }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedMetric(id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedMetric === id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Euro className="w-8 h-8 text-green-600" />
              {getChangeIndicator(metrics.totalRevenue, 5200000)}
            </div>
            <div className="text-2xl font-bold text-green-700">{formatCurrency(metrics.totalRevenue)}</div>
            <div className="text-sm text-green-600">Total Revenue</div>
            <div className="text-xs text-gray-600 mt-1">{metrics.unitsSold} units sold</div>
          </div>

          {/* Pipeline Value */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              {getChangeIndicator(metrics.pipelineValue, 2100000)}
            </div>
            <div className="text-2xl font-bold text-blue-700">{formatCurrency(metrics.pipelineValue)}</div>
            <div className="text-sm text-blue-600">Pipeline Value</div>
            <div className="text-xs text-gray-600 mt-1">{metrics.hotLeads} hot leads</div>
          </div>

          {/* Available Units */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Home className="w-8 h-8 text-orange-600" />
              <div className="flex items-center gap-1 text-sm text-orange-600">
                <Zap className="w-3 h-3" />
                <span>55% sold</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-orange-700">{metrics.unitsAvailable}</div>
            <div className="text-sm text-orange-600">Units Available</div>
            <div className="text-xs text-gray-600 mt-1">{metrics.unitsReserved} reserved</div>
          </div>

          {/* Conversion Rate */}
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-purple-600" />
              {getChangeIndicator(metrics.conversionRate, 24.2)}
            </div>
            <div className="text-2xl font-bold text-purple-700">{formatPercentage(metrics.conversionRate)}</div>
            <div className="text-sm text-purple-600">Conversion Rate</div>
            <div className="text-xs text-gray-600 mt-1">{metrics.averageTimeToSale} days avg. sale time</div>
          </div>
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Funnel */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Funnel</h3>
            <div className="space-y-3">
              {[
                { label: 'Total Leads', value: performance.leads.total, width: 100, color: 'bg-blue-500' },
                { label: 'Qualified', value: performance.leads.qualified, width: 85, color: 'bg-purple-500' },
                { label: 'Viewed Property', value: 34, width: 65, color: 'bg-green-500' },
                { label: 'Made Offer', value: 18, width: 45, color: 'bg-orange-500' },
                { label: 'Completed Sale', value: performance.leads.converted, width: 25, color: 'bg-red-500' }
              ].map((stage, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-32 text-sm text-gray-700">{stage.label}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div 
                      className={`${stage.color} h-6 rounded-full flex items-center justify-center text-white text-sm font-medium`}
                      style={{ width: `${stage.width}%` }}
                    >
                      {stage.value}
                    </div>
                  </div>
                  <div className="w-12 text-sm text-gray-600">{formatPercentage(stage.width)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Breakdown */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Buyer Activities</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Viewings', value: performance.activities.viewings, icon: Eye, color: 'text-blue-600' },
                { label: 'HTB Calcs', value: performance.activities.htbCalculations, icon: DollarSign, color: 'text-green-600' },
                { label: 'Virtual Tours', value: performance.activities.virtualTours, icon: Activity, color: 'text-purple-600' },
                { label: 'Contact Forms', value: performance.activities.contactForms, icon: Mail, color: 'text-orange-600' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <activity.icon className={`w-6 h-6 ${activity.color}`} />
                  <div>
                    <div className="text-xl font-bold text-gray-900">{activity.value}</div>
                    <div className="text-sm text-gray-600">{activity.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Agent Performance */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Performance</h3>
          <div className="grid gap-4">
            {agentPerformance.map((agent, index) => (
              <div key={agent.agentId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">#{agent.rank}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{agent.agentName}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{agent.leadsAssigned} leads</span>
                        <span>•</span>
                        <span>{formatPercentage(agent.conversionRate)} conversion</span>
                        <span>•</span>
                        <span>{agent.averageResponseTime}m response</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{formatCurrency(agent.totalRevenue)}</div>
                      <div className="text-sm text-gray-600">{agent.salesClosed} sales closed</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{agent.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Insights */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">AI Pricing Insights</h3>
            <div className="flex items-center gap-2 text-sm text-purple-600">
              <Brain className="w-4 h-4" />
              <span>Powered by Dynamic Pricing Engine</span>
            </div>
          </div>
          
          <div className="grid gap-4">
            {pricingInsights.map((insight) => (
              <div 
                key={insight.unitId} 
                className={`border rounded-lg p-4 ${
                  insight.urgency === 'high' ? 'border-orange-300 bg-orange-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-gray-900">{insight.unitNumber}</h4>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      insight.urgency === 'high' ? 'bg-orange-100 text-orange-700' :
                      insight.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {insight.urgency} priority
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Sparkles className="w-3 h-3" />
                      <span>{insight.confidence}% confidence</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Current: {formatCurrency(insight.currentPrice)}</div>
                    <div className="text-lg font-bold text-green-600">
                      Recommended: {formatCurrency(insight.recommendedPrice)}
                    </div>
                    <div className="text-sm text-green-600">
                      +{formatCurrency(insight.priceChange)} increase
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  <strong>Reasoning:</strong> {insight.reasoning.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Generate Sales Report
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Update Pricing
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Contact Hot Leads
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}