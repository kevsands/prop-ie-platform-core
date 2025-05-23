'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText,
  Shield,
  Users,
  Building,
  Briefcase,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Upload,
  Search,
  ChevronRight,
  ArrowRight,
  Calendar,
  Settings,
  Bell,
  BarChart3,
  Eye,
  Edit,
  Share2,
  CreditCard,
  Home,
  MapPin,
  Calculator,
  Plus,
  ChevronDown,
  UserPlus,
  FileCheck,
  ClipboardCheck,
  Circle,
  CheckSquare,
  Key,
  Minus,
  X
} from 'lucide-react';

// Mock data for demonstration
const developmentsList = [
  {
    id: 1,
    name: 'Fitzgerald Gardens',
    developer: 'Prestige Developments',
    units: 120,
    status: 'Active',
    slpProgress: 85,
    buyers: 102,
    completionDate: '2024-08-15',
    inProgressContracts: 8,
    completedContracts: 94
  },
  {
    id: 2,
    name: 'Ellwood',
    developer: 'Castle Developers',
    units: 65,
    status: 'Active',
    slpProgress: 92,
    buyers: 58,
    completionDate: '2024-06-30',
    inProgressContracts: 12,
    completedContracts: 46
  },
  {
    id: 3,
    name: 'Ballymakenny View',
    developer: 'Modern Homes Ltd',
    units: 40,
    status: 'Pre-Launch',
    slpProgress: 20,
    buyers: 15,
    completionDate: '2025-03-15',
    inProgressContracts: 0,
    completedContracts: 0
  }
];

const recentBuyers = [
  {
    id: 1,
    name: 'Sarah O\'Connor',
    development: 'Fitzgerald Gardens',
    unit: 'House 45',
    status: 'In Progress',
    progress: 60,
    lastUpdate: '2 hours ago',
    documents: 8,
    documentsCompleted: 5
  },
  {
    id: 2,
    name: 'Michael Murphy',
    development: 'Ellwood',
    unit: 'Apartment 12B',
    status: 'Review Required',
    progress: 35,
    lastUpdate: '1 day ago',
    documents: 6,
    documentsCompleted: 2
  },
  {
    id: 3,
    name: 'Emma Walsh',
    development: 'Fitzgerald Gardens',
    unit: 'House 67',
    status: 'Completed',
    progress: 100,
    lastUpdate: '3 days ago',
    documents: 10,
    documentsCompleted: 10
  }
];

const analytics = {
  totalTransactions: 156,
  averageTime: 28,
  successRate: 98.5,
  pendingReviews: 14
};

const progressSteps = [
  { id: 1, name: 'Initial Consultation', status: 'completed' },
  { id: 2, name: 'Agreement Drafted', status: 'completed' },
  { id: 3, name: 'Buyer Review', status: 'current' },
  { id: 4, name: 'HTB Application', status: 'upcoming' },
  { id: 5, name: 'Mortgage Approval', status: 'upcoming' },
  { id: 6, name: 'Final Review', status: 'upcoming' },
  { id: 7, name: 'Completion', status: 'upcoming' }
];

