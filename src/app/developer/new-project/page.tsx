'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  Users, 
  Calendar,
  DollarSign,
  FileText,
  ArrowLeft,
  Save,
  Plus
} from 'lucide-react';

interface ProjectFormData {
  name: string;
  description: string;
  location: {
    address: string;
    city: string;
    county: string;
    eircode: string;
  };
  projectType: 'residential' | 'commercial' | 'mixed';
  totalUnits: number;
  estimatedCompletion: string;
  planningStagea: 'pre-planning' | 'planning-submitted' | 'planning-approved' | 'construction';
  targetMarket: 'first-time-buyers' | 'investors' | 'luxury' | 'affordable';
  priceRange: {
    min: number;
    max: number;
  };
}

export default function NewProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    location: {
      address: '',
      city: '',
      county: '',
      eircode: ''
    },
    projectType: 'residential',
    totalUnits: 0,
    estimatedCompletion: '',
    planningStagea: 'pre-planning',
    targetMarket: 'first-time-buyers',
    priceRange: {
      min: 0,
      max: 0
    }
  });

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof ProjectFormData],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, this would create the project via API
      console.log('Creating new project:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to the new project
      const projectId = `${formData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      router.push(`/developer/projects/${projectId}`);
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </button>
              <div className="flex items-center">
                <Building2 className="h-6 w-6 text-blue-600 mr-2" />
                <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Project Name *
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g. Fitzgerald Gardens"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Brief description of the development..."
                />
              </div>

              <div>
                <label htmlFor="projectType" className="block text-sm font-medium text-gray-700">
                  Project Type *
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  required
                  value={formData.projectType}
                  onChange={(e) => handleInputChange('projectType', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="mixed">Mixed Use</option>
                </select>
              </div>

              <div>
                <label htmlFor="targetMarket" className="block text-sm font-medium text-gray-700">
                  Target Market *
                </label>
                <select
                  id="targetMarket"
                  name="targetMarket"
                  required
                  value={formData.targetMarket}
                  onChange={(e) => handleInputChange('targetMarket', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="first-time-buyers">First-Time Buyers</option>
                  <option value="investors">Investors</option>
                  <option value="luxury">Luxury Market</option>
                  <option value="affordable">Affordable Housing</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              Location
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  required
                  value={formData.location.address}
                  onChange={(e) => handleInputChange('location.address', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Street address"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City/Town *
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  required
                  value={formData.location.city}
                  onChange={(e) => handleInputChange('location.city', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g. Drogheda"
                />
              </div>

              <div>
                <label htmlFor="county" className="block text-sm font-medium text-gray-700">
                  County *
                </label>
                <input
                  type="text"
                  name="county"
                  id="county"
                  required
                  value={formData.location.county}
                  onChange={(e) => handleInputChange('location.county', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g. Co. Louth"
                />
              </div>

              <div>
                <label htmlFor="eircode" className="block text-sm font-medium text-gray-700">
                  Eircode
                </label>
                <input
                  type="text"
                  name="eircode"
                  id="eircode"
                  value={formData.location.eircode}
                  onChange={(e) => handleInputChange('location.eircode', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g. A92 X1X1"
                />
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              Project Details
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label htmlFor="totalUnits" className="block text-sm font-medium text-gray-700">
                  Total Units *
                </label>
                <input
                  type="number"
                  name="totalUnits"
                  id="totalUnits"
                  required
                  min="1"
                  value={formData.totalUnits}
                  onChange={(e) => handleInputChange('totalUnits', parseInt(e.target.value) || 0)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="estimatedCompletion" className="block text-sm font-medium text-gray-700">
                  Estimated Completion *
                </label>
                <input
                  type="month"
                  name="estimatedCompletion"
                  id="estimatedCompletion"
                  required
                  value={formData.estimatedCompletion}
                  onChange={(e) => handleInputChange('estimatedCompletion', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="planningStagea" className="block text-sm font-medium text-gray-700">
                  Planning Stage *
                </label>
                <select
                  id="planningStagea"
                  name="planningStagea"
                  required
                  value={formData.planningStagea}
                  onChange={(e) => handleInputChange('planningStagea', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="pre-planning">Pre-Planning</option>
                  <option value="planning-submitted">Planning Submitted</option>
                  <option value="planning-approved">Planning Approved</option>
                  <option value="construction">Under Construction</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
              Pricing Range
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">
                  Minimum Price (€)
                </label>
                <input
                  type="number"
                  name="minPrice"
                  id="minPrice"
                  min="0"
                  step="1000"
                  value={formData.priceRange.min}
                  onChange={(e) => handleInputChange('priceRange.min', parseInt(e.target.value) || 0)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g. 350000"
                />
              </div>

              <div>
                <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">
                  Maximum Price (€)
                </label>
                <input
                  type="number"
                  name="maxPrice"
                  id="maxPrice"
                  min="0"
                  step="1000"
                  value={formData.priceRange.max}
                  onChange={(e) => handleInputChange('priceRange.max', parseInt(e.target.value) || 0)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g. 650000"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}