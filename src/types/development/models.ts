/**
 * Development Model Definitions
 * 
 * Contains the core data models for developments and related entities.
 */

import { DevelopmentStatus } from '../enums';
import { Location, NearbyPlace } from '../location';
import { Document } from '../document';
import { Unit } from '../unit';
import { Project, ProjectTeamMember, ProjectTimeline, ProjectBudget } from '../project';

/**
 * Development Interface
 * Represents a real estate development/project that contains multiple properties
 */
export interface Development {
  id: string;
  name: string;
  slug?: string;
  description: string;
  
  // Enhanced location information
  location: Location;
  
  // Images and media
  image: string;
  images?: string[]; // Multiple images
  sitePlanUrl?: string;
  brochureUrl?: string;
  virtualTourUrl?: string;
  
  // Status information
  status: string | DevelopmentStatus;
  statusColor: string;
  availabilityStatus: string;
  
  // Property details
  priceRange: string;
  bedrooms: number[];
  bathrooms: number;
  buildingType: string;
  totalUnits: number;
  developmentFeatures: string[];
  areaAmenities: string[];
  
  // Sales information
  salesAgent: { 
    name: string; 
    agency: string;
    phone?: string;
    email?: string;
  };
  
  // Dates
  showingDates: string[];
  completionDate?: string;
  startDate?: string;
  createdAt: string;
  updatedAt: string;
  
  // Additional properties
  type?: string;
  units?: Unit[];
  
  // Floor plans
  floorPlans?: Array<{
    id: string;
    name: string;
    image: string;
    unitType: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
  }>
  );
  // Additional enhanced properties
  developerId: string;
  professionalTeam?: ProjectTeamMember[];
  documents?: Document[];
  timeline?: ProjectTimeline;
  financials?: ProjectBudget;
  nearbyPlaces?: NearbyPlace[];
  project?: Project;
}

/**
 * Development List Item
 * Simplified development object for list views
 */
export interface DevelopmentListItem {
  id: string;
  name: string;
  slug?: string;
  location: string;
  image: string;
  status: string | DevelopmentStatus;
  statusColor: string;
  priceRange: string;
  bedrooms: number[];
  completionDate?: string;
}

/**
 * Development Detail
 * Extended development object with additional data for detail views
 */
export interface DevelopmentDetail extends Development {
  propertyCount?: number;
  availableUnits?: number;
  constructionProgress?: number;
  developer?: {
    id: string;
    name: string;
    logo?: string;
  };
  
  // Override nearbyPlaces to ensure consistent type
  nearbyPlaces?: NearbyPlace[];
  
  similarDevelopments?: DevelopmentListItem[];
}