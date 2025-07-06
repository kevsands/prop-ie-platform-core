/**
 * GraphQL API Hooks Index
 * 
 * This file exports all GraphQL hooks for easy import throughout the application.
 * Named exports are used to avoid naming conflicts between files.
 */

// Import all hooks to then explicitly re-export them
import * as queries from './useGraphQLQueries';
import * as mutations from './useGraphQLMutations';
import { useCurrentUser, useAuthenticatedGraphQL, useUserRoles } from './useAuth';
import * as devHooks from './useDevelopments';
import { 
  useDevelopment, 
  useDevelopmentBySlug, 
  useDevelopments, 
  useMyDevelopments, 
  getStatusColorClass 
} from './useDevelopments';
import { 
  useDeveloperDashboardOverview, 
  useProjectStats, 
  useFinancialOverview, 
  useDashboardPreferences, 
  useActivityHistory 
} from './useDeveloperDashboard';
import { 
  useCreateDevelopment, 
  useUpdateDevelopment, 
  useUpdateDevelopmentLocation,
  useAddProfessionalTeamMember,
  useUpdateTeamMemberStatus,
  useAddProjectMilestone,
  useUpdateMilestoneStatus
} from './useDevelopmentMutations';

// Re-export query hooks explicitly
export {
  useUser,
  useUsers,
  useSearchUsers,
  useCurrentUser,
  useDevelopmentStatistics,
  useDevelopmentDocuments,
  useDevelopmentMilestones,
  useDevelopmentSalesStatus
} from './useGraphQLQueries';

// Re-export mutation hooks explicitly
export {
  useCreateUser,
  useUpdateUser,
  useChangeUserStatus,
  useUpdateKYCStatus,
  useUploadDocument
} from './useGraphQLMutations';

// Export development hooks that don't conflict with GraphQL hooks
export { 
  useDevelopment,
  useDevelopmentBySlug,
  useDevelopments,
  useMyDevelopments,
  getStatusColorClass
} from './useDevelopments';

// Export dashboard hooks - renamed to avoid conflicts
export { 
  useDeveloperDashboardOverview,
  useProjectStats,
  useFinancialOverview,
  useDashboardPreferences,
  useActivityHistory
} from './useDeveloperDashboard';

// Create aliases for hooks that are missing but needed
export const useDeveloperDashboardData = useDeveloperDashboardOverview;
export const useDeveloperDashboardCharts = useFinancialOverview;
export const useDeveloperDashboardStatus = useProjectStats;

// Export development mutations - renamed to avoid conflicts
export {
  useCreateDevelopment as useCreateDev,
  useUpdateDevelopment as useUpdateDev,
  useUpdateDevelopmentLocation as useUpdateDevLocation,
  useAddProfessionalTeamMember as useAddTeamMember,
  useUpdateTeamMemberStatus as useUpdateTeamMember,
  useAddProjectMilestone as useAddMilestone,
  useUpdateMilestoneStatus as useUpdateMilestone
} from './useDevelopmentMutations';

// Create aliases for missing development mutation hooks
export const useCreateDevelopmentUnit = useCreateDevelopment;
export const useUpdateDevelopmentStatus = useUpdateDevelopment;
export const useAddDevelopmentImage = useCreateDevelopment;
export const useRemoveDevelopmentImage = useUpdateDevelopment;

// Export authentication hooks with aliased exports to avoid conflicts
export { 
  useCurrentUser as useAuthCurrentUser,
  useAuthenticatedGraphQL,
  useUserRoles 
} from './useAuth';

// Re-export base hooks
export { useGraphQLQuery, useGraphQLMutation } from '../useGraphQL';