/**
 * Unified Project Service - Enterprise Data Architecture
 * Single source of truth for all project management operations
 * 
 * @fileoverview Enterprise-grade service layer providing unified data management
 * @version 3.0.0
 * @author Property Development Platform Team
 */

import { EventEmitter } from 'events';

// =============================================================================
// CORE DATA INTERFACES
// =============================================================================

export interface ProjectData {
  id: string;
  name: string;
  code: string;
  description: string;
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
  
  // Location & Planning
  location: {
    address: string;
    city: string;
    county: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  
  planning: {
    reference: string;
    status: 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'CONDITIONAL';
    submittedDate?: string;
    approvedDate?: string;
    conditions?: string[];
  };
  
  // Timeline & Progress
  timeline: {
    estimatedStartDate: string;
    estimatedEndDate: string;
    actualStartDate?: string;
    actualEndDate?: string;
    overallProgress: number; // 0-100
    currentPhase: string;
  };
  
  // Financial Overview
  finances: {
    totalEstimatedCost: number;
    totalActualCost: number;
    totalEstimatedRevenue: number;
    totalActualRevenue: number;
    currency: string;
    profitMargin: number;
    roi: number;
  };
  
  // Company Information
  company: CompanyDetails;
  
  // Development Phases
  phases: ProjectPhase[];
  
  // Units
  units: UnitData[];
  
  // Team & Stakeholders
  team: TeamMember[];
  
  // Transactions & Buyers
  transactions: TransactionData[];
  
  // Documents & Media
  documents: DocumentData[];
  media: MediaData[];
  
  // Compliance & Legal
  compliance: ComplianceData;
  
  // Analytics & Performance
  analytics: AnalyticsData;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  lastModifiedBy: string;
}

export interface CompanyDetails {
  id: string;
  name: string;
  tradingName?: string;
  companyType: 'LIMITED_COMPANY' | 'PLC' | 'LLP' | 'PARTNERSHIP' | 'SOLE_TRADER';
  registrationNumber: string; // CRO Number
  vatNumber?: string;
  vatStatus: 'REGISTERED' | 'NOT_REGISTERED' | 'EXEMPT';
  
  registeredAddress: {
    line1: string;
    line2?: string;
    city: string;
    county: string;
    postcode: string;
    country: string;
  };
  
  contact: {
    primaryEmail: string;
    secondaryEmail?: string;
    primaryPhone: string;
    secondaryPhone?: string;
    website?: string;
  };
  
  financial: {
    authorizedShare?: number;
    issuedShare?: number;
    currency: string;
    bankDetails?: {
      bankName: string;
      accountName: string;
      accountNumber: string;
      sortCode: string;
      iban?: string;
    };
  };
  
  insurance: {
    policyNumber?: string;
    provider?: string;
    expiryDate?: string;
    professionalIndemnity?: number;
    publicLiability?: number;
  };
  
  operational: {
    establishedDate: string;
    yearEnd?: string;
    accountingPeriod?: string;
  };
}

export interface ProjectPhase {
  id: string;
  name: string;
  description: string;
  phaseNumber: number;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
  
  planning: {
    estimatedUnits: number;
    plannedUnits: number;
    estimatedCost: number;
    estimatedRevenue: number;
    estimatedStartDate: string;
    estimatedEndDate: string;
  };
  
  actual: {
    completedUnits: number;
    actualCost: number;
    actualRevenue: number;
    actualStartDate?: string;
    actualEndDate?: string;
  };
  
  progress: {
    completionPercentage: number;
    milestonesCompleted: number;
    totalMilestones: number;
  };
  
  units: string[]; // Unit IDs in this phase
}

export interface UnitData {
  id: string;
  number: string;
  type: 'apartment' | 'house' | 'penthouse' | 'studio' | 'duplex';
  status: 'available' | 'reserved' | 'sold' | 'construction' | 'completed';
  
  physical: {
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    sqm: number;
    floor: number;
    building: string;
    aspect: string; // N, S, E, W, etc.
  };
  
  pricing: {
    basePrice: number;
    currentPrice: number;
    reservationDeposit: number;
    priceHistory: PriceHistoryEntry[];
    lastPriceUpdate: string;
  };
  
  construction: {
    phaseId: string;
    startDate?: string;
    estimatedCompletion: string;
    actualCompletion?: string;
    progressPercentage: number;
  };
  
  sale: {
    buyerId?: string;
    reservationDate?: string;
    saleDate?: string;
    legalStatus: LegalStatus;
    solicitorDetails?: SolicitorDetails;
  };
  
  features: string[];
  amenities: string[];
  images: string[];
  floorPlan?: string;
  
