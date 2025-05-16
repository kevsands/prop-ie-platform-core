'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTransaction } from '@/context/TransactionContext';

interface BreadcrumbItem {
  label: string;
  href: string;
  isActive?: boolean;
}

interface QuickAction {
  label: string;
  href: string;
  icon: React.ReactNode;
  action?: () => void;
}

interface NavigationState {
  currentPath: string;
  previousPath: string;
  breadcrumbs: BreadcrumbItem[];
  isNavigating: boolean;
  navigationHistory: string[];
  quickActions: QuickAction[];
  activeSection: string;
  mobileMenuOpen: boolean;
  searchOpen: boolean;
}

interface NavigationContextValue extends NavigationState {
  navigateTo: (path: string, options?: NavigationOptions) => void;
  goBack: () => void;
  goForward: () => void;
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
  setQuickActions: (actions: QuickAction[]) => void;
  setActiveSection: (section: string) => void;
  toggleMobileMenu: () => void;
  toggleSearch: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
}

interface NavigationOptions {
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
}

const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { activeTransaction } = useTransaction();
  
  const [state, setState] = useState<NavigationState>({
    currentPath: pathname || '/',
    previousPath: '/',
    breadcrumbs: [],
    isNavigating: false,
    navigationHistory: [pathname || '/'],
    quickActions: [],
    activeSection: '',
    mobileMenuOpen: false,
    searchOpen: false,
  });

  const [historyIndex, setHistoryIndex] = useState(0);

  // Update navigation state when path changes
  useEffect(() => {
    if (pathname && pathname !== state.currentPath) {
      setState(prev => ({
        ...prev,
        previousPath: prev.currentPath,
        currentPath: pathname,
        navigationHistory: [...prev.navigationHistory.slice(0, historyIndex + 1), pathname],
        isNavigating: false,
      }));
      setHistoryIndex(prev => prev + 1);
    }
  }, [pathname, state.currentPath, historyIndex]);

  // Generate breadcrumbs based on current path
  useEffect(() => {
    const generateBreadcrumbs = () => {
      const pathSegments = pathname?.split('/').filter(Boolean) || [];
      const breadcrumbs: BreadcrumbItem[] = [];
      
      // Add home/dashboard based on authentication
      breadcrumbs.push({
        label: isAuthenticated ? 'Dashboard' : 'Home',
        href: isAuthenticated ? `/${user?.role?.toLowerCase() || 'dashboard'}` : '/',
      });

      // Build breadcrumb trail
      let currentPath = '';
      pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        const isLast = index === pathSegments.length - 1;
        
        // Format segment label
        const label = segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        breadcrumbs.push({
          label,
          href: currentPath,
          isActive: isLast,
        });
      });

      setState(prev => ({ ...prev, breadcrumbs }));
    };

    generateBreadcrumbs();
  }, [pathname, isAuthenticated, user]);

  // Update quick actions based on user role and context
  useEffect(() => {
    const generateQuickActions = () => {
      const actions: QuickAction[] = [];
      
      if (!isAuthenticated || !user) return;
      
      switch (user.role) {
        case 'BUYER':
          actions.push(
            { 
              label: 'Search Properties', 
              href: '/properties',
              icon: '🔍'
            },
            { 
              label: 'My Documents', 
              href: '/buyer/documents',
              icon: '📄'
            },
            { 
              label: 'Mortgage Calculator', 
              href: '/resources/calculators/mortgage-calculator',
              icon: '💳'
            }
          );
          
          if (activeTransaction) {
            actions.push({
              label: 'View Transaction',
              href: `/transactions/${activeTransaction.id}`,
              icon: '📊'
            });
          }
          break;
          
        case 'DEVELOPER':
          actions.push(
            { 
              label: 'New Project', 
              href: '/developer/projects/new',
              icon: '➕'
            },
            { 
              label: 'View Analytics', 
              href: '/developer/analytics',
              icon: '📈'
            },
            { 
              label: 'Upload Document', 
              href: '/developer/documents/upload',
              icon: '📤'
            }
          );
          break;
          
        case 'AGENT':
          actions.push(
            { 
              label: 'Add Listing', 
              href: '/agents/listings/new',
              icon: '🏠'
            },
            { 
              label: 'Schedule Viewing', 
              href: '/agents/viewings/new',
              icon: '📅'
            }
          );
          break;
          
        case 'SOLICITOR':
          actions.push(
            { 
              label: 'New Case', 
              href: '/solicitor/cases/new',
              icon: '💼'
            },
            { 
              label: 'Compliance Check', 
              href: '/solicitor/compliance/check',
              icon: '✅'
            }
          );
          break;
      }
      
      setState(prev => ({ ...prev, quickActions: actions }));
    };

    generateQuickActions();
  }, [isAuthenticated, user, activeTransaction]);

  // Navigation methods
  const navigateTo = useCallback((path: string, options: NavigationOptions = {}) => {
    setState(prev => ({ ...prev, isNavigating: true }));
    
    if (options.replace) {
      router.replace(path);
    } else {
      router.push(path);
    }
    
    if (options.scroll !== false) {
      window.scrollTo(0, 0);
    }
  }, [router]);

  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousPath = state.navigationHistory[newIndex];
      setHistoryIndex(newIndex);
      navigateTo(previousPath);
    } else {
      router.back();
    }
  }, [historyIndex, state.navigationHistory, navigateTo, router]);

  const goForward = useCallback(() => {
    if (historyIndex < state.navigationHistory.length - 1) {
      const newIndex = historyIndex + 1;
      const nextPath = state.navigationHistory[newIndex];
      setHistoryIndex(newIndex);
      navigateTo(nextPath);
    }
  }, [historyIndex, state.navigationHistory, navigateTo]);

  const setBreadcrumbs = useCallback((breadcrumbs: BreadcrumbItem[]) => {
    setState(prev => ({ ...prev, breadcrumbs }));
  }, []);

  const setQuickActions = useCallback((quickActions: QuickAction[]) => {
    setState(prev => ({ ...prev, quickActions }));
  }, []);

  const setActiveSection = useCallback((activeSection: string) => {
    setState(prev => ({ ...prev, activeSection }));
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setState(prev => ({ ...prev, mobileMenuOpen: !prev.mobileMenuOpen }));
  }, []);

  const toggleSearch = useCallback(() => {
    setState(prev => ({ ...prev, searchOpen: !prev.searchOpen }));
  }, []);

  const value: NavigationContextValue = {
    ...state,
    navigateTo,
    goBack,
    goForward,
    setBreadcrumbs,
    setQuickActions,
    setActiveSection,
    toggleMobileMenu,
    toggleSearch,
    canGoBack: historyIndex > 0,
    canGoForward: historyIndex < state.navigationHistory.length - 1,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};