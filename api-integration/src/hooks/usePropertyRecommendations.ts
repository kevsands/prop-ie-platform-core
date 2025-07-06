/**
 * Property Recommendations Hook
 * Custom React hook for fetching and managing personalized property recommendations
 */

import { useState, useEffect, useCallback } from 'react';
import { PropertyMatch, UserProfile } from '@/lib/algorithms/PropertyRecommendationEngine';

interface UsePropertyRecommendationsOptions {
  userProfile?: UserProfile;
  limit?: number;
  autoFetch?: boolean;
}

interface RecommendationsAnalytics {
  totalPropertiesAnalyzed: number;
  recommendationsReturned: number;
  averageMatchScore: number;
  topMatchScore: number;
  userProfileCompleteness: number;
}

interface UsePropertyRecommendationsReturn {
  recommendations: PropertyMatch[];
  analytics: RecommendationsAnalytics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  fetchRecommendations: (profile: UserProfile, options?: { limit?: number }) => Promise<void>;
}

export function usePropertyRecommendations({
  userProfile,
  limit = 10,
  autoFetch = true
}: UsePropertyRecommendationsOptions = {}): UsePropertyRecommendationsReturn {
  
  const [recommendations, setRecommendations] = useState<PropertyMatch[]>([]);
  const [analytics, setAnalytics] = useState<RecommendationsAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async (
    profile: UserProfile,
    options: { limit?: number } = {}
  ) => {
    if (!profile) {
      setError('User profile is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/properties/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile: profile,
          limit: options.limit || limit,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setRecommendations(result.data.recommendations);
        setAnalytics(result.data.analytics);
      } else {
        setError(result.error || 'Failed to fetch recommendations');
      }
    } catch (err) {
      console.error('Error fetching property recommendations:', err);
      setError('Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const refetch = useCallback(async () => {
    if (userProfile) {
      await fetchRecommendations(userProfile);
    }
  }, [userProfile, fetchRecommendations]);

  // Auto-fetch recommendations when userProfile changes
  useEffect(() => {
    if (autoFetch && userProfile) {
      fetchRecommendations(userProfile);
    }
  }, [userProfile, autoFetch, fetchRecommendations]);

  return {
    recommendations,
    analytics,
    loading,
    error,
    refetch,
    fetchRecommendations,
  };
}

/**
 * Hook for fetching recommendations by user ID (for authenticated users)
 */
export function useUserPropertyRecommendations(userId?: string, limit: number = 10) {
  const [recommendations, setRecommendations] = useState<PropertyMatch[]>([]);
  const [analytics, setAnalytics] = useState<RecommendationsAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/properties/recommendations?userId=${userId}&limit=${limit}`);
      const result = await response.json();

      if (result.success) {
        setRecommendations(result.data.recommendations);
        setAnalytics(result.data.analytics);
      } else {
        setError(result.error || 'Failed to fetch recommendations');
      }
    } catch (err) {
      console.error('Error fetching user property recommendations:', err);
      setError('Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  }, [userId, limit]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return {
    recommendations,
    analytics,
    loading,
    error,
    refetch: fetchRecommendations,
  };
}

export default usePropertyRecommendations;