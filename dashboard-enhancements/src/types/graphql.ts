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
  dashboardLayout?: Maybe<JSON>;
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
  conditions?: Maybe<JSON>;
};

export type User = {
  id: Scalars['ID'];
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: Maybe<string>;
  roles: Array<Role>;
  status: UserStatus;
  kycStatus: KYCStatus;
  organization?: Maybe<string>;
  position?: Maybe<string>;
  avatar?: Maybe<string>;
  preferences?: Maybe<UserPreferences>;
  created: Scalars['DateTime'];
  lastActive: Scalars['DateTime'];
  lastLogin?: Maybe<Scalars['DateTime']>;
  metadata?: Maybe<JSON>;
  permissions?: Maybe<Array<UserPermission>>;
};

export type UserSummary = {
  id: Scalars['ID'];
  fullName: string;
  email: string;
  roles: Array<Role>;
  avatar?: Maybe<string>;
};

export type UsersResponse = {
  users: Array<User>;
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
};

export type PageInfo = {
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
  endCursor?: Maybe<Scalars['String']>;
};

// Development Types
export type Location = {
  id: Scalars['ID'];
  address: string;
  addressLine1?: Maybe<string>;
  addressLine2?: Maybe<string>;
  city: string;
  county: string;
  eircode?: Maybe<string>;
  country: string;
  longitude?: Maybe<Scalars['Float']>;
  latitude?: Maybe<Scalars['Float']>;
};

export type ProfessionalTeamMember = {
  id: Scalars['ID'];
  user: UserSummary;
  role: ProfessionalRole;
  company: string;
  appointmentDocument?: Maybe<Document>;
  status: AppointmentStatus;
  startDate?: Maybe<Scalars['DateTime']>;
  endDate?: Maybe<Scalars['DateTime']>;
  notes?: Maybe<string>;
};

export type ProjectMilestone = {
  id: Scalars['ID'];
  name: string;
  description: string;
  plannedDate: Scalars['DateTime'];
  actualDate?: Maybe<Scalars['DateTime']>;
  status: MilestoneStatus;
  dependencies?: Maybe<Array<ProjectMilestone>>;
  documents?: Maybe<Array<Document>>;
};

export type ProjectTimeline = {
  id: Scalars['ID'];
  planningSubmissionDate: Scalars['DateTime'];
  planningDecisionDate?: Maybe<Scalars['DateTime']>;
  constructionStartDate?: Maybe<Scalars['DateTime']>;
  constructionEndDate?: Maybe<Scalars['DateTime']>;
  marketingLaunchDate?: Maybe<Scalars['DateTime']>;
  salesLaunchDate?: Maybe<Scalars['DateTime']>;
  milestones: Array<ProjectMilestone>;
};

export type MarketingStatus = {
  website: Scalars['Boolean'];
  brochuresReady: Scalars['Boolean'];
  showUnitReady: Scalars['Boolean'];
  launchDate?: Maybe<Scalars['DateTime']>;
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
  projectedSelloutDate?: Maybe<Scalars['DateTime']>;
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
  coolingSystem?: Maybe<string>;
  electricalSystem: string;
  plumbingSystem: string;
  insulation: string;
  energyFeatures: Array<string>;
  smartHomeFeatures?: Maybe<Array<string>>;
  securityFeatures?: Maybe<Array<string>>;
  accessibilityFeatures?: Maybe<Array<string>>;
  sustainabilityFeatures?: Maybe<Array<string>>;
};

export type DevelopmentSummary = {
  id: Scalars['ID'];
  name: string;
  slug?: Maybe<string>;
  status: DevelopmentStatus;
  mainImage: string;
  shortDescription?: Maybe<string>;
  location: Location;
  totalUnits: Scalars['Int'];
  availableUnits: Scalars['Int'];
  priceRange?: Maybe<string>;
  developer: UserSummary;
};

export type Development = {
  id: Scalars['ID'];
  name: string;
  slug?: Maybe<string>;
  developer: UserSummary;
  location: Location;
  status: DevelopmentStatus;
  totalUnits: Scalars['Int'];
  availableUnits: Scalars['Int'];
  professionalTeam: Array<ProfessionalTeamMember>;
  documents: Array<Document>;
  marketingStatus: MarketingStatus;
  salesStatus: SalesStatus;
  timeline?: Maybe<ProjectTimeline>;
  mainImage: string;
  images: Array<string>;
  videos?: Maybe<Array<string>>;
  sitePlanUrl?: Maybe<string>;
  brochureUrl?: Maybe<string>;
  virtualTourUrl?: Maybe<string>;
  websiteUrl?: Maybe<string>;
  description: string;
  shortDescription?: Maybe<string>;
  features: Array<string>;
  amenities: Array<string>;
  buildingSpecs?: Maybe<BuildingSpecifications>;
  buildingType?: Maybe<string>;
  completionDate?: Maybe<Scalars['DateTime']>;
  startDate?: Maybe<Scalars['DateTime']>;
  created: Scalars['DateTime'];
  updated: Scalars['DateTime'];
  publishedDate?: Maybe<Scalars['DateTime']>;
  isPublished: Scalars['Boolean'];
  tags?: Maybe<Array<string>>;
  awards?: Maybe<Array<string>>;
};

export type DevelopmentsResponse = {
  developments: Array<DevelopmentSummary>;
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
};

// Document Types
export type Document = {
  id: Scalars['ID'];
  name: string;
  description?: Maybe<string>;
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
  description?: Maybe<string>;
};

