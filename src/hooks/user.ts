/**
 * User resolvers for PropIE GraphQL API
 * 
 * This file implements the resolvers for User-related operations.
 */

import { GraphQLContext } from '../server';
import { requireAuth, requireRole, NotFoundError, ValidationError, paginateResults, processPaginationInput } from './base';
import { userDb } from '@/lib/db';
import { User, UserRole, UserStatus, KYCStatus, getFullName } from '@/types/core/user';

// Map database User model to GraphQL User type
function mapUserToGraphQL(user: any): User {
  return {
    ...user,
    fullName: getFullName(user),
    roles: user.roles || []};
}

export const userResolvers = {
  Query: {
    /**
     * Get the currently authenticated user
     */
    me: async (_: any, __: any, context: GraphQLContext) => {
      requireAuth(context);

      const user = await userDb.getByEmail(context.user?.email || '');

      if (!user) {
        throw new NotFoundError('User', context.user?.userId || '');
      }

      return mapUserToGraphQL(user);
    },

    /**
     * Get a user by ID (admin only)
     */
    user: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      requireRole(context, [UserRole.ADMIN]);

      const user = await userDb.getById(id);

      if (!user) {
        throw new NotFoundError('User', id);
      }

      return mapUserToGraphQL(user);
    },

    /**
     * List users with filtering and pagination (admindeveloper)
     */
    users: async (_: any, 
      { 
        filter, 
        pagination 
      }: { 
        filter?: { 
          search?: string;
          roles?: UserRole[];
          status?: UserStatus;
          kycStatus?: KYCStatus;
          createdAfter?: Date;
          createdBefore?: Date;
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
      requireRole(context, [UserRole.ADMIN, UserRole.DEVELOPER]);

      const { limit, offset } = processPaginationInput(pagination);

      // Build filter options
      const filterOptions: any = {
        limit,
        offset};

      if (filter?.search) {
        filterOptions.search = filter.search;
      }

      if (filter?.status) {
        filterOptions.status = filter.status;
      }

      if (filter?.roles && filter.roles.length> 0) {
        filterOptions.role = filter.roles[0]; // For simplicity, just use the first role
      }

      // Query the database
      const { users, totalCount } = await userDb.list(filterOptions);

      // Process with client-side pagination for cursor-based approach
      const { items, pageInfo } = paginateResults(
        users.map(mapUserToGraphQL),
        pagination || {}
      );

      return {
        users: items,
        totalCount,
        pageInfo};
    },

    /**
     * Search for users by name or email
     */
    searchUsers: async (_: any, 
      { 
        query, 
        roles,
        pagination 
      }: { 
        query: string;
        roles?: UserRole[];
        pagination?: {
          first?: number;
          after?: string;
          last?: number;
          before?: string;
        };
      }, 
      context: GraphQLContext
    ) => {
      requireAuth(context);

      const { limit, offset } = processPaginationInput(pagination);

      // Build filter options
      const filterOptions: any = {
        search: query,
        limit,
        offset};

      // Add role filter if provided
      if (roles && roles.length> 0) {
        filterOptions.role = roles[0]; // For simplicity, just use the first role
      }

      // Query the database
      const { users, totalCount } = await userDb.list(filterOptions);

      // Process with client-side pagination for cursor-based approach
      const { items, pageInfo } = paginateResults(
        users.map(mapUserToGraphQL),
        pagination || {}
      );

      return {
        users: items,
        totalCount,
        pageInfo};
    },

  Mutation: {
    /**
     * Create a new user (admin only)
     */
    createUser: async (_: any, 
      { input }: { 
        input: {
          email: string;
          firstName: string;
          lastName: string;
          phone?: string;
          roles: UserRole[];
          organization?: string;
          position?: string;
          password?: string;
        }
      }, 
      context: GraphQLContext
    ) => {
      requireRole(context, [UserRole.ADMIN]);

      // Validate input
      if (!input.email) {
        throw new ValidationError('Email is required');
      }

      if (!input.firstName || !input.lastName) {
        throw new ValidationError('First name and last name are required');
      }

      if (!input.roles || input.roles.length === 0) {
        throw new ValidationError('At least one role is required');
      }

      // Check if user already exists
      const existingUser = await userDb.getByEmail(input.email);
      if (existingUser) {
        throw new ValidationError(`User with email ${input.email} already exists`);
      }

      // Create the user
      const userData = {
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        roles: input.roles.map(role => role.toString()),
        password: input.password};

      const user = await userDb.create(userData);

      if (!user) {
        throw new Error('Failed to create user');
      }

      // Create user preferences if they don't exist
      if (!user.preferences) {
        await userDb.update(user.id, {
          preferences: {
            notifications: {
              email: true,
              sms: true,
              push: true},
            theme: 'light',
            language: 'en',
            timezone: 'UTC'});
      }

      return mapUserToGraphQL(user);
    },

    /**
     * Update an existing user
     * Admin can update any user, regular users can only update themselves
     */
    updateUser: async (_: any, 
      { 
        id, 
        input 
      }: { 
        id: string;
        input: {
          firstName?: string;
          lastName?: string;
          phone?: string;
          roles?: UserRole[];
          status?: UserStatus;
          organization?: string;
          position?: string;
          avatar?: string;
          preferences?: any;
        }
      }, 
      context: GraphQLContext
    ) => {
      requireAuth(context);

      // Check if user exists
      const user = await userDb.getById(id);
      if (!user) {
        throw new NotFoundError('User', id);
      }

      // Check permissions
      if (context.user?.userId !== id && !context.userRoles.includes(UserRole.ADMIN)) {
        throw new Error('You can only update your own profile unless you are an admin');
      }

      // Only admins can update roles and status
      if ((input.roles || input.status) && !context.userRoles.includes(UserRole.ADMIN)) {
        throw new Error('Only admins can update roles and status');
      }

      // Update the user
      const updateData: any = {};

      if (input.firstName) updateData.firstName = input.firstName;
      if (input.lastName) updateData.lastName = input.lastName;
      if (input.phone) updateData.phone = input.phone;
      if (input.organization) updateData.organization = input.organization;
      if (input.position) updateData.position = input.position;
      if (input.avatar) updateData.avatar = input.avatar;
      if (input.preferences) updateData.preferences = input.preferences;

      // Admin-only fields
      if (context.userRoles.includes(UserRole.ADMIN)) {
        if (input.status) updateData.status = input.status;
        // Roles are handled separately in the database layer
      }

      const updatedUser = await userDb.update(idupdateData);

      // Handle role updates if provided (admin only)
      if (input.roles && context.userRoles.includes(UserRole.ADMIN)) {
        // This would require a separate method to update roles
        // For now, we'll assume the user's roles are updated correctly
      }

      return mapUserToGraphQL(updatedUser);
    },

    /**
     * Change a user's status (admin only)
     */
    changeUserStatus: async (_: any, 
      { 
        id, 
        status 
      }: { 
        id: string;
        status: UserStatus;
      }, 
      context: GraphQLContext
    ) => {
      requireRole(context, [UserRole.ADMIN]);

      // Check if user exists
      const user = await userDb.getById(id);
      if (!user) {
        throw new NotFoundError('User', id);
      }

      // Update the user status
      const updatedUser = await userDb.update(id, {
        status: status.toString()});

      return mapUserToGraphQL(updatedUser);
    },

    /**
     * Update KYC status (admin only)
     */
    updateKYCStatus: async (_: any, 
      { 
        id, 
        status 
      }: { 
        id: string;
        status: KYCStatus;
      }, 
      context: GraphQLContext
    ) => {
      requireRole(context, [UserRole.ADMIN]);

      // Check if user exists
      const user = await userDb.getById(id);
      if (!user) {
        throw new NotFoundError('User', id);
      }

      // Update the user KYC status
      const updatedUser = await userDb.update(id, {
        preferences: {
          ...user.preferences,
          kycStatus: status.toString()});

      return mapUserToGraphQL(updatedUser);
    },

  User: {
    // Compute full name from first and last name
    fullName: (parent: any) => {
      return getFullName(parent);
    },

    // Resolve permissions field
    permissions: async (parent: any) => {
      // This would typically fetch permissions from the database
      // For simplicity, we'll return an empty array for now
      return [];
    }};

export default userResolvers;