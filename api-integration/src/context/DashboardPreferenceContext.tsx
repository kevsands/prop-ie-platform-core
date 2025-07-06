'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDashboardPreferences } from '@/hooks/useDashboard';

// Define dashboard widget types
export type DashboardWidgetType =
  | 'developmentStats'
  | 'salesStats'
  | 'financialStats'
  | 'alerts'
  | 'events'
  | 'documents'
  | 'timeline'
  | 'projectProgress'
  | 'salesChart'
  | 'financialChart'
  | 'activities';

// Widget configuration
export interface DashboardWidget {
  id: string;
  type: DashboardWidgetType;
  title: string;
  visible: boolean;
  colSpan: 1 | 2 | 3 | 4;
  rowSpan: 1 | 2;
  order: number;
  configurable?: boolean;
  removable?: boolean;
  config?: Record<string, any>;
}

// Layout configuration
export interface DashboardLayout {
  id: string;
  name: string;
  isDefault: boolean;
  widgets: DashboardWidget[];
}

// User preferences
export interface UserDashboardPreferences {
  activeTab: string;
  activeLayout: string;
  layouts: DashboardLayout[];
  theme: 'light' | 'dark' | 'system';
  refreshInterval: number;
  filters: Record<string, any>;
  compactView: boolean;
}

// Context values
interface DashboardPreferenceContextType {
  preferences: UserDashboardPreferences;
  loading: boolean;
  error: Error | null;
  setActiveTab: (tab: string) => void;
  setActiveLayout: (layoutId: string) => void;
  toggleWidgetVisibility: (widgetId: string) => void;
  updateWidgetConfig: (widgetId: string, config: Record<string, any>) => void;
  saveLayout: (layout: DashboardLayout) => void;
  resetToDefault: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setRefreshInterval: (interval: number) => void;
  setFilter: (key: string, value: any) => void;
  clearFilters: () => void;
  toggleCompactView: () => void;
}

// Default preferences
const defaultPreferences: UserDashboardPreferences = {
  activeTab: 'overview',
  activeLayout: 'default',
  layouts: [
    {
      id: 'default',
      name: 'Default Layout',
      isDefault: true,
      widgets: [
        { id: 'dev-stats', type: 'developmentStats', title: 'Development Statistics', visible: true, colSpan: 4, rowSpan: 1, order: 1, removable: false },
        { id: 'project-progress', type: 'projectProgress', title: 'Project Progress', visible: true, colSpan: 2, rowSpan: 2, order: 2, removable: true },
        { id: 'alerts', type: 'alerts', title: 'Alerts', visible: true, colSpan: 2, rowSpan: 2, order: 3, removable: true },
        { id: 'events', type: 'events', title: 'Upcoming Events', visible: true, colSpan: 2, rowSpan: 1, order: 4, removable: true },
        { id: 'documents', type: 'documents', title: 'Documents', visible: true, colSpan: 2, rowSpan: 1, order: 5, removable: true }
      ]
    }
  ],
  theme: 'system',
  refreshInterval: 300000, // 5 minutes
  filters: {},
  compactView: false
};

// Create context
const DashboardPreferenceContext = createContext<DashboardPreferenceContextType | undefined>(undefined);

