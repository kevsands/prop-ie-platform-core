/**
 * Enterprise Project Data Service
 * Centralized data management with real-time synchronization
 * 
 * @fileoverview Unified data service for all project and unit operations
 * @version 2.0.0
 * @author Property Development Platform Team
 */

import { 
  Unit, 
  Project, 
  TeamMember,
  Invoice,
  FeeProposal,
  ProfessionalAppointment,
  UnitStatus, 
  UnitType,
  ProjectMetrics,
  UnitTypeBreakdown,
  UnitUpdateEvent,
  ProjectStateUpdate,
  BuyerInformation,
  LegalPack,
  UnitFeatures,
  UnitLocation,
  UnitPricing
} from '@/types/project';
import { realDataService } from '@/services/RealDataService';
import { fitzgeraldGardensConfig } from '@/data/fitzgerald-gardens-config';

// =============================================================================
// ENTERPRISE DATA SERVICE CLASS
// =============================================================================

export class ProjectDataService {
  private static instance: ProjectDataService;
  private projects: Map<string, Project> = new Map();
  private eventListeners: Map<string, Array<(event: ProjectStateUpdate) => void>> = new Map();
  private auditLog: Array<ProjectStateUpdate> = [];

  private constructor() {
    // Singleton pattern for enterprise data consistency
  }

  public static getInstance(): ProjectDataService {
    if (!ProjectDataService.instance) {
      ProjectDataService.instance = new ProjectDataService();
    }
    return ProjectDataService.instance;
  }

  // =============================================================================
  // PROJECT INITIALIZATION AND MANAGEMENT
  // =============================================================================

  /**
   * Initialize Fitzgerald Gardens project with REAL DATA
   * Uses actual project configuration and real data service
   */
  public initializeFitzgeraldGardens(): Project {
    const projectId = 'fitzgerald-gardens';
    const config = fitzgeraldGardensConfig;
    
    // Generate units from REAL configuration data
    const units = realDataService.generateRealFitzgeraldGardensUnits();
    
    // Calculate metrics from actual unit data
    const metrics = this.calculateProjectMetrics(units);
    
    // Generate unit type breakdown from actual units
    const unitBreakdown = this.calculateUnitTypeBreakdown(units);
    
    // Get real project timeline
    const realTimeline = realDataService.getRealProjectTimeline();
    
    const project: Project = {
      id: projectId,
      name: config.projectName,
      location: config.location,
      description: `${config.description} - LIVE PROJECT: ${config.availableForSale} units currently available for sale out of ${config.totalUnits} total units.`,
      metrics,
      unitBreakdown,
      timeline: {
        projectStart: realTimeline.projectStart,
        plannedCompletion: realTimeline.estimatedCompletion,
        currentPhase: realTimeline.currentPhase,
        progressPercentage: realTimeline.progressPercentage,
        milestones: [
          { id: 'milestone-1', name: 'Planning Permission', date: new Date('2024-01-15'), completed: true, critical: true },
          { id: 'milestone-2', name: 'Site Preparation', date: realTimeline.projectStart, completed: true, critical: true },
          { id: 'milestone-3', name: 'Foundation Work', date: new Date('2024-04-15'), completed: true, critical: true },
          { id: 'milestone-4', name: realTimeline.nextMilestone.name, date: realTimeline.nextMilestone.date, completed: false, critical: true },
          { id: 'milestone-5', name: 'Building Envelope', date: new Date('2024-10-15'), completed: false, critical: false },
          { id: 'milestone-6', name: 'Interior Fit-out', date: new Date('2025-03-01'), completed: false, critical: false },
          { id: 'milestone-7', name: 'Final Inspections', date: new Date('2025-07-01'), completed: false, critical: true },
          { id: 'milestone-8', name: 'Project Completion', date: realTimeline.estimatedCompletion, completed: false, critical: true }
        ]
      },
      units,
      lastUpdated: new Date(),
      createdAt: new Date(config.projectStartDate)
    };

    this.projects.set(projectId, project);
    return project;
  }

