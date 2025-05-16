/**
 * Typed Hook Example
 * 
 * This file demonstrates how to properly use the centralized type system
 * in custom hooks throughout the application.
 */

import { useCallback, useEffect, useState } from 'react';
import { 
  User, 
  Property, 
  PropertySearchParams, 
  isProperty 
} from '../types/models';
import { 
  ApiResponse, 
  ApiErrorResponse, 
  isApiError, 
  ErrorCode 
} from '../types/api';
import { 
  AsyncState, 
  PaginatedResponse 
} from '../types/utils';

/**
 * Custom hook for fetching properties with type safety
 */
export function useProperties(
  searchParams: PropertySearchParams = {},
  initialFetch: boolean = true
) {
  // Properly typed state
  const [state, setState] = useState<AsyncState<PaginatedResponse<Property>>>({
    data: null,
    isLoading: false,
    error: null
  });

  // Typed search parameters
  const [params, setParams] = useState<PropertySearchParams>(searchParams);

  // Typed fetch function
  const fetchProperties = useCallback(async (
    searchParams: PropertySearchParams = {}
  ) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Convert parameters to query string
      const queryString = Object.entries(searchParams)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return value.map(v => `${key}=${encodeURIComponent(v)}`).join('&');
          }
          return `${key}=${encodeURIComponent(value as string)}`;
        })
        .join('&');
      
      // Type-safe API response handling
      const response: ApiResponse<PaginatedResponse<Property>> = 
        await fetch(`/api/properties?${queryString}`)
          .then(res => res.json());
      
      if (!response.success || !response.data) {
        throw {
          code: response.error?.code || ErrorCode.UNKNOWN_ERROR,
          message: response.error?.message || 'Failed to fetch properties',
          details: response.error?.details
        } as ApiErrorResponse;
      }
      
      // Validate response data
      if (!Array.isArray(response.data.items)) {
        throw new Error('Invalid response format: expected array of properties');
      }
      
      // Type guard to ensure data integrity
      for (const item of response.data.items) {
        if (!isProperty(item)) {
          console.warn('Invalid property data received:', item);
        }
      }
      
      setState({
        data: response.data,
        isLoading: false,
        error: null
      });
      
      return response.data;
    } catch (error) {
      const errorMessage = isApiError(error)
        ? error.message
        : 'An unknown error occurred';
        
      setState({
        data: null,
        isLoading: false,
        error: error as Error
      });
      
      console.error('Error fetching properties:', errorMessage);
      throw error;
    }
  }, []);

  // Initial fetch effect
  useEffect(() => {
    if (initialFetch) {
      fetchProperties(params);
    }
  }, [initialFetch, fetchProperties, params]);

  // Update search parameters and trigger fetch
  const search = useCallback((newParams: PropertySearchParams) => {
    setParams(newParams);
    return fetchProperties(newParams);
  }, [fetchProperties]);

  // Clear search parameters and reload
  const reset = useCallback(() => {
    const defaultParams = {};
    setParams(defaultParams);
    return fetchProperties(defaultParams);
  }, [fetchProperties]);

  // Type-safe return value
  return {
    properties: state.data?.items || [],
    totalCount: state.data?.totalCount || 0,
    hasNextPage: state.data?.hasNextPage || false,
    nextCursor: state.data?.nextCursor,
    isLoading: state.isLoading,
    error: state.error,
    search,
    reset,
    refresh: () => fetchProperties(params)
  };
}

/**
 * Custom hook for user authentication with type safety
 */
export function useAuth() {
  // Properly typed state
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch current user with proper typing
  const fetchCurrentUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<User> = await fetch('/api/auth/me')
        .then(res => res.json());
      
      if (!response.success || !response.data) {
        // Not authenticated - this is not an error
        setUser(null);
        setIsLoading(false);
        return null;
      }
      
      setUser(response.data);
      return response.data;
    } catch (error) {
      setError(error as Error);
      console.error('Auth error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Type-safe login function
  const login = useCallback(async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<User> = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      }).then(res => res.json());
      
      if (!response.success || !response.data) {
        throw {
          code: response.error?.code || ErrorCode.UNAUTHORIZED,
          message: response.error?.message || 'Invalid credentials',
          statusCode: 401
        } as ApiErrorResponse;
      }
      
      setUser(response.data);
      return response.data;
    } catch (error) {
      setError(error as Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Type-safe logout function
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (error) {
      setError(error as Error);
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check authentication on mount
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Type-safe return value
  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    refreshUser: fetchCurrentUser
  };
}

/**
 * Custom hook for managing favorites with type safety
 */
export function useFavorites<T extends { id: string }>(
  entityType: 'property' | 'development' | 'unit'
) {
  // Properly typed state
  const [favorites, setFavorites] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch favorites with proper typing
  const fetchFavorites = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<T[]> = await fetch(`/api/favorites/${entityType}`)
        .then(res => res.json());
      
      if (!response.success || !response.data) {
        throw {
          code: response.error?.code || ErrorCode.UNKNOWN_ERROR,
          message: response.error?.message || 'Failed to fetch favorites',
          statusCode: 400
        } as ApiErrorResponse;
      }
      
      setFavorites(response.data);
      return response.data;
    } catch (error) {
      setError(error as Error);
      console.error(`Error fetching ${entityType} favorites:`, error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [entityType]);

  // Add favorite with proper typing
  const addFavorite = useCallback(async (item: T): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<T> = await fetch(`/api/favorites/${entityType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id })
      }).then(res => res.json());
      
      if (!response.success || !response.data) {
        throw {
          code: response.error?.code || ErrorCode.UNKNOWN_ERROR,
          message: response.error?.message || `Failed to add ${entityType} to favorites`,
          statusCode: 400
        } as ApiErrorResponse;
      }
      
      setFavorites(prev => [...prev, item]);
      return true;
    } catch (error) {
      setError(error as Error);
      console.error(`Error adding ${entityType} to favorites:`, error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [entityType]);

  // Remove favorite with proper typing
  const removeFavorite = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<void> = await fetch(`/api/favorites/${entityType}/${id}`, {
        method: 'DELETE'
      }).then(res => res.json());
      
      if (!response.success) {
        throw {
          code: response.error?.code || ErrorCode.UNKNOWN_ERROR,
          message: response.error?.message || `Failed to remove ${entityType} from favorites`,
          statusCode: 400
        } as ApiErrorResponse;
      }
      
      setFavorites(prev => prev.filter(item => item.id !== id));
      return true;
    } catch (error) {
      setError(error as Error);
      console.error(`Error removing ${entityType} from favorites:`, error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [entityType]);

  // Check if an item is a favorite
  const isFavorite = useCallback((id: string): boolean => {
    return favorites.some(item => item.id === id);
  }, [favorites]);

  // Load favorites on mount
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Type-safe return value
  return {
    favorites,
    isLoading,
    error,
    addFavorite,
    removeFavorite,
    isFavorite,
    refresh: fetchFavorites
  };
}

export default {
  useProperties,
  useAuth,
  useFavorites
};