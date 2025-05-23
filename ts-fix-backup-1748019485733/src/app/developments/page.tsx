/**
 * Developments Listing Page
 * Shows all available property developments
 */
import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Developments | Prop.ie',
  description: 'Browse our property developments across Ireland'};

// Updated development data to match what's displayed on the properties page
const allDevelopments = [
  {
    id: 'fitzgerald-gardens',
    name: 'Fitzgerald Gardens',
    description: 'Luxurious living with modern comforts in the heart of Finglas',
    location: 'Finglas, Dublin',
    status: 'Selling Fast',
    startingPrice: '€395,000',
    priceRange: '€395,000 - €575,000',
    bedrooms: [2, 34],
    bathrooms: 2,
    energyRating: 'A2',
    availability: 'Move in from Winter 2025',
    mainImage: '/images/fitzgerald-gardens/hero.jpg',
    images: [
      '/images/fitzgerald-gardens/hero.jpg',
      '/images/fitzgerald-gardens/2.jpg',
      '/images/fitzgerald-gardens/3.jpg'
    ],
    features: ['Energy Efficient', 'Modern Design', 'Secure Parking', 'Landscaped Gardens'],
    unitsAvailable: 12,
    totalUnits: 48},
  {
    id: 'ballymakenny-view',
    name: 'Ballymakenny View',
    description: 'Modern family homes in a convenient location with excellent amenities',
    location: 'Drogheda, Co. Louth',
    status: 'Coming Soon',
    startingPrice: '€285,000',
    priceRange: '€285,000 - €425,000',
    bedrooms: [34],
    bathrooms: 2,
    energyRating: 'A3',
    availability: 'Launching Summer 2025',
    mainImage: '/images/ballymakenny-view/hero.jpg',
    images: [
      '/images/ballymakenny-view/hero.jpg',
      '/images/ballymakenny-view/2.jpg',
      '/images/ballymakenny-view/3.jpg'
    ],
    features: ['Family Friendly', 'Near Schools', 'Private Gardens', 'Quiet Location'],
    unitsAvailable: 36,
    totalUnits: 36},
  {
    id: 'ellwood',
    name: 'Ellwood',
    description: 'Exclusive riverside apartments with stunning views and premium finishes',
    location: 'Celbridge, Co. Kildare',
    status: 'Now Selling',
    startingPrice: '€415,000',
    priceRange: '€415,000 - €650,000',
    bedrooms: [1, 23],
    bathrooms: 2,
    energyRating: 'A1',
    availability: 'Available Now',
    mainImage: '/images/ellwood/hero.jpg',
    images: [
      '/images/ellwood/hero.jpg',
      '/images/ellwood/2.jpg',
      '/images/ellwood/3.jpg'
    ],
    features: ['Riverside Views', 'Premium Finishes', 'Concierge Service', 'Gym & Spa'],
    unitsAvailable: 8,
    totalUnits: 24}
];

export default function DevelopmentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our Developments
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Discover our range of premium residential developments across Ireland
            </p>
          </div>
        </div>
      </section>

      {/* Developments Grid */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {allDevelopments.map((development) => (
              <Link
                key={development.id}
                href={`/developments/${development.id}`}
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-64">
                  <Image
                    src={development.mainImage}
                    alt={development.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`
                      px-3 py-1 rounded-full text-sm font-semibold text-white
                      ${development.status === 'Selling Fast' ? 'bg-red-500' : ''}
                      ${development.status === 'Coming Soon' ? 'bg-blue-500' : ''}
                      ${development.status === 'Now Selling' ? 'bg-green-500' : ''}
                    `}>
                      {development.status}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {development.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {development.description}
                  </p>

                  <div className="flex items-center text-gray-500 mb-4">
                    <svg className="h-5 w-5 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span>{development.location}</span>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-6">
                    <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
                      <svg className="h-4 w-4 mr-1.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                      </svg>
                      <span className="text-gray-700">
                        {development.bedrooms.length> 1 
                          ? `${Math.min(...development.bedrooms)}-${Math.max(...development.bedrooms)} Bed`
                          : `${development.bedrooms[0]} Bed`}
                      </span>
                    </div>

                    <div className="flex items-center bg-green-100 px-3 py-1 rounded-full text-sm">
                      <svg className="h-4 w-4 mr-1.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                      <span className="text-green-700">BER {development.energyRating}</span>
                    </div>

                    {development.unitsAvailable> 0 && (
                      <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full text-sm">
                        <span className="text-blue-700">
                          {development.unitsAvailable} units available
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-500 text-sm">Starting from</span>
                        <div className="text-2xl font-bold text-gray-900">
                          {development.startingPrice}
                        </div>
                      </div>
                      <div className="text-blue-600 font-medium group-hover:text-blue-700 flex items-center">
                        View Details
                        <svg className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Developments */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose Our Developments</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Quality & Design</h3>
              <p className="text-gray-600">Premium finishes and modern architecture</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Location</h3>
              <p className="text-gray-600">Prime locations with excellent amenities</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Investment Value</h3>
              <p className="text-gray-600">Strong potential for capital appreciation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Prop Choice Customisation Flow Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Customise Your New Home with Prop Choice</h2>
          <p className="text-xl text-center text-gray-600 mb-8">
            Personalise your new home with our advanced customisation platform. Choose finishes, furniture, and smart features – all before you move in.
          </p>
          <div className="text-center">
            <Link href="/prop-choice" className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all">
              Explore Prop Choice
            </Link>
          </div>
        </div>
      </section>

      {/* AI-Powered Property Search Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Find Your Perfect Home with AI</h2>
          <p className="text-xl text-center text-gray-600 mb-8">
            Use our advanced AI-powered search to find properties that match your lifestyle and preferences.
          </p>
          <div className="text-center">
            <Link href="/properties/search" className="inline-block px-8 py-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all">
              Try AI Property Search
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your New Home?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Contact our team to arrange a viewing or register your interest in upcoming developments
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center"
            >
              Contact Us
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </Link>
            <Link
              href="/register"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors inline-flex items-center"
            >
              Register Interest
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}