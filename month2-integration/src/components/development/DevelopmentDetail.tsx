'use client';

// src/components/development/DevelopmentDetail.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Development } from '@/types/developments';

// Helper function to map statusColor string to a Tailwind class
const getStatusColorClass = (statusColor: Development['statusColor']) => {
  if (!statusColor) return 'bg-gray-500';
  
  // Handle both formats: 'green' and 'green-500'
  if (statusColor.includes('-')) {
    return `bg-${statusColor}`;
  }
  
  switch (statusColor) {
    case 'green': return 'bg-green-500';
    case 'blue': return 'bg-blue-500';
    case 'yellow': return 'bg-yellow-500';
    case 'gray': return 'bg-gray-500';
    case 'purple': return 'bg-purple-500';
    default: return 'bg-gray-500';
  }
};

export default function DevelopmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  // Ensure id is treated as a string, as useParams can return string or string[]
  const developmentId = Array.isArray(params?.id) ? params.id[0] : params?.id as string | undefined;

  // State for development data
  const [development, setDevelopment] = useState<Development | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch development data from API
  useEffect(() => {
    const fetchDevelopment = async () => {
      if (!developmentId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/developments/${developmentId}`);
        if (response.ok) {
          const data = await response.json();
          // Map API response to Development interface
          const mappedDevelopment: Development = {
            id: data.id,
            name: data.name,
            description: data.description,
            location: `${data.city}, ${data.county}`,
            image: data.mainImage,
            status: data.status,
            statusColor: data.status === 'ACTIVE' ? 'green-500' : 'blue-500',
            priceRange: data.startingPrice ? `€${data.startingPrice.toLocaleString()}+` : 'Price on request',
            bedrooms: [2, 3, 4],
            bathrooms: 2,
            squareFeet: 120,
            features: data.features || [],
            amenities: data.amenities || [],
            energyRating: 'A2',
            availability: 'Available now',
            depositAmount: '€10,000',
            showingDates: [],
            floorPlans: []
          };
          setDevelopment(mappedDevelopment);
        } else {
          console.error('Failed to fetch development');
        }
      } catch (error) {
        console.error('Error fetching development:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevelopment();
  }, [developmentId]);
  
  // Prefetch related/similar developments and units
  useEffect(() => {
    if (development) {
      // Fetch and prefetch similar developments from API
      const fetchSimilarDevelopments = async () => {
        try {
          const response = await fetch('/api/developments?published=true');
          if (response.ok) {
            const data = await response.json();
            const similarDevelopments = data.data
              .filter((dev: any) => 
                dev.id !== developmentId && 
                (dev.city === development.location.split(',')[0] || dev.county === development.location.split(',')[1])
              )
              .slice(0, 3);
            
            // Prefetch similar development pages
            similarDevelopments.forEach((dev: any) => {
              router.prefetch(`/developments/${dev.id}`);
            });
          }
        } catch (error) {
          console.error('Error fetching similar developments:', error);
        }
      };
      
      fetchSimilarDevelopments();
      
      // Prefetch unit pages for the current development (if units exist)
      if (development.units && development.units.length > 0) {
        development.units.slice(0, 5).forEach(unit => {
          router.prefetch(`/projects/${developmentId}/units/${unit.id}`);
        });
      }
    }
  }, [developmentId, development, router]);

  // Handle development not found case
  if (!development) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50 px-4"> {/* Added min-height, bg, padding */}
        <div className="text-center bg-white p-8 rounded-lg shadow-lg"> {/* Added styles */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Development Not Found</h1>
          <p className="text-gray-600 mb-6">The development you're looking for doesn't exist or has been removed.</p>
          <Link href="/developments" className="inline-flex items-center px-6 py-3 bg-[#2B5273] text-white rounded-md hover:bg-[#1E3142] transition-colors"> {/* Styled button */}
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


  return (
    <main className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        {/* Background Image */}
        <Image
          src={development.image}
          alt={development.name}
          fill
          style={{ objectFit: 'cover' }}
          priority // Prioritize loading the hero image
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center max-w-4xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-3 leading-tight">{development.name}</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-6">{development.description}</p>
            {development.status && (
              <span className={`inline-block ${getStatusColorClass(development.statusColor)} text-white text-sm md:text-base px-4 py-2 rounded-full uppercase font-semibold tracking-wide shadow-lg`}>
                {development.status}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content Tabs Navigation */}
      {/* bg-white and border-b added to the container div */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm"> {/* Added sticky, top-0, z-index, shadow */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-3 md:py-4 scrollbar-hide"> {/* Adjusted padding, added scrollbar-hide */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-shrink-0 px-4 py-2 font-medium text-sm sm:text-base whitespace-nowrap ${ // Added flex-shrink-0
                activeTab === 'overview'
                  ? 'text-[#2B5273] border-b-2 border-[#2B5273]'
                  : 'text-gray-600 hover:text-gray-800 border-b-2 border-transparent hover:border-gray-300' // Improved hover state
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
            {development.bedrooms && development.squareFeet && ( // Using bedroom/size as a proxy for "has floor plans" in mock data
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
             {/* Example of another potential tab */}
             {/* <button
              onClick={() => setActiveTab('gallery')}
              className={`flex-shrink-0 px-4 py-2 font-medium text-sm sm:text-base whitespace-nowrap ${
                activeTab === 'gallery'
                  ? 'text-[#2B5273] border-b-2 border-[#2B5273]'
                  : 'text-gray-600 hover:text-gray-800 border-b-2 border-transparent hover:border-gray-300'
              } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]`}
              >
              Gallery
             </button> */}
          </div>
        </div>
      </div>


      {/* Tab Content Area */}
      <div className="py-12 md:py-16 bg-gray-50 min-h-screen-content"> {/* min-h-screen-content is a custom class example */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Overview Tab Content */}
          {activeTab === 'overview' && (
            <div id="tab-panel-overview" role="tabpanel" aria-labelledby="tab-overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"> {/* Increased gap */}
                <div className="md:col-span-2">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">About {development.name}</h2>
                  {/* Example rich text content - replace with actual content/CMS data */}
                  <div className="prose max-w-none text-gray-600"> {/* Added prose for basic typography */}
                     <p className="mb-4">
                       Welcome to {development.name}, a meticulously designed new development offering premium homes in {development.location}, Drogheda. This community blends modern living with accessibility, set against a backdrop of scenic surroundings (or specific local feature).
                     </p>
                     <p className="mb-4">
                       Each home is built with exceptional quality and attention to detail, incorporating sustainable features for energy efficiency and reduced running costs. Our goal is to create not just houses, but thriving communities where residents feel at home from day one.
                     </p>
                      {development.features && development.features.length > 0 && (
                       <>
                          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Key Features</h3>
                           <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none p-0"> {/* Removed default list style */}
                             {development.features.map((feature: string, index: number) => (
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 text-sm"> {/* Adjusted grid and gap */}

                      {development.bedrooms !== undefined && (
                        <div>
                          <h4 className="text-gray-500 mb-1">Bedrooms</h4>
                          <p className="font-semibold text-gray-900">{formatBedrooms(development.bedrooms)}</p>
                        </div>
                      )}

                      {development.bathrooms !== undefined && (
                        <div>
                          <h4 className="text-gray-500 mb-1">Bathrooms</h4>
                          <p className="font-semibold text-gray-900">{development.bathrooms} bath{development.bathrooms !== 1 ? 's' : ''}</p>
                        </div>
                      )}

                      {development.squareFeet !== undefined && (
                        <div>
                          <h4 className="text-gray-500 mb-1">Size</h4>
                          <p className="font-semibold text-gray-900">{development.squareFeet} sq ft</p>
                        </div>
                      )}

                      {development.energyRating && (
                        <div>
                          <h4 className="text-gray-500 mb-1">Energy Rating</h4>
                          <p className="font-semibold text-gray-900">BER {development.energyRating}</p>
                        </div>
                      )}

                      {development.availability && (
                        <div>
                          <h4 className="text-gray-500 mb-1">Availability</h4>
                          <p className="font-semibold text-gray-900">{development.availability}</p>
                        </div>
                      )}

                      {development.depositAmount && (
                        <div>
                          <h4 className="text-gray-500 mb-1">Deposit</h4>
                          <p className="font-semibold text-gray-900">{development.depositAmount}</p>
                        </div>
                      )}
                       {/* Add more specifications as needed */}
                        {development.location && (
                        <div>
                          <h4 className="text-gray-500 mb-1">Location</h4>
                          <p className="font-semibold text-gray-900">{development.location}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sidebar Contact/Price Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 h-fit sticky top-24"> {/* Made sticky */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Starting Price</h3>
                  <p className="text-2xl font-bold text-[#2B5273] mb-6">{development.priceRange || 'Price TBC'}</p>

                  <div className="space-y-4 mb-8 text-gray-700">
                    {development.availability && (
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span>Status: <span className="font-semibold">{development.availability}</span></span>
                    </div>
                    )}

                    {development.location && (
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                       <span>Location: <span className="font-semibold">{development.location}</span></span>
                    </div>
                    )}
                     {development.energyRating && (
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                       </svg>
                       <span>BER Rating: <span className="font-semibold">{development.energyRating}</span></span>
                    </div>
                    )}
                  </div>

                  <div className="space-y-3">
                     {development.availability !== 'Fully Sold' && development.availability !== 'Future Phase' && ( // Only show viewing button if relevant
                      <a
                         href="#contact" // Link to the contact section/tab
                         onClick={(e) => { e.preventDefault(); setActiveTab('contact'); }} // Smooth scroll + switch tab
                         className="block w-full bg-[#2B5273] text-center text-white font-medium py-3 rounded-md hover:bg-[#1E3A52] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]"
                         >
                         Schedule a Viewing
                       </a>
                     )}


                    {development.brochureUrl && (
                      <a
                        href={development.brochureUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center border border-[#2B5273] text-[#2B5273] font-medium py-3 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                      >
                        Download Brochure
                      </a>
                    )}

                    {development.virtualTourUrl && (
                      <a
                        href={development.virtualTourUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center border border-gray-300 text-gray-700 font-medium py-3 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                      >
                        Virtual Tour
                      </a>
                    )}
                     {/* Example: Register Interest button */}
                     <Link
                        href="/register" // Link to your general registration page
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
                  {development.features && development.features.length > 0 && (
                     <div>
                       <h3 className="text-xl font-bold text-gray-900 mb-4">Property Features Included</h3>
                       <div className="bg-white rounded-lg shadow-md p-6 h-full"> {/* Added h-full */}
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                           {development.features.map((feature: string, index: number) => (
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

                  {development.amenities && development.amenities.length > 0 && (
                     <div>
                       <h3 className="text-xl font-bold text-gray-900 mb-4">Development & Area Amenities</h3>
                       <div className="bg-white rounded-lg shadow-md p-6 h-full"> {/* Added h-full */}
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                           {development.amenities.map((amenity: string, index: number) => (
                             <div key={index} className="flex items-start">
                               <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path> {/* Example icon, change as needed */}
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
                    This section can include details about the build standards, warranties, management company information, specific finishes available, etc. Tailor this content to the specific development.
                  </p>
                  <p className="text-gray-600">
                   Mention key benefits like low maintenance, high energy efficiency reducing bills, community design principles, etc.
                  </p>
                </div>
              </div>
          )}

           {/* Properties & Floor Plans Tab Content */}
           {activeTab === 'floorplans' && (
               <div id="tab-panel-floorplans" role="tabpanel" aria-labelledby="tab-floorplans">
                   <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Available Properties & Floor Plans</h2>

                   {/* This section would typically list specific house/apartment types available in the development */}
                   {/* And link to individual property pages or display floor plan images/data */}
                   <div className="bg-white rounded-lg shadow-md p-6">
                       <p className="text-gray-600 mb-4">
                           Here you would list the different property types available within {development.name} (e.g., 3 Bed Semi, 4 Bed Detached, 2 Bed Apartment).
                       </p>
                       <p className="text-gray-600 mb-6">
                           Each listing could show a small image, key specs (beds, baths, sq ft), price range, and links to view floor plans or a dedicated page for that property type.
                       </p>

                       {/* Example listing structure (highly simplified) */}
                       <div className="border-t border-gray-200 pt-6 space-y-6">
                           {/* Replace with dynamic data loop for actual properties */}
                           <div className="flex items-center space-x-6">
                                <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-md overflow-hidden">
                                   <Image src="/images/property-type-placeholder.jpg" alt="Property Type" width={96} height={96} style={{ objectFit: "cover" }} />
                                </div>
                               <div>
                                   <h4 className="text-lg font-semibold text-gray-900">3 Bed Semi-Detached</h4>
                                   <p className="text-gray-600 text-sm">Approx. 1100 sq ft | {formatBedrooms(3)} | {development.bathrooms} baths</p>
                                   <p className="font-bold text-[#2B5273] mt-1">From {development.priceRange?.split('-')[0] || 'Price TBC'}</p>
                                   <Link href={`/developments/${development.id}/properties/type-id-1`} className="text-[#2B5273] hover:underline text-sm mt-2 inline-block">
                                       View Details & Floor Plans →
                                   </Link>
                               </div>
                           </div>
                            <div className="flex items-center space-x-6">
                                <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-md overflow-hidden">
                                   <Image src="/images/property-type-placeholder-2.jpg" alt="Property Type" width={96} height={96} style={{ objectFit: "cover" }} />
                                </div>
                               <div>
                                   <h4 className="text-lg font-semibold text-gray-900">4 Bed Detached</h4>
                                   <p className="text-gray-600 text-sm">Approx. 1400 sq ft | {formatBedrooms(4)} | {development.bathrooms! + 1} baths</p> {/* Example adjustment */}
                                    <p className="font-bold text-[#2B5273] mt-1">From {development.priceRange?.split('-')[1] || 'Price TBC'}</p>
                                   <Link href={`/developments/${development.id}/properties/type-id-2`} className="text-[#2B5273] hover:underline text-sm mt-2 inline-block">
                                       View Details & Floor Plans →
                                   </Link>
                               </div>
                           </div>
                           {/* ... more property types */}
                       </div>

                       <div className="mt-8 text-center">
                            {/* Link to a potential full list of properties for this development */}
                           <Link
                             href={`/developments/${development.id}/properties`}
                             className="inline-flex items-center px-6 py-3 border border-[#2B5273] text-[#2B5273] rounded-md hover:bg-[#2B5273] hover:text-white transition-colors"
                           >
                             View All Properties in {development.name}
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
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Location: {development.location}, Drogheda</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Interactive Map</h3>
                  <div className="rounded-lg overflow-hidden h-80 md:h-96 bg-gray-200 flex items-center justify-center">
                    {/* Replace with a real map component */}
                    <p className="text-gray-500 text-center p-4">Map placeholder - would integrate with Google Maps, Mapbox, or similar using the development&apos;s coordinates.</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 h-fit"> {/* Added h-fit */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Location Details</h3>
                  <p className="text-gray-600 mb-6">{development.location}, Drogheda, Co. Louth</p>

                  <h4 className="font-semibold text-gray-900 mb-3">Nearby Amenities</h4>
                  <div className="space-y-3 mb-6 text-gray-700">
                     {/* Example amenities list - replace with data or specific nearby points */}
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
                     {/* Example distances - replace with data or specific calculations */}
                     <div className="flex justify-between">
                       <span>Drogheda Town Center</span>
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
                       <span>Drogheda Train Station</span>
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
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Contact & Viewings for {development.name}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="bg-white rounded-lg shadow-md p-6 h-fit"> {/* Added h-fit */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Schedule a Viewing</h3>

                  {development.showingDates && development.showingDates.length > 0 && (
                    <div className="mb-6 border-b border-gray-200 pb-6"> {/* Added border/padding */}
                      <h4 className="font-semibold text-gray-900 mb-3">Upcoming Open House Dates</h4>
                      <div className="space-y-3">
                        {development.showingDates.map((date: string, index: number) => (
                          <div key={index} className="flex items-center bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-md text-sm"> {/* Styled date pill */}
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
                  <form className="space-y-5"> {/* Increased space */}
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
                       {/* Note: Form submission needs server-side handling */}
                       <p className="mt-2 text-center text-sm text-gray-500">
                         (Note: This form requires server-side implementation to send messages.)
                       </p>
                    </div>
                  </form>
                </div>

                {/* Contact Info Sidebar */}
                <div className="bg-white rounded-lg shadow-md p-6 h-fit"> {/* Added h-fit */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>

                  <div className="space-y-6 text-gray-700">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Sales Office</h4>
                      <p className="mb-1">Example Address Line 1</p>
                      <p className="mb-1">Example Address Line 2</p>
                      <p className="mb-1">Drogheda, Co. Louth</p>
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
                          <a href="mailto:info@yourdomain.ie" className="hover:underline truncate">info@yourdomain.ie</a> {/* Added truncate */}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Sales Team</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4"> {/* Adjusted layout */}
                         {/* Example Sales Agent 1 */}
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-full bg-gray-200 mr-3 overflow-hidden flex-shrink-0">
                            {/* Replace with agent image */}
                            <Image src="/images/agents/agent1.jpg" alt="Sarah Johnson" width={48} height={48} style={{ objectFit: "cover" }} className="object-cover w-full h-full"/>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">Sarah Johnson</p>
                            <p className="text-xs text-gray-600">Senior Agent</p>
                          </div>
                        </div>
                         {/* Example Sales Agent 2 */}
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-full bg-gray-200 mr-3 overflow-hidden flex-shrink-0">
                             {/* Replace with agent image */}
                            <Image src="/images/agents/agent2.jpg" alt="John Murphy" width={48} height={48} style={{ objectFit: "cover" }} className="object-cover w-full h-full"/>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">John Murphy</p>
                            <p className="text-xs text-gray-600">Sales Manager</p>
                          </div>
                        </div>
                         {/* Add more agents as needed */}
                      </div>
                    </div>

                     {/* Link to brochure if available */}
                    {development.brochureUrl && (
                      <div className="mt-6 border-t border-gray-200 pt-6">
                        <a
                          href={development.brochureUrl}
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

           {/* Placeholder for other tabs like Gallery, etc. */}
            {/* {activeTab === 'gallery' && (
               <div id="tab-panel-gallery" role="tabpanel" aria-labelledby="tab-gallery">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Photo Gallery</h2>
                  <p className="text-gray-600">Gallery content goes here...</p>
               </div>
            )} */}


        </div> {/* End of max-w-7xl div */}
      </div> {/* End of Tab Content Area */}


      {/* Footer (Placeholder - use your main layout's Footer component) */}
      {/* In a real app, the Footer would be part of the layout, not on individual pages */}
      {/* This is included just to show completeness if this were a standalone page */}
      <footer className="bg-gray-900 text-white py-12 mt-12">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
           <p>&copy; {new Date().getFullYear()} Prop.ie. All rights reserved.</p>
           {/* Add footer links here if not using a shared layout footer */}
         </div>
      </footer>

    </main>
  );
}