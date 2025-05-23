"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, ChevronDown, Menu, X, User, Home, HelpCircle, Compass, 
  BookOpen, Calculator, FileText, BarChart2, Building, Users, LogOut,
  Shield, DollarSign, Briefcase, Scale, TrendingUp, Package,
  MessageSquare, Bell, CreditCard, FolderOpen, CheckCircle, Plus, Upload,
  Calendar, Megaphone, Settings, ShoppingCart, ChevronRight, Sparkles
} from 'lucide-react';
import ProfessionalBanner from './ProfessionalBanner';
import { useUserRole } from '@/context/UserRoleContext';
import NotificationCenter from '@/components/ui/NotificationCenter';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTransaction } from '@/context/TransactionContext';

interface EnhancedMainNavigationProps {
  theme?: 'light' | 'dark';
  isTransparent?: boolean;
}

interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: number | string;
  tag?: string;
  description?: string;
  isNew?: boolean;
  requiresAuth?: boolean;
  roles?: string[];
  children?: NavigationItem[];
}

interface UserFlow {
  role: string;
  primaryActions: NavigationItem[];
  quickActions: NavigationItem[];
  dashboardRoute: string;
}

export const EnhancedMainNavigation: React.FC<EnhancedMainNavigationProps> = ({ 
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
  const { transactions } = useTransaction();

  const [activeDropdownsetActiveDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [scrolledsetScrolled] = useState(false);

  // Define user flows for each role
  const userFlows: UserFlow[] = [
    {
      role: 'BUYER',
      dashboardRoute: '/buyer',
      primaryActions: [
        { 
          label: 'Property Search', 
          href: '/properties',
          icon: <Search size={18} />,
          description: 'Find your dream home',
          requiresAuth: true
        },
        { 
          label: 'My Journey', 
          href: '/buyer/journey',
          icon: <Compass size={18} />,
          description: 'Track your buying process',
          requiresAuth: true,
          badge: 'Active'
        },
        { 
          label: 'Documents', 
          href: '/buyer/documents',
          icon: <FileText size={18} />,
          description: 'Manage your documents',
          requiresAuth: true,
          badge: transactions?.filter(t => t.buyerId === user?.id && t.pendingDocs> 0).length || undefined
        },
        { 
          label: 'Help to Buy', 
          href: '/buyer/htb',
          icon: <DollarSign size={18} />,
          description: 'First-time buyer assistance',
          requiresAuth: true,
          isNew: true
        }
      ],
      quickActions: [
        { label: 'Mortgage Calculator', href: '/resources/calculators/mortgage-calculator', icon: <Calculator size={16} /> },
        { label: 'First Time Buyer Guide', href: '/resources/property-guides/first-time-buyer-guide', icon: <BookOpen size={16} /> },
        { label: 'Market Reports', href: '/resources/market-reports', icon: <BarChart2 size={16} /> }
      ]
    },
    {
      role: 'DEVELOPER',
      dashboardRoute: '/developer',
      primaryActions: [
        { 
          label: 'Projects', 
          href: '/developer/projects',
          icon: <Building size={18} />,
          description: 'Manage your developments',
          requiresAuth: true,
          children: [
            { label: 'Active Projects', href: '/developer/projects', icon: <Package size={18} /> },
            { label: 'New Project', href: '/developer/projects/new', icon: <Plus size={18} /> },
            { label: 'Project Analytics', href: '/developer/analytics', icon: <BarChart2 size={18} /> },
            { label: 'Sales Pipeline', href: '/developer/sales', icon: <TrendingUp size={18} /> }
          ]
        },
        { 
          label: 'Transactions', 
          href: '/developer/transactions',
          icon: <FileText size={18} />,
          description: 'Track sales & contracts',
          requiresAuth: true,
          badge: transactions?.filter(t => t.developerId === user?.id && t.status !== 'COMPLETED').length || undefined
        },
        { 
          label: 'Documents', 
          href: '/developer/documents',
          icon: <FolderOpen size={18} />,
          description: 'Legal & compliance docs',
          requiresAuth: true
        },
        { 
          label: 'Finance', 
          href: '/developer/finance',
          icon: <DollarSign size={18} />,
          description: 'Financial management',
          requiresAuth: true
        }
      ],
      quickActions: [
        { label: 'Upload Document', href: '/developer/documents/upload', icon: <Upload size={16} /> },
        { label: 'Create Sales Report', href: '/developer/reports/new', icon: <FileText size={16} /> },
        { label: 'View Analytics', href: '/developer/analytics', icon: <BarChart2 size={16} /> }
      ]
    },
    {
      role: 'AGENT',
      dashboardRoute: '/agents',
      primaryActions: [
        { 
          label: 'Listings', 
          href: '/agents/listings',
          icon: <Building size={18} />,
          description: 'Manage property listings',
          requiresAuth: true
        },
        { 
          label: 'Leads', 
          href: '/agents/leads',
          icon: <Users size={18} />,
          description: 'Track potential buyers',
          requiresAuth: true,
          badge: 'New',
          isNew: true
        },
        { 
          label: 'Viewings', 
          href: '/agents/viewings',
          icon: <Calendar size={18} />,
          description: 'Schedule & manage viewings',
          requiresAuth: true
        },
        { 
          label: 'Performance', 
          href: '/agents/performance',
          icon: <BarChart2 size={18} />,
          description: 'Sales metrics & goals',
          requiresAuth: true
        }
      ],
      quickActions: [
        { label: 'Add Listing', href: '/agents/listings/new', icon: <Plus size={16} /> },
        { label: 'Schedule Viewing', href: '/agents/viewings/new', icon: <Calendar size={16} /> },
        { label: 'Marketing Tools', href: '/agents/marketing', icon: <Megaphone size={16} /> }
      ]
    },
    {
      role: 'SOLICITOR',
      dashboardRoute: '/solicitor',
      primaryActions: [
        { 
          label: 'Cases', 
          href: '/solicitor/cases',
          icon: <Briefcase size={18} />,
          description: 'Active conveyancing cases',
          requiresAuth: true,
          badge: transactions?.filter(t => t.status === 'CONTRACTED').length || undefined
        },
        { 
          label: 'Documents', 
          href: '/solicitor/documents',
          icon: <FileText size={18} />,
          description: 'Legal documentation',
          requiresAuth: true
        },
        { 
          label: 'Compliance', 
          href: '/solicitor/compliance',
          icon: <Shield size={18} />,
          description: 'KYC/AML management',
          requiresAuth: true
        },
        { 
          label: 'Billing', 
          href: '/solicitor/billing',
          icon: <CreditCard size={18} />,
          description: 'Invoices & payments',
          requiresAuth: true
        }
      ],
      quickActions: [
        { label: 'New Case', href: '/solicitor/cases/new', icon: <Plus size={16} /> },
        { label: 'Document Templates', href: '/solicitor/templates', icon: <FileText size={16} /> },
        { label: 'Compliance Check', href: '/solicitor/compliance/check', icon: <Shield size={16} /> }
      ]
    },
    {
      role: 'INVESTOR',
      dashboardRoute: '/investor',
      primaryActions: [
        { 
          label: 'Portfolio', 
          href: '/investor/portfolio',
          icon: <Briefcase size={18} />,
          description: 'Your property investments',
          requiresAuth: true
        },
        { 
          label: 'Market Analysis', 
          href: '/investor/market',
          icon: <TrendingUp size={18} />,
          description: 'Market trends & insights',
          requiresAuth: true
        },
        { 
          label: 'Opportunities', 
          href: '/investor/opportunities',
          icon: <Compass size={18} />,
          description: 'Investment opportunities',
          requiresAuth: true,
          isNew: true
        },
        { 
          label: 'Financial', 
          href: '/investor/financial',
          icon: <DollarSign size={18} />,
          description: 'Returns & performance',
          requiresAuth: true
        }
      ],
      quickActions: [
        { label: 'ROI Calculator', href: '/investor/calculators/roi', icon: <Calculator size={16} /> },
        { label: 'Market Report', href: '/resources/market-reports', icon: <BarChart2 size={16} /> },
        { label: 'Tax Guide', href: '/resources/investor-tax-guide', icon: <FileText size={16} /> }
      ]
    }
  ];

  // Get current user flow
  const currentUserFlow = userFlows.find(flow => flow.role === (user?.role || role)) || null;

  // Navigation sections for all users
  const navigationSections = [
    {
      title: 'Properties',
      key: 'properties',
      items: [
        {
          section: 'AI & Search',
          links: [
            { href: '/properties/search', label: 'AI Property Search', icon: <Sparkles size={18} />, tag: 'Find your perfect home with AI', highlight: true }]
        },
        { 
          section: "Browse By Type", 
          links: [
            { href: "/properties/houses", label: "Houses", icon: <Home size={18} />, tag: "Find your perfect house" },
            { href: "/properties/apartments", label: "Apartments", icon: <Building size={18} />, tag: "Explore apartment listings" },
            { href: "/properties/new-developments", label: "New Developments", icon: <Compass size={18} />, tag: "Brand new properties" },
            { href: "/first-time-buyers", label: "First-Time Buyers Portal", icon: <Users size={18} />, tag: "Special programs and resources for first-time buyers" }
          ]
        },
        { 
          section: "Browse By Area", 
          links: [
            { href: "/properties/dublin", label: "Dublin", tag: "Properties in Dublin area" },
            { href: "/properties/cork", label: "Cork", tag: "Properties in Cork area" },
            { href: "/properties/galway", label: "Galway", tag: "Properties in Galway area" },
            { href: "/properties/other-areas", label: "Other Areas", tag: "Browse all locations" }
          ]
        }
      ],
      featuredContent: {
        title: "Featured Development",
        description: "Fitzgerald Gardens - New phase just released",
        image: "/images/developments/fitzgerald-gardens.jpg",
        href: "/developments/fitzgerald-gardens"
      }
    },
    {
      title: 'Solutions',
      key: 'solutions',
      items: [
        { 
          section: "Home Buyers", 
          links: [
            { href: "/first-time-buyers", label: "First-Time Buyers", icon: <Users size={18} />, tag: "Find your first home with ease" },
            { href: "/prop-choice", label: "PROP Choice", icon: <Settings size={18} />, tag: "Customise your home & buy furniture at point of sale" },
            { href: "/buy-off-plan", label: "Buy Off-Plan Online", icon: <ShoppingCart size={18} />, tag: "How it works: digital contracts, secure payments, instant reservation" }
          ]
        },
        { 
          section: "Investors", 
          links: [
            { href: "/solutions/professional-investors", label: "Professional Investors", icon: <TrendingUp size={18} />, tag: "Maximise your property portfolio" },
            { href: "/solutions/institutional-investors", label: "Institutional Investors", icon: <BarChart2 size={18} />, tag: "Large-scale property investment" }
          ]
        },
        { 
          section: "Developers", 
          links: [
            { href: "/solutions/developer-platform", label: "Developer Platform", icon: <Building size={18} />, tag: "End-to-end development management" },
            { href: "/solutions/sales-management", label: "Sales Management", icon: <BarChart2 size={18} />, tag: "Track and manage property sales" },
            { href: "/solutions/analytics-insights", label: "Analytics & Insights", icon: <BarChart2 size={18} />, tag: "Performance data for developments" },
            { href: "/solutions/marketing-tools", label: "Marketing Tools", icon: <Megaphone size={18} />, tag: "Promote your developments" }
          ]
        },
        { 
          section: "Other Professionals", 
          links: [
            { href: "/solutions/estate-agents", label: "Estate Agents", icon: <Users size={18} />, tag: "Property listing and management" },
            { href: "/solutions/solicitors", label: "Solicitors", icon: <FileText size={18} />, tag: "Legal and conveyancing tools" },
            { href: "/solutions/architects-engineers", label: "Architects & Engineers", icon: <Settings size={18} />, tag: "Design and planning resources" }
          ]
        }
      ]
    },
    {
      title: 'Resources',
      key: 'resources',
      items: [
        { 
          section: "Guides & Tools", 
          links: [
            { href: "/resources/property-guides", label: "Property Guides", icon: <BookOpen size={18} />, tag: "Comprehensive guides" },
            { href: "/resources/calculators/mortgage-calculator", label: "Mortgage Calculator", icon: <Calculator size={18} />, tag: "Plan your finances" },
            { href: "/resources/templates", label: "Document Templates", icon: <FileText size={18} />, tag: "Ready-to-use documents" }
          ]
        },
        { 
          section: "Market Information", 
          links: [
            { href: "/resources/market-reports", label: "Market Reports", icon: <BarChart2 size={18} />, tag: "Latest insights" },
            { href: "/resources/property-guides/first-time-buyer-guide", label: "First-Time Buyer Guide", icon: <HelpCircle size={18} />, tag: "Complete guidance" }
          ]
        }
      ]
    },
    {
      title: 'Company',
      key: 'company',
      items: [
        { 
          section: "About Us", 
          links: [
            { href: "/company/about", label: "Our Story", icon: <Users size={18} />, tag: "Learn about PropIE" },
            { href: "/contact", label: "Contact Us", icon: <HelpCircle size={18} />, tag: "Get in touch" }
          ]
        },
        { 
          section: "Corporate", 
          links: [
            { href: "/company/careers", label: "Careers", icon: <Users size={18} />, tag: "Join our team" },
            { href: "/company/press", label: "Press & Media", icon: <FileText size={18} />, tag: "News and announcements" }
          ]
        }
      ]
    }
  ];

  // Handle scroll
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

  // Dynamic navigation classes
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

  // Get transaction count for current user
  const getTransactionCount = () => {
    if (!user || !transactions) return 0;
    return transactions.filter(t => {
      if (user.role === 'BUYER') return t.buyerId === user.id && t.status !== 'COMPLETED';
      if (user.role === 'DEVELOPER') return t.developerId === user.id && t.status !== 'COMPLETED';
      if (user.role === 'SOLICITOR') return t.solicitorId === user.id && t.status !== 'COMPLETED';
      if (user.role === 'AGENT') return t.agentId === user.id && t.status !== 'COMPLETED';
      return false;
    }).length;
  };

  const transactionCount = getTransactionCount();

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
                {/* Role-specific primary actions */}
                {isAuthenticated && currentUserFlow && (
                  <>
                    <div className="flex items-center space-x-4 mr-4 pl-4 border-l border-gray-300">
                      {currentUserFlow.primaryActions.map((action: any) => (
                        <RoleNavItem 
                          key={action.href} 
                          item={action} 
                          textColor={textColorClass}
                          isActive={pathname === action.href || pathname?.startsWith(action.href + '/')}
                          onMouseEnter={() => action.children && handleDropdownEnter(action.href)}
                          onMouseLeave={handleDropdownLeave}
                          activeDropdown={activeDropdown}
                        />
                      ))}
                    </div>
                    <div className="border-l border-gray-300"></div>
                  </>
                )}

                {/* General navigation sections */}
                {navigationSections.map((section: any) => (
                  <DesktopDropdown 
                    key={section.key}
                    title={section.title}
                    textColor={textColorClass}
                    isActive={activeDropdown === section.key}
                    onMouseEnter={() => handleDropdownEnter(section.key)}
                    onMouseLeave={handleDropdownLeave}
                    items={section.items}
                    featuredContent={section.featuredContent}
                  />
                ))}
              </div>
            </div>

            <div className="hidden md:flex md:items-center md:space-x-4">
              {/* Search */}
              <button 
                onClick={() => setSearchOpen(true)}
                className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${textColorClass}`}
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Notifications */}
              <NotificationCenter />

              {/* Transaction Badge */}
              {transactionCount> 0 && (
                <div className="relative">
                  <Link 
                    href="/transactions"
                    className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${textColorClass} relative`}
                  >
                    <FileText className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                      {transactionCount}
                    </span>
                  </Link>
                </div>
              )}

              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Link
                    href={currentUserFlow?.dashboardRoute || '/dashboard'}
                    className={`px-4 py-2 rounded-md font-medium transition-all hover:bg-gray-100 ${textColorClass}`}
                  >
                    Dashboard
                  </Link>
                  <div className="flex items-center">
                    <div className="flex flex-col mr-2 items-end">
                      <span className={`text-sm font-medium ${textColorClass}`}>{user?.name || user?.email}</span>
                      <span className={`text-xs opacity-75 capitalize ${textColorClass}`}>{user?.role || 'User'}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${textColorClass}`}
                    >
                      <LogOut className="h-5 w-5" />
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
                    className={`px-4 py-2 rounded-md font-medium transition-all bg-[#2B5273] text-white hover:bg-[#1E3142]`}
                  >
                    Sign Up
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
        <MobileMenu 
          isOpen={mobileMenuOpen}
          userFlow={currentUserFlow}
          navigationSections={navigationSections}
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={handleLogout}
        />
      </nav>

      {/* Search Overlay */}
      <SearchOverlay 
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        quickLinks={currentUserFlow?.quickActions || []}
      />
    </>
  );
};

