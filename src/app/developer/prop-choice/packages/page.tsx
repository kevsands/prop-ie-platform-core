'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Copy, 
  Eye, 
  DollarSign, 
  Tag, 
  Image as ImageIcon, 
  Settings, 
  TrendingUp, 
  Users, 
  BarChart3, 
  ArrowUpRight, 
  ChevronDown, 
  X, 
  Save, 
  Upload, 
  Home, 
  Sparkles, 
  Cpu, 
  Crown, 
  Palette, 
  Wrench,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

interface PackageItem {
  id: string;
  name: string;
  category: 'room_packs' | 'smart_features' | 'premium_upgrades';
  description: string;
  basePrice: number;
  costPrice: number;
  margin: number;
  status: 'active' | 'draft' | 'discontinued';
  popularity: number;
  orders: number;
  image?: string;
  features: string[];
  unitTypes: string[];
  createdAt: string;
  updatedAt: string;
}

export default function PackageManagement() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock data - in real implementation, this would come from API
  useEffect(() => {
    const mockPackages: PackageItem[] = [
      {
        id: 'pkg_001',
        name: 'Premium Living Room Pack',
        category: 'room_packs',
        description: 'Complete living room transformation with premium furniture, lighting, and accessories',
        basePrice: 4750,
        costPrice: 3100,
        margin: 35,
        status: 'active',
        popularity: 89,
        orders: 23,
        image: '/images/packages/living-room.jpg',
        features: ['Premium Sofa Set', 'Designer Coffee Table', 'Ambient Lighting', 'Art & Accessories'],
        unitTypes: ['1-bed', '2-bed', '3-bed'],
        createdAt: '2025-01-15',
        updatedAt: '2025-02-01'
      },
      {
        id: 'pkg_002',
        name: 'Smart Home Security Package',
        category: 'smart_features',
        description: 'Comprehensive security system with smart locks, cameras, and monitoring',
        basePrice: 3200,
        costPrice: 1920,
        margin: 40,
        status: 'active',
        popularity: 94,
        orders: 31,
        image: '/images/packages/security.jpg',
        features: ['Smart Door Locks', 'Security Cameras', 'Motion Sensors', 'Mobile App Control'],
        unitTypes: ['all'],
        createdAt: '2025-01-20',
        updatedAt: '2025-02-05'
      },
      {
        id: 'pkg_003',
        name: 'Luxury Kitchen Upgrade',
        category: 'premium_upgrades',
        description: 'High-end kitchen appliances and finishes upgrade package',
        basePrice: 8950,
        costPrice: 6440,
        margin: 28,
        status: 'active',
        popularity: 76,
        orders: 18,
        image: '/images/packages/kitchen.jpg',
        features: ['Premium Appliances', 'Quartz Countertops', 'Soft-Close Cabinets', 'Wine Cooler'],
        unitTypes: ['2-bed', '3-bed', 'penthouse'],
        createdAt: '2025-01-10',
        updatedAt: '2025-01-28'
      },
      {
        id: 'pkg_004',
        name: 'Home Office Productivity Suite',
        category: 'room_packs',
        description: 'Complete home office setup with ergonomic furniture and tech integration',
        basePrice: 2850,
        costPrice: 1995,
        margin: 30,
        status: 'draft',
        popularity: 0,
        orders: 0,
        image: '/images/packages/office.jpg',
        features: ['Ergonomic Desk', 'Office Chair', 'Monitor Mount', 'Cable Management'],
        unitTypes: ['2-bed', '3-bed'],
        createdAt: '2025-02-01',
        updatedAt: '2025-02-01'
      },
      {
        id: 'pkg_005',
        name: 'Climate Control Pro',
        category: 'smart_features',
        description: 'Advanced HVAC automation with smart thermostats and air quality monitoring',
        basePrice: 2400,
        costPrice: 1560,
        margin: 35,
        status: 'active',
        popularity: 67,
        orders: 14,
        image: '/images/packages/climate.jpg',
        features: ['Smart Thermostats', 'Air Quality Sensors', 'Automated Ventilation', 'Energy Monitoring'],
        unitTypes: ['all'],
        createdAt: '2025-01-25',
        updatedAt: '2025-02-03'
      }
    ];
    setPackages(mockPackages);
  }, []);

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || pkg.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || pkg.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categoryStats = {
    room_packs: packages.filter(p => p.category === 'room_packs').length,
    smart_features: packages.filter(p => p.category === 'smart_features').length,
    premium_upgrades: packages.filter(p => p.category === 'premium_upgrades').length,
    total: packages.length
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'room_packs': return <Home size={16} className="text-blue-600" />;
      case 'smart_features': return <Cpu size={16} className="text-green-600" />;
      case 'premium_upgrades': return <Crown size={16} className="text-purple-600" />;
      default: return <Package size={16} className="text-gray-600" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'room_packs': return 'Room Packs';
      case 'smart_features': return 'Smart Features';
      case 'premium_upgrades': return 'Premium Upgrades';
      default: return 'Unknown';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': 
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1">
          <CheckCircle size={12} />
          Active
        </span>;
      case 'draft': 
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full flex items-center gap-1">
          <Clock size={12} />
          Draft
        </span>;
      case 'discontinued': 
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center gap-1">
          <X size={12} />
          Discontinued
        </span>;
      default: 
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Unknown</span>;
    }
  };

  const handleCreatePackage = () => {
    setSelectedPackage(null);
    setShowCreateModal(true);
  };

  const handleEditPackage = (pkg: PackageItem) => {
    setSelectedPackage(pkg);
    setShowCreateModal(true);
  };

  const handleDeletePackage = (pkgId: string) => {
    if (confirm('Are you sure you want to delete this package?')) {
      setPackages(packages.filter(p => p.id !== pkgId));
    }
  };

  const handleDuplicatePackage = (pkg: PackageItem) => {
    const newPackage = {
      ...pkg,
      id: `pkg_${Date.now()}`,
      name: `${pkg.name} (Copy)`,
      status: 'draft' as const,
      orders: 0,
      popularity: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setPackages([...packages, newPackage]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package size={24} className="text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Package Management</h1>
                <p className="text-gray-600">Create and manage PROP Choice customization packages</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Package size={16} className="text-blue-600" />
                <span className="text-gray-600">{categoryStats.total} Total Packages</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-green-600" />
                <span className="text-gray-600">{packages.filter(p => p.status === 'active').length} Active</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-purple-600" />
                <span className="text-gray-600">{packages.reduce((sum, p) => sum + p.orders, 0)} Total Orders</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/developer/prop-choice" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <ArrowUpRight size={16} />
              Back to Dashboard
            </Link>
            <button 
              onClick={handleCreatePackage}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Create Package
            </button>
          </div>
        </div>
      </div>

      {/* Category Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <Home size={20} className="text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Room Packs</p>
              <p className="text-xl font-bold text-gray-900">{categoryStats.room_packs}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <Cpu size={20} className="text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Smart Features</p>
              <p className="text-xl font-bold text-gray-900">{categoryStats.smart_features}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <Crown size={20} className="text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Premium Upgrades</p>
              <p className="text-xl font-bold text-gray-900">{categoryStats.premium_upgrades}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <BarChart3 size={20} className="text-amber-600" />
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-xl font-bold text-gray-900">€{packages.reduce((sum, p) => sum + (p.basePrice * p.orders), 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
          
          {/* Category Filter */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
            >
              <option value="all">All Categories</option>
              <option value="room_packs">Room Packs</option>
              <option value="smart_features">Smart Features</option>
              <option value="premium_upgrades">Premium Upgrades</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="discontinued">Discontinued</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} transition-colors`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} transition-colors`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Package Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredPackages.map((pkg) => (
          <div key={pkg.id} className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow ${viewMode === 'list' ? 'p-6' : 'overflow-hidden'}`}>
            {viewMode === 'grid' ? (
              // Grid View
              <div>
                {/* Package Image */}
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <ImageIcon size={48} className="text-gray-400" />
                </div>
                
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getCategoryIcon(pkg.category)}
                        <span className="text-xs text-gray-500">{getCategoryLabel(pkg.category)}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{pkg.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{pkg.description}</p>
                    </div>
                    <div className="ml-3">
                      {getStatusBadge(pkg.status)}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-lg font-bold text-gray-900">€{pkg.basePrice.toLocaleString()}</span>
                      <span className="text-sm text-gray-500 ml-2">{pkg.margin}% margin</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {pkg.orders} orders
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {pkg.features.slice(0, 2).map((feature, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {feature}
                        </span>
                      ))}
                      {pkg.features.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          +{pkg.features.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditPackage(pkg)}
                      className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDuplicatePackage(pkg)}
                      className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      onClick={() => handleDeletePackage(pkg.id)}
                      className="px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // List View
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ImageIcon size={24} className="text-gray-400" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {getCategoryIcon(pkg.category)}
                        <span className="text-xs text-gray-500">{getCategoryLabel(pkg.category)}</span>
                        {getStatusBadge(pkg.status)}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{pkg.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{pkg.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="font-medium">€{pkg.basePrice.toLocaleString()}</span>
                        <span>{pkg.margin}% margin</span>
                        <span>{pkg.orders} orders</span>
                        <span>Updated {pkg.updatedAt}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditPackage(pkg)}
                        className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDuplicatePackage(pkg)}
                        className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={() => handleDeletePackage(pkg.id)}
                        className="px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPackages.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <Package size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No packages found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' 
              ? 'Try adjusting your filters to see more packages.'
              : 'Get started by creating your first customization package.'
            }
          </p>
          <button
            onClick={handleCreatePackage}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <Plus size={16} />
            Create Package
          </button>
        </div>
      )}

      {/* Create/Edit Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedPackage ? 'Edit Package' : 'Create New Package'}
              </h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Package creation/editing form would go here...</p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Save size={16} />
                  {selectedPackage ? 'Update Package' : 'Create Package'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}