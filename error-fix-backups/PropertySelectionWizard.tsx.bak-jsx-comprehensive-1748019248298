'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Home,
  MapPin,
  Euro,
  Bed,
  Car,
  Train,
  GraduationCap,
  ShoppingCart,
  TreePine,
  Building2,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowRight,
  Clock,
  Shield
} from 'lucide-react';

interface PropertyCriteria {
  priceRange: { min: number; max: number };
  propertyTypes: string[];
  bedrooms: { min: number; max: number };
  locations: string[];
  amenities: string[];
  commute: {
    workplace?: string;
    maxTime?: number;
    transportModes: string[];
  };
  mustHaves: string[];
  niceToHaves: string[];
}

interface AvailableProperty {
  id: string;
  name: string;
  type: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  location: string;
  energyRating: string;
  completion: string;
  image: string;
  features: string[];
  status: 'available' | 'limited' | 'sold';
  htbEligible: boolean;
  stampDutyExempt: boolean;
}

export default function PropertySelectionWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [criteria, setCriteria] = useState<PropertyCriteria>({
    priceRange: { min: 250000, max: 450000 },
    propertyTypes: [],
    bedrooms: { min: 2, max: 4 },
    locations: [],
    amenities: [],
    commute: { transportModes: [] },
    mustHaves: [],
    niceToHaves: []
  });

  const [matchingProperties] = useState<AvailableProperty[]>([
    {
      id: 'fitzgerald-1',
      name: 'Fitzgerald Gardens - Type A',
      type: '3 Bed Semi-Detached',
      price: 385000,
      bedrooms: 3,
      bathrooms: 2,
      location: 'Celbridge, Co. Kildare',
      energyRating: 'A2',
      completion: 'Q2 2025',
      image: '/images/fitzgerald-gardens/type-a.jpg',
      features: ['Private Garden', 'Driveway Parking', 'En-suite Master'],
      status: 'available',
      htbEligible: true,
      stampDutyExempt: true
    },
    {
      id: 'ballymakenny-1',
      name: 'Ballymakenny View - Corner Plot',
      type: '4 Bed Detached',
      price: 425000,
      bedrooms: 4,
      bathrooms: 3,
      location: 'Drogheda, Co. Louth',
      energyRating: 'A3',
      completion: 'Q3 2025',
      image: '/images/ballymakenny-view/type-c.jpg',
      features: ['Corner Plot', 'Home Office', 'Triple Glazing'],
      status: 'limited',
      htbEligible: true,
      stampDutyExempt: true
    }
  ]);

  const steps = [
    { title: 'Budget & Finance', icon: Euro },
    { title: 'Property Type', icon: Home },
    { title: 'Location & Commute', icon: MapPin },
    { title: 'Must-Have Features', icon: CheckCircle },
    { title: 'View Matches', icon: Building2 }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Your Budget Range</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Price (€)
                  </label>
                  <input
                    type="number"
                    value={criteria.priceRange.min}
                    onChange={(e) => setCriteria({
                      ...criteria,
                      priceRange: { ...criteria.priceRange, min: parseInt(e.target.value) }
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Price (€)
                  </label>
                  <input
                    type="number"
                    value={criteria.priceRange.max}
                    onChange={(e) => setCriteria({
                      ...criteria,
                      priceRange: { ...criteria.priceRange, max: parseInt(e.target.value) }
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-start">
                <CheckCircle className="text-green-600 mr-3 mt-1" />
                <div>
                  <h4 className="font-semibold text-green-900">Help-to-Buy Eligible</h4>
                  <p className="text-green-800 text-sm mt-1">
                    Properties under €500,000 qualify for HTB tax relief up to €30,000
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="text-blue-600 mr-3 mt-1" />
                <div>
                  <h4 className="font-semibold text-blue-900">Stamp Duty Exemption</h4>
                  <p className="text-blue-800 text-sm mt-1">
                    First-time buyers are exempt from stamp duty on properties up to €500,000
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Property Type Preferences</h3>
              <div className="grid grid-cols-2 gap-4">
                {['Semi-Detached', 'Detached', 'Terraced', 'Apartment', 'Duplex', 'Townhouse'].map((type) => (
                  <label key={type} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={criteria.propertyTypes.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCriteria({
                            ...criteria,
                            propertyTypes: [...criteria.propertyTypes, type]
                          });
                        } else {
                          setCriteria({
                            ...criteria,
                            propertyTypes: criteria.propertyTypes.filter(t => t !== type)
                          });
                        }
                      }}
                      className="mr-3"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Number of Bedrooms</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Bedrooms
                  </label>
                  <select
                    value={criteria.bedrooms.min}
                    onChange={(e) => setCriteria({
                      ...criteria,
                      bedrooms: { ...criteria.bedrooms, min: parseInt(e.target.value) }
                    })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Bedrooms
                  </label>
                  <select
                    value={criteria.bedrooms.max}
                    onChange={(e) => setCriteria({
                      ...criteria,
                      bedrooms: { ...criteria.bedrooms, max: parseInt(e.target.value) }
                    })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Preferred Locations</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Dublin City', 'Dublin South', 'Dublin North', 'Dublin West',
                  'Kildare', 'Meath', 'Wicklow', 'Louth', 'Cork', 'Galway'
                ].map((location) => (
                  <label key={location} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={criteria.locations.includes(location)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCriteria({
                            ...criteria,
                            locations: [...criteria.locations, location]
                          });
                        } else {
                          setCriteria({
                            ...criteria,
                            locations: criteria.locations.filter(l => l !== location)
                          });
                        }
                      }}
                      className="mr-3"
                    />
                    <span>{location}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Commute Requirements</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Workplace/Area
                  </label>
                  <input
                    type="text"
                    value={criteria.commute.workplace || ''}
                    onChange={(e) => setCriteria({
                      ...criteria,
                      commute: { ...criteria.commute, workplace: e.target.value }
                    })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="e.g., Dublin City Centre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Commute Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={criteria.commute.maxTime || ''}
                    onChange={(e) => setCriteria({
                      ...criteria,
                      commute: { ...criteria.commute, maxTime: parseInt(e.target.value) }
                    })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="45"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Transport
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { name: 'Car', icon: Car },
                      { name: 'Train/DART', icon: Train },
                      { name: 'Bus', icon: Building2 }
                    ].map(({ name, icon: Icon }) => (
                      <label key={name} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={criteria.commute.transportModes.includes(name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCriteria({
                                ...criteria,
                                commute: {
                                  ...criteria.commute,
                                  transportModes: [...criteria.commute.transportModes, name]
                                }
                              });
                            } else {
                              setCriteria({
                                ...criteria,
                                commute: {
                                  ...criteria.commute,
                                  transportModes: criteria.commute.transportModes.filter(m => m !== name)
                                }
                              });
                            }
                          }}
                          className="mr-2"
                        />
                        <Icon size={20} className="mr-2" />
                        <span>{name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Must-Have Features</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Private Garden', 'Parking Space', 'En-suite Bathroom', 'Home Office',
                  'Storage Room', 'South-Facing Garden', 'Walk-in Wardrobe', 'Garage'
                ].map((feature) => (
                  <label key={feature} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={criteria.mustHaves.includes(feature)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCriteria({
                            ...criteria,
                            mustHaves: [...criteria.mustHaves, feature]
                          });
                        } else {
                          setCriteria({
                            ...criteria,
                            mustHaves: criteria.mustHaves.filter(f => f !== feature)
                          });
                        }
                      }}
                      className="mr-3"
                    />
                    <span>{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Nice-to-Have Features</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Near Schools', 'Near Shopping', 'Near Parks', 'Quiet Area',
                  'Public Transport', 'New Development', 'Mature Area', 'Good Investment'
                ].map((feature) => (
                  <label key={feature} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={criteria.niceToHaves.includes(feature)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCriteria({
                            ...criteria,
                            niceToHaves: [...criteria.niceToHaves, feature]
                          });
                        } else {
                          setCriteria({
                            ...criteria,
                            niceToHaves: criteria.niceToHaves.filter(f => f !== feature)
                          });
                        }
                      }}
                      className="mr-3"
                    />
                    <span>{feature}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Matching Properties</h3>
              <span className="text-sm text-gray-600">
                {matchingProperties.length} properties match your criteria
              </span>
            </div>

            {matchingProperties.map((property) => (
              <div key={property.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex">
                  <div className="w-1/3">
                    <img 
                      src={property.image} 
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold">{property.name}</h4>
                        <p className="text-gray-600">{property.type}</p>
                        <p className="text-gray-600 flex items-center mt-1">
                          <MapPin size={16} className="mr-1" />
                          {property.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">€{property.price.toLocaleString()}</p>
                        {property.status === 'limited' && (
                          <span className="inline-block mt-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                            Limited Availability
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                      <div className="flex items-center">
                        <Bed size={16} className="mr-1 text-gray-500" />
                        <span>{property.bedrooms} Beds</span>
                      </div>
                      <div className="flex items-center">
                        <Home size={16} className="mr-1 text-gray-500" />
                        <span>{property.bathrooms} Baths</span>
                      </div>
                      <div className="flex items-center">
                        <Shield size={16} className="mr-1 text-gray-500" />
                        <span>BER {property.energyRating}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1 text-gray-500" />
                        <span>{property.completion}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {property.features.map((feature, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-3">
                        {property.htbEligible && (
                          <span className="inline-flex items-center text-green-600 text-sm">
                            <CheckCircle size={16} className="mr-1" />
                            HTB Eligible
                          </span>
                        )}
                        {property.stampDutyExempt && (
                          <span className="inline-flex items-center text-blue-600 text-sm">
                            <CheckCircle size={16} className="mr-1" />
                            Stamp Duty Exempt
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => router.push(`/properties/${property.id}`)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="text-amber-600 mr-3 mt-1" />
                <div>
                  <h4 className="font-semibold text-amber-900">Legal Note</h4>
                  <p className="text-amber-800 text-sm mt-1">
                    Viewing a property creates no obligation. However, once you pay a booking deposit, 
                    you enter into a legal commitment to purchase subject to contract.
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
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                index < currentStep
                  ? 'bg-green-600 text-white'
                  : index === currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                <step.icon size={20} />
              </div>
              {index < steps.length - 1 && (
                <div className={`w-full h-1 mx-2 ${
                  index < currentStep ? 'bg-green-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold">{steps[currentStep].title}</h2>
          <p className="text-gray-600 mt-1">Step {currentStep + 1} of {steps.length}</p>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className={`px-6 py-2 rounded-lg ${
            currentStep === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          {currentStep === steps.length - 1 ? 'Save Search' : 'Next'}
          <ArrowRight size={20} className="ml-2" />
        </button>
      </div>
    </div>
  );
}