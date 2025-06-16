'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
  FastForward,
  Wifi,
  WifiOff,
  Signal,
  Antenna,
  Radar,
  Satellite,
  Rss,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Server,
  HardDrive,
  MemoryStick,
  CloudDownload,
  CloudUpload
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
  Radar as RechartsRadar,
  ComposedChart,
  Scatter,
  ScatterChart,
  ReferenceLine,
  TreeMap,
  Sankey,
  FunnelChart,
  Funnel,
  LabelList,
  RadialBarChart,
  RadialBar,
  Legend
} from 'recharts';
import { fitzgeraldGardensConfig } from '@/data/fitzgerald-gardens-config';
import { realDataService } from '@/services/RealDataService';
import { aiMarketAnalysisEngine } from '@/services/AIMarketAnalysisEngine';
import { competitiveAnalysisService } from '@/services/CompetitiveAnalysisService';

interface MarketDataPoint {
  timestamp: Date;
  metric: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  source: string;
}

interface RealTimeMetric {
  id: string;
  name: string;
  currentValue: number;
  previousValue: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  unit: string;
  format: 'number' | 'currency' | 'percentage';
  category: 'pricing' | 'demand' | 'supply' | 'economic' | 'sentiment' | 'activity';
  importance: 'critical' | 'high' | 'medium' | 'low';
  lastUpdated: Date;
  updateFrequency: 'real-time' | 'hourly' | 'daily' | 'weekly';
  dataPoints: DataPoint[];
  alerts: MetricAlert[];
}

interface DataPoint {
  timestamp: Date;
  value: number;
  volume?: number;
  quality: number; // 0-1
}

interface MetricAlert {
  id: string;
  type: 'threshold' | 'trend' | 'anomaly' | 'opportunity';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  threshold?: number;
  currentValue: number;
  triggeredAt: Date;
  acknowledged: boolean;
  actions: string[];
}

interface MarketSentiment {
  overall: number; // -1 to 1
  categories: SentimentCategory[];
  sources: SentimentSource[];
  trends: SentimentTrend[];
  drivers: SentimentDriver[];
}

interface SentimentCategory {
  category: string;
  sentiment: number; // -1 to 1
  volume: number;
  change: number;
  topics: string[];
}

interface SentimentSource {
  source: string;
  sentiment: number;
  reliability: number; // 0-1
  volume: number;
  lastUpdate: Date;
}

interface SentimentTrend {
  period: string;
  sentiment: number;
  volume: number;
  keyEvents: string[];
}

interface SentimentDriver {
  factor: string;
  impact: number; // -1 to 1
  confidence: number; // 0-1
  trend: 'strengthening' | 'weakening' | 'stable';
}

interface CompetitiveIntelligence {
  competitors: CompetitorSnapshot[];
  marketShifts: MarketShift[];
  opportunities: MarketOpportunity[];
  threats: MarketThreat[];
  benchmarks: BenchmarkUpdate[];
}

interface CompetitorSnapshot {
  competitorId: string;
  name: string;
  activity: CompetitorActivity[];
  pricing: PricingUpdate[];
  marketing: MarketingActivity[];
  sales: SalesActivity[];
  alerts: CompetitorAlert[];
}

interface CompetitorActivity {
  type: 'pricing' | 'marketing' | 'sales' | 'product' | 'strategic';
  activity: string;
  impact: number; // 0-10
  timestamp: Date;
  details: string;
}

interface PricingUpdate {
  unitType: string;
  previousPrice: number;
  currentPrice: number;
  change: number;
  effectiveDate: Date;
  reason?: string;
}

interface MarketingActivity {
  campaign: string;
  type: string;
  budget: number;
  reach: number;
  startDate: Date;
  performance: number; // 0-10
}

interface SalesActivity {
  metric: string;
  value: number;
  change: number;
  period: string;
  benchmark: number;
}

interface CompetitorAlert {
  type: 'price-change' | 'new-launch' | 'marketing-surge' | 'sales-spike';
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  impact: number; // 0-10
  timestamp: Date;
}

interface MarketShift {
  shift: string;
  magnitude: number; // 0-10
  direction: 'positive' | 'negative' | 'neutral';
  timeframe: string;
  indicators: string[];
  implications: string[];
}

interface MarketOpportunity {
  opportunity: string;
  potential: number; // 0-10
  timeframe: string;
  requirements: string[];
  confidence: number; // 0-1
}

