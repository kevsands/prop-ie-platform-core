"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [priceRange, setPriceRange] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  
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
      <section className="relative h-[600px] overflow-hidden">
        {/* Background Images */}
        {heroImages.map((image, index) => (
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
            
            {/* Development Info Overlay */}
            <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-sm rounded-lg p-4 max-w-sm">
              <h3 className="text-lg font-bold text-gray-900">{image.title}</h3>
              <p className="text-gray-600 mb-3">{image.subtitle}</p>
              <Link
                href={image.link}
                className="inline-flex items-center text-[#2B5273] font-semibold hover:underline"
              >
                View Development
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
        
        {/* Carousel Controls */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6 text-gray-800" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6 text-gray-800" />
        </button>
        
        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
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
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                    <div className="text-sm text-gray-500 mb-3">Current Developments</div>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-left">
                        <Home className="h-5 w-5 text-[#2B5273]" />
                        <div>
                          <p className="font-medium">Fitzgerald Gardens</p>
                          <p className="text-sm text-gray-500">Phase 2 now available</p>
                        </div>
                      </button>
                      <button className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-left">
                        <Home className="h-5 w-5 text-[#2B5273]" />
                        <div>
                          <p className="font-medium">Ballymakenny View</p>
                          <p className="text-sm text-gray-500">3-bed homes from €375k</p>
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
                onChange={(e) => setPriceRange(e.target.value)}
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
                onChange={(e) => setBedrooms(e.target.value)}
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

export default HeroWithCarousel;