'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getFeaturedProperties } from '@/data/properties';

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('buyers');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const featuredProperties = getFeaturedProperties();
  
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900 h-[70vh]">
        {/* This would be replaced with an actual hero image */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E3142]/80 to-[#2B5273]/50">
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        {/* Navigation */}
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <div className="text-white font-bold text-2xl">Prop.ie</div>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/properties" className="text-white hover:text-gray-200">Properties</Link>
                <Link href="/developments" className="text-white hover:text-gray-200">Developments</Link>
                <Link href="/about" className="text-white hover:text-gray-200">About Us</Link>
                <Link href="/contact" className="text-white hover:text-gray-200">Contact</Link>
                <Link href="/login" className="text-white hover:text-gray-200">Login</Link>
                <Link 
                  href="/register" 
                  className="bg-[#2B5273] text-white px-4 py-2 rounded-md hover:bg-[#1E3142] transition-colors"
                >
                  Register
                </Link>
              </div>
              
              {/* Mobile Navigation Button */}
              <div className="md:hidden">
                <button 
                  type="button" 
                  className="text-white"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white shadow-lg absolute top-16 inset-x-0 z-20">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link 
                  href="/properties" 
                  className="block px-3 py-2 text-gray-900 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Properties
                </Link>
                <Link 
                  href="/developments" 
                  className="block px-3 py-2 text-gray-900 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Developments
                </Link>
                <Link 
                  href="/about" 
                  className="block px-3 py-2 text-gray-900 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link 
                  href="/contact" 
                  className="block px-3 py-2 text-gray-900 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link 
                  href="/login" 
                  className="block px-3 py-2 text-gray-900 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="block px-3 py-2 bg-[#2B5273] text-white rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Find Your Dream Home at Fitzgerald Gardens
            </h1>
            <p className="mt-4 text-xl text-white">
              Premium sustainable homes in Drogheda with excellent connectivity to Dublin
            </p>
            <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => router.push('/developments/fitzgerald-gardens')}
                className="bg-[#2B5273] text-white px-6 py-3 rounded-md hover:bg-[#1E3142] transition-colors text-lg font-medium"
              >
                Explore Development
              </button>
              <button 
                onClick={() => router.push('/register')}
                className="bg-white text-[#2B5273] px-6 py-3 rounded-md hover:bg-gray-100 transition-colors text-lg font-medium"
              >
                Register Interest
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Properties Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
            <p className="mt-4 text-xl text-gray-600">
              Discover our selection of premium properties at Fitzgerald Gardens
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <div 
                key={property.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative h-64">
                  <Image
                    src={property.image}
                    alt={property.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                    priority
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-sm text-[#2B5273] font-medium">{property.development}</span>
                      <h3 className="text-xl font-bold text-gray-900 mt-1">{property.title}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#2B5273]">{formatPrice(property.price)}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex space-x-4">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="text-sm text-gray-600">{property.bedrooms} bed</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-600">{property.bathrooms} bath</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">{property.area} m²</div>
                  </div>
                  <div className="mt-6">
                    <Link 
                      href={`/properties/${property.id}`}
                      className="block w-full bg-[#2B5273] text-white text-center px-4 py-2 rounded-md hover:bg-[#1E3142] transition-colors"
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
              className="inline-flex items-center px-6 py-3 border border-[#2B5273] text-[#2B5273] rounded-md hover:bg-[#2B5273] hover:text-white transition-colors"
            >
              View All Properties
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      
      {/* User Type Tabs Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How Prop.ie Works For You</h2>
            <p className="mt-4 text-xl text-gray-600">
              Tailored solutions for every stakeholder in the property journey
            </p>
          </div>
          
          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="border border-gray-200 rounded-lg flex">
              <button
                className={`px-6 py-3 text-lg font-medium ${
                  activeTab === 'buyers' 
                    ? 'bg-[#2B5273] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } rounded-l-lg transition-colors`}
                onClick={() => setActiveTab('buyers')}
              >
                For Buyers
              </button>
              <button
                className={`px-6 py-3 text-lg font-medium ${
                  activeTab === 'investors' 
                    ? 'bg-[#2B5273] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } transition-colors`}
                onClick={() => setActiveTab('investors')}
              >
                For Investors
              </button>
              <button
                className={`px-6 py-3 text-lg font-medium ${
                  activeTab === 'developers' 
                    ? 'bg-[#2B5273] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } transition-colors`}
                onClick={() => setActiveTab('developers')}
              >
                For Developers
              </button>
              <button
                className={`px-6 py-3 text-lg font-medium ${
                  activeTab === 'agents' 
                    ? 'bg-[#2B5273] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } rounded-r-lg transition-colors`}
                onClick={() => setActiveTab('agents')}
              >
                For Agents
              </button>
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {activeTab === 'buyers' && (
              <div className="md:flex">
                <div className="md:flex-shrink-0 relative h-64 md:h-auto md:w-1/2">
                  {/* This would be replaced with an actual image */}
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                </div>
                <div className="p-8 md:w-1/2">
                  <div className="uppercase tracking-wide text-sm text-[#2B5273] font-semibold">For Home Buyers</div>
                  <h3 className="mt-1 text-2xl font-semibold text-gray-900">Find Your Dream Home</h3>
                  <p className="mt-4 text-gray-600">
                    Prop.ie makes buying your new home easier than ever:
                  </p>
                  <ul className="mt-4 space-y-3">
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Browse detailed property listings with interactive site maps</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Customize your interior finishes before construction is complete</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Track construction progress and receive timely updates</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Access Help-to-Buy scheme guidance and application assistance</span>
                    </li>
                  </ul>
                  <div className="mt-8">
                    <Link
                      href="/register"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2B5273] hover:bg-[#1E3142]"
                    >
                      Register as a Buyer
                    </Link>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'investors' && (
              <div className="md:flex">
                <div className="md:flex-shrink-0 relative h-64 md:h-auto md:w-1/2">
                  {/* This would be replaced with an actual image */}
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="p-8 md:w-1/2">
                  <div className="uppercase tracking-wide text-sm text-[#2B5273] font-semibold">For Property Investors</div>
                  <h3 className="mt-1 text-2xl font-semibold text-gray-900">Maximize Your Investment</h3>
                  <p className="mt-4 text-gray-600">
                    Our platform offers unique advantages for property investors:
                  </p>
                  <ul className="mt-4 space-y-3">
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Access exclusive pre-launch property investment opportunities</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>View comprehensive market analytics and rental yield data</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Connect with property management services seamlessly</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Receive personalized investment portfolio recommendations</span>
                    </li>
                  </ul>
                  <div className="mt-8">
                    <Link
                      href="/register?type=investor"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2B5273] hover:bg-[#1E3142]"
                    >
                      Register as an Investor
                    </Link>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'developers' && (
              <div className="md:flex">
                <div className="md:flex-shrink-0 relative h-64 md:h-auto md:w-1/2">
                  {/* This would be replaced with an actual image */}
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <div className="p-8 md:w-1/2">
                  <div className="uppercase tracking-wide text-sm text-[#2B5273] font-semibold">For Property Developers</div>
                  <h3 className="mt-1 text-2xl font-semibold text-gray-900">Streamline Your Development</h3>
                  <p className="mt-4 text-gray-600">
                    Prop.ie offers a comprehensive solution for property developers:
                  </p>
                  <ul className="mt-4 space-y-3">
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Showcase your developments with interactive 3D models</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Manage customization options and buyer selections efficiently</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Track sales progress and generate real-time reports</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Integrate with Microsoft 365 for seamless document management</span>
                    </li>
                  </ul>
                  <div className="mt-8">
                    <Link
                      href="/register?type=developer"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2B5273] hover:bg-[#1E3142]"
                    >
                      Register as a Developer
                    </Link>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'agents' && (
              <div className="md:flex">
                <div className="md:flex-shrink-0 relative h-64 md:h-auto md:w-1/2">
                  {/* This would be replaced with an actual image */}
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="p-8 md:w-1/2">
                  <div className="uppercase tracking-wide text-sm text-[#2B5273] font-semibold">For Estate Agents</div>
                  <h3 className="mt-1 text-2xl font-semibold text-gray-900">Enhance Your Sales</h3>
                  <p className="mt-4 text-gray-600">
                    Our platform supports estate agents with powerful tools:
                  </p>
                  <ul className="mt-4 space-y-3">
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Access detailed development information and marketing materials</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Track client interactions and manage viewings efficiently</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Process reservations and sales documentation online</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Earn competitive commissions on new development sales</span>
                    </li>
                  </ul>
                  <div className="mt-8">
                    <Link
                      href="/register?type=agent"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2B5273] hover:bg-[#1E3142]"
                    >
                      Register as an Agent
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}