  coordinates?: {
    x: number; // For site plan
    y: number;
  };
}

export interface TransactionData {
  id: string;
  unitId: string;
  buyerId: string;
  type: 'reservation' | 'sale' | 'completion';
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  
  financial: {
    amount: number;
    depositPaid: number;
    mortgageAmount?: number;
    cashAmount: number;
    solicitorFees: number;
    stampDuty: number;
  };
  
  legal: {
    solicitorId: string;
    contractSigned: boolean;
    exchangeDate?: string;
    completionDate?: string;
    keyHandoverDate?: string;
  };
  
  buyer: BuyerDetails;
  timeline: TransactionTimeline;
  documents: string[]; // Document IDs
}

// =============================================================================
// SUPPORTING INTERFACES
// =============================================================================

export interface PriceHistoryEntry {
  price: number;
  date: string;
  reason: string;
  modifiedBy: string;
}

export interface LegalStatus {
  stage: 'initial' | 'contracts_out' | 'contracts_signed' | 'exchange' | 'completion';
  solicitorPackSent: boolean;
  contractSigned: boolean;
  depositPaid: boolean;
  mortgageApproved: boolean;
  exchangeCompleted: boolean;
  completionCompleted: boolean;
}

export interface SolicitorDetails {
  name: string;
  firm: string;
  email: string;
  phone: string;
  reference: string;
}

export interface BuyerDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  financialStatus: 'pre_approved' | 'mortgage_pending' | 'cash_buyer' | 'financing_required';
  solicitor: SolicitorDetails;
  mortgageProvider?: string;
  mortgageAmount?: number;
}

export interface TransactionTimeline {
  reservationDate?: string;
  contractsOutDate?: string;
  contractsSignedDate?: string;
  exchangeDate?: string;
  estimatedCompletionDate?: string;
  actualCompletionDate?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  permissions: string[];
  active: boolean;
}

export interface DocumentData {
  id: string;
  name: string;
  type: 'contract' | 'plan' | 'permit' | 'invoice' | 'legal' | 'marketing';
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
}

export interface MediaData {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  url: string;
  thumbnail?: string;
  unitId?: string;
  tags: string[];
}

export interface ComplianceData {
  planning: {
    approved: boolean;
    conditions: string[];
    complianceChecks: ComplianceCheck[];
  };
  building: {
    permits: BuildingPermit[];
    inspections: BuildingInspection[];
  };
  financial: {
    vatReturns: VATReturn[];
    audit: AuditInfo[];
  };
}

export interface ComplianceCheck {
  id: string;
  type: string;
  status: 'pending' | 'passed' | 'failed';
  checkedBy: string;
  checkedAt: string;
  notes?: string;
}

export interface BuildingPermit {
  id: string;
  type: string;
  status: 'applied' | 'approved' | 'expired';
  validFrom?: string;
  validTo?: string;
}

export interface BuildingInspection {
  id: string;
  type: string;
  status: 'scheduled' | 'passed' | 'failed' | 'remedial_required';
  scheduledDate?: string;
  completedDate?: string;
  inspector: string;
  notes?: string;
}

export interface VATReturn {
  id: string;
  period: string;
  submitted: boolean;
  amount: number;
  submittedDate?: string;
}

export interface AuditInfo {
  id: string;
  type: string;
  auditor: string;
  date: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  findings?: string[];
}

export interface AnalyticsData {
  sales: {
    totalRevenue: number;
    averageUnitPrice: number;
    salesVelocity: number; // units per month
    conversionRate: number; // percentage
    timeToSale: number; // average days
  };
  
  market: {
    comparableProjects: MarketComparable[];
    pricePerSqft: number;
    marketTrend: 'up' | 'down' | 'stable';
    demandLevel: 'high' | 'medium' | 'low';
  };
  
  financial: {
    profitMargin: number;
    roi: number;
    cashFlow: CashFlowEntry[];
    breakEvenDate?: string;
  };
  
  performance: {
    constructionDelay: number; // days
    budgetVariance: number; // percentage
    qualityScore: number; // 0-100
    customerSatisfaction: number; // 0-100
  };
}

export interface MarketComparable {
  projectName: string;
  location: string;
  pricePerSqft: number;
  saleDate: string;
  unitType: string;
}

export interface CashFlowEntry {
  date: string;
  inflow: number;
  outflow: number;
  netFlow: number;
  cumulativeFlow: number;
}

// =============================================================================
// UNIFIED PROJECT SERVICE CLASS
// =============================================================================

export class UnifiedProjectService extends EventEmitter {
  private static instance: UnifiedProjectService;
  private projectData: Map<string, ProjectData> = new Map();
  private isInitialized = false;

  static getInstance(): UnifiedProjectService {
    if (!UnifiedProjectService.instance) {
      UnifiedProjectService.instance = new UnifiedProjectService();
    }
    return UnifiedProjectService.instance;
  }

