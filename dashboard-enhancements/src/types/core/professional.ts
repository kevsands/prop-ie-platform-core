/**
 * PropIE Core Data Model - Professional Team
 * Defines professional team members, their roles, and appointments
 */

import { Document } from '../document';
import { Development } from './development';
import { User, UserRole } from './user';
import { Sale } from './sales';

/**
 * Professional interface
 * Represents professionals who work on development projects
 */
export interface Professional {
  id: string;
  user: User;
  company: Company;
  specializations: ProfessionalSpecialization[];
  qualifications: Qualification[];
  documents: Document[];
  status: ProfessionalStatus;
  licenseNumber?: string;
  insuranceDetails?: InsuranceDetails;
  professionalBio?: string;
  website?: string;
  created: Date;
  updated: Date;
}

/**
 * Professional Status enum
 * Indicates the status of a professional in the system
 */
export enum ProfessionalStatus {
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  SUSPENDED = 'suspended',
  INACTIVE = 'inactive'
}

/**
 * Professional Specialization enum
 * Areas of expertise for professionals
 */
export enum ProfessionalSpecialization {
  RESIDENTIAL = 'residential',
  COMMERCIAL = 'commercial',
  MIXED_USE = 'mixed_use',
  SUSTAINABILITY = 'sustainability',
  HERITAGE = 'heritage',
  ENERGY_EFFICIENCY = 'energy_efficiency',
  CONSERVATION = 'conservation',
  PASSIVE_HOUSE = 'passive_house',
  URBAN_PLANNING = 'urban_planning',
  INTERIOR_DESIGN = 'interior_design',
  LANDSCAPE = 'landscape',
  BIM = 'building_information_modeling'
}

/**
 * Company interface
 * Represents companies that provide professional services
 */
export interface Company {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  description?: string;
  logo?: string;
  vatNumber?: string;
  companyNumber: string;
  serviceAreas?: ServiceArea[];
  employees?: Professional[];
  establishedDate?: Date;
  insuranceDetails?: InsuranceDetails;
  certifications?: string[];
  created: Date;
  updated: Date;
}

/**
 * Service Area interface
 * Geographic areas served by a company
 */
export interface ServiceArea {
  county: string;
  cities: string[];
}

/**
 * Qualification interface
 * Professional qualifications and certifications
 */
export interface Qualification {
  id: string;
  title: string;
  issuingBody: string;
  dateObtained: Date;
  expiryDate?: Date;
  certificateDocument?: Document;
  verificationUrl?: string;
  isVerified: boolean;
}

/**
 * Insurance Details interface
 * Professional indemnity and liability insurance
 */
export interface InsuranceDetails {
  provider: string;
  policyNumber: string;
  coverageAmount: number;
  startDate: Date;
  expiryDate: Date;
  documentUrl?: string;
  policyDocument?: Document;
}

/**
 * Professional Appointment interface
 * Assignment of a professional to a development
 */
export interface ProfessionalAppointment {
  id: string;
  development: Development;
  professional: Professional;
  role: ProfessionalRole;
  appointmentDate: Date;
  endDate?: Date;
  status: AppointmentStatus;
  contractDocument?: Document;
  feeStructure?: FeeStructure;
  responsibilities: string[];
  notes?: string;
  created: Date;
  updated: Date;
}

/**
 * Professional Role enum
 * Specific roles a professional can have on a development
 */
export enum ProfessionalRole {
  ARCHITECT = 'architect',
  STRUCTURAL_ENGINEER = 'structural_engineer',
  MECHANICAL_ENGINEER = 'mechanical_engineer',
  ELECTRICAL_ENGINEER = 'electrical_engineer',
  CIVIL_ENGINEER = 'civil_engineer',
  QUANTITY_SURVEYOR = 'quantity_surveyor',
  PROJECT_MANAGER = 'project_manager',
  PLANNING_CONSULTANT = 'planning_consultant',
  SOLICITOR = 'solicitor',
  ESTATE_AGENT = 'estate_agent',
  ENERGY_ASSESSOR = 'energy_assessor',
  ASSIGNED_CERTIFIER = 'assigned_certifier',
  FIRE_SAFETY_CONSULTANT = 'fire_safety_consultant',
  LANDSCAPE_ARCHITECT = 'landscape_architect',
  INTERIOR_DESIGNER = 'interior_designer',
  ACOUSTIC_CONSULTANT = 'acoustic_consultant',
  SUSTAINABILITY_CONSULTANT = 'sustainability_consultant'
}

