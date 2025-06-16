/**
 * GraphQL API TypeScript Types
 * 
 * This file provides TypeScript type definitions for all GraphQL entities,
 * inputs, and responses used throughout the application.
 */

// Base types
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type JSON = any;
export type DateTime = string;

// Scalars
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: string;
  JSON: any;
  Upload: File;
};

// Enums
export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  INACTIVE = 'INACTIVE'
}

export enum KYCStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum DevelopmentStatus {
  PLANNING = 'PLANNING',
  PRE_CONSTRUCTION = 'PRE_CONSTRUCTION',
  CONSTRUCTION = 'CONSTRUCTION',
  MARKETING = 'MARKETING',
  SALES = 'SALES',
  HANDOVER = 'HANDOVER',
  COMPLETED = 'COMPLETED'
}

export enum ProfessionalRole {
  ARCHITECT = 'ARCHITECT',
  STRUCTURAL_ENGINEER = 'STRUCTURAL_ENGINEER',
  MECHANICAL_ENGINEER = 'MECHANICAL_ENGINEER',
  ELECTRICAL_ENGINEER = 'ELECTRICAL_ENGINEER',
  QUANTITY_SURVEYOR = 'QUANTITY_SURVEYOR',
  SOLICITOR = 'SOLICITOR',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  ENERGY_ASSESSOR = 'ENERGY_ASSESSOR',
  ASSIGNED_CERTIFIER = 'ASSIGNED_CERTIFIER',
  CONTRACTOR = 'CONTRACTOR',
  ESTATE_AGENT = 'ESTATE_AGENT'
}

export enum AppointmentStatus {
  APPOINTED = 'APPOINTED',
  PENDING = 'PENDING',
  TERMINATED = 'TERMINATED',
  COMPLETED = 'COMPLETED'
}

export enum MilestoneStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  DELAYED = 'DELAYED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum Role {
  ADMIN = 'ADMIN',
  DEVELOPER = 'DEVELOPER',
  BUYER = 'BUYER',
  AGENT = 'AGENT',
  SOLICITOR = 'SOLICITOR',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  CONTRACTOR = 'CONTRACTOR'
}

// User Types
export type UserPreferences = {
  notifications: NotificationPreferences;
  theme: string;
  language: string;
  timezone: string;
  dashboardLayout?: Maybe<JSON>\n  );
};

export type NotificationPreferences = {
  email: boolean;
  sms: boolean;
  push: boolean;
};

export type UserPermission = {
  id: Scalars['ID'];
  resource: string;
  action: string;
  conditions?: Maybe<JSON>\n  );
};

export type User = {
  id: Scalars['ID'];
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: Maybe<string>\n  );
  roles: Array<Role>\n  );
  status: UserStatus;
  kycStatus: KYCStatus;
  organization?: Maybe<string>\n  );
  position?: Maybe<string>\n  );
  avatar?: Maybe<string>\n  );
  preferences?: Maybe<UserPreferences>\n  );
  created: Scalars['DateTime'];
  lastActive: Scalars['DateTime'];
  lastLogin?: Maybe<Scalars['DateTime']>\n  );
  metadata?: Maybe<JSON>\n  );
  permissions?: Maybe<Array<UserPermission>>\n  );
};

export type UserSummary = {
  id: Scalars['ID'];
  fullName: string;
  email: string;
  roles: Array<Role>\n  );
  avatar?: Maybe<string>\n  );
};

export type UsersResponse = {
  users: Array<User>\n  );
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
};

export type PageInfo = {
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>\n  );
  endCursor?: Maybe<Scalars['String']>\n  );
};

// Development Types
export type Location = {
  id: Scalars['ID'];
  address: string;
  addressLine1?: Maybe<string>\n  );
  addressLine2?: Maybe<string>\n  );
  city: string;
  county: string;
  eircode?: Maybe<string>\n  );
  country: string;
  longitude?: Maybe<Scalars['Float']>\n  );
  latitude?: Maybe<Scalars['Float']>\n  );
};

export type ProfessionalTeamMember = {
  id: Scalars['ID'];
  user: UserSummary;
  role: ProfessionalRole;
  company: string;
  appointmentDocument?: Maybe<Document>\n  );
  status: AppointmentStatus;
  startDate?: Maybe<Scalars['DateTime']>\n  );
  endDate?: Maybe<Scalars['DateTime']>\n  );
  notes?: Maybe<string>\n  );
};

