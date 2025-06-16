'use client';

import React, { useState, useMemo } from 'react';
import { 
  User, 
  Users, 
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
  Mail,
  Phone,
  MessageSquare,
  Heart,
  Bookmark,
  Navigation,
  ThumbsUp,
  ThumbsDown,
  Share,
  Calendar as CalendarIcon,
  UserCheck,
  FileText,
  CreditCard,
  Key,
  Home as HomeIcon,
  ChevronRight,
  Play,
  Pause,
  FastForward
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  FunnelChart,
  Funnel,
  LabelList,
  Sankey
} from 'recharts';
import { fitzgeraldGardensConfig } from '@/data/fitzgerald-gardens-config';
import { realDataService } from '@/services/RealDataService';
import { Unit } from '@/types/project';

interface BuyerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  budget: number;
  preferredUnitType: string;
  location: string;
  familySize: number;
  currentStage: 'discovery' | 'interest' | 'consideration' | 'intent' | 'evaluation' | 'purchase' | 'completed';
  firstVisit: Date;
  lastActivity: Date;
  totalInteractions: number;
  score: number;
  tags: string[];
  preferences: {
    bedrooms: number;
    bathrooms: number;
    parking: boolean;
    garden: boolean;
    balcony: boolean;
    petFriendly: boolean;
    firstTimeBuyer: boolean;
  };
  journeyData: {
    viewedUnits: string[];
    savedUnits: string[];
    viewingRequests: number;
    brochureDownloads: number;
    virtualTours: number;
    callbackRequests: number;
    financialPreApproval: boolean;
    mortgageApproved: boolean;
  };
  engagement: {
    emailOpens: number;
    emailClicks: number;
    siteVisits: number;
    timeOnSite: number; // minutes
    pageMostViewed: string;
    socialShares: number;
  };
  prediction: {
    conversionProbability: number;
    timeToConversion: number; // days
    recommendedActions: string[];
    riskFactors: string[];
    nextBestAction: string;
  };
}

interface JourneyStage {
  id: string;
  name: string;
  description: string;
  avgDuration: number; // days
  conversionRate: number;
  actions: string[];
  touchpoints: string[];
}

interface PersonalizationEngine {
  recommendedUnits: string[];
  personalizedContent: string[];
  optimalContactTime: string;
  preferredChannel: 'email' | 'phone' | 'sms' | 'whatsapp';
  messagingStrategy: string;
  incentiveRecommendation: string;
}

interface BuyerJourneyTrackerProps {
  projectId: string;
  units: Unit[];
}

