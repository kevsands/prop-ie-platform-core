"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, ChevronDown, Menu, X, User, Home, HelpCircle, Compass, 
  BookOpen, Calculator, FileText, BarChart2, Building, Users, LogOut,
  Shield, DollarSign, Briefcase, Scale, TrendingUp, Package,
  MessageSquare, Bell, CreditCard, FolderOpen, CheckCircle, Plus, Upload,
  Calendar, Megaphone, Video, Eye, Star, Settings, Globe, Mail, Phone,
  MapPin, Clock, Key, BarChart3, PieChart, Activity, Zap, Award, Cpu,
  Database, Lock, Unlock, GitBranch, Terminal, Code, Layers, Grid
} from 'lucide-react';
import { useUserRole } from '@/context/UserRoleContext';
// import NotificationCenter from '@/components/ui/NotificationCenter';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTransaction } from '@/context/TransactionContext';

interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: number | string;
  tag?: string;
  description?: string;
  children?: NavigationItem[];
  requiresAuth?: boolean;
  roles?: string[];
}

const navigationConfig = {
  properties: {
    label: 'Properties',
    featured: [
      { label: 'New Developments', href: '/developments', icon: <Building size={20} />, tag: 'New' },
      { label: 'Property Search', href: '/properties', icon: <Search size={20} /> },
      { label: '3D Virtual Tours', href: '/virtual-tours', icon: <Eye size={20} /> },
      { label: 'Featured Properties', href: '/featured', icon: <Star size={20} /> }
    ],
    categories: [
      { label: 'Residential', href: '/properties/residential', icon: <Home size={20} /> },
      { label: 'Commercial', href: '/properties/commercial', icon: <Building size={20} /> },
      { label: 'New Build', href: '/properties/new-build', icon: <Layers size={20} /> },
      { label: 'Investment', href: '/properties/investment', icon: <TrendingUp size={20} /> }
    ],
    resources: [
      { label: 'Buyer Guide', href: '/resources/buyer-guide', icon: <BookOpen size={20} /> },
      { label: 'Mortgage Calculator', href: '/calculators/mortgage', icon: <Calculator size={20} /> },
      { label: 'Property Alerts', href: '/alerts', icon: <Bell size={20} /> }
    ]
  },
  solutions: {
    label: 'Solutions',
    buyer: [
      { label: 'First Time Buyers', href: '/first-time-buyers', icon: <Home size={20} />, tag: 'Popular' },
      { label: 'Investment Properties', href: '/investment', icon: <TrendingUp size={20} /> },
      { label: 'Property Portfolio', href: '/portfolio', icon: <Grid size={20} /> }
    ],
    professional: [
      { label: 'Developer Portal', href: '/developers', icon: <Building size={20} /> },
      { label: 'Agent Dashboard', href: '/agents', icon: <Users size={20} /> },
      { label: 'Solicitor Services', href: '/solicitors', icon: <Scale size={20} /> }
    ],
    tools: [
      { label: 'Help to Buy', href: '/help-to-buy', icon: <HelpCircle size={20} /> },
      { label: 'Mortgage Approval', href: '/mortgage', icon: <DollarSign size={20} /> },
      { label: 'Legal Documents', href: '/documents', icon: <FileText size={20} /> }
    ]
  },
  resources: {
    label: 'Resources',
    guides: [
      { label: 'Buying Process', href: '/guides/buying', icon: <BookOpen size={20} /> },
      { label: 'Market Analysis', href: '/market-analysis', icon: <BarChart2 size={20} /> },
      { label: 'Area Guides', href: '/area-guides', icon: <MapPin size={20} /> }
    ],
    tools: [
      { label: 'Affordability Calculator', href: '/calculators/affordability', icon: <Calculator size={20} /> },
      { label: 'Stamp Duty Calculator', href: '/calculators/stamp-duty', icon: <CreditCard size={20} /> },
      { label: 'Property Valuation', href: '/valuation', icon: <DollarSign size={20} /> }
    ],
    support: [
      { label: 'Help Center', href: '/help', icon: <HelpCircle size={20} /> },
      { label: 'Contact Us', href: '/contact', icon: <Phone size={20} /> },
      { label: 'FAQs', href: '/faqs', icon: <MessageSquare size={20} /> }
    ]
  },
  company: {
    label: 'Company',
    about: [
      { label: 'About Prop.ie', href: '/about', icon: <Globe size={20} /> },
      { label: 'Our Team', href: '/team', icon: <Users size={20} /> },
      { label: 'Careers', href: '/careers', icon: <Briefcase size={20} />, tag: 'Hiring' }
    ],
    news: [
      { label: 'News & Updates', href: '/news', icon: <Megaphone size={20} /> },
      { label: 'Blog', href: '/blog', icon: <FileText size={20} /> },
      { label: 'Press Releases', href: '/press', icon: <Globe size={20} /> }
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy', icon: <Lock size={20} /> },
      { label: 'Terms of Service', href: '/terms', icon: <FileText size={20} /> },
      { label: 'Cookie Policy', href: '/cookies', icon: <Shield size={20} /> }
    ]
  }
};