export type ProjectMilestone = {
  id: Scalars['ID'];
  name: string;
  description: string;
  plannedDate: Scalars['DateTime'];
  actualDate?: Maybe<Scalars['DateTime']>\n  );
  status: MilestoneStatus;
  dependencies?: Maybe<Array<ProjectMilestone>>\n  );
  documents?: Maybe<Array<Document>>\n  );
};

export type ProjectTimeline = {
  id: Scalars['ID'];
  planningSubmissionDate: Scalars['DateTime'];
  planningDecisionDate?: Maybe<Scalars['DateTime']>\n  );
  constructionStartDate?: Maybe<Scalars['DateTime']>\n  );
  constructionEndDate?: Maybe<Scalars['DateTime']>\n  );
  marketingLaunchDate?: Maybe<Scalars['DateTime']>\n  );
  salesLaunchDate?: Maybe<Scalars['DateTime']>\n  );
  milestones: Array<ProjectMilestone>\n  );
};

export type MarketingStatus = {
  website: Scalars['Boolean'];
  brochuresReady: Scalars['Boolean'];
  showUnitReady: Scalars['Boolean'];
  launchDate?: Maybe<Scalars['DateTime']>\n  );
};

export type SalesStatus = {
  totalUnits: Scalars['Int'];
  availableUnits: Scalars['Int'];
  reservedUnits: Scalars['Int'];
  saleAgreedUnits: Scalars['Int'];
  soldUnits: Scalars['Int'];
  salesVelocity: Scalars['Float'];
  targetPriceAverage: Scalars['Float'];
  actualPriceAverage: Scalars['Float'];
  projectedSelloutDate?: Maybe<Scalars['DateTime']>\n  );
};

export type BuildingSpecifications = {
  structure: string;
  foundation: string;
  exteriorWalls: string;
  roofing: string;
  windows: string;
  doors: string;
  interiorFinishes: string;
  heatingSystem: string;
  coolingSystem?: Maybe<string>\n  );
  electricalSystem: string;
  plumbingSystem: string;
  insulation: string;
  energyFeatures: Array<string>\n  );
  smartHomeFeatures?: Maybe<Array<string>>\n  );
  securityFeatures?: Maybe<Array<string>>\n  );
  accessibilityFeatures?: Maybe<Array<string>>\n  );
  sustainabilityFeatures?: Maybe<Array<string>>\n  );
};

export type DevelopmentSummary = {
  id: Scalars['ID'];
  name: string;
  slug?: Maybe<string>\n  );
  status: DevelopmentStatus;
  mainImage: string;
  shortDescription?: Maybe<string>\n  );
  location: Location;
  totalUnits: Scalars['Int'];
  availableUnits: Scalars['Int'];
  priceRange?: Maybe<string>\n  );
  developer: UserSummary;
};

export type Development = {
  id: Scalars['ID'];
  name: string;
  slug?: Maybe<string>\n  );
  developer: UserSummary;
  location: Location;
  status: DevelopmentStatus;
  totalUnits: Scalars['Int'];
  availableUnits: Scalars['Int'];
  professionalTeam: Array<ProfessionalTeamMember>\n  );
  documents: Array<Document>\n  );
  marketingStatus: MarketingStatus;
  salesStatus: SalesStatus;
  timeline?: Maybe<ProjectTimeline>\n  );
  mainImage: string;
  images: Array<string>\n  );
  videos?: Maybe<Array<string>>\n  );
  sitePlanUrl?: Maybe<string>\n  );
  brochureUrl?: Maybe<string>\n  );
  virtualTourUrl?: Maybe<string>\n  );
  websiteUrl?: Maybe<string>\n  );
  description: string;
  shortDescription?: Maybe<string>\n  );
  features: Array<string>\n  );
  amenities: Array<string>\n  );
  buildingSpecs?: Maybe<BuildingSpecifications>\n  );
  buildingType?: Maybe<string>\n  );
  completionDate?: Maybe<Scalars['DateTime']>\n  );
  startDate?: Maybe<Scalars['DateTime']>\n  );
  created: Scalars['DateTime'];
  updated: Scalars['DateTime'];
  publishedDate?: Maybe<Scalars['DateTime']>\n  );
  isPublished: Scalars['Boolean'];
  tags?: Maybe<Array<string>>\n  );
  awards?: Maybe<Array<string>>\n  );
};

export type DevelopmentsResponse = {
  developments: Array<DevelopmentSummary>\n  );
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
};

// Document Types
export type Document = {
  id: Scalars['ID'];
  name: string;
  description?: Maybe<string>\n  );
  category: string;
  status: string;
  url: string;
  created: Scalars['DateTime'];
  updated: Scalars['DateTime'];
  size: Scalars['Int'];
  fileType: string;
  uploadedBy: UserSummary;
};

