/**
 * Search Preferences Hook
 * React hook for managing buyer search preferences across the platform
 */

import { useState, useEffect, useCallback } from 'react';

interface SearchPreferences {
  location: {
    counties: string[];
    cities: string[];
    areas: string[];
  };
  property: {
    types: string[];
    bedrooms: { min: number; max: number };
    bathrooms: { min: number; max: number };
    parking: boolean;
    garden: boolean;
    balcony: boolean;
    ensuite: boolean;
  };
  budget: {
    min: number;
    max: number;
    includeHTB: boolean;
    htbAmount?: number;
  };
  lifestyle: {
    nearPublicTransport: boolean;
    nearSchools: boolean;
    nearShopping: boolean;
    nearHealthcare: boolean;
    nearRecreation: boolean;
  };
  notifications: {
    newMatches: boolean;
    priceChanges: boolean;
    similarProperties: boolean;
    frequency: string;
    method: string[];
  };
}

interface UseSearchPreferencesReturn {
  preferences: SearchPreferences | null;
  loading: boolean;
  error: string | null;
  updatePreferences: (newPreferences: Partial<SearchPreferences>) => Promise<void>;
  trackPropertyViewing: (propertyId: string, developmentId: string, source?: string) => Promise<void>;
  getRecommendations: (limit?: number) => Promise<any>;
  isGuest: boolean;
  sessionId: string;
}

export function useSearchPreferences(buyerId?: string): UseSearchPreferencesReturn {
  const [preferences, setPreferences] = useState<SearchPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  
  const isGuest = !buyerId;

  // Load initial preferences
  useEffect(() => {
    loadPreferences();
  }, [buyerId, sessionId]);

  const loadPreferences = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = isGuest 
        ? `/api/buyer-preferences?action=guest-session&sessionId=${sessionId}`
        : `/api/buyer-preferences?action=preferences&buyerId=${buyerId}`;
      
      const response = await fetch(endpoint);
      const data = await response.json();
      
      if (data.success) {
        const prefs = isGuest ? data.data.preferences : data.data;
        setPreferences(prefs);
      } else {
        // Initialize with default preferences if none exist
        const defaultPreferences: SearchPreferences = {
          location: { counties: [], cities: [], areas: [] },
          property: {
            types: ['apartment', 'house'],
            bedrooms: { min: 1, max: 4 },
            bathrooms: { min: 1, max: 3 },
            parking: false,
            garden: false,
            balcony: false,
            ensuite: false
          },
          budget: { min: 250000, max: 500000, includeHTB: true },
          lifestyle: {
            nearPublicTransport: false,
            nearSchools: false,
            nearShopping: false,
            nearHealthcare: false,
            nearRecreation: false
          },
          notifications: {
            newMatches: !isGuest,
            priceChanges: !isGuest,
            similarProperties: !isGuest,
            frequency: 'daily',
            method: ['email']
          }
        };
        setPreferences(defaultPreferences);
      }
    } catch (err) {
      setError('Failed to load preferences');
      console.error('Error loading preferences:', err);
    } finally {
      setLoading(false);
    }
  }, [buyerId, sessionId, isGuest]);

  const updatePreferences = useCallback(async (newPreferences: Partial<SearchPreferences>) => {
    try {
      setError(null);
      
      const updatedPreferences = { ...preferences, ...newPreferences };
      setPreferences(updatedPreferences);

      const endpoint = '/api/buyer-preferences';
      const payload = isGuest 
        ? {
            action: 'track-guest',
            sessionId,
            preferences: updatedPreferences,
            fingerprint: generateFingerprint()
          }
        : {
            action: 'update-preferences',
            buyerId,
            sessionId,
            preferences: updatedPreferences
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update preferences');
      }
    } catch (err) {
      setError('Failed to update preferences');
      console.error('Error updating preferences:', err);
      throw err;
    }
  }, [preferences, buyerId, sessionId, isGuest]);

  const trackPropertyViewing = useCallback(async (
    propertyId: string, 
    developmentId: string, 
    source: string = 'search'
  ) => {
    try {
      const viewing = {
        propertyId,
        developmentId,
        viewedAt: new Date(),
        duration: 0,
        source,
        actions: ['viewed']
      };

      const identifier = buyerId || sessionId;

      await fetch('/api/buyer-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'record-viewing',
          identifier,
          viewing,
          isGuest
        })
      });
    } catch (err) {
      console.error('Error tracking property viewing:', err);
    }
  }, [buyerId, sessionId, isGuest]);

  const getRecommendations = useCallback(async (limit: number = 10) => {
    try {
      const identifier = buyerId || sessionId;
      const response = await fetch(
        `/api/buyer-preferences?action=recommendations&${buyerId ? 'buyerId' : 'sessionId'}=${identifier}&guest=${isGuest}&limit=${limit}`
      );
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.error || 'Failed to get recommendations');
      }
    } catch (err) {
      console.error('Error getting recommendations:', err);
      return { properties: [], reasoning: [], confidence: 0 };
    }
  }, [buyerId, sessionId, isGuest]);

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    trackPropertyViewing,
    getRecommendations,
    isGuest,
    sessionId
  };
}

// Helper function to generate browser fingerprint
function generateFingerprint(): string {
  if (typeof window === 'undefined') return 'server';
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx?.fillText('fingerprint', 10, 10);
  
  return btoa(
    navigator.userAgent + 
    navigator.language + 
    screen.width + 
    screen.height + 
    new Date().getTimezoneOffset() +
    (canvas.toDataURL().slice(-50))
  ).slice(0, 32);
}

export default useSearchPreferences;