interface MarketThreat {
  threat: string;
  severity: number; // 0-10
  probability: number; // 0-1
  timeframe: string;
  mitigation: string[];
}

interface BenchmarkUpdate {
  metric: string;
  ourValue: number;
  marketAverage: number;
  bestInClass: number;
  percentile: number;
  trend: 'improving' | 'declining' | 'stable';
}

interface EconomicIndicator {
  indicator: string;
  value: number;
  change: number;
  impact: 'positive' | 'negative' | 'neutral';
  relevance: number; // 0-10
  forecast: EconomicForecast[];
}

interface EconomicForecast {
  period: string;
  forecast: number;
  confidence: number; // 0-1
  scenario: 'optimistic' | 'base' | 'pessimistic';
}

interface PropertyMarketData {
  transactions: TransactionData[];
  pricing: PricingData[];
  inventory: InventoryData[];
  demand: DemandData[];
  absorption: AbsorptionData[];
}

interface TransactionData {
  date: Date;
  volume: number;
  value: number;
  averagePrice: number;
  medianPrice: number;
  region: string;
  propertyType: string;
}

interface PricingData {
  date: Date;
  pricePerSqFt: number;
  priceIndex: number;
  change: number;
  region: string;
  segment: string;
}

interface InventoryData {
  date: Date;
  totalInventory: number;
  newListings: number;
  soldUnits: number;
  monthsOfSupply: number;
  region: string;
}

interface DemandData {
  date: Date;
  inquiries: number;
  viewings: number;
  offers: number;
  demandIndex: number;
  region: string;
}

interface AbsorptionData {
  date: Date;
  absorptionRate: number;
  timeOnMarket: number;
  salesVelocity: number;
  region: string;
  segment: string;
}

interface RealTimeMarketIntelligenceDashboardProps {
  refreshInterval?: number; // seconds
  alertThresholds?: Record<string, number>;
  dataRetention?: number; // hours
}

