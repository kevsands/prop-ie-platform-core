'use client';

/**
 * GraphQL Mutation Hooks
 * 
 * This file provides React hooks for common GraphQL mutations used throughout the application.
 * Each hook provides loading, error, and data states through React Query.
 */

import { type UseMutationOptions } from '@tanstack/react-query';
import { useGraphQLMutation } from '../useGraphQL';
import { type GraphQLResult } from '@/types/common';
import { 
  developmentDetailsFragment,
  userDetailsFragment,
  documentFragment
} from '@/lib/graphql/fragments';

import {
  Development,
  CreateDevelopmentInput,
  UpdateDevelopmentInput,
  User,
  CreateUserInput,
  UpdateUserInput,
  Location,
  UpdateLocationInput,
  UserStatus,
  KYCStatus,
  ProfessionalTeamMember,
  ProjectMilestone,
  MilestoneStatus,
  Document,
  AppointmentStatus,
  ProfessionalRole
} from '@/types/graphql';

// Development Mutations

/**
 * Hook to create a new development
 * Requires DEVELOPER or ADMIN role
 */
export function useCreateDevelopment(
  options?: Omit<UseMutationOptions<
    GraphQLResult<{ createDevelopment: Development }>,
    Error,
    { input: CreateDevelopmentInput }
  >, 'mutationKey' | 'mutationFn'>
) {
  const mutation = /* GraphQL */ `
    mutation CreateDevelopment($input: CreateDevelopmentInput!) {
      createDevelopment(input: $input) {
        ...DevelopmentDetails
      }
    }
    ${developmentDetailsFragment}
  `;
  
  return useGraphQLMutation<
    { createDevelopment: Development },
    { input: CreateDevelopmentInput },
    Error
  >(
    mutation,
    { ...options, mutationKey: ['createDevelopment'] }
  );
}

/**
 * Hook to update an existing development
 * Requires DEVELOPER or ADMIN role
 */
export function useUpdateDevelopment(
  options?: Omit<UseMutationOptions<
    GraphQLResult<{ updateDevelopment: Development }>,
    Error,
    { id: string, input: UpdateDevelopmentInput }
  >, 'mutationKey' | 'mutationFn'>
) {
  const mutation = /* GraphQL */ `
    mutation UpdateDevelopment($id: ID!, $input: UpdateDevelopmentInput!) {
      updateDevelopment(id: $id, input: $input) {
        ...DevelopmentDetails
      }
    }
    ${developmentDetailsFragment}
  `;
  
  return useGraphQLMutation<
    { updateDevelopment: Development },
    { id: string, input: UpdateDevelopmentInput },
    Error
  >(
    mutation,
    { ...options, mutationKey: ['updateDevelopment'] }
  );
}

/**
 * Hook to update a development's location
 * Requires DEVELOPER or ADMIN role
 */
export function useUpdateDevelopmentLocation(
  options?: Omit<UseMutationOptions<
    GraphQLResult<{ updateDevelopmentLocation: Location }>,
    Error,
    { developmentId: string, input: UpdateLocationInput }
  >, 'mutationKey' | 'mutationFn'>
) {
  const mutation = /* GraphQL */ `
    mutation UpdateDevelopmentLocation($developmentId: ID!, $input: UpdateLocationInput!) {
      updateDevelopmentLocation(developmentId: $developmentId, input: $input) {
        id
        address
        addressLine1
        addressLine2
        city
        county
        eircode
        country
        longitude
        latitude
      }
    }
  `;
  
  return useGraphQLMutation<
    { updateDevelopmentLocation: Location },
    { developmentId: string, input: UpdateLocationInput },
    Error
  >(
    mutation,
    { ...options, mutationKey: ['updateDevelopmentLocation'] }
  );
}

// Team Member Mutations

/**
 * Hook to add a professional team member to a development
 * Requires DEVELOPER or ADMIN role
 */
