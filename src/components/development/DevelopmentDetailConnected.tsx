'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useDevelopment, useDevelopmentBySlug, getStatusColorClass } from '@/hooks/api/useDevelopments';

// Mock development data for fallback when GraphQL API is not available
const mockDevelopmentsData = {
  "fitzgerald-gardens": {
    id: "fitzgerald-gardens",
    name: "Fitzgerald Gardens",
    description: "Luxurious living with modern comforts in the heart of Drogheda",
    shortDescription: "Premium residential development featuring high-quality homes designed for modern living",
    location: { 
      city: "Drogheda", 
      county: "Co. Louth",
      address: "Dublin Road, Drogheda",
    mainImage: "/images/developments/fitzgerald-gardens.jpg",
    images: ["/images/developments/fitzgerald-gardens.jpg"],
    status: "Now Selling",
    statusColor: "green",
    priceRange: "€320,000 - €450,000",
    bedrooms: [234],
    bathrooms: 2,
    energyRating: "A2",
    availability: "Move in from Winter 2025",
    features: [
      "High-quality finishes throughout",
      "Energy-efficient heating systems",
      "Modern kitchen appliances",
      "Gardens and outdoor spaces",
      "Smart home technology ready",
      "Electric car charging points",
      "High-speed fiber broadband"
    ],
    amenities: [
      "Community playground",
      "Green spaces and walking areas",
      "Close to schools and shops",
      "Public transport nearby",
      "Sports facilities",
      "Medical centers"
    ],
    developer: {
      id: "dev1",
      fullName: "PropIE Developments",
      email: "info@propie.com",
    units: [
      {
        id: "unit1",
        name: "The Willow - 2 Bedroom",
        type: "Apartment",
        status: "Available",
        price: 320000,
        bedrooms: 2,
        bathrooms: 1,
        squareFeet: 850
      },
      {
        id: "unit2",
        name: "The Oak - 3 Bedroom",
        type: "Semi-detached",
        status: "Available",
        price: 380000,
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1250
      },
      {
        id: "unit3",
        name: "The Maple - 4 Bedroom",
        type: "Detached",
        status: "Reserved",
        price: 450000,
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 1800
      }
    ],
    showingDates: [
      "Saturday, July 15, 2023 - 10:00 AM to 5:00 PM",
      "Sunday, July 16, 2023 - 12:00 PM to 4:00 PM",
      "Saturday, July 22, 2023 - 10:00 AM to 5:00 PM"
    ]
  },
  "ballymakenny-view": {
    id: "ballymakenny-view",
    name: "Ballymakenny View",
    description: "Modern family homes in a convenient location with excellent amenities",
    shortDescription: "Contemporary homes designed for families in a vibrant community setting",
    location: { 
      city: "Drogheda", 
      county: "Co. Louth",
      address: "Ballymakenny Road, Drogheda",
    mainImage: "/images/developments/ballymakenny-view.jpg",
    images: ["/images/developments/ballymakenny-view.jpg"],
    status: "Coming Soon",
    statusColor: "blue",
    priceRange: "€350,000 - €425,000",
    bedrooms: [34],
    bathrooms: 2,
    energyRating: "A3",
    availability: "Launching Summer 2025",
    features: [
      "Contemporary design and finishes",
      "Zoned heating systems",
      "Premium kitchen appliances",
      "Private gardens",
      "Fiber broadband connectivity",
      "Sustainable materials",
      "Low carbon footprint design"
    ],
    amenities: [
      "Close to schools and childcare",
      "Shopping centers nearby",
      "Sports facilities within 1km",
      "Public parks and recreation areas",
      "Good public transport links",
      "Medical facilities"
    ],
    developer: {
      id: "dev1",
      fullName: "PropIE Developments",
      email: "info@propie.com",
    units: [
      {
        id: "b-unit1",
        name: "Type A - 3 Bedroom",
        type: "Semi-detached",
        status: "Coming Soon",
        price: 350000,
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1150
      },
      {
        id: "b-unit2",
        name: "Type B - 3 Bedroom",
        type: "Semi-detached",
        status: "Coming Soon",
        price: 375000,
        bedrooms: 3,
        bathrooms: 2.5,
        squareFeet: 1250
      },
      {
        id: "b-unit3",
        name: "Type C - 4 Bedroom",
        type: "Detached",
        status: "Coming Soon",
        price: 425000,
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 1650
      }
    ]
  },
  "ellwood": {
    id: "ellwood",
    name: "Ellwood",
    description: "Exclusive riverside apartments with stunning views and premium finishes",
    shortDescription: "Luxury waterfront living with panoramic river views and premium amenities",
    location: { 
      city: "Drogheda", 
      county: "Co. Louth",
      address: "Riverfront, Drogheda",
    mainImage: "/images/developments/ellwood.jpg",
    images: ["/images/developments/ellwood.jpg"],
    status: "Register Interest",
    statusColor: "purple",
    priceRange: "€375,000 - €550,000",
    bedrooms: [123],
    bathrooms: 2,
    energyRating: "A1",
    availability: "Launching Autumn 2025",
    features: [
      "Floor-to-ceiling windows",
      "Panoramic river views",
      "Premium finishes throughout",
      "Underfloor heating",
      "Smart home integration",
      "High-end appliances",
      "Private balconies",
      "Secure parking"
    ],
    amenities: [
      "Concierge service",
      "Residents' lounge",
      "Riverside walkway",
      "Fitness center",
      "Close to town center",
      "Security systems",
      "Landscaped communal gardens"
    ],
    developer: {
      id: "dev1",
      fullName: "PropIE Developments",
      email: "info@propie.com",
    units: [
      {
        id: "r-unit1",
        name: "Type A - 1 Bedroom",
        type: "Apartment",
        status: "Register Interest",
        price: 375000,
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 650
      },
      {
        id: "r-unit2",
        name: "Type B - 2 Bedroom",
        type: "Apartment",
        status: "Register Interest",
        price: 450000,
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 950
      },
      {
        id: "r-unit3",
        name: "Penthouse - 3 Bedroom",
        type: "Penthouse",
        status: "Register Interest",
        price: 550000,
        bedrooms: 3,
        bathrooms: 3,
        squareFeet: 1450
      }
    ]
  }
};

/**
 * Connected version of the DevelopmentDetail component
 * This component fetches data using GraphQL and renders the development details
 */
export default function DevelopmentDetailConnected() {
  const params = useParams();
  const router = useRouter();

  // Ensure id is treated as a string, as useParams can return string or string[]
  const developmentIdOrSlug = Array.isArray(params?.id) ? params.id[0] : params?.id as string | undefined;

  // State for managing the active tab
  const [activeTabsetActiveTab] = useState('overview');

  // Determine if we have an ID or slug
  const isSlug = developmentIdOrSlug ? !developmentIdOrSlug.match(/^[0-9a-fA-F]{24}$/) : false;

  // Fetch the development data based on ID or slug
  const { 
    data: developmentFromId, 
    isLoading: isLoadingById, 
    error: errorById 
  } = useDevelopment(
    !isSlug ? developmentIdOrSlug : undefined,
    { enabled: Boolean(!isSlug && developmentIdOrSlug) }
  );

  const { 
    data: developmentFromSlug, 
    isLoading: isLoadingBySlug, 
    error: errorBySlug 
  } = useDevelopmentBySlug(
    isSlug ? developmentIdOrSlug : undefined,
    { enabled: Boolean(isSlug && developmentIdOrSlug) }
  );

  // Combine results
  const development = developmentFromId || developmentFromSlug;
  const isLoading = (isSlug ? isLoadingBySlug : isLoadingById);
  const error = (isSlug ? errorBySlug : errorById);

  // Add fallback to local API if GraphQL authentication fails
  const [localDatasetLocalData] = useState<any>(null);
  const [localLoadingsetLocalLoading] = useState(false);

  useEffect(() => {
    // If GraphQL query fails with authentication error, try the local API
    if (error && (error.message === 'No current user' || error.message.includes('authentication'))) {
      const fetchLocalData = async () => {
        setLocalLoading(true);
        try {
          const response = await fetch(`/api/developments/${developmentIdOrSlug}`);
          if (response.ok) {
            const data = await response.json();
            setLocalData(data);
          }
        } catch (err) {

        } finally {
          setLocalLoading(false);
        }
      };

      fetchLocalData();
    }
  }, [errordevelopmentIdOrSlug]);

  // Add fallback to mock data if the development is one of our hardcoded ones
  useEffect(() => {
    // If the development ID matches one of our mock developments, use that data
    if (developmentIdOrSlug && mockDevelopmentsData[developmentIdOrSlug as keyof typeof mockDevelopmentsData]) {
      setLocalData(mockDevelopmentsData[developmentIdOrSlug as keyof typeof mockDevelopmentsData]);
    }
  }, [developmentIdOrSlug]);

  // Use local data if available
  const finalDevelopment = development || localData;
  const finalIsLoading = (localData ? false : isLoading || localLoading);
  const finalError = (localData ? null : error);

  // Prefetch similar developments and units
  useEffect(() => {
    if (finalDevelopment) {
      // In a real implementation, we would prefetch related developments
      // For now, we'll just prefetch the units pages
      if (finalDevelopment.units && finalDevelopment.units.length> 0) {
        finalDevelopment.units.slice(0).forEach((unit: {id: string}) => {
          router.prefetch(`/developments/${finalDevelopment.id}/units/${unit.id}`);
        });
      }
    }
  }, [finalDevelopmentrouter]);

  // Loading state
  if (finalIsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2B5273]"></div>
      </div>
    );
  }

  // Error state
  if (finalError) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Development</h1>
          <p className="text-gray-600 mb-6">We encountered an error while loading this development: {finalError.message}</p>
          <Link href="/developments" className="inline-flex items-center px-6 py-3 bg-[#2B5273] text-white rounded-md hover:bg-[#1E3142] transition-colors">
             View All Developments
             <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
             </svg>
          </Link>
        </div>
      </div>
    );
  }

  // Handle development not found case
  if (!finalDevelopment) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Development Not Found</h1>
          <p className="text-gray-600 mb-6">The development you're looking for doesn't exist or has been removed.</p>
          <Link href="/developments" className="inline-flex items-center px-6 py-3 bg-[#2B5273] text-white rounded-md hover:bg-[#1E3142] transition-colors">
             View All Developments
             <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
             </svg>
          </Link>
        </div>
      </div>
    );
  }

  // Helper to format bedroom text
  const formatBedrooms = (bedrooms: number | number[] | undefined): string => {
    if (bedrooms === undefined) return 'N/A';
    if (Array.isArray(bedrooms)) {
      if (bedrooms.length === 0) return 'N/A';
      if (bedrooms.length === 1) return `${bedrooms[0]} bed`;
      return `${Math.min(...bedrooms)}-${Math.max(...bedrooms)} beds`;
    }
    return `${bedrooms} bed`;
  };

  // Format location
  const formattedLocation = finalDevelopment.location ? 
    `${finalDevelopment.location.city}, ${finalDevelopment.location.county}` : 
    "Location TBC";

  return (
    <main className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        {/* Background Image */}
        <Image
          src={finalDevelopment.mainImage}
          alt={finalDevelopment.name}
          fill
          style={ objectFit: 'cover' }
          priority // Prioritize loading the hero image
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center max-w-4xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-3 leading-tight">{finalDevelopment.name}</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-6">{finalDevelopment.shortDescription || finalDevelopment.description}</p>
            {finalDevelopment.status && (
              <span className={`inline-block ${getStatusColorClass(finalDevelopment.statusColor)} text-white text-sm md:text-base px-4 py-2 rounded-full uppercase font-semibold tracking-wide shadow-lg`}>
                {finalDevelopment.status}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content Tabs Navigation */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-3 md:py-4 scrollbar-hide">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-shrink-0 px-4 py-2 font-medium text-sm sm:text-base whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'text-[#2B5273] border-b-2 border-[#2B5273]'
                  : 'text-gray-600 hover:text-gray-800 border-b-2 border-transparent hover:border-gray-300'
              } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]`}
               aria-controls="tab-panel-overview"
               role="tab"
               aria-selected={activeTab === 'overview'}
               id="tab-overview"
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`flex-shrink-0 px-4 py-2 font-medium text-sm sm:text-base whitespace-nowrap ${
                activeTab === 'features'
                  ? 'text-[#2B5273] border-b-2 border-[#2B5273]'
                  : 'text-gray-600 hover:text-gray-800 border-b-2 border-transparent hover:border-gray-300'
              } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]`}
               aria-controls="tab-panel-features"
               role="tab"
               aria-selected={activeTab === 'features'}
               id="tab-features"
            >
              Features & Amenities
            </button>
            {/* Only show Floor Plans tab if data exists */}
            {finalDevelopment.units && finalDevelopment.units.length> 0 && (
               <button
                 onClick={() => setActiveTab('floorplans')}
                 className={`flex-shrink-0 px-4 py-2 font-medium text-sm sm:text-base whitespace-nowrap ${
                   activeTab === 'floorplans'
                     ? 'text-[#2B5273] border-b-2 border-[#2B5273]'
                     : 'text-gray-600 hover:text-gray-800 border-b-2 border-transparent hover:border-gray-300'
                 } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]`}
                   aria-controls="tab-panel-floorplans"
                   role="tab"
                   aria-selected={activeTab === 'floorplans'}
                   id="tab-floorplans"
               >
                 Properties & Floor Plans
               </button>
             )}
            <button
              onClick={() => setActiveTab('location')}
              className={`flex-shrink-0 px-4 py-2 font-medium text-sm sm:text-base whitespace-nowrap ${
                activeTab === 'location'
                  ? 'text-[#2B5273] border-b-2 border-[#2B5273]'
                  : 'text-gray-600 hover:text-gray-800 border-b-2 border-transparent hover:border-gray-300'
              } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]`}
               aria-controls="tab-panel-location"
               role="tab"
               aria-selected={activeTab === 'location'}
               id="tab-location"
            >
              Location
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`flex-shrink-0 px-4 py-2 font-medium text-sm sm:text-base whitespace-nowrap ${
                activeTab === 'contact'
                  ? 'text-[#2B5273] border-b-2 border-[#2B5273]'
                  : 'text-gray-600 hover:text-gray-800 border-b-2 border-transparent hover:border-gray-300'
              } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]`}
               aria-controls="tab-panel-contact"
               role="tab"
               aria-selected={activeTab === 'contact'}
               id="tab-contact"
            >
              Contact & Viewings
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content Area */}
      <div className="py-12 md:py-16 bg-gray-50 min-h-screen-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Overview Tab Content */}
          {activeTab === 'overview' && (
            <div id="tab-panel-overview" role="tabpanel" aria-labelledby="tab-overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                <div className="md:col-span-2">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">About {finalDevelopment.name}</h2>
                  <div className="prose max-w-none text-gray-600">
                     <p className="mb-4">
                       {finalDevelopment.description}
                     </p>
                      {finalDevelopment.features && finalDevelopment.features.length> 0 && (
                       <>
                          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Key Features</h3>
                           <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none p-0">
                             {finalDevelopment.features.map((feature: string, index: number) => (
                               <li key={index} className="flex items-start text-gray-700">
                                 <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                 </svg>
                                 <span>{feature}</span>
                               </li>
                             ))}
                           </ul>
                        </>
                      )}
                  </div>

                  <div className="mt-10 border-t border-gray-200 pt-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-5">Home Specifications</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 text-sm">

                      {finalDevelopment.bedrooms !== undefined && (
                        <div>
                          <h4 className="text-gray-500 mb-1">Bedrooms</h4>
                          <p className="font-semibold text-gray-900">{formatBedrooms(finalDevelopment.bedrooms)}</p>
                        </div>
                      )}

                      {finalDevelopment.bathrooms !== undefined && (
                        <div>
                          <h4 className="text-gray-500 mb-1">Bathrooms</h4>
                          <p className="font-semibold text-gray-900">{finalDevelopment.bathrooms} bath{finalDevelopment.bathrooms !== 1 ? 's' : ''}</p>
                        </div>
                      )}

                      {finalDevelopment.squareFeet !== undefined && (
                        <div>
                          <h4 className="text-gray-500 mb-1">Size</h4>
                          <p className="font-semibold text-gray-900">{finalDevelopment.squareFeet} sq ft</p>
                        </div>
                      )}

                      {finalDevelopment.energyRating && (
                        <div>
                          <h4 className="text-gray-500 mb-1">Energy Rating</h4>
                          <p className="font-semibold text-gray-900">BER {finalDevelopment.energyRating}</p>
                        </div>
                      )}

                      {finalDevelopment.availability && (
                        <div>
                          <h4 className="text-gray-500 mb-1">Availability</h4>
                          <p className="font-semibold text-gray-900">{finalDevelopment.availability}</p>
                        </div>
                      )}

                      {finalDevelopment.depositAmount && (
                        <div>
                          <h4 className="text-gray-500 mb-1">Deposit</h4>
                          <p className="font-semibold text-gray-900">{finalDevelopment.depositAmount}</p>
                        </div>
                      )}

                      {finalDevelopment.location && (
                        <div>
                          <h4 className="text-gray-500 mb-1">Location</h4>
                          <p className="font-semibold text-gray-900">{formattedLocation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sidebar Contact/Price Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 h-fit sticky top-24">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Starting Price</h3>
                  <p className="text-2xl font-bold text-[#2B5273] mb-6">{finalDevelopment.priceRange || 'Price TBC'}</p>

                  <div className="space-y-4 mb-8 text-gray-700">
                    {finalDevelopment.availability && (
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span>Status: <span className="font-semibold">{finalDevelopment.availability}</span></span>
                    </div>
                    )}

                    {finalDevelopment.location && (
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                       <span>Location: <span className="font-semibold">{formattedLocation}</span></span>
                    </div>
                    )}
                     {finalDevelopment.energyRating && (
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                       </svg>
                       <span>BER Rating: <span className="font-semibold">{finalDevelopment.energyRating}</span></span>
                    </div>
                    )}
                  </div>

                  <div className="space-y-3">
                     {finalDevelopment.availability !== 'Fully Sold' && finalDevelopment.availability !== 'Future Phase' && (
                      <a
                         href="#contact"
                         onClick={(e: any) => { e.preventDefault(); setActiveTab('contact'); }
                         className="block w-full bg-[#2B5273] text-center text-white font-medium py-3 rounded-md hover:bg-[#1E3A52] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]"
                         >
                         Schedule a Viewing
                       </a>
                     )}

                    {finalDevelopment.brochureUrl && (
                      <a
                        href={finalDevelopment.brochureUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center border border-[#2B5273] text-[#2B5273] font-medium py-3 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                      >
                        Download Brochure
                      </a>
                    )}

                    {finalDevelopment.virtualTourUrl && (
                      <a
                        href={finalDevelopment.virtualTourUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center border border-gray-300 text-gray-700 font-medium py-3 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                      >
                        Virtual Tour
                      </a>
                    )}
                     <Link
                        href="/register"
                        className="block w-full text-center border border-gray-300 text-gray-700 font-medium py-3 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                      >
                        Register Interest
                      </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Features Tab Content */}
          {activeTab === 'features' && (
             <div id="tab-panel-features" role="tabpanel" aria-labelledby="tab-features">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Features & Amenities</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12">
                  {finalDevelopment.features && finalDevelopment.features.length> 0 && (
                     <div>
                       <h3 className="text-xl font-bold text-gray-900 mb-4">Property Features Included</h3>
                       <div className="bg-white rounded-lg shadow-md p-6 h-full">
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                           {finalDevelopment.features.map((feature: string, index: number) => (
                             <div key={index} className="flex items-start">
                               <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                               </svg>
                               <span>{feature}</span>
                             </div>
                           ))}
                         </div>
                       </div>
                     </div>
                  )}

                  {finalDevelopment.amenities && finalDevelopment.amenities.length> 0 && (
                     <div>
                       <h3 className="text-xl font-bold text-gray-900 mb-4">Development & Area Amenities</h3>
                       <div className="bg-white rounded-lg shadow-md p-6 h-full">
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                           {finalDevelopment.amenities.map((amenity: string, index: number) => (
                             <div key={index} className="flex items-start">
                               <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                               </svg>
                               <span>{amenity}</span>
                             </div>
                           ))}
                         </div>
                       </div>
                     </div>
                  )}
                </div>

                {/* Additional Info Block */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Further Details</h3>
                  <p className="text-gray-600 mb-4">
                    {finalDevelopment.description}
                  </p>
                  <p className="text-gray-600">
                    {finalDevelopment.shortDescription}
                  </p>
                </div>
              </div>
          )}

           {/* Properties & Floor Plans Tab Content */}
           {activeTab === 'floorplans' && (
               <div id="tab-panel-floorplans" role="tabpanel" aria-labelledby="tab-floorplans">
                   <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Available Properties & Floor Plans</h2>

                   <div className="bg-white rounded-lg shadow-md p-6">
                       <p className="text-gray-600 mb-4">
                           Below are the different property types available within {finalDevelopment.name}.
                       </p>

                       {/* Property listings */}
                       <div className="border-t border-gray-200 pt-6 space-y-6">
                           {finalDevelopment.units && finalDevelopment.units.map((unit: {id: string, name?: string, type?: string, bedrooms: number, bathrooms: number, squareFeet: number, price?: number}, index: number) => (
                               <div key={unit.id} className="flex items-center space-x-6">
                                    <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-md overflow-hidden">
                                        {/* Placeholder image - would use actual unit images */}
                                        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-xs">
                                            Unit Image
                                        </div>
                                    </div>
                                   <div>
                                       <h4 className="text-lg font-semibold text-gray-900">{unit.name || `${unit.bedrooms} Bed ${unit.type}`}</h4>
                                       <p className="text-gray-600 text-sm">Approx. {unit.squareFeet} sq ft | {unit.bedrooms} bed | {unit.bathrooms} baths</p>
                                       <p className="font-bold text-[#2B5273] mt-1">
                                           {typeof unit.price === 'number' 
                                               ? `€${unit.price.toLocaleString()}` 
                                               : 'Price TBC'}
                                       </p>
                                       <Link href={`/developments/${finalDevelopment.id}/units/${unit.id}`} className="text-[#2B5273] hover:underline text-sm mt-2 inline-block">
                                           View Details & Floor Plans →
                                       </Link>
                                   </div>
                               </div>
                           ))}

                           {(!finalDevelopment.units || finalDevelopment.units.length === 0) && (
                               <p className="text-gray-500 text-center py-4">
                                   No specific unit information is available at this time.
                               </p>
                           )}
                       </div>

                       <div className="mt-8 text-center">
                           <Link
                             href={`/developments/${finalDevelopment.id}/properties`}
                             className="inline-flex items-center px-6 py-3 border border-[#2B5273] text-[#2B5273] rounded-md hover:bg-[#2B5273] hover:text-white transition-colors"
                           >
                             View All Properties in {finalDevelopment.name}
                             <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                             </svg>
                           </Link>
                       </div>
                   </div>
               </div>
           )}

          {/* Location Tab Content */}
          {activeTab === 'location' && (
            <div id="tab-panel-location" role="tabpanel" aria-labelledby="tab-location">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Location: {formattedLocation}</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Interactive Map</h3>
                  <div className="rounded-lg overflow-hidden h-80 md:h-96 bg-gray-200 flex items-center justify-center">
                    {finalDevelopment.location && finalDevelopment.location.longitude && finalDevelopment.location.latitude ? (
                      // Would integrate actual map here
                      <div className="text-gray-500 text-center p-4">
                        Map would display at coordinates: {finalDevelopment.location.latitude}, {finalDevelopment.location.longitude}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center p-4">
                        Map coordinates not available. Location: {formattedLocation}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 h-fit">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Location Details</h3>
                  <p className="text-gray-600 mb-6">
                    {finalDevelopment.location?.address || formattedLocation}
                    {finalDevelopment.location?.eircode && `, ${finalDevelopment.location.eircode}`}
                  </p>

                  <h4 className="font-semibold text-gray-900 mb-3">Nearby Amenities</h4>
                  <div className="space-y-3 mb-6 text-gray-700">
                     {/* Example amenities - would come from development data */}
                     <div className="flex items-start">
                       <svg className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                       </svg>
                       <span>Schools within 1km</span>
                     </div>
                     <div className="flex items-start">
                       <svg className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                       </svg>
                       <span>Shopping center nearby</span>
                     </div>
                     <div className="flex items-start">
                       <svg className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                       </svg>
                       <span>Excellent public transport</span>
                     </div>
                      <div className="flex items-start">
                       <svg className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                       </svg>
                       <span>Easy access to motorway</span>
                     </div>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-3">Estimated Travel Times</h4>
                  <div className="space-y-3 text-gray-700">
                     {/* Example travel times - would come from API or calculated data */}
                     <div className="flex justify-between">
                       <span>{finalDevelopment.location?.city} Town Center</span>
                       <span className="font-medium">5-10 min drive</span>
                     </div>
                     <div className="flex justify-between">
                       <span>Dublin City</span>
                       <span className="font-medium">45-60 min drive</span>
                     </div>
                     <div className="flex justify-between">
                       <span>Dublin Airport</span>
                       <span className="font-medium">30-40 min drive</span>
                     </div>
                     <div className="flex justify-between">
                       <span>{finalDevelopment.location?.city} Train Station</span>
                       <span className="font-medium">10-15 min drive</span>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Tab Content */}
          {activeTab === 'contact' && (
            <div id="tab-panel-contact" role="tabpanel" aria-labelledby="tab-contact">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Contact & Viewings for {finalDevelopment.name}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="bg-white rounded-lg shadow-md p-6 h-fit">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Schedule a Viewing</h3>

                  {finalDevelopment.showingDates && finalDevelopment.showingDates.length> 0 && (
                    <div className="mb-6 border-b border-gray-200 pb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Upcoming Open House Dates</h4>
                      <div className="space-y-3">
                        {finalDevelopment.showingDates.map((date: string, index: number) => (
                          <div key={index} className="flex items-center bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-md text-sm">
                            <svg className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <span>{date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contact Form */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4 mt-6">Send Us a Message</h3>
                  <form className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          autoComplete="given-name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          autoComplete="family-name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273] focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        autoComplete="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                         autoComplete="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273] focus:border-transparent"
                      />
                    </div>

                     <div>
                       <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-1">Your Interest</label>
                       <select
                         id="interest"
                         name="interest"
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273] focus:border-transparent"
                         required
                       >
                           <option value="">-- Select Interest --</option>
                           <option value="viewing">Schedule a Viewing</option>
                           <option value="brochure">Request Brochure</option>
                           <option value="info">Request More Information</option>
                           <option value="feedback">Provide Feedback</option>
                       </select>
                     </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273] focus:border-transparent"
                        placeholder="Tell us more about your interest or questions..."
                         required
                      ></textarea>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="w-full bg-[#2B5273] text-white font-medium py-3 rounded-md hover:bg-[#1E3A52] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]"
                      >
                        Send Message
                      </button>
                       <p className="mt-2 text-center text-sm text-gray-500">
                         (Note: This form requires server-side implementation to send messages.)
                       </p>
                    </div>
                  </form>
                </div>

                {/* Contact Info Sidebar */}
                <div className="bg-white rounded-lg shadow-md p-6 h-fit">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>

                  <div className="space-y-6 text-gray-700">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Sales Office</h4>
                      <p className="mb-1">{finalDevelopment.location?.address || formattedLocation}</p>
                      <p className="mb-1">{finalDevelopment.location?.addressLine1 || ''}</p>
                      <p className="mb-1">{finalDevelopment.location?.city}, {finalDevelopment.location?.county}</p>
                      <p className="mt-3 text-sm">Hours: Mon-Fri 9am-5pm, Sat 10am-4pm</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Contact Details</h4>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-[#2B5273] mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                          </svg>
                          <a href="tel:+353411234567" className="hover:underline">+353 (0)41 123 4567</a>
                        </div>
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-[#2B5273] mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                          </svg>
                          <a href="mailto:info@yourdomain.ie" className="hover:underline truncate">info@yourdomain.ie</a>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Developer Information</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 mt-4">
                        {finalDevelopment.developer && (
                          <div className="flex items-center">
                            <div className="h-12 w-12 rounded-full bg-gray-200 mr-3 overflow-hidden flex-shrink-0">
                              {finalDevelopment.developer.avatar ? (
                                <Image 
                                  src={finalDevelopment.developer.avatar} 
                                  alt={finalDevelopment.developer.fullName} 
                                  width={48} 
                                  height={48} 
                                  style={ objectFit: "cover" } 
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-xs">
                                  No Image
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{finalDevelopment.developer.fullName}</p>
                              <p className="text-xs text-gray-600">{finalDevelopment.developer.email}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                     {/* Link to brochure if available */}
                    {finalDevelopment.brochureUrl && (
                      <div className="mt-6 border-t border-gray-200 pt-6">
                        <a
                          href={finalDevelopment.brochureUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-center border border-[#2B5273] text-[#2B5273] font-medium py-3 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                        >
                          Download Brochure
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}