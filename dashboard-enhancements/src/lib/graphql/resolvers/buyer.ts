/**
 * GraphQL resolvers for First-Time Buyer features
 * 
 * Handles all resolver functions for the buyer schema
 */

import prisma from '../../prisma';
// Import types from schema
import type { BuyerProfile, Reservation, MortgageTracking, SnagList, User } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { withAuth } from '../utils';
import type { GraphQLContext, AuthContext, ResolverFunction, AuthResolverFunction } from '../../../types/graphql';
// Import directly from client
import { Prisma } from '@prisma/client';

// Define enums since they're not exported from @prisma/client
export enum BuyerJourneyPhase {
  PLANNING = 'planning',
  FINANCING = 'financing',
  SEARCHING = 'searching',
  BUYING = 'buying',
  MOVED_IN = 'moved-in'
}

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

export enum MortgageStatus {
  NOT_STARTED = 'not_started',
  AIP_RECEIVED = 'aip_received',
  AIP_EXPIRED = 'aip_expired',
  MORTGAGE_OFFERED = 'mortgage_offered',
  MORTGAGE_COMPLETED = 'mortgage_completed'
}

export enum SnagStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

export enum SnagItemStatus {
  PENDING = 'pending',
  ACKNOWLEDGED = 'acknowledged',
  FIXED = 'fixed',
  DISPUTED = 'disputed'
}

export enum HomePackItemStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

// Define input types
interface BuyerProfileInput {
  userId: string;
  currentJourneyPhase?: BuyerJourneyPhase;
  financialDetails?: Prisma.InputJsonValue;
  preferences?: Prisma.InputJsonValue;
  governmentSchemes?: Prisma.InputJsonValue;
}

interface BuyerProfileFilter {
  userId?: string;
  currentJourneyPhase?: BuyerJourneyPhase;
}

interface PaginationInput {
  first?: number;
  after?: string;
}

interface ReservationFilter {
  propertyId?: string;
  userId?: string;
  status?: ReservationStatus;
  dateFrom?: Date;
  dateTo?: Date;
}

// Define return types for paginated queries
interface PaginatedBuyerProfiles {
  buyerProfiles: (BuyerProfile & { user: User })[];
  totalCount: number;
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
}

interface PaginatedReservations {
  reservations: (Reservation & { user: User })[];
  totalCount: number;
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
}

// Helper function to get the user ID from the context
const getUserId = (context: GraphQLContext): string => {
  if (!context.user?.userId) {
    throw new GraphQLError('Unauthorized', {
      extensions: { code: 'UNAUTHORIZED' },
    });
  }
  return context.user.userId;
};

