'use client';

// TypeScript interfaces
interface HouseType {
  id: string;
  name: string;
  description: string;
  size: string;
  bedrooms: number;
  bathrooms: number;
  floorPlanImages: string[];
}

interface Amenity {
  name: string;
  distance: string;
}

interface Coordinates {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Unit {
  id: string;
  number: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  sqm: number;
  status: 'available' | 'reserved' | 'sold';
  price: number;
  coordinates: Coordinates;
}

interface GalleryImage {
  src: string;
  alt: string;
}

interface LegalInfo {
  developer: string;
  solicitor: string;
  contact: string;
  documents: string[];
}

interface AmenityGroups {
  schools: Amenity[];
  shopping: Amenity[];
  transport: Amenity[];
  leisure: Amenity[];
}

interface Development {
  id: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  features: string[];
  propertyTypes: HouseType[];
  units: Unit[];
  galleryImages: GalleryImage[];
  amenities: AmenityGroups;
  legalInfo: LegalInfo;
}

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DevelopmentSiteMap from '@/components/property/DevelopmentSiteMap';

// Mock data for Fitzgerald Gardens based on the SOA document
const fitzgeraldGardens: Development = {
  id: 'fitzgerald-gardens',
  name: 'Fitzgerald Gardens',
  slug: 'fitzgerald-gardens',
  location: 'Drogheda, Ireland',
  description: 'Luxurious living with modern comforts in the heart of Drogheda. A perfect location with everything you need and want.',
  features: [
    'Energy-efficient design',
    'Premium doors and ironmongery',
    'Contemporary fitted kitchens',
    'Sustainable energy solutions',
    'High-performance windows and ventilation',
    'Guaranteed quality and peace of mind'
  ],
  propertyTypes: [
    {
      id: 'type-a',
      name: 'Houses Type A',
      description: '3 Bedroom Semi-Detached',
      size: '107 SQM / 1151 SQFT',
      bedrooms: 3,
      bathrooms: 2,
      floorPlanImages: ['/images/fitzgerald-gardens/type-a-ground.png', '/images/fitzgerald-gardens/type-a-first.png']
    },
    {
      id: 'type-b',
      name: 'Houses Type B',
      description: '3 Bedroom Semi-Detached with Bay Window',
      size: '109.4 SQM / 1177 SQFT',
      bedrooms: 3,
      bathrooms: 2,
      floorPlanImages: ['/images/fitzgerald-gardens/type-b-ground.png', '/images/fitzgerald-gardens/type-b-first.png']
    },
    {
      id: 'type-c',
      name: 'Houses Type C',
      description: '4 Bedroom End Terrace',
      size: '144 SQM / 1550 SQFT',
      bedrooms: 4,
      bathrooms: 3,
      floorPlanImages: ['/images/fitzgerald-gardens/type-c-ground.png', '/images/fitzgerald-gardens/type-c-first.png']
    }
  ],
  // Mock units based on the SOA document
  units: [
    {
      id: '1',
      number: '1',
      type: '4B/7P End Terrace',
      bedrooms: 4,
      bathrooms: 3,
      sqm: 144,
      status: 'available',
      price: 450000,
      coordinates: { x: 10, y: 20, width: 5, height: 5 }
    },
    {
      id: '2',
      number: '2',
      type: '2B/4P Terraced',
      bedrooms: 2,
      bathrooms: 2,
      sqm: 87,
      status: 'available',
      price: 320000,
      coordinates: { x: 16, y: 20, width: 5, height: 5 }
    },
    {
      id: '3',
      number: '3',
      type: '2B/4P Terraced',
      bedrooms: 2,
      bathrooms: 2,
      sqm: 87,
      status: 'reserved',
      price: 320000,
      coordinates: { x: 22, y: 20, width: 5, height: 5 }
    },
    // Add more units based on the SOA document
    // This is just a starter set - we would add all 96 units with proper coordinates
  ],
  // Additional images for gallery
  galleryImages: [
    { src: '/images/fitzgerald-gardens/gallery-1.jpg', alt: 'Exterior view of Fitzgerald Gardens homes' },
    { src: '/images/fitzgerald-gardens/gallery-2.jpg', alt: 'Modern kitchen in Fitzgerald Gardens' },
    { src: '/images/fitzgerald-gardens/gallery-3.jpg', alt: 'Spacious living room at Fitzgerald Gardens' },
    { src: '/images/fitzgerald-gardens/gallery-4.jpg', alt: 'Master bedroom at Fitzgerald Gardens' },
    { src: '/images/fitzgerald-gardens/gallery-5.jpg', alt: 'Family bathroom at Fitzgerald Gardens' },
    { src: '/images/fitzgerald-gardens/gallery-6.jpg', alt: 'Garden space at Fitzgerald Gardens' }
  ],
  // Mock amenities data
  amenities: {
    schools: [
      { name: 'St. Mary\'s Primary School', distance: '0.5 km' },
      { name: 'Drogheda Grammar School', distance: '1.2 km' },
      { name: 'Sacred Heart Secondary School', distance: '1.5 km' }
    ],
    shopping: [
      { name: 'Drogheda Town Centre', distance: '1.8 km' },
      { name: 'Scotch Hall Shopping Centre', distance: '2 km' },
      { name: 'Southgate Shopping Centre', distance: '1.5 km' }
    ],
    transport: [
      { name: 'Drogheda Train Station', distance: '2.3 km' },
      { name: 'Dublin Airport', distance: '35 km' },
      { name: 'M1 Motorway', distance: '3 km' }
    ],
    leisure: [
      { name: 'Drogheda Leisure Park', distance: '2.1 km' },
      { name: 'County Louth Golf Club', distance: '5 km' },
      { name: 'Boyne River Greenway', distance: '1.2 km' }
    ]
  },
  // Legal information
  legalInfo: {
    developer: 'Fitzgerald Developments Ltd',
    solicitor: 'Smith & Associates',
    contact: 'legal@fitzgeraldgardens.ie',
    documents: [
      'Contract for Sale',
      'Building Agreement',
      'Title Documents',
      'Management Company Details',
      'Building Energy Rating Certificates'
    ]
  }
};

export default function FitzgeraldGardensPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHouseType, setSelectedHouseType] = useState<HouseType | null>(null);

  // Simulating loading state
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Format price with Euro currency symbol
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Show house type details or default view
  const showHouseTypeDetails = (typeId: string) => {
    setSelectedHouseType(fitzgeraldGardens.propertyTypes.find(type => type.id === typeId) || null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2B5273]"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E3142]/80 to-[#1E3142]/60 z-10"></div>
        <Image
          src="/images/fitzgerald-gardens/hero.jpg"
          alt="Fitzgerald Gardens"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            FITZGERALD GARDENS
          </h1>
          <div className="w-20 h-1 bg-[#C9A86E] mb-6"></div>
          <p className="text-xl md:text-2xl text-white max-w-2xl">
            Your new home at Fitzgerald Gardens in Drogheda
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              className="bg-[#7EEAE4] hover:bg-[#6CD9D3] text-[#1E3142] font-medium py-3 px-8 rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7EEAE4]"
              aria-label="Register interest in Fitzgerald Gardens"
            >
              Register Interest
            </button>
            <button
              className="bg-transparent border-2 border-white text-white font-medium py-3 px-8 rounded-full hover:bg-white/10 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
              onClick={() => setActiveTab('site-plan')}
              aria-label="View available properties at Fitzgerald Gardens"
            >
              View Available Properties
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Tabs Navigation */}
        <div className="flex overflow-x-auto mb-8 border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === 'overview'
                ? 'text-[#2B5273] border-b-2 border-[#2B5273]'
                : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('overview')}
            aria-pressed={activeTab === 'overview'}
            aria-label="Show overview information"
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === 'site-plan'
                ? 'text-[#2B5273] border-b-2 border-[#2B5273]'
                : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('site-plan')}
            aria-pressed={activeTab === 'site-plan'}
            aria-label="Show site plan"
          >
            Site Plan
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === 'house-types'
                ? 'text-[#2B5273] border-b-2 border-[#2B5273]'
                : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('house-types')}
            aria-pressed={activeTab === 'house-types'}
            aria-label="Show house types"
          >
            House Types
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === 'features'
                ? 'text-[#2B5273] border-b-2 border-[#2B5273]'
                : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('features')}
            aria-pressed={activeTab === 'features'}
            aria-label="Show features"
          >
            Features
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === 'location'
                ? 'text-[#2B5273] border-b-2 border-[#2B5273]'
                : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('location')}
            aria-pressed={activeTab === 'location'}
            aria-label="Show location information"
          >
            Location
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === 'gallery'
                ? 'text-[#2B5273] border-b-2 border-[#2B5273]'
                : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('gallery')}
            aria-pressed={activeTab === 'gallery'}
            aria-label="Show gallery"
          >
            Gallery
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === 'solicitors'
                ? 'text-[#2B5273] border-b-2 border-[#2B5273]'
                : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('solicitors')}
            aria-pressed={activeTab === 'solicitors'}
            aria-label="Show information for solicitors"
          >
            For Solicitors
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-3xl font-bold text-[#2B5273] mb-6">
                LUXURIOUS LIVING WITH MODERN COMFORTS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div>
                  <p className="text-gray-700 mb-4">
                    Fitzgerald Gardens offers a perfect blend of modern design and practical living spaces in the heart of Drogheda. With excellent connectivity to Dublin and beyond, these energy-efficient homes provide the ideal setting for families and professionals alike.
                  </p>
                  <p className="text-gray-700 mb-4">
                    Each home is finished to the highest standards, with contemporary kitchens, premium doors and ironmongery, and sustainable energy solutions that ensure comfort while reducing environmental impact.
                  </p>
                  <div className="mt-6">
                    <button
                      className="bg-[#2B5273] hover:bg-[#1E3142] text-white font-medium py-3 px-8 rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]"
                      onClick={() => setActiveTab('site-plan')}
                      aria-label="View available properties at Fitzgerald Gardens"
                    >
                      View Available Properties
                    </button>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-[#2B5273] mb-4">Development Highlights</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>2, 3 and 4 bedroom homes available</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Energy-efficient design with A2 BER rating</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Contemporary fitted kitchens with integrated appliances</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Just 30 minutes from Dublin City Centre</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Excellent local amenities and schools</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Help-to-Buy scheme available for first-time buyers</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Key facts section */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-[#2B5273] mb-6">Key Facts</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <div className="text-[#C9A86E] text-4xl font-bold mb-2">96</div>
                    <div className="text-gray-700">Total Units</div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <div className="text-[#C9A86E] text-4xl font-bold mb-2">A2</div>
                    <div className="text-gray-700">BER Rating</div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <div className="text-[#C9A86E] text-4xl font-bold mb-2">2-4</div>
                    <div className="text-gray-700">Bedrooms</div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <div className="text-[#C9A86E] text-4xl font-bold mb-2">30min</div>
                    <div className="text-gray-700">To Dublin</div>
                  </div>
                </div>
              </div>

              <div className="bg-[#1E3142] text-white p-8 rounded-lg mb-12">
                <h3 className="text-2xl font-bold mb-4">Register Your Interest</h3>
                <p className="mb-6">Be among the first to secure your dream home at Fitzgerald Gardens. Register your interest today to receive priority updates and exclusive offers.</p>
                <button
                  className="bg-[#7EEAE4] hover:bg-[#6CD9D3] text-[#1E3142] font-medium py-3 px-8 rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7EEAE4]"
                  aria-label="Register interest in Fitzgerald Gardens"
                >
                  Register Now
                </button>
              </div>
            </div>
          )}

          {/* Site Plan Tab */}
          {activeTab === 'site-plan' && (
            <div>
              <h2 className="text-3xl font-bold text-[#2B5273] mb-6">
                SITE PLAN
              </h2>
              <p className="text-gray-700 mb-8">
                Explore our interactive site plan to view available properties at Fitzgerald Gardens. Click on a unit to view detailed information and floor plans.
              </p>

              {(() => {
                // Cleaned object for DevelopmentSiteMap
                const developmentForSiteMap = {
                  id: fitzgeraldGardens.id,
                  name: fitzgeraldGardens.name,
                  slug: fitzgeraldGardens.slug,
                  units: fitzgeraldGardens.units
                };
                return (
                  <DevelopmentSiteMap development={developmentForSiteMap} />
                );
              })()}

              <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-[#2B5273] mb-4">Available House Types</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {fitzgeraldGardens.propertyTypes.map((type) => (
                    <div key={type.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-[#2B5273]">{type.name}</h4>
                      <p className="text-sm text-gray-600">{type.description}</p>
                      <p className="text-sm text-gray-600">{type.size}</p>
                      <button
                        className="mt-4 text-[#2B5273] hover:text-[#1E3142] text-sm font-medium flex items-center focus:outline-none focus:underline"
                        onClick={() => {
                          setActiveTab('house-types');
                          showHouseTypeDetails(type.id);
                        }}
                        aria-label={`View floor plans for ${type.name}`}
                      >
                        View Floor Plans
                        <svg className="h-4 w-4 ml-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Property filter section */}
              <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-[#2B5273] mb-4">Filter Properties</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label htmlFor="property-type" className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                    <select
                      id="property-type"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                    >
                      <option value="">All Types</option>
                      <option value="2-bed">2 Bedroom</option>
                      <option value="3-bed">3 Bedroom</option>
                      <option value="4-bed">4 Bedroom</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="price-range" className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                    <select
                      id="price-range"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                    >
                      <option value="">All Prices</option>
                      <option value="300-350">€300,000 - €350,000</option>
                      <option value="350-400">€350,000 - €400,000</option>
                      <option value="400+">€400,000+</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      id="status"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                    >
                      <option value="">All Statuses</option>
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                      <option value="sold">Sold</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      className="w-full bg-[#2B5273] hover:bg-[#1E3142] text-white font-medium py-2 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>

                {/* Available properties list */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-700 mb-3">Available Properties:</h4>
                  <div className="bg-gray-50 rounded-md p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 font-medium text-gray-700 pb-2 border-b border-gray-200">
                      <div>Unit</div>
                      <div>Type</div>
                      <div>Size</div>
                      <div>Price</div>
                      <div>Action</div>
                    </div>
                    {fitzgeraldGardens.units.map((unit) => (
                      <div key={unit.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 py-4 border-b border-gray-200 last:border-0">
                        <div className="font-medium">{unit.number}</div>
                        <div>{unit.type}</div>
                        <div>{unit.sqm} m²</div>
                        <div className="font-medium text-[#2B5273]">{formatPrice(unit.price)}</div>
                        <div>
                          <button
                            className={`px-4 py-1.5 rounded-md text-sm font-medium ${unit.status === 'available'
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : unit.status === 'reserved'
                                  ? 'bg-yellow-100 text-yellow-800 cursor-not-allowed'
                                  : 'bg-red-100 text-red-800 cursor-not-allowed'
                              } transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]`}
                            disabled={unit.status !== 'available'}
                            aria-label={unit.status === 'available' ? `View details for unit ${unit.number}` : `Unit ${unit.number} is ${unit.status}`}
                          >
                            {unit.status === 'available' ? 'View Details' : unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* House Types Tab */}
          {activeTab === 'house-types' && (
            <div>
              <h2 className="text-3xl font-bold text-[#2B5273] mb-6">
                HOUSE TYPES
              </h2>
              <p className="text-gray-700 mb-8">
                Explore our range of thoughtfully designed house types at Fitzgerald Gardens. Each home offers spacious living areas, modern finishes, and energy-efficient features.
              </p>

              {/* House Type Selection */}
              <div className="flex flex-wrap gap-4 mb-8">
                {fitzgeraldGardens.propertyTypes.map((type) => (
                  <button
                    key={type.id}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273] ${selectedHouseType?.id === type.id
                        ? 'bg-[#2B5273] text-white'
                        : 'bg-white text-[#2B5273] hover:bg-gray-100 border border-[#2B5273]'
                      }`}
                    onClick={() => showHouseTypeDetails(type.id)}
                    aria-pressed={selectedHouseType?.id === type.id}
                    aria-label={`Show details for ${type.name}`}
                  >
                    {type.name}
                  </button>
                ))}
              </div>

              {/* House Type A */}
              {(!selectedHouseType || selectedHouseType.id === 'type-a') && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-10">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-[#C9A86E] rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                        A
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#2B5273]">HOUSES TYPE A</h3>
                        <p className="text-gray-600">3 BEDROOM SEMI-DETACHED • 107 SQM / 1151 SQFT</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold text-[#2B5273] mb-2">GROUND FLOOR</h4>
                        <div className="bg-gray-100 p-4 rounded-lg h-64 flex items-center justify-center">
                          <p className="text-gray-500 text-sm">Floor plan image will be displayed here</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#2B5273] mb-2">FIRST FLOOR</h4>
                        <div className="bg-gray-100 p-4 rounded-lg h-64 flex items-center justify-center">
                          <p className="text-gray-500 text-sm">Floor plan image will be displayed here</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h4 className="font-semibold text-[#2B5273] mb-2">KEY FEATURES</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Open plan kitchen/dining area</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Separate living room</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Utility room</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Guest WC on ground floor</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Master bedroom with en-suite</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Two additional bedrooms</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Family bathroom</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Landscaped front and rear gardens</span>
                        </li>
                      </ul>
                    </div>
                    <div className="mt-8">
                      <h4 className="font-semibold text-[#2B5273] mb-2">DIMENSIONS</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h5 className="font-medium text-gray-900">Ground Floor</h5>
                          <ul className="mt-2 space-y-2">
                            <li className="flex justify-between border-b border-gray-200 pb-1">
                              <span className="text-gray-600">Kitchen/Dining</span>
                              <span className="text-gray-900">5.4m x 3.8m</span>
                            </li>
                            <li className="flex justify-between border-b border-gray-200 pb-1">
                              <span className="text-gray-600">Living Room</span>
                              <span className="text-gray-900">4.5m x 3.6m</span>
                            </li>
                            <li className="flex justify-between border-b border-gray-200 pb-1">
                              <span className="text-gray-600">Utility</span>
                              <span className="text-gray-900">2.1m x 1.7m</span>
                            </li>
                            <li className="flex justify-between pb-1">
                              <span className="text-gray-600">WC</span>
                              <span className="text-gray-900">1.8m x 0.9m</span>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">First Floor</h5>
                          <ul className="mt-2 space-y-2">
                            <li className="flex justify-between border-b border-gray-200 pb-1">
                              <span className="text-gray-600">Master Bedroom</span>
                              <span className="text-gray-900">3.8m x 3.5m</span>
                            </li>
                            <li className="flex justify-between border-b border-gray-200 pb-1">
                              <span className="text-gray-600">En-suite</span>
                              <span className="text-gray-900">2.2m x 1.2m</span>
                            </li>
                            <li className="flex justify-between border-b border-gray-200 pb-1">
                              <span className="text-gray-600">Bedroom 2</span>
                              <span className="text-gray-900">3.4m x 3.0m</span>
                            </li>
                            <li className="flex justify-between border-b border-gray-200 pb-1">
                              <span className="text-gray-600">Bedroom 3</span>
                              <span className="text-gray-900">2.8m x 2.6m</span>
                            </li>
                            <li className="flex justify-between pb-1">
                              <span className="text-gray-600">Bathroom</span>
                              <span className="text-gray-900">2.2m x 1.9m</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 flex justify-center">
                      <button
                        className="bg-[#2B5273] hover:bg-[#1E3142] text-white font-medium py-3 px-8 rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]"
                        aria-label="View available Type A houses"
                      >
                        View Available Type A Houses
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* House Type B */}
              {selectedHouseType && selectedHouseType.id === 'type-b' && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-10">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-[#C9A86E] rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                        B
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#2B5273]">HOUSES TYPE B</h3>
                        <p className="text-gray-600">3 BEDROOM SEMI-DETACHED WITH BAY WINDOW • 109.4 SQM / 1177 SQFT</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold text-[#2B5273] mb-2">GROUND FLOOR</h4>
                        <div className="bg-gray-100 p-4 rounded-lg h-64 flex items-center justify-center">
                          <p className="text-gray-500 text-sm">Floor plan image will be displayed here</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#2B5273] mb-2">FIRST FLOOR</h4>
                        <div className="bg-gray-100 p-4 rounded-lg h-64 flex items-center justify-center">
                          <p className="text-gray-500 text-sm">Floor plan image will be displayed here</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h4 className="font-semibold text-[#2B5273] mb-2">KEY FEATURES</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Elegant bay window in living room</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Open plan kitchen/dining area</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Utility room</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Guest WC on ground floor</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Master bedroom with en-suite</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Two additional bedrooms</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Family bathroom</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Landscaped front and rear gardens</span>
                        </li>
                      </ul>
                    </div>
                    <div className="mt-8 flex justify-center">
                      <button
                        className="bg-[#2B5273] hover:bg-[#1E3142] text-white font-medium py-3 px-8 rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]"
                        aria-label="View available Type B houses"
                      >
                        View Available Type B Houses
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* House Type C */}
              {selectedHouseType && selectedHouseType.id === 'type-c' && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-10">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-[#C9A86E] rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                        C
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#2B5273]">HOUSES TYPE C</h3>
                        <p className="text-gray-600">4 BEDROOM END TERRACE • 144 SQM / 1550 SQFT</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold text-[#2B5273] mb-2">GROUND FLOOR</h4>
                        <div className="bg-gray-100 p-4 rounded-lg h-64 flex items-center justify-center">
                          <p className="text-gray-500 text-sm">Floor plan image will be displayed here</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#2B5273] mb-2">FIRST FLOOR</h4>
                        <div className="bg-gray-100 p-4 rounded-lg h-64 flex items-center justify-center">
                          <p className="text-gray-500 text-sm">Floor plan image will be displayed here</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h4 className="font-semibold text-[#2B5273] mb-2">KEY FEATURES</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Spacious 4-bedroom layout</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Large open plan kitchen/dining/family area</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Separate living room</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Utility room</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Guest WC on ground floor</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Master bedroom with en-suite</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Second bedroom with en-suite</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Two additional bedrooms</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Family bathroom</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Landscaped front and rear gardens</span>
                        </li>
                      </ul>
                    </div>
                    <div className="mt-8 flex justify-center">
                      <button
                        className="bg-[#2B5273] hover:bg-[#1E3142] text-white font-medium py-3 px-8 rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]"
                        aria-label="View available Type C houses"
                      >
                        View Available Type C Houses
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <div>
              <h2 className="text-3xl font-bold text-[#2B5273] mb-6">
                FEATURES & SPECIFICATIONS
              </h2>
              <p className="text-gray-700 mb-8">
                At Fitzgerald Gardens, every home is built to exceptional standards with premium materials and finishes. Explore the features that make these properties stand out.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-[#2B5273] mb-4 flex items-center">
                    <svg className="h-6 w-6 text-[#C9A86E] mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    Energy Efficiency
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>A2 BER energy rating</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Air-to-water heat pump system</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Underfloor heating on ground floor</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>High-performance triple glazed windows</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Mechanical ventilation with heat recovery</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Photovoltaic solar panels</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-[#2B5273] mb-4 flex items-center">
                    <svg className="h-6 w-6 text-[#C9A86E] mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Interior Finishes
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Contemporary fitted kitchens with quartz countertops</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Integrated appliances including oven, hob, and hood</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Premium doors and ironmongery</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Designer bathroom suites with quality tiling</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Fitted wardrobes in bedrooms</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>High-quality flooring throughout</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-[#2B5273] mb-4 flex items-center">
                    <svg className="h-6 w-6 text-[#C9A86E] mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                    </svg>
                    External Features
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Landscaped front gardens</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Seeded rear gardens with patio area</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Cobble-lock driveways with parking for two cars</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Electric vehicle charging point</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>High-quality exterior finishes</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Secure rear boundaries</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-[#2B5273] mb-4 flex items-center">
                    <svg className="h-6 w-6 text-[#C9A86E] mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Quality Assurance
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>10-year structural guarantee</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Built to the latest building regulations</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Rigorous quality control throughout construction</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Pre-completion inspection with customers</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Comprehensive homeowner manual</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>After-sales customer service</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md mb-12">
                <h3 className="text-xl font-semibold text-[#2B5273] mb-4">Optional Upgrades</h3>
                <p className="text-gray-700 mb-4">
                  Personalize your home with our range of optional upgrades. Speak to our sales team for more information and pricing.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-[#2B5273] mb-2">Kitchen Upgrades</h4>
                    <ul className="space-y-1">
                      <li className="text-sm text-gray-700">Premium appliance packages</li>
                      <li className="text-sm text-gray-700">Kitchen island options</li>
                      <li className="text-sm text-gray-700">Additional cabinet choices</li>
                    </ul>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-[#2B5273] mb-2">Bathroom Upgrades</h4>
                    <ul className="space-y-1">
                      <li className="text-sm text-gray-700">Premium sanitaryware</li>
                      <li className="text-sm text-gray-700">Enhanced tiling options</li>
                      <li className="text-sm text-gray-700">Heated towel rails</li>
                    </ul>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-[#2B5273] mb-2">Flooring Upgrades</h4>
                    <ul className="space-y-1">
                      <li className="text-sm text-gray-700">Premium wood flooring</li>
                      <li className="text-sm text-gray-700">Upgraded carpet options</li>
                      <li className="text-sm text-gray-700">Designer tile selections</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    className="bg-[#2B5273] hover:bg-[#1E3142] text-white font-medium py-3 px-8 rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]"
                    aria-label="Schedule a consultation about home upgrades"
                  >
                    Schedule Consultation
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Location Tab */}
          {activeTab === 'location' && (
            <div>
              <h2 className="text-3xl font-bold text-[#2B5273] mb-6">
                LOCATION
              </h2>
              <p className="text-gray-700 mb-8">
                Fitzgerald Gardens is ideally situated in Drogheda, offering the perfect balance of suburban tranquility and urban convenience with excellent connectivity to Dublin and beyond.
              </p>

              {/* Map placeholder */}
              <div className="bg-gray-100 rounded-lg h-96 mb-12 flex items-center justify-center">
                <p className="text-gray-500">Interactive map will be displayed here</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="text-xl font-semibold text-[#2B5273] mb-4">Connectivity</h3>
                  <p className="text-gray-700 mb-4">
                    One of the key advantages of Fitzgerald Gardens is its excellent connectivity to Dublin and other major centers:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>30 minutes from Dublin City Centre via M1 motorway</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Regular train service to Dublin from Drogheda Station (35 minutes)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Dublin Airport just 35km away (30 minutes drive)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Local and regional bus services</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2B5273] mb-4">Local Amenities</h3>
                  <p className="text-gray-700 mb-4">
                    Residents at Fitzgerald Gardens will enjoy easy access to a wealth of local amenities:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Excellent schools and educational facilities</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Shopping centers and retail parks</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Restaurants, cafes, and entertainment venues</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Sports facilities and leisure centers</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md mb-12">
                <h3 className="text-xl font-semibold text-[#2B5273] mb-4">Nearby Amenities</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <h4 className="font-medium text-[#2B5273] flex items-center mb-3">
                      <svg className="h-5 w-5 text-[#C9A86E] mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                      Schools
                    </h4>
                    <ul className="space-y-2">
                      {fitzgeraldGardens.amenities.schools.map((item, index) => (
                        <li key={index} className="text-sm">
                          <span className="font-medium">{item.name}</span>
                          <div className="text-gray-500">{item.distance}</div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-[#2B5273] flex items-center mb-3">
                      <svg className="h-5 w-5 text-[#C9A86E] mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                      </svg>
                      Shopping
                    </h4>
                    <ul className="space-y-2">
                      {fitzgeraldGardens.amenities.shopping.map((item, index) => (
                        <li key={index} className="text-sm">
                          <span className="font-medium">{item.name}</span>
                          <div className="text-gray-500">{item.distance}</div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-[#2B5273] flex items-center mb-3">
                      <svg className="h-5 w-5 text-[#C9A86E] mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h5a1 1 0 001-1v-1h1a1 1 0 100-2h-1v-1a1 1 0 00-1-1H10a1 1 0 00-1 1v1.05a2.5 2.5 0 01-4.9 0H3a1 1 0 00-1 1v1a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h5a1 1 0 001-1v-1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1H3V4z" />
                      </svg>
                      Transport
                    </h4>
                    <ul className="space-y-2">
                      {fitzgeraldGardens.amenities.transport.map((item, index) => (
                        <li key={index} className="text-sm">
                          <span className="font-medium">{item.name}</span>
                          <div className="text-gray-500">{item.distance}</div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-[#2B5273] flex items-center mb-3">
                      <svg className="h-5 w-5 text-[#C9A86E] mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                      </svg>
                      Leisure
                    </h4>
                    <ul className="space-y-2">
                      {fitzgeraldGardens.amenities.leisure.map((item, index) => (
                        <li key={index} className="text-sm">
                          <span className="font-medium">{item.name}</span>
                          <div className="text-gray-500">{item.distance}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <div>
              <h2 className="text-3xl font-bold text-[#2B5273] mb-6">
                GALLERY
              </h2>
              <p className="text-gray-700 mb-8">
                Explore our gallery to see the exceptional quality and finish of our homes at Fitzgerald Gardens.
              </p>

              {/* Gallery filter buttons */}
              <div className="flex flex-wrap gap-3 mb-8">
                <button className="px-4 py-2 bg-[#2B5273] text-white rounded-md font-medium">All</button>
                <button className="px-4 py-2 bg-white text-gray-700 rounded-md font-medium border border-gray-300 hover:bg-gray-50">Exteriors</button>
                <button className="px-4 py-2 bg-white text-gray-700 rounded-md font-medium border border-gray-300 hover:bg-gray-50">Interiors</button>
                <button className="px-4 py-2 bg-white text-gray-700 rounded-md font-medium border border-gray-300 hover:bg-gray-50">Kitchens</button>
                <button className="px-4 py-2 bg-white text-gray-700 rounded-md font-medium border border-gray-300 hover:bg-gray-50">Bathrooms</button>
                <button className="px-4 py-2 bg-white text-gray-700 rounded-md font-medium border border-gray-300 hover:bg-gray-50">Gardens</button>
              </div>

              {/* Gallery grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                {fitzgeraldGardens.galleryImages.map((image, index) => (
                  <div key={index} className="rounded-lg overflow-hidden shadow-md bg-white">
                    <div className="relative h-64">
                      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                        <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-700 text-sm">{image.alt}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Virtual tour section */}
              <div className="bg-white p-6 rounded-lg shadow-md mb-12">
                <h3 className="text-xl font-semibold text-[#2B5273] mb-4">Virtual Tour</h3>
                <p className="text-gray-700 mb-6">
                  Take a virtual tour of our show homes at Fitzgerald Gardens. Experience the quality and finish of our homes from the comfort of your current home.
                </p>
                <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500">Virtual tour will be displayed here</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* For Solicitors Tab */}
          {activeTab === 'solicitors' && (
            <div>
              <h2 className="text-3xl font-bold text-[#2B5273] mb-6">
                FOR SOLICITORS
              </h2>
              <p className="text-gray-700 mb-8">
                Welcome to the dedicated portal for solicitors handling transactions at Fitzgerald Gardens. Here you'll find all the legal documentation and resources needed to streamline the conveyancing process.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-[#2B5273] mb-4 flex items-center">
                    <svg className="h-6 w-6 text-[#C9A86E] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Legal Documentation
                  </h3>
                  <p className="text-gray-700 mb-4">
                    All legal documents related to Fitzgerald Gardens are available through our secure portal. These include:
                  </p>
                  <ul className="space-y-3">
                    {fitzgeraldGardens.legalInfo.documents.map((doc, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <button
                      className="bg-[#2B5273] hover:bg-[#1E3142] text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]"
                      aria-label="Access the secure document portal"
                    >
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Access Secure Portal
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-[#2B5273] mb-4 flex items-center">
                    <svg className="h-6 w-6 text-[#C9A86E] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Transaction Timeline
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Our streamlined conveyancing process is designed to ensure smooth and efficient transactions:
                  </p>
                  <ul className="relative border-l border-gray-200 ml-3 space-y-6">
                    <li className="mb-6 ml-6">
                      <span className="absolute flex items-center justify-center w-6 h-6 bg-[#2B5273] rounded-full -left-3 ring-8 ring-white">
                        <span className="text-white text-xs">1</span>
                      </span>
                      <h4 className="font-medium text-[#2B5273]">Reservation & Contracts</h4>
                      <p className="text-sm text-gray-600">Initial reservation and contract issuance</p>
                    </li>
                    <li className="mb-6 ml-6">
                      <span className="absolute flex items-center justify-center w-6 h-6 bg-[#2B5273] rounded-full -left-3 ring-8 ring-white">
                        <span className="text-white text-xs">2</span>
                      </span>
                      <h4 className="font-medium text-[#2B5273]">Pre-contract Queries</h4>
                      <p className="text-sm text-gray-600">Answering of pre-contract enquiries</p>
                    </li>
                    <li className="mb-6 ml-6">
                      <span className="absolute flex items-center justify-center w-6 h-6 bg-[#2B5273] rounded-full -left-3 ring-8 ring-white">
                        <span className="text-white text-xs">3</span>
                      </span>
                      <h4 className="font-medium text-[#2B5273]">Exchange</h4>
                      <p className="text-sm text-gray-600">Exchange of contracts and deposit payment</p>
                    </li>
                    <li className="ml-6">
                      <span className="absolute flex items-center justify-center w-6 h-6 bg-[#2B5273] rounded-full -left-3 ring-8 ring-white">
                        <span className="text-white text-xs">4</span>
                      </span>
                      <h4 className="font-medium text-[#2B5273]">Completion</h4>
                      <p className="text-sm text-gray-600">Final completion and key handover</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-[#2B5273] mb-4 flex items-center">
                    <svg className="h-6 w-6 text-[#C9A86E] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                    Communication Channels
                  </h3>
                  <p className="text-gray-700 mb-4">
                    We've established dedicated channels to ensure efficient communication throughout the conveyancing process:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span>Dedicated legal correspondence email: {fitzgeraldGardens.legalInfo.contact}</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span>Secure messaging system within the portal</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span>Direct line to our legal team for urgent matters</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-[#C9A86E] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span>Weekly status updates for all active transactions</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-[#2B5273] mb-4 flex items-center">
                    <svg className="h-6 w-6 text-[#C9A86E] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-4">
                    <details className="group bg-gray-50 rounded-md">
                      <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-3">
                        <span>What is included in the management company structure?</span>
                        <span className="transition group-open:rotate-180">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </summary>
                      <p className="text-sm text-gray-600 p-3 pt-0">
                        Full details of the management company structure, including annual fees and services covered, are provided in the Management Company Information pack available in the secure portal.
                      </p>
                    </details>
                    <details className="group bg-gray-50 rounded-md">
                      <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-3">
                        <span>How are stage payments structured?</span>
                        <span className="transition group-open:rotate-180">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </summary>
                      <p className="text-sm text-gray-600 p-3 pt-0">
                        For off-plan purchases, payments are typically structured with a 10% deposit on exchange, with the balance due on completion. Full payment schedule details are included in the contract documents.
                      </p>
                    </details>
                    <details className="group bg-gray-50 rounded-md">
                      <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-3">
                        <span>What warranties are provided with the properties?</span>
                        <span className="transition group-open:rotate-180">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </summary>
                      <p className="text-sm text-gray-600 p-3 pt-0">
                        All properties come with a 10-year structural warranty. Additional manufacturer warranties for appliances and systems are documented in the Homeowner Pack and available for review in the portal.
                      </p>
                    </details>
                    <details className="group bg-gray-50 rounded-md">
                      <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-3">
                        <span>How are customization requests handled legally?</span>
                        <span className="transition group-open:rotate-180">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </summary>
                      <p className="text-sm text-gray-600 p-3 pt-0">
                        Any agreed customizations are documented in a Customization Addendum, which forms part of the main contract. All changes must be finalized by the customization deadline specified in the contract.
                      </p>
                    </details>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-[#2B5273] mb-4">Contact Legal Team</h3>
                <p className="text-gray-700 mb-6">
                  Our dedicated legal team is available to assist with any queries or requirements you may have. For the most efficient service, please use the form below:
                </p>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="solicitor-name" className="block text-sm font-medium text-gray-700 mb-1">Solicitor Name</label>
                    <input
                      type="text"
                      id="solicitor-name"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2B5273] focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="firm-name" className="block text-sm font-medium text-gray-700 mb-1">Firm Name</label>
                    <input
                      type="text"
                      id="firm-name"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2B5273] focus:border-transparent"
                      placeholder="Your firm"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2B5273] focus:border-transparent"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2B5273] focus:border-transparent"
                      placeholder="+353 1 234 5678"
                    />
                  </div>
                  <div>
                    <label htmlFor="client-name" className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                    <input
                      type="text"
                      id="client-name"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2B5273] focus:border-transparent"
                      placeholder="Your client's name"
                    />
                  </div>
                  <div>
                    <label htmlFor="property" className="block text-sm font-medium text-gray-700 mb-1">Property Reference</label>
                    <input
                      type="text"
                      id="property"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2B5273] focus:border-transparent"
                      placeholder="e.g. Plot 12, Type A"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2B5273] focus:border-transparent"
                      placeholder="Please provide details of your query"
                    ></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="bg-[#2B5273] hover:bg-[#1E3142] text-white font-medium py-2 px-6 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]"
                    >
                      Submit Enquiry
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[#1E3142] py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Make Fitzgerald Gardens Your Home?</h2>
            <p className="text-xl text-white/80 mb-8">
              Register your interest today to receive priority information and exclusive offers.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                className="bg-[#7EEAE4] hover:bg-[#6CD9D3] text-[#1E3142] font-medium py-3 px-8 rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7EEAE4]"
                aria-label="Register interest in Fitzgerald Gardens"
              >
                Register Interest
              </button>
              <button
                className="bg-transparent border-2 border-white text-white font-medium py-3 px-8 rounded-full hover:bg-white/10 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                aria-label="Contact the sales team"
              >
                Contact Sales Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}