// Input Types
export type LocationInput = {
  address: string;
  addressLine1?: Maybe<string>;
  addressLine2?: Maybe<string>;
  city: string;
  county: string;
  eircode?: Maybe<string>;
  longitude?: Maybe<Scalars['Float']>;
  latitude?: Maybe<Scalars['Float']>;
};

export type CreateDevelopmentInput = {
  name: string;
  location: LocationInput;
  description: string;
  shortDescription?: Maybe<string>;
  mainImage: string;
  features: Array<string>;
  amenities: Array<string>;
  totalUnits: Scalars['Int'];
  status: DevelopmentStatus;
  buildingType?: Maybe<string>;
  startDate?: Maybe<Scalars['DateTime']>;
  completionDate?: Maybe<Scalars['DateTime']>;
  tags?: Maybe<Array<string>>;
};

export type UpdateDevelopmentInput = {
  name?: Maybe<string>;
  description?: Maybe<string>;
  shortDescription?: Maybe<string>;
  mainImage?: Maybe<string>;
  features?: Maybe<Array<string>>;
  amenities?: Maybe<Array<string>>;
  status?: Maybe<DevelopmentStatus>;
  buildingType?: Maybe<string>;
  startDate?: Maybe<Scalars['DateTime']>;
  completionDate?: Maybe<Scalars['DateTime']>;
  isPublished?: Maybe<Scalars['Boolean']>;
  tags?: Maybe<Array<string>>;
};

export type UpdateLocationInput = {
  address?: Maybe<string>;
  addressLine1?: Maybe<string>;
  addressLine2?: Maybe<string>;
  city?: Maybe<string>;
  county?: Maybe<string>;
  eircode?: Maybe<string>;
  longitude?: Maybe<Scalars['Float']>;
  latitude?: Maybe<Scalars['Float']>;
};

export type DevelopmentFilterInput = {
  search?: Maybe<string>;
  status?: Maybe<Array<DevelopmentStatus>>;
  developer?: Maybe<Scalars['ID']>;
  city?: Maybe<string>;
  county?: Maybe<string>;
  minUnits?: Maybe<Scalars['Int']>;
  maxUnits?: Maybe<Scalars['Int']>;
  isPublished?: Maybe<Scalars['Boolean']>;
  tags?: Maybe<Array<string>>;
};

export type CreateUserInput = {
  email: string;
  firstName: string;
  lastName: string;
  phone?: Maybe<string>;
  roles: Array<Role>;
  organization?: Maybe<string>;
  position?: Maybe<string>;
  password?: Maybe<string>;
};

export type UpdateUserInput = {
  firstName?: Maybe<string>;
  lastName?: Maybe<string>;
  phone?: Maybe<string>;
  roles?: Maybe<Array<Role>>;
  status?: Maybe<UserStatus>;
  organization?: Maybe<string>;
  position?: Maybe<string>;
  avatar?: Maybe<string>;
  preferences?: Maybe<JSON>;
};

export type UserFilterInput = {
  search?: Maybe<string>;
  roles?: Maybe<Array<Role>>;
  status?: Maybe<UserStatus>;
  kycStatus?: Maybe<KYCStatus>;
  createdAfter?: Maybe<Scalars['DateTime']>;
  createdBefore?: Maybe<Scalars['DateTime']>;
};

export type PaginationInput = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
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
  completionDate?: Maybe<Scalars['DateTime']>;
  totalUnits: Scalars['Int'];
  soldUnits: Scalars['Int'];
  availableUnits: Scalars['Int'];
  reservedUnits: Scalars['Int'];
  lastUpdated: Scalars['DateTime'];
  thumbnail?: Maybe<string>;
};

export type SalesMetrics = {
  monthlySales: Array<{
    month: string;
    year: number;
    count: number;
    value: number;
  }>;
  salesByStatus: Array<{
    status: string;
    count: number;
    value: number;
  }>;
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
  description?: Maybe<string>;
  user?: Maybe<{
    id: Scalars['ID'];
    fullName: string;
    avatar?: Maybe<string>;
  }>;
  project?: Maybe<{
    id: Scalars['ID'];
    name: string;
  }>;
  entityType?: Maybe<string>;
  entityId?: Maybe<Scalars['ID']>;
};

export type DateRangeInput = {
  startDate: Scalars['DateTime'];
  endDate: Scalars['DateTime'];
};

export type DashboardFilterInput = {
  developerId?: Maybe<Scalars['ID']>;
  projectIds?: Maybe<Array<Scalars['ID']>>;
  projectStatus?: Maybe<Array<ProjectStatus>>;
  projectCategory?: Maybe<Array<ProjectCategory>>;
  includeCompletedProjects?: Maybe<Scalars['Boolean']>;
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
  user: NonNullable<GraphQLContext['user']>;
}

export type ResolverFunction<TArgs = any, TResult = any> = (
  parent: unknown,
  args: TArgs,
  context: GraphQLContext
) => Promise<TResult>;

export type AuthResolverFunction<TArgs = any, TResult = any> = (
  parent: unknown,
  args: TArgs,
  context: AuthContext
) => Promise<TResult>;

// GraphQL Operation Types
export interface GraphQLOperationContext {
  operationType: 'query' | 'mutation';
  operationName: string;
  variables?: Record<string, unknown>;
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
      context,
    };
  }
  return {
    data: response.data,
    context,
  };
}