'use client';

import React, { useState, useMemo } from 'react';
import { 
  Briefcase, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  DollarSign,
  CheckCircle, 
  AlertCircle, 
  Plus,
  Search,
  Filter,
  MoreVertical,
  Award,
  Shield,
  Users,
  TrendingUp,
  Building,
  FileText,
  ExternalLink,
  Edit,
  Trash2,
  UserPlus,
  Eye,
  Download
} from 'lucide-react';

interface Contractor {
  id: string;
  name: string;
  company: string;
  category: string;
  specialties: string[];
  rating: number;
  reviews: number;
  location: string;
  email: string;
  phone: string;
  status: 'available' | 'busy' | 'booked';
  hourlyRate: number;
  projects: {
    current: number;
    completed: number;
  };
  performance: {
    onTime: number;
    onBudget: number;
    quality: number;
  };
  certifications: string[];
  insurance: {
    liability: boolean;
    workersComp: boolean;
    expiry: string;
  };
  joinDate: string;
  lastActive: string;
  portfolio: string[];
  isVerified: boolean;
}

export default function ContractorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock contractor data - in production this would come from the API
  const contractors: Contractor[] = useMemo(() => [
    {
      id: '1',
      name: 'Michael Murphy',
      company: 'Murphy Construction Ltd',
      category: 'General Contractor',
      specialties: ['Foundation Work', 'Structural', 'Project Management'],
      rating: 4.8,
      reviews: 47,
      location: 'Drogheda, Louth',
      email: 'michael@murphyconstruction.ie',
      phone: '+353 41 987 6543',
      status: 'available',
      hourlyRate: 85,
      projects: { current: 2, completed: 23 },
      performance: { onTime: 95, onBudget: 92, quality: 96 },
      certifications: ['CIF Certified', 'CSCS Card', 'SafePass'],
      insurance: { liability: true, workersComp: true, expiry: '2025-12-31' },
      joinDate: '2023-01-15',
      lastActive: '2024-06-10',
      portfolio: ['Fitzgerald Gardens Phase 1', 'Ellwood Development'],
      isVerified: true
    },
    {
      id: '2',
      name: 'Sarah O\'Brien',
      company: 'Elite Electrical Services',
      category: 'Electrical',
      specialties: ['Residential Wiring', 'Smart Home Systems', 'Solar Installation'],
      rating: 4.9,
      reviews: 62,
      location: 'Dublin',
      email: 'sarah@eliteelectrical.ie',
      phone: '+353 1 234 5678',
      status: 'busy',
      hourlyRate: 75,
      projects: { current: 3, completed: 38 },
      performance: { onTime: 98, onBudget: 94, quality: 97 },
      certifications: ['RECI Certified', 'SEAI Approved', 'SafePass'],
      insurance: { liability: true, workersComp: true, expiry: '2025-08-15' },
      joinDate: '2022-11-20',
      lastActive: '2024-06-15',
      portfolio: ['Ballymakenny View', 'Fitzgerald Gardens'],
      isVerified: true
    },
    {
      id: '3',
      name: 'James Kelly',
      company: 'Kelly Plumbing & Heating',
      category: 'Plumbing',
      specialties: ['Central Heating', 'Underfloor Heating', 'Bathroom Installation'],
      rating: 4.6,
      reviews: 34,
      location: 'Drogheda, Louth',
      email: 'james@kellyplumbing.ie',
      phone: '+353 41 876 5432',
      status: 'available',
      hourlyRate: 68,
      projects: { current: 1, completed: 19 },
      performance: { onTime: 89, onBudget: 91, quality: 93 },
      certifications: ['RGII Registered', 'SafePass'],
      insurance: { liability: true, workersComp: false, expiry: '2025-10-20' },
      joinDate: '2023-03-10',
      lastActive: '2024-06-12',
      portfolio: ['Fitzgerald Gardens', 'Various Residential'],
      isVerified: true
    },
    {
      id: '4',
      name: 'David Lynch',
      company: 'Lynch Architectural Services',
      category: 'Architecture',
      specialties: ['Residential Design', 'Planning Applications', '3D Visualization'],
      rating: 4.7,
      reviews: 28,
      location: 'Dublin',
      email: 'david@lyncharchitecture.ie',
      phone: '+353 1 345 6789',
      status: 'booked',
      hourlyRate: 120,
      projects: { current: 4, completed: 15 },
      performance: { onTime: 92, onBudget: 88, quality: 95 },
      certifications: ['RIAI Member', 'MRIAI'],
      insurance: { liability: true, workersComp: true, expiry: '2026-01-15' },
      joinDate: '2023-06-01',
      lastActive: '2024-06-14',
      portfolio: ['Ellwood Development', 'Ballymakenny View Phase 2'],
      isVerified: true
    },
    {
      id: '5',
      name: 'Emma Thompson',
      company: 'Thompson Landscaping',
      category: 'Landscaping',
      specialties: ['Garden Design', 'Hardscaping', 'Maintenance'],
      rating: 4.5,
      reviews: 41,
      location: 'Meath',
      email: 'emma@thompsonlandscaping.ie',
      phone: '+353 46 123 4567',
      status: 'available',
      hourlyRate: 55,
      projects: { current: 2, completed: 29 },
      performance: { onTime: 94, onBudget: 96, quality: 91 },
      certifications: ['Horticulture Certified', 'SafePass'],
      insurance: { liability: true, workersComp: true, expiry: '2025-09-30' },
      joinDate: '2022-08-15',
      lastActive: '2024-06-13',
      portfolio: ['Fitzgerald Gardens Landscaping'],
      isVerified: true
    }
  ], []);

  const categories = [
    'all',
    'General Contractor',
    'Electrical',
    'Plumbing',
    'Architecture',
    'Landscaping'
  ];

  const filteredContractors = useMemo(() => {
    return contractors.filter(contractor => {
      const matchesSearch = contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contractor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contractor.specialties.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || contractor.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.hourlyRate - b.hourlyRate;
        case 'projects':
          return b.projects.completed - a.projects.completed;
        default:
          return 0;
      }
    });
  }, [contractors, searchTerm, selectedCategory, sortBy]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'booked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'General Contractor':
        return Building;
      case 'Electrical':
        return Award;
      case 'Plumbing':
        return Users;
      case 'Architecture':
        return FileText;
      case 'Landscaping':
        return Users;
      default:
        return Briefcase;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Contractor Directory</h1>
            <p className="text-blue-100 text-lg">
              Certified professionals for all your development needs
            </p>
            <div className="flex items-center mt-4 space-x-6">
              <div className="flex items-center">
                <Users className="mr-2" size={20} />
                <span className="font-medium">{contractors.length} Contractors</span>
              </div>
              <div className="flex items-center">
                <Star className="mr-2" size={20} />
                <span className="font-medium">4.7 Avg Rating</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="mr-2" size={20} />
                <span className="font-medium">95% Completion Rate</span>
              </div>
            </div>
          </div>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center">
            <UserPlus className="mr-2" size={20} />
            Add Contractor
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search contractors, companies, or specialties..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="rating">Sort by Rating</option>
            <option value="price">Sort by Price</option>
            <option value="projects">Sort by Experience</option>
          </select>
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
            >
              <Building size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
            >
              <Users size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Contractors Grid/List */}
      <div className={viewMode === 'grid' ? 
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 
        'space-y-4'
      }>
        {filteredContractors.map((contractor) => {
          const CategoryIcon = getCategoryIcon(contractor.category);
          
          if (viewMode === 'list') {
            return (
              <div key={contractor.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <CategoryIcon className="text-white" size={24} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900">{contractor.name}</h3>
                        {contractor.isVerified && (
                          <Shield className="text-blue-500" size={16} />
                        )}
                      </div>
                      <p className="text-gray-600">{contractor.company}</p>
                      <p className="text-sm text-gray-500">{contractor.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      <Star className="text-yellow-500 fill-current" size={16} />
                      <span className="font-medium">{contractor.rating}</span>
                      <span className="text-gray-500 text-sm">({contractor.reviews})</span>
                    </div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contractor.status)}`}>
                      {contractor.status}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">€{contractor.hourlyRate}/hr</p>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={contractor.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <CategoryIcon className="text-white" size={20} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{contractor.name}</h3>
                      {contractor.isVerified && (
                        <Shield className="text-blue-500" size={14} />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{contractor.company}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">{contractor.category}</p>
                <div className="flex flex-wrap gap-1">
                  {contractor.specialties.slice(0, 2).map((specialty) => (
                    <span key={specialty} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                      {specialty}
                    </span>
                  ))}
                  {contractor.specialties.length > 2 && (
                    <span className="text-gray-500 text-xs">+{contractor.specialties.length - 2}</span>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="text-yellow-500 fill-current" size={14} />
                    <span className="font-medium">{contractor.rating}</span>
                    <span className="text-gray-500">({contractor.reviews})</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Projects</span>
                  <span className="font-medium">{contractor.projects.completed} completed</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Rate</span>
                  <span className="font-medium">€{contractor.hourlyRate}/hr</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contractor.status)}`}>
                  {contractor.status}
                </span>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                    <Eye size={16} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded">
                    <Mail size={16} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded">
                    <Phone size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Results Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Showing {filteredContractors.length} of {contractors.length} contractors
          </p>
          <div className="flex space-x-2">
            <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center">
              <Download className="mr-2" size={16} />
              Export List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}