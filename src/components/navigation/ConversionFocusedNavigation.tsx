"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, ChevronDown, Menu, X, User, Home, ArrowRight, Heart,
  MapPin, BedDouble, Eye, Calendar, Phone, Calculator
} from 'lucide-react';
import ProfessionalBanner from './ProfessionalBanner';
import { useUserRole } from '@/context/UserRoleContext';
import NotificationCenter from '@/components/ui/NotificationCenter';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTransaction } from '@/contexts/TransactionContext';

interface ConversionFocusedNavigationProps {
  theme?: 'light' | 'dark';
  isTransparent?: boolean;
}

interface Development {
  id: string;
  name: string;
  location: string;
  units: number;
  priceFrom: string;
  image: string;
  status: 'On Sale' | 'Sold Out' | 'Coming Soon';
  tag?: string;
  beds: string;
  completion: string;
}

export const ConversionFocusedNavigation: React.FC<ConversionFocusedNavigationProps> = ({ 
  theme = 'light', 
  isTransparent = false 
}) => {
  const [mobileMenuOpensetMobileMenuOpen] = useState(false);
  const [searchOpensetSearchOpen] = useState(false);
  const [searchQuerysetSearchQuery] = useState('');
  const { role, setRole } = useUserRole();
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, signOut } = useAuth();
  const { transactions, getTransactionCount } = useTransaction();

  const [activeDropdownsetActiveDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [scrolledsetScrolled] = useState(false);

  // Developments data
  const developments: Development[] = [
    {
      id: 'ballymakenny-view',
      name: 'Ballymakenny View',
      location: 'Drogheda, Ireland',
      units: 3,
      priceFrom: '€375,000',
      image: '/images/developments/ballymakenny-view.jpg',
      status: 'On Sale',
      tag: 'Limited Units',
      beds: '3-4 Bed Homes',
      completion: 'Q2 2024'
    },
    {
      id: 'ellwood',
      name: 'Ellwood',
      location: 'Drogheda, Ireland',
      units: 2,
      priceFrom: '€425,000',
      image: '/images/developments/ellwood.jpg',
      status: 'On Sale',
      tag: 'Almost Sold Out',
      beds: '2-3 Bed Homes',
      completion: 'Q1 2025'
    },
    {
      id: 'fitzgerald-gardens',
      name: 'Fitzgerald Gardens',
      location: 'Drogheda, Ireland',
      units: 23,
      priceFrom: '€395,000',
      image: '/images/developments/fitzgerald-gardens.jpg',
      status: 'On Sale',
      tag: 'Newly Released',
      beds: '2-4 Bed Homes',
      completion: 'Q4 2024'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY> 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const navClasses = `fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
    scrolled 
      ? 'bg-white shadow-md backdrop-blur-sm bg-white/95'
      : isTransparent
        ? 'bg-transparent' 
        : 'bg-white shadow-sm'
  }`;

  const textColorClass = 
    scrolled 
      ? 'text-gray-800'
      : (isTransparent && theme === 'dark') 
        ? 'text-white' 
        : 'text-gray-800';

  const handleDropdownEnter = (dropdown: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveDropdown(dropdown);
  };

  const handleDropdownLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 100);
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const getDashboardRoute = () => {
    const userRole = user?.role || role;
    switch (userRole) {
      case 'AGENT': return '/agents';
      case 'SOLICITOR': return '/solicitor';
      case 'DEVELOPER': return '/developer';
      case 'ADMIN': return '/admin';
      case 'BUYER': return '/buyer';
      default: return '/dashboard';
    }
  };

  return (
    <>
      <ProfessionalBanner />
      <nav className={navClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="transition-opacity duration-300 hover:opacity-80">
                <div className="relative h-10 w-32">
                  {/* White logo for dark/transparent backgrounds */}
                  <Image 
                    src="/images/Prop Branding/Prop Master_Logo- White.png" 
                    alt="Prop.ie" 
                    fill
                    className={`object-contain transition-opacity duration-300 ${
                      scrolled || (isTransparent && theme !== 'dark') 
                        ? 'opacity-0' 
                        : 'opacity-100'
                    }`}
                  />
                  {/* Black logo for white/scrolled backgrounds */}
                  <Image 
                    src="/images/Prop Branding/Prop Master_Logo- White.png" 
                    alt="Prop.ie" 
                    fill
                    className={`object-contain transition-opacity duration-300 ${
                      scrolled || (isTransparent && theme !== 'dark') 
                        ? 'opacity-100' 
                        : 'opacity-0'
                    }`}
                  />
                </div>
              </Link>

              <div className="hidden lg:ml-8 lg:flex lg:space-x-6">
                {/* Main consumer-focused navigation */}

                {/* Developments - Primary Focus */}
                <div 
                  className="relative" 
                  onMouseEnter={() => handleDropdownEnter('developments')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${textColorClass} hover:bg-gray-100 transition-all`}
                  >
                    Our Developments
                    <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${activeDropdown === 'developments' ? 'rotate-180' : ''}`} />
                  </button>

                  <div className={`absolute z-10 mt-2 w-screen max-w-4xl rounded-xl shadow-xl bg-white left-1/2 transform -translate-x-1/2 transition-all duration-200 ${
                    activeDropdown === 'developments' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[-10px] pointer-events-none'
                  }`}>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {developments.map((dev: any) => (
                          <Link
                            key={dev.id}
                            href={`/developments/${dev.id}`}
                            className="group hover:bg-gray-50 rounded-lg p-4 transition-all"
                          >
                            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4">
                              <Image
                                src={dev.image}
                                alt={dev.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              {dev.tag && (
                                <div className="absolute top-2 right-2">
                                  <span className="px-3 py-1 bg-red-500 text-white text-xs rounded-full">
                                    {dev.tag}
                                  </span>
                                </div>
                              )}
                            </div>
                            <h3 className="font-semibold text-lg mb-1">{dev.name}</h3>
                            <p className="text-sm text-gray-600 mb-2 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {dev.location}
                            </p>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-600">{dev.beds}</span>
                              <span className="text-sm font-medium">From {dev.priceFrom}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">{dev.units} units available</span>
                              <ArrowRight className="h-4 w-4 text-[#2B5273] group-hover:translate-x-1 transition-transform" />
                            </div>
                          </Link>
                        ))}
                      </div>

                      {/* Quick Actions */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="grid grid-cols-3 gap-4">
                          <Link
                            href="/virtual-tour"
                            className="flex items-center justify-center px-4 py-2 bg-[#2B5273] text-white rounded-lg hover:bg-[#1E3142] transition-colors"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Virtual Tours
                          </Link>
                          <Link
                            href="/book-viewing"
                            className="flex items-center justify-center px-4 py-2 border border-[#2B5273] text-[#2B5273] rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            Book Viewing
                          </Link>
                          <Link
                            href="/price-list"
                            className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <Calculator className="h-4 w-4 mr-2" />
                            Price List
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Properties Search */}
                <Link 
                  href="/properties" 
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${textColorClass} hover:bg-gray-100 transition-all`}
                >
                  Find Your Home
                </Link>

                {/* Buyer Resources */}
                <div 
                  className="relative" 
                  onMouseEnter={() => handleDropdownEnter('buyer-journey')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${textColorClass} hover:bg-gray-100 transition-all`}
                  >
                    Buyer Journey
                    <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${activeDropdown === 'buyer-journey' ? 'rotate-180' : ''}`} />
                  </button>

                  <div className={`absolute z-10 mt-2 w-96 rounded-xl shadow-xl bg-white right-0 transition-all duration-200 ${
                    activeDropdown === 'buyer-journey' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[-10px] pointer-events-none'
                  }`}>
                    <div className="p-6">
                      <div className="space-y-4">
                        <Link href="/how-it-works" className="flex items-center p-3 rounded-lg hover:bg-gray-50">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                            <Home className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">How It Works</p>
                            <p className="text-sm text-gray-600">Our simple 5-step buying process</p>
                          </div>
                        </Link>

                        <Link href="/help-to-buy" className="flex items-center p-3 rounded-lg hover:bg-gray-50">
                          <div className="h-10 w-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mr-3">
                            <Heart className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">Help to Buy</p>
                            <p className="text-sm text-gray-600">Government schemes & assistance</p>
                          </div>
                        </Link>

                        <Link href="/mortgage-calculator" className="flex items-center p-3 rounded-lg hover:bg-gray-50">
                          <div className="h-10 w-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
                            <Calculator className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">Mortgage Calculator</p>
                            <p className="text-sm text-gray-600">Calculate your monthly payments</p>
                          </div>
                        </Link>

                        <Link href="/buyer-guide" className="flex items-center p-3 rounded-lg hover:bg-gray-50">
                          <div className="h-10 w-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mr-3">
                            <BedDouble className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">First-Time Buyer Guide</p>
                            <p className="text-sm text-gray-600">Everything you need to know</p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* About Us */}
                <Link 
                  href="/about" 
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${textColorClass} hover:bg-gray-100 transition-all`}
                >
                  About Us
                </Link>

                {/* Contact */}
                <Link 
                  href="/contact" 
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${textColorClass} hover:bg-gray-100 transition-all`}
                >
                  Contact
                </Link>

                {/* Dashboard link for logged-in users */}
                {isAuthenticated && (
                  <Link 
                    href={getDashboardRoute()} 
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${textColorClass} hover:bg-gray-100 transition-all`}
                  >
                    Dashboard
                    {getTransactionCount() > 0 && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full">
                        {getTransactionCount()}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            </div>

            <div className="hidden md:flex md:items-center md:space-x-4">
              {/* Call to Action */}
              <Link
                href="/book-viewing"
                className="px-4 py-2 bg-[#2B5273] text-white rounded-md font-medium hover:bg-[#1E3142] transition-colors flex items-center"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Book a Viewing
              </Link>

              {/* Phone */}
              <a
                href="tel:+353123456789"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${textColorClass} hover:bg-gray-100 transition-all`}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Us
              </a>

              {/* Search */}
              <button 
                onClick={() => setSearchOpen(true)}
                className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${textColorClass}`}
              >
                <Search className="h-5 w-5" />
              </button>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <div className="flex flex-col mr-2 items-end">
                      <span className={`text-sm font-medium ${textColorClass}`}>{user?.name || user?.email}</span>
                      <span className={`text-xs opacity-75 capitalize ${textColorClass}`}>{user?.role || 'User'}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${textColorClass}`}
                    >
                      <User className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-x-2">
                  <Link
                    href="/login"
                    className={`px-4 py-2 rounded-md font-medium transition-all border border-gray-300 ${textColorClass} hover:bg-gray-50`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 rounded-md font-medium transition-all bg-green-500 text-white hover:bg-green-600"
                  >
                    Register Interest
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                className={`ml-2 inline-flex items-center justify-center p-2 rounded-md ${textColorClass}`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden bg-white shadow-lg transition-all duration-300 ${
          mobileMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="pt-2 pb-3 space-y-1 overflow-y-auto">
            <MobileNavSection title="Our Developments">
              {developments.map((dev: any) => (
                <MobileNavLink key={dev.id} href={`/developments/${dev.id}`}>
                  <div className="flex items-center justify-between">
                    <span>{dev.name}</span>
                    <span className="text-xs text-gray-500">{dev.status}</span>
                  </div>
                </MobileNavLink>
              ))}
            </MobileNavSection>

            <MobileNavLink href="/properties">Find Your Home</MobileNavLink>

            <MobileNavSection title="Buyer Journey">
              <MobileNavLink href="/how-it-works">How It Works</MobileNavLink>
              <MobileNavLink href="/help-to-buy">Help to Buy</MobileNavLink>
              <MobileNavLink href="/mortgage-calculator">Mortgage Calculator</MobileNavLink>
              <MobileNavLink href="/buyer-guide">First-Time Buyer Guide</MobileNavLink>
            </MobileNavSection>

            <MobileNavLink href="/about">About Us</MobileNavLink>
            <MobileNavLink href="/contact">Contact</MobileNavLink>

            {/* Mobile CTAs */}
            <div className="px-4 py-3 space-y-2">
              <Link
                href="/book-viewing"
                className="w-full px-4 py-2 bg-[#2B5273] text-white rounded-md font-medium text-center block"
              >
                Book a Viewing
              </Link>
              <a
                href="tel:+353123456789"
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium text-center block"
              >
                Call Us Now
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      <div className={`fixed inset-0 bg-black z-50 flex items-start justify-center transition-opacity duration-300 ${
        searchOpen ? 'bg-opacity-50 opacity-100' : 'bg-opacity-0 opacity-0 pointer-events-none'
      }`} onClick={() => setSearchOpen(false)}>
        <div className="bg-white w-full max-w-3xl mt-20 rounded-lg shadow-xl overflow-hidden" onClick={(e: any) => e.stopPropagation()}>
          <div className="p-4 border-b border-gray-200 flex items-center">
            <Search className="h-5 w-5 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search developments, properties, or guides..."
              className="flex-1 outline-none text-lg"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Search Links */}
          <div className="p-4">
            <div className="text-sm text-gray-500 mb-3">Popular Searches</div>
            <div className="grid grid-cols-2 gap-3">
              {developments.map((dev: any) => (
                <Link
                  key={dev.id}
                  href={`/developments/${dev.id}`}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50"
                  onClick={() => setSearchOpen(false)}
                >
                  <MapPin className="h-5 w-5 text-[#2B5273] mr-3" />
                  <div>
                    <div className="font-medium">{dev.name}</div>
                    <div className="text-xs text-gray-500">{dev.beds} • From {dev.priceFrom}</div>
                  </div>
                </Link>
              ))}
              <Link
                href="/virtual-tour"
                className="flex items-center p-3 rounded-lg hover:bg-gray-50"
                onClick={() => setSearchOpen(false)}
              >
                <Eye className="h-5 w-5 text-[#2B5273] mr-3" />
                <div>
                  <div className="font-medium">Virtual Tours</div>
                  <div className="text-xs text-gray-500">View from home</div>
                </div>
              </Link>
              <Link
                href="/help-to-buy"
                className="flex items-center p-3 rounded-lg hover:bg-gray-50"
                onClick={() => setSearchOpen(false)}
              >
                <Heart className="h-5 w-5 text-[#2B5273] mr-3" />
                <div>
                  <div className="font-medium">Help to Buy</div>
                  <div className="text-xs text-gray-500">Government schemes</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Mobile navigation components
function MobileNavSection({ title, children }: { title: string, children: React.ReactNode }) {
  const [isOpensetIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-4 py-3 text-base font-medium text-gray-700"
      >
        {title}
        <ChevronDown className={`h-5 w-5 transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`pl-4 bg-gray-50 ${isOpen ? 'block' : 'hidden'}`}>
        {children}
      </div>
    </div>
  );
}

function MobileNavLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link href={href} className="block px-4 py-2 text-base text-gray-600">
      {children}
    </Link>
  );
}

export default ConversionFocusedNavigation;