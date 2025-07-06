/**
 * Sales Types
 * Type definitions for sales dashboard components
 */

// Unit statuses
export type UnitStatus = 'available' | 'reserved' | 'sold' | 'pending' | 'withdrawn';

// Unit type categories
export type UnitType = 'apartment' | 'house' | 'duplex' | 'penthouse' | 'commercial';

// Property Unit
export interface PropertyUnit {
  id: string;
  unitNumber: string;
  type: UnitType;
  bedrooms: number;
  bathrooms: number;
  area: number; // in sq meters/feet
  price: number;
  status: UnitStatus;
  floor?: number;
  location?: string;
  isCorner?: boolean;
  isPremium?: boolean;
  reservationDate?: string;
  saleDate?: string;
  viewingCount?: number;
  leadCount?: number;
}

// Sales Activity Item
export interface SalesActivity {
  id: string;
  unitId: string;
  unitNumber: string;
  timestamp: number;
  type: 'viewing' | 'reservation' | 'sale' | 'cancellation' | 'price_change' | 'status_change';
  agentId?: string;
  agentName?: string;
  previousStatus?: UnitStatus;
  newStatus?: UnitStatus;
  clientName?: string;
  clientEmail?: string;
  notes?: string;
  previousPrice?: number;
  newPrice?: number;
}

// Sales Lead
export interface SalesLead {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  status: 'new' | 'contacted' | 'viewing_scheduled' | 'viewed' | 'interested' | 'reserved' | 'contract' | 'closed' | 'lost';
  interestedUnits: string[]; // unitIds
  assignedAgentId?: string;
  assignedAgentName?: string;
  firstContactDate: string;
  lastContactDate: string;
  nextFollowUpDate?: string;
  source?: string;
  budget?: {
    min: number;
    max: number;
  };
  requirements?: {
    minBedrooms?: number;
    minBathrooms?: number;
    preferences?: string[];
  };
  notes?: string;
  priority?: 'low' | 'medium' | 'high';
  probability?: number; // 0-100 percentage
  lastActivity?: string;
}

// Sales summary for a project
export interface SalesSummary {
  totalUnits: number;
  availableUnits: number;
  reservedUnits: number;
  soldUnits: number;
  pendingUnits: number;
  withdrawnUnits: number;
  totalValue: number;
  soldValue: number;
  reservedValue: number;
  averageSalePrice: number;
  averageDaysOnMarket: number;
  conversionRate: number; // percentage of viewings that result in sales
  targetSalesPerMonth: number;
  actualSalesPerMonth: number;
  salesVelocity: number; // units sold per month
}

// Sales metrics by unit type
export interface UnitTypeSalesMetrics {
  type: UnitType;
  total: number;
  available: number;
  reserved: number;
  sold: number;
  averagePrice: number;
  totalValue: number;
  soldValue: number;
  percentageSold: number;
  averageDaysOnMarket: number;
}

// Sales metrics by floor/location
export interface LocationSalesMetrics {
  location: string; // floor number or block/section name
  total: number;
  available: number;
  reserved: number;
  sold: number;
  percentageSold: number;
}

// Lead summary
export interface LeadsSummary {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  viewingScheduledLeads: number;
  viewedLeads: number;
  interestedLeads: number;
  reservedLeads: number;
  contractLeads: number;
  closedLeads: number;
  lostLeads: number;
  conversionRate: number; // percentage of leads that result in sales
  averageTimeToReservation: number; // in days
}

// Sales Progress Tracker Props
export interface SalesProgressTrackerProps {
  projectId: string;
  className?: string;
  filterByUnitType?: UnitType;
  filterByLocation?: string;
  showLeads?: boolean;
}

// Sales dashboard view
export interface SalesDashboardProps {
  projectId: string;
  className?: string;
}