export default function BuyerJourneyTracker({ projectId, units }: BuyerJourneyTrackerProps) {
  const [viewMode, setViewMode] = useState<'overview' | 'individual' | 'analytics' | 'personalization'>('overview');
  const [selectedBuyer, setSelectedBuyer] = useState<BuyerProfile | null>(null);
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [scoreFilter, setScoreFilter] = useState<string>('all');

  // Get real project data
  const config = fitzgeraldGardensConfig;

  // Generate realistic buyer profiles
  const buyerProfiles: BuyerProfile[] = useMemo(() => [
    {
      id: 'buyer-1',
      name: 'Sarah O\'Connor',
      email: 'sarah@email.com',
      phone: '+353 87 123 4567',
      age: 32,
      budget: 450000,
      preferredUnitType: '2-bed apartment',
      location: 'Cork City',
      familySize: 2,
      currentStage: 'evaluation',
      firstVisit: new Date('2025-05-15'),
      lastActivity: new Date('2025-06-14'),
      totalInteractions: 23,
      score: 87,
      tags: ['hot-lead', 'first-time-buyer', 'young-professional'],
      preferences: {
        bedrooms: 2,
        bathrooms: 2,
        parking: true,
        garden: false,
        balcony: true,
        petFriendly: false,
        firstTimeBuyer: true
      },
      journeyData: {
        viewedUnits: ['A-15', 'A-16', 'A-18', 'B-23'],
        savedUnits: ['A-15', 'A-16'],
        viewingRequests: 3,
        brochureDownloads: 2,
        virtualTours: 4,
        callbackRequests: 1,
        financialPreApproval: true,
        mortgageApproved: false
      },
      engagement: {
        emailOpens: 12,
        emailClicks: 8,
        siteVisits: 15,
        timeOnSite: 180,
        pageMostViewed: 'Unit Details A-15',
        socialShares: 2
      },
      prediction: {
        conversionProbability: 78,
        timeToConversion: 14,
        recommendedActions: ['Schedule viewing', 'Mortgage advisor introduction', 'Incentive offer'],
        riskFactors: ['Budget constraints', 'Competing properties'],
        nextBestAction: 'Schedule viewing for A-15 within 3 days'
      }
    },
    {
      id: 'buyer-2',
      name: 'Michael & Lisa Walsh',
      email: 'michael.walsh@email.com',
      phone: '+353 86 234 5678',
      age: 38,
      budget: 520000,
      preferredUnitType: '3-bed house',
      location: 'Cork Suburbs',
      familySize: 4,
      currentStage: 'intent',
      firstVisit: new Date('2025-04-20'),
      lastActivity: new Date('2025-06-13'),
      totalInteractions: 31,
      score: 92,
      tags: ['family', 'repeat-customer', 'high-value'],
      preferences: {
        bedrooms: 3,
        bathrooms: 2,
        parking: true,
        garden: true,
        balcony: false,
        petFriendly: true,
        firstTimeBuyer: false
      },
      journeyData: {
        viewedUnits: ['C-05', 'C-07', 'C-08', 'C-12'],
        savedUnits: ['C-05', 'C-07'],
        viewingRequests: 2,
        brochureDownloads: 3,
        virtualTours: 6,
        callbackRequests: 2,
        financialPreApproval: true,
        mortgageApproved: true
      },
      engagement: {
        emailOpens: 18,
        emailClicks: 14,
        siteVisits: 22,
        timeOnSite: 320,
        pageMostViewed: 'Development Overview',
        socialShares: 4
      },
      prediction: {
        conversionProbability: 89,
        timeToConversion: 7,
        recommendedActions: ['Final offer preparation', 'Legal pack preparation', 'Close timeline'],
        riskFactors: ['School preference concerns'],
        nextBestAction: 'Prepare final offer with school information package'
      }
    },
    {
      id: 'buyer-3',
      name: 'James Kelly',
      email: 'j.kelly@email.com',
      phone: '+353 85 345 6789',
      age: 29,
      budget: 380000,
      preferredUnitType: '1-bed apartment',
      location: 'Cork City Centre',
      familySize: 1,
      currentStage: 'consideration',
      firstVisit: new Date('2025-06-01'),
      lastActivity: new Date('2025-06-12'),
      totalInteractions: 12,
      score: 65,
      tags: ['investor', 'young-professional', 'urban'],
      preferences: {
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        garden: false,
        balcony: true,
        petFriendly: false,
        firstTimeBuyer: true
      },
      journeyData: {
        viewedUnits: ['A-02', 'A-04', 'B-11'],
        savedUnits: ['A-02'],
        viewingRequests: 1,
        brochureDownloads: 1,
        virtualTours: 2,
        callbackRequests: 0,
        financialPreApproval: false,
        mortgageApproved: false
      },
      engagement: {
        emailOpens: 6,
        emailClicks: 3,
        siteVisits: 8,
        timeOnSite: 95,
        pageMostViewed: 'Investment Calculator',
        socialShares: 1
      },
      prediction: {
        conversionProbability: 45,
        timeToConversion: 45,
        recommendedActions: ['Financial consultation', 'Investment ROI presentation', 'HTB information'],
        riskFactors: ['Budget uncertainty', 'First-time buyer hesitation', 'Competition analysis needed'],
        nextBestAction: 'Schedule financial consultation within 1 week'
      }
    },
    {
      id: 'buyer-4',
      name: 'Emma & David Murphy',
      email: 'emma.murphy@email.com',
      phone: '+353 87 456 7890',
      age: 35,
      budget: 485000,
      preferredUnitType: '3-bed apartment',
      location: 'Blackrock',
      familySize: 3,
      currentStage: 'purchase',
      firstVisit: new Date('2025-03-10'),
      lastActivity: new Date('2025-06-15'),
      totalInteractions: 47,
      score: 96,
      tags: ['closing-soon', 'family', 'high-engagement'],
      preferences: {
        bedrooms: 3,
        bathrooms: 2,
        parking: true,
        garden: false,
        balcony: true,
        petFriendly: false,
        firstTimeBuyer: false
      },
      journeyData: {
        viewedUnits: ['B-15', 'B-17', 'B-19'],
        savedUnits: ['B-17'],
        viewingRequests: 4,
        brochureDownloads: 4,
        virtualTours: 8,
        callbackRequests: 3,
        financialPreApproval: true,
        mortgageApproved: true
      },
      engagement: {
        emailOpens: 25,
        emailClicks: 19,
        siteVisits: 35,
        timeOnSite: 520,
        pageMostViewed: 'Unit B-17 Details',
        socialShares: 6
      },
      prediction: {
        conversionProbability: 94,
        timeToConversion: 3,
        recommendedActions: ['Contract preparation', 'Completion coordination', 'Move-in support'],
        riskFactors: ['Minimal - ready to close'],
        nextBestAction: 'Finalize contract signing appointment'
      }
    }
  ], [units]);

  // Journey stages configuration
  const journeyStages: JourneyStage[] = useMemo(() => [
    {
      id: 'discovery',
      name: 'Discovery',
      description: 'Initial awareness and research phase',
      avgDuration: 14,
      conversionRate: 15,
      actions: ['Website visit', 'Brochure download', 'Social media engagement'],
      touchpoints: ['Website', 'Social media', 'Advertising', 'Referrals']
    },
    {
      id: 'interest',
      name: 'Interest',
      description: 'Showing genuine interest in the project',
      avgDuration: 7,
      conversionRate: 35,
      actions: ['Virtual tour', 'Unit comparison', 'Calculator usage'],
      touchpoints: ['Email marketing', 'Virtual showroom', 'Online tools']
    },
    {
      id: 'consideration',
      name: 'Consideration',
      description: 'Actively considering the purchase',
      avgDuration: 12,
      conversionRate: 55,
      actions: ['Viewing request', 'Detailed inquiry', 'Comparison shopping'],
      touchpoints: ['Sales team', 'Showroom visit', 'Competitor analysis']
    },
    {
      id: 'intent',
      name: 'Intent',
      description: 'Strong purchase intent demonstrated',
      avgDuration: 8,
      conversionRate: 75,
      actions: ['Financial pre-approval', 'Multiple viewings', 'Negotiation'],
      touchpoints: ['Financial advisor', 'Legal consultation', 'Family discussions']
    },
    {
      id: 'evaluation',
      name: 'Evaluation',
      description: 'Final evaluation and decision making',
      avgDuration: 5,
      conversionRate: 85,
      actions: ['Final viewing', 'Contract review', 'Decision making'],
      touchpoints: ['Legal team', 'Family meetings', 'Final negotiations']
    },
    {
      id: 'purchase',
      name: 'Purchase',
      description: 'Committed to purchase, completing formalities',
      avgDuration: 3,
      conversionRate: 95,
      actions: ['Contract signing', 'Deposit payment', 'Mortgage finalization'],
      touchpoints: ['Legal completion', 'Financial institution', 'Sales completion']
    }
  ], []);

  // Filter buyers based on current filters
  const filteredBuyers = useMemo(() => {
    return buyerProfiles.filter(buyer => {
      const matchesStage = stageFilter === 'all' || buyer.currentStage === stageFilter;
      const matchesScore = scoreFilter === 'all' || 
        (scoreFilter === 'high' && buyer.score >= 80) ||
        (scoreFilter === 'medium' && buyer.score >= 60 && buyer.score < 80) ||
        (scoreFilter === 'low' && buyer.score < 60);
      return matchesStage && matchesScore;
    });
  }, [buyerProfiles, stageFilter, scoreFilter]);

  // Calculate journey analytics
  const journeyAnalytics = useMemo(() => {
    const stageDistribution = journeyStages.map(stage => ({
      stage: stage.name,
      count: buyerProfiles.filter(buyer => buyer.currentStage === stage.id).length,
      conversionRate: stage.conversionRate
    }));

    const avgScore = buyerProfiles.reduce((sum, buyer) => sum + buyer.score, 0) / buyerProfiles.length;
    const highValueBuyers = buyerProfiles.filter(buyer => buyer.score >= 80).length;
    const totalInteractions = buyerProfiles.reduce((sum, buyer) => sum + buyer.totalInteractions, 0);
    const avgTimeInJourney = buyerProfiles.reduce((sum, buyer) => {
      const days = Math.floor((new Date().getTime() - buyer.firstVisit.getTime()) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0) / buyerProfiles.length;

    return {
      stageDistribution,
      avgScore,
      highValueBuyers,
      totalInteractions,
      avgTimeInJourney,
      totalBuyers: buyerProfiles.length,
      conversionRate: (buyerProfiles.filter(b => b.currentStage === 'purchase' || b.currentStage === 'completed').length / buyerProfiles.length) * 100
    };
  }, [buyerProfiles, journeyStages]);

  // Generate funnel data
  const funnelData = useMemo(() => 
    journeyStages.map(stage => ({
      name: stage.name,
      value: buyerProfiles.filter(buyer => buyer.currentStage === stage.id).length,
      fill: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'][journeyStages.indexOf(stage)]
    })), [buyerProfiles, journeyStages]);

  // Personalization engine for selected buyer
  const getPersonalizationData = (buyer: BuyerProfile): PersonalizationEngine => {
    const recommendedUnits = units
      .filter(unit => unit.features.bedrooms === buyer.preferences.bedrooms)
      .filter(unit => unit.pricing.currentPrice <= buyer.budget * 1.1)
      .slice(0, 3)
      .map(unit => unit.id);

    return {
      recommendedUnits,
      personalizedContent: [
        `${buyer.preferences.firstTimeBuyer ? 'First-time buyer' : 'Experienced buyer'} resources`,
        `Family-focused amenities (${buyer.familySize} family members)`,
        `Budget-optimized options around €${(buyer.budget / 1000).toFixed(0)}K`,
        `${buyer.preferredUnitType} specialized content`
      ],
      optimalContactTime: buyer.age < 35 ? 'Evening (6-8 PM)' : 'Morning (9-11 AM)',
      preferredChannel: buyer.engagement.emailOpens > 10 ? 'email' : 'phone',
      messagingStrategy: buyer.score > 80 ? 'Urgency and exclusivity' : 'Value and benefits',
      incentiveRecommendation: buyer.prediction.conversionProbability < 60 ? 
        'Financial consultation + HTB guidance' : 
        'Exclusive viewing + quick decision bonus'
    };
  };

  const getStageColor = (stage: string) => {
    const colors: { [key: string]: string } = {
      discovery: 'bg-blue-100 text-blue-800',
      interest: 'bg-green-100 text-green-800',
      consideration: 'bg-yellow-100 text-yellow-800',
      intent: 'bg-orange-100 text-orange-800',
      evaluation: 'bg-purple-100 text-purple-800',
      purchase: 'bg-emerald-100 text-emerald-800'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Navigation size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Buyer Journey Tracker</h2>
              <p className="text-gray-600">AI-powered personalization & journey optimization</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['overview', 'individual', 'analytics', 'personalization'].map((mode) => (
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
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Buyers</p>
              <p className="text-2xl font-bold text-gray-900">{journeyAnalytics.totalBuyers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Active in pipeline</p>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Score</p>
              <p className={`text-2xl font-bold ${getScoreColor(journeyAnalytics.avgScore)}`}>
                {journeyAnalytics.avgScore.toFixed(0)}
              </p>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Lead quality score</p>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Value</p>
              <p className="text-2xl font-bold text-green-600">{journeyAnalytics.highValueBuyers}</p>
            </div>
            <Award className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Score 80+ buyers</p>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-purple-600">{journeyAnalytics.conversionRate.toFixed(1)}%</p>
            </div>
            <Target className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Purchase + completed</p>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Journey</p>
              <p className="text-2xl font-bold text-amber-600">{journeyAnalytics.avgTimeInJourney.toFixed(0)}</p>
            </div>
            <Clock className="h-8 w-8 text-amber-600" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Days in pipeline</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Stages</option>
              {journeyStages.map(stage => (
                <option key={stage.id} value={stage.id}>{stage.name}</option>
              ))}
            </select>
          </div>
          
          <select
            value={scoreFilter}
            onChange={(e) => setScoreFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Scores</option>
            <option value="high">High (80+)</option>
            <option value="medium">Medium (60-79)</option>
            <option value="low">Low (&lt;60)</option>
          </select>
        </div>
      </div>

      {/* Overview Dashboard */}
      {viewMode === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Journey Funnel */}
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Journey Funnel</h3>
              <ResponsiveContainer width="100%" height={300}>
                <FunnelChart>
                  <Tooltip />
                  <Funnel
                    dataKey="value"
                    data={funnelData}
                    isAnimationActive
                  >
                    <LabelList position="center" fill="#fff" stroke="none" />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>

            {/* Stage Distribution */}
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Stage Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={journeyAnalytics.stageDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Buyer Cards */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Buyers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBuyers.map((buyer) => (
                <div key={buyer.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                     onClick={() => setSelectedBuyer(buyer)}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{buyer.name}</h4>
                      <p className="text-sm text-gray-600">€{(buyer.budget / 1000).toFixed(0)}K budget</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getScoreColor(buyer.score)}`}>
                        {buyer.score}
                      </div>
                      <div className="text-xs text-gray-500">Score</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(buyer.currentStage)}`}>
                      {buyer.currentStage.charAt(0).toUpperCase() + buyer.currentStage.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Eye size={14} />
                      <span>{buyer.journeyData.viewedUnits.length} units viewed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart size={14} />
                      <span>{buyer.journeyData.savedUnits.length} units saved</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity size={14} />
                      <span>{buyer.totalInteractions} interactions</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Conversion probability:</span>
                      <span className={`font-semibold ${buyer.prediction.conversionProbability > 70 ? 'text-green-600' : buyer.prediction.conversionProbability > 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {buyer.prediction.conversionProbability}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Individual Buyer View */}
      {viewMode === 'individual' && selectedBuyer && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedBuyer.name}</h3>
                <p className="text-gray-600">{selectedBuyer.email} • {selectedBuyer.phone}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(selectedBuyer.currentStage)}`}>
                    {selectedBuyer.currentStage.charAt(0).toUpperCase() + selectedBuyer.currentStage.slice(1)}
                  </span>
                  <span className={`text-lg font-bold ${getScoreColor(selectedBuyer.score)}`}>
                    Score: {selectedBuyer.score}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  €{(selectedBuyer.budget / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-gray-600">Budget</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Journey Progress */}
              <div className="lg:col-span-2">
                <h4 className="font-semibold text-gray-900 mb-4">Journey Progress</h4>
                <div className="space-y-3">
                  {journeyStages.map((stage, index) => {
                    const isCurrentStage = stage.id === selectedBuyer.currentStage;
                    const isCompleted = journeyStages.findIndex(s => s.id === selectedBuyer.currentStage) > index;
                    
                    return (
                      <div key={stage.id} className={`flex items-center gap-3 p-3 rounded-lg ${
                        isCurrentStage ? 'bg-blue-50 border border-blue-200' : 
                        isCompleted ? 'bg-green-50 border border-green-200' : 
                        'bg-gray-50 border border-gray-200'
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isCurrentStage ? 'bg-blue-600 text-white' :
                          isCompleted ? 'bg-green-600 text-white' :
                          'bg-gray-300 text-gray-600'
                        }`}>
                          {isCompleted ? <CheckCircle size={16} /> : 
                           isCurrentStage ? <Play size={16} /> : 
                           <Clock size={16} />}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{stage.name}</h5>
                          <p className="text-sm text-gray-600">{stage.description}</p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          {stage.avgDuration} days avg
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Key Metrics */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Key Metrics</h4>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">{selectedBuyer.prediction.conversionProbability}%</div>
                    <div className="text-sm text-gray-600">Conversion Probability</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">{selectedBuyer.prediction.timeToConversion}</div>
                    <div className="text-sm text-gray-600">Days to Conversion</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">{selectedBuyer.engagement.siteVisits}</div>
                    <div className="text-sm text-gray-600">Site Visits</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">{selectedBuyer.engagement.timeOnSite}</div>
                    <div className="text-sm text-gray-600">Minutes on Site</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Journey Data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-semibold text-gray-900 mb-4">Journey Activities</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Units Viewed</span>
                  <span className="font-medium">{selectedBuyer.journeyData.viewedUnits.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Units Saved</span>
                  <span className="font-medium">{selectedBuyer.journeyData.savedUnits.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Viewing Requests</span>
                  <span className="font-medium">{selectedBuyer.journeyData.viewingRequests}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Virtual Tours</span>
                  <span className="font-medium">{selectedBuyer.journeyData.virtualTours}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Brochure Downloads</span>
                  <span className="font-medium">{selectedBuyer.journeyData.brochureDownloads}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Callback Requests</span>
                  <span className="font-medium">{selectedBuyer.journeyData.callbackRequests}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-semibold text-gray-900 mb-4">Next Best Actions</h4>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="font-medium text-blue-800">Immediate Action</div>
                  <div className="text-sm text-blue-700">{selectedBuyer.prediction.nextBestAction}</div>
                </div>
                
                <div className="space-y-2">
                  <div className="font-medium text-gray-700">Recommended Actions:</div>
                  {selectedBuyer.prediction.recommendedActions.map((action, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <ChevronRight size={14} />
                      {action}
                    </div>
                  ))}
                </div>

                {selectedBuyer.prediction.riskFactors.length > 0 && (
                  <div className="space-y-2">
                    <div className="font-medium text-red-700">Risk Factors:</div>
                    {selectedBuyer.prediction.riskFactors.map((risk, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle size={14} />
                        {risk}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Personalization View */}
      {viewMode === 'personalization' && selectedBuyer && (
        <div className="space-y-6">
          {(() => {
            const personalization = getPersonalizationData(selectedBuyer);
            return (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Personalization for {selectedBuyer.name}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Recommended Units</h4>
                      <div className="space-y-2">
                        {personalization.recommendedUnits.map((unitId, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-blue-600">
                            <Home size={14} />
                            Unit {unitId}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Personalized Content</h4>
                      <div className="space-y-2">
                        {personalization.personalizedContent.map((content, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <FileText size={14} />
                            {content}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Contact Strategy</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="text-sm font-medium text-blue-800">Optimal Time</div>
                          <div className="text-sm text-blue-700">{personalization.optimalContactTime}</div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="text-sm font-medium text-green-800">Preferred Channel</div>
                          <div className="text-sm text-green-700 capitalize">{personalization.preferredChannel}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Messaging Strategy</h4>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="text-sm text-purple-700">{personalization.messagingStrategy}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Incentive Recommendation</h4>
                      <div className="p-3 bg-amber-50 rounded-lg">
                        <div className="text-sm text-amber-700">{personalization.incentiveRecommendation}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Analytics</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{selectedBuyer.engagement.emailOpens}</div>
                        <div className="text-sm text-gray-600">Email Opens</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{selectedBuyer.engagement.emailClicks}</div>
                        <div className="text-sm text-gray-600">Email Clicks</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{selectedBuyer.engagement.siteVisits}</div>
                        <div className="text-sm text-gray-600">Site Visits</div>
                      </div>
                      <div className="text-center p-3 bg-amber-50 rounded-lg">
                        <div className="text-2xl font-bold text-amber-600">{selectedBuyer.engagement.socialShares}</div>
                        <div className="text-sm text-gray-600">Social Shares</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Most Viewed Content</h4>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-700">{selectedBuyer.engagement.pageMostViewed}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Buyer Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedBuyer.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}