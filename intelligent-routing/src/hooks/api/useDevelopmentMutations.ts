'use client';

import { useGraphQLMutation } from '../useGraphQL';
import { useQueryClient } from '@tanstack/react-query';
import type { MutationOptions as UseMutationOptions } from '@tanstack/react-query';
import { GraphQLResult } from '@/types/common';
import { Development, Location, DevelopmentFilterInput } from './useDevelopments';

// Input type definitions
export interface CreateDevelopmentInput {
  name: string;
  location: {
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
  features: string[];
  amenities: string[];
  totalUnits: number;
  status: string;
  buildingType?: string;
  startDate?: string;
  completionDate?: string;
  tags?: string[];
}

export interface UpdateDevelopmentInput {
  name?: string;
  description?: string;
  shortDescription?: string;
  mainImage?: string;
  features?: string[];
  amenities?: string[];
  status?: string;
  buildingType?: string;
  startDate?: string;
  completionDate?: string;
  isPublished?: boolean;
  tags?: string[];
}

export interface UpdateLocationInput {
  address?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  county?: string;
  eircode?: string;
  longitude?: number;
  latitude?: number;
}

export interface TeamMemberInput {
  developmentId: string;
  userId: string;
  role: string;
  company: string;
  appointmentDocumentId?: string;
}

export interface MilestoneInput {
  developmentId: string;
  name: string;
  description: string;
  plannedDate: string;
  dependencyIds?: string[];
}

// GraphQL Mutations
const CREATE_DEVELOPMENT = /* GraphQL */ `
  mutation CreateDevelopment($input: CreateDevelopmentInput!) {
    createDevelopment(input: $input) {
      id
      name
      slug
      status
      mainImage
      shortDescription
      totalUnits
      availableUnits
    }
  }
`;

const UPDATE_DEVELOPMENT = /* GraphQL */ `
  mutation UpdateDevelopment($id: ID!, $input: UpdateDevelopmentInput!) {
    updateDevelopment(id: $id, input: $input) {
      id
      name
      slug
      status
      description
      shortDescription
      mainImage
      features
      amenities
      status
      buildingType
      startDate
      completionDate
      isPublished
      tags
    }
  }
`;

const UPDATE_DEVELOPMENT_LOCATION = /* GraphQL */ `
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

const ADD_PROFESSIONAL_TEAM_MEMBER = /* GraphQL */ `
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
        avatar
      }
      role
      company
      status
      startDate
    }
  }
`;

const UPDATE_TEAM_MEMBER_STATUS = /* GraphQL */ `
  mutation UpdateTeamMemberStatus($teamMemberId: ID!, $status: AppointmentStatus!) {
    updateTeamMemberStatus(teamMemberId: $teamMemberId, status: $status) {
      id
      status
    }
  }
`;

const ADD_PROJECT_MILESTONE = /* GraphQL */ `
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
      status
      dependencies {
        id
        name
      }
    }
  }
`;

const UPDATE_MILESTONE_STATUS = /* GraphQL */ `
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
      status
      actualDate
    }
  }