const userFlows = {
  buyer: {
    primaryActions: [
      { label: 'Property Search', href: '/properties', icon: <Search size={18} /> },
      { label: 'Saved Properties', href: '/buyer/saved', icon: <Star size={18} /> },
      { label: 'Property Alerts', href: '/buyer/alerts', icon: <Bell size={18} /> },
      { label: 'My Documents', href: '/buyer/documents', icon: <FileText size={18} /> }
    ],
    quickActions: [
      { label: 'Book Viewing', href: '/buyer/viewings', icon: <Calendar size={16} /> },
      { label: 'Mortgage Calculator', href: '/calculators/mortgage', icon: <Calculator size={16} /> },
      { label: 'Help to Buy', href: '/help-to-buy', icon: <HelpCircle size={16} /> }
    ]
  },
  developer: {
    primaryActions: [
      { label: 'Project Dashboard', href: '/developer/dashboard', icon: <BarChart2 size={18} /> },
      { label: 'Sales Pipeline', href: '/developer/sales', icon: <TrendingUp size={18} /> },
      { label: 'Lead Management', href: '/developer/leads', icon: <Users size={18} /> },
      { label: 'Analytics', href: '/developer/analytics', icon: <PieChart size={18} /> }
    ],
    quickActions: [
      { label: 'New Project', href: '/developer/projects/new', icon: <Plus size={16} /> },
      { label: 'Upload Documents', href: '/developer/documents/upload', icon: <Upload size={16} /> },
      { label: 'Marketing Tools', href: '/developer/marketing', icon: <Megaphone size={16} /> }
    ]
  },
  agent: {
    primaryActions: [
      { label: 'Client Portfolio', href: '/agent/clients', icon: <Users size={18} /> },
      { label: 'Property Listings', href: '/agent/listings', icon: <Building size={18} /> },
      { label: 'Viewings Schedule', href: '/agent/viewings', icon: <Calendar size={18} /> },
      { label: 'Commission Tracker', href: '/agent/commissions', icon: <DollarSign size={18} /> }
    ],
    quickActions: [
      { label: 'Add Client', href: '/agent/clients/new', icon: <Plus size={16} /> },
      { label: 'Schedule Viewing', href: '/agent/viewings/new', icon: <Calendar size={16} /> },
      { label: 'Performance Report', href: '/agent/reports', icon: <BarChart2 size={16} /> }
    ]
  },
  solicitor: {
    primaryActions: [
      { label: 'Active Cases', href: '/solicitor/cases', icon: <FolderOpen size={18} /> },
      { label: 'Document Library', href: '/solicitor/documents', icon: <FileText size={18} /> },
      { label: 'Client Portal', href: '/solicitor/clients', icon: <Users size={18} /> },
      { label: 'Compliance Center', href: '/solicitor/compliance', icon: <Shield size={18} /> }
    ],
    quickActions: [
      { label: 'New Case', href: '/solicitor/cases/new', icon: <Plus size={16} /> },
      { label: 'Document Templates', href: '/solicitor/templates', icon: <FileText size={16} /> },
      { label: 'Due Diligence', href: '/solicitor/due-diligence', icon: <CheckCircle size={16} /> }
    ]
  }
};

