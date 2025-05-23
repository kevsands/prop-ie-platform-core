"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, Menu, X, User, Home, Building, Calculator,
  TrendingUp, FileText, Bell, Settings, Plus, BarChart2,
  MessageSquare, Calendar, DollarSign, Shield, Briefcase,
  ChevronRight, Sparkles, Heart, Map, Filter, Clock,
  Award, Target, Globe, Zap, Layers, Command
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserRole } from '@/context/UserRoleContext';
import { useAuth } from '@/context/AuthContext';
import { useTransaction } from '@/context/TransactionContext';
import { useRouter, usePathname } from 'next/navigation';

// AI-powered command palette for quick actions
const CommandPalette = ({ isOpen, onClose, userActions }) => {
  const [querysetQuery] = useState('');
  const [suggestionssetSuggestions] = useState([]);

  // AI-powered search with natural language processing
  const searchActions = (searchQuery: any) => {
    // This would connect to an AI service for natural language understanding
    const filtered = userActions.filter(action: any => 
      action.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.keywords?.some(keyword: any => keyword.includes(searchQuery.toLowerCase()))
    );

    return filtered.slice(05);
  };

  useEffect(() => {
    if (query) {
      setSuggestions(searchActions(query));
    } else {
      setSuggestions(userActions.slice(05));
    }
  }, [queryuserActions]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={ opacity: 0 }
          animate={ opacity: 1 }
          exit={ opacity: 0 }
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={ scale: 0.95, opacity: 0 }
            animate={ scale: 1, opacity: 1 }
            exit={ scale: 0.95, opacity: 0 }
            className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-2xl max-h-[70vh] overflow-hidden"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <input
                  type="text"
                  placeholder="What would you like to do?"
                  className="flex-1 text-lg outline-none"
                  value={query}
                  onChange={(e: React.MouseEvent) => setQuery(e.target.value)}
                  autoFocus
                />
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-2">
                {suggestions.map((action: anyindex) => (
                  <motion.a
                    key={action.id}
                    href={action.href}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                    initial={ opacity: 0, y: 10 }
                    animate={ opacity: 1, y: 0 }
                    transition={ delay: index * 0.05 }
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform`}>
                        {action.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{action.label}</h3>
                        <p className="text-sm text-gray-500">{action.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                  </motion.a>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <kbd className="px-2 py-1 bg-gray-100 rounded">⌘K</kbd>
                  <span>to open anywhere</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>Powered by AI</span>
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Smart notification center with AI-powered insights
const SmartNotificationCenter = () => {
  const [isOpensetIsOpen] = useState(false);
  const { notifications } = useNotifications(); // Custom hook

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell className="h-5 w-5" />
        {notifications.unread> 0 && (
          <motion.span
            initial={ scale: 0 }
            animate={ scale: 1 }
            className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
          >
            {notifications.unread}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={ opacity: 0, y: -10 }
            animate={ opacity: 1, y: 0 }
            exit={ opacity: 0, y: -10 }
            className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-4 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
              <h3 className="font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                AI-Powered Insights
              </h3>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.items.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 border-b hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${notification.color} text-white`}>
                      {notification.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main Revolutionary Navigation Component
export const RevolutionaryNavigation: React.FC<{ theme?: 'light' | 'dark' }> = ({ theme = 'light' }) => {
  const [isCommandPaletteOpensetCommandPaletteOpen] = useState(false);
  const [scrolledsetScrolled] = useState(false);
  const [mobileMenuOpensetMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { role } = useUserRole();
  const { transactions } = useTransaction();
  const pathname = usePathname();
  const router = useRouter();

  // Adaptive user actions based on behavior analysis
  const userActions = useMemo(() => {
    const baseActions = [
      {
        id: 'search',
        label: 'Search Properties',
        description: 'Find your perfect home with AI',
        href: '/properties/search',
        icon: <Search className="h-5 w-5" />,
        color: 'bg-blue-500',
        keywords: ['find', 'search', 'property', 'home', 'house']
      },
      {
        id: 'calculator',
        label: 'Mortgage Calculator',
        description: 'Calculate your monthly payments',
        href: '/resources/calculators/mortgage',
        icon: <Calculator className="h-5 w-5" />,
        color: 'bg-green-500',
        keywords: ['calculator', 'mortgage', 'payment', 'finance']
      },
      {
        id: 'ai-advisor',
        label: 'AI Property Advisor',
        description: 'Get personalized recommendations',
        href: '/ai-advisor',
        icon: <Sparkles className="h-5 w-5" />,
        color: 'bg-purple-500',
        keywords: ['ai', 'advisor', 'recommendation', 'help']
      }
    ];

    // Add role-specific actions
    if (role === 'BUYER') {
      baseActions.push({
        id: 'journey',
        label: 'My Buying Journey',
        description: 'Track your progress',
        href: '/buyer/journey',
        icon: <Target className="h-5 w-5" />,
        color: 'bg-indigo-500',
        keywords: ['journey', 'progress', 'track']
      });
    }

    return baseActions;
  }, [role]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY> 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyPress = (e: React.MouseEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const navClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    scrolled 
      ? 'bg-white/95 backdrop-blur-lg shadow-lg' 
      : theme === 'dark' 
        ? 'bg-transparent' 
        : 'bg-white shadow-sm'
  }`;

  return (
    <>
      <motion.nav 
        className={navClasses}
        initial={ y: -100 }
        animate={ y: 0 }
        transition={ type: "spring", stiffness: 100 }
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo with animation */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3 group">
                <motion.div
                  whileHover={ scale: 1.05 }
                  whileTap={ scale: 0.95 }
                  className="relative h-10 w-32"
                >
                  <Image 
                    src="/images/Prop Branding/Prop Master_Logo- White.png" 
                    alt="Prop.ie" 
                    fill
                    className="object-contain"
                  />
                </motion.div>
              </Link>

              {/* Primary Navigation */}
              <nav className="hidden lg:ml-8 lg:flex lg:space-x-6">
                <NavItem href="/properties" label="Properties" icon={<Home className="h-4 w-4" />} />
                <NavItem href="/developments" label="Developments" icon={<Building className="h-4 w-4" />} />
                <NavItem href="/first-time-buyers" label="First-Time Buyers" icon={<Heart className="h-4 w-4" />} isNew />
                <NavItem href="/solutions" label="Solutions" icon={<Layers className="h-4 w-4" />} />
              </nav>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Command palette trigger */}
              <button
                onClick={() => setCommandPaletteOpen(true)}
                className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Command className="h-4 w-4" />
                <span className="text-sm text-gray-600">Quick Actions</span>
                <kbd className="text-xs bg-white px-1.5 py-0.5 rounded">⌘K</kbd>
              </button>

              {/* AI Chat Assistant */}
              <button className="p-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg transition-shadow">
                <MessageSquare className="h-5 w-5" />
              </button>

              {/* Smart Notifications */}
              <SmartNotificationCenter />

              {/* User Profile */}
              {isAuthenticated ? (
                <UserMenu user={user} />
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600"
          initial={ width: "0%" }
          animate={ width: `${scrollProgress}%` }
        />
      </motion.nav>

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        userActions={userActions}
      />

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};

// Navigation Item Component
const NavItem = ({ href, label, icon, isNew = false }) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname?.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
        isActive
          ? 'bg-indigo-50 text-indigo-700'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span>{label}</span>
      {isNew && (
        <span className="px-2 py-0.5 text-xs bg-green-500 text-white rounded-full">NEW</span>
      )}
    </Link>
  );
};

// User Menu Component
const UserMenu = ({ user }) => {
  const [isOpensetIsOpen] = useState(false);
  const { signOut } = useAuth();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white">
          {user?.name?.charAt(0) || <User className="h-4 w-4" />}
        </div>
        <ChevronRight className={`h-4 w-4 text-gray-600 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={ opacity: 0, y: -10 }
            animate={ opacity: 1, y: 0 }
            exit={ opacity: 0, y: -10 }
            className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50">
              <h3 className="font-semibold text-gray-800">{user?.name}</h3>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>

            <div className="p-2">
              <Link
                href="/dashboard"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <BarChart2 className="h-5 w-5 text-gray-600" />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/settings"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Settings className="h-5 w-5 text-gray-600" />
                <span>Settings</span>
              </Link>

              <button
                onClick={signOut}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left"
              >
                <Shield className="h-5 w-5 text-gray-600" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Mobile Menu Component
const MobileMenu = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={ opacity: 0 }
          animate={ opacity: 1 }
          exit={ opacity: 0 }
          className="fixed inset-0 bg-white z-50 lg:hidden"
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-8">
              <Image 
                src="/images/Prop Branding/Prop Master_Logo- White.png" 
                alt="Prop.ie" 
                width={120}
                height={40}
                className="object-contain"
              />
              <button onClick={onClose}>
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="space-y-4">
              <MobileNavItem href="/properties" label="Properties" icon={<Home className="h-5 w-5" />} />
              <MobileNavItem href="/developments" label="Developments" icon={<Building className="h-5 w-5" />} />
              <MobileNavItem href="/first-time-buyers" label="First-Time Buyers" icon={<Heart className="h-5 w-5" />} />
              <MobileNavItem href="/solutions" label="Solutions" icon={<Layers className="h-5 w-5" />} />
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Mobile Navigation Item
const MobileNavItem = ({ href, label, icon }) => {
  return (
    <Link
      href={href}
      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
        {icon}
      </div>
      <span className="font-medium text-gray-800">{label}</span>
    </Link>
  );
};

// Custom hook for notifications
const useNotifications = () => {
  // This would connect to your notification system
  return {
    notifications: {
      unread: 3,
      items: [
        {
          id: 1,
          title: 'New property match',
          message: 'A property matching your criteria is now available',
          time: '2 minutes ago',
          icon: <Home className="h-4 w-4" />,
          color: 'bg-blue-500'
        },
        {
          id: 2,
          title: 'Price drop alert',
          message: 'A property you viewed has reduced in price',
          time: '1 hour ago',
          icon: <TrendingUp className="h-4 w-4" />,
          color: 'bg-green-500'
        },
        {
          id: 3,
          title: 'Document required',
          message: 'Please upload proof of funds for your application',
          time: '3 hours ago',
          icon: <FileText className="h-4 w-4" />,
          color: 'bg-orange-500'
        }
      ]
    }
  };
};

export default RevolutionaryNavigation;