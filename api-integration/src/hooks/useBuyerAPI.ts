/**
 * First-Time Buyer API Hook
 * 
 * Updated to use REST APIs instead of GraphQL for better integration with newly enabled endpoints.
 */

import { useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { buyerRestApiService } from '@/services/buyerRestApiService';

// Re-export types from the service layer
export type {
  BuyerProfile,
  Reservation,
  MortgageTracking,
  SnagList,
  SnagItem,
  HomePackItem
} from '@/services/buyerRestApiService';

// Input types
interface BuyerProfileInput {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  currentJourneyPhase?: string;
  financialDetails?: Record<string, unknown>;
  preferences?: Record<string, unknown>;
  governmentSchemes?: Record<string, unknown>;
}

interface ReservationInput {
  propertyId: string;
  unitId?: string;
  reservationDate?: string;
}

interface MortgageTrackingInput {
  status?: string;
  lender?: string;
  lenderName?: string;
  amount?: number;
  notes?: string;
}

interface SnagListInput {
  propertyId: string;
  title?: string;
  description?: string;
}

interface SnagItemInput {
  snagListId: string;
  title: string;
  description?: string;
  location?: string;
  priority?: string;
  status?: string;
}

interface HomePackItemInput {
  propertyId: string;
  name: string;
  description?: string;
  category?: string;
}

export function useBuyerAPI() {
  const { user } = useAuth();

  // Buyer Profile Operations
  const useMyBuyerProfile = (options?: UseQueryOptions<import('@/services/buyerRestApiService').BuyerProfile, Error>) => {
    return useQuery({
      queryKey: ['buyerProfile', user?.id],
      queryFn: () => buyerRestApiService.getMyBuyerProfile(),
      enabled: !!user,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      ...options,
    });
  };

  const useCreateBuyerProfile = (options?: UseMutationOptions<import('@/services/buyerRestApiService').BuyerProfile, Error, BuyerProfileInput>) => {
    return useMutation({
      mutationFn: (input: BuyerProfileInput) => buyerRestApiService.createBuyerProfile(input),
      ...options,
    });
  };

  const useUpdateBuyerProfile = (options?: UseMutationOptions<import('@/services/buyerRestApiService').BuyerProfile, Error, { id: string; input: BuyerProfileInput }>) => {
    return useMutation({
      mutationFn: ({ id, input }: { id: string; input: BuyerProfileInput }) => 
        buyerRestApiService.updateBuyerProfile(id, input),
      ...options,
    });
  };

  // Reservation Operations
  const useMyReservations = (options?: UseQueryOptions<import('@/services/buyerRestApiService').Reservation[], Error>) => {
    return useQuery({
      queryKey: ['myReservations', user?.id],
      queryFn: () => buyerRestApiService.getMyReservations(),
      enabled: !!user,
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 5 * 60 * 1000, // 5 minutes
      ...options,
    });
  };

  const useReservation = (id: string, options?: UseQueryOptions<import('@/services/buyerRestApiService').Reservation, Error>) => {
    return useQuery({
      queryKey: ['reservation', id],
      queryFn: () => buyerRestApiService.getReservation(id),
      enabled: !!id,
      staleTime: 2 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
      ...options,
    });
  };

  const useCreateReservation = (options?: UseMutationOptions<import('@/services/buyerRestApiService').Reservation, Error, ReservationInput>) => {
    return useMutation({
      mutationFn: (input: ReservationInput) => buyerRestApiService.createReservation(input),
      ...options,
    });
  };

  const useUpdateReservation = (options?: UseMutationOptions<import('@/services/buyerRestApiService').Reservation, Error, { id: string; input: ReservationInput }>) => {
    return useMutation({
      mutationFn: ({ id, input }: { id: string; input: ReservationInput }) => {
        throw new Error('Update reservation not yet implemented');
      },
      ...options,
    });
  };

  const useCancelReservation = (options?: UseMutationOptions<import('@/services/buyerRestApiService').Reservation, Error, { id: string; reason: string }>) => {
    return useMutation({
      mutationFn: ({ id, reason }: { id: string; reason: string }) => {
        throw new Error('Cancel reservation not yet implemented');
      },
      ...options,
    });
  };

  // Mortgage Tracking Operations
  const useMyMortgageTracking = (options?: UseQueryOptions<import('@/services/buyerRestApiService').MortgageTracking | null, Error>) => {
    return useQuery({
      queryKey: ['mortgageTracking', user?.id],
      queryFn: () => buyerRestApiService.getMyMortgageTracking(),
      enabled: !!user,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,
      ...options,
    });
  };

  const useCreateMortgageTracking = (options?: UseMutationOptions<import('@/services/buyerRestApiService').MortgageTracking, Error, MortgageTrackingInput>) => {
    return useMutation({
      mutationFn: (input: MortgageTrackingInput) => buyerRestApiService.createMortgageTracking(input),
      ...options,
    });
  };

  const useUpdateMortgageTracking = (options?: UseMutationOptions<import('@/services/buyerRestApiService').MortgageTracking, Error, { id: string; input: MortgageTrackingInput }>) => {
    return useMutation({
      mutationFn: ({ id, input }: { id: string; input: MortgageTrackingInput }) => {
        throw new Error('Update mortgage tracking not yet implemented');
      },
      ...options,
    });
  };

  const useAddMortgageDocument = (options?: UseMutationOptions<import('@/services/buyerRestApiService').MortgageTracking, Error, { mortgageTrackingId: string; documentId: string }>) => {
    return useMutation({
      mutationFn: ({ mortgageTrackingId, documentId }: { mortgageTrackingId: string; documentId: string }) => {
        throw new Error('Add mortgage document not yet implemented');
      },
      ...options,
    });
  };

  // Snag List Operations
  const useMySnagLists = (options?: UseQueryOptions<import('@/services/buyerRestApiService').SnagList[], Error>) => {
    return useQuery({
      queryKey: ['snagLists', user?.id],
      queryFn: () => buyerRestApiService.getMySnagLists(),
      enabled: !!user,
      staleTime: 3 * 60 * 1000, // 3 minutes
      gcTime: 10 * 60 * 1000,
      ...options,
    });
  };

  const useSnagList = (id: string, options?: UseQueryOptions<import('@/services/buyerRestApiService').SnagList, Error>) => {
    return useQuery({
      queryKey: ['snagList', id],
      queryFn: () => {
        throw new Error('Get snag list by ID not yet implemented');
      },
      enabled: !!id,
      ...options,
    });
  };

  const useCreateSnagList = (options?: UseMutationOptions<import('@/services/buyerRestApiService').SnagList, Error, SnagListInput>) => {
    return useMutation({
      mutationFn: (input: SnagListInput) => {
        throw new Error('Create snag list not yet implemented');
      },
      ...options,
    });
  };

  const useCreateSnagItem = (options?: UseMutationOptions<import('@/services/buyerRestApiService').SnagItem, Error, SnagItemInput>) => {
    return useMutation({
      mutationFn: (input: SnagItemInput) => {
        throw new Error('Create snag item not yet implemented');
      },
      ...options,
    });
  };

  const useUpdateSnagItem = (options?: UseMutationOptions<import('@/services/buyerRestApiService').SnagItem, Error, { id: string; input: SnagItemInput }>) => {
    return useMutation({
      mutationFn: ({ id, input }: { id: string; input: SnagItemInput }) => {
        throw new Error('Update snag item not yet implemented');
      },
      ...options,
    });
  };

  // Home Pack Item Operations
  const useHomePackItems = (propertyId: string, options?: UseQueryOptions<import('@/services/buyerRestApiService').HomePackItem[], Error>) => {
    return useQuery({
      queryKey: ['homePackItems', propertyId],
      queryFn: () => buyerRestApiService.getHomePackItems(propertyId),
      enabled: !!propertyId,
      staleTime: 10 * 60 * 1000, // 10 minutes (documents don't change often)
      gcTime: 30 * 60 * 1000, // 30 minutes
      ...options,
    });
  };

  const useCreateHomePackItem = (options?: UseMutationOptions<import('@/services/buyerRestApiService').HomePackItem, Error, HomePackItemInput>) => {
    return useMutation({
      mutationFn: (input: HomePackItemInput) => {
        throw new Error('Create home pack item not yet implemented');
      },
      ...options,
    });
  };

  const useUpdateHomePackItem = (options?: UseMutationOptions<import('@/services/buyerRestApiService').HomePackItem, Error, { id: string; input: HomePackItemInput }>) => {
    return useMutation({
      mutationFn: ({ id, input }: { id: string; input: HomePackItemInput }) => {
        throw new Error('Update home pack item not yet implemented');
      },
      ...options,
    });
  };

  const useDeleteHomePackItem = (options?: UseMutationOptions<import('@/services/buyerRestApiService').HomePackItem, Error, string>) => {
    return useMutation({
      mutationFn: (id: string) => {
        throw new Error('Delete home pack item not yet implemented');
      },
      ...options,
    });
  };


  return {
    // Buyer Profile
    useMyBuyerProfile,
    useCreateBuyerProfile,
    useUpdateBuyerProfile,
    
    // Reservations
    useMyReservations,
    useReservation,
    useCreateReservation,
    useUpdateReservation,
    useCancelReservation,
    
    // Mortgage Tracking
    useMyMortgageTracking,
    useCreateMortgageTracking,
    useUpdateMortgageTracking,
    useAddMortgageDocument,
    
    // Snag Lists
    useMySnagLists,
    useSnagList,
    useCreateSnagList,
    useCreateSnagItem,
    useUpdateSnagItem,
    
    // Home Pack Items
    useHomePackItems,
    useCreateHomePackItem,
    useUpdateHomePackItem,
    useDeleteHomePackItem,
  };
}