"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, Sparkles, Calculator, Mic, Camera,
  MapPin, Home, Filter, ArrowRight, Bot
} from 'lucide-react';

export const HeroWithSearch = () => {
  const [searchQuerysetSearchQuery] = useState('');
  const [searchFocusedsetSearchFocused] = useState(false);
  const [locationQuerysetLocationQuery] = useState('');
  const [priceRangesetPriceRange] = useState('');
  const [bedroomssetBedrooms] = useState('');

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e3347] to-[#2B5273]" />
          <Image
            src="/images/developments/fitzgerald-gardens.jpg"
            alt="Find Your Dream Home in Ireland"
            fill
            className="object-cover mix-blend-overlay opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">
              Find Your Dream Home in Ireland
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              PropIE connects you directly with developers and agents for the best new properties across Ireland.
            </p>
            <div className="flex gap-4">
              <Link
                href="/properties"
                className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Browse Properties
              </Link>
              <Link
                href="/resources/calculators/mortgage"
                className="px-6 py-3 bg-[#2B5273] text-white font-semibold rounded-lg hover:bg-[#1e3347] transition-colors"
              >
                Mortgage Calculator
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-4 gap-8 text-white text-center">
              <div>
                <div className="text-3xl font-bold">2,500+</div>
                <div className="text-sm text-gray-300">Properties Available</div>
              </div>
              <div>
                <div className="text-3xl font-bold">15+</div>
                <div className="text-sm text-gray-300">Development Partners</div>
              </div>
              <div>
                <div className="text-3xl font-bold">98%</div>
                <div className="text-sm text-gray-300">Customer Satisfaction</div>
              </div>
              <div>
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm text-gray-300">AI Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Search Banner */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            {/* Main Search Bar */}
            <div className="flex-1 relative">
              <div className={`relative flex items-center transition-all duration-200 ${
                searchFocused ? 'scale-105' : ''
              }`}>
                <input
                  type="text"
                  placeholder="Search by area, development, or ask AI anything..."
                  className="w-full px-5 py-3 pl-12 pr-32 rounded-full border-2 border-gray-200 focus:border-[#2B5273] focus:outline-none focus:ring-2 focus:ring-[#2B5273]/20 transition-all"
                  value={searchQuery}
                  onChange={(e: any) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                />
                <Search className="absolute left-4 h-5 w-5 text-gray-400" />

                {/* Input Methods */}
                <div className="absolute right-20 flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Mic className="h-4 w-4 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Camera className="h-4 w-4 text-gray-500" />
                  </button>
                </div>

                {/* AI Button */}
                <button className="absolute right-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-full hover:shadow-lg transition-all flex items-center space-x-1">
                  <Sparkles className="h-4 w-4" />
                  <span>AI</span>
                </button>
              </div>

              {/* Quick Search Suggestions */}
              {searchFocused && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 z-50">
                  <div className="p-4">
                    <div className="text-sm text-gray-500 mb-3">Popular searches</div>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-left">
                        <MapPin className="h-5 w-5 text-[#2B5273]" />
                        <div>
                          <p className="font-medium">Dublin City Center</p>
                          <p className="text-sm text-gray-500">450+ properties</p>
                        </div>
                      </button>
                      <button className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-left">
                        <Home className="h-5 w-5 text-[#2B5273]" />
                        <div>
                          <p className="font-medium">3-bed houses under €500k</p>
                          <p className="text-sm text-gray-500">125 matches</p>
                        </div>
                      </button>
                      <button className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-left">
                        <Sparkles className="h-5 w-5 text-[#2B5273]" />
                        <div>
                          <p className="font-medium">First-time buyer ready</p>
                          <p className="text-sm text-gray-500">AI recommended</p>
                        </div>
                      </button>
                      <button className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-left">
                        <Bot className="h-5 w-5 text-[#2B5273]" />
                        <div>
                          <p className="font-medium">Ask AI Assistant</p>
                          <p className="text-sm text-gray-500">Get personalized help</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Filters */}
            <div className="hidden md:flex items-center space-x-3">
              <select 
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2B5273]"
                value={priceRange}
                onChange={(e: any) => setPriceRange(e.target.value)}
              >
                <option value="">Price Range</option>
                <option value="0-300000">Up to €300k</option>
                <option value="300000-500000">€300k - €500k</option>
                <option value="500000-750000">€500k - €750k</option>
                <option value="750000+">€750k+</option>
              </select>

              <select 
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2B5273]"
                value={bedrooms}
                onChange={(e: any) => setBedrooms(e.target.value)}
              >
                <option value="">Bedrooms</option>
                <option value="1">1 Bed</option>
                <option value="2">2 Beds</option>
                <option value="3">3 Beds</option>
                <option value="4+">4+ Beds</option>
              </select>

              <button className="px-4 py-2 bg-[#2B5273] text-white rounded-lg hover:bg-[#1e3347] transition-colors flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Search</span>
              </button>
            </div>

            {/* Advanced Filters */}
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Quick Links */}
          <div className="flex items-center space-x-4 mt-3 text-sm">
            <Link href="/first-time-buyers" className="text-[#2B5273] hover:underline flex items-center">
              First-Time Buyers
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
            <Link href="/prop-choice" className="text-[#2B5273] hover:underline flex items-center">
              PROP Choice
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
            <Link href="/resources/calculators/mortgage" className="text-[#2B5273] hover:underline flex items-center">
              Mortgage Calculator
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
            <Link href="/resources/guides" className="text-[#2B5273] hover:underline flex items-center">
              Buying Guides
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroWithSearch;