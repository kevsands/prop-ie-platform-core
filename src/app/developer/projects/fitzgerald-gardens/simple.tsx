'use client';

import React from 'react';
import { fitzgeraldGardensConfig } from '@/data/fitzgerald-gardens-config';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Euro, 
  Users,
  Target,
  Phone,
  Mail,
  User
} from 'lucide-react';

export default function SimpleFitzgeraldGardensProject() {
  const project = fitzgeraldGardensConfig;

  // Calculate metrics from config
  const totalRevenue = project.soldToDate * 350000; // Average price
  const availableUnits = project.totalUnits - project.soldToDate - project.reservedUnits;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Project Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Building2 size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.projectName}</h1>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <MapPin size={18} />
                <span>{project.location}</span>
              </div>
            </div>
          </div>

          <p className="text-gray-700 mb-6">{project.description}</p>

          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-blue-600" />
              <span className="text-gray-600">Completion: {new Date(project.estimatedCompletion).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target size={16} className="text-green-600" />
              <span className="text-gray-600">{project.completionPercentage}% Complete</span>
            </div>
            <div className="flex items-center gap-2">
              <Euro size={16} className="text-purple-600" />
              <span className="text-gray-600">Investment: €{(project.totalInvestment / 1000000).toFixed(1)}M</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Project Progress</span>
              <span className="text-sm text-gray-600">{project.currentPhase}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${project.completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Units</p>
                <p className="text-3xl font-bold text-gray-900">{project.totalUnits}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Units Sold</p>
                <p className="text-3xl font-bold text-green-600">{project.soldToDate}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reserved</p>
                <p className="text-3xl font-bold text-amber-600">{project.reservedUnits}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-3xl font-bold text-blue-600">{availableUnits}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 size={24} className="text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Unit Types */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Unit Types & Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(project.unitTypes).map(([type, details]) => (
              <div key={type} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-2 capitalize">
                  {type.replace(/_/g, ' ').replace('apartment', 'Apartment')}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Count:</span>
                    <span className="font-medium">{details.count} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Price:</span>
                    <span className="font-medium text-green-600">€{details.basePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Size:</span>
                    <span className="font-medium">{details.size} sqm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Bedrooms:</span>
                    <span className="font-medium">{details.bedrooms} bed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Contacts */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Key Contacts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(project.keyContacts).map(([role, contact]) => (
              <div key={role} className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <User size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{role}</h3>
                    <p className="text-sm text-gray-600">{contact.company}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">{contact.name}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={14} />
                    <span>{contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={14} />
                    <span>{contact.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Financial Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">€{(totalRevenue / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-green-600">Revenue to Date</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">€{(project.totalInvestment / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-blue-600">Total Investment</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">{Math.round((project.soldToDate / project.totalUnits) * 100)}%</p>
              <p className="text-sm text-purple-600">Units Sold</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}