export default function RealTimeMarketIntelligenceDashboard({ 
  refreshInterval = 60,
  alertThresholds = {},
  dataRetention = 24
}: RealTimeMarketIntelligenceDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'pricing' | 'competitive' | 'sentiment' | 'economic' | 'alerts'>('overview');
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d' | '30d'>('24h');
  const [isRealTime, setIsRealTime] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('connected');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [alertsCount, setAlertsCount] = useState(0);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['pricing', 'demand', 'inventory']);

  // Simulate real-time data updates
  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // Simulate connection status changes occasionally
      if (Math.random() < 0.02) {
        setConnectionStatus('reconnecting');
        setTimeout(() => setConnectionStatus('connected'), 2000);
      }
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [isRealTime, refreshInterval]);

  // Generate real-time market metrics
  const realTimeMetrics = useMemo<RealTimeMetric[]>(() => {
    const baseTime = new Date();
    const generateDataPoints = (baseValue: number, hours: number = 24) => {
      return Array.from({ length: hours }, (_, i) => ({
        timestamp: new Date(baseTime.getTime() - (hours - i) * 60 * 60 * 1000),
        value: baseValue + (Math.random() - 0.5) * baseValue * 0.1,
        quality: 0.8 + Math.random() * 0.2
      }));
    };

    return [
      {
        id: 'average-price',
        name: 'Average Property Price',
        currentValue: 425000,
        previousValue: 420000,
        change: 5000,
        changePercent: 1.19,
        trend: 'up',
        unit: '€',
        format: 'currency',
        category: 'pricing',
        importance: 'critical',
        lastUpdated: lastUpdate,
        updateFrequency: 'daily',
        dataPoints: generateDataPoints(425000, 168), // 7 days
        alerts: [
          {
            id: 'price-alert-1',
            type: 'threshold',
            severity: 'medium',
            message: 'Average price increased by 1.19% in 24h',
            currentValue: 425000,
            triggeredAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            acknowledged: false,
            actions: ['Review pricing strategy', 'Analyze competitor pricing']
          }
        ]
      },
      {
        id: 'market-demand',
        name: 'Market Demand Index',
        currentValue: 87.3,
        previousValue: 84.1,
        change: 3.2,
        changePercent: 3.8,
        trend: 'up',
        unit: '',
        format: 'number',
        category: 'demand',
        importance: 'critical',
        lastUpdated: lastUpdate,
        updateFrequency: 'hourly',
        dataPoints: generateDataPoints(87.3, 48), // 2 days
        alerts: []
      },
      {
        id: 'inventory-levels',
        name: 'Available Inventory',
        currentValue: 234,
        previousValue: 267,
        change: -33,
        changePercent: -12.4,
        trend: 'down',
        unit: 'units',
        format: 'number',
        category: 'supply',
        importance: 'high',
        lastUpdated: lastUpdate,
        updateFrequency: 'daily',
        dataPoints: generateDataPoints(234, 168),
        alerts: [
          {
            id: 'inventory-alert-1',
            type: 'threshold',
            severity: 'high',
            message: 'Inventory levels dropped 12.4% - potential supply shortage',
            currentValue: 234,
            triggeredAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
            acknowledged: false,
            actions: ['Monitor competitor inventory', 'Adjust pricing strategy', 'Accelerate new releases']
          }
        ]
      },
      {
        id: 'absorption-rate',
        name: 'Sales Absorption Rate',
        currentValue: 8.7,
        previousValue: 7.2,
        change: 1.5,
        changePercent: 20.8,
        trend: 'up',
        unit: 'units/month',
        format: 'number',
        category: 'activity',
        importance: 'high',
        lastUpdated: lastUpdate,
        updateFrequency: 'daily',
        dataPoints: generateDataPoints(8.7, 720), // 30 days
        alerts: []
      },
      {
        id: 'interest-rates',
        name: 'Mortgage Interest Rates',
        currentValue: 4.25,
        previousValue: 4.35,
        change: -0.1,
        changePercent: -2.3,
        trend: 'down',
        unit: '%',
        format: 'percentage',
        category: 'economic',
        importance: 'critical',
        lastUpdated: lastUpdate,
        updateFrequency: 'daily',
        dataPoints: generateDataPoints(4.25, 168),
        alerts: []
      },
      {
        id: 'market-sentiment',
        name: 'Market Sentiment Score',
        currentValue: 0.73,
        previousValue: 0.68,
        change: 0.05,
        changePercent: 7.4,
        trend: 'up',
        unit: '',
        format: 'number',
        category: 'sentiment',
        importance: 'medium',
        lastUpdated: lastUpdate,
        updateFrequency: 'hourly',
        dataPoints: generateDataPoints(0.73, 24),
        alerts: []
      },
      {
        id: 'website-traffic',
        name: 'Property Portal Traffic',
        currentValue: 12547,
        previousValue: 11823,
        change: 724,
        changePercent: 6.1,
        trend: 'up',
        unit: 'visits',
        format: 'number',
        category: 'activity',
        importance: 'medium',
        lastUpdated: lastUpdate,
        updateFrequency: 'hourly',
        dataPoints: generateDataPoints(12547, 24),
        alerts: []
      },
      {
        id: 'competitor-activity',
        name: 'Competitive Activity Index',
        currentValue: 6.8,
        previousValue: 5.9,
        change: 0.9,
        changePercent: 15.3,
        trend: 'up',
        unit: '',
        format: 'number',
        category: 'sentiment',
        importance: 'high',
        lastUpdated: lastUpdate,
        updateFrequency: 'hourly',
        dataPoints: generateDataPoints(6.8, 48),
        alerts: [
          {
            id: 'competitor-alert-1',
            type: 'anomaly',
            severity: 'high',
            message: 'Unusual spike in competitor marketing activity detected',
            currentValue: 6.8,
            triggeredAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
            acknowledged: false,
            actions: ['Review competitor campaigns', 'Analyze market response', 'Consider counter-strategies']
          }
        ]
      }
    ];
  }, [lastUpdate]);

  // Calculate total alerts
  useEffect(() => {
    const totalAlerts = realTimeMetrics.reduce((sum, metric) => 
      sum + metric.alerts.filter(alert => !alert.acknowledged).length, 0
    );
    setAlertsCount(totalAlerts);
  }, [realTimeMetrics]);

  // Market sentiment data
  const marketSentiment = useMemo<MarketSentiment>(() => ({
    overall: 0.73,
    categories: [
      {
        category: 'Buyer Confidence',
        sentiment: 0.78,
        volume: 2340,
        change: 0.12,
        topics: ['Affordability', 'Investment potential', 'Market stability']
      },
      {
        category: 'Market Outlook',
        sentiment: 0.68,
        volume: 1890,
        change: 0.05,
        topics: ['Price trends', 'Supply levels', 'Economic factors']
      },
      {
        category: 'Developer Sentiment',
        sentiment: 0.72,
        volume: 980,
        change: 0.08,
        topics: ['Sales velocity', 'Profit margins', 'Construction costs']
      }
    ],
    sources: [
      {
        source: 'Social Media',
        sentiment: 0.74,
        reliability: 0.68,
        volume: 3200,
        lastUpdate: lastUpdate
      },
      {
        source: 'Property Forums',
        sentiment: 0.71,
        reliability: 0.82,
        volume: 1850,
        lastUpdate: lastUpdate
      },
      {
        source: 'News Coverage',
        sentiment: 0.69,
        reliability: 0.91,
        volume: 567,
        lastUpdate: lastUpdate
      }
    ],
    trends: Array.from({ length: 7 }, (_, i) => ({
      period: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      sentiment: 0.68 + (Math.random() * 0.1),
      volume: 1500 + Math.floor(Math.random() * 500),
      keyEvents: i === 3 ? ['Interest rate announcement'] : []
    })),
    drivers: [
      {
        factor: 'Interest Rate Changes',
        impact: -0.15,
        confidence: 0.89,
        trend: 'weakening'
      },
      {
        factor: 'Employment Growth',
        impact: 0.23,
        confidence: 0.76,
        trend: 'strengthening'
      },
      {
        factor: 'Supply Constraints',
        impact: 0.18,
        confidence: 0.82,
        trend: 'strengthening'
      }
    ]
  }), [lastUpdate]);

  // Competitive intelligence data
  const competitiveIntelligence = useMemo<CompetitiveIntelligence>(() => ({
    competitors: [
      {
        competitorId: 'riverside-gardens',
        name: 'Riverside Gardens',
        activity: [
          {
            type: 'pricing',
            activity: 'Price reduction on 2-bed units',
            impact: 7,
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
            details: '3% reduction on remaining Phase 1 units'
          },
          {
            type: 'marketing',
            activity: 'New digital campaign launch',
            impact: 6,
            timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000),
            details: 'Increased social media spend by 40%'
          }
        ],
        pricing: [
          {
            unitType: '2-bed apartment',
            previousPrice: 450000,
            currentPrice: 437000,
            change: -13000,
            effectiveDate: new Date(Date.now() - 6 * 60 * 60 * 1000),
            reason: 'End of phase promotion'
          }
        ],
        marketing: [
          {
            campaign: 'Waterfront Living',
            type: 'Digital',
            budget: 125000,
            reach: 285000,
            startDate: new Date(Date.now() - 18 * 60 * 60 * 1000),
            performance: 7
          }
        ],
        sales: [
          {
            metric: 'Monthly sales',
            value: 12,
            change: 3,
            period: 'December 2024',
            benchmark: 8
          }
        ],
        alerts: [
          {
            type: 'price-change',
            message: 'Riverside Gardens reduced 2-bed prices by 3%',
            severity: 'high',
            impact: 7,
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
          }
        ]
      }
    ],
    marketShifts: [
      {
        shift: 'Increased buyer preference for amenity-rich developments',
        magnitude: 7,
        direction: 'positive',
        timeframe: '3 months',
        indicators: ['Amenity-focused searches up 34%', 'Premium development inquiries +28%'],
        implications: ['Opportunity to highlight amenities', 'Justify premium positioning']
      }
    ],
    opportunities: [
      {
        opportunity: 'Gap in mid-market 3-bedroom segment',
        potential: 8,
        timeframe: '6 months',
        requirements: ['Product development', 'Marketing repositioning'],
        confidence: 0.73
      }
    ],
    threats: [
      {
        threat: 'New competitor entering market with aggressive pricing',
        severity: 6,
        probability: 0.65,
        timeframe: '9 months',
        mitigation: ['Strengthen value proposition', 'Enhance differentiation']
      }
    ],
    benchmarks: [
      {
        metric: 'Sales velocity',
        ourValue: 6.5,
        marketAverage: 8.2,
        bestInClass: 11.2,
        percentile: 34,
        trend: 'declining'
      }
    ]
  }), []);

  // Economic indicators
  const economicIndicators = useMemo<EconomicIndicator[]>(() => [
    {
      indicator: 'GDP Growth Rate',
      value: 3.2,
      change: 0.3,
      impact: 'positive',
      relevance: 8,
      forecast: [
        { period: 'Q1 2025', forecast: 3.4, confidence: 0.78, scenario: 'base' },
        { period: 'Q2 2025', forecast: 3.6, confidence: 0.71, scenario: 'base' }
      ]
    },
    {
      indicator: 'Unemployment Rate',
      value: 4.1,
      change: -0.2,
      impact: 'positive',
      relevance: 9,
      forecast: [
        { period: 'Q1 2025', forecast: 3.9, confidence: 0.82, scenario: 'base' },
        { period: 'Q2 2025', forecast: 3.8, confidence: 0.76, scenario: 'base' }
      ]
    },
    {
      indicator: 'Consumer Confidence',
      value: 78.5,
      change: 4.2,
      impact: 'positive',
      relevance: 7,
      forecast: [
        { period: 'Q1 2025', forecast: 81.2, confidence: 0.69, scenario: 'base' }
      ]
    }
  ], []);

  // Handle metric selection
  const handleMetricToggle = (metricId: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  // Get metric color based on trend and importance
  const getMetricColor = (metric: RealTimeMetric) => {
    if (metric.importance === 'critical' && metric.trend === 'down') return 'text-red-600';
    if (metric.importance === 'critical' && metric.trend === 'up') return 'text-green-600';
    if (metric.trend === 'up') return 'text-green-500';
    if (metric.trend === 'down') return 'text-red-500';
    return 'text-gray-600';
  };

  // Format metric value
  const formatMetricValue = (metric: RealTimeMetric) => {
    switch (metric.format) {
      case 'currency':
        return `€${(metric.currentValue / 1000).toFixed(0)}K`;
      case 'percentage':
        return `${metric.currentValue.toFixed(2)}%`;
      default:
        return metric.currentValue.toLocaleString();
    }
  };

  // Chart colors
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

  return (
    <div className="space-y-6">
      {/* Header with Real-time Status */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Radar size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Real-Time Market Intelligence</h1>
              <p className="text-gray-600">Live market data and competitive insights</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Connection Status */}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
            connectionStatus === 'connected' ? 'bg-green-100 text-green-700' :
            connectionStatus === 'reconnecting' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {connectionStatus === 'connected' ? <Wifi size={14} /> :
             connectionStatus === 'reconnecting' ? <RefreshCw size={14} className="animate-spin" /> :
             <WifiOff size={14} />}
            {connectionStatus === 'connected' ? 'Live' : 
             connectionStatus === 'reconnecting' ? 'Reconnecting...' : 'Disconnected'}
          </div>

          {/* Alerts */}
          {alertsCount > 0 && (
            <div className="relative">
              <button 
                onClick={() => setActiveTab('alerts')}
                className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm hover:bg-red-200"
              >
                <Bell size={14} />
                {alertsCount} Alert{alertsCount !== 1 ? 's' : ''}
              </button>
            </div>
          )}

          {/* Real-time Toggle */}
          <button
            onClick={() => setIsRealTime(!isRealTime)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              isRealTime ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {isRealTime ? <PlayCircle size={16} /> : <PauseCircle size={16} />}
            {isRealTime ? 'Live' : 'Paused'}
          </button>

          {/* Time Range */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1h">1 Hour</option>
            <option value="6h">6 Hours</option>
            <option value="24h">24 Hours</option>
            <option value="7d">7 Days</option>
            <option value="30d">30 Days</option>
          </select>

          {/* Last Update */}
          <div className="text-sm text-gray-500">
            Updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'overview', label: 'Overview', icon: Eye },
            { key: 'pricing', label: 'Pricing', icon: DollarSign },
            { key: 'competitive', label: 'Competitive', icon: Target },
            { key: 'sentiment', label: 'Sentiment', icon: Activity },
            { key: 'economic', label: 'Economic', icon: TrendingUp },
            { key: 'alerts', label: 'Alerts', icon: Bell }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm relative ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
              {tab.key === 'alerts' && alertsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {alertsCount}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {realTimeMetrics.slice(0, 4).map((metric) => (
              <div key={metric.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${
                    metric.importance === 'critical' ? 'bg-red-100' :
                    metric.importance === 'high' ? 'bg-orange-100' :
                    'bg-blue-100'
                  }`}>
                    {metric.category === 'pricing' && <DollarSign className="h-6 w-6 text-blue-600" />}
                    {metric.category === 'demand' && <TrendingUp className="h-6 w-6 text-green-600" />}
                    {metric.category === 'supply' && <Building className="h-6 w-6 text-purple-600" />}
                    {metric.category === 'activity' && <Activity className="h-6 w-6 text-orange-600" />}
                  </div>
                  <div className={`flex items-center text-sm ${getMetricColor(metric)}`}>
                    {metric.trend === 'up' ? <ArrowUpRight size={16} /> :
                     metric.trend === 'down' ? <ArrowDownRight size={16} /> :
                     <Minus size={16} />}
                    {Math.abs(metric.changePercent).toFixed(1)}%
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.name}</h3>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatMetricValue(metric)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {metric.changePercent > 0 ? '+' : ''}{metric.change.toLocaleString()} {metric.unit}
                  </div>
                </div>

                {metric.alerts.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center text-xs text-orange-600">
                      <AlertCircle size={12} className="mr-1" />
                      {metric.alerts.length} alert{metric.alerts.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Real-time Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Market Metrics Over Time */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Market Metrics Trends</h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-500">Live</span>
                  </div>
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={realTimeMetrics[0].dataPoints.slice(-24)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={(time) => new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(time) => new Date(time).toLocaleString()}
                      formatter={(value: number) => [`€${(value/1000).toFixed(0)}K`, 'Price']}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Market Sentiment */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Market Sentiment Analysis</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Overall Sentiment</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-20 h-3 rounded-full ${
                      marketSentiment.overall > 0.6 ? 'bg-green-200' :
                      marketSentiment.overall > 0.4 ? 'bg-yellow-200' : 'bg-red-200'
                    }`}>
                      <div 
                        className={`h-3 rounded-full ${
                          marketSentiment.overall > 0.6 ? 'bg-green-500' :
                          marketSentiment.overall > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${marketSentiment.overall * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {(marketSentiment.overall * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                {marketSentiment.categories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{category.category}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-2 rounded-full ${
                            category.sentiment > 0.6 ? 'bg-green-400' :
                            category.sentiment > 0.4 ? 'bg-yellow-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${category.sentiment * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8">
                        {(category.sentiment * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Sentiment Drivers</h4>
                <div className="space-y-2">
                  {marketSentiment.drivers.slice(0, 3).map((driver, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">{driver.factor}</span>
                      <div className="flex items-center gap-1">
                        {driver.impact > 0 ? 
                          <ArrowUpRight size={12} className="text-green-500" /> :
                          <ArrowDownRight size={12} className="text-red-500" />
                        }
                        <span className={`text-xs ${driver.impact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {Math.abs(driver.impact * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Economic Indicators */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Key Economic Indicators</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {economicIndicators.map((indicator, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{indicator.value}%</div>
                  <div className="text-sm text-gray-600 mb-2">{indicator.indicator}</div>
                  <div className={`flex items-center justify-center gap-1 text-sm ${
                    indicator.impact === 'positive' ? 'text-green-600' :
                    indicator.impact === 'negative' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {indicator.change > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {Math.abs(indicator.change).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pricing Tab */}
      {activeTab === 'pricing' && (
        <div className="space-y-6">
          {/* Pricing Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {realTimeMetrics.filter(m => m.category === 'pricing').map((metric) => (
              <div key={metric.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <div className={`text-sm ${getMetricColor(metric)}`}>
                    {metric.changePercent > 0 ? '+' : ''}{metric.changePercent.toFixed(1)}%
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.name}</h3>
                <div className="text-2xl font-bold text-gray-900">{formatMetricValue(metric)}</div>
              </div>
            ))}
          </div>

          {/* Pricing Analysis Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Price Movement Analysis</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={realTimeMetrics[0].dataPoints.slice(-48)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(time) => new Date(time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(time) => new Date(time).toLocaleDateString()}
                    formatter={(value: number) => [`€${(value/1000).toFixed(0)}K`, 'Average Price']}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Competitive Pricing */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Competitive Pricing Intelligence</h3>
            
            <div className="space-y-4">
              {competitiveIntelligence.competitors.map((competitor) => (
                <div key={competitor.competitorId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{competitor.name}</h4>
                    {competitor.alerts.some(a => a.type === 'price-change') && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                        Price Change
                      </span>
                    )}
                  </div>
                  
                  {competitor.pricing.map((price, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{price.unitType}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 line-through">
                          €{(price.previousPrice / 1000).toFixed(0)}K
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          €{(price.currentPrice / 1000).toFixed(0)}K
                        </span>
                        <span className={`text-xs ${price.change < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {price.change < 0 ? '' : '+'}{((price.change / price.previousPrice) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Competitive Tab */}
      {activeTab === 'competitive' && (
        <div className="space-y-6">
          {/* Competitor Activity Timeline */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Competitor Activity Timeline</h3>
            
            <div className="space-y-4">
              {competitiveIntelligence.competitors.flatMap(competitor => 
                competitor.activity.map(activity => ({
                  ...activity,
                  competitorName: competitor.name
                }))
              ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10).map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'pricing' ? 'bg-red-500' :
                    activity.type === 'marketing' ? 'bg-blue-500' :
                    activity.type === 'sales' ? 'bg-green-500' :
                    'bg-gray-500'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{activity.competitorName}</span>
                      <span className="text-xs text-gray-500">
                        {activity.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{activity.activity}</div>
                    <div className="text-xs text-gray-500 mt-1">{activity.details}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        activity.type === 'pricing' ? 'bg-red-100 text-red-800' :
                        activity.type === 'marketing' ? 'bg-blue-100 text-blue-800' :
                        activity.type === 'sales' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {activity.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        Impact: {activity.impact}/10
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Opportunities & Threats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Market Opportunities</h3>
              
              <div className="space-y-4">
                {competitiveIntelligence.opportunities.map((opportunity, index) => (
                  <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-green-900">{opportunity.opportunity}</span>
                      <span className="text-xs text-green-700">
                        Potential: {opportunity.potential}/10
                      </span>
                    </div>
                    <div className="text-sm text-green-700 mb-2">
                      Timeframe: {opportunity.timeframe}
                    </div>
                    <div className="text-xs text-green-600">
                      Confidence: {(opportunity.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Market Threats</h3>
              
              <div className="space-y-4">
                {competitiveIntelligence.threats.map((threat, index) => (
                  <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-red-900">{threat.threat}</span>
                      <span className="text-xs text-red-700">
                        Severity: {threat.severity}/10
                      </span>
                    </div>
                    <div className="text-sm text-red-700 mb-2">
                      Timeframe: {threat.timeframe}
                    </div>
                    <div className="text-xs text-red-600">
                      Probability: {(threat.probability * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Active Alerts</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {alertsCount} unacknowledged alert{alertsCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              {realTimeMetrics.flatMap(metric => 
                metric.alerts.map(alert => ({ ...alert, metricName: metric.name }))
              ).filter(alert => !alert.acknowledged).map((alert, index) => (
                <div key={index} className={`p-4 border rounded-lg ${
                  alert.severity === 'critical' ? 'border-red-300 bg-red-50' :
                  alert.severity === 'high' ? 'border-orange-300 bg-orange-50' :
                  alert.severity === 'medium' ? 'border-yellow-300 bg-yellow-50' :
                  'border-blue-300 bg-blue-50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className={`h-4 w-4 ${
                          alert.severity === 'critical' ? 'text-red-600' :
                          alert.severity === 'high' ? 'text-orange-600' :
                          alert.severity === 'medium' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`} />
                        <span className="font-medium text-gray-900">{alert.metricName}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                          alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 mb-3">{alert.message}</div>
                      <div className="text-xs text-gray-500 mb-3">
                        Triggered: {alert.triggeredAt.toLocaleString()}
                      </div>
                      
                      {alert.actions.length > 0 && (
                        <div>
                          <div className="text-xs font-medium text-gray-700 mb-1">Recommended Actions:</div>
                          <div className="space-y-1">
                            {alert.actions.map((action, actionIndex) => (
                              <div key={actionIndex} className="text-xs text-gray-600 flex items-center gap-1">
                                <CheckCircle size={10} />
                                {action}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <button className="ml-4 px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">
                      Acknowledge
                    </button>
                  </div>
                </div>
              ))}
              
              {alertsCount === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                  <div className="text-lg font-medium text-gray-900 mb-1">No Active Alerts</div>
                  <div className="text-sm">All systems are operating normally</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}