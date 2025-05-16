'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, ChevronRight, Home, Building, TrendingUp, 
  Calculator, Users, FileText, Star, Eye, Shield, Clock,
  CheckCircle, BarChart2, Award, Zap, Globe, Phone, Mail, MapPin
} from 'lucide-react';
import { mockDevelopments } from '@/data/mockDevelopments';
import SolutionsSection from '@/components/home/SolutionsSection';

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
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [developments, setDevelopments] = useState<Development[]>(enhancedDevelopments);

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
      .sort((a, b) => {
        if (a.priority !== undefined && b.priority !== undefined) {
          return a.priority - b.priority;
        }
        if (a.priority !== undefined) return -1;
        if (b.priority !== undefined) return 1;
        return 0;
      })
      .slice(0, 4);
  };
  
  const getFeaturedProperties = () => {
    const priorityDevelopmentIds = developments
      .filter(dev => dev.priority !== undefined)
      .sort((a, b) => (a.priority || 0) - (b.priority || 0))
      .map(dev => dev.id);
    
    return [...properties]
      .sort((a, b) => {
        const aIndex = priorityDevelopmentIds.indexOf(a.developmentId);
        const bIndex = priorityDevelopmentIds.indexOf(b.developmentId);
        
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        return 0;
      })
      .slice(0, 6);
  };

  return (
    <PropertyContext.Provider 
      value={{
        properties,
        developments,
        getFeaturedDevelopments,
        getFeaturedProperties,
        formatPrice,
        getStatusColorClass
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}

// Main HomePage Component
function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
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
      <section className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
              <span className="text-blue-100 font-medium">AI-Powered Property Matching</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Home</h1>
            <p className="text-xl text-blue-100">Let our AI match you with properties that fit your lifestyle and preferences</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <input type="text" placeholder="Search by location, development, or property type..." className="w-full px-6 py-4 pl-12 pr-32 text-gray-900 bg-white rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400" />
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
                Search
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 justify-center">
              <button className="px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white hover:bg-white/30">Under €300k</button>
              <button className="px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white hover:bg-white/30">€300k - €400k</button>
              <button className="px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white hover:bg-white/30">€400k - €500k</button>
              <button className="px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white hover:bg-white/30">€500k+</button>
            </div>
            <div className="mt-4 text-center text-blue-100 text-sm">
              Popular searches: <a href="/properties/search?beds=3" className="underline">3-bed houses</a> • <a href="/properties/search?development=fitzgerald-gardens" className="underline">Fitzgerald Gardens</a> • <a href="/properties/search?type=apartment" className="underline">Modern apartments</a> • <a href="/properties/search?firstTimeBuyer=true" className="underline">First-time buyer homes</a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <svg className="w-10 h-10 mb-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path d="M8 12l2 2 4-4" strokeWidth="2" /></svg>
              <h3 className="font-bold text-lg">Smart Matching</h3>
              <p className="text-blue-100 text-sm text-center">AI analyzes your preferences to find perfect matches</p>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-10 h-10 mb-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path d="M12 8v4l3 3" strokeWidth="2" /></svg>
              <h3 className="font-bold text-lg">Personalized Results</h3>
              <p className="text-blue-100 text-sm text-center">Properties ranked by your specific needs</p>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-10 h-10 mb-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path d="M12 6v6l4 2" strokeWidth="2" /></svg>
              <h3 className="font-bold text-lg">Instant Recommendations</h3>
              <p className="text-blue-100 text-sm text-center">Get matched with homes in seconds</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Search Bar */}
      <section className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-2xl p-6 -mt-20 relative z-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Your Dream Property</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5273] transition-all">
                <option value="">All Locations</option>
                <option value="dublin">Dublin</option>
                <option value="cork">Cork</option>
                <option value="galway">Galway</option>
                <option value="limerick">Limerick</option>
                <option value="waterford">Waterford</option>
                <option value="drogheda">Drogheda</option>
              </select>
              
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5273] transition-all">
                <option value="">Property Type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="duplex">Duplex</option>
                <option value="bungalow">Bungalow</option>
              </select>
              
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5273] transition-all">
                <option value="">Min Bedrooms</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
              
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5273] transition-all">
                <option value="">Price Range</option>
                <option value="0-250000">Up to €250,000</option>
                <option value="250000-350000">€250,000 - €350,000</option>
                <option value="350000-500000">€350,000 - €500,000</option>
                <option value="500000+">€500,000+</option>
              </select>
              
              <button
                type="submit"
                className="bg-[#2B5273] text-white px-6 py-3 rounded-lg hover:bg-[#1E3142] transition-all font-medium flex items-center justify-center"
              >
                Search
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </form>
            
            {/* Quick Links */}
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Popular searches:</span>
              {['First Time Buyer', 'New Developments', 'Investment Properties', 'Help to Buy Scheme'].map((term) => (
                <button
                  key={term}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Developments */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Developments</h2>
            <p className="mt-4 text-xl text-gray-600">
              Discover Ireland's most sought-after new home developments
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredDevelopments.map((development) => (
              <Link
                key={development.id}
                href={`/developments/${development.id}`}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1"
              >
                <div className="relative h-56">
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
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{development.name}</h3>
                  <p className="text-gray-600 mb-4">{development.location}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-[#2B5273] font-semibold">{development.priceRange}</p>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#2B5273] transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/developments"
              className="inline-flex items-center px-6 py-3 bg-[#2B5273] text-white rounded-lg hover:bg-[#1E3142] transition-all font-medium"
            >
              View All Developments
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Stats */}
      <section className="py-16 bg-[#1E3142] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {platformStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4 text-white">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Properties</h2>
            <p className="mt-4 text-xl text-gray-600">
              Hand-picked properties from our premium developments
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group cursor-pointer"
              >
                <div className="relative h-64">
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
                <div className="p-6">
                  <div className="text-[#2B5273] text-sm font-semibold mb-1">{property.developmentName}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
                  <div className="flex items-center gap-4 text-gray-600 mb-4">
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
                    <p className="text-2xl font-bold text-[#2B5273]">{formatPrice(property.price)}</p>
                    <Link
                      href={`/properties/${property.id}`}
                      className="px-4 py-2 bg-[#2B5273] text-white rounded-lg hover:bg-[#1E3142] transition-all text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/properties"
              className="inline-flex items-center px-6 py-3 border border-[#2B5273] text-[#2B5273] rounded-lg hover:bg-[#2B5273] hover:text-white transition-all font-medium"
            >
              View All Properties
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Services</h2>
            <p className="mt-4 text-xl text-gray-600">
              End-to-end solutions for property development and sales
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Building className="h-12 w-12" />,
                title: 'Development Marketing',
                description: 'Premium marketing solutions for new developments with 3D tours and virtual staging'
              },
              {
                icon: <Users className="h-12 w-12" />,
                title: 'Lead Management',
                description: 'Advanced CRM platform for tracking buyer interest and managing sales pipeline'
              },
              {
                icon: <Calculator className="h-12 w-12" />,
                title: 'Financial Tools',
                description: 'Mortgage calculators, Help-to-Buy integration, and affordability assessments'
              },
              {
                icon: <Shield className="h-12 w-12" />,
                title: 'Secure Transactions',
                description: 'Digital document exchange and secure payment processing for property transactions'
              }
            ].map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="text-[#2B5273] mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Our Clients Say</h2>
            <p className="mt-4 text-xl text-gray-600">
              Join thousands of satisfied customers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                <p className="text-sm text-gray-500 mt-4">{testimonial.development}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#2B5273] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join Ireland's fastest-growing property platform today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-4 bg-white text-[#2B5273] rounded-lg hover:bg-gray-100 transition-all font-medium text-lg"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 border border-white text-white rounded-lg hover:bg-white/10 transition-all font-medium text-lg"
            >
              Contact Sales
              <Phone className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;