// Buyer Profile Resolvers
const buyerProfileResolvers = {
  Query: {
    // Get buyer profile for the current user
    myBuyerProfile: withAuth<unknown, BuyerProfile | null>(async (_parent: unknown, _args: unknown, context: AuthContext) => {
      const userId = getUserId(context);
      return prisma.buyerProfile.findUnique({
        where: { userId },
        include: {
          user: true,
        },
      });
    }),

    // Get buyer profile by ID
    buyerProfile: withAuth<{ id: string }, BuyerProfile | null>(async (_parent: unknown, { id }: { id: string }, context: AuthContext) => {
      return prisma.buyerProfile.findUnique({
        where: { id },
        include: {
          user: true,
        },
      });
    }),

    // List buyer profiles with filtering and pagination
    buyerProfiles: withAuth<{ filter?: BuyerProfileFilter; pagination?: PaginationInput }, PaginatedBuyerProfiles>(
      async (_parent: unknown, args: { filter?: BuyerProfileFilter; pagination?: PaginationInput }, context: AuthContext) => {
        const { filter = {}, pagination = {} } = args;
        const { userId, currentJourneyPhase } = filter;
        const { first = 10, after } = pagination;
        
        // Build the where clause based on filters
        const where = {
          ...(userId && { userId }),
          ...(currentJourneyPhase && { currentJourneyPhase }),
        };
        
        // Get total count for pagination
        const totalCount = await prisma.buyerProfile.count({ where });
        
        // Get buyer profiles with cursor-based pagination
        const buyerProfiles = await prisma.buyerProfile.findMany({
          where,
          take: first,
          ...(after && { skip: 1, cursor: { id: after } }),
          include: {
            user: true,
          },
          orderBy: { createdAt: 'desc' },
        });
        
        // Build pageInfo
        const pageInfo = {
          hasNextPage: buyerProfiles.length === first,
          hasPreviousPage: !!after,
          startCursor: buyerProfiles.length > 0 ? buyerProfiles[0].id : null,
          endCursor: buyerProfiles.length > 0 ? buyerProfiles[buyerProfiles.length - 1].id : null,
        };
        
        return {
          buyerProfiles,
          totalCount,
          pageInfo,
        };
      }
    ),
  },

  Mutation: {
    // Create a new buyer profile
    createBuyerProfile: withAuth<{ input: BuyerProfileInput }, BuyerProfile>(
      async (_parent: unknown, args: { input: BuyerProfileInput }, context: AuthContext) => {
        const { input } = args;
        const userId = getUserId(context);

        // Check if profile already exists
        const existingProfile = await prisma.buyerProfile.findUnique({
          where: { userId },
        });

        if (existingProfile) {
          throw new GraphQLError('Buyer profile already exists for this user', {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }

        // Create new profile
        return prisma.buyerProfile.create({
          data: {
            userId,
            currentJourneyPhase: input.currentJourneyPhase || BuyerJourneyPhase.PLANNING,
            financialDetails: input.financialDetails || Prisma.JsonNull,
            preferences: input.preferences || Prisma.JsonNull,
            governmentSchemes: input.governmentSchemes || Prisma.JsonNull,
          },
          include: {
            user: true,
          },
        });
      }
    ),

    // Update an existing buyer profile
    updateBuyerProfile: withAuth<{ id: string; input: Partial<BuyerProfileInput> }, BuyerProfile>(
      async (_parent: unknown, args: { id: string; input: Partial<BuyerProfileInput> }, context: AuthContext) => {
        const { id, input } = args;
        const userId = getUserId(context);

        // Verify ownership
        const existingProfile = await prisma.buyerProfile.findUnique({
          where: { id },
        });

        if (!existingProfile) {
          throw new GraphQLError('Buyer profile not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }

        if (existingProfile.userId !== userId) {
          throw new GraphQLError('Not authorized to update this profile', {
            extensions: { code: 'FORBIDDEN' },
          });
        }

        // Update profile
        return prisma.buyerProfile.update({
          where: { id },
          data: {
            currentJourneyPhase: input.currentJourneyPhase,
            financialDetails: input.financialDetails,
            preferences: input.preferences,
            governmentSchemes: input.governmentSchemes,
          },
          include: {
            user: true,
          },
        });
      }
    ),

    // Delete a buyer profile
    deleteBuyerProfile: withAuth<{ id: string }, BuyerProfile>(
      async (_parent: unknown, { id }: { id: string }, context: AuthContext) => {
        const userId = getUserId(context);

        // Verify ownership
        const existingProfile = await prisma.buyerProfile.findUnique({
          where: { id },
        });

        if (!existingProfile) {
          throw new GraphQLError('Buyer profile not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }

        if (existingProfile.userId !== userId) {
          throw new GraphQLError('Not authorized to delete this profile', {
            extensions: { code: 'FORBIDDEN' },
          });
        }

        // Delete profile
        return prisma.buyerProfile.delete({
          where: { id },
          include: {
            user: true,
          },
        });
      }
    ),
  },

  // Add field resolvers
  BuyerProfile: {
    user: async (parent: BuyerProfile) => {
      return prisma.user.findUnique({
        where: { id: parent.userId },
      });
    },
    reservations: async (parent: BuyerProfile) => {
      return prisma.reservation.findMany({
        where: { userId: parent.userId },
        include: {
          user: true,
          property: true,
        },
      });
    },
    snagLists: async (parent: BuyerProfile) => {
      return prisma.snagList.findMany({
        where: { userId: parent.userId },
      });
    },
    mortgageTracking: async (parent: BuyerProfile) => {
      return prisma.mortgageTracking.findUnique({
        where: { userId: parent.userId },
      });
    },
  },
};

// Reservation Resolvers
const reservationResolvers = {
  Query: {
    // Get reservations for the current user
    myReservations: withAuth<unknown, Reservation[]>(
      async (_parent: unknown, _args: unknown, context: AuthContext) => {
        const userId = getUserId(context);
        return prisma.reservation.findMany({
          where: { userId },
          include: {
            user: true,
            property: true,
          },
          orderBy: { createdAt: 'desc' },
        });
      }
    ),

    // Get reservation by ID
    reservation: withAuth<{ id: string }, Reservation | null>(
      async (_parent: unknown, { id }: { id: string }, context: AuthContext) => {
        return prisma.reservation.findUnique({
          where: { id },
          include: {
            user: true,
            property: true,
          },
        });
      }
    ),

    // List reservations with filtering and pagination
    reservations: withAuth<{ filter?: ReservationFilter; pagination?: PaginationInput }, PaginatedReservations>(
      async (_parent: unknown, args: { filter?: ReservationFilter; pagination?: PaginationInput }, context: AuthContext) => {
        const { filter = {}, pagination = {} } = args;
        const { propertyId, userId, status, dateFrom, dateTo } = filter;
        const { first = 10, after } = pagination;
        
        // Build the where clause based on filters
        const where = {
          ...(propertyId && { propertyId }),
          ...(userId && { userId }),
          ...(status && { status }),
          ...(dateFrom && dateTo && {
            createdAt: {
              gte: dateFrom,
              lte: dateTo,
            },
          }),
        };
        
        // Get total count for pagination
        const totalCount = await prisma.reservation.count({ where });
        
        // Get reservations with cursor-based pagination
        const reservations = await prisma.reservation.findMany({
          where,
          take: first,
          ...(after && { skip: 1, cursor: { id: after } }),
          include: {
            user: true,
            property: true,
          },
          orderBy: { createdAt: 'desc' },
        });
        
        // Build pageInfo
        const pageInfo = {
          hasNextPage: reservations.length === first,
          hasPreviousPage: !!after,
          startCursor: reservations.length > 0 ? reservations[0].id : null,
          endCursor: reservations.length > 0 ? reservations[reservations.length - 1].id : null,
        };
        
        return {
          reservations,
          totalCount,
          pageInfo,
        };
      }
    ),
  },

  Mutation: {
    // Create a new reservation
    createReservation: withAuth<{ input: { propertyId: string } }, Reservation>(
      async (_parent: unknown, args: { input: { propertyId: string } }, context: AuthContext) => {
        const { input } = args;
        const { propertyId } = input;
        const userId = getUserId(context);
        
        // Check if the property exists
        const property = await prisma.unit.findUnique({
          where: { id: propertyId },
        });
        
        if (!property) {
          throw new GraphQLError('Property not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }
        
        // Check if the user already has a reservation for this property
        const existingReservation = await prisma.reservation.findFirst({
          where: {
            propertyId,
            userId,
            status: {
              not: ReservationStatus.CANCELLED,
            },
          },
        });
        
        if (existingReservation) {
          throw new GraphQLError('You already have a reservation for this property', {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }
        
        return prisma.reservation.create({
          data: {
            propertyId,
            userId,
            status: ReservationStatus.PENDING,
            depositAmount: 0,
            depositPaid: false,
            agreementSigned: false,
          },
          include: {
            property: true,
            user: true,
          },
        });
      }
    ),

    // Update reservation status
    updateReservationStatus: withAuth<{ id: string; status: ReservationStatus }, Reservation>(
      async (_parent: unknown, args: { id: string; status: ReservationStatus }, context: AuthContext) => {
        const { id, status } = args;
        const userId = getUserId(context);
        
        // Check if the reservation exists and belongs to the user
        const reservation = await prisma.reservation.findFirst({
          where: {
            id,
            userId,
          },
        });
        
        if (!reservation) {
          throw new GraphQLError('Reservation not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }
        
        return prisma.reservation.update({
          where: { id },
          data: { status },
          include: {
            property: true,
            user: true,
          },
        });
      }
    ),

    // Cancel reservation
    cancelReservation: withAuth<{ id: string; reason: string }, Reservation>(
      async (_parent: unknown, args: { id: string; reason: string }, context: AuthContext) => {
        const { id, reason } = args;
        const userId = getUserId(context);
        
        // Check if the reservation exists and belongs to the user
        const reservation = await prisma.reservation.findFirst({
          where: {
            id,
            userId,
          },
        });
        
        if (!reservation) {
          throw new GraphQLError('Reservation not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }
        
        // First check if cancellationReason exists in the schema
        // If it does not, we need a workaround
        // Since cancellationReason is in the prisma schema (line 152), but TypeScript doesn't recognize it
        // We need to use a type assertion to bypass the error
        
        // Create the update data using type assertion
        const updateData: any = {
          status: ReservationStatus.CANCELLED,
          cancellationReason: reason,
        };
        
        return prisma.reservation.update({
          where: { id },
          data: updateData,
          include: {
            property: true,
            user: true,
          },
        });
      }
    ),
  },

  // Field resolvers
  Reservation: {
    property: async (parent: Reservation) => {
      return prisma.unit.findUnique({
        where: { id: parent.propertyId },
      });
    },
    user: async (parent: Reservation) => {
      return prisma.user.findUnique({
        where: { id: parent.userId },
      });
    },
    documents: async (parent: Reservation) => {
      return prisma.document.findMany({
        where: { reservationId: parent.id },
      });
    },
  },
};

// Combine all resolver objects
const buyerResolvers = {
  Query: {
    ...buyerProfileResolvers.Query,
    ...reservationResolvers.Query,
  },
  Mutation: {
    ...buyerProfileResolvers.Mutation,
    ...reservationResolvers.Mutation,
  },
  BuyerProfile: buyerProfileResolvers.BuyerProfile,
  Reservation: reservationResolvers.Reservation,
};

export default buyerResolvers;