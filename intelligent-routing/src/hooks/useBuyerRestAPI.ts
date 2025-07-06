/**
 * Buyer REST API Hook
 * 
 * Updated version of useBuyerAPI that connects to the newly enabled REST endpoints
 * instead of GraphQL. This preserves the existing hook interface while using real APIs.
 */

import { useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { 
  buyerRestApiService,
  type BuyerProfile,
  type Reservation,
  type MortgageTracking,
  type SnagList,
  type SnagItem,
  type HomePackItem
} from '@/services/buyerRestApiService';

// Input types for mutations
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

export function useBuyerRestAPI() {
  const { user } = useAuth();

  // Buyer Profile Operations
  const useMyBuyerProfile = (options?: UseQueryOptions<BuyerProfile, Error>) => {
    return useQuery({
      queryKey: ['buyerProfile', user?.id],
      queryFn: () => buyerRestApiService.getMyBuyerProfile(),
      enabled: !!user,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime)
      ...options,
    });
  };

  const useCreateBuyerProfile = (options?: UseMutationOptions<BuyerProfile, Error, BuyerProfileInput>) => {
    return useMutation({
      mutationFn: (input: BuyerProfileInput) => buyerRestApiService.createBuyerProfile(input),
      ...options,
    });
  };

  const useUpdateBuyerProfile = (options?: UseMutationOptions<BuyerProfile, Error, { id: string; input: BuyerProfileInput }>) => {
    return useMutation({
      mutationFn: ({ id, input }: { id: string; input: BuyerProfileInput }) => 
        buyerRestApiService.updateBuyerProfile(id, input),
      ...options,
    });
  };

  // Reservation Operations
  const useMyReservations = (options?: UseQueryOptions<Reservation[], Error>) => {
    return useQuery({
      queryKey: ['myReservations', user?.id],
      queryFn: () => buyerRestApiService.getMyReservations(),
      enabled: !!user,
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 5 * 60 * 1000, // 5 minutes
      ...options,
    });
  };

  const useReservation = (id: string, options?: UseQueryOptions<Reservation, Error>) => {
    return useQuery({
      queryKey: ['reservation', id],
      queryFn: () => buyerRestApiService.getReservation(id),
      enabled: !!id,
      staleTime: 2 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
      ...options,
    });
  };

  const useCreateReservation = (options?: UseMutationOptions<Reservation, Error, ReservationInput>) => {
    return useMutation({
      mutationFn: (input: ReservationInput) => buyerRestApiService.createReservation(input),
      ...options,
    });
  };

  const useUpdateReservation = (options?: UseMutationOptions<Reservation, Error, { id: string; input: ReservationInput }>) => {
    return useMutation({
      mutationFn: ({ id, input }: { id: string; input: ReservationInput }) => {
        // For updates, we need to implement updateReservation in the service
        throw new Error('Update reservation not yet implemented');
      },
      ...options,
    });
  };

  const useCancelReservation = (options?: UseMutationOptions<Reservation, Error, { id: string; reason: string }>) => {
    return useMutation({
      mutationFn: ({ id, reason }: { id: string; reason: string }) => {
        // For cancellation, we need to implement cancelReservation in the service
        throw new Error('Cancel reservation not yet implemented');
      },
      ...options,
    });
  };

  // Mortgage Tracking Operations
  const useMyMortgageTracking = (options?: UseQueryOptions<MortgageTracking | null, Error>) => {
    return useQuery({
      queryKey: ['mortgageTracking', user?.id],
      queryFn: () => buyerRestApiService.getMyMortgageTracking(),
      enabled: !!user,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,
      ...options,
    });
  };

  const useCreateMortgageTracking = (options?: UseMutationOptions<MortgageTracking, Error, MortgageTrackingInput>) => {
    return useMutation({
      mutationFn: (input: MortgageTrackingInput) => buyerRestApiService.createMortgageTracking(input),
      ...options,
    });
  };

  const useUpdateMortgageTracking = (options?: UseMutationOptions<MortgageTracking, Error, { id: string; input: MortgageTrackingInput }>) => {
    return useMutation({
      mutationFn: ({ id, input }: { id: string; input: MortgageTrackingInput }) => {
        // For updates, we need to implement updateMortgageTracking in the service
        throw new Error('Update mortgage tracking not yet implemented');
      },
      ...options,
    });
  };

  const useAddMortgageDocument = (options?: UseMutationOptions<MortgageTracking, Error, { mortgageTrackingId: string; documentId: string }>) => {
    return useMutation({
      mutationFn: ({ mortgageTrackingId, documentId }: { mortgageTrackingId: string; documentId: string }) => {
        // This would use the documents API to link a document to mortgage tracking
        throw new Error('Add mortgage document not yet implemented');
      },
      ...options,
    });
  };

  // Snag List Operations
  const useMySnagLists = (options?: UseQueryOptions<SnagList[], Error>) => {
    return useQuery({
      queryKey: ['snagLists', user?.id],
      queryFn: () => buyerRestApiService.getMySnagLists(),
      enabled: !!user,
      staleTime: 3 * 60 * 1000, // 3 minutes
      gcTime: 10 * 60 * 1000,
      ...options,
    });
  };

  const useSnagList = (id: string, options?: UseQueryOptions<SnagList, Error>) => {
    return useQuery({
      queryKey: ['snagList', id],
      queryFn: () => {
        // This would need to be implemented in the service
        throw new Error('Get snag list by ID not yet implemented');
      },
      enabled: !!id,
      ...options,
    });
  };

  const useCreateSnagList = (options?: UseMutationOptions<SnagList, Error, SnagListInput>) => {
    return useMutation({
      mutationFn: (input: SnagListInput) => {
        // This would need to be implemented in the service
        throw new Error('Create snag list not yet implemented');
      },
      ...options,
    });
  };

  const useCreateSnagItem = (options?: UseMutationOptions<SnagItem, Error, SnagItemInput>) => {
    return useMutation({
      mutationFn: (input: SnagItemInput) => {
        // This would need to be implemented in the service
        throw new Error('Create snag item not yet implemented');
      },
      ...options,
    });
  };

  const useUpdateSnagItem = (options?: UseMutationOptions<SnagItem, Error, { id: string; input: SnagItemInput }>) => {
    return useMutation({
      mutationFn: ({ id, input }: { id: string; input: SnagItemInput }) => {
        // This would need to be implemented in the service
        throw new Error('Update snag item not yet implemented');
      },
      ...options,
    });
  };

  // Home Pack Item Operations
  const useHomePackItems = (propertyId: string, options?: UseQueryOptions<HomePackItem[], Error>) => {
    return useQuery({
      queryKey: ['homePackItems', propertyId],
      queryFn: () => buyerRestApiService.getHomePackItems(propertyId),
      enabled: !!propertyId,
      staleTime: 10 * 60 * 1000, // 10 minutes (documents don't change often)
      gcTime: 30 * 60 * 1000, // 30 minutes
      ...options,
    });
  };

  const useCreateHomePackItem = (options?: UseMutationOptions<HomePackItem, Error, HomePackItemInput>) => {
    return useMutation({
      mutationFn: (input: HomePackItemInput) => {
        // This would use the documents API to create a home pack document
        throw new Error('Create home pack item not yet implemented');
      },
      ...options,
    });
  };

  const useUpdateHomePackItem = (options?: UseMutationOptions<HomePackItem, Error, { id: string; input: HomePackItemInput }>) => {
    return useMutation({
      mutationFn: ({ id, input }: { id: string; input: HomePackItemInput }) => {
        // This would use the documents API to update a home pack document
        throw new Error('Update home pack item not yet implemented');
      },
      ...options,
    });
  };

  const useDeleteHomePackItem = (options?: UseMutationOptions<HomePackItem, Error, string>) => {
    return useMutation({
      mutationFn: (id: string) => {
        // This would use the documents API to delete a home pack document
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

// Export individual hooks for backward compatibility
export const useBuyerAPI = useBuyerRestAPI;