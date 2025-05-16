'use client';

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BedDouble, Bath, Maximize, MapPin, CheckCircle } from "lucide-react";

// Mock DataService for build testing
const DataService = {
  getPropertyById: async (id: string) => {
    // Return mock property data for build testing
    return {
      id,
      title: "Sample Property",
      name: "Sample Property",
      description: "This is a sample property description for build testing purposes. The actual property details would be fetched from the API in production.",
      price: 350000,
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      images: [
        "/images/properties/10-maple-ave-1.jpg",
        "/images/properties/10-maple-ave-2.jpg",
        "/images/properties/10-maple-ave-3.jpg"
      ],
      features: [
        "Modern Kitchen",
        "South-Facing Garden",
        "Energy Efficient",
        "Close to amenities",
        "Recently renovated"
      ],
      developmentId: "fitzgerald-gardens",
      developmentName: "Fitzgerald Gardens",
      status: "For Sale",
      statusColor: "bg-blue-500",
      address: {
        city: "Drogheda",
        state: "Co. Louth"
      }
    };
  }
};

// Define Property type
interface Property {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  floorArea?: number;
  images?: string[];
  image?: string;
  features?: string[];
  developmentId?: string;
  developmentName?: string;
  status?: string;
  statusColor?: string;
  address?: {
    city?: string;
    state?: string;
    country?: string;
  };
  isNew?: boolean;
  isReduced?: boolean;
  floorPlanUrl?: string;
  floorPlan?: string;
  virtualTourUrl?: string;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params?.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) {
        setError("Property ID not found in URL.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const fetchedProperty = await DataService.getPropertyById(propertyId);
        if (fetchedProperty) {
          // Ensure backward compatibility by handling both image patterns
          const imagesList = fetchedProperty.images && fetchedProperty.images.length 
            ? fetchedProperty.images 
            : (fetchedProperty.image ? [fetchedProperty.image] : []);
          
          setProperty({
            ...fetchedProperty,
            images: imagesList
          });
        } else {
          setError("Property not found.");
        }
      } catch (err: any) {
        console.error(`Error fetching property ${propertyId}:`, err);
        setError("Failed to load property details. Please try refreshing the page.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  // Memoize helper function
  const formatPrice = useCallback((price: number | undefined | null): string => {
    if (price === undefined || price === null) return "Price on application";
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price);
  }, []);

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  // Get main image url - now safely handles both image patterns
  const mainImageUrl = property?.images && property.images.length > 0 
    ? property.images[selectedImageIndex] 
    : "/images/placeholder-property.jpg";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#2B5273]" role="status" aria-label="Loading property details"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-red-600 text-center px-4" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500 text-center px-4">
        <p>Property data could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-amber-100 p-4 rounded-md mb-6 text-amber-800">
        <h3 className="font-semibold mb-1">Simplified Page</h3>
        <p>This is a simplified property detail page for build testing. Full functionality will be restored later.</p>
      </div>
      
      {/* Back Link & Title */}
      <div className="mb-6">
        <Link href={property.developmentId ? `/developments/${property.developmentId}` : "/developments"} className="text-sm text-[#2B5273] hover:underline mb-2 inline-block">
          &larr; Back to {property.developmentName || "Developments"}
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{property.title || property.name}</h1>
        <p className="text-lg text-gray-600 flex items-center">
          <MapPin className="w-5 h-5 mr-2 inline-block text-gray-500" />
          {property.address 
            ? `${property.address.city || ''}${property.address.state ? `, ${property.address.state}` : ''}`
            : property.developmentName || "Location TBC"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="lg:col-span-2">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-md mb-4 bg-gray-200">
            <Image
              key={mainImageUrl}
              src={mainImageUrl}
              alt={`View of ${property.title || property.name}`}
              fill
              style={{ objectFit: "cover" }}
              priority
              sizes="(max-width: 1024px) 100vw, 67vw"
              onError={(e) => { (e.target as HTMLImageElement).src = "/images/placeholder-property.jpg"; }}
            />
          </div>
          {property.images && property.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {property.images.map((imgUrl: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`relative w-20 h-16 rounded overflow-hidden flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273] ${selectedImageIndex === index ? "ring-2 ring-[#2B5273]" : ""}`}
                  aria-label={`View image ${index + 1}`}
                >
                  <Image
                    src={imgUrl}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="80px"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/images/placeholder-property.jpg"; }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details & Actions */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-3xl font-bold text-[#2B5273] mb-4">{formatPrice(property.price)}</p>
            <div className="flex justify-around text-center border-t border-b border-gray-200 py-4 mb-6">
              <div className="px-2">
                <BedDouble className="w-6 h-6 mx-auto text-gray-600 mb-1" />
                <span className="text-sm font-medium text-gray-800">{property.bedrooms || "-"} Bed</span>
              </div>
              <div className="px-2">
                <Bath className="w-6 h-6 mx-auto text-gray-600 mb-1" />
                <span className="text-sm font-medium text-gray-800">{property.bathrooms || "-"} Bath</span>
              </div>
              <div className="px-2">
                <Maximize className="w-6 h-6 mx-auto text-gray-600 mb-1" />
                <span className="text-sm font-medium text-gray-800">
                  {property.area || property.floorArea ? `${property.area || property.floorArea} sq m` : "-"}
                </span>
              </div>
            </div>
            
            {/* Action Buttons */} 
            <div className="space-y-3">
              <Link 
                href={`/buyer/purchase/${property.id}`} 
                className="block w-full text-center bg-green-600 text-white px-5 py-3 rounded-md hover:bg-green-700 transition-colors font-bold text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"
              >
                Buy Now - Reserve for €500
              </Link>
              <button 
                onClick={() => alert("Booking functionality not yet implemented.")} 
                className="w-full bg-[#2B5273] text-white px-5 py-3 rounded-md hover:bg-[#1E3142] transition-colors font-medium text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]"
              >
                Book Viewing
              </button>
              <Link 
                href={`/customize/${property.id}`} 
                className="block w-full text-center bg-white text-[#2B5273] border border-[#2B5273] px-5 py-3 rounded-md hover:bg-gray-100 transition-colors font-medium text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]"
              >
                Customize This Home
              </Link>
            </div>

            {/* Status Tags */} 
            <div className="mt-6 flex flex-wrap gap-2">
              {property.status && (
                <span className={`px-3 py-1 text-xs font-semibold text-white rounded ${property.statusColor || "bg-gray-500"}`}>
                  {property.status}
                </span>
              )}
              {property.isNew && <span className="px-3 py-1 text-xs font-semibold text-white bg-blue-500 rounded">New Listing</span>}
              {property.isReduced && <span className="px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded">Price Reduced</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Description & Features */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
        <div className="prose max-w-none text-gray-700">
          {property.description ? (
            <p>{property.description}</p>
          ) : (
            <p>No description available.</p>
          )}
        </div>

        {property.features && property.features.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Features</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {property.features.map((feature: string, index: number) => (
                <li key={index} className="flex items-center text-gray-700">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Use either floorPlanUrl or floorPlan */}
        <div className="mt-8 flex space-x-4">
          {(property.floorPlanUrl || property.floorPlan) && (
            <a 
              href={property.floorPlanUrl || property.floorPlan} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#2B5273] hover:underline font-medium"
            >
              View Floor Plan
            </a>
          )}
          {property.virtualTourUrl && (
            <a 
              href={property.virtualTourUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#2B5273] hover:underline font-medium"
            >
              Take Virtual Tour
            </a>
          )}
        </div>
      </div>
    </div>
  );
}