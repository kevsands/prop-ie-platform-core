"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, Menu, X, User, Home, Building, Calculator,
  TrendingUp, FileText, Bell, Settings, Plus, BarChart2,
  MessageSquare, Calendar, DollarSign, Shield, Briefcase,
  ChevronRight, Sparkles, Heart, Map, Filter, Clock,
  Award, Target, Globe, Zap, Layers, Command, Brain,
  Bot, Mic, Camera, Share2, Bookmark, History, Eye,
  ArrowRight, Compass, Users, HelpCircle, LogOut,
  ChevronDown, Star, Gift, ShoppingCart, Scale, BookOpen
} from 'lucide-react';
import { useUserRole } from '@/context/UserRoleContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

// AI-powered search suggestions
const AISearchBar = () => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Simulate AI suggestions
  useEffect(() => {
    if (query.length > 2) {
      setLoading(true);
      setTimeout(() => {
        setSuggestions([
          {
            type: 'location',
            icon: <Map className="h-4 w-4" />,
            text: `Properties in ${query}`,
            subtext: '234 available',
            action: `/properties/search?location=${query}`
          },
          {
            type: 'smart',
            icon: <Sparkles className="h-4 w-4" />,
            text: `AI: 3-bed houses under €500k in ${query}`,
            subtext: 'Based on your preferences',
            action: `/ai-search?q=${query}`
          },
          {
            type: 'recent',
            icon: <Clock className="h-4 w-4" />,
            text: 'Recent search: Fitzgerald Gardens',
            subtext: 'Viewed yesterday',
            action: '/developments/fitzgerald-gardens'
          }
        ]);
        setLoading(false);
      }, 300);
    } else {
      setSuggestions([]);
    }
  }, [query]);
  
  return (
    <div className="relative flex-1 max-w-2xl mx-8">
      <div className={`relative transform transition-transform duration-200 ${focused ? 'scale-105' : ''}`}>
        <input
          type="text"
          placeholder="Search properties, areas, or ask AI anything..."
          className={`w-full px-5 py-3 pl-12 pr-32 rounded-full border-2 transition-all duration-200 ${
            focused 
              ? 'border-indigo-500 shadow-lg shadow-indigo-100' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
        />
        
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Mic className="h-4 w-4 text-gray-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Camera className="h-4 w-4 text-gray-500" />
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-full hover:shadow-lg transition-all flex items-center space-x-1">
            <Sparkles className="h-4 w-4" />
            <span>AI</span>
          </button>
        </div>
      </div>
      
      {/* Suggestions dropdown */}
      {focused && (query || suggestions.length > 0) && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
          {loading ? (
            <div className="p-4 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="py-2">
              {suggestions.map((suggestion, index) => (
                <Link
                  key={index}
                  href={suggestion.action}
                  className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      suggestion.type === 'smart' ? 'bg-indigo-100 text-indigo-600' :
                      suggestion.type === 'location' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {suggestion.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{suggestion.text}</p>
                      <p className="text-sm text-gray-500">{suggestion.subtext}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Press <kbd className="px-1.5 py-0.5 bg-gray-200 rounded">↵</kbd> to search or use <kbd className="px-1.5 py-0.5 bg-gray-200 rounded">⌘K</kbd> for AI assistant
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Smart user menu with personalized actions
const SmartUserMenu = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useAuth();
  const router = useRouter();
  
  const userActions = [
    {
      icon: <User className="h-4 w-4" />,
      label: 'My Profile',
      href: '/profile',
      badge: null
    },
    {
      icon: <Heart className="h-4 w-4" />,
      label: 'Saved Properties',
      href: '/saved',
      badge: '12'
    },
    {
      icon: <Clock className="h-4 w-4" />,
      label: 'Recent Views',
      href: '/recent',
      badge: '5'
    },
    {
      icon: <Calculator className="h-4 w-4" />,
      label: 'Mortgage Pre-Approval',
      href: '/mortgage/pre-approval',
      badge: 'New'
    },
    {
      icon: <Gift className="h-4 w-4" />,
      label: 'Referral Program',
      href: '/referrals',
      badge: '€50'
    }
  ];
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 pr-4 rounded-full hover:bg-gray-100 transition-colors"
      >
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium text-lg">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role || 'Member'}</p>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
            {/* User info header */}
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium text-xl">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>
              
              {/* User stats */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-white rounded-lg">
                  <p className="text-lg font-bold text-indigo-600">12</p>
                  <p className="text-xs text-gray-500">Saved</p>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <p className="text-lg font-bold text-green-600">3</p>
                  <p className="text-xs text-gray-500">Active</p>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <p className="text-lg font-bold text-purple-600">€50</p>
                  <p className="text-xs text-gray-500">Rewards</p>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="p-2">
              {userActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-500">{action.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{action.label}</span>
                  </div>
                  {action.badge && (
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      action.badge === 'New' ? 'bg-green-100 text-green-700' :
                      action.badge.startsWith('€') ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {action.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
            
            {/* Footer actions */}
            <div className="p-2 border-t border-gray-100">
              <Link
                href="/settings"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Settings className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Settings</span>
              </Link>
              <button
                onClick={() => {
                  signOut();
                  router.push('/');
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <LogOut className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Main navigation component
export const NextGenNavigation: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { role } = useUserRole();
  const pathname = usePathname();
  
  // Navigation items with role-based customization
  const navigationItems = useMemo(() => {
    const baseItems = [
      {
        id: 'properties',
        label: 'Properties',
        href: '/properties',
        icon: <Home className="h-4 w-4" />,
        dropdown: [
          { label: 'Search Properties', href: '/properties/search', icon: <Search className="h-4 w-4" /> },
          { label: 'New Developments', href: '/properties/new-developments', icon: <Building className="h-4 w-4" /> },
          { label: 'Map View', href: '/properties/map', icon: <Map className="h-4 w-4" /> },
          { label: 'Price Trends', href: '/properties/trends', icon: <TrendingUp className="h-4 w-4" /> }
        ]
      },
      {
        id: 'first-time-buyers',
        label: 'First-Time Buyers',
        href: '/first-time-buyers',
        icon: <Heart className="h-4 w-4" />,
        badge: 'NEW',
        highlight: true,
        dropdown: [
          { label: 'Getting Started', href: '/first-time-buyers/guide', icon: <Compass className="h-4 w-4" /> },
          { label: 'Help to Buy', href: '/first-time-buyers/htb', icon: <DollarSign className="h-4 w-4" /> },
          { label: 'Mortgage Calculator', href: '/first-time-buyers/calculator', icon: <Calculator className="h-4 w-4" /> },
          { label: 'Success Stories', href: '/first-time-buyers/stories', icon: <Star className="h-4 w-4" /> }
        ]
      },
      {
        id: 'solutions',
        label: 'Solutions',
        href: '/solutions',
        icon: <Layers className="h-4 w-4" />,
        dropdown: [
          { label: 'For Buyers', href: '/solutions/buyers', icon: <Users className="h-4 w-4" /> },
          { label: 'For Investors', href: '/solutions/investors', icon: <Briefcase className="h-4 w-4" /> },
          { label: 'For Developers', href: '/solutions/developers', icon: <Building className="h-4 w-4" /> },
          { label: 'For Agents', href: '/solutions/agents', icon: <Users className="h-4 w-4" /> }
        ]
      },
      {
        id: 'resources',
        label: 'Resources',
        href: '/resources',
        icon: <BookOpen className="h-4 w-4" />,
        dropdown: [
          { label: 'Buying Guides', href: '/resources/guides', icon: <BookOpen className="h-4 w-4" /> },
          { label: 'Market Reports', href: '/resources/reports', icon: <BarChart2 className="h-4 w-4" /> },
          { label: 'Legal Resources', href: '/resources/legal', icon: <Scale className="h-4 w-4" /> },
          { label: 'FAQ', href: '/resources/faq', icon: <HelpCircle className="h-4 w-4" /> }
        ]
      }
    ];
    
    // Add role-specific items
    if (role === 'DEVELOPER') {
      baseItems.push({
        id: 'dev-dashboard',
        label: 'Developer Hub',
        href: '/developer',
        icon: <Building className="h-4 w-4" />,
        roleSpecific: true
      });
    }
    
    return baseItems;
  }, [role]);
  
  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);
  
  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg translate-y-0' 
          : 'bg-white shadow-sm translate-y-0'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Left side - Logo and primary nav */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex-shrink-0">
                <div className="relative h-10 w-32 transform hover:scale-105 transition-transform duration-200">
                  <Image 
                    src="/images/Prop Branding/Prop Master_Logo- White.png" 
                    alt="Prop.ie" 
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>
              
              {/* Desktop navigation */}
              <nav className="hidden lg:flex lg:space-x-1">
                {navigationItems.map((item) => (
                  <NavigationItem key={item.id} item={item} />
                ))}
              </nav>
            </div>
            
            {/* Center - AI Search */}
            <div className="hidden lg:block flex-1">
              <AISearchBar />
            </div>
            
            {/* Right side - User actions */}
            <div className="flex items-center space-x-4">
              {/* Quick actions */}
              <div className="hidden md:flex items-center space-x-2">
                <button 
                  onClick={() => setCommandPaletteOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2"
                  title="Command Palette (⌘K)"
                >
                  <Command className="h-5 w-5 text-gray-500" />
                </button>
                
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                  <Bell className="h-5 w-5 text-gray-500" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>
                
                <button className="p-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all">
                  <Bot className="h-5 w-5" />
                </button>
              </div>
              
              {/* User menu */}
              {isAuthenticated ? (
                <SmartUserMenu user={user} />
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              )}
              
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300" style={{ width: '33%' }} />
        </div>
      </nav>
      
      {/* Command Palette */}
      {commandPaletteOpen && (
        <CommandPalette onClose={() => setCommandPaletteOpen(false)} />
      )}
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <MobileMenu 
          isOpen={mobileMenuOpen} 
          onClose={() => setMobileMenuOpen(false)}
          items={navigationItems}
        />
      )}
    </>
  );
};

// Navigation item with dropdown
const NavigationItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
  
  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        href={item.href}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          isActive
            ? 'bg-indigo-50 text-indigo-700'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        {item.icon}
        <span>{item.label}</span>
        {item.badge && (
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
            item.highlight 
              ? 'bg-gradient-to-r from-green-400 to-blue-400 text-white animate-pulse' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {item.badge}
          </span>
        )}
        {item.dropdown && (
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </Link>
      
      {/* Dropdown menu */}
      {item.dropdown && isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
          <div className="py-2">
            {item.dropdown.map((subItem, index) => (
              <Link
                key={index}
                href={subItem.href}
                className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-500">{subItem.icon}</span>
                <span className="text-sm font-medium text-gray-700">{subItem.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Command palette
const CommandPalette = ({ onClose }) => {
  const [query, setQuery] = useState('');
  
  const commands = [
    { icon: <Search className="h-5 w-5" />, label: 'Search properties', action: '/properties/search' },
    { icon: <Calculator className="h-5 w-5" />, label: 'Mortgage calculator', action: '/resources/calculator' },
    { icon: <Heart className="h-5 w-5" />, label: 'Saved properties', action: '/saved' },
    { icon: <Building className="h-5 w-5" />, label: 'New developments', action: '/developments' },
    { icon: <HelpCircle className="h-5 w-5" />, label: 'Help center', action: '/help' }
  ];
  
  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );
  
  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-50">
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            <Command className="h-6 w-6 text-indigo-600" />
            <input
              type="text"
              placeholder="Type a command or search..."
              className="flex-1 text-lg outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="space-y-1">
            {filteredCommands.map((cmd, index) => (
              <Link
                key={index}
                href={cmd.action}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={onClose}
              >
                <span className="text-gray-500">{cmd.icon}</span>
                <span className="font-medium text-gray-700">{cmd.label}</span>
                <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
              </Link>
            ))}
          </div>
        </div>
        
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>esc Close</span>
            </div>
            <span>⌘K to open anywhere</span>
          </div>
        </div>
      </div>
    </>
  );
};

// Mobile menu
const MobileMenu = ({ isOpen, onClose, items }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <Image 
              src="/images/Prop Branding/Prop Master_Logo- White.png" 
              alt="Prop.ie" 
              width={120}
              height={40}
              className="object-contain"
            />
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="space-y-1">
            {items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={onClose}
              >
                <span className="text-gray-500">{item.icon}</span>
                <span className="font-medium text-gray-700">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default NextGenNavigation;