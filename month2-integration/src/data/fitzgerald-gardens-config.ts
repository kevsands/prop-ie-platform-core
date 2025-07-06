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

// Real Fitzgerald Gardens data matching seeded database
export const fitzgeraldGardensConfig: FitzgeraldGardensConfig = {
  projectName: "Fitzgerald Gardens",
  location: "Ballymakenny Road, Drogheda, Co. Louth",
  description: "Premium residential development featuring 96 modern units across four distinct property types - Hawthorne, Oak, Birch, and Willow collections",
  
  totalUnits: 96,
  phase1Units: 43, // Phase 1a (27) + Phase 1b (16)
  availableForSale: 64, // Available units (not sold/reserved)
  currentPhase: "Phase 2a Construction", 
  completionPercentage: 68,
  
  projectStartDate: "2024-02-01",
  estimatedCompletion: "2025-08-15",
  
  unitTypes: {
    "1_bed_apartment": {
      count: 24, // Willow units
      basePrice: 295000,
      size: 58,
      bedrooms: 1,
      bathrooms: 1
    },
    "2_bed_apartment": {
      count: 30, // Birch units
      basePrice: 350000,
      size: 85,
      bedrooms: 2,
      bathrooms: 2
    },
    "3_bed_apartment": {
      count: 24, // Hawthorne units
      basePrice: 397500, // Average of €395k-€400k range
      size: 125,
      bedrooms: 3,
      bathrooms: 2
    },
    "4_bed_apartment": {
      count: 18, // Oak units
      basePrice: 475000,
      size: 165,
      bedrooms: 4,
      bathrooms: 3
    }
  },
  
  totalInvestment: 45000000,
  soldToDate: 22, // Units sold
  reservedUnits: 10, // Units reserved
  
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