/**
 * Real Data Service for Fitzgerald Gardens
 * Integrates your actual project data with the platform
 */

import { fitzgeraldGardensConfig } from '@/data/fitzgerald-gardens-config';
import { Unit, UnitStatus, UnitType, Project } from '@/types/project';

export class RealDataService {
  private static instance: RealDataService;

  public static getInstance(): RealDataService {
    if (!RealDataService.instance) {
      RealDataService.instance = new RealDataService();
    }
    return RealDataService.instance;
  }

  /**
   * Generate real units for Fitzgerald Gardens based on your configuration
   */
  public generateRealFitzgeraldGardensUnits(): Unit[] {
    const units: Unit[] = [];
    const config = fitzgeraldGardensConfig;
    let unitNumber = 1;

    // Generate units based on your actual unit types
    Object.entries(config.unitTypes).forEach(([unitType, details]) => {
      for (let i = 0; i < details.count; i++) {
        const unit: Unit = {
          id: `unit-${unitNumber}`,
          number: unitNumber.toString().padStart(3, '0'), // Use padded format for consistency (001, 002, etc.)
          type: this.mapUnitType(unitType),
          status: 'available' as UnitStatus, // All units start as available
          features: {
            bedrooms: details.bedrooms,
            bathrooms: details.bathrooms,
            balcony: unitType.includes('apartment'),
            garden: unitType.includes('townhouse'),
            parking: true, // Assume all units have parking
            storage: true,
            sqft: Math.round(details.size * 10.764), // Convert sqm to sqft
            sqm: details.size,
            floor: this.assignFloor(unitNumber, unitType),
            building: this.assignBuilding(unitNumber),
            orientation: this.assignOrientation(unitNumber),
            // Add missing properties expected by API
            amenities: ['Landscaped gardens', 'Secure parking', 'Modern kitchen', 'Energy efficient heating']
          },
          pricing: {
            basePrice: details.basePrice,
            currentPrice: details.basePrice,
            discountedPrice: null,
            priceHistory: [
              {
                date: new Date('2025-06-01'),
                price: details.basePrice,
                reason: 'Initial pricing',
                changedBy: 'System'
              }
            ]
          },
          location: {
            address: `Unit ${unitNumber}, Fitzgerald Gardens, Cork, Ireland`,
            coordinates: {
              lat: 51.8985, // Cork coordinates - update with actual location
              lng: -8.4756
            },
            eircode: `T12 XXXX` // Update with actual Eircode
          },
          // Add unit features list for API compatibility
          unitFeatures: this.generateUnitFeatures(unitType),
          buyer: null, // No buyers initially
          viewings: [],
          documents: [],
          customizations: [],
          createdAt: new Date('2025-06-01'),
          lastUpdated: new Date()
        };

        units.push(unit);
        unitNumber++;
      }
    });

    return units;
  }

  /**
   * Create live sales tracking for your units
   */
  public createLiveSalesTracking(): {
    totalRevenue: number;
    pendingInquiries: number;
    scheduledViewings: number;
    reservedUnits: number;
  } {
    const config = fitzgeraldGardensConfig;
    
    return {
      totalRevenue: config.soldToDate * this.getAverageUnitPrice(),
      pendingInquiries: 8, // Update with actual inquiries
      scheduledViewings: 3, // Update with actual viewings
      reservedUnits: config.reservedUnits
    };
  }

  /**
   * Get real project timeline for Fitzgerald Gardens
   */
  public getRealProjectTimeline() {
    const config = fitzgeraldGardensConfig;
    
    return {
      projectStart: new Date(config.projectStartDate),
      estimatedCompletion: new Date(config.estimatedCompletion),
      currentPhase: config.currentPhase,
      progressPercentage: config.completionPercentage,
      nextMilestone: this.getNextMilestone(),
      criticalPath: this.getCriticalPathTasks()
    };
  }

  /**
   * Get your actual team members and contacts
   */
  public getRealTeamMembers() {
    const config = fitzgeraldGardensConfig;
    
    return Object.entries(config.keyContacts).map((contact, index) => ({
      id: `team-${index + 1}`,
      name: contact[1].name,
      role: contact[0],
      company: contact[1].company,
      email: contact[1].email,
      phone: contact[1].phone,
      status: 'active',
      department: this.getDepartmentFromRole(contact[0]),
      joinDate: new Date(config.projectStartDate),
      lastActivity: new Date(),
      currentTasks: Math.floor(Math.random() * 5) + 1,
      completedTasks: Math.floor(Math.random() * 20) + 5
    }));
  }

  // Helper methods
  private mapUnitType(unitType: string): UnitType {
    if (unitType.includes('apartment')) return 'apartment';
    if (unitType.includes('townhouse')) return 'townhouse';
    return 'apartment';
  }

  private assignFloor(unitNumber: number, unitType: string): number {
    if (unitType.includes('townhouse')) return 1;
    return Math.floor((unitNumber - 1) / 8) + 1; // 8 units per floor
  }

  private assignBuilding(unitNumber: number): number {
    return Math.floor((unitNumber - 1) / 24) + 1; // 24 units per building
  }

  private assignOrientation(unitNumber: number): string {
    const orientations = ['North', 'South', 'East', 'West'];
    return orientations[unitNumber % 4];
  }

  private getAverageUnitPrice(): number {
    const config = fitzgeraldGardensConfig;
    const totalValue = Object.values(config.unitTypes)
      .reduce((sum, unit) => sum + (unit.count * unit.basePrice), 0);
    const totalUnits = Object.values(config.unitTypes)
      .reduce((sum, unit) => sum + unit.count, 0);
    return totalValue / totalUnits;
  }

  private getNextMilestone() {
    // Update with your actual next milestone
    return {
      name: 'Structural Framework Completion',
      date: new Date('2024-07-01'),
      daysRemaining: Math.ceil((new Date('2024-07-01').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    };
  }

  private getCriticalPathTasks() {
    // Update with your actual critical path tasks
    return [
      { name: 'Foundation Completion', status: 'completed', dueDate: '2024-04-15' },
      { name: 'Ground Floor Structure', status: 'in_progress', dueDate: '2024-07-01' },
      { name: 'First Floor Structure', status: 'pending', dueDate: '2024-09-15' },
      { name: 'Roof Installation', status: 'pending', dueDate: '2024-12-01' }
    ];
  }

  private getDepartmentFromRole(role: string): string {
    if (role.toLowerCase().includes('architect') || role.toLowerCase().includes('design')) return 'design';
    if (role.toLowerCase().includes('manager') || role.toLowerCase().includes('construction')) return 'construction';
    if (role.toLowerCase().includes('sales') || role.toLowerCase().includes('marketing')) return 'sales';
    return 'administration';
  }

  /**
   * Generate realistic unit features based on type
   */
  private generateUnitFeatures(unitType: string): string[] {
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

    const featureCount = unitType.includes('1_bed') ? 6 :
                        unitType.includes('2_bed') ? 8 :
                        unitType.includes('3_bed') ? 10 : 12;

    return allFeatures
      .sort(() => Math.random() - 0.5)
      .slice(0, featureCount);
  }
}

export const realDataService = RealDataService.getInstance();