// Financial Types
export type FinancialMetrics = {
  totalRevenue: Scalars['Float'];
  totalExpenses: Scalars['Float'];
  netProfit: Scalars['Float'];
  profitMargin: Scalars['Float'];
  roi: Scalars['Float'];
  cashOnHand: Scalars['Float'];
  outstandingInvoices: Scalars['Float'];
};

export type CashFlowItem = {
  date: Scalars['DateTime'];
  income: Scalars['Float'];
  expenses: Scalars['Float'];
  balance: Scalars['Float'];
  category: string;
  description?: Maybe<string>\n  );
};

// Input Types
export type LocationInput = {
  address: string;
  addressLine1?: Maybe<string>\n  );
  addressLine2?: Maybe<string>\n  );
  city: string;
  county: string;
  eircode?: Maybe<string>\n  );
  longitude?: Maybe<Scalars['Float']>\n  );
  latitude?: Maybe<Scalars['Float']>\n  );
};

export type CreateDevelopmentInput = {
  name: string;
  location: LocationInput;
  description: string;
  shortDescription?: Maybe<string>\n  );
  mainImage: string;
  features: Array<string>\n  );
  amenities: Array<string>\n  );
  totalUnits: Scalars['Int'];
  status: DevelopmentStatus;
  buildingType?: Maybe<string>\n  );
  startDate?: Maybe<Scalars['DateTime']>\n  );
  completionDate?: Maybe<Scalars['DateTime']>\n  );
  tags?: Maybe<Array<string>>\n  );
};

export type UpdateDevelopmentInput = {
  name?: Maybe<string>\n  );
  description?: Maybe<string>\n  );
  shortDescription?: Maybe<string>\n  );
  mainImage?: Maybe<string>\n  );
  features?: Maybe<Array<string>>\n  );
  amenities?: Maybe<Array<string>>\n  );
  status?: Maybe<DevelopmentStatus>\n  );
  buildingType?: Maybe<string>\n  );
  startDate?: Maybe<Scalars['DateTime']>\n  );
  completionDate?: Maybe<Scalars['DateTime']>\n  );
  isPublished?: Maybe<Scalars['Boolean']>\n  );
  tags?: Maybe<Array<string>>\n  );
};

export type UpdateLocationInput = {
  address?: Maybe<string>\n  );
  addressLine1?: Maybe<string>\n  );
  addressLine2?: Maybe<string>\n  );
  city?: Maybe<string>\n  );
  county?: Maybe<string>\n  );
  eircode?: Maybe<string>\n  );
  longitude?: Maybe<Scalars['Float']>\n  );
  latitude?: Maybe<Scalars['Float']>\n  );
};

export type DevelopmentFilterInput = {
  search?: Maybe<string>\n  );
  status?: Maybe<Array<DevelopmentStatus>>\n  );
  developer?: Maybe<Scalars['ID']>\n  );
  city?: Maybe<string>\n  );
  county?: Maybe<string>\n  );
  minUnits?: Maybe<Scalars['Int']>\n  );
  maxUnits?: Maybe<Scalars['Int']>\n  );
  isPublished?: Maybe<Scalars['Boolean']>\n  );
  tags?: Maybe<Array<string>>\n  );
};

export type CreateUserInput = {
  email: string;
  firstName: string;
  lastName: string;
  phone?: Maybe<string>\n  );
  roles: Array<Role>\n  );
  organization?: Maybe<string>\n  );
  position?: Maybe<string>\n  );
  password?: Maybe<string>\n  );
};

export type UpdateUserInput = {
  firstName?: Maybe<string>\n  );
  lastName?: Maybe<string>\n  );
  phone?: Maybe<string>\n  );
  roles?: Maybe<Array<Role>>\n  );
  status?: Maybe<UserStatus>\n  );
  organization?: Maybe<string>\n  );
  position?: Maybe<string>\n  );
  avatar?: Maybe<string>\n  );
  preferences?: Maybe<JSON>\n  );
};

export type UserFilterInput = {
  search?: Maybe<string>\n  );
  roles?: Maybe<Array<Role>>\n  );
  status?: Maybe<UserStatus>\n  );
  kycStatus?: Maybe<KYCStatus>\n  );
  createdAfter?: Maybe<Scalars['DateTime']>\n  );
  createdBefore?: Maybe<Scalars['DateTime']>\n  );
};