interface EnhancedNavigationProps {
  theme?: 'light' | 'dark';
  isTransparent?: boolean;
}

export const EnhancedNavigation: React.FC<EnhancedNavigationProps> = ({ 
  theme = 'light', 
  isTransparent = false 
}) => {
  const [mobileMenuOpensetMobileMenuOpen] = useState(false);
  const [searchOpensetSearchOpen] = useState(false);
  const [activeDropdownsetActiveDropdown] = useState<string | null>(null);
  const [scrolledsetScrolled] = useState(false);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const { userRole } = useUserRole();
  const { user, logout } = useAuth();
  const { activeTransaction } = useTransaction();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY> 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeout.current) {
      clearTimeout(dropdownTimeout.current);
    }
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300);
  };

  const isNavScrolled = scrolled || !isTransparent;
  const navBg = isNavScrolled 
    ? 'bg-white shadow-lg' 
    : 'bg-transparent';
  const textColor = isNavScrolled || theme === 'light'
    ? 'text-gray-800' 
    : 'text-white';
  const logoSrc = isNavScrolled || theme === 'light'
    ? '/images/Prop Branding/Prop - Master_Logo-Black.jpg'
    : '/images/Prop Branding/Prop Master_Logo- White.png';

  const userFlow = user && userRole ? userFlows[userRole as keyof typeof userFlows] : null;

  return (
    <>
      {/* Professional Banner */}
      <div className="bg-[#1E3142] text-white py-1 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end space-x-6">
            <a href="/agents" className="flex items-center space-x-1 hover:text-gray-200 transition-colors py-1">
              <Users size={14} />
              <span>For Agents</span>
            </a>
            <a href="/solicitors" className="flex items-center space-x-1 hover:text-gray-200 transition-colors py-1">
              <FileText size={14} />
              <span>For Solicitors</span>
            </a>
            <a href="/developers" className="flex items-center space-x-1 hover:text-gray-200 transition-colors py-1">
              <Building size={14} />
              <span>For Developers</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="transition-opacity duration-300 hover:opacity-80">
                <div className="relative h-10 w-32">
                  <Image
                    src={logoSrc}
                    alt="Prop.ie"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:ml-8 lg:flex lg:space-x-6">
                {Object.entries(navigationConfig).map(([keysection]) => (
                  <div
                    key={key}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(section.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${textColor} hover:bg-gray-100 transition-all`}
                    >
                      {section.label}
                      <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${
                        activeDropdown === section.label ? 'rotate-180' : ''
                      }`} />
                    </button>

                    {/* Mega Menu Dropdown */}
                    <div className={`absolute z-10 mt-2 w-screen max-w-5xl rounded-xl shadow-xl bg-white left-1/2 transform -translate-x-1/2 transition-all duration-200 ${
                      activeDropdown === section.label 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-[-10px] pointer-events-none'
                    }`}>
                      <div className="p-6">
                        <div className="grid grid-cols-3 gap-8">
                          {Object.entries(section).filter(([k]) => k !== 'label').map(([categoryitems]) => (
                            <div key={category}>
                              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                              </h3>
                              <ul className="space-y-3">
                                {(items as NavigationItem[]).map((item) => (
                                  <li key={item.href}>
                                    <Link
                                      href={item.href}
                                      className="flex items-center space-x-3 text-gray-600 hover:text-[#2B5273] transition-colors"
                                    >
                                      {item.icon}
                                      <span>{item.label}</span>
                                      {item.tag && (
                                        <span className="px-2 py-1 text-xs bg-[#2B5273] text-white rounded-full">
                                          {item.tag}
                                        </span>
                                      )}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <button
                onClick={() => setSearchOpen(true)}
                className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${textColor}`}
              >
                <Search className="h-5 w-5" />
              </button>

              {user ? (
                <>
                  {userRole && userFlow && (
                    <div className="relative group">
                      <button className={`flex items-center space-x-2 p-2 rounded-md ${textColor} hover:bg-gray-100 transition-colors`}>
                        <User className="h-5 w-5" />
                        <span className="text-sm font-medium">{user.email}</span>
                        <ChevronDown className="h-4 w-4" />
                      </button>

                      {/* User Dropdown */}
                      <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl opacity-0 translate-y-[-10px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
                        <div className="p-4 border-b">
                          <p className="text-sm font-medium text-gray-900">{user.email}</p>
                          <p className="text-xs text-gray-500 capitalize">{userRole} Account</p>
                        </div>

                        <div className="p-2">
                          {userFlow.primaryActions.map((action) => (
                            <Link
                              key={action.href}
                              href={action.href}
                              className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                            >
                              {action.icon}
                              <span>{action.label}</span>
                            </Link>
                          ))}
                        </div>

                        <div className="p-2 border-t">
                          <Link
                            href="/settings"
                            className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                          >
                            <Settings size={18} />
                            <span>Settings</span>
                          </Link>
                          <button
                            onClick={logout}
                            className="flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors w-full text-left"
                          >
                            <LogOut size={18} />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* <NotificationCenter /> */}

                  {activeTransaction && (
                    <Link
                      href="/transaction-flow"
                      className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
                    >
                      <Activity size={18} />
                      <span className="text-sm font-medium">Active Transaction</span>
                    </Link>
                  )}
                </>
              ) : (
                <div className="space-x-2">
                  <Link
                    href="/login"
                    className={`px-4 py-2 rounded-md font-medium transition-all border ${
                      isNavScrolled || theme === 'light'
                        ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        : 'border-gray-300 text-white hover:bg-gray-50'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 rounded-md font-medium transition-all bg-[#2B5273] text-white hover:bg-[#1E3142]"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`ml-2 inline-flex items-center justify-center p-2 rounded-md ${textColor}`}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-white shadow-lg`}>
          <div className="px-4 pt-2 pb-3 space-y-1">
            {Object.entries(navigationConfig).map(([keysection]) => (
              <div key={key} className="py-2">
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section.label}
                </p>
                <div className="mt-2 space-y-1">
                  {Object.entries(section).filter(([k]) => k !== 'label').map(([categoryitems]) => (
                    (items as NavigationItem[]).map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                        {item.tag && (
                          <span className="ml-auto px-2 py-1 text-xs bg-[#2B5273] text-white rounded-full">
                            {item.tag}
                          </span>
                        )}
                      </Link>
                    ))
                  ))}
                </div>
              </div>
            ))}

            {user ? (
              <div className="border-t pt-4">
                <div className="px-3 mb-3">
                  <p className="text-sm font-medium text-gray-900">{user.email}</p>
                  <p className="text-xs text-gray-500 capitalize">{userRole} Account</p>
                </div>
                {userFlow && userFlow.primaryActions.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {action.icon}
                    <span>{action.label}</span>
                  </Link>
                ))}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }
                  className="flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors w-full text-left"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="border-t pt-4 space-y-2">
                <Link
                  href="/login"
                  className="block px-3 py-2 text-center border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 text-center bg-[#2B5273] text-white rounded-md hover:bg-[#1E3142] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={() => setSearchOpen(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center space-x-2">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties, developments, or areas..."
                  className="flex-1 px-4 py-2 text-lg outline-none"
                  autoFocus
                />
              </div>
            </div>
            <div className="border-t px-6 py-4">
              <p className="text-sm text-gray-500">Popular searches:</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {['3 bed houses', 'Drogheda', 'New developments', 'First time buyer'].map((term) => (
                  <button
                    key={term}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};