// Role-specific navigation item component
function RoleNavItem({ 
  item, 
  textColor, 
  isActive, 
  onMouseEnter, 
  onMouseLeave,
  activeDropdown 
}: {
  item: NavigationItem;
  textColor: string;
  isActive: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  activeDropdown?: string | null;
}) {
  const [isDropdownActivesetIsDropdownActive] = useState(false);

  useEffect(() => {
    setIsDropdownActive(activeDropdown === item.href);
  }, [activeDropdown, item.href]);

  if (item.children) {
    return (
      <div 
        className="relative" 
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <button
          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${textColor} hover:bg-gray-100 transition-all ${isActive ? 'bg-gray-100' : ''}`}
        >
          {item.icon}
          <span className="ml-2">{item.label}</span>
          {item.badge && (
            <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-red-500 text-white">
              {item.badge}
            </span>
          )}
          <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isDropdownActive ? 'rotate-180' : ''}`} />
        </button>

        <div className={`absolute z-10 mt-2 w-64 rounded-md shadow-lg bg-white transition-all duration-200 ${
          isDropdownActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[-10px] pointer-events-none'
        }`}>
          <div className="py-1">
            {item.children.map((child: any) => (
              <Link
                key={child.href}
                href={child.href}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {child.icon}
                <span className="ml-3">{child.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${textColor} hover:bg-gray-100 transition-all ${isActive ? 'bg-gray-100' : ''}`}
    >
      {item.icon}
      <span className="ml-2">{item.label}</span>
      {item.badge && (
        <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-red-500 text-white">
          {item.badge}
        </span>
      )}
      {item.isNew && (
        <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-green-500 text-white">
          NEW
        </span>
      )}
    </Link>
  );
}

// Desktop dropdown component
function DesktopDropdown({ title, items, textColor, featuredContent, isActive, onMouseEnter, onMouseLeave }) {
  return (
    <div 
      className="relative" 
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${textColor} hover:bg-gray-100 transition-all`}
      >
        {title}
        <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isActive ? 'rotate-180' : ''}`} />
      </button>
      <div className={`absolute z-10 mt-2 w-screen max-w-5xl rounded-xl shadow-xl bg-white left-1/2 transform -translate-x-1/2 transition-all duration-200 ${
        isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[-10px] pointer-events-none'
      }`}>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Render each section as a column */}
          {items.map((section: any, idx: any) => (
            <div key={section.section || idx: any} className="min-w-[200px]">
              <h4 className="text-xs font-bold text-gray-700 mb-4 uppercase tracking-wide">{section.section: any}</h4>
              <ul className="space-y-3">
                {section.links.map(link: any => (
                  <li key={link.href}>
                    <Link href={link.href} className="flex items-start gap-3 group hover:bg-gray-100 rounded-lg p-2 transition-colors">
                      {link.icon && <span className="mt-1 text-[#2B5273]">{link.icon}</span>}
                      <span>
                        <span className="block font-medium text-gray-900 group-hover:text-[#2B5273]">{link.label}</span>
                        {link.tag && <span className="block text-xs text-gray-500">{link.tag}</span>}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {/* Featured content on the right */}
          {featuredContent && (
            <div className="col-span-1 flex flex-col justify-between bg-gray-100 rounded-xl overflow-hidden shadow-md">
              <div className="relative h-32 w-full mb-4">
                <Image src={featuredContent.image} alt={featuredContent.title} fill className="object-cover rounded-t-xl" />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <h5 className="text-lg font-bold text-gray-900 mb-2">{featuredContent.title}</h5>
                <p className="text-sm text-gray-600 mb-4">{featuredContent.description}</p>
                <Link href={featuredContent.href} className="text-[#2B5273] font-medium hover:underline flex items-center">
                  Learn more <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
        <div className="px-6 pb-4 flex justify-between text-xs text-gray-500 border-t border-gray-100 mt-4">
          <span>Need help? <Link href="/contact" className="text-[#2B5273] hover:underline">Contact our team</Link></span>
          <Link href="/resources" className="text-[#2B5273] hover:underline">View all resources</Link>
        </div>
      </div>
    </div>
  );
}

// Mobile menu component (simplified for brevity)
function MobileMenu({ isOpen, userFlow, navigationSections, isAuthenticated, user, onLogout }) {
  return (
    <div className={`lg:hidden bg-white shadow-lg transition-all duration-300 ${
      isOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
    }`}>
      {/* Mobile menu content */}
    </div>
  );
}

// Search overlay component (simplified for brevity)
function SearchOverlay({ isOpen, onClose, searchQuery, onSearchChange, quickLinks }) {
  return (
    <div className={`fixed inset-0 bg-black z-50 flex items-start justify-center transition-opacity duration-300 ${
      isOpen ? 'bg-opacity-50 opacity-100' : 'bg-opacity-0 opacity-0 pointer-events-none'
    }`} onClick={onClose}>
      {/* Search overlay content */}
    </div>
  );
}

export default EnhancedMainNavigation;