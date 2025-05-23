'use client';

import React, { useState } from 'react';
import { 
  Search, Filter, Star, Shield, CheckCircle, AlertCircle,
  MapPin, Phone, Mail, Calendar, DollarSign, Award,
  Plus, Eye, Edit, Trash2, Download, Share2, MessageSquare,
  TrendingUp, Clock, Users, BarChart3, FileText, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function ContractorsPage() {
  const [searchQuerysetSearchQuery] = useState('');
  const [selectedCategorysetSelectedCategory] = useState('all');
  const [selectedRatingsetSelectedRating] = useState('all');
  const [viewModesetViewMode] = useState('grid');

  // Mock contractor data
  const contractors = [
    {
      id: '1',
      name: 'ABC Construction Ltd',
      category: 'General Contractor',
      rating: 4.8,
      reviews: 127,
      verified: true,
      location: 'Dublin',
      expertise: ['Commercial', 'Residential', 'Renovations'],
      activeProjects: 3,
      completedProjects: 48,
      avgProjectValue: '€2.5M',
      certifications: ['ISO 9001', 'SAFE-T-CERT', 'CIRI'],
      insurance: {
        liability: '€10M',
        professional: '€5M',
        expiry: '2024-12-31'
      },
      performance: {
        onTime: 92,
        onBudget: 88,
        qualityScore: 95,
        safetyScore: 98
      },
      contact: {
        name: 'John Smith',
        role: 'Operations Director',
        phone: '+353 1 234 5678',
        email: 'john@abcconstruction.ie'
      },
      lastWorked: '2023-10-15',
      status: 'available'
    },
    {
      id: '2',
      name: 'Elite Electrical Services',
      category: 'Electrical',
      rating: 4.9,
      reviews: 89,
      verified: true,
      location: 'Cork',
      expertise: ['High Voltage', 'Smart Systems', 'Solar'],
      activeProjects: 1,
      completedProjects: 156,
      avgProjectValue: '€450K',
      certifications: ['RECI', 'Safe Electric', 'SEAI'],
      insurance: {
        liability: '€5M',
        professional: '€2M',
        expiry: '2024-08-15'
      },
      performance: {
        onTime: 96,
        onBudget: 94,
        qualityScore: 97,
        safetyScore: 100
      },
      contact: {
        name: 'Mary O\'Brien',
        role: 'Managing Director',
        phone: '+353 21 234 5678',
        email: 'mary@eliteelectric.ie'
      },
      lastWorked: '2023-11-20',
      status: 'busy'
    },
    {
      id: '3',
      name: 'Premier Plumbing Solutions',
      category: 'Plumbing',
      rating: 4.6,
      reviews: 64,
      verified: true,
      location: 'Galway',
      expertise: ['Commercial', 'HVAC', 'Water Treatment'],
      activeProjects: 2,
      completedProjects: 89,
      avgProjectValue: '€320K',
      certifications: ['CIPHE', 'Gas Safe', 'Water Quality'],
      insurance: {
        liability: '€3M',
        professional: '€1M',
        expiry: '2024-06-30'
      },
      performance: {
        onTime: 89,
        onBudget: 92,
        qualityScore: 93,
        safetyScore: 96
      },
      contact: {
        name: 'Patrick Kelly',
        role: 'Technical Director',
        phone: '+353 91 234 5678',
        email: 'patrick@premierplumbing.ie'
      },
      lastWorked: '2023-09-05',
      status: 'available'
    }
  ];

  const categories = [
    'All Categories',
    'General Contractor',
    'Electrical',
    'Plumbing',
    'HVAC',
    'Roofing',
    'Landscaping',
    'Structural',
    'Interiors'
  ];

  const filteredContractors = contractors.filter(contractor => {
    const matchesSearch = contractor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contractor.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || contractor.category === selectedCategory;
    const matchesRating = selectedRating === 'all' || 
                         (selectedRating === '4+' && contractor.rating>= 4) ||
                         (selectedRating === '4.5+' && contractor.rating>= 4.5);
    return matchesSearch && matchesCategory && matchesRating;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contractors Directory</h1>
            <p className="text-gray-600">Verified contractors with performance ratings</p>
          </div>
          <Link
            href="/developer/team/contractors/add"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Contractor
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search contractors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Categories</option>
            {categories.slice(1).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Ratings</option>
            <option value="4+">4+ Stars</option>
            <option value="4.5+">4.5+ Stars</option>
          </select>

          <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {filteredContractors.length} contractors found
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'} rounded`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                <path fill="currentColor" d="M3 3h6v6H3zM11 3h6v6h-6zM3 11h6v6H3zM11 11h6v6h-6z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'} rounded`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                <path fill="currentColor" d="M3 4h14v2H3zM3 9h14v2H3zM3 14h14v2H3z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Contractors Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContractors.map(contractor => (
            <ContractorCard key={contractor.id} contractor={contractor} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contractor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projects
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredContractors.map(contractor => (
                <ContractorRow key={contractor.id} contractor={contractor} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Contractor Card Component
function ContractorCard({ contractor }: { contractor: any }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center">
              <h3 className="font-semibold text-gray-900">{contractor.name}</h3>
              {contractor.verified && (
                <Shield className="w-4 h-4 text-blue-600 ml-2" title="Verified" />
              )}
            </div>
            <p className="text-sm text-gray-600">{contractor.category}</p>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            contractor.status === 'available' ? 'bg-green-100 text-green-700' :
            contractor.status === 'busy' ? 'bg-yellow-100 text-yellow-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {contractor.status}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${
                  i <Math.floor(contractor.rating) 
                    ? 'text-yellow-500 fill-current' 
                    : 'text-gray-300'
                }`} 
              />
            ))}
          </div>
          <span className="ml-2 text-sm font-medium">{contractor.rating}</span>
          <span className="ml-1 text-sm text-gray-500">({contractor.reviews} reviews)</span>
        </div>

        {/* Location & Contact */}
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            {contractor.location}
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            {contractor.completedProjects} completed projects
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">On Time</p>
            <p className="text-lg font-semibold text-green-600">{contractor.performance.onTime}%</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">On Budget</p>
            <p className="text-lg font-semibold text-blue-600">{contractor.performance.onBudget}%</p>
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Certifications</p>
          <div className="flex flex-wrap gap-2">
            {contractor.certifications.map((cert: string, index: number) => (
              <span key={index: any} className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">
                {cert: any}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View Profile
          </button>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MessageSquare className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <FileText className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Contractor Row Component
function ContractorRow({ contractor }: { contractor: any }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div>
            <div className="flex items-center">
              <p className="font-medium text-gray-900">{contractor.name}</p>
              {contractor.verified && (
                <Shield className="w-4 h-4 text-blue-600 ml-2" />
              )}
            </div>
            <p className="text-sm text-gray-500">{contractor.location}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <p className="text-sm text-gray-900">{contractor.category}</p>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
          <span className="text-sm font-medium">{contractor.rating}</span>
          <span className="text-sm text-gray-500 ml-1">({contractor.reviews})</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <p className="text-xs text-gray-500">On Time</p>
            <p className="text-sm font-medium text-green-600">{contractor.performance.onTime}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">On Budget</p>
            <p className="text-sm font-medium text-blue-600">{contractor.performance.onBudget}%</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm">
          <p className="font-medium">{contractor.completedProjects}</p>
          <p className="text-gray-500">Completed</p>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          contractor.status === 'available' ? 'bg-green-100 text-green-700' :
          contractor.status === 'busy' ? 'bg-yellow-100 text-yellow-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {contractor.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <Link
          href={`/developer/team/contractors/${contractor.id}`}
          className="text-blue-600 hover:text-blue-700"
        >
          View
        </Link>
      </td>
    </tr>
  );
}