/**
 * Appointment Status enum
 * Current status of a professional appointment
 */
export enum AppointmentStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  COMPLETED = 'completed',
  TERMINATED = 'terminated'
}

/**
 * Fee Structure interface
 * Payment terms for professional services
 */
export interface FeeStructure {
  type: FeeType;
  amount: number;
  details: string;
  paymentSchedule?: PaymentMilestone[];
  currency: string;
  invoicingFrequency?: 'weekly' | 'monthly' | 'quarterly' | 'milestone';
  isVatExclusive: boolean;
  vatRate?: number;
}

/**
 * Fee Type enum
 * Types of fee arrangements
 */
export enum FeeType {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage',
  HOURLY = 'hourly',
  STAGED = 'staged',
  RETAINER = 'retainer'
}

/**
 * Payment Milestone interface
 * Scheduled payments based on project milestones
 */
export interface PaymentMilestone {
  id: string;
  description: string;
  amount: number;
  percentage?: number;
  dueDate?: Date;
  dependsOn?: string;
  isPaid: boolean;
  paidDate?: Date;
  invoiceDocument?: Document;
}

/**
 * Professional Assignment interface
 * Assignment of a professional to a specific sale
 */
export interface ProfessionalAssignment {
  id: string;
  professional: Professional;
  role: ProfessionalRole;
  sale: Sale;
  assignedDate: Date;
  endDate?: Date;
  status: AssignmentStatus;
  notes?: string;
  created: Date;
  updated: Date;
}

/**
 * Assignment Status enum
 * Status of a professional's assignment to a sale
 */
export enum AssignmentStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

/**
 * Professional Review interface
 * Review of a professional's services
 */
export interface ProfessionalReview {
  id: string;
  professional: Professional;
  reviewer: User;
  development?: Development;
  sale?: Sale;
  rating: number; // 1-5
  comment: string;
  reviewDate: Date;
  isPublic: boolean;
  isVerified: boolean;
  response?: string;
  responseDate?: Date;
}

/**
 * Helper to check if a user is a professional with specific specialization
 */
export function hasProfessionalSpecialization(
  professional: Professional,
  specialization: ProfessionalSpecialization
): boolean {
  return professional.specializations.includes(specialization);
}

/**
 * Helper to check if a professional is available for appointment
 */
export function isProfessionalAvailable(professional: Professional): boolean {
  return professional.status === ProfessionalStatus.APPROVED;
}

/**
 * Helper to map user roles to professional roles
 */
export function getUserProfessionalRoles(user: User): ProfessionalRole[] {
  const roleMap: Partial<Record<UserRole, ProfessionalRole>> = {
    [UserRole.ARCHITECT]: ProfessionalRole.ARCHITECT,
    [UserRole.ENGINEER]: ProfessionalRole.STRUCTURAL_ENGINEER,
    [UserRole.QUANTITY_SURVEYOR]: ProfessionalRole.QUANTITY_SURVEYOR,
    [UserRole.LEGAL]: ProfessionalRole.SOLICITOR,
    [UserRole.PROJECT_MANAGER]: ProfessionalRole.PROJECT_MANAGER,
    [UserRole.AGENT]: ProfessionalRole.ESTATE_AGENT,
    [UserRole.SOLICITOR]: ProfessionalRole.SOLICITOR
  };
  
  return user.roles
    .map(role => roleMap[role])
    .filter(role => role !== undefined) as ProfessionalRole[];
}