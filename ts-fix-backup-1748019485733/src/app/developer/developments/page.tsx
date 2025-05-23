'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, Search, Filter, Download, Grid, List, Building,
  MapPin, Calendar, TrendingUp, Users, Package, AlertCircle,
  ChevronRight, MoreVertical, Eye, Edit, Trash2, Copy,
  BarChart3, CreditCard, Clock, CheckCircle, XCircle,
  Image as ImageIcon, FileText, Target
} from 'lucide-react';

export default function DevelopmentsPage() {
  const [viewModesetViewMode] = useState('grid');
  const [filterOpensetFilterOpen] = useState(false);
  const [selectedStatussetSelectedStatus] = useState('all');
  const [searchQuerysetSearchQuery] = useState('');

  // Mock data for developments
  const developments = [
    {
      id: '1',
      name: 'Fitzgerald Gardens',
      location: 'Drogheda',
      status: 'active',
      phase: 'Construction Phase 3',
      completionRate: 75,
      totalUnits: 120,
      soldUnits: 95,
      availableUnits: 25,
      totalValue: '€48.0M',
      roi: 22.5,
      startDate: '2023-01-15',
      expectedCompletion: '2025-03-31',
      image: '/images/developments/fitzgerald-gardens.jpg',
      team: 18,
      contractors: 12,
      lastActivity: '2 hours ago',
      alerts: 0
    },
    {
      id: '2',
      name: 'Ellwood',
      location: 'Dublin 15',
      status: 'active',
      phase: 'Sales Phase',
      completionRate: 90,
      totalUnits: 65,
      soldUnits: 45,
      availableUnits: 20,
      totalValue: '€35.2M',
      roi: 24.7,
      startDate: '2022-09-01',
      expectedCompletion: '2024-12-31',
      image: '/images/developments/ellwood.jpg',
      team: 14,
      contractors: 8,
      lastActivity: '1 hour ago',
      alerts: 1
    },
    {
      id: '3',
      name: 'Ballymakenny View',
      location: 'Drogheda',
      status: 'active',
      phase: 'Phase 2 Construction',
      completionRate: 45,
      totalUnits: 40,
      soldUnits: 18,
      availableUnits: 22,
      totalValue: '€16.0M',
      roi: 20.1,
      startDate: '2023-06-15',
      expectedCompletion: '2025-06-30',
      image: '/images/developments/ballymakenny-view.jpg',
      team: 10,
      contractors: 6,
      lastActivity: '5 hours ago',
      alerts: 0
    }
  ];

  const filteredDevelopments = developments.filter(dev => {
    const matchesStatus = selectedStatus === 'all' || dev.status === selectedStatus;
    const matchesSearch = dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dev.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Developments</h1>
            <p className="text-gray-600">Manage your property development portfolio</p>
          </div>
          <Link
            href="/developer/developments/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Development
          </Link>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search developments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>

            {/* More Filters */}
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Export */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Download className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Developments</span>
            <Building className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold">12</p>
          <p className="text-xs text-gray-500 mt-1">3 in planning, 8 active, 1 completed</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Portfolio Value</span>
            <CreditCard className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold">€256.8M</p>
          <p className="text-xs text-green-600 mt-1">+15.3% YoY</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Average ROI</span>
            <Target className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold">19.8%</p>
          <p className="text-xs text-gray-500 mt-1">Above 15% target</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Units Available</span>
            <Package className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold">287</p>
          <p className="text-xs text-gray-500 mt-1">Across all developments</p>
        </div>
      </div>

      {/* Developments Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevelopments.map(dev => (
            <DevelopmentCard key={dev.id} development={dev} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Development
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Units
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ROI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDevelopments.map(dev => (
                <DevelopmentRow key={dev.id} development={dev} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Card view component
function DevelopmentCard({ development }) {
  const [menuOpensetMenuOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-gray-200">
        <img
          src={development.image}
          alt={development.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }
        />
        <div className="absolute inset-0 bg-gray-100 items-center justify-center hidden">
          <ImageIcon className="w-12 h-12 text-gray-400" />
        </div>
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            development.status === 'active' ? 'bg-green-100 text-green-700' :
            development.status === 'planning' ? 'bg-blue-100 text-blue-700' :
            development.status === 'completed' ? 'bg-gray-100 text-gray-700' :
            'bg-yellow-100 text-yellow-700'
          }`}>
            {development.status}
          </span>
        </div>
        {development.alerts> 0 && (
          <div className="absolute top-3 left-3">
            <div className="bg-red-500 text-white rounded-full p-1">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-gray-900">{development.name}</h3>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {development.location}
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <Link href={`/developer/developments/${development.id}`} className="flex items-center px-4 py-2 text-sm hover:bg-gray-50">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Link>
                <Link href={`/developer/developments/${development.id}/edit`} className="flex items-center px-4 py-2 text-sm hover:bg-gray-50">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Link>
                <button className="flex items-center px-4 py-2 text-sm hover:bg-gray-50 w-full text-left">
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </button>
                <button className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">{development.phase}</span>
            <span className="font-medium">{development.completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={ width: `${development.completionRate}%` }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500">Units</p>
            <p className="font-medium">{development.soldUnits}/{development.totalUnits}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Value</p>
            <p className="font-medium">{development.totalValue}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">ROI</p>
            <p className="font-medium text-green-600">{development.roi}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Team</p>
            <p className="font-medium">{development.team} members</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="w-3 h-3 mr-1" />
            {development.lastActivity}
          </div>
          <Link
            href={`/developer/developments/${development.id}`}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
          >
            View Details
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// List view row component
function DevelopmentRow({ development }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3 overflow-hidden">
            <img
              src={development.image}
              alt={development.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }
            />
            <div className="w-full h-full bg-gray-100 items-center justify-center hidden">
              <Building className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div>
            <p className="font-medium text-gray-900">{development.name}</p>
            <p className="text-sm text-gray-500">{development.location}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          development.status === 'active' ? 'bg-green-100 text-green-700' :
          development.status === 'planning' ? 'bg-blue-100 text-blue-700' :
          development.status === 'completed' ? 'bg-gray-100 text-gray-700' :
          'bg-yellow-100 text-yellow-700'
        }`}>
          {development.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={ width: `${development.completionRate}%` }
            />
          </div>
          <span className="text-sm">{development.completionRate}%</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm">
          <p className="font-medium">{development.soldUnits}/{development.totalUnits}</p>
          <p className="text-gray-500">Sold/Total</p>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <p className="text-sm font-medium">{development.totalValue}</p>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <p className="text-sm font-medium text-green-600">{development.roi}%</p>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Users className="w-4 h-4 text-gray-400 mr-1" />
          <span className="text-sm">{development.team}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <Link
          href={`/developer/developments/${development.id}`}
          className="text-blue-600 hover:text-blue-700"
        >
          View
        </Link>
      </td>
    </tr>
  );
}