'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Home, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowUpRight, 
  Download, 
  Plus, 
  RefreshCw, 
  ExternalLink,
  Bell,
  Star,
  Award,
  Activity,
  Target,
  Briefcase,
  Building2,
  MessageSquare,
  Phone,
  Mail,
  Settings,
  BarChart3,
  Euro,
  MapPin,
  Zap,
  BookOpen,
  Search,
  Filter,
  Eye,
  Camera,
  Key,
  FileText,
  Heart,
  Shield,
  Globe,
  Percent
} from 'lucide-react';
import Link from 'next/link';

interface AgentMetrics {
  activeListings: number;
  totalViews: number;
  enquiriesThisMonth: number;
  viewingsScheduled: number;
  salesThisMonth: number;
  commissionEarned: number;
  averagePrice: number;
  conversionRate: number;
  clientSatisfaction: number;
  responseTime: number;
  portfolioValue: number;
  activeClients: number;
  nextViewing: {
    property: string;
    client: string;
    time: string;
    address: string;
  };
}

interface Listing {
  id: string;
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  listingType: 'sale' | 'rent';
  status: 'active' | 'under_offer' | 'sale_agreed' | 'let_agreed';
  daysOnMarket: number;
  views: number;
  enquiries: number;
  viewings: number;
  developer?: string;
  image: string;
  featured: boolean;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  budget: number;
  stage: 'new' | 'contacted' | 'viewing_scheduled' | 'offer_made' | 'sale_agreed';
  priority: 'hot' | 'warm' | 'cold';
  lastContact: string;
  source: 'website' | 'referral' | 'social' | 'advertisement';
  notes: string;
}

interface ViewingSchedule {
  id: string;
  property: string;
  client: string;
  date: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  type: 'individual' | 'group' | 'virtual';
}

