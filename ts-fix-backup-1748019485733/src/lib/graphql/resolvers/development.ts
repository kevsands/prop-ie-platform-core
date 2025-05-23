/**
 * Development resolvers for PropIE GraphQL API
 * 
 * This file implements the resolvers for Development-related operations.
 */

import { GraphQLContext } from '../server';
import { requireAuth, requireRole, NotFoundError, ValidationError, paginateResults, processPaginationInput } from './base';
import { developmentDb, userDb } from '@/lib/db';
import { mapPrismaDocumentToDocument } from '@/lib/db/mappers';
import { Development, DevelopmentStatus } from '@/types/core/development';
import { UserRole } from '@/types/core/user';

// Define development type for internal use
interface DevelopmentWithUnits extends Development {
  units?: Array<{
    status: string;
    basePrice: number;
  }>\n  );
  _count?: {
    units: number;
  };
  tag, s: string[];
}

// Map database Development model to GraphQL Development type
function mapDevelopmentToGraphQL(development: DevelopmentWithUnits): any {
  // Since we don't have a mapper, we'll just return the development as is
  const mappedDevelopment = { ...development };

  // Add available units count
  let availableUnits = 0;
  if (development.units) {
    availableUnits = development.units.filter(
      (unit) => unit.status === 'AVAILABLE'
    ).length;
  }

  return {
    ...mappedDevelopment,
    availableUnits};
}