  private constructor() {
    super();
    this.initializeService();
  }

  private async initializeService() {
    if (this.isInitialized) return;
    
    try {
      // Initialize with Fitzgerald Gardens comprehensive data
      await this.loadFitzgeraldGardensData();
      this.isInitialized = true;
      this.emit('initialized');
      console.log('✅ UnifiedProjectService initialized with comprehensive data');
    } catch (error) {
      console.error('❌ Failed to initialize UnifiedProjectService:', error);
    }
  }

  // =============================================================================
  // DATA INITIALIZATION
  // =============================================================================

  private async loadFitzgeraldGardensData() {
    const fitzgeraldGardens: ProjectData = {
      id: 'fitzgerald-gardens',
      name: 'Fitzgerald Gardens',
      code: 'FG-2025',
      description: 'Premium residential development in Drogheda, Co. Louth featuring modern apartments and houses with stunning views and contemporary design.',
      status: 'ACTIVE',
      
      location: {
        address: 'Fitzgerald Gardens',
        city: 'Drogheda',
        county: 'Louth',
        country: 'Ireland',
        coordinates: { lat: 53.7190, lng: -6.3450 }
      },
      
      planning: {
        reference: 'DCC-2024/FG001',
        status: 'APPROVED',
        submittedDate: '2023-06-15',
        approvedDate: '2024-01-10',
        conditions: [
          'Traffic management plan implementation',
          'Landscaping as per approved drawings',
          'Surface water drainage system'
        ]
      },
      
      timeline: {
        estimatedStartDate: '2024-01-15',
        estimatedEndDate: '2026-12-31',
        actualStartDate: '2024-02-01',
        overallProgress: 68,
        currentPhase: 'Phase 2a - Main Block'
      },
      
      finances: {
        totalEstimatedCost: 45000000,
        totalActualCost: 30800000,
        totalEstimatedRevenue: 56500000,
        totalActualRevenue: 38200000,
        currency: 'EUR',
        profitMargin: 20.4,
        roi: 25.6
      },
      
      company: {
        id: 'comp-001',
        name: 'Fitzgerald Developments Ltd',
        companyType: 'LIMITED_COMPANY',
        registrationNumber: '654321',
        vatNumber: 'IE9876543C',
        vatStatus: 'REGISTERED',
        
        registeredAddress: {
          line1: '123 Development Drive',
          line2: 'Industrial Estate',
          city: 'Drogheda',
          county: 'Louth',
          postcode: 'A92 X234',
          country: 'Ireland'
        },
        
        contact: {
          primaryEmail: 'info@fitzgeralddevelopments.ie',
          primaryPhone: '+353 41 123 4567',
          website: 'https://fitzgeralddevelopments.ie'
        },
        
        financial: {
          authorizedShare: 1000000,
          issuedShare: 500000,
          currency: 'EUR',
          bankDetails: {
            bankName: 'Bank of Ireland',
            accountName: 'Fitzgerald Developments Ltd',
            accountNumber: '12345678',
            sortCode: '90-11-46',
            iban: 'IE29 BOFI 9011 4612 3456 78'
          }
        },
        
        insurance: {
          policyNumber: 'PI-2024-FD001',
          provider: 'Allianz Ireland',
          expiryDate: '2025-12-31',
          professionalIndemnity: 10000000,
          publicLiability: 5000000
        },
        
        operational: {
          establishedDate: '2015-03-15',
          yearEnd: '2024-12-31',
          accountingPeriod: 'Annual'
        }
      },
      
      phases: [
        {
          id: 'phase-1',
          name: 'Phase 1 - Foundation',
          description: 'Initial 43 units including site preparation and infrastructure',
          phaseNumber: 1,
          status: 'COMPLETED',
          
          planning: {
            estimatedUnits: 43,
            plannedUnits: 43,
            estimatedCost: 18000000,
            estimatedRevenue: 22000000,
            estimatedStartDate: '2024-02-01',
            estimatedEndDate: '2025-08-31'
          },
          
          actual: {
            completedUnits: 43,
            actualCost: 17800000,
            actualRevenue: 22300000,
            actualStartDate: '2024-02-01',
            actualEndDate: '2025-08-15'
          },
          
          progress: {
            completionPercentage: 100,
            milestonesCompleted: 8,
            totalMilestones: 8
          },
          
          units: [] // Will be populated with unit IDs
        },
        
        {
          id: 'phase-2a',
          name: 'Phase 2a - Main Block',
          description: 'Central apartment block with 35 units',
          phaseNumber: 2,
          status: 'IN_PROGRESS',
          
          planning: {
            estimatedUnits: 35,
            plannedUnits: 35,
            estimatedCost: 15000000,
            estimatedRevenue: 18500000,
            estimatedStartDate: '2025-03-01',
            estimatedEndDate: '2026-06-30'
          },
          
          actual: {
            completedUnits: 22,
            actualCost: 12000000,
            actualRevenue: 14200000,
            actualStartDate: '2025-03-15'
          },
          
          progress: {
            completionPercentage: 65,
            milestonesCompleted: 5,
            totalMilestones: 8
          },
          
          units: [] // Will be populated with unit IDs
        },
        
        {
          id: 'phase-2b',
          name: 'Phase 2b - Premium Units',
          description: 'Premium penthouse and duplex units',
          phaseNumber: 3,
          status: 'PLANNED',
          
          planning: {
            estimatedUnits: 18,
            plannedUnits: 18,
            estimatedCost: 12000000,
            estimatedRevenue: 16000000,
            estimatedStartDate: '2026-01-01',
            estimatedEndDate: '2026-12-31'
          },
          
          actual: {
            completedUnits: 0,
            actualCost: 0,
            actualRevenue: 0
          },
          
          progress: {
            completionPercentage: 0,
            milestonesCompleted: 0,
            totalMilestones: 8
          },
          
          units: [] // Will be populated with unit IDs
        }
      ],
      
      units: [], // Will be generated
      team: [], // Will be populated
      transactions: [], // Will be populated
      documents: [], // Will be populated
      media: [], // Will be populated
      compliance: {
        planning: {
          approved: true,
          conditions: [],
          complianceChecks: []
        },
        building: {
          permits: [],
          inspections: []
        },
        financial: {
          vatReturns: [],
          audit: []
        }
      },
      
      analytics: {
        sales: {
          totalRevenue: 38200000,
          averageUnitPrice: 587692,
          salesVelocity: 4.2,
          conversionRate: 67.7,
          timeToSale: 21
        },
        
        market: {
          comparableProjects: [],
          pricePerSqft: 450,
          marketTrend: 'up',
          demandLevel: 'high'
        },
        
        financial: {
          profitMargin: 20.4,
          roi: 25.6,
          cashFlow: [],
          breakEvenDate: '2025-11-15'
        },
        
        performance: {
          constructionDelay: 5,
          budgetVariance: -1.1,
          qualityScore: 94,
          customerSatisfaction: 92
        }
      },
      
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
      lastModifiedBy: 'system'
    };

    // Generate comprehensive unit data
    fitzgeraldGardens.units = this.generateComprehensiveUnitData();
    
    // Generate realistic transaction data
    fitzgeraldGardens.transactions = this.generateTransactionData(fitzgeraldGardens.units);
    
    // Assign units to phases
    fitzgeraldGardens.phases[0].units = fitzgeraldGardens.units
      .filter(unit => unit.construction.phaseId === 'phase-1')
      .map(unit => unit.id);
    
    fitzgeraldGardens.phases[1].units = fitzgeraldGardens.units
      .filter(unit => unit.construction.phaseId === 'phase-2a')
      .map(unit => unit.id);
    
    fitzgeraldGardens.phases[2].units = fitzgeraldGardens.units
      .filter(unit => unit.construction.phaseId === 'phase-2b')
      .map(unit => unit.id);

    this.projectData.set('fitzgerald-gardens', fitzgeraldGardens);
  }

