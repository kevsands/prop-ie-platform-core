'use client';

import React from 'react';
import Image from 'next/image';
import useProjectData from '@/hooks/useProjectData';
import DevelopmentCTA from '@/components/buyer/DevelopmentCTA';

interface PublicDevelopmentViewProps {
  developmentId: string;
}

export default function PublicDevelopmentView({ developmentId }: PublicDevelopmentViewProps) {
  const {
    project,
    units,
    isLoading,
    error,
    totalUnits,
    soldUnits,
    reservedUnits,
    availableUnits,
    totalRevenue,
    averageUnitPrice
  } = useProjectData(developmentId);

  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project data...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-12 w-12 text-red-500 mx-auto mb-4">⚠</div>
          <p className="text-gray-600">Error loading project: {error || 'Project not found'}</p>
        </div>
      </div>
    );
  }

  // Calculate unit type breakdown for floor plans
  const unitTypeBreakdown = units.reduce((acc, unit) => {
    const beds = unit.features.bedrooms;
    const price = Math.round(unit.pricing.currentPrice); // Round to remove decimals
    const sqft = unit.features.sqft;
    
    const key = `${beds}bed-${unit.type.toLowerCase()}`;
    if (!acc[key]) {
      acc[key] = {
        type: `${beds} Bed ${unit.type.replace('1 Bed Apartment', 'Apartment').replace('2 Bed House', 'House').replace('3 Bed House', 'House')}`,
        beds: beds,
        avgSize: 0,
        minPrice: Infinity,
        maxPrice: 0,
        count: 0,
        available: 0
      };
    }
    acc[key].count++;
    acc[key].avgSize += sqft;
    acc[key].minPrice = Math.min(acc[key].minPrice, price);
    acc[key].maxPrice = Math.max(acc[key].maxPrice, price);
    if (unit.status === 'available') { // status is lowercase
      acc[key].available++;
    }
    return acc;
  }, {} as Record<string, any>);

  // Finalize averages and format
  const floorPlans = Object.values(unitTypeBreakdown).map((plan: any) => ({
    type: plan.type,
    size: `${Math.round(plan.avgSize / plan.count)} sqm`,
    price: plan.minPrice === plan.maxPrice 
      ? `€${plan.minPrice.toLocaleString()}` 
      : `€${plan.minPrice.toLocaleString()} - €${plan.maxPrice.toLocaleString()}`,
    available: plan.available,
    total: plan.count,
    image: getFloorPlanImage(plan.beds, plan.type.toLowerCase())
  }));

  function getFloorPlanImage(beds: number, type: string) {
    if (type.includes('duplex')) return '/images/developments/fitzgerald-gardens/Duplex D5.png';
    return `/images/developments/fitzgerald-gardens/House Type ${beds === 2 ? '1' : beds === 3 ? '2' : '3'}.png`;
  }

  // Calculate status for display
  const getStatus = () => {
    const availabilityPercentage = (availableUnits / totalUnits) * 100;
    if (availabilityPercentage < 10) return 'Only Few Units Left';
    if (availabilityPercentage < 25) return 'Selling Fast';
    return 'Now Selling';
  };

  const development = {
    id: project.id,
    name: project.name,
    description: project.description,
    longDescription: project.longDescription,
    location: project.location,
    address: project.address,
    status: getStatus(),
    startingPrice: `€${Math.min(...units.map(u => Math.round(u.pricing.currentPrice))).toLocaleString()}`,
    priceRange: `€${Math.min(...units.map(u => Math.round(u.pricing.currentPrice))).toLocaleString()} - €${Math.max(...units.map(u => Math.round(u.pricing.currentPrice))).toLocaleString()}`,
    bedrooms: [...new Set(units.map(u => u.features.bedrooms))].sort(),
    bathrooms: Math.max(...units.map(u => u.features.bathrooms)),
    energyRating: 'A2',
    availability: project.availability || 'Move in from Winter 2025',
    mainImage: '/images/developments/fitzgerald-gardens/hero.jpeg',
    images: [
      '/images/developments/fitzgerald-gardens/hero.jpeg',
      '/images/developments/fitzgerald-gardens/1.jpg',
      '/images/developments/fitzgerald-gardens/2.jpg',
      '/images/developments/fitzgerald-gardens/3.jpg',
      '/images/developments/fitzgerald-gardens/2bed-apartment.jpeg',
      '/images/developments/fitzgerald-gardens/3bed-House.jpeg',
      '/images/developments/fitzgerald-gardens/HouseTypes Header.jpeg',
      '/images/developments/fitzgerald-gardens/Vanity-unit.jpeg'
    ],
    features: [
      'Energy Efficient A2 Rating',
      'Modern Open Plan Design',
      'Private Outdoor Spaces',
      'Secure Parking',
      'Landscaped Gardens',
      'Near Schools & Shops',
      'Excellent Transport Links',
      'High-Quality Finishes'
    ],
    unitsAvailable: availableUnits,
    totalUnits: totalUnits,
    floorPlans: floorPlans,
    transport: {
      bus: '5 min walk to Dublin Bus routes',
      luas: '15 min to Luas Green Line',
      car: '20 min to City Centre',
      dart: '20 min to DART station'
    },
    sitePlan: '/images/developments/fitzgerald-gardens/site-plan.jpg'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px]">
        <Image
          src={development.mainImage}
          alt={development.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="text-white">
              <div className="mb-4">
                <span className={`
                  inline-block px-4 py-2 rounded-full text-sm font-semibold text-white
                  ${development.status === 'Selling Fast' || development.status === 'Only Few Units Left' ? 'bg-red-500' : ''}
                  ${development.status === 'Coming Soon' ? 'bg-blue-500' : ''}
                  ${development.status === 'Now Selling' ? 'bg-green-500' : ''}
                `}>
                  {development.status}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{development.name}</h1>
              <p className="text-xl md:text-2xl mb-4">{development.description}</p>
              <div className="flex items-center gap-6 text-lg">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{development.location}</span>
                </div>
                <div>Starting from <span className="font-bold">{development.startingPrice}</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Bar with Live Data */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-8 justify-between items-center">
            <div className="flex flex-wrap gap-8">
              <div>
                <span className="text-gray-500 text-sm">Price Range</span>
                <p className="font-semibold">{development.priceRange}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Bedrooms</span>
                <p className="font-semibold">
                  {development.bedrooms.join(', ')} Bed
                </p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Energy Rating</span>
                <p className="font-semibold">{development.energyRating}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Availability</span>
                <p className="font-semibold">{development.availability}</p>
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">
                {development.unitsAvailable} of {development.totalUnits} units available
              </div>
              <div className="text-sm text-gray-600">
                {soldUnits} sold • {reservedUnits} reserved
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {/* About */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">About {development.name}</h2>
                <p className="text-gray-600 leading-relaxed">{development.longDescription}</p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {development.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <svg className="h-6 w-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floor Plans - Real-time from Developer Portal */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Available Floor Plans</h3>
                <div className="space-y-4">
                  {development.floorPlans.map((plan, index) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-lg">
                      {plan.image && (
                        <div className="mb-4 relative h-64 md:h-80">
                          <Image
                            src={plan.image}
                            alt={`${plan.type} floor plan`}
                            fill
                            className="object-contain rounded-lg"
                          />
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-lg text-gray-900">{plan.type}</h4>
                          <p className="text-gray-600">{plan.size}</p>
                          <p className="text-sm text-blue-600 font-medium">
                            {plan.available} of {plan.total} available
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">{plan.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Site Plan */}
              {development.sitePlan && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Site Plan</h3>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="relative h-96 md:h-[500px]">
                      <Image
                        src={development.sitePlan}
                        alt={`${development.name} site plan`}
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                    <p className="mt-4 text-sm text-gray-600 text-center">
                      Interactive site plan showing real-time availability
                    </p>
                  </div>
                </div>
              )}

              {/* Transport Links */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Transport & Location</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(development.transport).map(([key, value]) => (
                      <div key={key}>
                        <h4 className="font-semibold text-gray-900 capitalize mb-2">{key}</h4>
                        <p className="text-gray-600">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Live Stats Card */}
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-4">Live Availability</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Available:</span>
                      <span className="font-bold text-blue-900">{availableUnits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Reserved:</span>
                      <span className="font-bold text-orange-600">{reservedUnits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Sold:</span>
                      <span className="font-bold text-green-600">{soldUnits}</span>
                    </div>
                    <hr className="border-blue-200" />
                    <div className="flex justify-between">
                      <span className="text-blue-700">Total Units:</span>
                      <span className="font-bold text-blue-900">{totalUnits}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Register Your Interest</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+353 1 234 5678"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      Send Enquiry
                    </button>
                  </form>
                </div>

                {/* Sales Contact */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Sales Office</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <svg className="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-700">+353 1 234 5678</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-700">sales@fitzgeraldgardens.ie</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-700">{development.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {development.images.map((image, index) => (
              <div key={index} className="relative h-64 group cursor-pointer">
                <Image
                  src={image}
                  alt={`${development.name} - Image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <DevelopmentCTA
            developmentId={development.id}
            developmentName={development.name}
            status={development.status}
            unitsAvailable={development.unitsAvailable}
            startingPrice={development.startingPrice}
          />
        </div>
      </section>

      {/* Brochure Download */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <button className="inline-flex items-center px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition">
            Download Brochure
            <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
}