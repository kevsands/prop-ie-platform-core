'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Plus, 
  Eye, 
  Edit, 
  MapPin, 
  Users, 
  Calendar,
  DollarSign,
  Filter,
  Search,
  Grid,
  List
} from 'lucide-react';

interface Property {
  id: string;
  name: string;
  location: {
    address: string;
    city: string;
    county: string;
  };
  totalUnits: number;
  soldUnits: number;
  availableUnits: number;
  status: 'planning' | 'construction' | 'selling' | 'completed';
  priceRange: {
    min: number;
    max: number;
  };
  estimatedCompletion: string;
  projectType: 'residential' | 'commercial' | 'mixed';
  lastUpdated: string;
}

// Mock data for development properties
const mockProperties: Property[] = [
  {
    id: 'fitzgerald-gardens',
    name: 'Fitzgerald Gardens',
    location: {
      address: 'Rathmullan Road',
      city: 'Drogheda',
      county: 'Co. Louth'
    },
    totalUnits: 96,
    soldUnits: 23,
    availableUnits: 73,
    status: 'selling',
    priceRange: {
      min: 350000,
      max: 650000
    },
    estimatedCompletion: '2026-03',
    projectType: 'residential',
    lastUpdated: '2025-06-14'
  },
  {
    id: 'ellwood',
    name: 'Ellwood',
    location: {
      address: 'Rathmines',
      city: 'Dublin 6',
      county: 'Dublin'
    },
    totalUnits: 14,
    soldUnits: 8,
    availableUnits: 6,
    status: 'construction',
    priceRange: {
      min: 450000,
      max: 750000
    },
    estimatedCompletion: '2025-12',
    projectType: 'residential',
    lastUpdated: '2025-06-13'
  },
  {
    id: 'ballymakenny-view',
    name: 'Ballymakenny View',
    location: {
      address: 'Ballymakenny Road',
      city: 'Drogheda',
      county: 'Co. Louth'
    },
    totalUnits: 32,
    soldUnits: 0,
    availableUnits: 32,
    status: 'planning',
    priceRange: {
      min: 320000,
      max: 520000
    },
    estimatedCompletion: '2027-06',
    projectType: 'residential',
    lastUpdated: '2025-06-12'
  }
];

export default function PropertiesPage() {
  const [properties] = useState<Property[]>(mockProperties);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'construction': return 'bg-blue-100 text-blue-800';
      case 'selling': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planning': return 'In Planning';
      case 'construction': return 'Under Construction';
      case 'selling': return 'Selling';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const PropertyCard = ({ property }: { property: Property }) => (
    <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{property.name}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              {property.location.city}, {property.location.county}
            </div>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(property.status)}`}>
            {getStatusText(property.status)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2 text-blue-500" />
            <span>{property.totalUnits} Units</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-2 text-green-500" />
            <span>€{(property.priceRange.min / 1000).toFixed(0)}k - €{(property.priceRange.max / 1000).toFixed(0)}k</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-purple-500" />
            <span>{property.estimatedCompletion}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Building2 className="h-4 w-4 mr-2 text-orange-500" />
            <span className="capitalize">{property.projectType}</span>
          </div>
        </div>

        {property.status === 'selling' && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Sales Progress</span>
              <span>{property.soldUnits}/{property.totalUnits} sold</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(property.soldUnits / property.totalUnits) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <Link 
            href={`/developer/projects/${property.id}`}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Link>
          <Link 
            href={`/developer/projects/${property.id}?tab=settings`}
            className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </div>
      </div>
    </div>
  );

  const PropertyRow = ({ property }: { property: Property }) => (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">{property.name}</div>
          <div className="text-sm text-gray-500">{property.location.city}, {property.location.county}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(property.status)}`}>
          {getStatusText(property.status)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {property.totalUnits}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {property.status === 'selling' ? `${property.soldUnits}/${property.totalUnits}` : '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        €{(property.priceRange.min / 1000).toFixed(0)}k - €{(property.priceRange.max / 1000).toFixed(0)}k
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {property.estimatedCompletion}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex space-x-2">
          <Link 
            href={`/developer/projects/${property.id}`}
            className="text-blue-600 hover:text-blue-900"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <Link 
            href={`/developer/projects/${property.id}?tab=settings`}
            className="text-gray-600 hover:text-gray-900"
          >
            <Edit className="h-4 w-4" />
          </Link>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
                <p className="text-sm text-gray-600">Manage all your development projects</p>
              </div>
            </div>
            <Link
              href="/developer/new-project"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Link>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="planning">In Planning</option>
                <option value="construction">Under Construction</option>
                <option value="selling">Selling</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Properties Display */}
        {filteredProperties.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-12 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating your first development project.'
              }
            </p>
            <Link
              href="/developer/new-project"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Project
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Units
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sales
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price Range
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completion
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProperties.map((property) => (
                  <PropertyRow key={property.id} property={property} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}