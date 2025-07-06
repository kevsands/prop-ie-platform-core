'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function OriginalPage() {
  const [activeTab, setActiveTab] = useState('buyers');

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="text-2xl font-bold text-[#2B5273]">
              Prop.ie
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/buy" className="text-gray-700 hover:text-[#2B5273]">Buy</Link>
              <Link href="/developments" className="text-gray-700 hover:text-[#2B5273]">Developments</Link>
              <Link href="/help-to-buy" className="text-gray-700 hover:text-[#2B5273]">Help to Buy</Link>
              <Link href="/login" className="bg-[#2B5273] text-white px-4 py-2 rounded-md hover:bg-[#1E3142]">Login</Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2B5273] to-[#1E3142] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Find Your Perfect Home in Ireland</h1>
          <p className="text-xl mb-8 opacity-90">
            Ireland's premier property platform connecting buyers, developers, and professionals
          </p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-xl">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Location or development name..."
                  className="flex-1 p-3 border border-gray-300 rounded-md text-gray-900"
                />
                <select className="p-3 border border-gray-300 rounded-md text-gray-900 min-w-32">
                  <option>Price Range</option>
                  <option>€200,000 - €300,000</option>
                  <option>€300,000 - €400,000</option>
                  <option>€400,000 - €500,000</option>
                  <option>€500,000+</option>
                </select>
                <select className="p-3 border border-gray-300 rounded-md text-gray-900 min-w-32">
                  <option>Bedrooms</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4+</option>
                </select>
                <button className="bg-[#2B5273] text-white px-8 py-3 rounded-md hover:bg-[#1E3142] font-medium">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Developments */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Featured Developments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Fitzgerald Gardens</h3>
                <p className="text-gray-600 mb-2">Premium development in Drogheda</p>
                <p className="text-[#2B5273] font-semibold">€295,000 - €450,000</p>
              </div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Riverside Manor</h3>
                <p className="text-gray-600 mb-2">Luxury apartments by the river</p>
                <p className="text-[#2B5273] font-semibold">€285,000 - €425,000</p>
              </div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Ballymakenny View</h3>
                <p className="text-gray-600 mb-2">Modern homes with scenic views</p>
                <p className="text-[#2B5273] font-semibold">€320,000 - €480,000</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose Prop.ie?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Search</h3>
              <p className="text-gray-600">Advanced property search with detailed filters</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Verified Listings</h3>
              <p className="text-gray-600">All properties verified and up-to-date</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Help-to-Buy</h3>
              <p className="text-gray-600">Integrated Help-to-Buy application support</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Expert Support</h3>
              <p className="text-gray-600">Professional guidance throughout your journey</p>
            </div>
          </div>
        </div>
      </section>

      {/* User Type Tabs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How Prop.ie Works For You</h2>
          
          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="border border-gray-200 rounded-lg flex bg-white">
              <button
                className={`px-6 py-3 font-medium rounded-l-lg ${
                  activeTab === 'buyers' ? 'bg-[#2B5273] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('buyers')}
              >
                For Buyers
              </button>
              <button
                className={`px-6 py-3 font-medium ${
                  activeTab === 'investors' ? 'bg-[#2B5273] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('investors')}
              >
                For Investors
              </button>
              <button
                className={`px-6 py-3 font-medium ${
                  activeTab === 'developers' ? 'bg-[#2B5273] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('developers')}
              >
                For Developers
              </button>
              <button
                className={`px-6 py-3 font-medium ${
                  activeTab === 'agents' ? 'bg-[#2B5273] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('agents')}
              >
                For Agents
              </button>
              <button
                className={`px-6 py-3 font-medium rounded-r-lg ${
                  activeTab === 'solicitors' ? 'bg-[#2B5273] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('solicitors')}
              >
                For Solicitors
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {activeTab === 'buyers' && (
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Find Your Dream Home</h3>
                <p className="text-gray-600 mb-6">
                  Search through thousands of verified properties with our advanced search tools and get help with financing through our Help-to-Buy integration.
                </p>
                <ul className="space-y-3 text-gray-700 mb-6">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Advanced search with detailed filters</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Help-to-Buy scheme integration</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Direct communication with developers</span>
                  </li>
                </ul>
                <Link
                  href="/register"
                  className="inline-flex items-center px-6 py-3 bg-[#2B5273] text-white rounded-md hover:bg-[#1E3142] font-medium"
                >
                  Start Your Search
                </Link>
              </div>
            )}

            {activeTab === 'investors' && (
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Maximize Your Investment</h3>
                <p className="text-gray-600 mb-6">
                  Access detailed ROI analysis and rental yield projections for informed investment decisions.
                </p>
                <ul className="space-y-3 text-gray-700 mb-6">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Detailed ROI analysis and rental yield projections</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Priority access to new development launches</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Portfolio management tools</span>
                  </li>
                </ul>
                <Link
                  href="/investor/register"
                  className="inline-flex items-center px-6 py-3 bg-[#2B5273] text-white rounded-md hover:bg-[#1E3142] font-medium"
                >
                  Register as an Investor
                </Link>
              </div>
            )}

            {activeTab === 'developers' && (
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Showcase Your Developments</h3>
                <p className="text-gray-600 mb-6">
                  Premium promotion tools and comprehensive sales dashboards for property developers.
                </p>
                <ul className="space-y-3 text-gray-700 mb-6">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Premium promotion to qualified buyers</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Comprehensive sales dashboards</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Customer relationship management</span>
                  </li>
                </ul>
                <Link
                  href="/developer/register"
                  className="inline-flex items-center px-6 py-3 bg-[#2B5273] text-white rounded-md hover:bg-[#1E3142] font-medium"
                >
                  Partner with Us
                </Link>
              </div>
            )}

            {activeTab === 'agents' && (
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Grow Your Business</h3>
                <p className="text-gray-600 mb-6">
                  Advanced lead management tools and commission tracking for real estate professionals.
                </p>
                <ul className="space-y-3 text-gray-700 mb-6">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Qualified lead generation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Commission tracking and management</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Professional networking opportunities</span>
                  </li>
                </ul>
                <Link
                  href="/agent/register"
                  className="inline-flex items-center px-6 py-3 bg-[#2B5273] text-white rounded-md hover:bg-[#1E3142] font-medium"
                >
                  Join Our Network
                </Link>
              </div>
            )}

            {activeTab === 'solicitors' && (
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Efficient Conveyancing</h3>
                <p className="text-gray-600 mb-6">
                  Streamlined processes for legal professionals with secure document exchange.
                </p>
                <ul className="space-y-3 text-gray-700 mb-6">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Secure digital document exchange</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Standardized templates</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Real-time transaction tracking</span>
                  </li>
                </ul>
                <Link
                  href="/solicitor/register"
                  className="inline-flex items-center px-6 py-3 bg-[#2B5273] text-white rounded-md hover:bg-[#1E3142] font-medium"
                >
                  Join Our Legal Network
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-[#2B5273] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Property?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers who found their dream homes through Prop.ie
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/developments"
              className="bg-white text-[#2B5273] px-8 py-3 rounded-md hover:bg-gray-100 font-medium"
            >
              Browse Developments
            </Link>
            <Link
              href="/register"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md hover:bg-white hover:text-[#2B5273] font-medium"
            >
              Register Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}