  // =============================================================================
  // UNIT GENERATION AND MANAGEMENT
  // =============================================================================

  /**
   * Generate Fitzgerald Gardens units using REAL data service
   * Delegates to realDataService for actual project configuration
   */
  private generateFitzgeraldGardensUnits(): ReadonlyArray<Unit> {
    // Use real data service for unit generation
    return realDataService.generateRealFitzgeraldGardensUnits();
  }

  // =============================================================================
  // BUYER PORTAL INTEGRATION METHODS
  // =============================================================================

  /**
   * Update unit buyer information - used when buyer reserves a unit
   */
  public async updateUnitBuyer(
    projectId: string,
    unitId: string,
    buyerInfo: BuyerInformation
  ): Promise<boolean> {
    try {
      const project = this.projects.get(projectId);
      if (!project) return false;

      const unitIndex = project.units.findIndex(unit => unit.id === unitId);
      if (unitIndex === -1) return false;

      // Update the unit with buyer information
      const updatedUnit = {
        ...project.units[unitIndex],
        buyer: buyerInfo,
        legalPack: {
          ...project.units[unitIndex].legalPack,
          lastUpdated: new Date()
        },
        lastUpdated: new Date()
      };

      // Update the project's units array
      const updatedUnits = [...project.units];
      updatedUnits[unitIndex] = updatedUnit;

      const updatedProject = {
        ...project,
        units: updatedUnits,
        lastUpdated: new Date()
      };

      this.projects.set(projectId, updatedProject);
      
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Broadcast state update to all listeners
   */
  public broadcastStateUpdate(update: ProjectStateUpdate): void {
    try {
      // Add to audit log
      this.auditLog.push(update);

      // Notify all listeners for this project
      const listeners = this.eventListeners.get(update.projectId) || [];
      listeners.forEach(listener => {
        try {
          listener(update);
        } catch (error) {
        }
      });

    } catch (error) {
    }
  }

  /**
   * Get unit by ID
   */
  public getUnitById(projectId: string, unitId: string): Unit | null {
    try {
      const project = this.projects.get(projectId);
      if (!project) return null;

      return project.units.find(unit => unit.id === unitId) || null;
    } catch (error) {
      return null;
    }
  }
  
  /**
   * Legacy unit generation method - kept for reference
   * REPLACED by real data service integration above
   */
  private generateFitzgeraldGardensUnitsLegacy(): ReadonlyArray<Unit> {
    const units: Unit[] = [];
    let unitCounter = 1;

    // PHASE 1 CONFIGURATION - Only 15 units for public sale
    const phase1Config = [
      { type: '1 Bed Apartment' as UnitType, count: 5, basePrice: 285000, sqftBase: 650 },
      { type: '2 Bed Apartment' as UnitType, count: 7, basePrice: 340000, sqftBase: 850 },
      { type: '3 Bed House' as UnitType, count: 3, basePrice: 425000, sqftBase: 1200 }
    ];

    // ACTUAL STATUS: All 15 units available for sale (LIVE PRODUCTION)
    let availableUnits = 15;

    phase1Config.forEach((config, typeIndex) => {
      for (let i = 0; i < config.count; i++) {
        // ALL UNITS AVAILABLE FOR SALE - Phase 1 Launch
        let status: UnitStatus = 'available';

        // Generate realistic positioning for site plan
        const building = Math.floor((unitCounter - 1) / 24) + 1;
        const unitInBuilding = ((unitCounter - 1) % 24) + 1;
        const floor = Math.floor((unitInBuilding - 1) / 6) + 1;
        
        // Calculate cluster positioning for site plan
        const clusterX = (typeIndex % 2) * 40 + 20;
        const clusterY = Math.floor(typeIndex / 2) * 30 + 20;
        const offsetX = (i % 6) * 8;
        const offsetY = Math.floor(i / 6) * 12;
        
        // Generate realistic pricing with market variations
        const priceVariation = (Math.random() - 0.5) * 50000; // ±25k variation
        const currentPrice = config.basePrice + priceVariation;
        
        // Generate unit features based on type
        const features = this.generateUnitFeatures(config.type);
        
        // Generate buyer information for sold/reserved units
        const buyer = (status !== 'available') ? this.generateBuyerInformation() : null;
        
        const unit: Unit = {
          id: `unit-${unitCounter.toString().padStart(3, '0')}`,
          number: unitCounter.toString().padStart(3, '0'),
          type: config.type,
          status,
          pricing: {
            basePrice: config.basePrice,
            currentPrice,
            priceHistory: [
              {
                price: currentPrice,
                date: new Date('2024-01-01'),
                reason: 'Initial pricing'
              }
            ],
            htbEligible: currentPrice <= 400000, // Help-to-Buy threshold
            htbAmount: currentPrice <= 400000 ? Math.min(currentPrice * 0.2, 80000) : undefined
          },
          features: {
            bedrooms: config.type.includes('1 Bed') ? 1 : 
                     config.type.includes('2 Bed') ? 2 :
                     config.type.includes('3 Bed') ? 3 : 4,
            bathrooms: config.type.includes('1 Bed') ? 1 : 
                      config.type.includes('2 Bed') ? 2 :
                      config.type.includes('3 Bed') ? 2 : 3,
            sqft: config.sqftBase + Math.floor(Math.random() * 200) - 100, // ±100 sqft variation
            floor,
            building,
            hasBalcony: config.type.includes('Apartment') ? Math.random() > 0.3 : true,
            hasGarden: config.type.includes('House'),
            parkingSpaces: config.type.includes('House') ? Math.random() > 0.5 ? 2 : 1 : 1,
            features,
            amenities: [
              'Landscaped gardens',
              'Children\'s playground', 
              'Secure parking',
              'Concierge service',
              'Gym facilities',
              'Residents\' lounge',
              'Bike storage',
              'Electric car charging'
            ]
          },
          location: {
            x: Math.max(15, Math.min(85, clusterX + offsetX + (Math.random() - 0.5) * 5)),
            y: Math.max(15, Math.min(85, clusterY + offsetY + (Math.random() - 0.5) * 5)),
            building,
            floor,
            unitNumber: unitCounter.toString().padStart(3, '0')
          },
          buyer,
          legalPack: {
            solicitorPackSent: status !== 'available',
            contractSigned: status === 'sold',
            depositPaid: status === 'sold',
            mortgageApproved: status === 'sold' ? Math.random() > 0.2 : false,
            completionDate: status === 'sold' ? 
              new Date(2025, Math.floor(Math.random() * 8) + 4, Math.floor(Math.random() * 28) + 1) : null,
            legalNotes: status === 'sold' ? 'Contract signed and deposit received' : 
                       status === 'reserved' ? 'Reservation agreement in place' : undefined,
            lastUpdated: new Date()
          },
          statusHistory: [
            {
              status,
              date: new Date('2024-01-01'),
              reason: 'Initial status',
              updatedBy: 'System'
            }
          ],
          lastUpdated: new Date(),
          createdAt: new Date('2024-01-01')
        };

        units.push(unit);
        unitCounter++;
      }
    });

    return units;
  }

  /**
   * Generate realistic unit features based on type
   */
  private generateUnitFeatures(unitType: UnitType): ReadonlyArray<string> {
    const allFeatures = [
      'Hardwood flooring',
      'Granite countertops', 
      'Stainless steel appliances',
      'Walk-in closet',
      'En-suite bathroom',
      'Balcony/Terrace',
      'Built-in wardrobes',
      'Smart home system',
      'Underfloor heating',
      'Double glazed windows',
      'Security system',
      'Storage unit',
      'High ceilings',
      'Modern kitchen',
      'Energy efficient lighting',
      'Air conditioning'
    ];

    const featureCount = unitType.includes('1 Bed') ? 6 :
                        unitType.includes('2 Bed') ? 8 :
                        unitType.includes('3 Bed') ? 10 : 12;

    return allFeatures
      .sort(() => Math.random() - 0.5)
      .slice(0, featureCount);
  }

  /**
   * Generate realistic buyer information
   */
  private generateBuyerInformation(): BuyerInformation {
    const firstNames = ['James', 'Mary', 'Michael', 'Patricia', 'Robert', 'Jennifer', 'William', 'Linda', 'David', 'Elizabeth'];
    const lastNames = ['O\'Brien', 'Murphy', 'Kelly', 'O\'Sullivan', 'Walsh', 'Smith', 'O\'Connor', 'McCarthy', 'O\'Neill', 'Ryan'];
    const solicitors = ['Murphy & Associates', 'O\'Brien Legal', 'Kelly Law Firm', 'Ryan Solicitors', 'McCarthy Legal Services'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    
    return {
      id: `buyer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/'/g, '')}@gmail.com`,
      phone: `+353 ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`,
      solicitor: solicitors[Math.floor(Math.random() * solicitors.length)],
      mortgageApproved: Math.random() > 0.3,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Initialize Ellwood project - SOLD OUT (showcase only)
   */
  public initializeEllwood(): Project {
    const projectId = 'ellwood';
    const units = this.generateEllwoodUnits();
    const metrics = this.calculateProjectMetrics(units);
    const unitBreakdown = this.calculateUnitTypeBreakdown(units);
    
    const project: Project = {
      id: projectId,
      name: 'Ellwood',
      location: 'Dublin, Ireland',
      description: 'Completed luxury residential development featuring 46 premium units. SOLD OUT - showcase of our previous successful project.',
      metrics,
      unitBreakdown,
      timeline: {
        projectStart: new Date('2022-06-01'),
        plannedCompletion: new Date('2024-01-15'),
        currentPhase: 'COMPLETED - All units sold',
        progressPercentage: 100,
        milestones: [
          { id: 'milestone-1', name: 'Planning Permission', date: new Date('2022-05-15'), completed: true, critical: true },
          { id: 'milestone-2', name: 'Construction Complete', date: new Date('2023-11-01'), completed: true, critical: true },
          { id: 'milestone-3', name: 'All Units Sold', date: new Date('2024-01-15'), completed: true, critical: true }
        ]
      },
      units,
      lastUpdated: new Date(),
      createdAt: new Date('2022-06-01')
    };

    this.projects.set(projectId, project);
    return project;
  }

  /**
   * Initialize Ballymakenny View project - 19/20 sold (showcase only)
   */
  public initializeBallymakenny(): Project {
    const projectId = 'ballymakenny-view';
    const units = this.generateBallymakenny();
    const metrics = this.calculateProjectMetrics(units);
    const unitBreakdown = this.calculateUnitTypeBreakdown(units);
    
    const project: Project = {
      id: projectId,
      name: 'Ballymakenny View',
      location: 'Drogheda, Ireland', 
      description: 'Premium residential development with 20 units. 19 sold, 1 unit reserved for internal use. Showcase of our market success.',
      metrics,
      unitBreakdown,
      timeline: {
        projectStart: new Date('2023-02-01'),
        plannedCompletion: new Date('2024-09-15'),
        currentPhase: 'NEAR COMPLETION - 19/20 units sold',
        progressPercentage: 95,
        milestones: [
          { id: 'milestone-1', name: 'Planning Permission', date: new Date('2023-01-15'), completed: true, critical: true },
          { id: 'milestone-2', name: 'Sales Launch', date: new Date('2023-08-01'), completed: true, critical: true },
          { id: 'milestone-3', name: 'Construction Completion', date: new Date('2024-09-15'), completed: false, critical: true }
        ]
      },
      units,
      lastUpdated: new Date(),
      createdAt: new Date('2023-02-01')
    };

    this.projects.set(projectId, project);
    return project;
  }

  /**
   * Generate Ellwood units - ALL SOLD OUT (46 units)
   */
  private generateEllwoodUnits(): ReadonlyArray<Unit> {
    const units: Unit[] = [];
    
    // Ellwood configuration - 46 units, ALL SOLD
    const unitTypeConfig = [
      { type: '1 Bed Apartment' as UnitType, count: 12, basePrice: 325000, sqftBase: 680 },
      { type: '2 Bed Apartment' as UnitType, count: 18, basePrice: 395000, sqftBase: 920 },
      { type: '3 Bed House' as UnitType, count: 16, basePrice: 475000, sqftBase: 1250 }
    ];

    let unitCounter = 1;
    unitTypeConfig.forEach((config) => {
      for (let i = 0; i < config.count; i++) {
        const building = Math.floor((unitCounter - 1) / 23) + 1;
        const floor = Math.floor(((unitCounter - 1) % 23) / 6) + 1;
        const priceVariation = (Math.random() - 0.5) * 40000;
        const currentPrice = config.basePrice + priceVariation;
        
        const unit: Unit = {
          id: `ellwood-${unitCounter.toString().padStart(3, '0')}`,
          number: unitCounter.toString().padStart(3, '0'),
          type: config.type,
          status: 'sold', // ALL SOLD OUT
          pricing: {
            basePrice: config.basePrice,
            currentPrice,
            priceHistory: [
              { price: currentPrice, date: new Date('2023-08-01'), reason: 'Initial pricing' },
              { price: currentPrice, date: new Date('2023-12-15'), reason: 'Sold' }
            ],
            htbEligible: currentPrice <= 400000,
            htbAmount: currentPrice <= 400000 ? Math.min(currentPrice * 0.2, 80000) : undefined
          },
          features: {
            bedrooms: config.type.includes('1 Bed') ? 1 : config.type.includes('2 Bed') ? 2 : 3,
            bathrooms: config.type.includes('1 Bed') ? 1 : config.type.includes('2 Bed') ? 2 : 2,
            sqft: config.sqftBase + Math.floor(Math.random() * 150) - 75,
            floor,
            building,
            hasBalcony: config.type.includes('Apartment'),
            hasGarden: config.type.includes('House'),
            parkingSpaces: config.type.includes('House') ? 2 : 1,
            features: this.generateUnitFeatures(config.type),
            amenities: ['Landscaped gardens', 'Secure parking', 'Gym facilities', 'Concierge service']
          },
          location: {
            x: Math.random() * 70 + 15,
            y: Math.random() * 70 + 15,
            building,
            floor,
            unitNumber: unitCounter.toString().padStart(3, '0')
          },
          buyer: this.generateBuyerInformation(),
          legalPack: {
            solicitorPackSent: true,
            contractSigned: true,
            depositPaid: true,
            mortgageApproved: true,
            completionDate: new Date(2024, Math.floor(Math.random() * 3) + 9, Math.floor(Math.random() * 28) + 1),
            legalNotes: 'COMPLETED - All legal processes finalized',
            lastUpdated: new Date()
          },
          statusHistory: [
            { status: 'available', date: new Date('2023-08-01'), reason: 'Launch', updatedBy: 'System' },
            { status: 'sold', date: new Date('2023-12-15'), reason: 'Purchase completed', updatedBy: 'Sales Team' }
          ],
          lastUpdated: new Date(),
          createdAt: new Date('2023-08-01')
        };
        
        units.push(unit);
        unitCounter++;
      }
    });

    return units;
  }

  /**
   * Generate Ballymakenny View units - 19 sold, 1 reserved
   */
  private generateBallymakenny(): ReadonlyArray<Unit> {
    const units: Unit[] = [];
    
    // Ballymakenny configuration - 20 units, 19 sold, 1 reserved
    const unitTypeConfig = [
      { type: '2 Bed Apartment' as UnitType, count: 8, basePrice: 310000, sqftBase: 820 },
      { type: '3 Bed House' as UnitType, count: 12, basePrice: 385000, sqftBase: 1150 }
    ];

    let unitCounter = 1;
    unitTypeConfig.forEach((config) => {
      for (let i = 0; i < config.count; i++) {
        const building = Math.floor((unitCounter - 1) / 10) + 1;
        const floor = Math.floor(((unitCounter - 1) % 10) / 5) + 1;
        const priceVariation = (Math.random() - 0.5) * 30000;
        const currentPrice = config.basePrice + priceVariation;
        
        // Last unit (Unit 020) is reserved for internal use
        const status: UnitStatus = unitCounter === 20 ? 'reserved' : 'sold';
        
        const unit: Unit = {
          id: `ballymakenny-${unitCounter.toString().padStart(3, '0')}`,
          number: unitCounter.toString().padStart(3, '0'),
          type: config.type,
          status,
          pricing: {
            basePrice: config.basePrice,
            currentPrice,
            priceHistory: [
              { price: currentPrice, date: new Date('2023-08-01'), reason: 'Initial pricing' }
            ],
            htbEligible: currentPrice <= 400000,
            htbAmount: currentPrice <= 400000 ? Math.min(currentPrice * 0.2, 80000) : undefined
          },
          features: {
            bedrooms: config.type.includes('2 Bed') ? 2 : 3,
            bathrooms: config.type.includes('2 Bed') ? 2 : 2,
            sqft: config.sqftBase + Math.floor(Math.random() * 120) - 60,
            floor,
            building,
            hasBalcony: config.type.includes('Apartment'),
            hasGarden: config.type.includes('House'),
            parkingSpaces: config.type.includes('House') ? 2 : 1,
            features: this.generateUnitFeatures(config.type),
            amenities: ['Landscaped gardens', 'Secure parking', 'Children\'s playground']
          },
          location: {
            x: Math.random() * 70 + 15,
            y: Math.random() * 70 + 15,
            building,
            floor,
            unitNumber: unitCounter.toString().padStart(3, '0')
          },
          buyer: status === 'sold' ? this.generateBuyerInformation() : null,
          legalPack: {
            solicitorPackSent: status === 'sold',
            contractSigned: status === 'sold',
            depositPaid: status === 'sold',
            mortgageApproved: status === 'sold',
            completionDate: status === 'sold' ? 
              new Date(2024, Math.floor(Math.random() * 6) + 6, Math.floor(Math.random() * 28) + 1) : null,
            legalNotes: status === 'sold' ? 'Sale completed' : 'Reserved for internal use',
            lastUpdated: new Date()
          },
          statusHistory: [
            { status: 'available', date: new Date('2023-08-01'), reason: 'Launch', updatedBy: 'System' },
            { status, date: new Date('2024-01-15'), reason: status === 'sold' ? 'Sold' : 'Reserved for internal use', updatedBy: 'Sales Team' }
          ],
          lastUpdated: new Date(),
          createdAt: new Date('2023-08-01')
        };
        
        units.push(unit);
        unitCounter++;
      }
    });

    return units;
  }

  // =============================================================================
  // METRICS CALCULATION
  // =============================================================================

  /**
   * Calculate real-time project metrics from actual unit data
   */
  private calculateProjectMetrics(units: ReadonlyArray<Unit>): ProjectMetrics {
    const soldUnits = units.filter(u => u.status === 'sold').length;
    const reservedUnits = units.filter(u => u.status === 'reserved').length;
    const availableUnits = units.filter(u => u.status === 'available').length;
    const heldUnits = units.filter(u => u.status === 'held').length;
    const withdrawnUnits = units.filter(u => u.status === 'withdrawn').length;
    
    const totalRevenue = units
      .filter(u => u.status === 'sold')
      .reduce((sum, u) => sum + u.pricing.currentPrice, 0);
    
    const projectedRevenue = units
      .reduce((sum, u) => sum + u.pricing.currentPrice, 0);
    
    const averageUnitPrice = units.length > 0 ? 
      units.reduce((sum, u) => sum + u.pricing.currentPrice, 0) / units.length : 0;

    return {
      totalUnits: units.length,
      soldUnits,
      reservedUnits,
      availableUnits,
      heldUnits,
      withdrawnUnits,
      totalRevenue,
      projectedRevenue,
      averageUnitPrice,
      salesVelocity: 2.3, // units per week - would be calculated from historical data
      conversionRate: (soldUnits / units.length) * 100,
      lastCalculated: new Date()
    };
  }

  /**
   * Calculate unit type breakdown from actual unit data
   */
  private calculateUnitTypeBreakdown(units: ReadonlyArray<Unit>): ReadonlyArray<UnitTypeBreakdown> {
    const unitTypes: UnitType[] = ['1 Bed Apartment', '2 Bed Apartment', '3 Bed House', '4 Bed House'];
    
    return unitTypes.map(type => {
      const typeUnits = units.filter(u => u.type === type);
      const sold = typeUnits.filter(u => u.status === 'sold').length;
      const reserved = typeUnits.filter(u => u.status === 'reserved').length;
      const available = typeUnits.filter(u => u.status === 'available').length;
      const held = typeUnits.filter(u => u.status === 'held').length;
      const withdrawn = typeUnits.filter(u => u.status === 'withdrawn').length;
      
      const prices = typeUnits.map(u => u.pricing.currentPrice);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

      return {
        type,
        totalCount: typeUnits.length,
        sold,
        reserved,
        available,
        held,
        withdrawn,
        priceRange: {
          min: minPrice,
          max: maxPrice,
          average: avgPrice
        },
        salesPercentage: (sold / typeUnits.length) * 100
      };
    });
  }

  // =============================================================================
  // REAL-TIME DATA OPERATIONS
  // =============================================================================

  /**
   * Get project with real-time calculated metrics
   */
  public getProject(projectId: string): Project | null {
    const project = this.projects.get(projectId);
    if (!project) return null;

    // Recalculate metrics on every access to ensure real-time accuracy
    const metrics = this.calculateProjectMetrics(project.units);
    const unitBreakdown = this.calculateUnitTypeBreakdown(project.units);

    return {
      ...project,
      metrics,
      unitBreakdown,
      lastUpdated: new Date()
    };
  }

  /**
   * Update unit status with real-time synchronization
   */
  public updateUnitStatus(
    projectId: string, 
    unitId: string, 
    newStatus: UnitStatus, 
    reason: string = 'Status update',
    updatedBy: string = 'User'
  ): boolean {
    const project = this.projects.get(projectId);
    if (!project) return false;

    const unitIndex = project.units.findIndex(u => u.id === unitId);
    if (unitIndex === -1) return false;

    const unit = project.units[unitIndex];
    const previousStatus = unit.status;

    // Create updated unit with new status
    const updatedUnit: Unit = {
      ...unit,
      status: newStatus,
      statusHistory: [
        ...unit.statusHistory,
        {
          status: newStatus,
          date: new Date(),
          reason,
          updatedBy
        }
      ],
      lastUpdated: new Date()
    };

    // Update the project units array (immutable update)
    const updatedUnits = [
      ...project.units.slice(0, unitIndex),
      updatedUnit,
      ...project.units.slice(unitIndex + 1)
    ];

    // Recalculate metrics with updated data
    const metrics = this.calculateProjectMetrics(updatedUnits);
    const unitBreakdown = this.calculateUnitTypeBreakdown(updatedUnits);

    // Update project with new data
    const updatedProject: Project = {
      ...project,
      units: updatedUnits,
      metrics,
      unitBreakdown,
      lastUpdated: new Date()
    };

    this.projects.set(projectId, updatedProject);

    // Create and dispatch update event
    const updateEvent: UnitUpdateEvent = {
      unitId,
      previousStatus,
      newStatus,
      reason,
      updatedBy,
      timestamp: new Date()
    };

    const stateUpdate: ProjectStateUpdate = {
      type: 'UNIT_STATUS_CHANGE',
      payload: updateEvent,
      projectId,
      timestamp: new Date()
    };

    this.auditLog.push(stateUpdate);
    this.notifyListeners(projectId, stateUpdate);

    return true;
  }

  /**
   * Update unit pricing with real-time synchronization
   */
  public updateUnitPrice(
    projectId: string, 
    unitId: string, 
    newPrice: number, 
    reason: string = 'Price update',
    updatedBy: string = 'AI Analytics'
  ): boolean {
    const project = this.projects.get(projectId);
    if (!project) return false;

    const unitIndex = project.units.findIndex(u => u.id === unitId);
    if (unitIndex === -1) return false;

    const unit = project.units[unitIndex];
    const previousPrice = unit.pricing.currentPrice;

    // Create updated unit with new pricing
    const updatedUnit: Unit = {
      ...unit,
      pricing: {
        ...unit.pricing,
        currentPrice: newPrice,
        priceHistory: [
          ...unit.pricing.priceHistory,
          {
            price: newPrice,
            date: new Date(),
            reason,
            updatedBy
          }
        ]
      },
      lastUpdated: new Date()
    };

    // Update the project units array (immutable update)
    const updatedUnits = [
      ...project.units.slice(0, unitIndex),
      updatedUnit,
      ...project.units.slice(unitIndex + 1)
    ];

    // Recalculate metrics with updated data
    const metrics = this.calculateProjectMetrics(updatedUnits);
    const unitBreakdown = this.calculateUnitTypeBreakdown(updatedUnits);

    // Update project with new data
    const updatedProject: Project = {
      ...project,
      units: updatedUnits,
      metrics,
      unitBreakdown,
      lastUpdated: new Date()
    };

    this.projects.set(projectId, updatedProject);

    // Create and dispatch update event
    const updateEvent = {
      unitId,
      previousPrice,
      newPrice,
      reason,
      updatedBy,
      timestamp: new Date()
    };

    const stateUpdate: ProjectStateUpdate = {
      type: 'UNIT_PRICE_CHANGE',
      payload: updateEvent,
      projectId,
      timestamp: new Date()
    };

    this.auditLog.push(stateUpdate);
    this.notifyListeners(projectId, stateUpdate);

    return true;
  }

  /**
   * Subscribe to project data changes
   */
  public subscribe(projectId: string, callback: (event: ProjectStateUpdate) => void): () => void {
    if (!this.eventListeners.has(projectId)) {
      this.eventListeners.set(projectId, []);
    }
    
    this.eventListeners.get(projectId)!.push(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.eventListeners.get(projectId);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  /**
   * Notify all listeners of data changes
   */
  private notifyListeners(projectId: string, event: ProjectStateUpdate): void {
    const listeners = this.eventListeners.get(projectId);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
        }
      });
    }
  }

  /**
   * Get audit log for compliance and debugging
   */
  public getAuditLog(projectId?: string): ReadonlyArray<ProjectStateUpdate> {
    if (projectId) {
      return this.auditLog.filter(entry => entry.projectId === projectId);
    }
    return [...this.auditLog];
  }

  /**
   * Get units for interactive site plan (optimized for rendering)
   */
  public getUnitsForSitePlan(projectId: string): ReadonlyArray<{
    id: string;
    number: string;
    type: UnitType;
    status: UnitStatus;
    price: number;
    beds: number;
    baths: number;
    sqft: number;
    floor: number;
    x: number;
    y: number;
  }> {
    const project = this.projects.get(projectId);
    if (!project) return [];

    return project.units.map(unit => ({
      id: unit.id,
      number: unit.number,
      type: unit.type,
      status: unit.status,
      price: unit.pricing.currentPrice,
      beds: unit.features.bedrooms,
      baths: unit.features.bathrooms,
      sqft: unit.features.sqft,
      floor: unit.features.floor,
      x: unit.location.x,
      y: unit.location.y
    }));
  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

export const projectDataService = ProjectDataService.getInstance();