export const DashboardPreferenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initial state from localStorage or default
  const [preferences, setPreferences] = useState<UserDashboardPreferences>(() => {
    if (typeof localStorage !== 'undefined') {
      const savedPrefs = localStorage.getItem('dashboardPreferences');
      if (savedPrefs) {
        try {
          return JSON.parse(savedPrefs);
        } catch (e) {
          console.error('Failed to parse saved dashboard preferences', e);
        }
      }
    }
    return defaultPreferences;
  });

  // Fetch user preferences from GraphQL API
  const { data, isLoading, error } = useDashboardPreferences({
    onSuccess: (serverPreferences: UserDashboardPreferences) => {
      if (serverPreferences) {
        try {
          // Merge server preferences with local state
          // This is just a placeholder for when the GraphQL API is implemented
          console.log('Got server preferences', serverPreferences);

          // For now, we just use the local preferences
        } catch (e) {
          console.error('Error processing server preferences', e);
        }
      }
    }
  });

  // Save preferences to localStorage when they change
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('dashboardPreferences', JSON.stringify(preferences));
    }
  }, [preferences]);

  // Functions to update preferences
  const setActiveTab = (tab: string) => {
    setPreferences(prev => ({ ...prev, activeTab: tab }));
  };

  const setActiveLayout = (layoutId: string) => {
    setPreferences(prev => ({ ...prev, activeLayout: layoutId }));
  };

  const toggleWidgetVisibility = (widgetId: string) => {
    setPreferences(prev => {
      const layouts = prev.layouts.map(layout => {
        if (layout.id === prev.activeLayout) {
          return {
            ...layout,
            widgets: layout.widgets.map(widget => {
              if (widget.id === widgetId) {
                return { ...widget, visible: !widget.visible };
              }
              return widget;
            })
          };
        }
        return layout;
      });
      return { ...prev, layouts };
    });
  };

  const updateWidgetConfig = (widgetId: string, config: Record<string, any>) => {
    setPreferences(prev => {
      const layouts = prev.layouts.map(layout => {
        if (layout.id === prev.activeLayout) {
          return {
            ...layout,
            widgets: layout.widgets.map(widget => {
              if (widget.id === widgetId) {
                return { ...widget, config: { ...widget.config, ...config } };
              }
              return widget;
            })
          };
        }
        return layout;
      });
      return { ...prev, layouts };
    });
  };

  const saveLayout = (layout: DashboardLayout) => {
    setPreferences(prev => {
      const existingLayoutIndex = prev.layouts.findIndex(l => l.id === layout.id);
      const layouts = [...prev.layouts];

      if (existingLayoutIndex >= 0) {
        layouts[existingLayoutIndex] = layout;
      } else {
        layouts.push(layout);
      }

      return { ...prev, layouts, activeLayout: layout.id };
    });
  };

  const resetToDefault = () => {
    setPreferences(defaultPreferences);
  };

  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    setPreferences(prev => ({ ...prev, theme }));
  };

  const setRefreshInterval = (refreshInterval: number) => {
    setPreferences(prev => ({ ...prev, refreshInterval }));
  };

  const setFilter = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      filters: { ...prev.filters, [key]: value }
    }));
  };

  const clearFilters = () => {
    setPreferences(prev => ({ ...prev, filters: {} }));
  };

  const toggleCompactView = () => {
    setPreferences(prev => ({ ...prev, compactView: !prev.compactView }));
  };

  // Context value
  const contextValue: DashboardPreferenceContextType = {
    preferences,
    loading: isLoading,
    error,
    setActiveTab,
    setActiveLayout,
    toggleWidgetVisibility,
    updateWidgetConfig,
    saveLayout,
    resetToDefault,
    setTheme,
    setRefreshInterval,
    setFilter,
    clearFilters,
    toggleCompactView
  };

  return (
    <DashboardPreferenceContext.Provider value={contextValue}>
      {children}
    </DashboardPreferenceContext.Provider>
  );
};

// Hook to use dashboard preferences
export const useDashboardPreference = () => {
  const context = useContext(DashboardPreferenceContext);

  if (context === undefined) {
    throw new Error('useDashboardPreference must be used within a DashboardPreferenceProvider');
  }

  return context;
};

// Helper hooks for getting current layout
export const useCurrentDashboardLayout = () => {
  const { preferences } = useDashboardPreference();
  const currentLayout = preferences.layouts.find(layout => layout.id === preferences.activeLayout);
  return currentLayout || preferences.layouts[0]; // Fallback to the first layout if current not found
};

// Helper hook for widget visibility
export const useVisibleWidgets = () => {
  const layout = useCurrentDashboardLayout();
  return layout.widgets.filter(widget => widget.visible).sort((a, b) => a.order - b.order);
};