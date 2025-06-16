'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, ChevronRight, Home, Building, TrendingUp, 
  Calculator, Users, FileText, Star, Eye, Shield, Clock,
  CheckCircle, BarChart2, Award, Zap, Globe, Phone, Mail, MapPin,
  Sparkles
} from 'lucide-react';
import { mockDevelopments } from '@/data/mockDevelopments';
import SolutionsSection from '@/components/home/SolutionsSection';
import EnhancedServicesSection from '@/components/home/EnhancedServicesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import BasicTestimonialsSection from '@/components/home/BasicTestimonialsSection';

// Property Context
interface PropertyContextType {
  properties: Property[];
  developments: Development[];
  getFeaturedDevelopments: () => Development[];
  getFeaturedProperties: () => Property[];
  formatPrice: (price: number) => string;
  getStatusColorClass: (statusColor: string | undefined) => string;
}

const PropertyContext = createContext<PropertyContextType>({
  properties: [],
  developments: [],
  getFeaturedDevelopments: () => [],
  getFeaturedProperties: () => [],
  formatPrice: () => '',
  getStatusColorClass: () => 'bg-gray-500'
});

export function usePropertyData() {
  return useContext(PropertyContext);
}

// Types
import { Development as DevelopmentType } from '@/types/developments';

interface Development extends DevelopmentType {
  priority?: number;
}

interface Property {
  id: string;
  developmentId: string;
  developmentName: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  isNew?: boolean;
  isReduced?: boolean;
}

// Enhanced Developments Data
const enhancedDevelopments: Development[] = mockDevelopments.map(dev => ({
  ...dev,
  priority: 
    dev.id === 'fitzgerald-gardens' ? 1 : 
    dev.id === 'ballymakenny-view' ? 2 : 
    dev.id === 'ellwood' ? 3 : 
    undefined
}));

// Mock Properties Data
const mockProperties: Property[] = [
  { id: 'prop-fg-101', developmentId: 'fitzgerald-gardens', developmentName: 'Fitzgerald Gardens', title: '3 Bed Semi-Detached', price: 385000, bedrooms: 3, bathrooms: 3, area: 110, image: '/images/fitzgerald-gardens/hero.jpg', isNew: true },
  { id: 'prop-fg-105', developmentId: 'fitzgerald-gardens', developmentName: 'Fitzgerald Gardens', title: '4 Bed Detached', price: 450000, bedrooms: 4, bathrooms: 4, area: 140, image: '/images/fitzgerald-gardens/hero.jpg' },
  { id: 'prop-bv-201', developmentId: 'ballymakenny-view', developmentName: 'Ballymakenny View', title: '3 Bed Terrace', price: 350000, bedrooms: 3, bathrooms: 2, area: 100, image: '/images/ballymakenny-view/hero.jpg' },
  { id: 'prop-ew-301', developmentId: 'ellwood', developmentName: 'Ellwood', title: '2 Bed Apartment', price: 295000, bedrooms: 2, bathrooms: 2, area: 85, image: '/images/ellwood/hero.jpg', isReduced: true },
  { id: 'prop-bv-302', developmentId: 'ballymakenny-view', developmentName: 'Ballymakenny View', title: '4 Bed Semi-Detached', price: 395000, bedrooms: 4, bathrooms: 3, area: 125, image: '/images/ballymakenny-view/hero.jpg' },
  { id: 'prop-ew-401', developmentId: 'ellwood', developmentName: 'Ellwood', title: '1 Bed Apartment', price: 245000, bedrooms: 1, bathrooms: 1, area: 65, image: '/images/ellwood/hero.jpg', isNew: true }
];

// Platform Stats
const platformStats = [
  { value: '€500M+', label: 'Property Value Transacted', icon: <TrendingUp className="h-8 w-8" /> },
  { value: '10,000+', label: 'Happy Homeowners', icon: <Home className="h-8 w-8" /> },
  { value: '98%', label: 'Customer Satisfaction', icon: <Star className="h-8 w-8" /> },
  { value: '50+', label: 'Active Developments', icon: <Building className="h-8 w-8" /> }
];

