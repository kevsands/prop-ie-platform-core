'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DevelopmentSiteMap from '@/components/property/DevelopmentSiteMap';
import { 
  getDevelopmentById, 
  type Development, 
  type HouseType 
} from '@/data/developments-brochure-data';

interface DevelopmentsPageProps {
  developmentId: string;
}

export default function DevelopmentsPage({ developmentId }: DevelopmentsPageProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedHouseType, setSelectedHouseType] = useState<HouseType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [liveUnits, setLiveUnits] = useState<any[]>([]);
  const [unitStats, setUnitStats] = useState({
    total: 0,
    available: 0,
    reserved: 0,
    sold: 0
  });
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Get development data based on ID
  const development = getDevelopmentById(developmentId);
  
  // Load live units from API (same data as developer portal)
  useEffect(() => {
    const loadLiveUnits = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/developments/${developmentId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.data && data.data.units) {
            setLiveUnits(data.data.units);
            setUnitStats(data.data.unitStats);
            setLastUpdated(new Date());
            console.log(`✅ Loaded ${data.data.units.length} live units from API`);
          }
        } else {
          throw new Error('Failed to load live units');
        }
      } catch (err) {
        console.error('Error loading live units:', err);
        setError('Failed to load live unit data');
        // Fallback to static data
        if (development?.units) {
          setLiveUnits(development.units);
          setUnitStats({
            total: development.units.length,
            available: development.units.filter(u => u.status === 'available').length,
            reserved: development.units.filter(u => u.status === 'reserved').length,
            sold: development.units.filter(u => u.status === 'sold').length
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    if (developmentId) {
      loadLiveUnits();
    }
  }, [developmentId, development]);

  const refreshUnits = () => {
    setIsLoading(true);
    const loadLiveUnits = async () => {
      try {
        const response = await fetch(`/api/developments/${developmentId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.data && data.data.units) {
            setLiveUnits(data.data.units);
            setUnitStats(data.data.unitStats);
            setLastUpdated(new Date());
          }
        }
      } catch (err) {
        console.error('Error refreshing units:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadLiveUnits();
  };

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
    if (development) {
      setSelectedHouseType(development.propertyTypes.find(type => type.id === typeId) || null);
    }
  };

  // If development not found, show error
  if (!development) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Development Not Found</h1>
          <p className="text-gray-600">The development "{developmentId}" could not be found.</p>
          <Link 
            href="/developments" 
            className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse All Developments
          </Link>
        </div>
      </div>
    );
  }

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
      <div className="relative h-[70vh] bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E3142]/80 to-[#1E3142]/60 z-10"></div>
        <Image
          src={development.heroImage}
          alt={development.name}
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 uppercase">
            {development.name}
          </h1>
          <div className="w-20 h-1 bg-[#C9A86E] mb-6"></div>
          <p className="text-xl md:text-2xl text-white max-w-2xl mb-2">
            {development.description}
          </p>
          <p className="text-lg text-white/80 mb-8">
            📍 {development.location}
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              className="bg-[#7EEAE4] hover:bg-[#6CD9D3] text-[#1E3142] font-medium py-3 px-8 rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7EEAE4]"
              aria-label={`Register interest in ${development.name}`}
            >
              Register Interest
            </button>
            <button
              className="bg-transparent border-2 border-white text-white font-medium py-3 px-8 rounded-full hover:bg-white/10 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
              onClick={() => setActiveTab('site-plan')}
              aria-label={`View available properties at ${development.name}`}
            >
              View Available Properties
            </button>
            {development.brochureUrl && (
              <a
                href={development.brochureUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent border-2 border-[#C9A86E] text-[#C9A86E] font-medium py-3 px-8 rounded-full hover:bg-[#C9A86E]/10 transition duration-300"
              >
                📄 Download Brochure
              </a>
            )}
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
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === 'amenities'
                ? 'text-[#2B5273] border-b-2 border-[#2B5273]'
                : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('amenities')}
            aria-pressed={activeTab === 'amenities'}
            aria-label="Show amenities"
          >
            Location & Amenities
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold text-[#2B5273] mb-6">About {development.name}</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {development.description}
              </p>
              
              {/* Features */}
              <h3 className="text-xl font-semibold text-[#2B5273] mb-4">Key Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {development.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#7EEAE4] rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Overview Stats - LIVE DATA */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-[#2B5273]">Development Information</h3>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${!error ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-xs text-gray-500">
                    {!error ? 'Live Data' : 'Error'}
                  </span>
                </div>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                  <p className="text-red-600 text-sm">⚠️ {error}</p>
                  <button 
                    onClick={refreshUnits}
                    className="text-red-600 text-sm underline mt-1"
                  >
                    Retry Loading
                  </button>
                </div>
              )}
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Total Units:</span>
                  <span className="font-semibold">{unitStats.total}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Available:</span>
                  <span className="font-semibold text-green-600">{unitStats.available}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Reserved:</span>
                  <span className="font-semibold text-yellow-600">{unitStats.reserved}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Sold:</span>
                  <span className="font-semibold text-blue-600">{unitStats.sold}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Starting Price:</span>
                  <span className="font-semibold text-[#2B5273]">
                    {liveUnits.length > 0 ? formatPrice(Math.min(...liveUnits.map(u => u.price))) : 'Loading...'}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Property Types:</span>
                  <span className="font-semibold">{development.propertyTypes.length}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Developer:</span>
                  <span className="font-semibold">{development.legalInfo.developer}</span>
                </div>
                {lastUpdated && (
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Last Updated:</span>
                    <span>{lastUpdated.toLocaleTimeString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* House Types Tab */}
        {activeTab === 'house-types' && (
          <div>
            <h2 className="text-3xl font-bold text-[#2B5273] mb-8">House Types</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {development.propertyTypes.map((houseType) => (
                <div key={houseType.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {houseType.cgiRender && (
                    <div className="relative h-48 bg-gray-200">
                      <Image
                        src={houseType.cgiRender}
                        alt={houseType.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#2B5273] mb-2">{houseType.name}</h3>
                    <p className="text-gray-600 mb-3">{houseType.description}</p>
                    <p className="text-lg font-semibold text-[#C9A86E] mb-4">{houseType.size}</p>
                    
                    <div className="flex justify-between text-sm text-gray-600 mb-4">
                      <span>🛏️ {houseType.bedrooms} bed</span>
                      <span>🚿 {houseType.bathrooms} bath</span>
                    </div>

                    {houseType.features && (
                      <div className="mb-4">
                        <ul className="text-sm text-gray-600 space-y-1">
                          {houseType.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="flex items-center">
                              <span className="w-1 h-1 bg-[#7EEAE4] rounded-full mr-2"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <button
                      onClick={() => showHouseTypeDetails(houseType.id)}
                      className="w-full bg-[#2B5273] text-white py-2 rounded-lg hover:bg-[#1E3142] transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* House Type Details Modal/Panel */}
            {selectedHouseType && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold text-[#2B5273]">{selectedHouseType.name}</h3>
                      <button
                        onClick={() => setSelectedHouseType(null)}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                      >
                        ×
                      </button>
                    </div>

                    {selectedHouseType.cgiRender && (
                      <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
                        <Image
                          src={selectedHouseType.cgiRender}
                          alt={selectedHouseType.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold mb-4">Specifications</h4>
                        <div className="space-y-2">
                          <p><strong>Size:</strong> {selectedHouseType.size}</p>
                          <p><strong>Bedrooms:</strong> {selectedHouseType.bedrooms}</p>
                          <p><strong>Bathrooms:</strong> {selectedHouseType.bathrooms}</p>
                        </div>

                        {selectedHouseType.features && (
                          <div className="mt-6">
                            <h4 className="text-lg font-semibold mb-4">Features</h4>
                            <ul className="space-y-2">
                              {selectedHouseType.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center">
                                  <span className="w-2 h-2 bg-[#7EEAE4] rounded-full mr-3"></span>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {selectedHouseType.floorPlanImages.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold mb-4">Floor Plans</h4>
                          <div className="space-y-4">
                            {selectedHouseType.floorPlanImages.map((image, idx) => (
                              <div key={idx} className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
                                <Image
                                  src={image}
                                  alt={`${selectedHouseType.name} floor plan ${idx + 1}`}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Site Plan Tab */}
        {activeTab === 'site-plan' && (
          <div>
            <h2 className="text-3xl font-bold text-[#2B5273] mb-8">Site Plan & Available Units</h2>
            
            {development.sitePlan ? (
              <div className="mb-8">
                <div className="relative bg-white rounded-lg shadow-lg p-6">
                  <Image
                    src={development.sitePlan}
                    alt={`${development.name} site plan`}
                    width={800}
                    height={600}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            ) : (
              <div className="mb-8">
                <DevelopmentSiteMap 
                  development={development}
                  onUnitClick={(unit) => {
                    // Handle unit click - could show unit details
                    console.log('Unit clicked:', unit);
                  }}
                />
              </div>
            )}

            {/* Available Units List - LIVE DATA */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-[#2B5273]">All Units ({unitStats.total})</h3>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={refreshUnits}
                    className="text-blue-600 text-sm hover:underline"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Refreshing...' : 'Refresh'}
                  </button>
                  <div className={`w-2 h-2 rounded-full ${!error ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2B5273]"></div>
                  <span className="ml-2 text-gray-600">Loading live units...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {liveUnits.map((unit) => (
                    <div key={unit.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold">Unit {unit.number}</h4>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          unit.status === 'available' ? 'bg-green-100 text-green-800' :
                          unit.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {unit.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{unit.type}</p>
                      <p className="text-sm text-gray-500 mb-3">
                        {unit.bedrooms} bed • {unit.bathrooms} bath • {unit.sqm} m²
                      </p>
                      <p className="text-lg font-bold text-[#2B5273] mb-3">
                        {formatPrice(unit.price)}
                      </p>
                      <Link
                        href={`/developments/${development.slug}/units/${unit.number}`}
                        className={`block w-full text-center py-2 rounded-lg transition-colors ${
                          unit.status === 'available' 
                            ? 'bg-[#7EEAE4] text-[#1E3142] hover:bg-[#6CD9D3]'
                            : 'bg-gray-200 text-gray-600 cursor-not-allowed'
                        }`}
                      >
                        {unit.status === 'available' ? 'View Details' : 'Not Available'}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
              
              {!isLoading && liveUnits.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No units found for this development.</p>
                  <button 
                    onClick={refreshUnits}
                    className="mt-2 text-blue-600 hover:underline"
                  >
                    Try Refreshing
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div>
            <h2 className="text-3xl font-bold text-[#2B5273] mb-8">Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {development.galleryImages.map((image, index) => (
                <div key={index} className="relative h-64 bg-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Amenities Tab */}
        {activeTab === 'amenities' && (
          <div>
            <h2 className="text-3xl font-bold text-[#2B5273] mb-8">Location & Amenities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Schools */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-[#2B5273] mb-4 flex items-center">
                  🎓 Schools & Education
                </h3>
                <div className="space-y-3">
                  {development.amenities.schools.map((school, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-700">{school.name}</span>
                      <span className="text-sm text-gray-500">{school.distance}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shopping */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-[#2B5273] mb-4 flex items-center">
                  🛍️ Shopping & Retail
                </h3>
                <div className="space-y-3">
                  {development.amenities.shopping.map((shop, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-700">{shop.name}</span>
                      <span className="text-sm text-gray-500">{shop.distance}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transport */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-[#2B5273] mb-4 flex items-center">
                  🚗 Transport Links
                </h3>
                <div className="space-y-3">
                  {development.amenities.transport.map((transport, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-700">{transport.name}</span>
                      <span className="text-sm text-gray-500">{transport.distance}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leisure */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-[#2B5273] mb-4 flex items-center">
                  🎯 Leisure & Recreation
                </h3>
                <div className="space-y-3">
                  {development.amenities.leisure.map((leisure, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-700">{leisure.name}</span>
                      <span className="text-sm text-gray-500">{leisure.distance}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legal Information */}
            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-[#2B5273] mb-4">Legal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="mb-2"><strong>Developer:</strong> {development.legalInfo.developer}</p>
                  <p className="mb-2"><strong>Solicitor:</strong> {development.legalInfo.solicitor}</p>
                  <p className="mb-4"><strong>Contact:</strong> {development.legalInfo.contact}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Available Documents:</h4>
                  <ul className="space-y-1">
                    {development.legalInfo.documents.map((doc, index) => (
                      <li key={index} className="text-sm text-gray-600">• {doc}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contact Section */}
      <div className="bg-[#2B5273] text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Interested in {development.name}?</h2>
          <p className="text-xl mb-8">Contact us today to arrange a viewing or get more information</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-[#7EEAE4] text-[#1E3142] font-medium py-3 px-8 rounded-full hover:bg-[#6CD9D3] transition duration-300">
              📞 Call Now
            </button>
            <button className="bg-transparent border-2 border-white text-white font-medium py-3 px-8 rounded-full hover:bg-white/10 transition duration-300">
              ✉️ Email Enquiry
            </button>
            <button className="bg-[#C9A86E] text-[#1E3142] font-medium py-3 px-8 rounded-full hover:bg-[#B8976B] transition duration-300">
              📅 Book Viewing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}