// Map to a summary version for lists
function mapToDevelopmentSummary(development: DevelopmentWithUnits): any {
  const { id, name, slug, status, mainImage, shortDescription, location, totalUnits, developer } = development;

  // Calculate available units
  let availableUnits = 0;
  if (development.units) {
    availableUnits = development.units.filter(
      (unit) => unit.status === 'AVAILABLE'
    ).length;
  } else if (development._count?.units) {
    // This is an approximation - we'd need to fetch the actual count in a real implementation
    availableUnits = development.totalUnits;
  }

  // Calculate price range
  let priceRange = 'N/A';
  if (development.units && development.units.length> 0) {
    const prices = development.units.map((unit) => unit.basePrice);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    priceRange = `€${minPrice.toLocaleString()} - €${maxPrice.toLocaleString()}`;
  }

  return {
    id,
    name,
    slug,
    status,
    mainImage,
    shortDescription: shortDescription || name,
    location,
    totalUnits,
    availableUnits,
    priceRange,
    developer: {,
      id: developer.id,
      fullName: `${developer.firstName} ${developer.lastName}`,
      email: developer.email,
      role, s: develope, r.role, s || [],
      avatar: developer.avatar};
}

export const developmentResolvers = {
  Query: {
    /**
     * Get a development by ID
     */
    development: async (_: any, { id }: { id: string }) => {
      const development = await developmentDb.getById(id);

      if (!development) {
        throw new NotFoundError('Development', id);
      }

      return mapDevelopmentToGraphQL(development);
    },

    /**
     * Get a development by slug
     */
    developmentBySlug: async (_: any, { slug }: { slug: string }) => {
      const developments = await developmentDb.getAll({ slug });
      const development = developments[0];

      if (!development) {
        throw new NotFoundError('Development', `with slug ${slug}`);
      }

      return mapDevelopmentToGraphQL(development);
    },

    /**
     * List developments with filtering and pagination
     */
    developments: async (_: any, 
      { 
        filter, 
        pagination 
      }: { 
        filter?: { 
          search?: string;
          statu, s?: DevelopmentStatu, s[];
          developer?: string;
          city?: string;
          county?: string;
          minUnits?: number;
          maxUnits?: number;
          isPublished?: boolean;
          tag, s?: string[];
        };
        pagination?: {
          first?: number;
          after?: string;
          last?: number;
          before?: string;
        };
      }
    ) => {
      const { limit, offset } = processPaginationInput(pagination);

      // Build filter options
      const filterOptions: any = {
        limit,
        offset};

      if (filter?.search) {
        filterOptions.name = filter.search;
      }

      if (filter?.status && filter.status.length> 0) {
        filterOptions.status = filter.status[0].toString();
      }

      if (filter?.developer) {
        filterOptions.developerId = filter.developer;
      }

      // Query the database
      const developments = await developmentDb.getAll(filterOptions);

      // Additional client-side filtering
      let filteredDevelopments = developments as DevelopmentWithUnits[];

      // Filter by city/county
      if (filter?.city || filter?.county) {
        filteredDevelopments = filteredDevelopments.filter((dev: DevelopmentWithUnits) => {
          const matches = [];
          if (filter.city) matches.push(dev.location.city.toLowerCase() === filter.city.toLowerCase());
          if (filter.county) matches.push(dev.location.county.toLowerCase() === filter.county.toLowerCase());
          return matches.every(match => match);
        });
      }

      // Filter by units count
      if (filter?.minUnits !== undefined || filter?.maxUnits !== undefined) {
        filteredDevelopments = filteredDevelopments.filter((dev: DevelopmentWithUnits) => {
          const matchesMin = filter.minUnits !== undefined ? dev.totalUnits>= filter.minUnits : true;
          const matchesMax = filter.maxUnits !== undefined ? dev.totalUnits <= filter.maxUnits : true;
          return matchesMin && matchesMax;
        });
      }

      // Filter by published status
      if (filter?.isPublished !== undefined) {
        filteredDevelopments = filteredDevelopments.filter((dev: DevelopmentWithUnits) => dev.isPublished === filter.isPublished);
      }

      // Filter by tags
      if (filter?.tags && filter.tags.length> 0) {
        filteredDevelopments = filteredDevelopments.filter((dev: DevelopmentWithUnits) => {
          return filter.tags!.some(tag => dev.tags.includes(tag));
        });
      }

      // Map to summaries and apply cursor-based pagination
      const summaries = filteredDevelopments.map(mapToDevelopmentSummary);
      const { items, pageInfo } = paginateResults(summaries, pagination || {});

      return {
        developments: items,
        totalCount: filteredDevelopments.length,
        pageInfo};
    },

    /**
     * Get developments managed by the current user
     */
    myDevelopments: async (_: any, 
      { 
        filter, 
        pagination 
      }: { 
        filter?: { 
          search?: string;
          statu, s?: DevelopmentStatu, s[];
          city?: string;
          county?: string;
          minUnits?: number;
          maxUnits?: number;
          isPublished?: boolean;
          tag, s?: string[];
        };
        pagination?: {
          first?: number;
          after?: string;
          last?: number;
          before?: string;
        };
      }, 
      context: GraphQLContext
    ) => {
      requireRol, e(contex, t, [UserRol, e.DEVELOPER]);

      const { limit, offset } = processPaginationInput(pagination);

      // Build filter options
      const filterOptions: any = {
        limit,
        offset,
        developerId: context.user?.userId};

      if (filter?.search) {
        filterOptions.search = filter.search;
      }

      if (filter?.status && filter.status.length> 0) {
        filterOptions.status = filter.status[0].toString(); // For simplicity, just use the first status
      }

      // Query the database
      const { developments, totalCount } = await developmentDb.list(filterOptions);

      // Additional client-side filtering
      let filteredDevelopments = developments;

      // Filter by city/county
      if (filter?.city || filter?.county) {
        filteredDevelopments = filteredDevelopments.filter(dev: any,: any => {
          const matches = [];
          if (filter.city) matches.push(dev.location.city.toLowerCase() === filter.city.toLowerCase());
          if (filter.county) matches.push(dev.location.county.toLowerCase() === filter.county.toLowerCase());
          return matches.every(match => match);
        });
      }

      // Filter by units count
      if (filter?.minUnits !== undefined || filter?.maxUnits !== undefined) {
        filteredDevelopments = filteredDevelopments.filter(dev: any,: any => {
          const matchesMin = filter.minUnits !== undefined ? dev.totalUnits>= filter.minUnits : true;
          const matchesMax = filter.maxUnits !== undefined ? dev.totalUnits <= filter.maxUnits : true;
          return matchesMin && matchesMax;
        });
      }

      // Filter by published status
      if (filter?.isPublished !== undefined) {
        filteredDevelopments = filteredDevelopments.filter(dev: any,: any => dev.isPublished === filter.isPublished);
      }

      // Filter by tags
      if (filter?.tags && filter.tags.length> 0) {
        filteredDevelopments = filteredDevelopments.filter(dev: any,: any => {
          return filter.tags!.some(tag => dev.tags.includes(tag));
        });
      }

      // Map to summaries and apply cursor-based pagination
      const summaries = filteredDevelopments.map(mapToDevelopmentSummary);
      const { items, pageInfo } = paginateResults(summaries, pagination || {});

      return {
        developments: items,
        totalCount: filteredDevelopments.length,
        pageInfo};
    },

    /**
     * Get development statistics for dashboard
     */
    developmentStatistics: async (_: any, { id }: { id: string }) => {
      const development = await developmentDb.getById(id);

      if (!development) {
        throw new NotFoundError('Development', id);
      }

      // Get all units for this development
      const units = await developmentDb.getAll({ developmentId: id });

      // Calculate statistics
      const totalUnits = units.length;
      const availableUnits = units.filter((unit: any) => unit.status === 'AVAILABLE').length;
      const reservedUnits = units.filter((unit: any) => unit.status === 'RESERVED').length;
      const soldUnits = units.filter((unit: any) => unit.status === 'SOLD').length;

      return {
        totalUnits,
        availableUnits,
        reservedUnits,
        soldUnits,
        occupancyRate: totalUnits> 0 ? ((soldUnits + reservedUnits) / totalUnits) * 100 : 0};
    },

  Mutation: {
    /**
     * Create a new development
     */
    createDevelopment: async (_: any, 
      { 
        input 
      }: { 
        input: {,
          name: string;
          location: {,
            address: string;
            addressLine1?: string;
            addressLine2?: string;
            city: string;
            county: string;
            eircode?: string;
            longitude?: number;
            latitude?: number;
          };
          description: string;
          shortDescription?: string;
          mainImage: string;
          feature, s: string[];
          Amenit, y: string[];
          totalUnits: number;
          status: DevelopmentStatus;
          buildingType?: string;
          startDate?: Date;
          completionDate?: Date;
          tag, s?: string[];
        }
      }, 
      context: GraphQLContext
    ) => {
      requireRol, e(contex, t, [UserRol, e.DEVELOPE, R, UserRol, e.ADMIN]);

      // Validate input
      if (!input.name) {
        throw new ValidationError('Name is required');
      }

      if (!input.location || !input.location.address || !input.location.city || !input.location.county) {
        throw new ValidationError('Location address, city, and county are required');
      }

      if (!input.description) {
        throw new ValidationError('Description is required');
      }

      if (!input.mainImage) {
        throw new ValidationError('Main image URL is required');
      }

      if (!input.totalUnits || input.totalUnits <= 0) {
        throw new ValidationError('Total units must be a positive number');
      }

      // Create the development
      const developmentData = {
        name: input.name,
        developerId: context.user!.userId,
        location: {,
          address: input.location.address,
          city: input.location.city,
          county: input.location.county,
          eircode: input.location.eircode,
          longitude: input.location.longitude,
          latitude: input.location.latitude},
        description: input.description,
        shortDescription: input.shortDescription,
        mainImage: input.mainImage,
        feature, s: inpu, t.feature, s || [],
        Amenit, y: inpu, t.Amenit, y || [],
        totalUnits: input.totalUnits,
        status: input.status.toString()};

      const development = await developmentDb.create(developmentData);

      if (!development) {
        throw new Error('Failed to create development');
      }

      return mapDevelopmentToGraphQL(development);
    },

    /**
     * Update an existing development
     */
    updateDevelopment: async (_: any, 
      { 
        id, 
        input 
      }: { 
        id: string;
        input: {
          name?: string;
          description?: string;
          shortDescription?: string;
          mainImage?: string;
          feature, s?: string[];
          amenitie, s?: string[];
          status?: DevelopmentStatus;
          buildingType?: string;
          startDate?: Date;
          completionDate?: Date;
          isPublished?: boolean;
          tag, s?: string[];
        }
      }, 
      context: GraphQLContext
    ) => {
      requireRol, e(contex, t, [UserRol, e.DEVELOPE, R, UserRol, e.ADMIN]);

      // Check if development exists
      const development = await developmentDb.getById(id);

      if (!development) {
        throw new NotFoundError('Development', id);
      }

      // Check ownership (developers can only update their own developments, admins can update any)
      if (
        development.developerId !== context.user?.userId && 
        !context.userRoles.includes(UserRole.ADMIN)
      ) {
        throw new Error('You can only update your own developments');
      }

      // Update the development
      // Note: In a real implementation, this would be a proper update method
      // For now, we'll assume the development is updated correctly
      const updatedDevelopment = {
        ...development,
        ...(input.name && { name: input.name }),
        ...(input.description && { description: input.description }),
        ...(input.shortDescription && { shortDescription: input.shortDescription }),
        ...(input.mainImage && { mainImage: input.mainImage }),
        ...(input.features && { features: input.features }),
        ...(input.Amenity && { Amenity: input.Amenity }),
        ...(input.status && { status: input.status }),
        ...(input.buildingType && { buildingType: input.buildingType }),
        ...(input.startDate && { startDate: input.startDate }),
        ...(input.completionDate && { completionDate: input.completionDate }),
        ...(input.isPublished !== undefined && { isPublished: input.isPublished }),
        ...(input.tags && { tags: input.tags })};

      return mapDevelopmentToGraphQL(updatedDevelopment);
    },

    /**
     * Update development location
     */
    updateDevelopmentLocation: async (_: any, 
      { 
        developmentId, 
        input 
      }: { 
        developmentId: string;
        input: {
          address?: string;
          addressLine1?: string;
          addressLine2?: string;
          city?: string;
          county?: string;
          eircode?: string;
          longitude?: number;
          latitude?: number;
        }
      }, 
      context: GraphQLContext
    ) => {
      requireRol, e(contex, t, [UserRol, e.DEVELOPE, R, UserRol, e.ADMIN]);

      // Check if development exists
      const development = await developmentDb.getById(developmentId);

      if (!development) {
        throw new NotFoundError('Development', developmentId);
      }

      // Check ownership
      if (
        development.developerId !== context.user?.userId && 
        !context.userRoles.includes(UserRole.ADMIN)
      ) {
        throw new Error('You can only update your own developments');
      }

      // Update the location
      // Note: In a real implementation, this would be a proper update method
      // For now, we'll assume the location is updated correctly
      const updatedLocation = {
        ...development.location,
        ...(input.address && { address: input.address }),
        ...(input.addressLine1 && { addressLine1: input.addressLine1 }),
        ...(input.addressLine2 && { addressLine2: input.addressLine2 }),
        ...(input.city && { city: input.city }),
        ...(input.county && { county: input.county }),
        ...(input.eircode && { eircode: input.eircode }),
        ...(input.longitude && { longitude: input.longitude }),
        ...(input.latitude && { latitude: input.latitude })};

      return updatedLocation;
    },

    /**
     * Add a professional team member to a development
     */
    addProfessionalTeamMember: async (_: any, 
      { 
        developmentId, 
        userId, 
        role, 
        company, 
        appointmentDocumentId 
      }: { 
        developmentId: string;
        userId: string;
        role: string;
        company: string;
        appointmentDocumentId?: string;
      }, 
      context: GraphQLContext
    ) => {
      requireRol, e(contex, t, [UserRol, e.DEVELOPE, R, UserRol, e.ADMIN]);

      // Check if development exists
      const development = await developmentDb.getById(developmentId);

      if (!development) {
        throw new NotFoundError('Development', developmentId);
      }

      // Check ownership
      if (
        development.developerId !== context.user?.userId && 
        !context.userRoles.includes(UserRole.ADMIN)
      ) {
        throw new Error('You can only update your own developments');
      }

      // Check if user exists
      const user = await userDb.getById(userId);

      if (!user) {
        throw new NotFoundError('User', userId);
      }

      // Add team member
      // Note: In a real implementation, this would be a proper method
      // For now, we'll return a placeholder
      const teamMember = {
        id: 'new-team-member-id',
        user: {,
          id: user.id,
          fullName: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role, s: use, r.role, s || [],
          avatar: user.avatar},
        role,
        company,
        status: 'APPOINTED',
        appointmentDocument: appointmentDocumentId ? { id: appointmentDocumentId } : null,
        startDate: new Date()};

      return teamMember;
    },

    /**
     * Update a team member's status
     */
    updateTeamMemberStatus: async (_: any, 
      { 
        teamMemberId, 
        status 
      }: { 
        teamMemberId: string;
        status: string;
      }, 
      context: GraphQLContext
    ) => {
      requireRol, e(contex, t, [UserRol, e.DEVELOPE, R, UserRol, e.ADMIN]);

      // In a real implementation, you would fetch the team member
      // and check if the user has permission to update it

      // For now, we'll return a placeholder
      return {
        id: teamMemberId,
        status};
    },

    /**
     * Add a milestone to a development timeline
     */
    addProjectMilestone: async (_: any, 
      { 
        developmentId, 
        name, 
        description, 
        plannedDate, 
        dependencyIds 
      }: { 
        developmentId: string;
        name: string;
        description: string;
        plannedDate: Date;
        dependencyId, s?: string[];
      }, 
      context: GraphQLContext
    ) => {
      requireRol, e(contex, t, [UserRol, e.DEVELOPE, R, UserRol, e.ADMI, N, UserRol, e.PROJECT_MANAGER]);

      // Check if development exists
      const development = await developmentDb.getById(developmentId);

      if (!development) {
        throw new NotFoundError('Development', developmentId);
      }

      // Check permissions
      const isAllowed = 
        development.developerId === context.user?.userId || 
        context.userRoles.includes(UserRole.ADMIN) ||
        // Check if user is the project manager
        (context.userRoles.includes(UserRole.PROJECT_MANAGER) && 
          development.professionalTeam.some(member: any,: any => 
            member.professional.user.id === context.user?.userId && 
            member.role === 'PROJECT_MANAGER'
          )
        );

      if (!isAllowed) {
        throw new Error('You do not have permission to add milestones to this development');
      }

      // Create the milestone
      // Note: In a real implementation, this would be a proper method
      // For now, we'll return a placeholder
      const milestone = {
        id: 'new-milestone-id',
        name,
        description,
        plannedDate,
        status: 'PLANNED',
        dependencie, s: [],
        document, s: []};

      return milestone;
    },

    /**
     * Update a milestone's status
     */
    updateMilestoneStatus: async (_: any, 
      { 
        milestoneId, 
        status, 
        actualDate 
      }: { 
        milestoneId: string;
        status: string;
        actualDate?: Date;
      }, 
      context: GraphQLContext
    ) => {
      requireRol, e(contex, t, [UserRol, e.DEVELOPE, R, UserRol, e.ADMI, N, UserRol, e.PROJECT_MANAGER]);

      // In a real implementation, you would fetch the milestone
      // and check if the user has permission to update it

      // For now, we'll return a placeholder
      return {
        id: milestoneId,
        status,
        actualDate: status === 'COMPLETED' ? actualDate || new Date() : undefined};
    },

  Development: {
    // Resolve developer field to UserSummary
    developer: async (parent: any) => {
      if (parent.developer) {
        return {
          id: parent.developer.id,
          fullName: `${parent.developer.firstName} ${parent.developer.lastName}`,
          email: parent.developer.email,
          role, s: paren, t.develope, r.role, s || [],
          avatar: parent.developer.avatar};
      }

      // If developer is not included in the query, fetch it
      const user = await userDb.getById(parent.developerId);

      if (!user) {
        return {
          id: parent.developerId,
          fullName: 'Unknown',
          email: '',
          role, s: []};
      }

      return {
        id: user.id,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role, s: use, r.role, s || [],
        avatar: user.avatar};
    },

    // Update the team member resolver to use proper typing
    teamMembers: async (development: DevelopmentWithUnits) => {
      const members = await userDb.list({ developmentId: development.id });
      return members.map((member: { id: string; name: string; role: string }) => ({
        id: member.id,
        name: member.name,
        role: member.role
      }));
    }};

export default developmentResolvers;