export function useAddProfessionalTeamMember(
  options?: Omit<UseMutationOptions<
    GraphQLResult<{ addProfessionalTeamMember: ProfessionalTeamMember }>,
    Error,
    {
      developmentId: string;
      userId: string;
      role: ProfessionalRole;
      company: string;
      appointmentDocumentId?: string;
    }
  >, 'mutationKey' | 'mutationFn'>
) {
  const mutation = /* GraphQL */ `
    mutation AddProfessionalTeamMember(
      $developmentId: ID!,
      $userId: ID!,
      $role: ProfessionalRole!,
      $company: String!,
      $appointmentDocumentId: ID
    ) {
      addProfessionalTeamMember(
        developmentId: $developmentId,
        userId: $userId,
        role: $role,
        company: $company,
        appointmentDocumentId: $appointmentDocumentId
      ) {
        id
        user {
          id
          fullName
          email
        }
        role
        company
        status
        startDate
        endDate
        notes
      }
    }
  `;
  
  return useGraphQLMutation<
    { addProfessionalTeamMember: ProfessionalTeamMember },
    {
      developmentId: string;
      userId: string;
      role: ProfessionalRole;
      company: string;
      appointmentDocumentId?: string;
    },
    Error
  >(
    mutation,
    { ...options, mutationKey: ['addProfessionalTeamMember'] }
  );
}

/**
 * Hook to update a team member's status
 * Requires DEVELOPER or ADMIN role
 */
export function useUpdateTeamMemberStatus(
  options?: Omit<UseMutationOptions<
    GraphQLResult<{ updateTeamMemberStatus: ProfessionalTeamMember }>,
    Error,
    { teamMemberId: string, status: AppointmentStatus }
  >, 'mutationKey' | 'mutationFn'>
) {
  const mutation = /* GraphQL */ `
    mutation UpdateTeamMemberStatus($teamMemberId: ID!, $status: AppointmentStatus!) {
      updateTeamMemberStatus(teamMemberId: $teamMemberId, status: $status) {
        id
        user {
          id
          fullName
        }
        role
        status
      }
    }
  `;
  
  return useGraphQLMutation<
    { updateTeamMemberStatus: ProfessionalTeamMember },
    { teamMemberId: string, status: AppointmentStatus },
    Error
  >(
    mutation,
    { ...options, mutationKey: ['updateTeamMemberStatus'] }
  );
}

// Milestones Mutations

/**
 * Hook to add a milestone to a development timeline
 * Requires DEVELOPER, ADMIN, or PROJECT_MANAGER role
 */
export function useAddProjectMilestone(
  options?: Omit<UseMutationOptions<
    GraphQLResult<{ addProjectMilestone: ProjectMilestone }>,
    Error,
    {
      developmentId: string;
      name: string;
      description: string;
      plannedDate: string;
      dependencyIds?: string[];
    }
  >, 'mutationKey' | 'mutationFn'>
) {
  const mutation = /* GraphQL */ `
    mutation AddProjectMilestone(
      $developmentId: ID!,
      $name: String!,
      $description: String!,
      $plannedDate: DateTime!,
      $dependencyIds: [ID!]
    ) {
      addProjectMilestone(
        developmentId: $developmentId,
        name: $name,
        description: $description,
        plannedDate: $plannedDate,
        dependencyIds: $dependencyIds
      ) {
        id
        name
        description
        plannedDate
        actualDate
        status
        dependencies {
          id
          name
        }
      }
    }
  `;
  
  return useGraphQLMutation<
    { addProjectMilestone: ProjectMilestone },
    {
      developmentId: string;
      name: string;
      description: string;
      plannedDate: string;
      dependencyIds?: string[];
    },
    Error
  >(
    mutation,
    { ...options, mutationKey: ['addProjectMilestone'] }
  );
}

/**
 * Hook to update a milestone's status
 * Requires DEVELOPER, ADMIN, or PROJECT_MANAGER role
 */
export function useUpdateMilestoneStatus(
  options?: Omit<UseMutationOptions<
    GraphQLResult<{ updateMilestoneStatus: ProjectMilestone }>,
    Error,
    { milestoneId: string, status: MilestoneStatus, actualDate?: string }
  >, 'mutationKey' | 'mutationFn'>
) {
  const mutation = /* GraphQL */ `
    mutation UpdateMilestoneStatus(
      $milestoneId: ID!,
      $status: MilestoneStatus!,
      $actualDate: DateTime
    ) {
      updateMilestoneStatus(
        milestoneId: $milestoneId,
        status: $status,
        actualDate: $actualDate
      ) {
        id
        name
        status
        plannedDate
        actualDate
      }
    }
  `;
  
  return useGraphQLMutation<
    { updateMilestoneStatus: ProjectMilestone },
    { milestoneId: string, status: MilestoneStatus, actualDate?: string },
    Error
  >(
    mutation,
    { ...options, mutationKey: ['updateMilestoneStatus'] }
  );
}

