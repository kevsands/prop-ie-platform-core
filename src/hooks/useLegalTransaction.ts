import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LegalReservation, LegalTransactionApiResponse } from '@/types/legal';

/**
 * Custom hook for managing legal transaction state
 * Integrates with existing React Query setup
 */
export const useLegalTransaction = (reservationId?: string) => {
  const queryClient = useQueryClient();

  // Get legal reservation details
  const { data: reservation, isLoading, error } = useQuery({
    queryKey: ['legal-reservation', reservationId],
    queryFn: async (): Promise<LegalReservation> => {
      if (!reservationId) throw new Error('Reservation ID required');

      const response = await fetch(`/api/legal/reservations/${reservationId}`);
      const data: LegalTransactionApiResponse<LegalReservation> = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch reservation');
      }

      return data.data!;
    },
    enabled: !!reservationId,
    staleTime: 30000, // 30 seconds
    gcTime: 300000 // 5 minutes
  });

  // Update reservation mutation
  const updateReservation = useMutation({
    mutationFn: async (updates: Partial<LegalReservation>) => {
      if (!reservationId) throw new Error('Reservation ID required');

      const response = await fetch(`/api/legal/reservations/${reservationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });

      const data: LegalTransactionApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to update reservation');
      }

      return data.data;
    },
    onSuccess: () => {
      // Invalidate and refetch reservation data
      queryClient.invalidateQueries({ queryKey: ['legal-reservation', reservationId] });
      // Also invalidate related transaction data
      queryClient.invalidateQueries({ queryKey: ['transaction'] });
    }
  });

  // Initiate booking mutation
  const initiateBooking = useMutation({
    mutationFn: async (params: { unitId: string; buyerId: string }) => {
      const response = await fetch('/api/booking/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });

      const data: LegalTransactionApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to initiate booking');
      }

      return data.data;
    },
    onSuccess: (data: any) => {
      // Cache the new reservation
      queryClient.setQueryData(['legal-reservation', data.reservationId], data);
    }
  });

  // Confirm deposit payment mutation
  const confirmDeposit = useMutation({
    mutationFn: async (params: { paymentIntentId: string; amount: number }) => {
      if (!reservationId) throw new Error('Reservation ID required');

      const response = await fetch('/api/deposit/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservationId,
          ...params
        })
      });

      const data: LegalTransactionApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to confirm deposit');
      }

      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legal-reservation', reservationId] });
    }
  });

  // Nominate solicitor mutation
  const nominateSolicitor = useMutation({
    mutationFn: async (solicitorDetails: any) => {
      if (!reservationId) throw new Error('Reservation ID required');

      const response = await fetch('/api/buyer/solicitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservationId,
          solicitorDetails
        })
      });

      const data: LegalTransactionApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to nominate solicitor');
      }

      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legal-reservation', reservationId] });
    }
  });

  // Generate contract mutation
  const generateContract = useMutation({
    mutationFn: async () => {
      if (!reservationId) throw new Error('Reservation ID required');

      const response = await fetch('/api/contracts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId })
      });

      const data: LegalTransactionApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate contract');
      }

      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legal-reservation', reservationId] });
    }
  });

  // Initiate signing mutation
  const initiateSigning = useMutation({
    mutationFn: async () => {
      if (!reservationId) throw new Error('Reservation ID required');

      const response = await fetch('/api/contracts/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservationId,
          contractConfirmed: true
        })
      });

      const data: LegalTransactionApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to initiate signing');
      }

      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legal-reservation', reservationId] });
    }
  });

  // Finalize contract mutation
  const finalizeContract = useMutation({
    mutationFn: async (params: { envelopeId: string; signedContractUrl?: string }) => {
      if (!reservationId) throw new Error('Reservation ID required');

      const response = await fetch('/api/contracts/finalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservationId,
          ...params
        })
      });

      const data: LegalTransactionApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to finalize contract');
      }

      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legal-reservation', reservationId] });
      // Also refresh main transaction data
      queryClient.invalidateQueries({ queryKey: ['transaction'] });
    }
  });

  return {
    // Data
    reservation,
    isLoading,
    error,

    // Mutations
    initiateBooking,
    confirmDeposit,
    nominateSolicitor,
    generateContract,
    initiateSigning,
    finalizeContract,
    updateReservation,

    // Loading states
    isInitiatingBooking: initiateBooking.isPending,
    isConfirmingDeposit: confirmDeposit.isPending,
    isNominatingSolicitor: nominateSolicitor.isPending,
    isGeneratingContract: generateContract.isPending,
    isInitiatingSigning: initiateSigning.isPending,
    isFinalizingContract: finalizeContract.isPending,
    isUpdating: updateReservation.isPending,

    // Helper functions
    isStep: (step: string) => reservation?.status === step,
    canProceedToStep: (step: string) => {
      // Add logic to determine if user can proceed to a specific step
      return true; // Simplified for now
    }
  };
};