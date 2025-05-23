'use client';

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DataService } from "@/lib/amplify-data"; // Changed to named import
import { Development, Property } from "@/types";
import DevelopmentCard from "@/components/DevelopmentCard";
// We'll create PropertyCard component separately

export default function HomePage() {
  const router = useRouter();
  const [activeTabsetActiveTab] = useState('buyers');
  const [isMenuOpensetIsMenuOpen] = useState(false);
  const [isLoadingsetIsLoading] = useState(true);
  const [featuredDevelopmentssetFeaturedDevelopments] = useState<Development[]>([]);
  const [featuredPropertiessetFeaturedProperties] = useState<Property[]>([]);

  // Fetch data using the DataService
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      // Fetch developments and properties using DataService
      const developments = await DataService.getFeaturedDevelopments();
      const properties = await DataService.getFeaturedProperties();

      setFeaturedDevelopments(developments);
      setFeaturedProperties(properties);
    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Helper function to format price in Euro currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Helper function to get Tailwind color class based on status
  const getStatusColorClass = (statusColor: string | undefined) => {
    switch (statusColor) {
      case 'green': return 'bg-green-500';
      case 'blue': return 'bg-blue-500';
      case 'yellow': return 'bg-yellow-500';
      case 'gray': return 'bg-gray-500';
      case 'purple': return 'bg-purple-500';
      default: return 'bg-gray-500'; // Default color
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2B5273]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section with Navigation */}
      <div className="relative bg-gray-900 h-[80vh] flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-background-drogheda.jpg"
            alt="Drogheda Property Background"
            fill
            style={ objectFit: 'cover' }
            priority
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E3142]/80 to-[#2B5273]/60"></div>

        {/* Navigation */}
        <header className="absolute top-0 left-0 right-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Link href="/" className="text-white font-bold text-2xl" aria-label="Prop.ie Home">Prop.ie</Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
                <Link href="/properties" className="text-white hover:text-gray-200 transition-colors">Properties</Link>
                <Link href="/developments" className="text-white hover:text-gray-200 transition-colors">Developments</Link>
                <Link href="/about" className="text-white hover:text-gray-200 transition-colors">About Us</Link>
                <Link href="/contact" className="text-white hover:text-gray-200 transition-colors">Contact</Link>
                <Link href="/login" className="text-white hover:text-gray-200 transition-colors">Login</Link>
                <Link
                  href="/register"
                  className="bg-white text-[#2B5273] px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Register
                </Link>
              </nav>

              {/* Mobile Navigation Button */}
              <button
                type="button"
                className="md:hidden text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-expanded={isMenuOpen}
                aria-label="Toggle navigation menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white shadow-lg absolute top-full inset-x-0 z-20">
              <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3" aria-label="Mobile Navigation">
                <Link
                  href="/properties"
                  className="block px-3 py-2 text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Properties
                </Link>
                <Link
                  href="/developments"
                  className="block px-3 py-2 text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Developments
                </Link>
                <Link
                  href="/about"
                  className="block px-3 py-2 text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  className="block px-3 py-2 text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  href="/login"
                  className="block px-3 py-2 text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 bg-[#2B5273] text-white rounded-md transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </nav>
            </div>
          )}
        </header>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Find Your Dream Home in Drogheda
            </h1>
            <p className="mt-4 text-xl text-white/90">
              Discover exceptional properties in premium locations with our expert guidance.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => router.push('/developments')}
                className="bg-white text-[#2B5273] px-6 py-3 rounded-md hover:bg-gray-100 transition-colors text-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
              >
                Explore Developments
              </button>
              <button
                onClick={() => router.push('/register')}
                className="bg-[#2B5273] text-white px-6 py-3 rounded-md hover:bg-[#1E3142] transition-colors text-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]"
              >
                Register Interest
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <section aria-labelledby="search-heading" className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-xl p-6 -mt-20 md:-mt-24 relative z-10">
            <h2 id="search-heading" className="text-2xl font-bold text-gray-900 mb-6">Find Your New Home</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <select
                  id="location"
                  name="location"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2B5273] focus:border-[#2B5273]"
                >
                  <option value="">All Locations</option>
                  <option value="drogheda-north">North Drogheda</option>
                  <option value="drogheda-south">South Drogheda</option>
                  <option value="drogheda-east">East Drogheda</option>
                  <option value="drogheda-west">West Drogheda</option>
                  <option value="coastal">Coastal</option>
                  <option value="outskirts">Outskirts</option>
                </select>
              </div>

              <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms
                </label>
                <select
                  id="bedrooms"
                  name="bedrooms"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2B5273] focus:border-[#2B5273]"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>

              <div>
                <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-1">
                  Price Range
                </label>
                <select
                  id="priceRange"
                  name="priceRange"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2B5273] focus:border-[#2B5273]"
                >
                  <option value="">Any</option>
                  <option value="0-300000">Up to €300,000</option>
                  <option value="300000-400000">€300,000 - €400,000</option>
                  <option value="400000-500000">€400,000 - €500,000</option>
                  <option value="500000+">€500,000+</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-[#2B5273] text-white px-4 py-2 rounded-md hover:bg-[#1E3142] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]"
                  aria-label="Search properties"
                >
                  Search Properties
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Our Communities Section */}
      <section aria-labelledby="our-communities-heading" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="our-communities-heading" className="text-3xl font-bold text-gray-900">Our Communities</h2>
            <p className="mt-4 text-xl text-gray-600">
              Discover our premium new developments in Drogheda and surrounding areas
            </p>
          </div>

          {/* Development Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredDevelopments.map((development) => (
              <DevelopmentCard 
                key={development.id} 
                development={development} 
                getStatusColorClass={getStatusColorClass}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/developments"
              className="inline-flex items-center px-6 py-3 border border-[#2B5273] text-[#2B5273] rounded-md hover:bg-[#2B5273] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]"
            >
              View All Developments
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section aria-labelledby="featured-properties-heading" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="featured-properties-heading" className="text-3xl font-bold text-gray-900">Featured Properties</h2>
            <p className="mt-4 text-xl text-gray-600">
              Discover a selection of premium properties available now
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              // Using the div version for now, replace with PropertyCard component when available
              <div
                key={property.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative h-56">
                  <Image
                    src={property.images[0]} // Use first image from the images array
                    alt={property.name} // Use name instead of title
                    fill
                    style={ objectFit: 'cover' }
                    className="rounded-t-lg"
                  />
                  {property.isNew && (
                    <div className="absolute top-4 left-4 bg-[#2B5273] text-white px-3 py-1 rounded-md text-sm font-medium">
                      New
                    </div>
                  )}
                  {property.isReduced && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium">
                      Price Reduced
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-sm text-[#2B5273] font-medium">{property.developmentName}</span>
                      <h3 className="text-xl font-bold text-gray-900 mt-1">{property.name}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#2B5273]">{formatPrice(property.price)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-gray-600 text-sm">
                    <div className="flex space-x-4">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span>{property.bedrooms} bed</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>{property.bathrooms} bath</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span>{property.squareMeters} m²</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link
                      href={`/properties/${property.id}`}
                      className="block w-full bg-[#2B5273] text-white text-center px-4 py-2 rounded-md hover:bg-[#1E3142] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]"
                      aria-label={`View details for ${property.name} in ${property.developmentName}`}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/properties"
              className="inline-flex items-center px-6 py-3 border border-[#2B5273] text-[#2B5273] rounded-md hover:bg-[#2B5273] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]"
            >
              View All Properties
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}