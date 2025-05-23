"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, ChevronDown, Menu, X, User, Bell,
  Home, Building, Calculator, TrendingUp, FileText,
  BarChart2, MessageSquare, Users, HelpCircle, LogOut,
  Briefcase, Shield, Compass, BookOpen, Settings,
  ShoppingCart
} from 'lucide-react';
import { useUserRole } from '@/context/UserRoleContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

interface NavigationItem {
  label: string;
  href: string;
  sections?: {
    title: string;
    items: {
      label: string;
      href: string;
      description: string;
      icon?: React.ReactNode;
    }[];
  }[];
  featuredContent?: {
    title: string;
    description: string;
    image: string;
    href: string;
  };
}

const getNavigationItems = (): NavigationItem[] => [
  {
    label: 'Properties',
    href: '/properties',
    sections: [
      {
        title: 'FIND YOUR HOME',
        items: [
          {
            label: 'Search All Properties',
            href: '/properties/search',
            description: 'Find your perfect home',
            icon: <Search className="h-5 w-5" />
          },
          {
            label: 'Buying Guide',
            href: '/properties/buying-guide',
            description: 'Step-by-step process to home ownership',
            icon: <BookOpen className="h-5 w-5" />
          },
          {
            label: 'Mortgage Calculator',
            href: '/properties/mortgage-calculator',
            description: 'Plan your finances',
            icon: <Calculator className="h-5 w-5" />
          }
        ]
      },
      {
        title: 'OUR DEVELOPMENTS',
        items: [
          {
            label: 'Fitzgerald Gardens',
            href: '/developments/fitzgerald-gardens',
            description: '2, 3 and 4 Bed Homes in Drogheda',
            icon: <Home className="h-5 w-5" />
          },
          {
            label: 'Ellwood',
            href: '/developments/ellwood',
            description: '2 and 3 Bed Homes in Drogheda',
            icon: <Home className="h-5 w-5" />
          },
          {
            label: 'Ballymakenny View',
            href: '/developments/ballymakenny-view',
            description: '3 Bed Homes in Drogheda',
            icon: <Home className="h-5 w-5" />
          }
        ]
      },
      {
        title: 'HOUSE TYPES',
        items: [
          {
            label: 'Apartments',
            href: '/properties/apartments',
            description: 'Modern apartment living',
            icon: <Building className="h-5 w-5" />
          },
          {
            label: 'Houses',
            href: '/properties/houses',
            description: 'Family homes and duplexes',
            icon: <Building className="h-5 w-5" />
          },
          {
            label: 'New Builds',
            href: '/properties/new-builds',
            description: 'Brand new properties',
            icon: <Building className="h-5 w-5" />
          }
        ]
      }
    ],
    featuredContent: {
      title: 'Latest Development',
      description: 'Fitzgerald Gardens - New phase just released in Drogheda',
      image: '/images/developments/fitzgerald-gardens.jpg',
      href: '/developments/fitzgerald-gardens'
    }
  },
  {
    label: 'Solutions',
    href: '/solutions',
    sections: [
      {
        title: 'HOME BUYERS',
        items: [
          {
            label: 'First-Time Buyers',
            href: '/solutions/first-time-buyers',
            description: 'Find your first home with ease',
            icon: <Users className="h-5 w-5" />
          },
          {
            label: 'PROP Choice',
            href: '/solutions/prop-choice',
            description: 'Customise your home & buy furniture at point of sale',
            icon: <Settings className="h-5 w-5" />
          },
          {
            label: 'Buy Off-Plan Online',
            href: '/solutions/buy-off-plan',
            description: 'How it works: digital contracts, secure payments, instant reservation',
            icon: <ShoppingCart className="h-5 w-5" />
          }
        ]
      },
      {
        title: 'INVESTORS',
        items: [
          {
            label: 'Professional Investors',
            href: '/solutions/professional-investors',
            description: 'Maximize your property portfolio',
            icon: <Briefcase className="h-5 w-5" />
          },
          {
            label: 'Institutional Investors',
            href: '/solutions/institutional-investors',
            description: 'Large-scale property investment',
            icon: <BarChart2 className="h-5 w-5" />
          }
        ]
      },
      {
        title: 'DEVELOPERS',
        items: [
          {
            label: 'Developer Platform',
            href: '/solutions/developer-platform',
            description: 'End-to-end development management',
            icon: <Building className="h-5 w-5" />
          },
          {
            label: 'Sales Management',
            href: '/solutions/sales-management',
            description: 'Track and manage property sales',
            icon: <BarChart2 className="h-5 w-5" />
          },
          {
            label: 'Analytics & Insights',
            href: '/solutions/analytics',
            description: 'Performance data for developments',
            icon: <BarChart2 className="h-5 w-5" />
          },
          {
            label: 'Marketing Tools',
            href: '/solutions/marketing-tools',
            description: 'Promote your developments',
            icon: <MessageSquare className="h-5 w-5" />
          }
        ]
      },
      {
        title: 'OTHER PROFESSIONALS',
        items: [
          {
            label: 'Estate Agents',
            href: '/solutions/estate-agents',
            description: 'Property listing and management',
            icon: <Users className="h-5 w-5" />
          },
          {
            label: 'Solicitors',
            href: '/solutions/solicitors',
            description: 'Legal and conveyancing tools',
            icon: <FileText className="h-5 w-5" />
          },
          {
            label: 'Architects & Engineers',
            href: '/solutions/architects',
            description: 'Design and planning resources',
            icon: <Compass className="h-5 w-5" />
          }
        ]
      }
    ],
    featuredContent: {
      title: 'Developer Hub',
      description: 'Comprehensive platform for property developers to manage developments, sales, and buyer interactions',
      image: '/images/solutions/developer-hub.jpg',
      href: '/solutions/developers'
    }
  },
  {
    label: 'Resources',
    href: '/resources',
    sections: [
      {
        title: 'GUIDES & TOOLS',
        items: [
          {
            label: 'Calculators & Tools',
            href: '/resources/calculators',
            description: 'All property calculators in one place',
            icon: <Calculator className="h-5 w-5" />
          },
          {
            label: 'Property Guides',
            href: '/resources/guides',
            description: 'Comprehensive guides',
            icon: <BookOpen className="h-5 w-5" />
          },
          {
            label: 'Document Templates',
            href: '/resources/templates',
            description: 'Ready-to-use documents',
            icon: <FileText className="h-5 w-5" />
          }
        ]
      },
      {
        title: 'MARKET INFORMATION',
        items: [
          {
            label: 'Market Reports',
            href: '/resources/market-reports',
            description: 'Latest market insights',
            icon: <BarChart2 className="h-5 w-5" />
          },
          {
            label: 'First-Time Buyer Guide',
            href: '/resources/ftb-guide',
            description: 'Complete guidance for new buyers',
            icon: <HelpCircle className="h-5 w-5" />
          }
        ]
      }
    ],
    featuredContent: {
      title: 'Latest Market Report',
      description: 'Q1 2024 Property Market Analysis - Price trends and forecasts',
      image: '/images/resources/market-report.jpg',
      href: '/resources/market-reports/q1-2024'
    }
  },
  {
    label: 'Company',
    href: '/company',
    sections: [
      {
        title: 'ABOUT US',
        items: [
          {
            label: 'Our Story',
            href: '/company/about',
            description: 'Learn about PropIE',
            icon: <Users className="h-5 w-5" />
          },
          {
            label: 'Contact Us',
            href: '/contact',
            description: 'Get in touch with our team',
            icon: <HelpCircle className="h-5 w-5" />
          }
        ]
      },
      {
        title: 'CORPORATE',
        items: [
          {
            label: 'Careers',
            href: '/company/careers',
            description: 'Join our team',
            icon: <Users className="h-5 w-5" />
          },
          {
            label: 'Press & Media',
            href: '/company/press',
            description: 'News and announcements',
            icon: <FileText className="h-5 w-5" />
          },
          {
            label: 'Testimonials',
            href: '/company/testimonials',
            description: 'What our clients say',
            icon: <Users className="h-5 w-5" />
          }
        ]
      }
    ]
  }
];