// User Testimonials
const testimonials = [
  {
    id: 1,
    name: 'Sarah & James McCarthy',
    role: 'First-time Buyers',
    image: '/images/testimonials/testimonial-1.jpg',
    development: 'Fitzgerald Gardens',
    quote: 'The Prop.ie platform made our first home purchase seamless. The 3D tours and Help-to-Buy integration saved us weeks of time.',
    rating: 5
  },
  {
    id: 2,
    name: 'Michael O\'Brien',
    role: 'Property Investor',
    image: '/images/testimonials/testimonial-2.jpg',
    development: 'Ballymakenny View',
    quote: 'The analytics and ROI projections helped me make informed investment decisions. Best property platform in Ireland.',
    rating: 5
  },
  {
    id: 3,
    name: 'Fitzgerald Developments',
    role: 'Property Developer',
    image: '/images/testimonials/testimonial-3.jpg',
    development: 'Multiple Projects',
    quote: 'Prop.ie transformed our sales process. The lead management and buyer customization tools increased our conversion rate by 40%.',
    rating: 5
  }
];

// Property Provider Component
export function PropertyProvider({ children }: { children: React.ReactNode }) {
  const [properties] = useState<Property[]>(mockProperties);
  const [developments] = useState<Development[]>(enhancedDevelopments);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getStatusColorClass = (statusColor: string | undefined) => {
    if (!statusColor) return 'bg-gray-500';

    if (statusColor.includes('-')) {
      return `bg-${statusColor}`;
    }

    switch (statusColor) {
      case 'green': return 'bg-green-500';
      case 'blue': return 'bg-blue-500';
      case 'yellow': return 'bg-yellow-500';
      case 'purple': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getFeaturedDevelopments = () => {
    return [...developments]
      .sort((ab) => {
        if (a.priority !== undefined && b.priority !== undefined) {
          return a.priority - b.priority;
        }
        if (a.priority !== undefined) return -1;
        if (b.priority !== undefined) return 1;
        return 0;
      })
      .slice(0);
  };

  const getFeaturedProperties = () => {
    const priorityDevelopmentIds = developments
      .filter((dev: Development) => dev.priority !== undefined)
      .sort((ab) => (a.priority || 0) - (b.priority || 0))
      .map((dev: Development) => dev.id);

    return [...properties]
      .sort((ab) => {
        const aIndex = priorityDevelopmentIds.indexOf(a.developmentId);
        const bIndex = priorityDevelopmentIds.indexOf(b.developmentId);

        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        return 0;
      })
      .slice(0);
  };

  return (
    <PropertyContext.Provider 
      value={
        properties,
        developments,
        getFeaturedDevelopments,
        getFeaturedProperties,
        formatPrice,
        getStatusColorClass
      }
    >
      {children}
    </PropertyContext.Provider>
  );
}

// Main HomePage Component
function HomePage() {
  const router = useRouter();
  const [isLoadingsetIsLoading] = useState(true);
  const { 
    getFeaturedDevelopments,
    getFeaturedProperties,
    formatPrice,
    getStatusColorClass
  } = usePropertyData();

  const featuredDevelopments = getFeaturedDevelopments();
  const featuredProperties = getFeaturedProperties();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2B5273]"></div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-10 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-4 sm:mb-6 text-sm">
              <span className="text-blue-100 font-medium text-xs sm:text-sm">AI-Powered Property Matching</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">Find Your Perfect Home</h1>
            <p className="text-base sm:text-lg md:text-xl text-blue-100">Let our AI match you with properties that fit your lifestyle</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Link href="/properties/search">
                <input 
                  type="text" 
                  placeholder="Search properties using AI..." 
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 pl-10 sm:pl-12 pr-20 sm:pr-32 text-sm sm:text-base text-gray-900 bg-white rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400 cursor-pointer" 
                  readOnly
                />
                <svg className="w-4 h-4 sm:w-5 sm:h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
                <div className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">AI Search</span>
                </div>
              </Link>
            </div>
            <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-3 justify-center">
              <button className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-white/20 text-white hover:bg-white/30">Under €300k</button>
              <button className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-white/20 text-white hover:bg-white/30">€300k - €400k</button>
              <button className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-white/20 text-white hover:bg-white/30">€400k - €500k</button>
              <button className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-white/20 text-white hover:bg-white/30">€500k+</button>
            </div>
            <div className="mt-3 sm:mt-4 text-center text-blue-100 text-xs sm:text-sm overflow-x-auto whitespace-nowrap pb-1 hide-scrollbar">
              <span className="mr-1">Popular searches:</span> 
              <a href="/properties/search?beds=3" className="underline mr-1">3-bed houses</a> • 
              <a href="/properties/search?development=fitzgerald-gardens" className="underline mx-1">Fitzgerald Gardens</a> • 
              <a href="/properties/search?type=apartment" className="underline mx-1">Modern apartments</a> • 
              <a href="/properties/search?firstTimeBuyer=true" className="underline ml-1">First-time buyer homes</a>
            </div>
          </div>
          <div className="mt-8 sm:mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 mb-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path d="M8 12l2 2 4-4" strokeWidth="2" /></svg>
              <h3 className="font-bold text-base sm:text-lg">Smart Matching</h3>
              <p className="text-blue-100 text-xs sm:text-sm text-center">AI analyzes your preferences to find perfect matches</p>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 mb-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path d="M12 8v4l3 3" strokeWidth="2" /></svg>
              <h3 className="font-bold text-base sm:text-lg">Personalized Results</h3>
              <p className="text-blue-100 text-xs sm:text-sm text-center">Properties ranked by your specific needs</p>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 mb-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path d="M12 6v6l4 2" strokeWidth="2" /></svg>
              <h3 className="font-bold text-base sm:text-lg">Instant Recommendations</h3>
              <p className="text-blue-100 text-xs sm:text-sm text-center">Get matched with homes in seconds</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Search Bar */}
      <section className="bg-white py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg sm:shadow-2xl p-4 sm:p-6 -mt-16 sm:-mt-20 relative z-20">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Find Your Dream Property</h2>
            <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <select className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5273] transition-all text-sm sm:text-base">
                <option value="">All Locations</option>
                <option value="dublin">Dublin</option>
                <option value="cork">Cork</option>
                <option value="galway">Galway</option>
                <option value="limerick">Limerick</option>
                <option value="waterford">Waterford</option>
                <option value="drogheda">Drogheda</option>
              </select>

              <select className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5273] transition-all text-sm sm:text-base">
                <option value="">Property Type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="duplex">Duplex</option>
                <option value="bungalow">Bungalow</option>
              </select>

              <select className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5273] transition-all text-sm sm:text-base">
                <option value="">Min Bedrooms</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>

              <select className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5273] transition-all text-sm sm:text-base">
                <option value="">Price Range</option>
                <option value="0-250000">Up to €250,000</option>
                <option value="250000-350000">€250,000 - €350,000</option>
                <option value="350000-500000">€350,000 - €500,000</option>
                <option value="500000+">€500,000+</option>
              </select>

              <button
                type="submit"
                className="bg-[#2B5273] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-[#1E3142] transition-all font-medium flex items-center justify-center text-sm sm:text-base"
              >
                Search
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </form>

            {/* Quick Links */}
            <div className="mt-4 sm:mt-6 flex flex-wrap gap-2">
              <span className="text-xs sm:text-sm text-gray-600 mr-1">Popular:</span>
              {['First Time Buyer', 'New Developments', 'Investment Properties', 'Help to Buy'].map((term) => (
                <button
                  key={term}
                  className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm hover:bg-gray-200 transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Developments */}
      <section className="py-10 sm:py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Featured Developments</h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-gray-600">
              Discover Ireland's most sought-after new home developments
            </p>
          </div>

          {/* Development Cards - Horizontal scrolling on mobile */}
          <div className="sm:hidden overflow-x-auto pb-6 -mx-4 px-4 hide-scrollbar">
            <div className="flex space-x-4 w-max">
              {featuredDevelopments.map((development) => (
                <Link
                  key={development.id}
                  href={`/developments/${development.id}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all w-[280px] flex-shrink-0"
                >
                  <div className="relative h-40">
                    <Image
                      src={development.image}
                      alt={development.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {development.status && (
                      <div className={`absolute top-3 left-3 ${getStatusColorClass(development.statusColor)} text-white text-xs px-2 py-0.5 rounded-full uppercase font-semibold`}>
                        {development.status}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{development.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{development.location}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-[#2B5273] font-semibold">{development.priceRange}</p>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#2B5273] transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Development Cards - Grid on tablet and desktop */}
          <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {featuredDevelopments.map((development) => (
              <Link
                key={development.id}
                href={`/developments/${development.id}`}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1"
              >
                <div className="relative h-48 md:h-56">
                  <Image
                    src={development.image}
                    alt={development.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {development.status && (
                    <div className={`absolute top-4 left-4 ${getStatusColorClass(development.statusColor)} text-white text-xs px-3 py-1 rounded-full uppercase font-semibold`}>
                      {development.status}
                    </div>
                  )}
                </div>
                <div className="p-4 sm:p-5 md:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">{development.name}</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{development.location}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-[#2B5273] font-semibold">{development.priceRange}</p>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#2B5273] transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-8 sm:mt-10 md:mt-12">
            <Link
              href="/developments"
              className="inline-flex items-center px-5 sm:px-6 py-2.5 sm:py-3 bg-[#2B5273] text-white rounded-lg hover:bg-[#1E3142] transition-all font-medium text-sm sm:text-base"
            >
              View All Developments
              <ArrowRight className="ml-1.5 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Stats */}
      <section className="py-10 sm:py-12 md:py-16 bg-[#1E3142] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile version - 2x2 grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {platformStats.map((statindex) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/10 rounded-full mb-3 sm:mb-4 text-white">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-xs sm:text-sm md:text-base text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-10 sm:py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Featured Properties</h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-gray-600">
              Hand-picked properties from our premium developments
            </p>
          </div>

          {/* Mobile scrollable row of properties */}
          <div className="sm:hidden overflow-x-auto pb-6 -mx-4 px-4 hide-scrollbar">
            <div className="flex space-x-4 w-max">
              {featuredProperties.map((property) => (
                <div
                  key={property.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all group cursor-pointer w-[280px] flex-shrink-0"
                >
                  <div className="relative h-44">
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {property.isNew && (
                      <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                        New
                      </div>
                    )}
                    {property.isReduced && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                        Price Reduced
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs">
                      <Eye className="h-3 w-3 inline mr-1" />
                      <span>3D Tour</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-[#2B5273] text-xs font-semibold mb-1">{property.developmentName}</div>
                    <h3 className="text-base font-bold text-gray-900 mb-1.5">{property.title}</h3>
                    <div className="flex items-center gap-3 text-gray-600 text-xs mb-3">
                      <span className="flex items-center gap-0.5">
                        <Home className="h-3 w-3" />
                        {property.bedrooms} bed
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Building className="h-3 w-3" />
                        {property.bathrooms} bath
                      </span>
                      <span className="flex items-center gap-0.5">
                        <MapPin className="h-3 w-3" />
                        {property.area} m²
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-[#2B5273]">{formatPrice(property.price)}</p>
                      <Link
                        href={`/properties/${property.id}`}
                        className="px-3 py-1.5 bg-[#2B5273] text-white rounded-lg hover:bg-[#1E3142] transition-all text-xs font-medium"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tablet and desktop grid */}
          <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group cursor-pointer"
              >
                <div className="relative h-52 sm:h-56 md:h-64">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {property.isNew && (
                    <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      New
                    </div>
                  )}
                  {property.isReduced && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Price Reduced
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Eye className="h-4 w-4 inline mr-1" />
                    <span className="text-sm">3D Tour</span>
                  </div>
                </div>
                <div className="p-4 sm:p-5 md:p-6">
                  <div className="text-[#2B5273] text-sm font-semibold mb-1">{property.developmentName}</div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
                  <div className="flex items-center flex-wrap gap-2 sm:gap-4 text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <Home className="h-4 w-4" />
                      {property.bedrooms} bed
                    </span>
                    <span className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      {property.bathrooms} bath
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {property.area} m²
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xl sm:text-2xl font-bold text-[#2B5273]">{formatPrice(property.price)}</p>
                    <Link
                      href={`/properties/${property.id}`}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#2B5273] text-white rounded-lg hover:bg-[#1E3142] transition-all text-xs sm:text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-10 md:mt-12">
            <Link
              href="/properties"
              className="inline-flex items-center px-5 sm:px-6 py-2.5 sm:py-3 border border-[#2B5273] text-[#2B5273] rounded-lg hover:bg-[#2B5273] hover:text-white transition-all font-medium text-sm sm:text-base"
            >
              View All Properties
              <ArrowRight className="ml-1.5 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Success Metrics */}
      <section className="py-10 sm:py-12 md:py-16 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Platform Growth & Success</h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-gray-600">
              Trusted by developers and buyers across Ireland
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-full mb-3 sm:mb-4">
                <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">€127K+</div>
              <div className="text-xs sm:text-sm text-gray-600">Monthly Platform Revenue</div>
              <div className="text-xs text-green-600 mt-1">↗ +23.5% growth</div>
            </div>
            
            <div className="text-center bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-full mb-3 sm:mb-4">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">342</div>
              <div className="text-xs sm:text-sm text-gray-600">Successful Transactions</div>
              <div className="text-xs text-blue-600 mt-1">This month</div>
            </div>
            
            <div className="text-center bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-purple-100 rounded-full mb-3 sm:mb-4">
                <Award className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">€18.7K</div>
              <div className="text-xs sm:text-sm text-gray-600">PROP Choice Revenue</div>
              <div className="text-xs text-purple-600 mt-1">↗ +31.4% growth</div>
            </div>
            
            <div className="text-center bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-orange-100 rounded-full mb-3 sm:mb-4">
                <Building className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">€47.2K</div>
              <div className="text-xs sm:text-sm text-gray-600">Developer Subscriptions</div>
              <div className="text-xs text-orange-600 mt-1">Monthly recurring</div>
            </div>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-8 sm:mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Secure Transactions</h3>
              <p className="text-sm text-gray-600">Bank-level security with encrypted payment processing</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Legal Compliance</h3>
              <p className="text-sm text-gray-600">Full compliance with Irish property regulations</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
              <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Instant Processing</h3>
              <p className="text-sm text-gray-600">Real-time updates and instant transaction confirmations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <EnhancedServicesSection />

      {/* Enhanced Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <section className="py-10 sm:py-12 md:py-16 bg-[#2B5273] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-white/90">
            Join Ireland's fastest-growing property platform today
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#2B5273] rounded-lg hover:bg-gray-100 transition-all font-medium text-base sm:text-lg w-full sm:w-auto"
            >
              Get Started
              <ArrowRight className="ml-1.5 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border border-white text-white rounded-lg hover:bg-white/10 transition-all font-medium text-base sm:text-lg w-full sm:w-auto"
            >
              Contact Sales
              <Phone className="ml-1.5 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>

          {/* Mobile-only additional links */}
          <div className="sm:hidden mt-6 flex flex-col space-y-3">
            <Link href="/resources/calculators/mortgage" className="text-white/80 hover:text-white text-sm underline underline-offset-2">
              Mortgage Calculator
            </Link>
            <Link href="/first-time-buyers" className="text-white/80 hover:text-white text-sm underline underline-offset-2">
              First-Time Buyer Guide
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;