`;

// Hook for creating a new development
export function useCreateDevelopment(
  options?: Omit<UseMutationOptions<
    GraphQLResult<{ createDevelopment: Development }>,
    Error,
    { input: CreateDevelopmentInput }
  >, 'mutationFn'>
) {
  const queryClient = useQueryClient();
  
  return useGraphQLMutation<{ createDevelopment: Development }, { input: CreateDevelopmentInput }>(
    CREATE_DEVELOPMENT,
    {
      onSuccess: (data: GraphQLResult<{ createDevelopment: Development }>) => {
        // Invalidate and refetch developments list queries
        queryClient.invalidateQueries({ queryKey: ['developments'] });
        queryClient.invalidateQueries({ queryKey: ['myDevelopments'] });
        
        // If we have a callback, call it with the new development
        if (options?.onSuccess) {
          options.onSuccess(data, { input: data.data?.createDevelopment as any }, undefined as any);
        }
      },
      ...options
    }
  );
}

// Hook for updating an existing development
export function useUpdateDevelopment(
  options?: Omit<UseMutationOptions<
    GraphQLResult<{ updateDevelopment: Development }>,
    Error,
    { id: string; input: UpdateDevelopmentInput }
  >, 'mutationFn'>
) {
  const queryClient = useQueryClient();
  
  return useGraphQLMutation<{ updateDevelopment: Development }, { id: string; input: UpdateDevelopmentInput }>(
    UPDATE_DEVELOPMENT,
    {
      onSuccess: (data: GraphQLResult<{ updateDevelopment: Development }>, variables: { id: string; input: UpdateDevelopmentInput }) => {
        // Invalidate and refetch development detail
        queryClient.invalidateQueries({ queryKey: ['development', variables.id] });
        queryClient.invalidateQueries({ queryKey: ['developments'] });
        queryClient.invalidateQueries({ queryKey: ['myDevelopments'] });
        
        // If we have a callback, call it
        if (options?.onSuccess) {
          options.onSuccess(data, variables, undefined as any);
        }
      },
      ...options
    }
  );
}

// Hook for updating a development's location
export function useUpdateDevelopmentLocation(
  options?: Omit<UseMutationOptions<
    GraphQLResult<{ updateDevelopmentLocation: Location }>,
    Error,
    { developmentId: string; input: UpdateLocationInput }
  >, 'mutationFn'>
) {
  const queryClient = useQueryClient();
  
  return useGraphQLMutation<
    { updateDevelopmentLocation: Location }, 
    { developmentId: string; input: UpdateLocationInput }
  >(
    UPDATE_DEVELOPMENT_LOCATION,
    {
      onSuccess: (data: GraphQLResult<{ updateDevelopmentLocation: Location }>, variables: { developmentId: string; input: UpdateLocationInput }) => {
        // Invalidate and refetch development detail
        queryClient.invalidateQueries({ queryKey: ['development', variables.developmentId] });
        
        // If we have a callback, call it
        if (options?.onSuccess) {
          options.onSuccess(data, variables, undefined as any);
        }
      },
      ...options
    }
  );
}

// Hook for adding a professional team member to a development
export function useAddProfessionalTeamMember(
  options?: Omit<UseMutationOptions<
    GraphQLResult<{ addProfessionalTeamMember: any }>,
    Error,
    TeamMemberInput
  >, 'mutationFn'>
) {
  const queryClient = useQueryClient();
  
  return useGraphQLMutation<{ addProfessionalTeamMember: any }, TeamMemberInput>(
    ADD_PROFESSIONAL_TEAM_MEMBER,
    {
      onSuccess: (data: GraphQLResult<{ addProfessionalTeamMember: any }>, variables: TeamMemberInput) => {
        // Invalidate and refetch development detail
        queryClient.invalidateQueries({ queryKey: ['development', variables.developmentId] });
        
        // If we have a callback, call it
        if (options?.onSuccess) {
          options.onSuccess(data, variables, undefined as any);
        }
      },
      ...options
    }
  );
}

// Hook for updating a team member's status
export function useUpdateTeamMemberStatus(
  options?: Omit<UseMutationOptions<
    GraphQLResult<{ updateTeamMemberStatus: any }>,
    Error,
    { teamMemberId: string; status: string }
  >, 'mutationFn'>
) {
  const queryClient = useQueryClient();
  
  return useGraphQLMutation<
    { updateTeamMemberStatus: any }, 
    { teamMemberId: string; status: string }
  >(
    UPDATE_TEAM_MEMBER_STATUS,
    {
      onSuccess: () => {
        // Since we don't know which development this team member belongs to,
        // we'll invalidate all development queries
        queryClient.invalidateQueries({ queryKey: ['development'] });
        
        // If we have a callback, call it
        if (options?.onSuccess) {
          options.onSuccess(undefined as any, undefined as any, undefined as any);
        }
      },
      ...options
    }
  );
}

// Hook for adding a milestone to a development timeline
export function useAddProjectMilestone(
  options?: Omit<UseMutationOptions<
    GraphQLResult<{ addProjectMilestone: any }>,
    Error,
    MilestoneInput
  >, 'mutationFn'>
) {
  const queryClient = useQueryClient();
  
  return useGraphQLMutation<{ addProjectMilestone: any }, MilestoneInput>(
    ADD_PROJECT_MILESTONE,
    {
      onSuccess: (data: GraphQLResult<{ addProjectMilestone: any }>, variables: MilestoneInput) => {
        // Invalidate and refetch development detail
        queryClient.invalidateQueries({ queryKey: ['development', variables.developmentId] });
        
        // If we have a callback, call it
        if (options?.onSuccess) {
          options.onSuccess(data, variables, undefined as any);
        }
      },
      ...options
    }
  );
}

// Hook for updating a milestone's status
export function useUpdateMilestoneStatus(
  options?: Omit<UseMutationOptions<
    GraphQLResult<{ updateMilestoneStatus: any }>,
    Error,
    { milestoneId: string; status: string; actualDate?: string }
  >, 'mutationFn'>
) {
  const queryClient = useQueryClient();
  
  return useGraphQLMutation<
    { updateMilestoneStatus: any }, 
    { milestoneId: string; status: string; actualDate?: string }
  >(
    UPDATE_MILESTONE_STATUS,
    {
      onSuccess: () => {
        // Since we don't know which development this milestone belongs to,
        // we'll invalidate all development queries
        queryClient.invalidateQueries({ queryKey: ['development'] });
        
        // If we have a callback, call it
        if (options?.onSuccess) {
          options.onSuccess(undefined as any, undefined as any, undefined as any);
        }
      },
      ...options
    }
  );
}

// Export all hooks in a convenient object
export default {
  useCreateDevelopment,
  useUpdateDevelopment,
  useUpdateDevelopmentLocation,
  useAddProfessionalTeamMember,
  useUpdateTeamMemberStatus,
  useAddProjectMilestone,
  useUpdateMilestoneStatus
};