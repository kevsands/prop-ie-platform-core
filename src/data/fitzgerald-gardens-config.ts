/**
 * Fitzgerald Gardens - Real Project Configuration
 * Update this file with your actual development data
 */

export interface FitzgeraldGardensConfig {
  // Basic project info
  projectName: string;
  location: string;
  description: string;
  
  // Development details
  totalUnits: number;
  phase1Units: number;
  availableForSale: number;
  currentPhase: string;
  completionPercentage: number;
  
  // Timeline
  projectStartDate: string;
  estimatedCompletion: string;
  
  // Unit configurations
  unitTypes: {
    [key: string]: {
      count: number;
      basePrice: number;
      size: number;
      bedrooms: number;
      bathrooms: number;
    }
  };
  
  // Financial data
  totalInvestment: number;
  soldToDate: number;
  reservedUnits: number;
  
  // Team contacts
  keyContacts: {
    [role: string]: {
      name: string;
      company: string;
      email: string;
      phone: string;
    }
  };
}

// TODO: Update with your actual Fitzgerald Gardens data
export const fitzgeraldGardensConfig: FitzgeraldGardensConfig = {
  projectName: "Fitzgerald Gardens",
  location: "Cork, Ireland", // Update with exact location
  description: "Premium residential development in Cork featuring modern apartments and townhouses", // Update with your description
  
  totalUnits: 96, // Confirm total units
  phase1Units: 27, // Confirm phase 1 count
  availableForSale: 15, // Update with actual units available
  currentPhase: "Foundation & Ground Floor Construction", // Update current status
  completionPercentage: 68, // Update actual progress
  
  projectStartDate: "2024-02-01", // Update with actual start date
  estimatedCompletion: "2025-08-15", // Update with actual completion date
  
  unitTypes: {
    "1_bed_apartment": {
      count: 5, // Update actual counts
      basePrice: 295000, // Update actual prices
      size: 58, // Update actual sizes (sqm)
      bedrooms: 1,
      bathrooms: 1
    },
    "2_bed_apartment": {
      count: 7,
      basePrice: 385000,
      size: 85,
      bedrooms: 2,
      bathrooms: 2
    },
    "3_bed_townhouse": {
      count: 3,
      basePrice: 475000,
      size: 125,
      bedrooms: 3,
      bathrooms: 2
    }
  },
  
  totalInvestment: 45000000, // Update with actual investment
  soldToDate: 0, // Update with actual sales
  reservedUnits: 0, // Update with actual reservations
  
  keyContacts: {
    "Lead Architect": {
      name: "Sarah O'Connor", // Update with actual architect
      company: "O'Connor Architecture", // Update with actual company
      email: "sarah@oconnor-arch.ie", // Update with actual email
      phone: "+353 21 123 4567" // Update with actual phone
    },
    "Site Manager": {
      name: "Patrick Murphy", // Update with actual manager
      company: "Murphy Construction", // Update with actual company
      email: "pmurphy@murphycon.ie", // Update with actual email
      phone: "+353 21 456 7890" // Update with actual phone
    },
    "Sales Agent": {
      name: "Update Required", // Add your sales agent
      company: "Update Required", // Add sales company
      email: "sales@prop.ie", // Add sales email
      phone: "+353 21 XXX XXXX" // Add sales phone
    }
  }
};

// Export for use in project data service
export default fitzgeraldGardensConfig;