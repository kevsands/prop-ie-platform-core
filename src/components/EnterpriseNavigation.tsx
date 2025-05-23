import React from 'react';
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  FiHome,
  FiCode,
  FiPackage,
  FiUser,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiShield,
  FiCpu,
  FiTrendingUp,
  FiBell,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const navigationItems = [
  {
    title: 'Dashboard',
    icon: FiHome,
    href: '/dashboard',
    role: 'all'
  },
  {
    title: 'Developer Hub',
    icon: FiCode,
    items: [
      { title: 'Onboarding', href: '/developer/onboarding', role: 'developer' },
      { title: 'Projects', href: '/developer/projects', role: 'developer' },
      { title: 'Create Project', href: '/developer/projects/create', role: 'developer' },
      { title: 'Analytics', href: '/developer/analytics', role: 'developer' }
    ]
  },
  {
    title: 'Admin',
    icon: FiShield,
    items: [
      { title: 'Verifications', href: '/admin/verifications', role: 'admin' },
      { title: 'Users', href: '/admin/users', role: 'admin' },
      { title: 'Reports', href: '/admin/reports', role: 'admin' },
      { title: 'Settings', href: '/admin/settings', role: 'admin' }
    ]
  },
  {
    title: 'Analytics',
    icon: FiBarChart2,
    items: [
      { title: 'Dashboard', href: '/analytics/dashboard', role: 'all' },
      { title: 'Real-time', href: '/analytics/realtime', role: 'premium' },
      { title: 'Predictions', href: '/analytics/predictions', role: 'enterprise' },
      { title: 'Reports', href: '/analytics/reports', role: 'all' }
    ]
  },
  {
    title: 'AI Assistant',
    icon: FiCpu,
    href: '/ai-assistant',
    role: 'all'
  },
  {
    title: 'Marketplace',
    icon: FiPackage,
    items: [
      { title: 'Properties', href: '/properties', role: 'all' },
      { title: 'Developments', href: '/developments', role: 'all' },
      { title: 'Investment Ops', href: '/invest', role: 'investor' }
    ]
  }
];

export default function EnterpriseNavigation() {
  const pathname = usePathname();
  const [isOpensetIsOpen] = useState(false);
  const [expandedItemssetExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prevtitle]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isParentActive = (items: any[]) => 
    items.some(item => pathname.startsWith(item.href));

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-gray-900 text-white shadow-lg"
      >
        {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {/* Navigation Sidebar */}
      <AnimatePresence>
        {(isOpen || window.innerWidth>= 768) && (
          <motion.nav
            initial={ x: -320 }
            animate={ x: 0 }
            exit={ x: -320 }
            transition={ type: 'spring', stiffness: 300, damping: 30 }
            className="fixed left-0 top-0 h-full w-80 bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl z-40"
          >
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="p-6 border-b border-gray-700">
                <Link href="/" className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">P</span>
                  </div>
                  <div>
                    <h1 className="text-white font-bold text-xl">Prop.ie</h1>
                    <p className="text-gray-400 text-sm">Enterprise Platform</p>
                  </div>
                </Link>
              </div>

              {/* User Info */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                    <span className="text-white font-semibold">JD</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">John Developer</p>
                    <p className="text-gray-400 text-sm">Enterprise Plan</p>
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 overflow-y-auto py-4">
                {navigationItems.map((item: any) => (
                  <div key={item.title} className="mb-2">
                    {item.href ? (
                      // Single link item
                      <Link
                        href={item.href}
                        className={`flex items-center space-x-3 px-6 py-3 transition-all ${
                          isActive(item.href)
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                            : 'text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        <item.icon size={20} />
                        <span>{item.title}</span>
                      </Link>
                    ) : (
                      // Expandable item
                      <>
                        <button
                          onClick={() => toggleExpanded(item.title)}
                          className={`w-full flex items-center justify-between px-6 py-3 transition-all ${
                            item.items && isParentActive(item.items)
                              ? 'text-white bg-gray-800'
                              : 'text-gray-300 hover:bg-gray-800'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <item.icon size={20} />
                            <span>{item.title}</span>
                          </div>
                          <motion.div
                            animate={ rotate: expandedItems.includes(item.title) ? 180 : 0 }
                            transition={ duration: 0.2 }
                          >
                            <FiTrendingUp size={16} className="transform rotate-90" />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {expandedItems.includes(item.title) && item.items && (
                            <motion.div
                              initial={ height: 0, opacity: 0 }
                              animate={ height: 'auto', opacity: 1 }
                              exit={ height: 0, opacity: 0 }
                              transition={ duration: 0.2 }
                              className="overflow-hidden"
                            >
                              {item.items.map((subItem: any) => (
                                <Link
                                  key={subItem.href}
                                  href={subItem.href}
                                  className={`flex items-center space-x-3 pl-14 pr-6 py-2 transition-all ${
                                    isActive(subItem.href)
                                      ? 'text-blue-400 bg-gray-700/50'
                                      : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                                  }`}
                                >
                                  <span>{subItem.title}</span>
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="p-4 border-t border-gray-700">
                <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                  <FiBell size={20} />
                  <span>Notifications</span>
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">3</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors mt-2">
                  <FiSettings size={20} />
                  <span>Settings</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-2">
                  <FiLogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}