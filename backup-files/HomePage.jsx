'use client';
import React, { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { mockDevelopments } from '@/data/mockDevelopments'; // Using your existing data file
// Create context with initial default value
const PropertyContext = createContext({
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
// --- Adapting your existing developments data ---
const enhancedDevelopments = mockDevelopments.map(dev => ({
    ...dev,
    // Add priority to specific developments
    priority: dev.id === 'fitzgerald-gardens' ? 1 :
        dev.id === 'ballymakeny-view' ? 2 :
            dev.id === 'riverside-manor' ? 3 :
                undefined
}));
// --- Mock Properties Data ---
const mockProperties = [
    { id: 'prop-fg-101', development: 'Fitzgerald Gardens', title: '3 Bed Semi-Detached', price: 385000, bedrooms: 3, bathrooms: 3, area: 110, image: '/images/fitzgerald-gardens/hero.jpg', isNew: true, isReduced: false },
    { id: 'prop-fg-105', development: 'Fitzgerald Gardens', title: '4 Bed Detached', price: 450000, bedrooms: 4, bathrooms: 4, area: 140, image: '/images/fitzgerald-gardens/hero.jpg', isNew: true, isReduced: false },
    { id: 'prop-rm-203', development: 'Riverside Manor', title: '2 Bed Apartment', price: 295000, bedrooms: 2, bathrooms: 2, area: 85, image: '/images/riverside-manor/hero.jpg', isNew: false, isReduced: true },
    { id: 'prop-bmv-301', development: 'Ballymakenny View', title: '3 Bed Terrace', price: 350000, bedrooms: 3, bathrooms: 2, area: 100, image: '/images/ballymakenny-view/hero.jpg', isNew: false, isReduced: false },
    { id: 'prop-fg-110', development: 'Fitzgerald Gardens', title: '3 Bed Semi-Detached', price: 380000, bedrooms: 3, bathrooms: 3, area: 110, image: '/images/fitzgerald-gardens/hero.jpg', isNew: false, isReduced: true },
    { id: 'prop-rm-208', development: 'Riverside Manor', title: '2 Bed Apartment', price: 300000, bedrooms: 2, bathrooms: 2, area: 85, image: '/images/riverside-manor/hero.jpg', isNew: true, isReduced: false },
];
// --- Testimonials Data ---
const mockTestimonials = [
    {
        id: 'testimonial-1',
        name: 'Emma & John Murphy',
        role: 'First-time Buyers',
        image: '/images/testimonials/testimonial-1.jpg', // You'll need to add this image
        development: 'Fitzgerald Gardens',
        quote: 'We couldn\'t be happier with our new home at Fitzgerald Gardens. The quality of construction and attention to detail exceeded our expectations. The team at Prop.ie made the entire buying process smooth and stress-free.',
        rating: 5
    },
    {
        id: 'testimonial-2',
        name: 'Sarah Collins',
        role: 'Downsizer',
        image: '/images/testimonials/testimonial-2.jpg', // You'll need to add this image
        development: 'Ballymakenny View',
        quote: 'Moving to Ballymakenny View was the best decision we\'ve made. The energy efficiency features have significantly reduced our bills, and the community atmosphere is wonderful. The Prop.ie team was professional and attentive throughout.',
        rating: 5
    },
    {
        id: 'testimonial-3',
        name: 'Michael & Rachel Thompson',
        role: 'Growing Family',
        image: '/images/testimonials/testimonial-3.jpg', // You'll need to add this image
        development: 'Riverside Manor',
        quote: 'Our new home at Riverside Manor has given us the space our growing family needed. The riverside views are breathtaking, and the quality of construction is top-notch. We appreciated the transparency from Prop.ie throughout the process.',
        rating: 4
    },
    {
        id: 'testimonial-4',
        name: 'David O\'Connor',
        role: 'Investor',
        image: '/images/testimonials/testimonial-4.jpg', // You'll need to add this image
        development: 'Fitzgerald Gardens',
        quote: 'As an investor, I\'ve been extremely impressed with the rental returns from my Fitzgerald Gardens property. The development\'s quality and location make it highly attractive to tenants. Prop.ie provided excellent market insights throughout.',
        rating: 5
    }
];
// --- Feature Items Data ---
const featureItems = [
    {
        title: "Energy-Efficient Design",
        description: "A+ BER-rated homes with heat pumps, solar panels, and efficient insulation to reduce energy costs and environmental impact.",
        icon: (<svg className="h-8 w-8 text-[#2B5273]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>)
    },
    {
        title: "Smart Home Integration",
        description: "Pre-wired for smart home technology with options for integrated heating controls, security systems, and lighting automation.",
        icon: (<svg className="h-8 w-8 text-[#2B5273]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
      </svg>)
    },
    {
        title: "Premium Finishes",
        description: "High-quality materials and fixtures throughout, with custom kitchen options and designer bathroom suites as standard.",
        icon: (<svg className="h-8 w-8 text-[#2B5273]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
      </svg>)
    },
    {
        title: "Community Planning",
        description: "Thoughtfully designed neighborhoods with green spaces, playgrounds, and community amenities to enhance quality of life.",
        icon: (<svg className="h-8 w-8 text-[#2B5273]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
      </svg>)
    }
];
// --- News Items Data ---
const newsItems = [
    {
        title: "New Phase Launch at Fitzgerald Gardens Development",
        date: "April 25, 2025",
        excerpt: "We're excited to announce the launch of the next phase at our popular Fitzgerald Gardens development, featuring 25 new units with enhanced sustainability features.",
        image: "/images/fitzgerald-gardens/hero.jpg",
        url: "/news/fitzgerald-phase-2-launch"
    },
    {
        title: "Ballymakenny View Showhouse Opening",
        date: "April 10, 2025",
        excerpt: "Visit our stunning new showhouse at Ballymakenny View, showcasing the latest interior design trends and premium finishes available to buyers.",
        image: "/images/ballymakenny-view/hero.jpg",
        url: "/news/ballymakenny-showhouse-opening"
    },
    {
        title: "Riverside Manor Wins Sustainability Award",
        date: "March 28, 2025",
        excerpt: "Our Riverside Manor development has been recognized with a national award for innovative sustainability features and community planning.",
        image: "/images/riverside-manor/hero.jpg",
        url: "/news/riverside-sustainability-award"
    }
];
// --- About Content ---
const aboutContent = {
    heading: "Building Communities, Not Just Homes",
    description: "At Prop.ie, we believe in creating sustainable, vibrant communities where families can thrive. With over 20 years of experience in property development across Ireland, our team combines architectural excellence with environmental responsibility.",
    stats: [
        { value: "750+", label: "Homes Built" },
        { value: "15+", label: "Developments" },
        { value: "97%", label: "Customer Satisfaction" },
        { value: "20+", label: "Years Experience" }
    ],
    image: "/images/about/team-photo.jpg" // You'll need to add this image
};
// --- Enhanced Components ---
const TestimonialsSection = ({ testimonials }) => (<section aria-labelledby="testimonials-heading" className="py-16 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 id="testimonials-heading" className="text-3xl font-bold text-gray-900">What Our Customers Say</h2>
        <p className="mt-4 text-xl text-gray-600">
          Hear from the families who have made our developments their home
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {testimonials.map((testimonial) => (<div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4 bg-gray-100">
                {/* Fallback to initials if image doesn't exist */}
                <div className="absolute inset-0 flex items-center justify-center text-[#2B5273] font-bold">
                  {testimonial.name.split(' ')[0][0]}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                <p className="text-sm text-gray-600">{testimonial.role} • {testimonial.development}</p>
              </div>
            </div>
            
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (<svg key={i} className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>))}
            </div>
            
            <p className="text-gray-700 italic">"{testimonial.quote}"</p>
          </div>))}
      </div>
    </div>
  </section>);
const AboutSection = () => (<section aria-labelledby="about-us-heading" className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:space-x-12">
        <div className="md:w-1/2">
          <h2 id="about-us-heading" className="text-3xl font-bold text-gray-900">{aboutContent.heading}</h2>
          <p className="mt-4 text-lg text-gray-600">{aboutContent.description}</p>
          
          <div className="mt-8 grid grid-cols-2 gap-6">
            {aboutContent.stats.map((stat, index) => (<div key={index} className="border border-[#2B5273]/20 rounded-lg p-4 text-center bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                <p className="text-3xl font-bold text-[#2B5273]">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>))}
          </div>
          
          <div className="mt-8">
            <Link href="/about" className="inline-flex items-center px-4 py-2 border border-[#2B5273] text-[#2B5273] rounded-md hover:bg-[#2B5273] hover:text-white transition-colors">
              Learn More About Us
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </Link>
          </div>
        </div>
        
        <div className="mt-8 md:mt-0 md:w-1/2">
          <div className="relative h-80 md:h-96 rounded-lg overflow-hidden shadow-lg bg-gray-200">
            {/* Placeholder with gradient if image doesn't exist */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1E3142] to-[#2B5273]/60 flex items-center justify-center">
              <span className="text-white text-lg font-medium">The Prop.ie Team</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>);
const FeaturesSection = () => (<section aria-labelledby="features-heading" className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 id="features-heading" className="text-3xl font-bold text-gray-900">Superior Quality & Design</h2>
        <p className="mt-4 text-xl text-gray-600">
          Our homes are built to exceptional standards with these key features
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {featureItems.map((feature, index) => (<div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            <div className="flex justify-center mb-4">
              <div className="p-2 bg-[#2B5273]/10 rounded-full">
                {feature.icon}
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-center">{feature.description}</p>
          </div>))}
      </div>
    </div>
  </section>);
const NewsSection = () => (<section aria-labelledby="news-heading" className="py-16 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 id="news-heading" className="text-3xl font-bold text-gray-900">Latest News & Updates</h2>
        <p className="mt-4 text-xl text-gray-600">
          Stay up to date with our newest developments and announcements
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {newsItems.map((item, index) => (<Link key={index} href={item.url} className="block group">
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48 bg-gray-200">
                <Image src={item.image} alt={item.title} fill style={{ objectFit: 'cover' }} className="group-hover:scale-105 transition-transform duration-300"/>
              </div>
              <div className="p-6">
                <p className="text-sm text-[#2B5273] mb-2">{item.date}</p>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#2B5273] transition-colors">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.excerpt}</p>
                <p className="text-[#2B5273] font-medium group-hover:underline flex items-center">
                  Read More 
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                </p>
              </div>
            </div>
          </Link>))}
      </div>
      
      <div className="mt-8 text-center">
        <Link href="/news" className="inline-flex items-center px-4 py-2 border border-[#2B5273] text-[#2B5273] rounded-md hover:bg-[#2B5273] hover:text-white transition-colors">
          View All News
          <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
          </svg>
        </Link>
      </div>
    </div>
  </section>);
// Property Provider Component
export function PropertyProvider({ children }) {
    const [properties, setProperties] = useState(mockProperties);
    const [developments, setDevelopments] = useState(enhancedDevelopments);
    // Helper Functions
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IE', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0
        }).format(price);
    };
    const getStatusColorClass = (statusColor) => {
        // Adapt to your statusColor format
        if (!statusColor)
            return 'bg-gray-500';
        // Handle colors that include the full class name (like 'green-500')
        if (statusColor.includes('-')) {
            return `bg-${statusColor}`;
        }
        // Handle colors that are just the base color name
        switch (statusColor) {
            case 'green': return 'bg-green-500';
            case 'blue': return 'bg-blue-500';
            case 'yellow': return 'bg-yellow-500';
            case 'gray': return 'bg-gray-500';
            case 'purple': return 'bg-purple-500';
            default: return 'bg-gray-500'; // Default color
        }
    };
    // Get featured developments with priority sorting
    const getFeaturedDevelopments = () => {
        return [...developments]
            .sort((a, b) => {
            // Sort by priority (if defined)
            if (a.priority !== undefined && b.priority !== undefined) {
                return a.priority - b.priority;
            }
            // Items with priority come before items without
            if (a.priority !== undefined)
                return -1;
            if (b.priority !== undefined)
                return 1;
            return 0;
        })
            .slice(0, 4);
    };
    // Get featured properties with prioritized developments
    const getFeaturedProperties = () => {
        // First get properties from prioritized developments
        const priorityDevelopmentNames = developments
            .filter(dev => dev.priority !== undefined)
            .sort((a, b) => (a.priority || 0) - (b.priority || 0))
            .map(dev => dev.name);
        // Sort properties to prioritize those from prioritized developments
        return [...properties]
            .sort((a, b) => {
            const aIndex = priorityDevelopmentNames.indexOf(a.development);
            const bIndex = priorityDevelopmentNames.indexOf(b.development);
            if (aIndex !== -1 && bIndex !== -1)
                return aIndex - bIndex;
            if (aIndex !== -1)
                return -1;
            if (bIndex !== -1)
                return 1;
            return 0;
        })
            .slice(0, 6);
    };
    // In a real app, fetch data from API here
    useEffect(() => {
        // Future API implementation can go here
    }, []);
    return (<PropertyContext.Provider value={{
            properties,
            developments,
            getFeaturedDevelopments,
            getFeaturedProperties,
            formatPrice,
            getStatusColorClass
        }}>
      {children}
    </PropertyContext.Provider>);
}
// Main Component
function HomePage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('buyers');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { getFeaturedDevelopments, getFeaturedProperties, formatPrice, getStatusColorClass } = usePropertyData();
    const featuredDevelopments = getFeaturedDevelopments();
    const featuredProperties = getFeaturedProperties();
    // Simulate loading state for better UX
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500); // Simulate a small loading time
        return () => clearTimeout(timer);
    }, []);
    if (isLoading) {
        return (<div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2B5273]"></div>
      </div>);
    }
    return (<div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <div className="relative bg-gray-900 h-[80vh] flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image src="/images/fitzgerald-gardens/hero.jpg" // Using your existing hero image
     alt="Property Background" fill sizes="100vw" quality={85} style={{ objectFit: 'cover' }} priority/>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E3142]/80 to-[#2B5273]/60"></div>

        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 z-20" aria-label="Main Navigation">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Link href="/" className="text-white font-bold text-2xl" aria-label="Prop.ie Home">Prop.ie</Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/properties" className="text-white hover:text-gray-200 transition-colors">Properties</Link>
                <Link href="/developments" className="text-white hover:text-gray-200 transition-colors">Developments</Link>
                <Link href="/about" className="text-white hover:text-gray-200 transition-colors">About Us</Link>
                <Link href="/contact" className="text-white hover:text-gray-200 transition-colors">Contact</Link>
                <Link href="/login" className="text-white hover:text-gray-200 transition-colors">Login</Link>
                <Link href="/register" className="bg-white text-[#2B5273] px-4 py-2 rounded-md hover:bg-gray-100 transition-colors">
                  Register
                </Link>
              </div>

              {/* Mobile Navigation Button */}
              <div className="md:hidden">
                <button type="button" className="text-white" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-expanded={isMenuOpen} aria-controls="mobile-menu" aria-label="Toggle navigation menu">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (<div id="mobile-menu" className="md:hidden bg-white shadow-lg absolute top-full inset-x-0 z-20">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link href="/properties" className="block px-3 py-2 text-gray-900 hover:bg-gray-100 rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Properties
                </Link>
                <Link href="/developments" className="block px-3 py-2 text-gray-900 hover:bg-gray-100 rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Developments
                </Link>
                <Link href="/about" className="block px-3 py-2 text-gray-900 hover:bg-gray-100 rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>
                  About Us
                </Link>
                <Link href="/contact" className="block px-3 py-2 text-gray-900 hover:bg-gray-100 rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Contact
                </Link>
                <Link href="/login" className="block px-3 py-2 text-gray-900 hover:bg-gray-100 rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="block px-3 py-2 bg-[#2B5273] text-white rounded-md transition-colors text-center" onClick={() => setIsMenuOpen(false)}>
                  Register
                </Link>
              </div>
            </div>)}
        </nav>

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
              <button onClick={() => router.push('/developments')} className="bg-white text-[#2B5273] px-6 py-3 rounded-md hover:bg-gray-100 transition-colors text-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transform hover:scale-105 active:scale-95 duration-200">
                Explore Developments
              </button>
              <button onClick={() => router.push('/register')} className="bg-[#2B5273] text-white px-6 py-3 rounded-md hover:bg-[#1E3142] transition-colors text-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273] transform hover:scale-105 active:scale-95 duration-200">
                Register Interest
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <section aria-labelledby="search-heading" className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-xl p-6 -mt-20 md:-mt-24 relative z-10 transition-all duration-300 hover:shadow-2xl">
            <h2 id="search-heading" className="text-2xl font-bold text-gray-900 mb-6">Find Your New Home</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <select id="location" name="location" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2B5273] focus:border-[#2B5273] transition-all duration-200">
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
                <select id="bedrooms" name="bedrooms" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2B5273] focus:border-[#2B5273] transition-all duration-200">
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
                <select id="priceRange" name="priceRange" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2B5273] focus:border-[#2B5273] transition-all duration-200">
                  <option value="">Any</option>
                  <option value="0-300000">Up to €300,000</option>
                  <option value="300000-400000">€300,000 - €400,000</option>
                  <option value="400000-500000">€400,000 - €500,000</option>
                  <option value="500000+">€500,000+</option>
                </select>
              </div>

              <div className="flex items-end">
                <button type="submit" className="w-full bg-[#2B5273] text-white px-4 py-2 rounded-md hover:bg-[#1E3142] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273] flex items-center justify-center transform hover:scale-105 active:scale-95 duration-200" aria-label="Search properties">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
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
            {featuredDevelopments.map((development) => (<Link key={development.id} href={`/developments/${development.id}`} className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1">
                <div className="relative h-48 sm:h-56">
                  <Image src={development.image} alt={development.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" style={{ objectFit: 'cover' }} className="rounded-t-lg group-hover:scale-105 transition-transform duration-300"/>
                  {development.status && (<div className={`absolute top-4 left-4 ${getStatusColorClass(development.statusColor)} text-white text-xs px-3 py-1 rounded-md uppercase font-semibold`}>
                      {development.status}
                    </div>)}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{development.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{development.description} • {development.location}</p>
                  <div className="text-[#2B5273] font-medium group-hover:underline transition-colors">View Development →</div>
                </div>
              </Link>))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/developments" className="inline-flex items-center px-6 py-3 border border-[#2B5273] text-[#2B5273] rounded-md hover:bg-[#2B5273] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273] transform hover:scale-105 active:scale-95 duration-200">
              View All Developments
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
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
            {featuredProperties.map((property) => (<div key={property.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative h-56">
                  <Image src={property.image} alt={property.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" style={{ objectFit: 'cover' }} className="rounded-t-lg transition-transform duration-300 hover:scale-105"/>
                  {property.isNew && (<div className="absolute top-4 left-4 bg-[#2B5273] text-white px-3 py-1 rounded-md text-sm font-medium">
                      New
                    </div>)}
                  {property.isReduced && (<div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium">
                      Price Reduced
                    </div>)}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-sm text-[#2B5273] font-medium">{property.development}</span>
                      <h3 className="text-xl font-bold text-gray-900 mt-1">{property.title}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#2B5273]">{formatPrice(property.price)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-gray-600 text-sm">
                    <div className="flex space-x-4">
                      <div className="flex items-center">
                        {/* Bed Icon */}
                        <svg className="h-5 w-5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                        </svg>
                        <span>{property.bedrooms} bed</span>
                      </div>
                      <div className="flex items-center">
                        {/* Bath Icon */}
                        <svg className="h-5 w-5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        <span>{property.bathrooms} bath</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {/* Area Icon (House) */}
                      <svg className="h-5 w-5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                      </svg>
                      <span>{property.area} m²</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link href={`/properties/${property.id}`} className="block w-full bg-[#2B5273] text-white text-center px-4 py-2 rounded-md hover:bg-[#1E3142] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273] transform hover:scale-105 active:scale-95 duration-200" aria-label={`View details for ${property.title} in ${property.development}`}>
                      View Details
                    </Link>
                  </div>
                </div>
              </div>))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/properties" className="inline-flex items-center px-6 py-3 border border-[#2B5273] text-[#2B5273] rounded-md hover:bg-[#2B5273] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273] transform hover:scale-105 active:scale-95 duration-200">
              View All Properties
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <AboutSection />

      {/* Testimonials Section */}
      <TestimonialsSection testimonials={mockTestimonials}/>

      {/* Features Section */}
      <FeaturesSection />

      {/* User Type Tabs Section */}
      <section aria-labelledby="user-types-heading" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="user-types-heading" className="text-3xl font-bold text-gray-900">How Prop.ie Works For You</h2>
            <p className="mt-4 text-xl text-gray-600">
              Tailored solutions for every stakeholder in the property journey
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8 overflow-x-auto">
            <div className="border border-gray-200 rounded-lg flex flex-wrap md:flex-nowrap">
              <button className={`px-4 sm:px-6 py-3 text-base sm:text-lg font-medium ${activeTab === 'buyers'
            ? 'bg-[#2B5273] text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'} rounded-l-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273] whitespace-nowrap`} onClick={() => setActiveTab('buyers')} aria-pressed={activeTab === 'buyers'} aria-label="Show information for buyers">
                For Buyers
              </button>
              <button className={`px-4 sm:px-6 py-3 text-base sm:text-lg font-medium ${activeTab === 'investors'
            ? 'bg-[#2B5273] text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'} transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273] whitespace-nowrap`} onClick={() => setActiveTab('investors')} aria-pressed={activeTab === 'investors'} aria-label="Show information for investors">
                For Investors
              </button>
              <button className={`px-4 sm:px-6 py-3 text-base sm:text-lg font-medium ${activeTab === 'developers'
            ? 'bg-[#2B5273] text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'} transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273] whitespace-nowrap`} onClick={() => setActiveTab('developers')} aria-pressed={activeTab === 'developers'} aria-label="Show information for developers">
                For Developers
              </button>
              <button className={`px-4 sm:px-6 py-3 text-base sm:text-lg font-medium ${activeTab === 'agents'
            ? 'bg-[#2B5273] text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'} transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273] whitespace-nowrap`} onClick={() => setActiveTab('agents')} aria-pressed={activeTab === 'agents'} aria-label="Show information for agents">
                For Agents
              </button>
              <button className={`px-4 sm:px-6 py-3 text-base sm:text-lg font-medium ${activeTab === 'solicitors'
            ? 'bg-[#2B5273] text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'} rounded-r-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273] whitespace-nowrap`} onClick={() => setActiveTab('solicitors')} aria-pressed={activeTab === 'solicitors'} aria-label="Show information for solicitors">
                For Solicitors
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
            {activeTab === 'buyers' && (<div className="md:flex">
                <div className="md:flex-shrink-0 relative h-64 md:h-auto md:w-1/2 bg-gray-100 flex items-center justify-center p-4">
                  {/* Placeholder for buyer illustration */}
                  <div className="text-[#2B5273] text-lg font-medium">
                    Buyer Illustration
                  </div>
                </div>
                <div className="p-8 md:w-1/2">
                  <div className="uppercase tracking-wide text-sm text-[#2B5273] font-semibold">For Home Buyers</div>
                  <h3 className="mt-1 text-2xl font-semibold text-gray-900">Find Your Dream Home</h3>
                  <p className="mt-4 text-gray-600">
                    Prop.ie makes buying your new home easier than ever:
                  </p>
                  <ul className="mt-4 space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>Browse detailed property listings with interactive site maps</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>Customize your interior finishes before construction is complete</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>Integrated Help-to-Buy application and tracking</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>Secure document management for all your purchase paperwork</span>
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Link href="/buyer/register" className="inline-flex items-center px-4 py-2 bg-[#2B5273] text-white rounded-md hover:bg-[#1E3142] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273] transform hover:scale-105 active:scale-95 duration-200">
                      Register as a Buyer
                      <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>)}

            {activeTab === 'investors' && (<div className="md:flex">
                <div className="md:flex-shrink-0 relative h-64 md:h-auto md:w-1/2 bg-gray-100 flex items-center justify-center p-4">
                  {/* Placeholder for investor illustration */}
                  <div className="text-[#2B5273] text-lg font-medium">
                    Investor Illustration
                  </div>
                </div>
                <div className="p-8 md:w-1/2">
                  <div className="uppercase tracking-wide text-sm text-[#2B5273] font-semibold">For Investors</div>
                  <h3 className="mt-1 text-2xl font-semibold text-gray-900">Maximize Your Investment</h3>
                  <p className="mt-4 text-gray-600">
                    Prop.ie helps property investors make informed decisions:
                  </p>
                  <ul className="mt-4 space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>Access detailed ROI analysis and rental yield projections</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>Priority access to new development launches and investment opportunities</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>Portfolio management tools and market performance tracking</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>Streamlined services for multiple property purchases and management</span>
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Link href="/investor/register" className="inline-flex items-center px-4 py-2 bg-[#2B5273] text-white rounded-md hover:bg-[#1E3142] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273] transform hover:scale-105 active:scale-95 duration-200">
                      Register as an Investor
                      <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>)}

            {activeTab === 'developers' && (<div className="md:flex">
                <div className="md:flex-shrink-0 relative h-64 md:h-auto md:w-1/2 bg-gray-100 flex items-center justify-center p-4">
                  {/* Placeholder for developer illustration */}
                  <div className="text-[#2B5273] text-lg font-medium">
                    Developer Illustration
                  </div>
                </div>
                <div className="p-8 md:w-1/2">
                  <div className="uppercase tracking-wide text-sm text-[#2B5273] font-semibold">For Developers</div>
                  <h3 className="mt-1 text-2xl font-semibold text-gray-900">Showcase Your Developments</h3>
                  <p className="mt-4 text-gray-600">
                    Prop.ie offers powerful tools for property developers:
                  </p>
                  <ul className="mt-4 space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>Premium promotion of your developments to qualified buyers</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>Comprehensive sales dashboard with real-time analytics</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>Integrated customer relationship management system</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>Digital marketing and visualization tools for development projects</span>
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Link href="/developer/register" className="inline-flex items-center px-4 py-2 bg-[#2B5273] text-white rounded-md hover:bg-[#1E3142] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273] transform hover:scale-105 active:scale-95 duration-200">
                      Partner with Us
                      <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>)}

            {activeTab === 'agents' && (<div className="md:flex">
                <div className="md:flex-shrink-0 relative h-64 md:h-auto md:w-1/2 bg-gray-100 flex items-center justify-center p-4">
                  {/* Placeholder for agent illustration */}
                  <div className="text-[#2B5273] text-lg font-medium">
                    Agent Illustration
                  </div>
                </div>
                <div className="p-8 md:w-1/2">
                  <div className="uppercase tracking-wide text-sm text-[#2B5273] font-semibold">For Agents</div>
                  <h3 className="mt-1 text-2xl font-semibold text-gray-900">Streamline Your Services</h3>
                  <p className="mt-4 text-gray-600">
                    Prop.ie empowers estate agents with advanced tools:
                  </p>
                  <ul className="mt-4 space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>Access to a curated network of qualified buyers and investors</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>Digital tools for virtual viewings and property presentations</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>Commission tracking and performance analytics dashboard</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>Automated client communications and document processing</span>
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Link href="/agent/register" className="inline-flex items-center px-4 py-2 bg-[#2B5273] text-white rounded-md hover:bg-[#1E3142] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273] transform hover:scale-105 active:scale-95 duration-200">
                      Join Our Agent Network
                      <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>)}

            {activeTab === 'solicitors' && (<div className="md:flex">
                <div className="md:flex-shrink-0 relative h-64 md:h-auto md:w-1/2 bg-gray-100 flex items-center justify-center p-4">
                  {/* Placeholder for solicitor illustration */}
                  <div className="text-[#2B5273] text-lg font-medium">
                    Solicitor Illustration
                  </div>
                </div>
                <div className="p-8 md:w-1/2">
                  <div className="uppercase tracking-wide text-sm text-[#2B5273] font-semibold">For Solicitors</div>
                  <h3 className="mt-1 text-2xl font-semibold text-gray-900">Efficient Conveyancing</h3>
                  <p className="mt-4 text-gray-600">
                    Prop.ie provides legal professionals with streamlined processes:
                  </p>
                  <ul className="mt-4 space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>Secure digital document exchange with clients and agents</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>Standardized templates for new development purchases</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>Real-time transaction status tracking and updates</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>Referral network for new property clients and developers</span>
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Link href="/solicitor/register" className="inline-flex items-center px-4 py-2 bg-[#2B5273] text-white rounded-md hover:bg-[#1E3142] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273] transform hover:scale-105 active:scale-95 duration-200">
                      Join Our Legal Network
                      <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* News Section */}
      <NewsSection />
    </div>);
}
export default HomePage;
