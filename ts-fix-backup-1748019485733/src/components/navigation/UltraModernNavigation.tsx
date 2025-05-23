"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, Menu, X, User, Home, Building, Calculator,
  TrendingUp, FileText, Bell, Settings, Plus, BarChart2,
  MessageSquare, Calendar, DollarSign, Shield, Briefcase,
  ChevronRight, Sparkles, Heart, Map, Filter, Clock,
  Award, Target, Globe, Zap, Layers, Command, Bot,
  Brain, Mic, Camera, Share2, Bookmark, History
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useUserRole } from '@/context/UserRoleContext';
import { useAuth } from '@/context/AuthContext';
import { useTransaction } from '@/context/TransactionContext';
import { useRouter, usePathname } from 'next/navigation';

// Advanced AI Assistant with voice and visual search
const AIAssistant = ({ isOpen, onClose }) => {
  const [modesetMode] = useState('text'); // text: any, voice, visual
  const [querysetQuery] = useState('');
  const [isListeningsetIsListening] = useState(false);
  const [suggestionssetSuggestions] = useState([]);
  const [isProcessingsetIsProcessing] = useState(false);

  // Voice recognition setup
  useEffect(() => {
    if (mode === 'voice' && isListening) {
      // Implement voice recognition
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: React.ChangeEvent<HTMLInputElement>) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
        processQuery(transcript);
      };

      recognition.start();

      return () => recognition.stop();
    }
  }, [modeisListening]);

  const processQuery = async (text: any) => {
    setIsProcessing(true);
    // AI processing simulation
    setTimeout(() => {
      setSuggestions([
        {
          type: 'property',
          title: '3-bed houses in Dublin under €500k',
          confidence: 0.95,
          action: '/properties/search?location=dublin&beds=3&max=500000'
        },
        {
          type: 'insight',
          title: 'Market trend: Dublin property prices up 3.2% this quarter',
          confidence: 0.88,
          action: '/resources/market-reports/dublin'
        },
        {
          type: 'recommendation',
          title: 'Based on your search history, you might like Fitzgerald Gardens',
          confidence: 0.92,
          action: '/developments/fitzgerald-gardens'
        }
      ]);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={ opacity: 0 }
          animate={ opacity: 1 }
          exit={ opacity: 0 }
          className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={ scale: 0.9, opacity: 0 }
            animate={ scale: 1, opacity: 1 }
            exit={ scale: 0.9, opacity: 0 }
            className="bg-white rounded-3xl shadow-2xl w-[90%] max-w-4xl max-h-[80vh] overflow-hidden"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">AI Property Assistant</h2>
                    <p className="text-white/80">Ask me anything about properties</p>
                  </div>
                </div>
                <button onClick={onClose} className="text-white/80 hover:text-white">
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Mode selector */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setMode('text')}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                    mode === 'text' ? 'bg-white text-indigo-600' : 'bg-white/20 text-white'
                  }`}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Text</span>
                </button>
                <button
                  onClick={() => setMode('voice')}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                    mode === 'voice' ? 'bg-white text-indigo-600' : 'bg-white/20 text-white'
                  }`}
                >
                  <Mic className="h-4 w-4" />
                  <span>Voice</span>
                </button>
                <button
                  onClick={() => setMode('visual')}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                    mode === 'visual' ? 'bg-white text-indigo-600' : 'bg-white/20 text-white'
                  }`}
                >
                  <Camera className="h-4 w-4" />
                  <span>Visual</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {mode === 'text' && (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Find me a 3-bedroom house in Dublin under €500k..."
                    className="w-full p-4 pr-12 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                    value={query}
                    onChange={(e: React.MouseEvent) => setQuery(e.target.value)}
                    onKeyPress={(e: React.MouseEvent) => e.key === 'Enter' && processQuery(query)}
                  />
                  <button
                    onClick={() => processQuery(query)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              )}

              {mode === 'voice' && (
                <div className="text-center py-12">
                  <button
                    onClick={() => setIsListening(!isListening)}
                    className={`p-6 rounded-full transition-all ${
                      isListening 
                        ? 'bg-red-500 animate-pulse' 
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    <Mic className="h-12 w-12 text-white" />
                  </button>
                  <p className="mt-4 text-gray-600">
                    {isListening ? 'Listening...' : 'Click to speak'}
                  </p>
                  {query && (
                    <p className="mt-4 text-lg font-medium">"{query}"</p>
                  )}
                </div>
              )}

              {mode === 'visual' && (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Drag & drop an image or click to upload</p>
                  <p className="text-sm text-gray-500 mt-2">Find similar properties by image</p>
                  <input type="file" className="hidden" accept="image/*" />
                </div>
              )}

              {/* Results */}
              {isProcessing && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
                </div>
              )}

              {suggestions.length> 0 && !isProcessing && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">AI Suggestions</h3>
                  {suggestions.map((suggestionindex) => (
                    <motion.a
                      key={index}
                      href={suggestion.action}
                      className="block p-4 rounded-xl border border-gray-200 hover:border-indigo-500 hover:shadow-lg transition-all"
                      initial={ opacity: 0, y: 20 }
                      animate={ opacity: 1, y: 0 }
                      transition={ delay: index * 0.1 }
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              suggestion.type === 'property' ? 'bg-blue-100 text-blue-700' :
                              suggestion.type === 'insight' ? 'bg-green-100 text-green-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {suggestion.type}
                            </span>
                            <span className="text-sm text-gray-500">
                              {Math.round(suggestion.confidence * 100)}% confidence
                            </span>
                          </div>
                          <h4 className="font-medium text-gray-800">{suggestion.title}</h4>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </motion.a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Ultra-modern navigation with all features
export const UltraModernNavigation: React.FC = () => {
  const [isAIOpensetIsAIOpen] = useState(false);
  const [scrolledsetScrolled] = useState(false);
  const [mobileMenuOpensetMobileMenuOpen] = useState(false);
  const [searchFocusedsetSearchFocused] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { role } = useUserRole();
  const pathname = usePathname();
  const router = useRouter();

  // Scroll progress
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [01], ['0%', '100%']);

  // Adaptive navigation items based on user behavior
  const navigationItems = useMemo(() => {
    const baseItems = [
      { 
        id: 'properties',
        label: 'Properties',
        href: '/properties',
        icon: <Home className="h-4 w-4" />,
        megaMenu: true
      },
      {
        id: 'developments',
        label: 'Developments',
        href: '/developments',
        icon: <Building className="h-4 w-4" />,
        megaMenu: true
      },
      {
        id: 'first-time-buyers',
        label: 'First-Time Buyers',
        href: '/first-time-buyers',
        icon: <Heart className="h-4 w-4" />,
        badge: 'NEW',
        highlight: true
      },
      {
        id: 'solutions',
        label: 'Solutions',
        href: '/solutions',
        icon: <Layers className="h-4 w-4" />
      }
    ];

    // Add personalized items based on user role
    if (role === 'DEVELOPER') {
      baseItems.push({
        id: 'dev-analytics',
        label: 'Analytics',
        href: '/developer/analytics',
        icon: <BarChart2 className="h-4 w-4" />,
        roleSpecific: true
      });
    }

    return baseItems;
  }, [role]);

  // Smart scroll behavior
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;

      if (Math.abs(scrollY - lastScrollY) <5) {
        ticking = false;
        return;
      }

      setScrolled(scrollY> 20);
      lastScrollY = scrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsAIOpen(true);
      }

      // Quick search
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        document.getElementById('global-search')?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const navClasses = `
    fixed top-0 left-0 right-0 z-50 
    transition-all duration-500 ease-out
    ${scrolled 
      ? 'bg-white/95 backdrop-blur-xl shadow-lg' 
      : 'bg-transparent'
    }
  `;

  return (
    <>
      <motion.nav 
        className={navClasses}
        initial={ y: -100 }
        animate={ y: 0 }
        transition={ type: "spring", stiffness: 100, damping: 20 }
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            {/* Left side */}
            <div className="flex items-center space-x-8">
              {/* Animated Logo */}
              <Link href="/" className="group">
                <motion.div
                  whileHover={ scale: 1.05 }
                  whileTap={ scale: 0.95 }
                  className="relative h-12 w-36"
                >
                  <Image 
                    src="/images/Prop Branding/Prop Master_Logo- White.png" 
                    alt="Prop.ie" 
                    fill
                    className="object-contain"
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity rounded-lg"
                  />
                </motion.div>
              </Link>

              {/* Primary Navigation */}
              <nav className="hidden lg:flex lg:space-x-1">
                {navigationItems.map((item) => (
                  <NavigationItem key={item.id} item={item} />
                ))}
              </nav>
            </div>

            {/* Center - Smart Search */}
            <div className="hidden lg:flex items-center flex-1 max-w-xl mx-8">
              <div className={`relative w-full transition-all duration-300 ${
                searchFocused ? 'scale-105' : ''
              }`}>
                <input
                  id="global-search"
                  type="text"
                  placeholder="Search properties, areas, or ask AI..."
                  className="w-full px-4 py-2.5 pl-10 pr-20 rounded-full border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <button
                  onClick={() => setIsAIOpen(true)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm rounded-full hover:shadow-lg transition-all flex items-center space-x-1"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>AI</span>
                </button>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Quick Actions */}
              <div className="hidden lg:flex items-center space-x-2">
                <QuickAction icon={<Heart className="h-5 w-5" />} count={3} />
                <QuickAction icon={<History className="h-5 w-5" />} />
                <QuickAction icon={<Share2 className="h-5 w-5" />} />
              </div>

              {/* AI Assistant */}
              <button
                onClick={() => setIsAIOpen(true)}
                className="p-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg transition-all"
              >
                <Bot className="h-5 w-5" />
              </button>

              {/* Notifications */}
              <NotificationBell />

              {/* User Profile */}
              {isAuthenticated ? (
                <UserProfile user={user} />
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/login"
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile menu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600"
          style={ width: progressWidth }
        />
      </motion.nav>

      {/* AI Assistant Modal */}
      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} items={navigationItems} />
    </>
  );
};

// Navigation Item with mega menu support
const NavigationItem = ({ item }) => {
  const [isHoveredsetIsHovered] = useState(false);
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={item.href}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          isActive
            ? 'bg-indigo-50 text-indigo-700'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        {item.icon}
        <span>{item.label}</span>
        {item.badge && (
          <span className="px-2 py-0.5 text-xs bg-green-500 text-white rounded-full">
            {item.badge}
          </span>
        )}
      </Link>

      {item.megaMenu && isHovered && (
        <MegaMenu item={item} />
      )}
    </div>
  );
};

// Mega menu for complex navigation
const MegaMenu = ({ item }) => {
  return (
    <motion.div
      initial={ opacity: 0, y: -10 }
      animate={ opacity: 1, y: 0 }
      exit={ opacity: 0, y: -10 }
      className="absolute top-full left-0 mt-2 w-screen max-w-7xl -translate-x-1/2 left-1/2"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        {/* Mega menu content */}
        <div className="grid grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Browse by Type</h3>
            <ul className="space-y-2">
              <li><Link href="/properties/houses" className="text-gray-600 hover:text-indigo-600">Houses</Link></li>
              <li><Link href="/properties/apartments" className="text-gray-600 hover:text-indigo-600">Apartments</Link></li>
              <li><Link href="/properties/new-developments" className="text-gray-600 hover:text-indigo-600">New Developments</Link></li>
            </ul>
          </div>
          {/* More sections */}
        </div>
      </div>
    </motion.div>
  );
};

// Quick action buttons
const QuickAction = ({ icon, count }) => {
  return (
    <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
      {icon}
      {count && (
        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
};

// Notification bell with dropdown
const NotificationBell = () => {
  const [isOpensetIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
          3
        </span>
      </button>

      {isOpen && (
        <motion.div
          initial={ opacity: 0, y: -10 }
          animate={ opacity: 1, y: 0 }
          className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl"
        >
          {/* Notification content */}
        </motion.div>
      )}
    </div>
  );
};

// User profile with dropdown
const UserProfile = ({ user }) => {
  const [isOpensetIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <ChevronRight className={`h-4 w-4 text-gray-600 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      {isOpen && (
        <motion.div
          initial={ opacity: 0, y: -10 }
          animate={ opacity: 1, y: 0 }
          className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* User menu content */}
        </motion.div>
      )}
    </div>
  );
};

// Mobile menu with gesture support
const MobileMenu = ({ isOpen, onClose, items }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={ x: '100%' }
          animate={ x: 0 }
          exit={ x: '100%' }
          transition={ type: 'spring', damping: 30, stiffness: 300 }
          className="fixed inset-0 bg-white z-50"
        >
          {/* Mobile menu content */}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UltraModernNavigation;