'use client';

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { propertyAPI } from "@/api";
import { getNumericId } from "@/utils/paramValidator";
import { FaBed } from "react-icons/fa";
import { FaBath } from "react-icons/fa";
import { FaRulerCombined } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaEuroSign } from "react-icons/fa";
import Link from "next/link";
import { usePropertyAnalytics } from "@/hooks/usePropertyAnalytics";

import { PropertyDetail as PropertyDetailType } from "@/types/properties";

// Local interface to map API responses to our standardized type
interface PropertyDetails {
  id: string;
  name: string;
  type: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  features: string[];
  images: string[];
  floorPlan?: string;
  energyRating: string;
  status: "available" | "reserved" | "sold";
  developmentId: string;
  developmentName: string;
  project?: {
    id: string;
    name: string;
    location: string;
  };
}

const PropertyDetail: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = getNumericId(searchParams); // Will throw error if missing/invalid
  const analytics = usePropertyAnalytics();

  const [propertysetProperty] = useState<PropertyDetails | null>(null);
  const [loadingsetLoading] = useState(true);
  const [errorsetError] = useState<string | null>(null);
  const [activeImagesetActiveImage] = useState(0);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await propertyAPI.getProperty(id!.toString());

        if (response.success) {
          // Transform API data to match component state
          const propertyData = response.data;
          const propertyDetails = {
            id: propertyData._id,
            name: propertyData.name,
            type: propertyData.type,
            location: propertyData.location || "Ireland",
            price: propertyData.price,
            bedrooms: propertyData.bedrooms,
            bathrooms: propertyData.bathrooms,
            area: propertyData.area,
            description: propertyData.description,
            features: propertyData.features || [],
            images:
              propertyData.images && propertyData.images.length> 0
                ? propertyData.images
                : ["/placeholder-property.jpg"],
            floorPlan: propertyData.floorPlan,
            energyRating: propertyData.energyRating,
            status: propertyData.status,
            // Use the standardized development fields
            developmentId: propertyData.project?._id || '',
            developmentName: propertyData.project?.name || 'Development TBC',
            // Keep project for backwards compatibility
            project: propertyData.project ? {
              id: propertyData.project._id,
              name: propertyData.project.name,
              location: propertyData.project.location} : undefined};

          setProperty(propertyDetails);

          // Track property view
          analytics.trackPropertyViewed({
            id: propertyDetails.id,
            name: propertyDetails.name,
            type: propertyDetails.type,
            price: propertyDetails.price,
            bedrooms: propertyDetails.bedrooms,
            bathrooms: propertyDetails.bathrooms,
            developmentId: propertyDetails.developmentId,
            developmentName: propertyDetails.developmentName,
            status: propertyDetails.status
          }, 'property_detail_page');
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch property details");

      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [idanalytics]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "reserved":
        return "bg-yellow-100 text-yellow-800";
      case "sold":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={() => router.back()}
              className="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Property not found</p>
        <button
          onClick={() => router.back()}
          className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Property Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {property.name}
              </h1>
              <p className="mt-1 text-lg text-gray-500 flex items-center">
                <FaMapMarkerAlt className="mr-2" /> {property.location}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="text-3xl font-bold text-gray-900 flex items-center">
                <FaEuroSign className="mr-1" />{" "
                {property.price.toLocaleString()}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${getStatusBadgeClass(property.status)}`}
              >
                {property.status.charAt(0).toUpperCase() +
                  property.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Property Images */}
        <div className="mb-8">
          <div className="relative h-96 overflow-hidden rounded-lg">
            <img
              src={property.images[activeImage]}
              alt={property.name}
              className="w-full h-full object-cover"
            />
          </div>
          {property.images.length> 1 && (
            <div className="mt-4 grid grid-cols-5 gap-2">
              {property.images.map((imageindex) => (
                <div
                  key={index}
                  className={`h-20 cursor-pointer rounded-md overflow-hidden border-2 ${activeImage === index ? "border-blue-500" : "border-transparent"`}
                  onClick={() => setActiveImage(index)}
                >
                  <img
                    src={image}
                    alt={`${property.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Property Details
                </h3>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Property Type
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">
                      {property.type}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Bedrooms
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {property.bedrooms}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Bathrooms
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {property.bathrooms}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Area</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {property.area} m²
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Energy Rating
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {property.energyRating}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Development
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {property.developmentName}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Description
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-500">{property.description}</p>
              </div>
            </div>

            {/* Customization CTA */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 shadow overflow-hidden sm:rounded-lg mb-8">
              <div className="px-6 py-8 text-center text-white">
                <h3 className="text-2xl font-bold mb-4">
                  Make it Yours
                </h3>
                <p className="text-lg mb-6 opacity-90">
                  Personalize your new home with our 3D customization studio
                </p>
                <Link
                  href={`/properties/${property.id}/customize`}
                  className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition duration-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Customize This Home
                </Link>
              </div>
            </div>

            {property.features.length> 0 && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Features
                  </h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                    {property.features.map((featureindex) => (
                      <li
                        key={index}
                        className="text-sm text-gray-500 flex items-center"
                      >
                        <svg
                          className="h-5 w-5 text-green-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {property.floorPlan && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Floor Plan
                  </h3>
                </div>
                <div 
                  className="border-t border-gray-200 px-4 py-5 sm:px-6"
                  onClick={() => {
                    // Track floor plan viewed
                    analytics.trackPropertyInterest(
                      {
                        id: property.id,
                        type: property.type,
                        price: property.price,
                        developmentId: property.developmentId
                      },
                      'floor_plan_viewed'
                    );
                  }
                >
                  <img
                    src={property.floorPlan}
                    alt={`${property.name} - Floor Plan`}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg sticky top-8">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Property Summary
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="flex justify-between py-3 border-b">
                  <div className="flex items-center">
                    <FaBed className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Bedrooms</span>
                  </div>
                  <span className="text-sm font-medium">
                    {property.bedrooms}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <div className="flex items-center">
                    <FaBath className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Bathrooms</span>
                  </div>
                  <span className="text-sm font-medium">
                    {property.bathrooms}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <div className="flex items-center">
                    <FaRulerCombined className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Area</span>
                  </div>
                  <span className="text-sm font-medium">
                    {property.area} m²
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <div className="flex items-center">
                    <FaEuroSign className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Price</span>
                  </div>
                  <span className="text-sm font-medium">
                    €{property.price.toLocaleString()}
                  </span>
                </div>

                {property.status === "available" && (
                  <Link 
                    href={`/property/purchase?id=${property.id}`}
                    onClick={() => {
                      // Track purchase process initiation
                      analytics.trackPurchaseStarted(property.id, property.price);
                      analytics.trackReservationIntent({
                        id: property.id,
                        name: property.name,
                        type: property.type,
                        price: property.price,
                        developmentId: property.developmentId,
                        developmentName: property.developmentName
                      });
                    }
                  >
                    <button className="mt-6 w-full bg-blue-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Start Purchase Process
                    </button>
                  </Link>
                )}

                {property.status === "reserved" && (
                  <div className="mt-6 w-full bg-yellow-100 border border-yellow-200 rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-yellow-800">
                    This property is currently reserved
                  </div>
                )}

                {property.status === "sold" && (
                  <div className="mt-6 w-full bg-red-100 border border-red-200 rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-red-800">
                    This property has been sold
                  </div>
                )}

                <Link href="/property">
                  <button className="mt-4 w-full bg-white border border-gray-300 rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Back to Properties
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
