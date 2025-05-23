"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import api from "@/api";
import { CustomizationProvider } from "@/context/CustomizationContext";

interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  image: string;
  description: string;
}

export default function TestApiPage() {
  const [propertiessetProperties] = useState<Property[]>([]);
  const [loadingsetLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const response = await api.get("/properties");
        const fetchedProperties = response.data;

        if (fetchedProperties && fetchedProperties.length> 0) {
          setProperties(fetchedProperties);
        } else {
          const mockProperties: Property[] = [
            {
              id: 1,
              title: "Maple Heights - Luxury Apartments",
              location: "Dublin 4, Ireland",
              price: 320000,
              bedrooms: 2,
              bathrooms: 2,
              size: 85,
              image: "/maple-heights.jpg",
              description: "Modern luxury apartments in the heart of Dublin with excellent amenities and transport links.",
            {
              id: 2,
              title: "Oak Residences - Family Homes",
              location: "Galway, Ireland",
              price: 450000,
              bedrooms: 3,
              bathrooms: 2,
              size: 120,
              image: "/oak-residences.jpg",
              description: "Spacious family homes in a peaceful neighborhood with schools and parks nearby.",
            {
              id: 3,
              title: "Riverside Apartments",
              location: "Cork, Ireland",
              price: 280000,
              bedrooms: 1,
              bathrooms: 1,
              size: 65,
              image: "/riverside.jpg",
              description: "Stylish apartments overlooking the river with modern finishes and city center convenience.",
            {
              id: 4,
              title: "Willow Park Townhouses",
              location: "Limerick, Ireland",
              price: 350000,
              bedrooms: 3,
              bathrooms: 2,
              size: 110,
              image: "/willow-park.jpg",
              description: "Contemporary townhouses with private gardens in a well-established community."];
          setProperties(mockProperties);
        }

        setLoading(false);
      } catch (error) {

        const mockProperties: Property[] = [
          {
            id: 1,
            title: "Maple Heights - Luxury Apartments",
            location: "Dublin 4, Ireland",
            price: 320000,
            bedrooms: 2,
            bathrooms: 2,
            size: 85,
            image: "/maple-heights.jpg",
            description: "Modern luxury apartments in the heart of Dublin with excellent amenities and transport links.",
          {
            id: 2,
            title: "Oak Residences - Family Homes",
            location: "Galway, Ireland",
            price: 450000,
            bedrooms: 3,
            bathrooms: 2,
            size: 120,
            image: "/oak-residences.jpg",
            description: "Spacious family homes in a peaceful neighborhood with schools and parks nearby.",
          {
            id: 3,
            title: "Riverside Apartments",
            location: "Cork, Ireland",
            price: 280000,
            bedrooms: 1,
            bathrooms: 1,
            size: 65,
            image: "/riverside.jpg",
            description: "Stylish apartments overlooking the river with modern finishes and city center convenience.",
          {
            id: 4,
            title: "Willow Park Townhouses",
            location: "Limerick, Ireland",
            price: 350000,
            bedrooms: 3,
            bathrooms: 2,
            size: 110,
            image: "/willow-park.jpg",
            description: "Contemporary townhouses with private gardens in a well-established community."];
        setProperties(mockProperties);
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  return (
    <CustomizationProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative bg-blue-600">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-600 mix-blend-multiply" />
          </div>
          <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find Your Perfect Home in Ireland
            </h1>
            <p className="mt-6 max-w-3xl text-xl text-blue-100">
              Prop.ie connects first-time buyers with developers and solicitors
              for a seamless property purchase experience.
            </p>
            <div className="mt-10">
              <div className="sm:flex">
                <Link
                  href="/properties"
                  className="inline-block bg-white py-3 px-6 border border-transparent rounded-md text-base font-medium text-blue-700 hover:bg-blue-50 sm:mr-4"
                >
                  Browse Properties
                </Link>
                {!user && (
                  <Link
                    href="/register"
                    className="mt-3 inline-block bg-blue-500 py-3 px-6 border border-transparent rounded-md text-base font-medium text-white hover:bg-blue-400 sm:mt-0"
                  >
                    Register Now
                  </Link>
                )}
                {user && user.role === "buyer" && (
                  <Link
                    href="/buyer/htb"
                    className="mt-3 inline-block bg-blue-500 py-3 px-6 border border-transparent rounded-md text-base font-medium text-white hover:bg-blue-400 sm:mt-0"
                  >
                    Help-to-Buy
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Properties */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Featured Properties
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Discover our selection of high-quality new developments across
              Ireland.
            </p>
          </div>

          {loading ? (
            <div className="mt-12 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="h-48 w-full bg-gray-200 relative">
                    {/* Image would go here */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <span>Image Placeholder</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      {property.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {property.location}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-lg font-semibold text-blue-600">
                        €{property.price.toLocaleString()}
                      </span>
                      <div className="flex space-x-4 text-sm text-gray-500">
                        <span>{property.bedrooms} bed</span>
                        <span>{property.bathrooms} bath</span>
                        <span>{property.size} m²</span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-500">
                      {property.description}
                    </p>
                    <div className="mt-6">
                      <Link
                        href={`/properties/${property.id}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/properties"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View All Properties
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Everything You Need in One Place
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Prop.ie streamlines the property buying process with integrated
                services for buyers, solicitors, and developers.
              </p>
            </div>
            <div className="mt-12">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <div className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                          <svg
                            className="h-6 w-6 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                          </svg>
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900">
                        Help-to-Buy Integration
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        Apply for the Help-to-Buy scheme directly through our
                        platform and track your application status in real-time.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                          <svg
                            className="h-6 w-6 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                            />
                          </svg>
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900">
                        Property Customization
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        Personalize your new home with our interactive
                        customization tools for flooring, fixtures, paint
                        colors, and more.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                          <svg
                            className="h-6 w-6 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900">
                        Legal Document Management
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        Streamlined document management for solicitors with
                        secure storage, version control, and electronic
                        signatures.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-700">
          <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Ready to find your dream home?</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-blue-200">
              Join thousands of satisfied homeowners who found their perfect
              property through Prop.ie.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="inline-flex rounded-md shadow">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
                >
                  Get Started
                </Link>
              </div>
              <div className="ml-3 inline-flex">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomizationProvider>
  );
}
