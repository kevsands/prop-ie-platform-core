'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  MapPin,
  Calendar,
  Euro,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  X,
  Upload
} from 'lucide-react';

interface DevelopmentFormData {
  // Basic Information
  name: string;
  description: string;
  location: string;
  address: string;
  city: string;
  county: string;
  postcode: string;

  // Development Details
  totalUnits: number;
  developmentType: string;
  completionDate: string;
  constructionStatus: string;

  // Features & Amenities
  amenities: string[];
  nearbyTransport: string[];
  nearbySchools: string[];

  // Media
  images: File[];
  brochure?: File;
  floorPlans?: File[];

  // Legal & Compliance
  planningPermission: string;
  berRating: string;
  developmentLicense: string;
}

const AMENITIES_OPTIONS = [
  'Gym',
  'Swimming Pool',
  'Playground',
  'Communal Gardens',
  'Parking',
  'Bike Storage',
  'Concierge',
  'Security',
  'EV Charging',
  'Roof Terrace'
];

const DEVELOPMENT_TYPES = [
  'Apartment Complex',
  'Housing Estate',
  'Mixed Use Development',
  'Student Accommodation',
  'Senior Living'
];

const CONSTRUCTION_STATUS = [
  'Planning',
  'Pre-Construction',
  'Under Construction',
  'Near Completion',
  'Completed'
];

export default function NewDevelopmentPage() {
  const router = useRouter();
  const [stepsetStep] = useState(1);
  const [formDatasetFormData] = useState<DevelopmentFormData>({
    name: '',
    description: '',
    location: '',
    address: '',
    city: '',
    county: '',
    postcode: '',
    totalUnits: 0,
    developmentType: '',
    completionDate: '',
    constructionStatus: '',
    amenities: [],
    nearbyTransport: [],
    nearbySchools: [],
    images: [],
    planningPermission: '',
    berRating: 'A',
    developmentLicense: ''
  });

  // Create development mutation
  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch('/api/developer/developments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: data
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create development');
      }

      return response.json();
    },
    onSuccess: (data: any) => {
      router.push(`/developer/developments/${data.id}`);
    }
  });

  const handleInputChange = (field: keyof DevelopmentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newImages = Array.from(files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(010) // Max 10 images
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_i: any) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    const data = new FormData();

    // Add all text fields
    Object.entries(formData).forEach(([keyvalue]) => {
      if (typeof value === 'string' || typeof value === 'number') {
        data.append(key, value.toString());
      } else if (Array.isArray(value) && typeof value[0] === 'string') {
        data.append(key, JSON.stringify(value));
      }
    });

    // Add images
    formData.images.forEach((imageindex: any) => {
      data.append(`images`, image);
    });

    // Add other files
    if (formData.brochure) {
      data.append('brochure', formData.brochure);
    }

    if (formData.floorPlans) {
      formData.floorPlans.forEach((plan: any) => {
        data.append('floorPlans', plan);
      });
    }

    createMutation.mutate(data);
  };

  const isStepValid = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        return !!(formData.name && formData.description && formData.location);
      case 2:
        return !!(formData.totalUnits> 0 && formData.developmentType && formData.completionDate);
      case 3:
        return formData.amenities.length> 0;
      case 4:
        return formData.images.length> 0;
      case 5:
        return !!(formData.planningPermission && formData.berRating);
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Development Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e: any) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Riverside Gardens"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e: any) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the development, its unique features, and target market..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e: any) => handleInputChange('location', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., North Dublin"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e: any) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e: any) => handleInputChange('city', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  County
                </label>
                <input
                  type="text"
                  value={formData.county}
                  onChange={(e: any) => handleInputChange('county', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postcode
                </label>
                <input
                  type="text"
                  value={formData.postcode}
                  onChange={(e: any) => handleInputChange('postcode', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Development Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Units *
                </label>
                <input
                  type="number"
                  value={formData.totalUnits}
                  onChange={(e: any) => handleInputChange('totalUnits', parseInt(e.target.value) || 0)}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Development Type *
                </label>
                <select
                  value={formData.developmentType}
                  onChange={(e: any) => handleInputChange('developmentType', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select type</option>
                  {DEVELOPMENT_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Completion *
                </label>
                <input
                  type="date"
                  value={formData.completionDate}
                  onChange={(e: any) => handleInputChange('completionDate', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Construction Status *
                </label>
                <select
                  value={formData.constructionStatus}
                  onChange={(e: any) => handleInputChange('constructionStatus', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select status</option>
                  {CONSTRUCTION_STATUS.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Features & Amenities</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Development Amenities *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {AMENITIES_OPTIONS.map(amenity => (
                  <label key={amenity} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={(e: any) => {
                        if (e.target.checked) {
                          handleInputChange('amenities', [...formData.amenitiesamenity]);
                        } else {
                          handleInputChange('amenities', formData.amenities.filter(a => a !== amenity));
                        }
                      }
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nearby Transport Links
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="e.g., Connolly Station (10 min walk)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e: any) => {
                    if (e.key === 'Enter') {
                      const value = (e.target as HTMLInputElement).value;
                      if (value) {
                        handleInputChange('nearbyTransport', [...formData.nearbyTransportvalue]);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => {
                    const input = document.querySelector('input[placeholder*="Transport"]') as HTMLInputElement;
                    if (input?.value) {
                      handleInputChange('nearbyTransport', [...formData.nearbyTransport, input.value]);
                      input.value = '';
                    }
                  }
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.nearbyTransport.map((transportindex: any) => (
                  <span
                    key={index}
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {transport}
                    <button
                      type="button"
                      onClick={() => handleInputChange('nearbyTransport', formData.nearbyTransport.filter((_i: any) => i !== index))}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Media & Documents</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Development Images * (Max 10)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e: any) => handleImageUpload(e.target.files)}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload images</span>
                  <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB each</span>
                </label>
              </div>

              {formData.images.length> 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {formData.images.map((imageindex: any) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Development Brochure (PDF)
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e: any) => handleInputChange('brochure', e.target.files?.[0])}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Legal & Compliance</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Planning Permission Number *
              </label>
              <input
                type="text"
                value={formData.planningPermission}
                onChange={(e: any) => handleInputChange('planningPermission', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., PL/2024/12345"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                BER Rating *
              </label>
              <select
                value={formData.berRating}
                onChange={(e: any) => handleInputChange('berRating', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Development License Number
              </label>
              <input
                type="text"
                value={formData.developmentLicense}
                onChange={(e: any) => handleInputChange('developmentLicense', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Compliance Note</p>
                  <p className="text-sm text-blue-800 mt-1">
                    All developments must comply with Irish planning regulations and building standards. 
                    Ensure all documentation is up to date before publishing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ProtectedRoute requiredRole={['developer', 'admin']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/developer/developments')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Development</h1>
                <p className="text-gray-600">Add a new property development to your portfolio</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 45].map((num: any) => (
                <div key={num} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                      step>= num
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step> num ? <CheckCircle className="w-5 h-5" /> : num}
                  </div>
                  {num <5 && (
                    <div
                      className={`h-0.5 w-full mx-2 ${
                        step> num ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>Basic Info</span>
              <span>Details</span>
              <span>Amenities</span>
              <span>Media</span>
              <span>Legal</span>
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            {renderStep()}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>

              {step <5 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={!isStepValid(step)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isStepValid(5) || createMutation.isPending}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Create Development
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Error Message */}
          {createMutation.isError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-800">
                  {createMutation.error?.message || 'Failed to create development. Please try again.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}