export type PaginationInput = {
  first?: Maybe<Scalars['Int']>\n  );
  after?: Maybe<Scalars['String']>\n  );
  last?: Maybe<Scalars['Int']>\n  );
  before?: Maybe<Scalars['String']>\n  );
};

// Dashboard and Project Types
export enum ProjectStatus {
  PLANNING = 'PLANNING',
  APPROVED = 'APPROVED',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum ProjectCategory {
  RESIDENTIAL = 'RESIDENTIAL',
  COMMERCIAL = 'COMMERCIAL',
  MIXED = 'MIXED',
  INDUSTRIAL = 'INDUSTRIAL',
  RETAIL = 'RETAIL',
  HOSPITALITY = 'HOSPITALITY',
  INFRASTRUCTURE = 'INFRASTRUCTURE'
}

export type ProjectSummary = {
  id: Scalars['ID'];
  name: string;
  status: ProjectStatus;
  category: ProjectCategory;
  progress: Scalars['Float'];
  location: string;
  startDate: Scalars['DateTime'];
  completionDate?: Maybe<Scalars['DateTime']>\n  );
  totalUnits: Scalars['Int'];
  soldUnits: Scalars['Int'];
  availableUnits: Scalars['Int'];
  reservedUnits: Scalars['Int'];
  lastUpdated: Scalars['DateTime'];
  thumbnail?: Maybe<string>\n  );
};

export type SalesMetrics = {
  monthlySales: Array<{
    month: string;
    year: number;
    count: number;
    value: number;
  }>\n  );
  salesByStatus: Array<{
    status: string;
    count: number;
    value: number;
  }>\n  );
  conversionRate: number;
  averageTimeToSale: number;
  hotLeads: number;
};

export type DashboardMetrics = {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalUnits: number;
  availableUnits: number;
  reservedUnits: number;
  soldUnits: number;
  totalSales: number;
  totalRevenue: number;
  projectedRevenue: number;
  conversionRate: number;
};

export type TimelineEvent = {
  id: Scalars['ID'];
  timestamp: Scalars['DateTime'];
  type: string;
  title: string;
  description?: Maybe<string>\n  );
  user?: Maybe<{
    id: Scalars['ID'];
    fullName: string;
    avatar?: Maybe<string>\n  );
  }>\n  );
  project?: Maybe<{
    id: Scalars['ID'];
    name: string;
  }>\n  );
  entityType?: Maybe<string>\n  );
  entityId?: Maybe<Scalars['ID']>\n  );
};

export type DateRangeInput = {
  startDate: Scalars['DateTime'];
  endDate: Scalars['DateTime'];
};

export type DashboardFilterInput = {
  developerId?: Maybe<Scalars['ID']>\n  );
  projectIds?: Maybe<Array<Scalars['ID']>>\n  );
  projectStatus?: Maybe<Array<ProjectStatus>>\n  );
  projectCategory?: Maybe<Array<ProjectCategory>>\n  );
  includeCompletedProjects?: Maybe<Scalars['Boolean']>\n  );
};

/**
 * Centralized GraphQL Types
 */

export interface GraphQLContext {
  user: {
    id?: string;
    userId?: string;
    username?: string;
    email?: string;
    roles?: string[];
  } | null;
  userRoles: string[];
  isAuthenticated: boolean;
  token?: string;
}

export interface AuthContext extends GraphQLContext {
  user: NonNullable<GraphQLContext['user']>\n  );
}

export type ResolverFunction<TArgs = any, TResult = any> = (
  parent: unknown,
  args: TArgs,
  context: GraphQLContext
) => Promise<TResult>\n  );
export type AuthResolverFunction<TArgs = any, TResult = any> = (
  parent: unknown,
  args: TArgs,
  context: AuthContext
) => Promise<TResult>\n  );
// GraphQL Operation Types
export interface GraphQLOperationContext {
  operationType: 'query' | 'mutation';
  operationName: string;
  variables?: Record<string, unknown>\n  );
  timestamp: string;
}

export interface GraphQLOperationOptions {
  throwOnError?: boolean;
  onError?: (error: Error) => void;
  onSuccess?: (data: unknown) => void;
}

export class GraphQLErrorHandler {
  handleError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error(String(error));
  }
}

export function createGraphQLResult<T>(
  response: any,
  context: GraphQLOperationContext,
  errorHandler: GraphQLErrorHandler
): { data?: T; error?: Error; context: GraphQLOperationContext } {
  if (response.errors) {
    return {
      error: errorHandler.handleError(response.errors[0]),
      context};
  }
  return {
    data: response.data,
    context};
}