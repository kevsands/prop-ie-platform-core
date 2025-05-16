'use client';

import { useState, useEffect, useContext } from 'react';
import { BuyerJourney, BuyerPhase } from '@/types/buyer-journey';
import { AuthContext } from '@/context/AuthContext';
import { useQuery, useMutation } from './useAppSync';
import type { Property, Offer } from '../types/models';

/**
 * Custom hook to manage buyer journey data
 * Provides access to the buyer's journey through the property purchase process
 */
export function useBuyerJourney(id: string) {
  return useQuery<{ getBuyerJourney: BuyerJourney }>(
    Queries.GET_BUYER_JOURNEY,
    {
      variables: { id },
      transform: (data) => data.getBuyerJourney,
    }
  );
}

export function useBuyerJourneys(filters?: BuyerJourneyFilters) {
  return useQuery<{ listBuyerJourneys: { items: BuyerJourney[] } }>(
    Queries.LIST_BUYER_JOURNEYS,
    {
      variables: { filter: filters },
      transform: (data) => data.listBuyerJourneys.items,
    }
  );
}

export function useCreateBuyerJourney() {
  return useMutation<
    { createBuyerJourney: BuyerJourney },
    { input: { buyerId: string; propertyId: string } }
  >(Mutations.CREATE_BUYER_JOURNEY);
}

export function useUpdateBuyerJourney() {
  return useMutation<
    { updateBuyerJourney: BuyerJourney },
    { input: { id: string; status: string } }
  >(Mutations.UPDATE_BUYER_JOURNEY);
}

export function useSubmitOffer() {
  return useMutation<
    { submitOffer: Offer },
    { input: { buyerJourneyId: string; amount: number } }
  >(Mutations.SUBMIT_OFFER);
}

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
  `,
};

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
  `,
};

interface BuyerJourneyFilters {
  buyerId?: string;
  propertyId?: string;
  status?: string[];
}

export default {
  useBuyerJourney,
  useBuyerJourneys,
  useCreateBuyerJourney,
  useUpdateBuyerJourney,
  useSubmitOffer,
};