'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  Target,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Filter,
  Download,
  MapPin,
  Star,
  Activity,
  Briefcase,
  Home,
  FileText,
  Settings
} from 'lucide-react';
import Link from 'next/link';

export default function AgentDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [loading, setLoading] = useState(false);

  // Mock agent data - in production this would come from API
  const agentData = {
    profile: {
      name: 'Sarah Murphy',
      agency: 'Cork Premium Properties',
      license: 'PSR License: 002345',
      specialization: 'New Developments',
      phone: '+353 87 123 4567',
      email: 'sarah.murphy@corkpremium.ie',
      rating: 4.8,
      reviews: 142,
      yearsExperience: 8
    },
    performance: {
      thisMonth: {
        sales: 3,
        revenue: 1240000,
        viewings: 24,
        leads: 18,
        conversion: 16.7
      },
      lastMonth: {
        sales: 2,
        revenue: 890000,
        viewings: 19,
        leads: 15,
        conversion: 13.3
      },
      yearToDate: {
        sales: 28,
        revenue: 11850000,
        viewings: 284,
        leads: 167,
        conversion: 16.8
      }
    },
    assignedProperties: [
      {
        id: 'fg-unit-01',
        projectName: 'Fitzgerald Gardens',
        unitNumber: 'Unit 1A',
        type: 'apartment',
        bedrooms: 2,
        bathrooms: 2,
        area: 85,
        price: 325000,
        status: 'available',
        enquiries: 8,
        viewings: 5,
        offers: 1,
        lastActivity: '2 hours ago',
        image: '/api/placeholder/300/200'
      },
      {
        id: 'fg-unit-02',
        projectName: 'Fitzgerald Gardens',
        unitNumber: 'Unit 2A',
        type: 'apartment',
        bedrooms: 2,
        bathrooms: 2,
        area: 87,
        price: 330000,
        status: 'reserved',
        enquiries: 12,
        viewings: 8,
        offers: 3,
        lastActivity: '1 day ago',
        image: '/api/placeholder/300/200'
      },
      {
        id: 'fg-unit-03',
        projectName: 'Fitzgerald Gardens',
        unitNumber: 'Unit 3B',
        type: 'duplex',
        bedrooms: 3,
        bathrooms: 2,
        area: 110,
        price: 425000,
        status: 'available',
        enquiries: 6,
        viewings: 3,
        offers: 0,
        lastActivity: '4 hours ago',
        image: '/api/placeholder/300/200'
      }
    ],
    clients: [
      {
        id: 'client-001',
        name: 'John & Mary O\'Sullivan',
        email: 'john.osullivan@email.com',
        phone: '+353 87 234 5678',
        status: 'hot_lead',
        source: 'Website Enquiry',
        budget: '€300k - €400k',
        requirements: '2-3 bed, Cork City',
        lastContact: '2025-06-18T10:30:00Z',
        nextFollowUp: '2025-06-20T14:00:00Z',
        interestedProperties: ['fg-unit-01', 'fg-unit-02'],
        notes: 'First time buyers, pre-approved mortgage, very motivated'
      },
      {
        id: 'client-002',
        name: 'David Kelly',
        email: 'david.kelly@email.com',
        phone: '+353 86 345 6789',
        status: 'warm_lead',
        source: 'Referral',
        budget: '€400k - €500k',
        requirements: '3+ bed, parking essential',
        lastContact: '2025-06-17T16:45:00Z',
        nextFollowUp: '2025-06-21T11:00:00Z',
        interestedProperties: ['fg-unit-03'],
        notes: 'Investment buyer, cash purchase possible'
      },
      {
        id: 'client-003',
        name: 'Emma Walsh',
        email: 'emma.walsh@email.com',
        phone: '+353 85 456 7890',
        status: 'cold_lead',
        source: 'Property Portal',
        budget: '€250k - €350k',
        requirements: '2 bed, city access',
        lastContact: '2025-06-15T14:20:00Z',
        nextFollowUp: '2025-06-22T10:00:00Z',
        interestedProperties: ['fg-unit-01'],
        notes: 'Viewing scheduled for next week'
      }
    ],
    upcomingViewings: [
      {
        id: 'viewing-001',
        propertyId: 'fg-unit-01',
        clientName: 'John & Mary O\'Sullivan',
        date: '2025-06-20T14:00:00Z',
        duration: 45,
        type: 'private',
        status: 'confirmed',
        notes: 'First time viewing, bring HTB information'
      },
      {
        id: 'viewing-002',
        propertyId: 'fg-unit-03',
        clientName: 'David Kelly',
        date: '2025-06-21T11:00:00Z',
        duration: 30,
        type: 'private',
        status: 'confirmed',
        notes: 'Investment perspective, focus on rental potential'
      },
      {
        id: 'viewing-003',
        propertyId: 'fg-unit-02',
        clientName: 'Emma Walsh',
        date: '2025-06-22T10:00:00Z',
        duration: 60,
        type: 'private',
        status: 'tentative',
        notes: 'Needs to confirm availability'
      }
    ],
    recentActivity: [
      {
        id: 1,
        type: 'viewing',
        message: 'Viewing completed for Unit 1A with John & Mary O\'Sullivan',
        time: '2 hours ago',
        priority: 'normal'
      },
      {
        id: 2,
        type: 'lead',
        message: 'New enquiry received for Unit 3B from website',
        time: '4 hours ago',
        priority: 'high'
      },
      {
        id: 3,
        type: 'offer',
        message: 'Offer submitted for Unit 2A - €325,000',
        time: '1 day ago',
        priority: 'high'
      },
      {
        id: 4,
        type: 'follow_up',
        message: 'Follow-up call completed with David Kelly',
        time: '1 day ago',
        priority: 'normal'
      },
      {
        id: 5,
        type: 'marketing',
        message: 'New property photos uploaded for Unit 1A',
        time: '2 days ago',
        priority: 'low'
      }
    ],
    commission: {
      thisMonth: 12400, // €12,400
      pending: 8950,   // €8,950
      yearToDate: 118500, // €118,500
      rate: 1.0 // 1%
    }
  };

  const timeframes = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'reserved':
        return 'bg-blue-100 text-blue-800';
      case 'sold':
        return 'bg-purple-100 text-purple-800';
      case 'hot_lead':
        return 'bg-red-100 text-red-800';
      case 'warm_lead':
        return 'bg-amber-100 text-amber-800';
      case 'cold_lead':
        return 'bg-gray-100 text-gray-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'tentative':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle size={14} className="text-green-600" />;
      case 'reserved':
        return <Clock size={14} className="text-blue-600" />;
      case 'sold':
        return <Star size={14} className="text-purple-600" />;
      case 'hot_lead':
        return <Target size={14} className="text-red-600" />;
      case 'warm_lead':
        return <TrendingUp size={14} className="text-amber-600" />;
      case 'cold_lead':
        return <Eye size={14} className="text-gray-600" />;
      default:
        return <Activity size={14} className="text-gray-600" />;
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IE', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {agentData.profile.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {timeframes.map(tf => (
              <option key={tf.value} value={tf.value}>{tf.label}</option>
            ))}
          </select>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download size={16} />
            Export Report
          </button>
          <Link 
            href="/agent/clients/new"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            New Client
          </Link>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* This Month Sales */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sales This Month</p>
              <p className="text-2xl font-bold text-gray-900">{agentData.performance.thisMonth.sales}</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight size={16} className="text-green-600" />
                <span className="text-sm text-green-600 font-medium">+50%</span>
                <span className="text-sm text-gray-500">vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Active Leads */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Leads</p>
              <p className="text-2xl font-bold text-gray-900">{agentData.performance.thisMonth.leads}</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight size={16} className="text-blue-600" />
                <span className="text-sm text-blue-600 font-medium">+20%</span>
                <span className="text-sm text-gray-500">conversion rate</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* Properties Assigned */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Properties Assigned</p>
              <p className="text-2xl font-bold text-gray-900">{agentData.assignedProperties.length}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-sm text-purple-600 font-medium">2 available</span>
                <span className="text-sm text-gray-500">1 reserved</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Building2 size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        {/* Commission This Month */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Commission This Month</p>
              <p className="text-2xl font-bold text-gray-900">{formatCompactCurrency(agentData.commission.thisMonth)}</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight size={16} className="text-amber-600" />
                <span className="text-sm text-amber-600 font-medium">+39%</span>
                <span className="text-sm text-gray-500">vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Award size={24} className="text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Properties and Upcoming Viewings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Properties */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Assigned Properties</h3>
              <Link 
                href="/agent/properties"
                className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
              >
                View All
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {agentData.assignedProperties.map((property) => (
                <div key={property.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{property.unitNumber}</h4>
                      <p className="text-sm text-gray-600">{property.projectName}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                      {getStatusIcon(property.status)}
                      {property.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-900">{property.enquiries}</p>
                      <p className="text-xs text-gray-600">Enquiries</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-blue-600">{property.viewings}</p>
                      <p className="text-xs text-gray-600">Viewings</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-green-600">{property.offers}</p>
                      <p className="text-xs text-gray-600">Offers</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">{formatCompactCurrency(property.price)}</span>
                    <span className="text-sm text-gray-500">{property.lastActivity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Viewings */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Viewings</h3>
              <Link 
                href="/agent/viewings"
                className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
              >
                View All
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {agentData.upcomingViewings.map((viewing) => (
                <div key={viewing.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{viewing.clientName}</h4>
                      <p className="text-sm text-gray-600">{viewing.propertyId.replace('-', ' ').toUpperCase()}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(viewing.status)}`}>
                      {getStatusIcon(viewing.status)}
                      {viewing.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{formatDate(viewing.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{viewing.duration} mins</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600">{viewing.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity and Client Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {agentData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'viewing' ? 'bg-blue-100' :
                    activity.type === 'lead' ? 'bg-green-100' :
                    activity.type === 'offer' ? 'bg-purple-100' :
                    activity.type === 'follow_up' ? 'bg-amber-100' :
                    'bg-gray-100'
                  }`}>
                    {activity.type === 'viewing' ? <Eye size={16} className="text-blue-600" /> :
                     activity.type === 'lead' ? <Users size={16} className="text-green-600" /> :
                     activity.type === 'offer' ? <DollarSign size={16} className="text-purple-600" /> :
                     activity.type === 'follow_up' ? <Phone size={16} className="text-amber-600" /> :
                     <Activity size={16} className="text-gray-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Client Pipeline */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Client Pipeline</h3>
              <Link 
                href="/agent/clients"
                className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
              >
                View All
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {agentData.clients.map((client) => (
                <div key={client.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{client.name}</h4>
                      <p className="text-sm text-gray-600">{client.budget}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                      {getStatusIcon(client.status)}
                      {client.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Phone size={14} />
                      <span>{client.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>Next: {formatDate(client.nextFollowUp)}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600">{client.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Link 
              href="/agent/clients/new"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors group"
            >
              <Plus size={24} className="text-green-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">New Client</span>
            </Link>
            
            <Link 
              href="/agent/viewings/schedule"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <Calendar size={24} className="text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">Schedule Viewing</span>
            </Link>
            
            <Link 
              href="/agent/properties/active"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors group"
            >
              <Building2 size={24} className="text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">View Properties</span>
            </Link>
            
            <Link 
              href="/agent/marketing"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-colors group"
            >
              <Target size={24} className="text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">Marketing Tools</span>
            </Link>
            
            <Link 
              href="/agent/commission"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors group"
            >
              <DollarSign size={24} className="text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">Commission</span>
            </Link>
            
            <Link 
              href="/agent/reports"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
            >
              <FileText size={24} className="text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">Reports</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}