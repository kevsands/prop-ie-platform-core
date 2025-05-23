"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ChevronDown, Menu, X, User, Home, HelpCircle, Compass, BookOpen, Calculator, FileText, BarChart2, Building, Users, Settings, ShoppingCart } from 'lucide-react';
import ProfessionalBanner from './ProfessionalBanner';
import { useUserRole } from '@/context/UserRoleContext';
import NotificationCenter from '@/components/ui/NotificationCenter';
import { usePathname } from 'next/navigation';

interface MainNavigationProps {
  theme?: 'light' | 'dark';
  isTransparent?: boolean;
  isHomePageHeader?: boolean;
}

interface DropdownItem {
  label: string;
  href: string;
  tag?: string;
  icon?: React.ReactNode;
}

interface DropdownSection {
  section: string;
  links: DropdownItem[];
}

interface DropdownProps {
  title: string;
  items: DropdownSection[];
  textColor: string;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  featuredContent?: {
    title: string;
    description: string;
    image: string;
    href: string;
  };
}

/**
 * Fixed MainNavigation component with improved dropdown handling
 */
const MainNavigationFixed: React.FC<MainNavigationProps> = ({ 
  theme = 'light', 
  isTransparent = false,
  isHomePageHeader = false
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { role, setRole } = useUserRole();
  const pathname = usePathname();
  
  // State to track which dropdown is open
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Use a ref for tracking timeout to clear it if needed
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  // Function to handle mouse enter on a dropdown
  const handleDropdownEnter = (dropdown: string) => {
    // Clear any existing timeout to prevent closing
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    console.log('Opening dropdown:', dropdown); // Debug log
    setActiveDropdown(dropdown);
  };
  
  // Function to handle mouse leave on a dropdown
  const handleDropdownLeave = () => {
    // Set a small delay before closing to allow mouse movement between elements
    timeoutRef.current = setTimeout(() => {
      console.log('Closing dropdown'); // Debug log
      setActiveDropdown(null);
    }, 200); // Increased delay for better UX
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Handle scroll state change for transparent navigation
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Dynamic classes based on props and scroll state
  const navClasses = `fixed top-0 left-0 right-0 w-full z-[9999] transition-all duration-300 ${
    isTransparent && !scrolled 
      ? 'bg-transparent' 
      : scrolled 
        ? 'bg-white shadow-md backdrop-blur-sm bg-white/95'
        : 'bg-white shadow-sm'
  }`;
  
  // Text color based on theme and transparency
  const textColorClass = (isTransparent && !scrolled && theme === 'dark') 
    ? 'text-white' 
    : 'text-gray-800';
  
  const logoColor = (isTransparent && !scrolled && theme === 'dark')
    ? 'text-white' 
    : 'text-[#2B5273]';
  
  const buttonColorClass = (isTransparent && !scrolled && theme === 'dark') 
    ? 'bg-white text-[#2B5273]' 
    : 'bg-[#2B5273] text-white';

  // Helper to get dashboard route by role
  const getDashboardRoute = () => {
    switch (role) {
      case 'agent': return '/agents';
      case 'solicitor': return '/solicitors';
      case 'developer': return '/developer';
      case 'admin': return '/admin';
      default: return '/buyer';
    }
  };

  // If this is for a home page and that page has its own navigation, 
  // don't render the component to avoid duplication
  if (isHomePageHeader) {
    return null;
  }

  return (
    <>
      <ProfessionalBanner />
      <nav className={navClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className={`text-2xl font-bold ${logoColor} transition-colors duration-300`}>
                  PropIE
                </Link>
              </div>
              
              {/* Desktop Navigation with Megamenus */}
              <div className="hidden lg:ml-8 lg:flex lg:space-x-6">
                <DesktopDropdownFixed 
                  title="Properties"
                  dropdownKey="properties"
                  textColor={textColorClass}
                  isActive={activeDropdown === 'properties'}
                  onMouseEnter={() => handleDropdownEnter('properties')}
                  onMouseLeave={handleDropdownLeave}
                  dropdownRef={(el: HTMLDivElement | null) => { dropdownRefs.current['properties'] = el; }}
                  items={[
                    { section: "Find Your Home", links: [
                      { href: "/properties/search", label: "Search All Properties", tag: "Find your perfect home", icon: <Search size={18} /> },
                      { href: "/properties/buying-guide", label: "Buying Guide", tag: "Step-by-step process to home ownership", icon: <BookOpen size={18} /> },
                      { href: "/properties/mortgage-calculator", label: "Mortgage Calculator", tag: "Plan your finances", icon: <Calculator size={18} /> }
                    ]},
                    { section: "Our Developments", links: [
                      { href: "/developments/fitzgerald-gardens", label: "Fitzgerald Gardens", tag: "2, 3 and 4 Bed Homes in Drogheda", icon: <Home size={18} /> },
                      { href: "/developments/ellwood", label: "Ellwood", tag: "2 and 3 Bed Homes in Drogheda", icon: <Home size={18} /> },
                      { href: "/developments/ballymakenny-view", label: "Ballymakenny View", tag: "3 Bed Homes in Drogheda", icon: <Home size={18} /> }
                    ]},
                    { section: "House Types", links: [
                      { href: "/properties/house-types/apartments", label: "Apartments", tag: "Modern apartment living", icon: <Building size={18} /> },
                      { href: "/properties/house-types/houses", label: "Houses", tag: "Family homes and duplexes", icon: <Building size={18} /> },
                      { href: "/properties/house-types/new-builds", label: "New Builds", tag: "Brand new properties", icon: <Building size={18} /> }
                    ]}
                  ]}
                  featuredContent={{
                    title: "Latest Development",
                    description: "Fitzgerald Gardens - New phase just released in Drogheda",
                    image: "/images/developments/fitzgerald-gardens.jpg",
                    href: "/developments/fitzgerald-gardens"
                  }}
                />
                
                <DesktopDropdownFixed 
                  title="Solutions" 
                  dropdownKey="solutions"
                  textColor={textColorClass}
                  isActive={activeDropdown === 'solutions'}
                  onMouseEnter={() => handleDropdownEnter('solutions')}
                  onMouseLeave={handleDropdownLeave}
                  dropdownRef={(el: HTMLDivElement | null) => { dropdownRefs.current['solutions'] = el; }}
                  items={[
                    { section: "Home Buyers", links: [
                      { href: "/solutions/first-time-buyers", label: "First-Time Buyers", tag: "Find your first home with ease", icon: <Home size={18} /> },
                      { href: "/customisation/how-it-works", label: "PROP Choice", tag: "Customise your home & buy furniture at point of sale", icon: <Settings size={18} /> },
                      { href: "/resources/buy-off-plan", label: "Buy Off-Plan Online", tag: "How it works: digital contracts, secure payments, instant reservation", icon: <ShoppingCart size={18} /> }
                    ]},
                    { section: "Investors", links: [
                      { href: "/solutions/professional-investors", label: "Professional Investors", tag: "Maximize your property portfolio", icon: <Calculator size={18} /> },
                      { href: "/solutions/institutional", label: "Institutional Investors", tag: "Large-scale property investment", icon: <BarChart2 size={18} /> }
                    ]},
                    { section: "Developers", links: [
                      { href: "/solutions/developers", label: "Developer Platform", tag: "End-to-end development management", icon: <Building size={18} /> },
                      { href: "/solutions/developers/sales", label: "Sales Management", tag: "Track and manage property sales", icon: <BarChart2 size={18} /> },
                      { href: "/solutions/developers/analytics", label: "Analytics & Insights", tag: "Performance data for developments", icon: <BarChart2 size={18} /> },
                      { href: "/solutions/developers/marketing", label: "Marketing Tools", tag: "Promote your developments", icon: <FileText size={18} /> }
                    ]},
                    { section: "Other Professionals", links: [
                      { href: "/solutions/estate-agents", label: "Estate Agents", tag: "Property listing and management", icon: <Home size={18} /> },
                      { href: "/solutions/solicitors", label: "Solicitors", tag: "Legal and conveyancing tools", icon: <FileText size={18} /> },
                      { href: "/solutions/architects", label: "Architects & Engineers", tag: "Design and planning resources", icon: <Compass size={18} /> }
                    ]}
                  ]}
                  featuredContent={{
                    title: "Developer Hub",
                    description: "Comprehensive platform for property developers to manage developments, sales, and buyer interactions",
                    image: "/images/solutions/developer-hub.jpg",
                    href: "/solutions/developers"
                  }}
                />
                
                <DesktopDropdownFixed 
                  title="Resources" 
                  dropdownKey="resources"
                  textColor={textColorClass}
                  isActive={activeDropdown === 'resources'}
                  onMouseEnter={() => handleDropdownEnter('resources')}
                  onMouseLeave={handleDropdownLeave}
                  dropdownRef={(el: HTMLDivElement | null) => { dropdownRefs.current['resources'] = el; }}
                  items={[
                    { section: "Guides & Tools", links: [
                      { href: "/resources/calculators", label: "Calculators & Tools", tag: "All property calculators in one place", icon: <Calculator size={18} /> },
                      { href: "/resources/property-guides", label: "Property Guides", tag: "Comprehensive guides", icon: <BookOpen size={18} /> },
                      { href: "/resources/templates", label: "Document Templates", tag: "Ready-to-use documents", icon: <FileText size={18} /> }
                    ]},
                    { section: "Market Information", links: [
                      { href: "/resources/market-reports", label: "Market Reports", tag: "Latest market insights", icon: <BarChart2 size={18} /> },
                      { href: "/resources/property-guides/first-time-buyer-guide", label: "First-Time Buyer Guide", tag: "Complete guidance for new buyers", icon: <HelpCircle size={18} /> }
                    ]}
                  ]}
                  featuredContent={{
                    title: "Latest Market Report",
                    description: "Q1 2024 Property Market Analysis - Price trends and forecasts",
                    image: "/images/resources/q1-market-review.jpg",
                    href: "/resources/market-reports/q1-2024-market-review"
                  }}
                />
                
                <DesktopDropdownFixed 
                  title="Company" 
                  dropdownKey="company"
                  textColor={textColorClass}
                  isActive={activeDropdown === 'company'}
                  onMouseEnter={() => handleDropdownEnter('company')}
                  onMouseLeave={handleDropdownLeave}
                  dropdownRef={(el: HTMLDivElement | null) => { dropdownRefs.current['company'] = el; }}
                  items={[
                    { section: "About Us", links: [
                      { href: "/company/about", label: "Our Story", tag: "Learn about PropIE", icon: <Users size={18} /> },
                      { href: "/contact", label: "Contact Us", tag: "Get in touch with our team", icon: <HelpCircle size={18} /> }
                    ]},
                    { section: "Corporate", links: [
                      { href: "/company/careers", label: "Careers", tag: "Join our team", icon: <Users size={18} /> },
                      { href: "/company/press", label: "Press & Media", tag: "News and announcements", icon: <FileText size={18} /> },
                      { href: "/company/testimonials", label: "Testimonials", tag: "What our clients say", icon: <Users size={18} /> }
                    ]}
                  ]}
                />
                
                {/* Dashboard link for logged-in users */}
                {role !== 'guest' && (
                  <Link 
                    href={getDashboardRoute()} 
                    className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                      pathname?.startsWith(getDashboardRoute())
                        ? 'border-[#2B5273] text-[#2B5273]'
                        : 'border-transparent hover:border-[#2B5273]/30'
                    } font-medium ${textColorClass} transition-all duration-200 ease-in-out`}
                  >
                    Dashboard
                  </Link>
                )}
              </div>
            </div>
            
            <div className="hidden md:flex md:items-center md:space-x-4">
              {/* Search Trigger */}
              <button 
                onClick={() => setSearchOpen(true)}
                className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${textColorClass}`}
                aria-label="Open search"
              >
                <Search className="h-5 w-5" />
              </button>
              
              {/* Notification Center */}
              <NotificationCenter />
                
              {/* Role Switcher for demo/development - can be hidden in production */}
              <select
                value={role}
                onChange={e => setRole(e.target.value as any)}
                className={`text-sm rounded border ${
                  textColorClass === 'text-white' && !scrolled
                    ? 'bg-transparent border-gray-400 text-white' 
                    : 'border-gray-300'
                } transition-all duration-300`}
              >
                <option value="agent">Agent View</option>
                <option value="solicitor">Solicitor View</option>
                <option value="developer">Developer View</option>
                <option value="admin">Admin View</option>
                <option value="guest">Guest View</option>
              </select>
                
              {role !== 'guest' ? (
                <div className="flex items-center">
                  <div className="flex flex-col mr-2 items-end">
                    <span className={`text-sm font-medium ${textColorClass}`}>Demo User</span>
                    <span className={`text-xs opacity-75 capitalize ${textColorClass}`}>{role}</span>
                  </div>
                  <div className="h-9 w-9 rounded-full bg-[#2B5273] flex items-center justify-center text-white overflow-hidden">
                    <User className="h-5 w-5" />
                  </div>
                </div>
              ) : (
                <div className="space-x-2">
                  <Link
                    href="/login"
                    className={`px-4 py-2 rounded-md font-medium transition-all ${
                      buttonColorClass === 'bg-white text-[#2B5273]' 
                        ? 'bg-white/90 text-[#2B5273] hover:bg-white border border-white/50 hover:shadow-md' 
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className={`px-4 py-2 rounded-md font-medium transition-all hover:shadow-md ${buttonColorClass}`}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              {/* Mobile Search Button */}
              <button
                className={`p-2 rounded-md ${textColorClass}`}
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </button>
              
              <button
                type="button"
                className={`ml-2 inline-flex items-center justify-center p-2 rounded-md ${textColorClass} hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#2B5273]`}
                aria-controls="mobile-menu"
                aria-expanded="false"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu with animation */}
        <div 
          className={`lg:hidden bg-white shadow-lg overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pt-2 pb-3 space-y-1 overflow-y-auto">
            <MobileNavSection title="Properties">
              <MobileNavSection title="Find Your Home">
                <MobileNavLink href="/properties/search">Search All Properties</MobileNavLink>
                <MobileNavLink href="/properties/buying-guide">Buying Guide</MobileNavLink>
                <MobileNavLink href="/properties/mortgage-calculator">Mortgage Calculator</MobileNavLink>
              </MobileNavSection>
              
              <MobileNavSection title="Our Developments">
                <MobileNavLink href="/developments/fitzgerald-gardens">Fitzgerald Gardens</MobileNavLink>
                <MobileNavLink href="/developments/ellwood">Ellwood</MobileNavLink>
                <MobileNavLink href="/developments/ballymakenny-view">Ballymakenny View</MobileNavLink>
              </MobileNavSection>
              
              <MobileNavSection title="House Types">
                <MobileNavLink href="/properties/house-types/apartments">Apartments</MobileNavLink>
                <MobileNavLink href="/properties/house-types/houses">Houses</MobileNavLink>
                <MobileNavLink href="/properties/house-types/new-builds">New Builds</MobileNavLink>
              </MobileNavSection>
            </MobileNavSection>
            
            <MobileNavSection title="Solutions">
              <MobileNavSection title="Home Buyers">
                <MobileNavLink href="/solutions/first-time-buyers">First-Time Buyers</MobileNavLink>
                <MobileNavLink href="/customisation/how-it-works">PROP Choice</MobileNavLink>
                <MobileNavLink href="/resources/buy-off-plan">Buy Off-Plan Online</MobileNavLink>
              </MobileNavSection>
              
              <MobileNavLink href="/solutions/professional-investors">Professional Investors</MobileNavLink>
              <MobileNavLink href="/solutions/institutional">Institutional Investors</MobileNavLink>
              <MobileNavLink href="/solutions/developers">Developer Platform</MobileNavLink>
              <MobileNavLink href="/solutions/estate-agents">Estate Agents</MobileNavLink>
              <MobileNavLink href="/solutions/solicitors">Solicitors</MobileNavLink>
              <MobileNavLink href="/solutions/architects">Architects & Engineers</MobileNavLink>
            </MobileNavSection>
            
            <MobileNavSection title="Resources">
              <MobileNavLink href="/resources/calculators">Calculators & Tools</MobileNavLink>
              <MobileNavLink href="/resources/property-guides">Property Guides</MobileNavLink>
              <MobileNavLink href="/resources/property-guides/first-time-buyer-guide">First-Time Buyer Guide</MobileNavLink>
              <MobileNavLink href="/resources/templates">Document Templates</MobileNavLink>
              <MobileNavLink href="/resources/market-reports">Market Reports</MobileNavLink>
            </MobileNavSection>
            
            <MobileNavSection title="Company">
              <MobileNavLink href="/company/about">About Us</MobileNavLink>
              <MobileNavLink href="/contact">Contact Us</MobileNavLink>
              <MobileNavLink href="/company/careers">Careers</MobileNavLink>
            </MobileNavSection>
          </div>
          
          <div className="pt-4 pb-6 border-t border-gray-200 px-4">
            <div className="flex flex-col space-y-3">
              {role !== 'guest' ? (
                <>
                  <Link href={getDashboardRoute()} className="flex items-center space-x-2 text-[#2B5273] font-medium">
                    <User className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span className="capitalize">{role} Account</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-3 mt-2">
                  <Link 
                    href="/login"
                    className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 font-medium text-center hover:bg-gray-50"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register"
                    className="w-full py-2 px-4 bg-[#2B5273] text-white rounded-md font-medium text-center hover:bg-[#1E3142]"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Global Search Overlay */}
      <div 
        className={`fixed inset-0 bg-black z-[10000] flex items-start justify-center transition-opacity duration-300 ${
          searchOpen ? 'bg-opacity-50 opacity-100 pointer-events-auto' : 'bg-opacity-0 opacity-0 pointer-events-none'
        }`}
        onClick={() => setSearchOpen(false)}
      >
        <div 
          className="bg-white w-full max-w-3xl mt-20 rounded-lg shadow-xl overflow-hidden transition-all duration-300 transform"
          style={{ 
            transform: searchOpen ? 'translateY(0)' : 'translateY(-50px)',
            opacity: searchOpen ? 1 : 0
          }}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-gray-200 flex items-center">
            <Search className="h-5 w-5 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search for properties, guides, or resources..."
              className="flex-1 outline-none text-lg"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button 
              onClick={() => setSearchOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4">
            <div className="text-sm text-gray-500 mb-3">Quick Links</div>
            <div className="grid grid-cols-2 gap-3">
              <Link 
                href="/resources/property-guides/first-time-buyer-guide"
                className="flex items-center p-3 rounded-lg hover:bg-gray-50"
                onClick={() => setSearchOpen(false)}
              >
                <BookOpen className="h-5 w-5 text-[#2B5273] mr-3" />
                <div>
                  <div className="font-medium">First-Time Buyer Guide</div>
                  <div className="text-xs text-gray-500">Complete guide for new buyers</div>
                </div>
              </Link>
              <Link 
                href="/resources/calculators/mortgage-calculator"
                className="flex items-center p-3 rounded-lg hover:bg-gray-50"
                onClick={() => setSearchOpen(false)}
              >
                <Calculator className="h-5 w-5 text-[#2B5273] mr-3" />
                <div>
                  <div className="font-medium">Mortgage Calculator</div>
                  <div className="text-xs text-gray-500">Calculate your mortgage payments</div>
                </div>
              </Link>
              <Link 
                href="/solutions/developers"
                className="flex items-center p-3 rounded-lg hover:bg-gray-50"
                onClick={() => setSearchOpen(false)}
              >
                <Building className="h-5 w-5 text-[#2B5273] mr-3" />
                <div>
                  <div className="font-medium">Developer Platform</div>
                  <div className="text-xs text-gray-500">Complete development management</div>
                </div>
              </Link>
              <Link 
                href="/solutions/developers/sales"
                className="flex items-center p-3 rounded-lg hover:bg-gray-50"
                onClick={() => setSearchOpen(false)}
              >
                <BarChart2 className="h-5 w-5 text-[#2B5273] mr-3" />
                <div>
                  <div className="font-medium">Sales Management</div>
                  <div className="text-xs text-gray-500">For property developers</div>
                </div>
              </Link>
              <Link 
                href="/solutions/first-time-buyers"
                className="flex items-center p-3 rounded-lg hover:bg-gray-50"
                onClick={() => setSearchOpen(false)}
              >
                <Home className="h-5 w-5 text-[#2B5273] mr-3" />
                <div>
                  <div className="font-medium">First-Time Buyers</div>
                  <div className="text-xs text-gray-500">Solutions for new buyers</div>
                </div>
              </Link>
              <Link 
                href="/resources/market-reports"
                className="flex items-center p-3 rounded-lg hover:bg-gray-50"
                onClick={() => setSearchOpen(false)}
              >
                <BarChart2 className="h-5 w-5 text-[#2B5273] mr-3" />
                <div>
                  <div className="font-medium">Market Reports</div>
                  <div className="text-xs text-gray-500">Latest property insights</div>
                </div>
              </Link>
              <Link 
                href="/resources/templates"
                className="flex items-center p-3 rounded-lg hover:bg-gray-50"
                onClick={() => setSearchOpen(false)}
              >
                <FileText className="h-5 w-5 text-[#2B5273] mr-3" />
                <div>
                  <div className="font-medium">Document Templates</div>
                  <div className="text-xs text-gray-500">Property document templates</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Modern desktop megamenu dropdown with rock-solid hover implementation and improved z-index
interface DropdownPropsFixed extends DropdownProps {
  dropdownKey: string;
  dropdownRef: (el: HTMLDivElement | null) => void;
}

function DesktopDropdownFixed({ 
  title, 
  items, 
  textColor, 
  featuredContent, 
  isActive, 
  onMouseEnter, 
  onMouseLeave,
  dropdownKey,
  dropdownRef
}: DropdownPropsFixed) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  
  // Determine if any links in this dropdown match current path
  const isActivePath = items.some(section => 
    section.links.some(link => pathname === link.href || pathname?.startsWith(link.href + '/'))
  );
  
  const handleMouseEnter = () => {
    setIsHovered(true);
    onMouseEnter();
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    onMouseLeave();
  };
  
  return (
    <div 
      className="relative" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`flex items-center px-2 py-1 rounded-md text-sm font-medium ${textColor} hover:bg-black/5 transition-all duration-200 ${isActivePath ? 'bg-black/5' : ''}`}
        aria-expanded={isActive}
        aria-label={`${title} dropdown menu`}
      >
        {title}
        <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`} />
      </button>
      
      <div 
        ref={dropdownRef}
        className={`absolute mt-2 w-screen max-w-5xl rounded-xl shadow-xl bg-white ring-1 ring-black/5 overflow-hidden left-1/2 transform -translate-x-1/2 transition-all duration-200 ${
          isActive || isHovered 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 translate-y-[-10px] pointer-events-none'
        }`}
        style={{ zIndex: 99999 }}
      >
        <div className="flex">
          <div className="flex-1 bg-white p-6">
            <div className="grid grid-cols-2 gap-x-8 gap-y-10">
              {items.map((section, idx) => (
                <div key={idx}>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    {section.section}
                  </h3>
                  <div className="mt-4 space-y-4">
                    {section.links.map((link, linkIdx) => (
                      <Link
                        key={linkIdx}
                        href={link.href}
                        className="group flex items-center p-3 -m-3 rounded-lg hover:bg-gray-50"
                      >
                        {link.icon && (
                          <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-[#2B5273]/10 text-[#2B5273] group-hover:bg-[#2B5273] group-hover:text-white transition-colors">
                            {link.icon}
                          </div>
                        )}
                        <div className={`${link.icon ? 'ml-4' : ''}`}>
                          <p className="text-base font-medium text-gray-900 group-hover:text-[#2B5273]">
                            {link.label}
                          </p>
                          {link.tag && (
                            <p className="mt-1 text-sm text-gray-500">
                              {link.tag}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Featured content area */}
          {featuredContent && (
            <div className="w-96 bg-gray-50 p-6">
              <div className="h-48 rounded-lg relative overflow-hidden mb-4">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <Image
                  src={featuredContent.image}
                  alt={featuredContent.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                  <h3 className="text-lg font-semibold text-white">{featuredContent.title}</h3>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">{featuredContent.description}</p>
              <Link 
                href={featuredContent.href}
                className="inline-flex items-center text-sm font-medium text-[#2B5273] hover:text-[#1E3142]"
              >
                Learn more
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          )}
        </div>
        
        {/* Bottom quick links */}
        <div className="bg-gray-50 px-6 py-3 flex justify-between">
          <p className="text-sm text-gray-500">
            Need help? <Link href="/contact" className="text-[#2B5273] hover:underline">Contact our team</Link>
          </p>
          <Link 
            href="/resources/property-guides" 
            className="text-sm text-[#2B5273] hover:underline"
          >
            View all resources
          </Link>
        </div>
      </div>
    </div>
  );
}

// Enhanced mobile navigation section
function MobileNavSection({ title, children }: { title: string, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
      >
        {title}
        <ChevronDown className={`h-5 w-5 text-gray-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <div 
        className={`pl-4 bg-gray-50 overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

// Enhanced mobile navigation link
function MobileNavLink({ href, children }: { href: string, children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`block px-4 py-2 text-base ${isActive ? 'text-[#2B5273] font-medium' : 'text-gray-600 hover:text-gray-900'}`}
    >
      {children}
    </Link>
  );
}

export default MainNavigationFixed;