// User Mutations

/**
 * Hook to create a new user
 * Requires ADMIN role
 */
export function useCreateUser(
  options?: Omit<UseMutationOptions<
    GraphQLResult<{ createUser: User }>,
    Error,
    { input: CreateUserInput }
  >, 'mutationKey' | 'mutationFn'>
) {
  const mutation = /* GraphQL */ `
    mutation CreateUser($input: CreateUserInput!) {
      createUser(input: $input) {
        ...UserDetails
      }
    }
    ${userDetailsFragment}
  `;
  
  return useGraphQLMutation<
    { createUser: User },
    { input: CreateUserInput },
    Error
  >(
    mutation,
    { ...options, mutationKey: ['createUser'] }
  );
}

/**
 * Hook to update an existing user
 * Admin can update any user, regular users can only update themselves
 */
export function useUpdateUser(
  options?: Omit<UseMutationOptions<
    GraphQLResult<{ updateUser: User }>,
    Error,
    { id: string, input: UpdateUserInput }
  >, 'mutationKey' | 'mutationFn'>
) {
  const mutation = /* GraphQL */ `
    mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
      updateUser(id: $id, input: $input) {
        ...UserDetails
      }
    }
    ${userDetailsFragment}
  `;
  
  return useGraphQLMutation<
    { updateUser: User },
    { id: string, input: UpdateUserInput },
    Error
  >(
    mutation,
    { ...options, mutationKey: ['updateUser'] }
  );
}

/**
 * Hook to change a user's status
 * Requires ADMIN role
 */
export function useChangeUserStatus(
  options?: Omit<UseMutationOptions<
    GraphQLResult<{ changeUserStatus: User }>,
    Error,
    { id: string, status: UserStatus }
  >, 'mutationKey' | 'mutationFn'>
) {
  const mutation = /* GraphQL */ `
    mutation ChangeUserStatus($id: ID!, $status: UserStatus!) {
      changeUserStatus(id: $id, status: $status) {
        id
        status
      }
    }
  `;
  
  return useGraphQLMutation<
    { changeUserStatus: User },
    { id: string, status: UserStatus },
    Error
  >(
    mutation,
    { ...options, mutationKey: ['changeUserStatus'] }
  );
}

/**
 * Hook to update KYC status
 * Requires ADMIN role
 */
export function useUpdateKYCStatus(
  options?: Omit<UseMutationOptions<
    GraphQLResult<{ updateKYCStatus: User }>,
    Error,
    { id: string, status: KYCStatus }
  >, 'mutationKey' | 'mutationFn'>
) {
  const mutation = /* GraphQL */ `
    mutation UpdateKYCStatus($id: ID!, $status: KYCStatus!) {
      updateKYCStatus(id: $id, status: $status) {
        id
        kycStatus
      }
    }
  `;
  
  return useGraphQLMutation<
    { updateKYCStatus: User },
    { id: string, status: KYCStatus },
    Error
  >(
    mutation,
    { ...options, mutationKey: ['updateKYCStatus'] }
  );
}

// Document Mutations

/**
 * Hook to upload a document
 */
export function useUploadDocument(
  options?: Omit<UseMutationOptions<
    GraphQLResult<{ uploadDocument: Document }>,
    Error,
    {
      name: string;
      description?: string;
      category: string;
      file: File;
      developmentId?: string;
    }
  >, 'mutationKey' | 'mutationFn'>
) {
  const mutation = /* GraphQL */ `
    mutation UploadDocument(
      $name: String!,
      $description: String,
      $category: String!,
      $file: Upload!,
      $developmentId: ID
    ) {
      uploadDocument(
        name: $name,
        description: $description,
        category: $category,
        file: $file,
        developmentId: $developmentId
      ) {
        ...DocumentDetails
      }
    }
    ${documentFragment}
  `;
  
  return useGraphQLMutation<
    { uploadDocument: Document },
    {
      name: string;
      description?: string;
      category: string;
      file: File;
      developmentId?: string;
    },
    Error
  >(
    mutation,
    { ...options, mutationKey: ['uploadDocument'] }
  );
}