  private generateComprehensiveUnitData(): UnitData[] {
    const units: UnitData[] = [];
    
    // Phase 1 - Foundation (43 units) - Mix of houses and apartments
    for (let i = 1; i <= 43; i++) {
      const isHouse = i <= 15; // First 15 are houses
      const unitType = isHouse ? 'house' : (i > 40 ? 'penthouse' : 'apartment');
      const beds = isHouse ? (i % 3 === 0 ? 4 : 3) : (unitType === 'penthouse' ? 3 : (i % 2 === 0 ? 2 : 1));
      const sqft = isHouse ? 1200 + (beds * 150) : (unitType === 'penthouse' ? 1100 : 650 + (beds * 100));
      const basePrice = isHouse ? 420000 + (beds * 25000) : (unitType === 'penthouse' ? 580000 : 325000 + (beds * 35000));
      
      units.push({
        id: `unit-fg-${i.toString().padStart(3, '0')}`,
        number: i.toString(),
        type: unitType as any,
        status: i <= 43 ? 'sold' : 'available',
        
        physical: {
          bedrooms: beds,
          bathrooms: isHouse ? beds - 1 : (beds === 1 ? 1 : beds - 1),
          sqft: sqft,
          sqm: Math.round(sqft * 0.092903),
          floor: isHouse ? 0 : Math.floor((i - 16) / 8) + 1,
          building: isHouse ? 'House Block' : 'Apartment Block A',
          aspect: ['N', 'S', 'E', 'W', 'SE', 'SW', 'NE', 'NW'][i % 8]
        },
        
        pricing: {
          basePrice: basePrice,
          currentPrice: basePrice + (Math.random() * 20000 - 10000), // Market variation
          reservationDeposit: Math.round(basePrice * 0.1),
          priceHistory: [
            {
              price: basePrice,
              date: '2024-02-01',
              reason: 'Initial pricing',
              modifiedBy: 'system'
            }
          ],
          lastPriceUpdate: '2024-02-01'
        },
        
        construction: {
          phaseId: 'phase-1',
          startDate: '2024-02-01',
          estimatedCompletion: '2025-08-31',
          actualCompletion: '2025-08-15',
          progressPercentage: 100
        },
        
        sale: {
          buyerId: i <= 43 ? `buyer-${i}` : undefined,
          reservationDate: i <= 43 ? `2024-${(i % 12 + 1).toString().padStart(2, '0')}-${(i % 28 + 1).toString().padStart(2, '0')}` : undefined,
          saleDate: i <= 43 ? `2024-${(i % 12 + 1).toString().padStart(2, '0')}-${(i % 28 + 1).toString().padStart(2, '0')}` : undefined,
          legalStatus: {
            stage: i <= 43 ? 'completion' : 'initial',
            solicitorPackSent: i <= 43,
            contractSigned: i <= 43,
            depositPaid: i <= 43,
            mortgageApproved: i <= 43,
            exchangeCompleted: i <= 43,
            completionCompleted: i <= 43
          }
        },
        
        features: [
          'Energy A-rated',
          'Double glazing',
          'Hardwood floors',
          isHouse ? 'Private garden' : 'Balcony',
          'Secure parking',
          'High-spec kitchen'
        ],
        
        amenities: [
          'Landscaped grounds',
          'Secure access',
          'Waste management',
          'Maintenance service'
        ],
        
        images: [`/images/units/fg-${i}.jpg`],
        floorPlan: `/plans/fg-${unitType}-${beds}bed.pdf`,
        
        coordinates: {
          x: isHouse ? (i % 5) * 60 + 50 : ((i - 16) % 8) * 40 + 100,
          y: isHouse ? Math.floor((i - 1) / 5) * 80 + 100 : Math.floor((i - 16) / 8) * 60 + 300
        }
      });
    }
    
    // Phase 2a - Main Block (35 units) - Apartments
    for (let i = 44; i <= 78; i++) {
      const unitNumber = i - 43;
      const beds = unitNumber % 3 === 0 ? 3 : (unitNumber % 2 === 0 ? 2 : 1);
      const sqft = 650 + (beds * 120);
      const basePrice = 340000 + (beds * 40000);
      const isCompleted = unitNumber <= 22;
      const isSold = unitNumber <= 15;
      const isReserved = unitNumber > 15 && unitNumber <= 22;
      
      units.push({
        id: `unit-fg-${i.toString().padStart(3, '0')}`,
        number: i.toString(),
        type: 'apartment',
        status: isSold ? 'sold' : (isReserved ? 'reserved' : (isCompleted ? 'available' : 'construction')),
        
        physical: {
          bedrooms: beds,
          bathrooms: beds === 1 ? 1 : beds - 1,
          sqft: sqft,
          sqm: Math.round(sqft * 0.092903),
          floor: Math.floor((unitNumber - 1) / 7) + 1,
          building: 'Apartment Block B',
          aspect: ['N', 'S', 'E', 'W', 'SE', 'SW', 'NE'][unitNumber % 7]
        },
        
        pricing: {
          basePrice: basePrice,
          currentPrice: basePrice + (Math.random() * 15000 - 7500),
          reservationDeposit: Math.round(basePrice * 0.1),
          priceHistory: [
            {
              price: basePrice,
              date: '2025-03-01',
              reason: 'Phase 2a pricing',
              modifiedBy: 'system'
            }
          ],
          lastPriceUpdate: '2025-03-01'
        },
        
        construction: {
          phaseId: 'phase-2a',
          startDate: '2025-03-15',
          estimatedCompletion: '2026-06-30',
          progressPercentage: isCompleted ? 100 : (unitNumber <= 30 ? 65 : 40)
        },
        
        sale: {
          buyerId: isSold ? `buyer-${i}` : undefined,
          reservationDate: (isSold || isReserved) ? `2025-${(unitNumber % 12 + 1).toString().padStart(2, '0')}-${(unitNumber % 28 + 1).toString().padStart(2, '0')}` : undefined,
          saleDate: isSold ? `2025-${(unitNumber % 12 + 1).toString().padStart(2, '0')}-${(unitNumber % 28 + 1).toString().padStart(2, '0')}` : undefined,
          legalStatus: {
            stage: isSold ? 'exchange' : (isReserved ? 'contracts_signed' : 'initial'),
            solicitorPackSent: isSold || isReserved,
            contractSigned: isSold || isReserved,
            depositPaid: isSold || isReserved,
            mortgageApproved: isSold,
            exchangeCompleted: isSold,
            completionCompleted: false
          }
        },
        
        features: [
          'Energy A+ rated',
          'Triple glazing',
          'Hardwood floors',
          'Private balcony',
          'Secure parking',
          'Premium kitchen',
          'Smart home features'
        ],
        
        amenities: [
          'Landscaped grounds',
          'Secure access',
          'Concierge service',
          'Gym facilities',
          'Waste management'
        ],
        
        images: [`/images/units/fg-${i}.jpg`],
        floorPlan: `/plans/fg-apartment-${beds}bed.pdf`,
        
        coordinates: {
          x: ((unitNumber - 1) % 7) * 45 + 200,
          y: Math.floor((unitNumber - 1) / 7) * 50 + 150
        }
      });
    }
    
    // Phase 2b - Premium Units (18 units) - Penthouses and Duplexes
    for (let i = 79; i <= 96; i++) {
      const unitNumber = i - 78;
      const isDuplex = unitNumber <= 8;
      const unitType = isDuplex ? 'duplex' : 'penthouse';
      const beds = isDuplex ? 4 : 3;
      const sqft = isDuplex ? 1400 : 1200;
      const basePrice = isDuplex ? 680000 : 620000;
      
      units.push({
        id: `unit-fg-${i.toString().padStart(3, '0')}`,
        number: i.toString(),
        type: unitType as any,
        status: 'available',
        
        physical: {
          bedrooms: beds,
          bathrooms: beds - 1,
          sqft: sqft,
          sqm: Math.round(sqft * 0.092903),
          floor: isDuplex ? 4 : 5, // Top floors
          building: 'Premium Block C',
          aspect: ['S', 'SW', 'SE', 'W', 'E'][unitNumber % 5] // Premium aspects
        },
        
        pricing: {
          basePrice: basePrice,
          currentPrice: basePrice,
          reservationDeposit: Math.round(basePrice * 0.15), // Higher deposit for premium
          priceHistory: [
            {
              price: basePrice,
              date: '2026-01-01',
              reason: 'Premium phase pricing',
              modifiedBy: 'system'
            }
          ],
          lastPriceUpdate: '2026-01-01'
        },
        
        construction: {
          phaseId: 'phase-2b',
          estimatedCompletion: '2026-12-31',
          progressPercentage: 0
        },
        
        sale: {
          legalStatus: {
            stage: 'initial',
            solicitorPackSent: false,
            contractSigned: false,
            depositPaid: false,
            mortgageApproved: false,
            exchangeCompleted: false,
            completionCompleted: false
          }
        },
        
        features: [
          'Energy A++ rated',
          'Floor-to-ceiling windows',
          'Premium hardwood floors',
          isDuplex ? 'Private terrace' : 'Large balcony with panoramic views',
          'Secure underground parking',
          'Designer kitchen',
          'Smart home automation',
          'Premium bathroom fittings',
          isDuplex ? 'Private entrance' : 'Private lift access'
        ],
        
        amenities: [
          'Landscaped grounds',
          'Secure access',
          'Concierge service',
          'Gym facilities',
          'Residents lounge',
          'Roof garden',
          'Waste management',
          'Electric car charging'
        ],
        
        images: [`/images/units/fg-${i}.jpg`],
        floorPlan: `/plans/fg-${unitType}-${beds}bed.pdf`,
        
        coordinates: {
          x: ((unitNumber - 1) % 6) * 60 + 150,
          y: Math.floor((unitNumber - 1) / 6) * 70 + 100
        }
      });
    }
    
    return units;
  }