export default function SolicitorsDashboardPage() {
  const [selectedDevelopmentsetSelectedDevelopment] = useState(developmentsList[0]);
  const [selectedBuyersetSelectedBuyer] = useState(recentBuyers[0]);
  const [showNewClientModalsetShowNewClientModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-[#2B5273]">
                Prop
              </Link>
              <span className="ml-2 text-sm text-gray-600">Solicitor Portal</span>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900">
                <Search className="h-5 w-5" />
              </button>
              <button className="text-gray-600 hover:text-gray-900 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="text-gray-600 hover:text-gray-900">
                <Settings className="h-5 w-5" />
              </button>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#2B5273] rounded-full flex items-center justify-center text-white">
                  JD
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <FileText className="h-8 w-8 text-[#2B5273]" />
              <span className="text-sm text-green-600">+12%</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900">{analytics.totalTransactions}</h3>
            <p className="text-sm text-gray-600">Total Transactions</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-8 w-8 text-orange-500" />
              <span className="text-sm text-red-600">-5%</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900">{analytics.averageTime} days</h3>
            <p className="text-sm text-gray-600">Average Processing Time</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <span className="text-sm text-green-600">+2%</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900">{analytics.successRate}%</h3>
            <p className="text-sm text-gray-600">Success Rate</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="h-8 w-8 text-yellow-500" />
              <span className="text-sm text-yellow-600">Action</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900">{analytics.pendingReviews}</h3>
            <p className="text-sm text-gray-600">Pending Reviews</p>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Developments List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Active Developments</h2>
              </div>
              <div className="divide-y">
                {developmentsList.map(development => (
                  <div
                    key={development.id}
                    onClick={() => setSelectedDevelopment(development)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                      selectedDevelopment.id === development.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{development.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        development.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {development.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{development.developer}</p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{development.units} units</span>
                      <span>{development.buyers} buyers</span>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>SLP Progress</span>
                        <span>{development.slpProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#2B5273] h-2 rounded-full"
                          style={ width: `${development.slpProgress}%` }
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Development Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedDevelopment.name} - Overview
                  </h2>
                  <button
                    onClick={() => setShowNewClientModal(true)}
                    className="flex items-center px-4 py-2 bg-[#2B5273] text-white rounded-lg hover:bg-[#1E3142] transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Client
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Total Units</p>
                    <p className="text-2xl font-semibold">{selectedDevelopment.units}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Active Buyers</p>
                    <p className="text-2xl font-semibold text-green-600">{selectedDevelopment.buyers}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">In Progress</p>
                    <p className="text-2xl font-semibold text-yellow-600">{selectedDevelopment.inProgressContracts}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-semibold text-blue-600">{selectedDevelopment.completedContracts}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Development Timeline</p>
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                      <div className="text-center">
                        <Building className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">Construction</p>
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-green-500 rounded-full" style={ width: '75%' }></div>
                        </div>
                      </div>
                      <div className="text-center">
                        <Home className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">Completion</p>
                        <p className="text-xs font-medium">{selectedDevelopment.completionDate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      View All Buyers
                    </button>
                    <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      Download Reports
                    </button>
                  </div>

                  <Link href="/solicitor/conveyancing-dashboard">
                    <button className="w-full mt-4 px-4 py-2 bg-[#2B5273] text-white rounded-lg hover:bg-[#1E3142] transition-colors flex items-center justify-center">
                      <Briefcase className="h-4 w-4 mr-2" />
                      View Conveyancing Dashboard
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Buyers */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Recent Buyers</h2>
              </div>
              <div className="divide-y">
                {recentBuyers.map(buyer => (
                  <div
                    key={buyer.id}
                    onClick={() => setSelectedBuyer(buyer)}
                    className="p-4 cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{buyer.name}</h3>
                        <p className="text-sm text-gray-600">
                          {buyer.development} - {buyer.unit}
                        </p>
                      </div>
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        buyer.status === 'Completed' 
                          ? 'bg-green-100 text-green-800'
                          : buyer.status === 'Review Required'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {buyer.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          {buyer.documentsCompleted}/{buyer.documents} Docs
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {buyer.lastUpdate}
                        </span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          buyer.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={ width: `${buyer.progress}%` }
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Property Transaction Progress */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Transaction Progress - {selectedBuyer.name}
            </h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              {progressSteps.map((stepindex: any) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      step.status === 'completed'
                        ? 'bg-green-500 text-white'
                        : step.status === 'current'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {step.status === 'completed' ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <span className={`text-xs text-center ${
                      step.status === 'current' ? 'font-medium text-gray-900' : 'text-gray-600'
                    }`}>
                      {step.name}
                    </span>
                  </div>
                  {index <progressSteps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      progressSteps[index + 1].status !== 'upcoming'
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="flex space-x-4">
              <button className="flex-1 px-4 py-2 bg-[#2B5273] text-white rounded-lg hover:bg-[#1E3142] transition-colors">
                View Full Details
              </button>
              <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                Contact Buyer
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* New Client Modal */}
      {showNewClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Client</h3>
              <button
                onClick={() => setShowNewClientModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                  placeholder="Enter client name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Development
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5273]">
                  {developmentsList.map(dev => (
                    <option key={dev.id} value={dev.id}>{dev.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit Number
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                  placeholder="Enter unit number"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#2B5273] text-white rounded-lg hover:bg-[#1E3142] transition-colors"
                >
                  Add Client
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewClientModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}