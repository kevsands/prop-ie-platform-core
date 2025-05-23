"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Search, Sparkles, Calculator, Mic, Camera,
  MapPin, Home, Filter, ArrowRight, Bot,
  ChevronLeft, ChevronRight
} from 'lucide-react';

const heroImages = [
  {
    src: '/images/developments/fitzgerald-gardens/hero.jpeg',
    alt: 'Fitzgerald Gardens',
    title: 'Fitzgerald Gardens',
    subtitle: 'New phase just released in Drogheda',
    link: '/developments/fitzgerald-gardens'
  },
  {
    src: '/images/ballymakenny-view/hero.jpg',
    alt: 'Ballymakenny View',
    title: 'Ballymakenny View',
    subtitle: '3 Bed Homes in Drogheda',
    link: '/developments/ballymakenny-view'
  },
  {
    src: '/images/ellwood/hero.jpg',
    alt: 'Ellwood',
    title: 'Ellwood',
    subtitle: '2 and 3 Bed Homes in Drogheda',
    link: '/developments/ellwood'
  }
];

export const HeroWithCarousel = () => {
  const router = useRouter();
  const [currentImageIndexsetCurrentImageIndex] = useState(0);
  const [searchQuerysetSearchQuery] = useState('');
  const [searchFocusedsetSearchFocused] = useState(false);
  const [priceRangesetPriceRange] = useState('');
  const [bedroomssetBedrooms] = useState('');

  // Auto-rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 8000); // Change every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  return (
    <>
      {/* Hero Section with Carousel */}
      <section className="relative h-[500px] sm:h-[550px] md:h-[600px] overflow-hidden">
        {/* Background Images */}
        {heroImages.map((imageindex) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />

            {/* Development Info Overlay - Responsive positioning */}
            <div className="absolute bottom-20 sm:bottom-16 md:bottom-8 left-4 sm:left-auto sm:right-4 md:right-8 bg-white/90 backdrop-blur-sm rounded-lg p-3 sm:p-4 max-w-[calc(100%-2rem)] sm:max-w-xs md:max-w-sm">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">{image.title}</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-3">{image.subtitle}</p>
              <Link
                href={image.link}
                className="inline-flex items-center text-[#2B5273] font-semibold hover:underline text-sm sm:text-base"
              >
                View Development
                <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </div>
          </div>
        ))}

        {/* Carousel Controls - Smaller on mobile */}
        <button
          onClick={prevImage}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 sm:p-3 hover:bg-white transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6 text-gray-800" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 sm:p-3 hover:bg-white transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6 text-gray-800" />
        </button>

        {/* Dots Indicator - Smaller on mobile */}
        <div className="absolute bottom-16 sm:bottom-12 md:bottom-8 left-1/2 -translate-x-1/2 flex space-x-1 sm:space-x-2">
          {heroImages.map((_index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'w-6 sm:w-8 bg-white' 
                  : 'w-1.5 sm:w-2.5 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>

        {/* Hero Content - Responsive text sizes and spacing */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-full sm:max-w-lg md:max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">
              Find Your Dream Home in Ireland
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 md:mb-8 text-gray-200">
              PropIE connects you directly with developers and agents for the best new properties across Ireland.
            </p>
            <div className="flex flex-col xs:flex-row gap-2 sm:gap-4">
              <Link
                href="/properties"
                className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-center text-sm sm:text-base"
              >
                Browse Properties
              </Link>
              <Link
                href="/resources/calculators/mortgage"
                className="px-4 sm:px-6 py-2 sm:py-3 bg-[#2B5273] text-white font-semibold rounded-lg hover:bg-[#1e3347] transition-colors text-center text-sm sm:text-base"
              >
                Mortgage Calculator
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats - Responsive grid layout */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-8 text-white text-center">
              <div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold">2,500+</div>
                <div className="text-xs sm:text-sm text-gray-300">Properties Available</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold">15+</div>
                <div className="text-xs sm:text-sm text-gray-300">Development Partners</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold">98%</div>
                <div className="text-xs sm:text-sm text-gray-300">Customer Satisfaction</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold">24/7</div>
                <div className="text-xs sm:text-sm text-gray-300">AI Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Search Banner */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Main Search Bar */}
            <div className="flex-1 relative">
              <div className={`relative flex items-center transition-all duration-200 ${
                searchFocused ? 'sm:scale-105' : ''
              }`}>
                <input
                  type="text"
                  placeholder="Search properties using AI..."
                  className="w-full px-3 sm:px-5 py-2 sm:py-3 pl-8 sm:pl-12 pr-14 sm:pr-32 rounded-full text-sm sm:text-base border-2 border-gray-200 focus:border-[#2B5273] focus:outline-none focus:ring-2 focus:ring-[#2B5273]/20 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  onKeyDown={(e) => e.key === 'Enter' && router.push('/properties/search')}
                />
                <Search className="absolute left-3 sm:left-4 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />

                {/* Input Methods - Hidden on smallest screens */}
                <div className="absolute right-12 sm:right-20 hidden sm:flex items-center space-x-2">
                  <button className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Mic className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                  </button>
                  <button className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Camera className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                  </button>
                </div>

                {/* AI Button */}
                <button 
                  className="absolute right-2 px-2 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs sm:text-sm font-medium rounded-full hover:shadow-lg transition-all flex items-center space-x-1"
                  onClick={() => router.push('/properties/search')}
                >
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>AI</span>
                </button>
              </div>

              {/* Quick Search Suggestions */}
              {searchFocused && (
                <div className="absolute top-full mt-1 sm:mt-2 w-full bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl border border-gray-100 z-50">
                  <div className="p-2 sm:p-4">
                    <div className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">Current Developments</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      <button 
                        className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 text-left"
                        onClick={() => router.push('/developments/fitzgerald-gardens')}
                      >
                        <Home className="h-4 w-4 sm:h-5 sm:w-5 text-[#2B5273]" />
                        <div>
                          <p className="font-medium text-sm sm:text-base">Fitzgerald Gardens</p>
                          <p className="text-xs sm:text-sm text-gray-500">Phase 2 now available</p>
                        </div>
                      </button>
                      <button 
                        className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 text-left"
                        onClick={() => router.push('/developments/ballymakenny-view')}
                      >
                        <Home className="h-4 w-4 sm:h-5 sm:w-5 text-[#2B5273]" />
                        <div>
                          <p className="font-medium text-sm sm:text-base">Ballymakenny View</p>
                          <p className="text-xs sm:text-sm text-gray-500">3-bed homes from €375k</p>
                        </div>
                      </button>
                      <button 
                        className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 text-left"
                        onClick={() => {
                          router.push('/properties/search');
                          setTimeout(() => {
                            window.dispatchEvent(new CustomEvent('ai-search', { 
                              detail: { query: 'First-time buyer homes with good energy rating' }
                            }));
                          }, 500);
                        }
                      >
                        <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-[#2B5273]" />
                        <div>
                          <p className="font-medium text-sm sm:text-base">First-time buyer ready</p>
                          <p className="text-xs sm:text-sm text-gray-500">AI recommended</p>
                        </div>
                      </button>
                      <button 
                        className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 text-left"
                        onClick={() => router.push('/properties/search')}
                      >
                        <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-[#2B5273]" />
                        <div>
                          <p className="font-medium text-sm sm:text-base">Ask AI Assistant</p>
                          <p className="text-xs sm:text-sm text-gray-500">Get personalized help</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Filters - Hidden on small mobile */}
            <div className="hidden md:flex items-center space-x-3">
              <select 
                className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:outline-none focus:border-[#2B5273]"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <option value="">Price Range</option>
                <option value="0-300000">Up to €300k</option>
                <option value="300000-500000">€300k - €500k</option>
                <option value="500000-750000">€500k - €750k</option>
                <option value="750000+">€750k+</option>
              </select>

              <select 
                className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:outline-none focus:border-[#2B5273]"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
              >
                <option value="">Bedrooms</option>
                <option value="1">1 Bed</option>
                <option value="2">2 Beds</option>
                <option value="3">3 Beds</option>
                <option value="4+">4+ Beds</option>
              </select>

              <button className="px-3 sm:px-4 py-2 bg-[#2B5273] text-white rounded-lg hover:bg-[#1e3347] transition-colors flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base">
                <Search className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Search</span>
              </button>
            </div>

            {/* Advanced Filters */}
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
            </button>
          </div>

          {/* Quick Links - Scrollable on mobile */}
          <div className="flex items-center space-x-4 mt-2 sm:mt-3 text-xs sm:text-sm overflow-x-auto pb-1 hide-scrollbar">
            <Link href="/first-time-buyers" className="text-[#2B5273] hover:underline flex items-center whitespace-nowrap">
              First-Time Buyers
              <ArrowRight className="h-2 w-2 sm:h-3 sm:w-3 ml-1" />
            </Link>
            <Link href="/prop-choice" className="text-[#2B5273] hover:underline flex items-center whitespace-nowrap">
              PROP Choice
              <ArrowRight className="h-2 w-2 sm:h-3 sm:w-3 ml-1" />
            </Link>
            <Link href="/resources/calculators/mortgage" className="text-[#2B5273] hover:underline flex items-center whitespace-nowrap">
              Mortgage Calculator
              <ArrowRight className="h-2 w-2 sm:h-3 sm:w-3 ml-1" />
            </Link>
            <Link href="/resources/guides" className="text-[#2B5273] hover:underline flex items-center whitespace-nowrap">
              Buying Guides
              <ArrowRight className="h-2 w-2 sm:h-3 sm:w-3 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Add a custom style for hiding scrollbars while maintaining functionality */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
    </>
  );
};

export default HeroWithCarousel;