'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { buyerJourneyQueryKeys } from '@/lib/api/buyer-journey-api';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { useCallback } from 'react';
import { BuyerJourneyError } from '@/lib/errors/buyer-journey-errors';
import type { TransactionStatus } from '@/lib/validation/buyer-journey';
import { z } from 'zod';
import { buyerJourneyAnalytics } from '@/lib/analytics/buyer-journey-analytics';

// Legacy imports - keeping for backward compatibility
import { useQuery as useAppSyncQuery, useMutation as useAppSyncMutation } from './useAppSync';
import type { BuyerJourney, BuyerPhase } from '@/types/buyer-journey';
import type { Property, Offer } from '../types/models';

// API client - imported here instead of direct import to prevent circular dependencies
import { buyerJourneyApi } from '@/lib/api/buyer-journey-api';

/**
 * Enhanced buyer journey hook with comprehensive error handling,
 * optimistic updates and React Query integration
 */
export function useBuyerJourneyManager(options: {
  onError?: (error: BuyerJourneyError) => void;
  developmentId?: string;
} = {}) {
  const { onError, developmentId } = options;
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Error handler with toast notifications
  const handleError = useCallback((error: unknown) => {
    let buyerJourneyError: BuyerJourneyError;

    if (error instanceof BuyerJourneyError) {
      buyerJourneyError = error;
    } else if (error instanceof Error) {
      buyerJourneyError = new BuyerJourneyError(
        error.message,
        'UNKNOWN_ERROR',
        'An unexpected error occurred',
        { originalError: error },
        false
      );
    } else {
      buyerJourneyError = new BuyerJourneyError(
        'Unknown error',
        'UNKNOWN_ERROR',
        'An unexpected error occurred',
        { originalError: error },
        false
      );
    }

    // Display user-friendly error toast
    toast({
      title: 'Error',
      description: buyerJourneyError.userMessage,
      variant: 'destructive'
    });

    // Call custom error handler if provided
    if (onError) {
      onError(buyerJourneyError);
    }

    return buyerJourneyError;
  }, [onError]);

  // Units
  const useUnits = (filters?: Record<string, any>) => {
    return useQuery({
      queryKey: buyerJourneyQueryKeys.units(developmentId),
      queryFn: () => buyerJourneyApi.getUnits(developmentId || '', filters),
      enabled: !!developmentId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      onError: handleError
    });
  };

  const useUnit = (unitId: string) => {
    return useQuery({
      queryKey: buyerJourneyQueryKeys.unit(unitId),
      queryFn: () => buyerJourneyApi.getUnit(unitId),
      enabled: !!unitId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      onError: handleError
    });
  };

  // KYC
  const useKYCStatus = (userId?: string) => {
    const userIdToUse = userId || user?.id;

    return useQuery({
      queryKey: buyerJourneyQueryKeys.kycStatus(userIdToUse || ''),
      queryFn: () => buyerJourneyApi.getKYCStatus(userIdToUse || ''),
      enabled: !!userIdToUse && isAuthenticated,
      staleTime: 60 * 1000, // 1 minute
      onError: handleError
    });
  };

  // Transactions
  const useTransaction = (transactionId?: string) => {
    return useQuery({
      queryKey: buyerJourneyQueryKeys.transaction(transactionId || ''),
      queryFn: () => buyerJourneyApi.getTransaction(transactionId || ''),
      enabled: !!transactionId,
      staleTime: 30 * 1000, // 30 seconds - more frequent updates for active transactions
      refetchInterval: 30 * 1000, // Poll every 30 seconds for updates
      onError: handleError
    });
  };

  const useBuyerReservations = (buyerId?: string) => {
    const buyerIdToUse = buyerId || user?.id;

    return useQuery({
      queryKey: buyerJourneyQueryKeys.reservations(buyerIdToUse),
      queryFn: () => buyerJourneyApi.getTransactions({ buyerId: buyerIdToUse }),
      enabled: !!buyerIdToUse && isAuthenticated,
      staleTime: 60 * 1000, // 1 minute
      onError: handleError
    });
  };

  // Mutations
  const useCreateReservation = () => {
    return useMutation({
      mutationFn: (data: {
        unitId: string;
        developmentId: string;
        agreedPrice: number;
        mortgageRequired?: boolean;
        helpToBuyUsed?: boolean;
        buyerId?: string;
        notes?: string;
        unitType?: string; // Optional for analytics
      }) => {
        // Default buyerId to current user if not provided
        const reservationData = {
          ...data,
          buyerId: data.buyerId || user?.id || ''
        };

        // Start timing the reservation process
        buyerJourneyAnalytics.startStepTimer(`reserve_unit_${data.unitId}`);

        return buyerJourneyApi.createReservation(reservationData);
      },
      onSuccess: (datavariables) => {
        // Track successful reservation
        buyerJourneyAnalytics.trackUnitReserved(
          data.unitId,
          variables.unitType || 'unknown',
          data.agreedPrice,
          {
            development_id: data.developmentId,
            mortgage_required: data.mortgageRequired,
            help_to_buy_used: data.helpToBuyUsed
          }
        );

        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: buyerJourneyQueryKeys.reservations() });
        queryClient.invalidateQueries({ queryKey: buyerJourneyQueryKeys.unit(data.unitId) });
        queryClient.invalidateQueries({ queryKey: buyerJourneyQueryKeys.units() });

        // Show success toast
        toast({
          title: 'Unit Reserved',
          description: 'Your unit has been successfully reserved'});
      },
      onError: (errorvariables) => {
        // Track reservation error
        buyerJourneyAnalytics.trackError(
          'reservation_error', 
          error instanceof Error ? error.message : 'Unknown error',
          { 
            unit_id: variables.unitId,
            development_id: variables.developmentId
          }
        );

        handleError(error);
      }
    });
  };

  const useStartKYCVerification = () => {
    return useMutation({
      mutationFn: (transactionId: string) => {
        // Track KYC process started
        buyerJourneyAnalytics.trackEvent('kyc_started', {
          transaction_id: transactionId,
          user_id: user?.id
        });

        return buyerJourneyApi.startKYCVerification(transactionId);
      },
      onSuccess: (data) => {
        // Track verification ID created
        buyerJourneyAnalytics.trackEvent('kyc_verification_created', {
          verification_id: data.verificationId
        });
      },
      onError: (errortransactionId) => {
        // Track error
        buyerJourneyAnalytics.trackError('kyc_start_error', 
          error instanceof Error ? error.message : 'Unknown error',
          { transaction_id: transactionId }
        );
        handleError(error);
      }
    });
  };

  const useUploadDocument = () => {
    return useMutation({
      mutationFn: (formData: FormData) => {
        // Get document metadata for analytics if available
        const documentType = formData.get('documentType') as string || 'unknown';
        const file = formData.get('file') as File;

        // Track document upload started
        if (file) {
          buyerJourneyAnalytics.trackEvent('kyc_document_upload_started', {
            document_type: documentType,
            file_size: file.size,
            mime_type: file.type
          });
        }

        return buyerJourneyApi.uploadDocument(formData);
      },
      onSuccess: (dataformData) => {
        // Track successful document upload
        const documentType = formData.get('documentType') as string || 'unknown';
        buyerJourneyAnalytics.trackEvent('kyc_document_uploaded', {
          document_type: documentType,
          document_id: data.documentId || 'unknown'
        });
      },
      onError: (errorformData) => {
        const documentType = formData.get('documentType') as string || 'unknown';
        buyerJourneyAnalytics.trackError('document_upload_error', 
          error instanceof Error ? error.message : 'Unknown error',
          { document_type: documentType }
        );
        handleError(error);
      }
    });
  };

  const useCompleteKYCVerification = () => {
    return useMutation({
      mutationFn: (verificationId: string) => {
        // Track KYC verification completion started
        buyerJourneyAnalytics.startStepTimer('kyc_completion');

        return buyerJourneyApi.completeVerification(verificationId);
      },
      onSuccess: (dataverificationId) => {
        // Track KYC verification completed
        buyerJourneyAnalytics.trackEvent('kyc_verification_completed', {
          verification_id: verificationId,
          verification_method: 'standard',
          time_spent_ms: Date.now() - (buyerJourneyAnalytics.session?.getStepStartTime?.('kyc_completion') || Date.now())
        });

        // Invalidate KYC status query
        if (user?.id) {
          queryClient.invalidateQueries({ queryKey: buyerJourneyQueryKeys.kycStatus(user.id) });
        }
      },
      onError: (errorverificationId) => {
        buyerJourneyAnalytics.trackError('kyc_completion_error', 
          error instanceof Error ? error.message : 'Unknown error',
          { verification_id: verificationId }
        );
        handleError(error);
      }
    });
  };

  const useProcessDeposit = () => {
    return useMutation({
      mutationFn: (data: {
        transactionId: string;
        amount: number;
        paymentMethod: 'credit_card' | 'debit_card' | 'bank_transfer';
        billingDetails: {
          name: string;
          email: string;
          addressLine1: string;
          addressLine2?: string;
          city: string;
          postalCode: string;
          country: string;
        };
      }) => {
        // Track payment started
        buyerJourneyAnalytics.trackEvent('payment_started', {
          transaction_id: data.transactionId,
          amount: data.amount,
          payment_method: data.paymentMethod
        });

        // Start timing payment process
        buyerJourneyAnalytics.startStepTimer(`payment_${data.transactionId}`);

        return buyerJourneyApi.processDeposit(data);
      },
      onSuccess: (datavariables) => {
        // Track payment completed
        buyerJourneyAnalytics.trackPaymentCompleted(
          data.transactionId || variables.transactionId,
          variables.amount,
          variables.paymentMethod,
          {
            time_spent_ms: buyerJourneyAnalytics.session.getStepDuration(`payment_${variables.transactionId}`)
          }
        );

        // Invalidate transaction query
        queryClient.invalidateQueries({ 
          queryKey: buyerJourneyQueryKeys.transaction(data.transactionId) 
        });

        // Show success toast
        toast({
          title: 'Payment Successful',
          description: 'Your deposit payment has been processed successfully'});
      },
      onError: (errorvariables) => {
        // Track payment error
        buyerJourneyAnalytics.trackError('payment_processing_error', 
          error instanceof Error ? error.message : 'Unknown error',
          { 
            transaction_id: variables.transactionId,
            payment_method: variables.paymentMethod,
            amount: variables.amount
          }
        );

        handleError(error);
      }
    });
  };

  const useUpdateTransactionStatus = () => {
    return useMutation({
      mutationFn: ({ 
        transactionId, 
        newStatus, 
        notes 
      }: { 
        transactionId: string; 
        newStatus: TransactionStatus; 
        notes?: string 
      }) => {
        // Track status update attempt
        buyerJourneyAnalytics.trackEvent('transaction_status_update', {
          transaction_id: transactionId,
          new_status: newStatus,
          has_notes: !!notes
        });

        return buyerJourneyApi.updateTransactionStatus(transactionId, newStatusnotes);
      },
      onSuccess: (datavariables) => {
        // Track status update success
        buyerJourneyAnalytics.trackEvent('transaction_status_updated', {
          transaction_id: data.id,
          previous_status: data.status !== variables.newStatus ? data.status : 'unknown',
          new_status: variables.newStatus
        });

        // For specific journey-related statuses, track journey events
        if (variables.newStatus === 'COMPLETED') {
          buyerJourneyAnalytics.trackJourneyCompleted(data.id);
        }

        // Invalidate transaction queries
        queryClient.invalidateQueries({ 
          queryKey: buyerJourneyQueryKeys.transaction(data.id) 
        });
        queryClient.invalidateQueries({ 
          queryKey: buyerJourneyQueryKeys.reservations() 
        });
      },
      onError: (errorvariables) => {
        // Track error
        buyerJourneyAnalytics.trackError('transaction_status_update_error', 
          error instanceof Error ? error.message : 'Unknown error',
          { 
            transaction_id: variables.transactionId,
            attempted_status: variables.newStatus
          }
        );

        handleError(error);
      }
    });
  };

  return {
    // Queries
    useUnits,
    useUnit,
    useKYCStatus,
    useTransaction,
    useBuyerReservations,

    // Mutations
    useCreateReservation,
    useStartKYCVerification,
    useUploadDocument,
    useCompleteKYCVerification,
    useProcessDeposit,
    useUpdateTransactionStatus
  };
}