export default function AgentOverview() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Enhanced agent metrics
  const agentMetrics: AgentMetrics = {
    activeListings: 23,
    totalViews: 8420,
    enquiriesThisMonth: 87,
    viewingsScheduled: 15,
    salesThisMonth: 8,
    commissionEarned: 42500,
    averagePrice: 485000,
    conversionRate: 18.5,
    clientSatisfaction: 4.8,
    responseTime: 1.2,
    portfolioValue: 11200000,
    activeClients: 34,
    nextViewing: {
      property: 'Fitzgerald Gardens, Unit 23',
      client: 'Murphy Family',
      time: 'Tomorrow 2:00 PM',
      address: 'Cork, Ireland'
    }
  };

  const featuredListings: Listing[] = [
    {
      id: '1',
      address: 'Fitzgerald Gardens, Unit 23, Cork',
      price: 385000,
      beds: 3,
      baths: 2,
      sqft: 1200,
      listingType: 'sale',
      status: 'active',
      daysOnMarket: 14,
      views: 245,
      enquiries: 12,
      viewings: 8,
      developer: 'Premium Developments',
      image: '/api/placeholder/300/200',
      featured: true
    },
    {
      id: '2',
      address: 'Ellwood, Unit 15, Dublin',
      price: 520000,
      beds: 2,
      baths: 2,
      sqft: 950,
      listingType: 'sale',
      status: 'under_offer',
      daysOnMarket: 7,
      views: 189,
      enquiries: 15,
      viewings: 11,
      developer: 'Dublin Properties Ltd',
      image: '/api/placeholder/300/200',
      featured: true
    },
    {
      id: '3',
      address: 'Ballymakenny View, Unit 8, Drogheda',
      price: 365000,
      beds: 3,
      baths: 2,
      sqft: 1350,
      listingType: 'sale',
      status: 'active',
      daysOnMarket: 21,
      views: 156,
      enquiries: 9,
      viewings: 6,
      developer: 'Coastal Developments',
      image: '/api/placeholder/300/200',
      featured: false
    }
  ];

  const recentLeads: Lead[] = [
    {
      id: '1',
      name: 'Sarah O\'Connor',
      email: 'sarah.oconnor@email.com',
      phone: '+353 86 123 4567',
      interest: 'Fitzgerald Gardens, Unit 23',
      budget: 400000,
      stage: 'viewing_scheduled',
      priority: 'hot',
      lastContact: '2 hours ago',
      source: 'website',
      notes: 'First-time buyer, pre-approved mortgage, very interested'
    },
    {
      id: '2',
      name: 'Michael Walsh',
      email: 'michael.walsh@email.com',
      phone: '+353 87 987 6543',
      interest: 'Ellwood, Unit 15',
      budget: 550000,
      stage: 'offer_made',
      priority: 'hot',
      lastContact: '4 hours ago',
      source: 'referral',
      notes: 'Made offer at asking price, awaiting developer response'
    },
    {
      id: '3',
      name: 'Emma Kelly',
      email: 'emma.kelly@email.com',
      phone: '+353 85 456 7890',
      interest: 'General 2-bed apartments',
      budget: 350000,
      stage: 'contacted',
      priority: 'warm',
      lastContact: '1 day ago',
      source: 'social',
      notes: 'Looking to upgrade from 1-bed, flexible on location'
    }
  ];

  const upcomingViewings: ViewingSchedule[] = [
    {
      id: '1',
      property: 'Fitzgerald Gardens, Unit 23',
      client: 'Murphy Family',
      date: 'Tomorrow',
      time: '2:00 PM',
      status: 'confirmed',
      type: 'individual'
    },
    {
      id: '2',
      property: 'Ellwood, Unit 15',
      client: 'Sarah O\'Connor',
      date: 'Tomorrow',
      time: '4:00 PM',
      status: 'scheduled',
      type: 'individual'
    },
    {
      id: '3',
      property: 'Ballymakenny View, Unit 8',
      client: 'Group Viewing',
      date: 'Saturday',
      time: '11:00 AM',
      status: 'confirmed',
      type: 'group'
    }
  ];

  const timeframes = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  const listingFilters = [
    { value: 'all', label: 'All Properties' },
    { value: 'active', label: 'Active Listings' },
    { value: 'under_offer', label: 'Under Offer' },
    { value: 'featured', label: 'Featured' }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastUpdated(new Date());
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatCompactCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `€${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `€${(amount / 1000).toFixed(0)}K`;
    }
    return formatCurrency(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'under_offer':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'sale_agreed':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'let_agreed':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'hot':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'warm':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'cold':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'sale_agreed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'offer_made':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'viewing_scheduled':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'contacted':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'new':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Managing sales for Prop.ie developer projects and client relationships
          </p>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <Clock size={14} />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {timeframes.map(tf => (
              <option key={tf.value} value={tf.value}>{tf.label}</option>
            ))}
          </select>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
            <Download size={16} className="inline mr-2" />
            Export Report
          </button>
          <Link 
            href="/agent/clients/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus size={16} className="inline mr-2" />
            New Client
          </Link>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Assigned Properties */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Assigned Properties</p>
              <p className="text-2xl font-bold text-gray-900">{agentMetrics.activeListings}</p>
              <div className="flex items-center gap-1 mt-1">
                <Eye size={16} className="text-blue-600" />
                <span className="text-sm text-blue-600 font-medium">{agentMetrics.totalViews.toLocaleString()}</span>
                <span className="text-sm text-gray-500">client views</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
              <Home size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* Monthly Commission */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Commission Earned</p>
              <p className="text-2xl font-bold text-gray-900">{formatCompactCurrency(agentMetrics.commissionEarned)}</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight size={16} className="text-green-600" />
                <span className="text-sm text-green-600 font-medium">{agentMetrics.salesThisMonth}</span>
                <span className="text-sm text-gray-500">sales this month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{agentMetrics.conversionRate}%</p>
              <div className="flex items-center gap-1 mt-1">
                <Target size={16} className="text-purple-600" />
                <span className="text-sm text-purple-600 font-medium">Above average</span>
                <span className="text-sm text-gray-500">performance</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        {/* Client Satisfaction */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Client Rating</p>
              <p className="text-2xl font-bold text-gray-900">{agentMetrics.clientSatisfaction}/5.0</p>
              <div className="flex items-center gap-1 mt-1">
                <Star size={16} className="text-amber-500 fill-current" />
                <span className="text-sm text-amber-600 font-medium">Excellent</span>
                <span className="text-sm text-gray-500">reviews</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
              <Award size={24} className="text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Next Viewing Alert */}
      {agentMetrics.nextViewing && (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Next Property Viewing</h3>
              <p className="text-xl font-bold">{agentMetrics.nextViewing.property}</p>
              <p className="text-purple-100">Client: {agentMetrics.nextViewing.client}</p>
              <p className="text-purple-100">{agentMetrics.nextViewing.time}</p>
              <p className="text-purple-100 text-sm">{agentMetrics.nextViewing.address}</p>
            </div>
            <div className="flex gap-3">
              <Link 
                href="/agent/viewings"
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm"
              >
                View Details
              </Link>
              <Link 
                href="/agent/calendar"
                className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                Calendar View
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured Listings */}
        <div className="lg:col-span-2 bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                <Building2 size={20} className="inline mr-2 text-blue-600" />
                Featured Listings
              </h3>
              <div className="flex items-center gap-2">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  {listingFilters.map(filter => (
                    <option key={filter.value} value={filter.value}>{filter.label}</option>
                  ))}
                </select>
                <Link 
                  href="/agent/listings"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  View All ({agentMetrics.activeListings})
                  <ExternalLink size={14} className="inline ml-1" />
                </Link>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {featuredListings.map((listing) => (
                <div key={listing.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                      <Home size={20} className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{listing.address}</h4>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(listing.status)}`}>
                          {listing.status.replace('_', ' ').toUpperCase()}
                        </span>
                        {listing.featured && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-xl font-bold text-blue-600 mb-2">{formatCurrency(listing.price)}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                        <div>
                          <p className="text-gray-500">Beds/Baths</p>
                          <p className="font-medium">{listing.beds} bed • {listing.baths} bath</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Size</p>
                          <p className="font-medium">{listing.sqft} sq ft</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Days Listed</p>
                          <p className="font-medium">{listing.daysOnMarket} days</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Views</p>
                          <p className="font-medium">{listing.views}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{listing.enquiries} enquiries</span>
                          <span>{listing.viewings} viewings</span>
                          {listing.developer && <span>by {listing.developer}</span>}
                        </div>
                        <Link 
                          href={`/agent/listings/${listing.id}`}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                        >
                          Manage
                          <ArrowUpRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Leads & Quick Actions */}
        <div className="space-y-6">
          {/* Recent Leads */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                <Users size={20} className="inline mr-2 text-green-600" />
                Recent Leads
              </h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="border rounded-lg p-3 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{lead.name}</h4>
                      <div className="flex gap-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(lead.priority)}`}>
                          {lead.priority}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStageColor(lead.stage)}`}>
                          {lead.stage.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">Budget: {formatCompactCurrency(lead.budget)}</p>
                    <p className="text-xs text-gray-600 mb-1">Interest: {lead.interest}</p>
                    <p className="text-xs text-gray-500 mb-2">Last contact: {lead.lastContact}</p>
                    <div className="flex gap-2">
                      <button className="flex-1 p-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors flex items-center justify-center gap-1">
                        <Phone size={12} />
                        Call
                      </button>
                      <button className="flex-1 p-1 text-xs bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors flex items-center justify-center gap-1">
                        <Mail size={12} />
                        Email
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link 
                href="/agent/leads"
                className="mt-4 w-full flex items-center justify-center p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <Users size={16} className="mr-2" />
                All Leads ({agentMetrics.activeClients})
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                <Zap size={20} className="inline mr-2 text-purple-600" />
                Quick Actions
              </h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 gap-3">
                <Link 
                  href="/agent/listings/new"
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
                >
                  <Plus size={20} className="text-blue-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-medium text-gray-900">Add Listing</p>
                    <p className="text-xs text-gray-600">List new property</p>
                  </div>
                </Link>
                
                <Link 
                  href="/agent/viewings/schedule"
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all group"
                >
                  <Calendar size={20} className="text-green-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-medium text-gray-900">Schedule Viewing</p>
                    <p className="text-xs text-gray-600">{agentMetrics.viewingsScheduled} this week</p>
                  </div>
                </Link>
                
                <Link 
                  href="/agent/clients/new"
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all group"
                >
                  <Users size={20} className="text-purple-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-medium text-gray-900">Add Client</p>
                    <p className="text-xs text-gray-600">New client prospect</p>
                  </div>
                </Link>
                
                <Link 
                  href="/agent/marketing"
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-all group"
                >
                  <Camera size={20} className="text-amber-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-medium text-gray-900">Marketing Tools</p>
                    <p className="text-xs text-gray-600">Photos, brochures, ads</p>
                  </div>
                </Link>
                
                <Link 
                  href="/agent/reports"
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
                >
                  <BarChart3 size={20} className="text-indigo-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-medium text-gray-900">Reports</p>
                    <p className="text-xs text-gray-600">Performance analytics</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Viewings */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              <Calendar size={20} className="inline mr-2 text-amber-600" />
              Upcoming Viewings
            </h3>
            <Link 
              href="/agent/calendar"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Calendar View
              <ExternalLink size={14} className="inline ml-1" />
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingViewings.map((viewing) => (
              <div key={viewing.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 text-sm">{viewing.property}</h4>
                  <span className={`text-xs px-2 py-1 rounded ${
                    viewing.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    viewing.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    viewing.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {viewing.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Client: {viewing.client}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{viewing.date} at {viewing.time}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    viewing.type === 'individual' ? 'bg-blue-100 text-blue-800' :
                    viewing.type === 'group' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {viewing.type}
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 p-2 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors">
                    Details
                  </button>
                  <button className="flex-1 p-2 text-xs bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors">
                    Contact
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <Briefcase size={24} className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Estate Agent CRM</h4>
              <p className="text-sm text-gray-600">Professional property sales and management platform</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/agent/marketing"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Camera size={16} className="inline mr-2" />
              Marketing Tools
            </Link>
            <Link 
              href="/agent/support"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MessageSquare size={16} className="inline mr-2" />
              Get Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}