  private generateTransactionData(units: UnitData[]): TransactionData[] {
    const transactions: TransactionData[] = [];
    
    // Generate transactions for sold and reserved units
    const soldAndReservedUnits = units.filter(unit => 
      unit.status === 'sold' || unit.status === 'reserved'
    );
    
    soldAndReservedUnits.forEach((unit, index) => {
      const isSold = unit.status === 'sold';
      const reservationDate = unit.sale.reservationDate || `2024-${(index % 12 + 1).toString().padStart(2, '0')}-${(index % 28 + 1).toString().padStart(2, '0')}`;
      
      // Generate realistic buyer details
      const buyerNames = [
        'John and Mary O\'Connor', 'Sarah Murphy', 'David Kelly', 'Emma and Tom Walsh', 
        'Michael Ryan', 'Lisa O\'Brien', 'James and Claire McCarthy', 'Anna Doyle',
        'Patrick and Niamh Byrne', 'Catherine O\'Sullivan', 'Robert and Michelle Collins',
        'Amanda Brennan', 'Sean and Caroline Kennedy', 'Jennifer Lynch', 'Mark O\'Reilly',
        'Sophie and Daniel Murray', 'Paul and Rachel Fitzgerald', 'Grace O\'Mahony',
        'Kevin and Laura Butler', 'Sinead Martin', 'Anthony and Helen Gallagher'
      ];
      
      const solicitorFirms = [
        { name: 'O\'Brien & Associates', email: 'info@obrienlaw.ie', phone: '+353 1 234 5678' },
        { name: 'Murphy Legal Services', email: 'contact@murphylaw.ie', phone: '+353 1 345 6789' },
        { name: 'Kelly & Partners', email: 'office@kellypartners.ie', phone: '+353 1 456 7890' },
        { name: 'Walsh Solicitors', email: 'reception@walshsol.ie', phone: '+353 1 567 8901' },
        { name: 'Ryan & Co Law', email: 'info@ryanlaw.ie', phone: '+353 1 678 9012' }
      ];
      
      const buyerName = buyerNames[index % buyerNames.length];
      const solicitor = solicitorFirms[index % solicitorFirms.length];
      const hasMultipleBuyers = buyerName.includes(' and ');
      
      // Calculate financial details
      const purchaseAmount = unit.pricing.currentPrice;
      const mortgagePercentage = Math.random() < 0.3 ? 0 : (0.7 + Math.random() * 0.2); // 30% cash buyers
      const mortgageAmount = Math.round(purchaseAmount * mortgagePercentage);
      const cashAmount = purchaseAmount - mortgageAmount;
      const depositPercentage = isSold ? 0.1 : 0.05; // 10% for sold, 5% for reserved
      const depositPaid = Math.round(purchaseAmount * depositPercentage);
      const solicitorFees = 2500 + Math.round(purchaseAmount * 0.001); // Base fee + percentage
      const stampDuty = purchaseAmount > 500000 ? Math.round(purchaseAmount * 0.02) : 0; // 2% for over €500k
      
      // Generate timeline based on status
      const reservationDateObj = new Date(reservationDate);
      const contractsOutDate = new Date(reservationDateObj);
      contractsOutDate.setDate(contractsOutDate.getDate() + 14);
      
      const contractsSignedDate = new Date(contractsOutDate);
      contractsSignedDate.setDate(contractsSignedDate.getDate() + 21);
      
      const exchangeDate = new Date(contractsSignedDate);
      exchangeDate.setDate(exchangeDate.getDate() + 7);
      
      const estimatedCompletionDate = new Date(unit.construction.estimatedCompletion);
      const actualCompletionDate = isSold ? new Date(exchangeDate) : undefined;
      if (actualCompletionDate) {
        actualCompletionDate.setDate(actualCompletionDate.getDate() + 60);
      }
      
      const keyHandoverDate = actualCompletionDate ? new Date(actualCompletionDate) : undefined;
      if (keyHandoverDate) {
        keyHandoverDate.setDate(keyHandoverDate.getDate() + 1);
      }
      
      transactions.push({
        id: `txn-fg-${(index + 1).toString().padStart(3, '0')}`,
        unitId: unit.id,
        buyerId: `buyer-fg-${(index + 1).toString().padStart(3, '0')}`,
        type: 'sale',
        status: isSold ? 'completed' : 'active',
        
        financial: {
          amount: purchaseAmount,
          depositPaid: depositPaid,
          mortgageAmount: mortgageAmount > 0 ? mortgageAmount : undefined,
          cashAmount: cashAmount,
          solicitorFees: solicitorFees,
          stampDuty: stampDuty
        },
        
        legal: {
          solicitorId: `sol-${index % solicitorFirms.length + 1}`,
          contractSigned: isSold || (unit.status === 'reserved' && Math.random() < 0.7),
          exchangeDate: isSold ? exchangeDate.toISOString() : undefined,
          completionDate: actualCompletionDate?.toISOString(),
          keyHandoverDate: keyHandoverDate?.toISOString()
        },
        
        buyer: {
          id: `buyer-fg-${(index + 1).toString().padStart(3, '0')}`,
          name: buyerName,
          email: `${buyerName.split(' ')[0].toLowerCase()}@email.ie`,
          phone: `+353 ${80 + index % 20} ${Math.floor(Math.random() * 9999999).toString().padStart(7, '0')}`,
          address: `${Math.floor(Math.random() * 999) + 1} ${['Main Street', 'High Street', 'Church Road', 'Park Avenue', 'Mill Lane'][index % 5]}, ${['Dublin', 'Cork', 'Galway', 'Limerick', 'Waterford'][index % 5]}`,
          financialStatus: mortgageAmount > 0 ? 'pre_approved' : 'cash_buyer',
          solicitor: {
            name: solicitor.name,
            firm: solicitor.name,
            email: solicitor.email,
            phone: solicitor.phone,
            reference: `REF-${(index + 1).toString().padStart(4, '0')}`
          },
          mortgageProvider: mortgageAmount > 0 ? ['AIB', 'Bank of Ireland', 'Permanent TSB', 'Ulster Bank', 'KBC'][index % 5] : undefined,
          mortgageAmount: mortgageAmount > 0 ? mortgageAmount : undefined
        },
        
        timeline: {
          reservationDate: reservationDate,
          contractsOutDate: contractsOutDate.toISOString(),
          contractsSignedDate: isSold || (unit.status === 'reserved' && Math.random() < 0.7) ? contractsSignedDate.toISOString() : undefined,
          exchangeDate: isSold ? exchangeDate.toISOString() : undefined,
          estimatedCompletionDate: estimatedCompletionDate.toISOString(),
          actualCompletionDate: actualCompletionDate?.toISOString()
        },
        
        documents: [
          'booking_form.pdf',
          'deposit_receipt.pdf',
          'solicitor_appointment.pdf',
          isSold ? 'sale_contract.pdf' : undefined,
          isSold ? 'signed_contract.pdf' : undefined,
          isSold ? 'exchange_confirmation.pdf' : undefined,
          isSold ? 'completion_statement.pdf' : undefined,
          isSold ? 'handover_certificate.pdf' : undefined
        ].filter(Boolean) as string[]
      });
    });
    
    return transactions;
  }