// Legacy functions - maintaining backward compatibility
export function useBuyerJourney(id: string) {
  return useAppSyncQuery<{ getBuyerJourney: BuyerJourney }>(
    Queries.GET_BUYER_JOURNEY,
    {
      variables: { id },
      transform: (data) => data.getBuyerJourney}
  );
}

export function useBuyerJourneys(filters?: BuyerJourneyFilters) {
  return useAppSyncQuery<{ listBuyerJourneys: { items: BuyerJourney[] } }>(
    Queries.LIST_BUYER_JOURNEYS,
    {
      variables: { filter: filters },
      transform: (data) => data.listBuyerJourneys.items}
  );
}

export function useCreateBuyerJourney() {
  return useAppSyncMutation<
    { createBuyerJourney: BuyerJourney },
    { input: { buyerId: string; propertyId: string } }
  >(Mutations.CREATE_BUYER_JOURNEY);
}

export function useUpdateBuyerJourney() {
  return useAppSyncMutation<
    { updateBuyerJourney: BuyerJourney },
    { input: { id: string; status: string } }
  >(Mutations.UPDATE_BUYER_JOURNEY);
}

export function useSubmitOffer() {
  return useAppSyncMutation<
    { submitOffer: Offer },
    { input: { buyerJourneyId: string; amount: number } }
  >(Mutations.SUBMIT_OFFER);
}