// Dropdown menu component
const DropdownMenu = ({ item, isOpen, onMouseEnter, onMouseLeave }: {
  item: NavigationItem;
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
  
  return (
    <div 
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Link
        href={item.href}
        className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${
          isActive 
            ? 'text-[#2B5273]' 
            : 'text-gray-700 hover:text-gray-900'
        }`}
      >
        {item.label}
        {item.sections && (
          <ChevronDown 
            className={`ml-1 h-4 w-4 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        )}
      </Link>
      
      {item.sections && (
        <div 
          className={`absolute left-0 mt-2 w-[1000px] bg-white rounded-lg shadow-xl border border-gray-200 z-50 transition-all duration-200 ${
            isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}>
          <div className="flex">
            <div className="flex-1 p-6">
              <div className="grid grid-cols-4 gap-8">
                {item.sections.map((section, idx) => (
                  <div key={idx}>
                    <h3 className="text-xs font-bold text-gray-700 uppercase mb-4">
                      {section.title}
                    </h3>
                    <ul className="space-y-3">
                      {section.items.map((link, linkIdx) => (
                        <li key={linkIdx}>
                          <Link
                            href={link.href}
                            className="flex items-start space-x-3 group"
                          >
                            {link.icon && (
                              <div className="p-2 bg-gray-100 rounded group-hover:bg-[#2B5273] group-hover:text-white transition-colors">
                                {link.icon}
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900 group-hover:text-[#2B5273]">
                                {link.label}
                              </p>
                              <p className="text-sm text-gray-500">
                                {link.description}
                              </p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            
            {item.featuredContent && (
              <div className="w-80 bg-gray-50 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {item.featuredContent.title}
                </h3>
                <div className="h-40 bg-gray-200 rounded-lg mb-4" />
                <p className="text-sm text-gray-600 mb-4">
                  {item.featuredContent.description}
                </p>
                <Link
                  href={item.featuredContent.href}
                  className="text-[#2B5273] font-medium hover:underline inline-flex items-center"
                >
                  Learn more
                  <ChevronDown className="ml-1 h-4 w-4 rotate-[-90deg]" />
                </Link>
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help? <Link href="/contact" className="text-[#2B5273] hover:underline">Contact our team</Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Main navigation component
export const CleanProfessionalNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const { role } = useUserRole();
  const router = useRouter();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigationItems: NavigationItem[] = getNavigationItems();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);
  
  const handleDropdownEnter = (label: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(label);
  };
  
  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 100);
  };
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white shadow-lg' 
        : 'bg-white/80 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/Prop Branding/Prop- LogoType-Blue.jpg"
              alt="PropIE"
              width={100}
              height={30}
              className="h-8 w-auto"
            />
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {navigationItems.map((item) => (
              <DropdownMenu
                key={item.label}
                item={item}
                isOpen={activeDropdown === item.label}
                onMouseEnter={() => handleDropdownEnter(item.label)}
                onMouseLeave={handleDropdownLeave}
              />
            ))}
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Search className="h-5 w-5 text-gray-600" />
            </button>
            
            {/* Notifications */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
            
            {/* User Menu / Auth */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <span className="text-sm font-medium text-gray-700">
                    {role && role !== 'guest' ? role : 'Guest View'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={() => router.push('/logout')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-[#2B5273] text-white text-sm font-medium rounded-lg hover:bg-[#1e3347] transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

// ShoppingCart icon was missing, let's add a simple implementation
const ShoppingCart = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

export default CleanProfessionalNav;