  // =============================================================================
  // PUBLIC API METHODS
  // =============================================================================

  async getProject(projectId: string): Promise<ProjectData | null> {
    if (!this.isInitialized) {
      await this.initializeService();
    }
    return this.projectData.get(projectId) || null;
  }

  async updateProject(projectId: string, updates: Partial<ProjectData>): Promise<boolean> {
    try {
      const project = this.projectData.get(projectId);
      if (!project) return false;

      const updatedProject = {
        ...project,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      this.projectData.set(projectId, updatedProject);
      this.emit('projectUpdated', { projectId, updates });
      return true;
    } catch (error) {
      console.error('Failed to update project:', error);
      return false;
    }
  }

  async getUnits(projectId: string, filters?: any): Promise<UnitData[]> {
    const project = await this.getProject(projectId);
    if (!project) return [];

    let units = project.units;

    // Apply filters if provided
    if (filters) {
      if (filters.status && filters.status !== 'all') {
        units = units.filter(unit => unit.status === filters.status);
      }
      if (filters.type && filters.type !== 'all') {
        units = units.filter(unit => unit.type === filters.type);
      }
      if (filters.phaseId) {
        units = units.filter(unit => unit.construction.phaseId === filters.phaseId);
      }
    }

    return units;
  }

  async updateUnit(projectId: string, unitId: string, updates: Partial<UnitData>): Promise<boolean> {
    try {
      const project = this.projectData.get(projectId);
      if (!project) return false;

      const unitIndex = project.units.findIndex(unit => unit.id === unitId);
      if (unitIndex === -1) return false;

      project.units[unitIndex] = {
        ...project.units[unitIndex],
        ...updates
      };

      project.updatedAt = new Date().toISOString();
      this.projectData.set(projectId, project);
      this.emit('unitUpdated', { projectId, unitId, updates });
      return true;
    } catch (error) {
      console.error('Failed to update unit:', error);
      return false;
    }
  }

  async getAnalytics(projectId: string): Promise<AnalyticsData | null> {
    const project = await this.getProject(projectId);
    if (!project) return null;

    // Recalculate real-time analytics
    const soldUnits = project.units.filter(unit => unit.status === 'sold');
    const reservedUnits = project.units.filter(unit => unit.status === 'reserved');
    const totalRevenue = soldUnits.reduce((sum, unit) => sum + unit.pricing.currentPrice, 0);
    const averagePrice = soldUnits.length > 0 ? totalRevenue / soldUnits.length : 0;

    return {
      ...project.analytics,
      sales: {
        ...project.analytics.sales,
        totalRevenue,
        averageUnitPrice: averagePrice,
        conversionRate: project.units.length > 0 ? (soldUnits.length / project.units.length) * 100 : 0
      }
    };
  }

  // =============================================================================
  // EVENT MANAGEMENT
  // =============================================================================

  onProjectUpdate(callback: (data: any) => void) {
    this.on('projectUpdated', callback);
  }

  onUnitUpdate(callback: (data: any) => void) {
    this.on('unitUpdated', callback);
  }

  removeAllListeners() {
    super.removeAllListeners();
  }
}

// Export singleton instance
export const unifiedProjectService = UnifiedProjectService.getInstance();