// Legacy GraphQL queries
const Queries = {
  GET_BUYER_JOURNEY: `
    query GetBuyerJourney($id: ID!) {
      getBuyerJourney(id: $id) {
        id
        status
        buyer {
          id
          name
          email
        }
        property {
          id
          name
          price
          status
        }
        offers {
          id
          amount
          status
          createdAt
        }
        documents {
          id
          type
          status
          url
        }
        timeline {
          id
          event
          timestamp
          metadata
        }
        createdAt
        updatedAt
      }
    }
  `,

  LIST_BUYER_JOURNEYS: `
    query ListBuyerJourneys($filter: BuyerJourneyFilterInput) {
      listBuyerJourneys(filter: $filter) {
        items {
          id
          status
          buyer {
            id
            name
          }
          property {
            id
            name
          }
          createdAt
        }
      }
    }
  `};

// Legacy GraphQL mutations
const Mutations = {
  CREATE_BUYER_JOURNEY: `
    mutation CreateBuyerJourney($input: CreateBuyerJourneyInput!) {
      createBuyerJourney(input: $input) {
        id
        status
        buyer {
          id
          name
        }
        property {
          id
          name
        }
        createdAt
      }
    }
  `,

  UPDATE_BUYER_JOURNEY: `
    mutation UpdateBuyerJourney($input: UpdateBuyerJourneyInput!) {
      updateBuyerJourney(input: $input) {
        id
        status
        updatedAt
      }
    }
  `,

  SUBMIT_OFFER: `
    mutation SubmitOffer($input: SubmitOfferInput!) {
      submitOffer(input: $input) {
        id
        amount
        status
        createdAt
      }
    }
  `};

interface BuyerJourneyFilters {
  buyerId?: string;
  propertyId?: string;
  status?: string[];
}

// Export both new and legacy APIs
export default {
  // New API
  useBuyerJourneyManager,

  // Legacy API
  useBuyerJourney,
  useBuyerJourneys,
  useCreateBuyerJourney,
  useUpdateBuyerJourney,
  useSubmitOffer};