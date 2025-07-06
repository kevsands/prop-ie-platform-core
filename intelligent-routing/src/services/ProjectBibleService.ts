/**
 * Project Bible Service
 * Comprehensive service for project bible management, import/export, and document generation
 * 
 * @fileoverview Handles all project bible operations including Excel import, PDF generation, and data synchronization
 * @version 2.0.0
 */

import { 
  ProjectBibleData, 
  ProjectBibleSummary, 
  ScheduleOfAccommodations,
  ProjectProgramme,
  MilestoneChecklist,
  AppointmentsAndFees,
  SalesTracker,
  ProjectTeamStructure,
  DocumentLibrary,
  ProjectBibleExport,
  DocumentTemplate
} from '@/types/projectBible';
import { Project, Unit, TeamMember } from '@/types/project';
import { fitzgeraldGardensConfig } from '@/data/fitzgerald-gardens-config';
import { realDataService } from '@/services/RealDataService';

// =============================================================================
// PROJECT BIBLE SERVICE CLASS
// =============================================================================

export class ProjectBibleService {
  private static instance: ProjectBibleService;
  private projectBibles: Map<string, ProjectBibleData> = new Map();
  private templates: Map<string, DocumentTemplate> = new Map();

  private constructor() {
    this.initializeTemplates();
  }

  public static getInstance(): ProjectBibleService {
    if (!ProjectBibleService.instance) {
      ProjectBibleService.instance = new ProjectBibleService();
    }
    return ProjectBibleService.instance;
  }

  // =============================================================================
  // EXCEL IMPORT AND DATA PROCESSING
  // =============================================================================

  /**
   * Import project bible data from Excel file
   */
  public async importExcelData(file: File, projectId: string): Promise<ProjectBibleData> {
    try {
      const workbook = await this.parseExcelFile(file);
      const projectBible = await this.processExcelWorkbook(workbook, projectId);
      
      // Store in cache
      this.projectBibles.set(projectId, projectBible);
      
      // Sync with existing project data
      await this.syncWithProjectData(projectId, projectBible);
      
      return projectBible;
    } catch (error) {
      throw new Error(`Failed to import Excel data: ${error.message}`);
    }
  }

  /**
   * Parse Excel file using SheetJS
   */
  private async parseExcelFile(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          // This would use a library like SheetJS in a real implementation
          // For now, we'll simulate the parsing
          const data = this.simulateExcelParsing(file.name);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Simulate Excel parsing for demonstration
   */
  private simulateExcelParsing(filename: string): any {
    // This simulates the structure of the Fitzgerald Project Bible Excel file
    return {
      'Project Summary': {
        'Project Name': 'Fitzgerald Gardens',
        'Location': 'Cork, Ireland',
        'Total Investment': 18500000,
        'Total Units': 24,
        'Project Start': '2024-03-01',
        'Estimated Completion': '2025-08-15'
      },
      'SOA': [
        {
          'Unit ID': 'A-01',
          'Unit Type': '1 Bed Apartment',
          'Floor': 'Ground',
          'Gross Area': 55,
          'Net Area': 48,
          'Balcony': 7,
          'Bedrooms': 1,
          'Bathrooms': 1,
          'Kitchen': 'Open plan',
          'Living': 'Open plan'
        },
        {
          'Unit ID': 'A-02',
          'Unit Type': '2 Bed Apartment',
          'Floor': 'First',
          'Gross Area': 75,
          'Net Area': 68,
          'Balcony': 8,
          'Bedrooms': 2,
          'Bathrooms': 2,
          'Kitchen': 'Separate',
          'Living': 'Separate'
        }
      ],
      'Programme': [
        {
          'Phase': 'Planning & Design',
          'Start Date': '2024-01-15',
          'End Date': '2024-06-30',
          'Duration': 24,
          'Status': 'Completed'
        },
        {
          'Phase': 'Construction - Phase 1',
          'Start Date': '2024-07-01',
          'End Date': '2025-02-28',
          'Duration': 35,
          'Status': 'In Progress'
        }
      ],
      'Team': [
        {
          'Name': 'Sarah O\'Connor',
          'Role': 'Lead Architect',
          'Company': 'O\'Connor Architects',
          'Email': 'sarah@oconnorarch.ie',
          'Phone': '+353 21 123 4567',
          'Scope': 'Architectural design and planning'
        },
        {
          'Name': 'Patrick Murphy',
          'Role': 'Site Manager',
          'Company': 'Fitzgerald Development',
          'Email': 'patrick@fitzdev.ie',
          'Phone': '+353 21 234 5678',
          'Scope': 'Construction management and coordination'
        }
      ],
      'Sales': [
        {
          'Unit ID': 'A-15',
          'Sale Date': '2025-05-15',
          'Sale Price': 380000,
          'Buyer': 'John & Mary Smith',
          'Status': 'Sale Agreed',
          'Completion': '2025-09-30'
        },
        {
          'Unit ID': 'B-08',
          'Sale Date': '2025-05-20',
          'Sale Price': 450000,
          'Buyer': 'David O\'Brien',
          'Status': 'Contracts Signed',
          'Completion': '2025-10-15'
        }
      ],
      'Milestones': [
        {
          'Milestone': 'Planning Permission',
          'Due Date': '2024-03-15',
          'Status': 'Completed',
          'Completion Date': '2024-03-10'
        },
        {
          'Milestone': 'Foundation Complete',
          'Due Date': '2024-09-30',
          'Status': 'Completed',
          'Completion Date': '2024-09-28'
        },
        {
          'Milestone': 'First Fix Complete',
          'Due Date': '2025-03-31',
          'Status': 'In Progress',
          'Progress': 75
        }
      ]
    };
  }

  /**
   * Process Excel workbook data into ProjectBibleData structure
   */
  private async processExcelWorkbook(workbook: any, projectId: string): Promise<ProjectBibleData> {
    const projectBible: ProjectBibleData = {
      projectId,
      lastUpdated: new Date(),
      version: '1.0',
      summary: this.processSummaryData(workbook['Project Summary']),
      scheduleOfAccommodations: this.processSOAData(workbook['SOA']),
      programmeRoadmap: this.processProgrammeData(workbook['Programme']),
      milestoneChecklist: this.processMilestoneData(workbook['Milestones']),
      appointmentsAndFees: this.processTeamData(workbook['Team']),
      salesTracker: this.processSalesData(workbook['Sales']),
      teamStructure: this.processTeamStructure(workbook['Team']),
      documentLibrary: this.processDocumentLibrary([])
    };

    return projectBible;
  }

  /**
   * Process project summary data
   */
  private processSummaryData(summaryData: any): ProjectBibleSummary {
    return {
      executiveSummary: {
        projectVision: 'Premium residential development offering modern living in Cork\'s growing district',
        keyObjectives: [
          'Deliver 24 high-quality residential units',
          'Achieve 18% ROI for investors',
          'Complete project within 18-month timeline',
          'Achieve A-energy rating for all units'
        ],
        successMetrics: [
          {
            id: 'revenue',
            name: 'Total Revenue',
            description: 'Total project revenue target',
            targetValue: 10800000,
            currentValue: 8640000,
            unit: 'EUR',
            category: 'financial',
            isOnTrack: true
          },
          {
            id: 'timeline',
            name: 'Project Timeline',
            description: 'On-time completion percentage',
            targetValue: 100,
            currentValue: 85,
            unit: '%',
            category: 'timeline',
            isOnTrack: true
          }
        ],
        riskAssessment: [
          {
            id: 'weather-risk',
            category: 'operational',
            description: 'Weather delays during construction',
            probability: 3,
            impact: 2,
            riskScore: 6,
            mitigationStrategy: 'Weather-protected construction methods and flexible scheduling',
            owner: 'Site Manager',
            status: 'open'
          },
          {
            id: 'market-risk',
            category: 'market',
            description: 'Property market downturn affecting sales',
            probability: 2,
            impact: 4,
            riskScore: 8,
            mitigationStrategy: 'Flexible pricing strategy and enhanced marketing',
            owner: 'Sales Director',
            status: 'mitigated'
          }
        ]
      },
      commercialOverview: {
        totalInvestment: summaryData['Total Investment'] || 18500000,
        projectedRevenue: 10800000,
        expectedROI: 18.5,
        marketPositioning: 'Premium residential development targeting young professionals and growing families',
        competitiveAdvantage: [
          'Prime location near transport links',
          'Energy-efficient design',
          'Competitive pricing strategy',
          'Experienced development team'
        ]
      },
      technicalSpecifications: {
        developmentType: 'residential',
        constructionMethod: 'Reinforced concrete frame with block infill',
        sustainabilityRating: 'A-Energy Rating',
        planningReference: 'PL/2024/0123',
        buildingRegulations: ['Part F - Ventilation', 'Part L - Conservation of Fuel', 'Part M - Access']
      },
      locationAnalysis: {
        address: 'Fitzgerald Gardens, Cork, Ireland',
        coordinates: { lat: 51.8979, lng: -8.4706 },
        proximityFactors: [
          { type: 'transport', name: 'Cork Kent Station', distance: 2500, rating: 4 },
          { type: 'school', name: 'University College Cork', distance: 3000, rating: 5 },
          { type: 'retail', name: 'Mahon Point Shopping Centre', distance: 1500, rating: 4 }
        ],
        transportLinks: [
          { type: 'bus', name: 'Bus Route 2', distance: 200, frequency: 'Every 15 minutes' },
          { type: 'rail', name: 'Cork Kent Station', distance: 2500, frequency: 'Hourly to Dublin' }
        ],
        amenities: [
          { type: 'retail', name: 'Local Shopping', distance: 500, rating: 3 },
          { type: 'recreation', name: 'Fitzgerald Park', distance: 800, rating: 4 },
          { type: 'healthcare', name: 'Cork University Hospital', distance: 4000, rating: 5 }
        ]
      }
    };
  }

  /**
   * Process Schedule of Accommodations data
   */
  private processSOAData(soaData: any[]): ScheduleOfAccommodations {
    const unitSchedules = soaData.map(unit => ({
      unitId: unit['Unit ID'],
      unitType: unit['Unit Type'],
      floor: this.parseFloor(unit['Floor']),
      orientation: 'South-facing', // Default
      roomSchedule: this.generateRoomSchedule(unit),
      totalAreas: {
        gross: unit['Gross Area'] || 0,
        net: unit['Net Area'] || 0,
        balcony: unit['Balcony'] || 0
      },
      finishSchedule: this.generateFinishSchedule(),
      fixtures: this.generateFixtureSchedule(),
      services: this.generateServiceSchedule(),
      complianceNotes: ['Building Regulations Part M compliant', 'Fire safety standards met'],
      accessibility: [
        { feature: 'Level access', compliance: 'Part M', notes: 'Ground floor units only' }
      ]
    }));

    return {
      lastUpdated: new Date(),
      unitSchedules,
      commonAreas: this.generateCommonAreas(),
      servicesSchedule: this.generateServicesSchedule(),
      totalAreas: {
        grossInternalArea: unitSchedules.reduce((sum, unit) => sum + unit.totalAreas.gross, 0),
        netInternalArea: unitSchedules.reduce((sum, unit) => sum + unit.totalAreas.net, 0),
        externalArea: unitSchedules.reduce((sum, unit) => sum + (unit.totalAreas.balcony || 0), 0),
        totalSiteArea: 1500
      },
      complianceChecklist: [
        {
          category: 'building-regulations',
          requirement: 'Part L - Conservation of Fuel',
          status: 'compliant',
          evidence: 'A-Energy rating achieved',
          notes: 'All units meet energy efficiency standards'
        }
      ]
    };
  }

  /**
   * Process programme/roadmap data
   */
  private processProgrammeData(programmeData: any[]): ProjectProgramme {
    const phases = programmeData.map((phase, index) => ({
      phaseId: `phase-${index + 1}`,
      phaseName: phase['Phase'],
      description: `Phase ${index + 1} of project delivery`,
      startDate: new Date(phase['Start Date']),
      endDate: new Date(phase['End Date']),
      duration: phase['Duration'] || 0,
      progress: phase['Status'] === 'Completed' ? 100 : phase['Status'] === 'In Progress' ? 75 : 0,
      status: this.mapPhaseStatus(phase['Status']),
      dependencies: index > 0 ? [`phase-${index}`] : [],
      criticalPath: true,
      milestones: this.generatePhaseMilestones(phase),
      tasks: this.generatePhaseTasks(phase),
      resources: this.generatePhaseResources(phase),
      costs: {
        budgeted: 1000000 * (index + 1),
        actual: 950000 * (index + 1),
        variance: -50000 * (index + 1)
      }
    }));

    return {
      lastUpdated: new Date(),
      overallTimeline: {
        projectStart: new Date('2024-01-15'),
        plannedCompletion: new Date('2025-08-15'),
        totalDuration: 78
      },
      phases,
      criticalPath: this.calculateCriticalPath(phases),
      resourceAllocation: this.generateResourceAllocation(),
      riskMitigation: this.generateRiskMitigation(),
      dependencies: this.generateProjectDependencies(phases)
    };
  }

  /**
   * Process milestone data
   */
  private processMilestoneData(milestoneData: any[]): MilestoneChecklist {
    const milestones = milestoneData.map((milestone, index) => ({
      milestoneId: `milestone-${index + 1}`,
      name: milestone['Milestone'],
      description: `Critical project milestone: ${milestone['Milestone']}`,
      category: this.categorizeMilestone(milestone['Milestone']),
      dueDate: new Date(milestone['Due Date']),
      status: this.mapMilestoneStatus(milestone['Status']),
      priority: 'high' as const,
      checklist: this.generateMilestoneChecklist(milestone),
      approvals: this.generateMilestoneApprovals(milestone),
      documents: this.generateMilestoneDocuments(milestone),
      dependencies: [],
      owner: 'Project Manager',
      progress: milestone['Progress'] || (milestone['Status'] === 'Completed' ? 100 : 0),
      notes: milestone['Notes'] || ''
    }));

    return {
      lastUpdated: new Date(),
      categories: this.groupMilestonesByCategory(milestones),
      overallProgress: this.calculateOverallProgress(milestones),
      criticalMilestones: milestones.filter(m => m.priority === 'critical').map(m => m.milestoneId),
      upcomingDeadlines: this.calculateUpcomingDeadlines(milestones)
    };
  }

  /**
   * Process team data into appointments and fees
   */
  private processTeamData(teamData: any[]): AppointmentsAndFees {
    const appointments = teamData.map((member, index) => ({
      appointmentId: `appointment-${index + 1}`,
      discipline: this.mapDiscipline(member['Role']),
      companyName: member['Company'],
      contactPerson: member['Name'],
      email: member['Email'],
      phone: member['Phone'],
      address: 'Cork, Ireland',
      role: member['Role'],
      scope: [member['Scope'] || 'Professional services'],
      appointmentDate: new Date('2024-01-15'),
      contractValue: this.estimateContractValue(member['Role']),
      feeStructure: 'percentage' as const,
      paymentTerms: 'Monthly in arrears',
      keyPersonnel: [{
        name: member['Name'],
        role: member['Role'],
        qualifications: ['Chartered Professional'],
        experience: 10,
        allocation: 100
      }],
      qualifications: ['Chartered Professional', 'Professional Indemnity Insurance'],
      insurance: {
        professionalIndemnity: 2000000,
        publicLiability: 6000000,
        employersLiability: 13000000,
        expiryDate: new Date('2025-12-31'),
        insurer: 'Professional Insurance Ltd'
      },
      status: 'active' as const
    }));

    return {
      lastUpdated: new Date(),
      professionalAppointments: appointments,
      feeProposals: this.generateFeeProposals(appointments),
      invoices: this.generateProjectInvoices(appointments),
      contracts: this.generateProfessionalContracts(appointments),
      totalFees: {
        budgeted: 1500000,
        committed: 1350000,
        paid: 800000,
        outstanding: 550000
      }
    };
  }

  /**
   * Process sales data
   */
  private processSalesData(salesData: any[]): SalesTracker {
    const unitSales = salesData.map((sale, index) => ({
      saleId: `sale-${index + 1}`,
      unitId: sale['Unit ID'],
      unitType: this.getUnitType(sale['Unit ID']),
      floor: this.getUnitFloor(sale['Unit ID']),
      sellingPrice: sale['Sale Price'],
      deposit: sale['Sale Price'] * 0.1,
      saleDate: new Date(sale['Sale Date']),
      completionDate: sale['Completion'] ? new Date(sale['Completion']) : undefined,
      buyer: this.generateBuyerDetails(sale['Buyer']),
      solicitor: this.generateSolicitorDetails(),
      mortgage: this.generateMortgageDetails(),
      saleStatus: this.mapSaleStatus(sale['Status']),
      salesAgent: 'John Smith',
      commission: sale['Sale Price'] * 0.02,
      notes: ''
    }));

    return {
      lastUpdated: new Date(),
      summary: this.calculateSalesSummary(unitSales),
      unitSales,
      salesPipeline: this.generateSalesPipeline(),
      marketingCampaigns: this.generateMarketingCampaigns(),
      leadGeneration: this.generateLeadGeneration(),
      salesTargets: this.generateSalesTargets(),
      performanceMetrics: this.generateSalesMetrics(unitSales)
    };
  }

  /**
   * Process team structure
   */
  private processTeamStructure(teamData: any[]): ProjectTeamStructure {
    const coreTeam = teamData.map((member, index) => ({
      memberId: `member-${index + 1}`,
      name: member['Name'],
      role: member['Role'],
      company: member['Company'],
      email: member['Email'],
      phone: member['Phone'],
      responsibilities: [member['Scope'] || 'Professional services'],
      directReports: [],
      skills: this.generateSkills(member['Role']),
      availability: 100,
      startDate: new Date('2024-01-15'),
      performance: {
        qualityScore: 85 + Math.random() * 15,
        timelinessScore: 80 + Math.random() * 20,
        communicationScore: 90 + Math.random() * 10,
        overallScore: 85 + Math.random() * 15,
        feedback: ['Excellent technical delivery', 'Strong communication skills']
      }
    }));

    return {
      lastUpdated: new Date(),
      projectManager: coreTeam[0], // Assume first is PM
      coreTeam,
      consultants: this.generateConsultantTeams(coreTeam),
      contractors: this.generateContractorTeams(),
      organogram: this.generateOrganogram(coreTeam),
      responsibilities: this.generateResponsibilityMatrix(),
      communications: this.generateCommunicationPlan()
    };
  }

  /**
   * Process document library
   */
  private processDocumentLibrary(documents: any[]): DocumentLibrary {
    return {
      lastUpdated: new Date(),
      categories: this.generateDocumentCategories(),
      totalDocuments: documents.length,
      recentUploads: [],
      pendingApprovals: []
    };
  }

  // =============================================================================
  // PDF AND EXCEL EXPORT
  // =============================================================================

  /**
   * Generate comprehensive project bible PDF
   */
  public async generateProjectBible(projectId: string, options: ProjectBibleExport): Promise<Blob> {
    const projectBible = await this.getProjectBible(projectId);
    
    // This would use a library like react-pdf or puppeteer in a real implementation
    const pdfContent = await this.generatePDFContent(projectBible, options);
    
    return new Blob([pdfContent], { type: 'application/pdf' });
  }

  /**
   * Generate Excel export
   */
  public async generateExcelExport(projectId: string, sections: string[]): Promise<Blob> {
    const projectBible = await this.getProjectBible(projectId);
    
    // This would use a library like SheetJS in a real implementation
    const excelContent = await this.generateExcelContent(projectBible, sections);
    
    return new Blob([excelContent], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
  }

  // =============================================================================
  // DATA SYNCHRONIZATION
  // =============================================================================

  /**
   * Sync project bible with existing project data
   */
  private async syncWithProjectData(projectId: string, projectBible: ProjectBibleData): Promise<void> {
    // Sync with fitzgerald-gardens-config.ts
    const config = fitzgeraldGardensConfig;
    
    // Update unit data
    const realUnits = realDataService.generateRealFitzgeraldGardensUnits();
    
    // Sync sales data with unit statuses
    this.syncSalesWithUnits(projectBible.salesTracker, realUnits);
    
    // Sync team data with real contacts
    this.syncTeamWithRealContacts(projectBible.teamStructure);
    
    // Sync milestones with project timeline
    this.syncMilestonesWithTimeline(projectBible.milestoneChecklist, config);
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  public async getProjectBible(projectId: string): Promise<ProjectBibleData> {
    if (this.projectBibles.has(projectId)) {
      return this.projectBibles.get(projectId)!;
    }
    
    // Generate from existing project data if not in cache
    return this.generateFromProjectData(projectId);
  }

  private async generateFromProjectData(projectId: string): Promise<ProjectBibleData> {
    // Generate project bible from existing project configuration
    const config = fitzgeraldGardensConfig;
    const units = realDataService.generateRealFitzgeraldGardensUnits();
    
    // Create comprehensive project bible from existing data
    const projectBible: ProjectBibleData = {
      projectId,
      lastUpdated: new Date(),
      version: '1.0',
      summary: this.generateSummaryFromConfig(config),
      scheduleOfAccommodations: this.generateSOAFromUnits(units),
      programmeRoadmap: this.generateProgrammeFromConfig(config),
      milestoneChecklist: this.generateMilestonesFromConfig(config),
      appointmentsAndFees: this.generateAppointmentsFromConfig(config),
      salesTracker: this.generateSalesFromConfig(config, units),
      teamStructure: this.generateTeamFromConfig(config),
      documentLibrary: this.generateDocumentLibraryFromConfig()
    };

    this.projectBibles.set(projectId, projectBible);
    return projectBible;
  }

  private initializeTemplates(): void {
    // Initialize document templates
    // This would load predefined templates for different project types
  }

  // =============================================================================
  // HELPER METHODS (Implementations for various generators)
  // =============================================================================

  private parseFloor(floor: string): number {
    const floorMap = { 'Ground': 0, 'First': 1, 'Second': 2, 'Third': 3 };
    return floorMap[floor] || 0;
  }

  private generateRoomSchedule(unit: any): any[] {
    // Generate room specifications based on unit type
    const baseRooms = [
      {
        roomId: 'living-1',
        roomType: 'living' as const,
        roomName: 'Living Room',
        dimensions: { length: 4.5, width: 3.8, height: 2.4, area: 17.1 },
        features: ['South-facing window', 'Open plan design'],
        windows: [{ type: 'Double glazed', dimensions: { width: 1.8, height: 1.2 }, material: 'uPVC', glazing: 'Low-E', hardware: 'Standard' }],
        doors: [{ type: 'Internal', dimensions: { width: 0.8, height: 2.0 }, material: 'Timber', finish: 'Painted', hardware: 'Lever handles', security: 'Standard lock' }],
        electricalPoints: [
          { type: 'socket' as const, location: 'Corner wall', specification: '13A double socket' },
          { type: 'light' as const, location: 'Ceiling centre', specification: 'LED downlights' }
        ],
        plumbingPoints: []
      }
    ];

    if (unit['Bedrooms'] >= 1) {
      baseRooms.push({
        roomId: 'bedroom-1',
        roomType: 'bedroom' as const,
        roomName: 'Master Bedroom',
        dimensions: { length: 3.5, width: 3.2, height: 2.4, area: 11.2 },
        features: ['Built-in wardrobes', 'En-suite access'],
        windows: [{ type: 'Double glazed', dimensions: { width: 1.5, height: 1.2 }, material: 'uPVC', glazing: 'Low-E', hardware: 'Standard' }],
        doors: [{ type: 'Internal', dimensions: { width: 0.8, height: 2.0 }, material: 'Timber', finish: 'Painted', hardware: 'Lever handles', security: 'Privacy lock' }],
        electricalPoints: [
          { type: 'socket' as const, location: 'Bedside walls', specification: '13A double socket x2' },
          { type: 'light' as const, location: 'Ceiling centre', specification: 'LED pendant' }
        ],
        plumbingPoints: []
      });
    }

    return baseRooms;
  }

  private generateFinishSchedule(): any[] {
    return [
      { element: 'floor' as const, roomTypes: ['living', 'bedroom'], material: 'Engineered Oak', finish: 'Matt lacquer', color: 'Natural', supplier: 'Premium Floors Ltd', cost: 65, installation: 'Floating' },
      { element: 'wall' as const, roomTypes: ['all'], material: 'Plaster', finish: 'Smooth', color: 'White', supplier: 'Standard', cost: 25, installation: 'Wet trade' }
    ];
  }

  private generateFixtureSchedule(): any[] {
    return [
      { category: 'kitchen' as const, item: 'Kitchen Units', specification: 'High gloss white', supplier: 'Kitchen Solutions', model: 'Contemporary Range', cost: 8500, installation: 'Specialist fitting', warranty: '10 years' },
      { category: 'bathroom' as const, item: 'Bathroom Suite', specification: 'White ceramic', supplier: 'Bathroom World', model: 'Modern Suite', cost: 1500, installation: 'Plumber fitted', warranty: '5 years' }
    ];
  }

  private generateServiceSchedule(): any[] {
    return [
      { service: 'electrical' as const, specification: '18th edition wiring', capacity: '100A supply', supplier: 'Cork Electrical', installation: 'First fix complete', certification: ['NICEIC', 'RECI'] },
      { service: 'plumbing' as const, specification: 'Copper and plastic', capacity: '22mm mains', supplier: 'Murphy Plumbing', installation: 'First fix complete', certification: ['Gas Safe'] }
    ];
  }

  private generateCommonAreas(): any[] {
    return [
      {
        areaId: 'entrance-1',
        areaName: 'Main Entrance Lobby',
        areaType: 'entrance' as const,
        floor: 0,
        area: 25,
        finishSchedule: [],
        services: [],
        accessibility: [{ feature: 'Level access', compliance: 'Part M', notes: 'Automatic doors' }],
        maintenance: [{ activity: 'Daily cleaning', frequency: 'Daily', nextDue: new Date(), cost: 50 }]
      }
    ];
  }

  private generateServicesSchedule(): any[] {
    return [
      { service: 'electrical' as const, specification: 'Three phase supply', capacity: '500A', supplier: 'ESB Networks', installation: 'Underground', certification: ['ESB'] }
    ];
  }

  private mapPhaseStatus(status: string): any {
    const statusMap = {
      'Completed': 'completed',
      'In Progress': 'in-progress',
      'Not Started': 'not-started',
      'Delayed': 'delayed'
    };
    return statusMap[status] || 'not-started';
  }

  private generatePhaseMilestones(phase: any): any[] {
    return [
      {
        milestoneId: `${phase.Phase}-milestone-1`,
        name: `${phase.Phase} Completion`,
        description: `Complete all activities for ${phase.Phase}`,
        dueDate: new Date(phase['End Date']),
        status: 'pending' as const,
        criticalPath: true,
        dependencies: [],
        deliverables: [],
        approvals: []
      }
    ];
  }

  private generatePhaseTasks(phase: any): any[] {
    return [
      {
        taskId: `${phase.Phase}-task-1`,
        name: `${phase.Phase} Main Activity`,
        description: `Primary deliverable for ${phase.Phase}`,
        startDate: new Date(phase['Start Date']),
        endDate: new Date(phase['End Date']),
        duration: phase['Duration'] || 30,
        progress: phase['Status'] === 'Completed' ? 100 : 50,
        status: this.mapPhaseStatus(phase['Status']),
        assignedTo: 'Project Team',
        dependencies: [],
        deliverables: [],
        cost: 100000
      }
    ];
  }

  private generatePhaseResources(phase: any): any[] {
    return [
      {
        resourceId: `${phase.Phase}-resource-1`,
        resourceType: 'personnel' as const,
        name: 'Project Team',
        capacity: 5,
        allocation: [
          {
            phaseId: phase.Phase,
            startDate: new Date(phase['Start Date']),
            endDate: new Date(phase['End Date']),
            allocation: 100,
            cost: 50000
          }
        ],
        cost: { hourly: 75, total: 50000 }
      }
    ];
  }

  private calculateCriticalPath(phases: any[]): any[] {
    return phases.map(phase => ({
      itemId: phase.phaseId,
      type: 'phase' as const,
      name: phase.phaseName,
      startDate: phase.startDate,
      endDate: phase.endDate,
      float: 0,
      predecessors: phase.dependencies,
      successors: []
    }));
  }

  private generateResourceAllocation(): any[] {
    return [
      {
        resourceId: 'team-lead',
        resourceType: 'personnel' as const,
        name: 'Project Manager',
        capacity: 1,
        allocation: [],
        cost: { hourly: 85, total: 100000 }
      }
    ];
  }

  private generateRiskMitigation(): any[] {
    return [
      {
        riskId: 'schedule-risk-1',
        riskDescription: 'Weather delays',
        category: 'schedule' as const,
        probability: 3,
        impact: 2,
        mitigationActions: [],
        contingencyPlan: 'Extended working hours',
        owner: 'Site Manager',
        status: 'active' as const
      }
    ];
  }

  private generateProjectDependencies(phases: any[]): any[] {
    return phases.slice(1).map((phase, index) => ({
      dependencyId: `dep-${index + 1}`,
      type: 'finish-to-start' as const,
      predecessor: phases[index].phaseId,
      successor: phase.phaseId,
      lag: 0,
      constraint: 'Standard dependency'
    }));
  }

  private mapMilestoneStatus(status: string): any {
    const statusMap = {
      'Completed': 'completed',
      'In Progress': 'in-progress',
      'Not Started': 'not-started',
      'Delayed': 'delayed'
    };
    return statusMap[status] || 'not-started';
  }

  private categorizeMilestone(milestone: string): string {
    if (milestone.includes('Planning')) return 'planning';
    if (milestone.includes('Foundation')) return 'construction';
    if (milestone.includes('Fix')) return 'construction';
    return 'general';
  }

  private generateMilestoneChecklist(milestone: any): any[] {
    return [
      {
        itemId: `${milestone.Milestone}-check-1`,
        description: `Complete ${milestone.Milestone}`,
        status: milestone.Status === 'Completed' ? 'completed' as const : 'pending' as const,
        completedDate: milestone.Status === 'Completed' ? new Date(milestone['Completion Date']) : undefined,
        evidence: 'Photographic evidence and sign-off'
      }
    ];
  }

  private generateMilestoneApprovals(milestone: any): any[] {
    return [
      {
        approvalId: `${milestone.Milestone}-approval-1`,
        name: `${milestone.Milestone} Approval`,
        authority: 'Building Control',
        status: 'not-submitted' as const,
        conditions: [],
        documents: []
      }
    ];
  }

  private generateMilestoneDocuments(milestone: any): any[] {
    return [
      {
        documentId: `${milestone.Milestone}-doc-1`,
        title: `${milestone.Milestone} Certificate`,
        description: `Official completion certificate for ${milestone.Milestone}`,
        type: 'pdf' as const,
        category: 'certificates',
        version: '1.0',
        uploadDate: new Date(),
        uploadedBy: 'System',
        fileSize: 1024,
        filePath: '/documents/certificates/',
        tags: ['milestone', 'certificate'],
        status: 'draft' as const,
        approvals: [],
        relatedDocuments: [],
        isConfidential: false
      }
    ];
  }

  private groupMilestonesByCategory(milestones: any[]): any[] {
    const categories = ['planning', 'construction', 'completion'];
    return categories.map(category => ({
      categoryId: category,
      name: category.charAt(0).toUpperCase() + category.slice(1),
      description: `${category} related milestones`,
      milestones: milestones.filter(m => m.category === category),
      progress: 0
    }));
  }

  private calculateOverallProgress(milestones: any[]): number {
    const completed = milestones.filter(m => m.status === 'completed').length;
    return (completed / milestones.length) * 100;
  }

  private calculateUpcomingDeadlines(milestones: any[]): any[] {
    const upcoming = milestones
      .filter(m => m.status !== 'completed' && m.dueDate > new Date())
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
      .slice(0, 5);

    return upcoming.map(m => ({
      milestoneId: m.milestoneId,
      name: m.name,
      dueDate: m.dueDate,
      daysUntilDue: Math.ceil((m.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      status: 'on-track' as const,
      owner: m.owner
    }));
  }

  private mapDiscipline(role: string): any {
    const disciplineMap = {
      'Lead Architect': 'architect',
      'Site Manager': 'project-manager',
      'Structural Engineer': 'engineer-structural',
      'Services Engineer': 'engineer-services',
      'Quantity Surveyor': 'quantity-surveyor'
    };
    return disciplineMap[role] || 'other';
  }

  private estimateContractValue(role: string): number {
    const valueMap = {
      'Lead Architect': 150000,
      'Site Manager': 80000,
      'Structural Engineer': 75000,
      'Services Engineer': 60000,
      'Quantity Surveyor': 35000
    };
    return valueMap[role] || 25000;
  }

  private generateFeeProposals(appointments: any[]): any[] {
    return appointments.map(appointment => ({
      proposalId: `proposal-${appointment.appointmentId}`,
      appointmentId: appointment.appointmentId,
      discipline: appointment.discipline,
      companyName: appointment.companyName,
      submissionDate: new Date('2024-01-10'),
      scope: appointment.scope,
      feeBreakdown: [
        { phase: 'Design', description: 'Design development', fee: appointment.contractValue * 0.6, percentage: 60 },
        { phase: 'Construction', description: 'Construction administration', fee: appointment.contractValue * 0.4, percentage: 40 }
      ],
      totalFee: appointment.contractValue,
      programme: '12 months',
      assumptions: ['No major design changes', 'Timely client decisions'],
      exclusions: ['Planning permission costs', 'Site investigations'],
      status: 'approved' as const,
      evaluationCriteria: {
        technical: 85,
        commercial: 80,
        experience: 90,
        resources: 85,
        programme: 88,
        totalScore: 85.6
      }
    }));
  }

  private generateProjectInvoices(appointments: any[]): any[] {
    return appointments.flatMap(appointment => [
      {
        invoiceId: `inv-${appointment.appointmentId}-1`,
        appointmentId: appointment.appointmentId,
        invoiceNumber: `INV-2024-001`,
        issueDate: new Date('2024-02-01'),
        dueDate: new Date('2024-02-28'),
        amount: appointment.contractValue * 0.2,
        vat: appointment.contractValue * 0.2 * 0.23,
        total: appointment.contractValue * 0.2 * 1.23,
        period: 'January 2024',
        description: ['Initial design phase', 'Concept development'],
        status: 'paid' as const,
        paymentDate: new Date('2024-02-25')
      }
    ]);
  }

  private generateProfessionalContracts(appointments: any[]): any[] {
    return appointments.map(appointment => ({
      contractId: `contract-${appointment.appointmentId}`,
      appointmentId: appointment.appointmentId,
      contractType: 'Professional Services Agreement',
      signedDate: new Date('2024-01-20'),
      startDate: new Date('2024-02-01'),
      completionDate: new Date('2025-08-31'),
      value: appointment.contractValue,
      paymentSchedule: [
        { milestoneId: 'design', description: 'Design completion', percentage: 60, amount: appointment.contractValue * 0.6, dueDate: new Date('2024-06-30'), status: 'pending' as const },
        { milestoneId: 'construction', description: 'Construction completion', percentage: 40, amount: appointment.contractValue * 0.4, dueDate: new Date('2025-08-31'), status: 'pending' as const }
      ],
      keyTerms: ['Professional indemnity insurance required', 'Monthly progress reports', 'Client approval required for major decisions'],
      variations: [],
      status: 'active' as const
    }));
  }

  private getUnitType(unitId: string): string {
    if (unitId.startsWith('A')) return '1 Bed Apartment';
    if (unitId.startsWith('B')) return '2 Bed Apartment';
    return '3 Bed House';
  }

  private getUnitFloor(unitId: string): number {
    const num = parseInt(unitId.split('-')[1]);
    return Math.floor((num - 1) / 8);
  }

  private generateBuyerDetails(buyerName: string): any {
    return {
      buyerId: `buyer-${Date.now()}`,
      name: buyerName,
      email: `${buyerName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      phone: '+353 87 ' + Math.floor(Math.random() * 9000000 + 1000000),
      address: 'Cork, Ireland',
      occupation: 'Professional',
      financing: 'mortgage' as const,
      firstTimeBuyer: Math.random() > 0.5,
      referralSource: 'Website'
    };
  }

  private generateSolicitorDetails(): any {
    return {
      firm: 'Murphy & Associates Solicitors',
      contactName: 'James Murphy',
      email: 'james@murphysolicitors.ie',
      phone: '+353 21 456 7890',
      address: 'Patrick Street, Cork'
    };
  }

  private generateMortgageDetails(): any {
    return {
      lender: 'Bank of Ireland',
      amount: 300000,
      approved: true,
      approvalDate: new Date('2025-05-01'),
      loanToValue: 80
    };
  }

  private mapSaleStatus(status: string): any {
    const statusMap = {
      'Sale Agreed': 'sale-agreed',
      'Contracts Signed': 'contracts-signed',
      'Completed': 'completed',
      'Reserved': 'reserved'
    };
    return statusMap[status] || 'reserved';
  }

  private calculateSalesSummary(unitSales: any[]): any {
    return {
      totalUnits: 24,
      soldUnits: unitSales.filter(s => s.saleStatus === 'completed').length,
      reservedUnits: unitSales.filter(s => s.saleStatus === 'reserved').length,
      availableUnits: 24 - unitSales.length,
      totalRevenue: unitSales.reduce((sum, sale) => sum + sale.sellingPrice, 0),
      averageSellingPrice: unitSales.reduce((sum, sale) => sum + sale.sellingPrice, 0) / unitSales.length,
      salesVelocity: 2.5,
      absorptionRate: 10.4,
      completionRate: 80
    };
  }

  private generateSalesPipeline(): any[] {
    return [
      {
        pipelineId: 'pipeline-1',
        unitId: 'A-20',
        prospectName: 'Lisa O\'Sullivan',
        contactDetails: { email: 'lisa@email.com', phone: '+353 87 123 4567', preferredContact: 'email' as const },
        inquiryDate: new Date('2025-06-10'),
        stage: 'viewing' as const,
        probability: 70,
        expectedCloseDate: new Date('2025-07-15'),
        offerAmount: 375000,
        salesAgent: 'John Smith',
        lastContact: new Date('2025-06-14'),
        nextAction: 'Follow up after viewing',
        notes: 'Very interested, good financing in place'
      }
    ];
  }

  private generateMarketingCampaigns(): any[] {
    return [
      {
        campaignId: 'campaign-1',
        name: 'Digital Launch Campaign',
        type: 'digital' as const,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-06-30'),
        budget: 50000,
        spend: 42000,
        leads: 156,
        conversions: 8,
        roi: 3.2,
        targetAudience: 'Young professionals and families',
        channels: ['Google Ads', 'Facebook', 'Instagram', 'Property websites'],
        creatives: ['Video tour', 'CGI imagery', 'Lifestyle photography'],
        performance: {
          impressions: 250000,
          clicks: 3200,
          ctr: 1.28,
          cpm: 16.8,
          cpc: 13.13,
          cpl: 269.23,
          conversionRate: 5.13
        }
      }
    ];
  }

  private generateLeadGeneration(): any[] {
    return [
      { source: 'Website', leads: 45, conversions: 5, conversionRate: 11.1, cost: 5000, cpl: 111.11, quality: 'high' as const },
      { source: 'Property Portal', leads: 62, conversions: 8, conversionRate: 12.9, cost: 8000, cpl: 129.03, quality: 'high' as const },
      { source: 'Social Media', leads: 38, conversions: 2, conversionRate: 5.3, cost: 3000, cpl: 78.95, quality: 'medium' as const }
    ];
  }

  private generateSalesTargets(): any[] {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      targetUnits: 4,
      actualUnits: Math.floor(Math.random() * 5) + 2,
      targetRevenue: 1800000,
      actualRevenue: (Math.floor(Math.random() * 5) + 2) * 450000,
      variance: 0,
      onTrack: true
    }));
  }

  private generateSalesMetrics(unitSales: any[]): any {
    return {
      monthlyVelocity: this.generateMonthlyVelocity(),
      priceAnalysis: this.generatePriceAnalysis(),
      buyerProfiles: this.generateBuyerProfiles(),
      conversionFunnel: this.generateConversionFunnel()
    };
  }

  private generateMonthlyVelocity(): any[] {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      sales: Math.floor(Math.random() * 4) + 1,
      reservations: Math.floor(Math.random() * 3) + 1,
      viewings: Math.floor(Math.random() * 15) + 10,
      inquiries: Math.floor(Math.random() * 25) + 15
    }));
  }

  private generatePriceAnalysis(): any {
    return {
      averagePricePerSqFt: 6500,
      priceGrowth: 8.5,
      priceVariance: 12.3,
      competitorComparison: [
        { competitor: 'Victoria Cross Quarter', averagePrice: 485000, pricePerSqFt: 7200, premiumDiscount: -10.8 },
        { competitor: 'Horgan\'s Quay', averagePrice: 425000, pricePerSqFt: 6200, premiumDiscount: 4.8 }
      ]
    };
  }

  private generateBuyerProfiles(): any[] {
    return [
      { segment: 'Young Professionals', percentage: 45, averageBudget: 420000, conversionRate: 12, timeToDecision: 45 },
      { segment: 'Growing Families', percentage: 35, averageBudget: 485000, conversionRate: 15, timeToDecision: 60 },
      { segment: 'Investors', percentage: 20, averageBudget: 390000, conversionRate: 8, timeToDecision: 30 }
    ];
  }

  private generateConversionFunnel(): any {
    return {
      inquiry: 180,
      viewing: 72,
      offer: 28,
      saleAgreed: 18,
      completed: 15,
      conversionRates: {
        inquiryToViewing: 40,
        viewingToOffer: 38.9,
        offerToSale: 64.3,
        saleToCompletion: 83.3
      }
    };
  }

  private generateSkills(role: string): string[] {
    const skillsMap = {
      'Lead Architect': ['Architectural Design', 'Planning Applications', 'BIM', 'Project Management'],
      'Site Manager': ['Construction Management', 'Health & Safety', 'Quality Control', 'Team Leadership'],
      'Structural Engineer': ['Structural Analysis', 'Foundation Design', 'Building Regulations', 'CAD Software']
    };
    return skillsMap[role] || ['Professional Services'];
  }

  private generateConsultantTeams(coreTeam: any[]): any[] {
    return [
      {
        discipline: 'Architecture',
        lead: coreTeam.find(m => m.role === 'Lead Architect') || coreTeam[0],
        team: coreTeam.filter(m => m.role.includes('Architect')),
        scope: ['Architectural design', 'Planning applications', 'Construction drawings'],
        deliverables: ['Planning drawings', 'Construction details', 'Specifications'],
        programme: [
          { phase: 'Design', startDate: new Date('2024-01-15'), endDate: new Date('2024-06-30'), deliverables: ['Planning application'], milestones: ['Planning approval'] }
        ]
      }
    ];
  }

  private generateContractorTeams(): any[] {
    return [
      {
        trade: 'Main Contractor',
        contractor: 'Murphy Construction Ltd',
        supervisor: {
          memberId: 'supervisor-1',
          name: 'Tom Murphy',
          role: 'Site Supervisor',
          company: 'Murphy Construction Ltd',
          email: 'tom@murphyconstruction.ie',
          phone: '+353 21 789 0123',
          responsibilities: ['Daily site management', 'Quality control', 'Safety compliance'],
          directReports: [],
          skills: ['Construction management', 'Health & safety', 'Quality control'],
          availability: 100,
          startDate: new Date('2024-07-01'),
          performance: {
            qualityScore: 88,
            timelinessScore: 85,
            communicationScore: 92,
            overallScore: 88,
            feedback: ['Excellent safety record', 'Good communication with team']
          }
        },
        operatives: [],
        subcontractors: ['Electrical contractor', 'Plumbing contractor', 'Roofing contractor'],
        programme: [
          { phase: 'Groundworks', startDate: new Date('2024-07-01'), endDate: new Date('2024-09-30'), activities: ['Excavation', 'Foundations'], milestones: ['Foundation completion'], dependencies: ['Planning approval'] }
        ]
      }
    ];
  }

  private generateOrganogram(coreTeam: any[]): any {
    return {
      levels: [
        { level: 1, roles: ['Project Manager'] },
        { level: 2, roles: ['Lead Architect', 'Site Manager'] },
        { level: 3, roles: ['Design Team', 'Construction Team'] }
      ],
      relationships: [
        { from: 'Project Manager', to: 'Lead Architect', type: 'reports-to' as const },
        { from: 'Project Manager', to: 'Site Manager', type: 'reports-to' as const }
      ]
    };
  }

  private generateResponsibilityMatrix(): any[] {
    return [
      {
        task: 'Design Development',
        responsible: 'Lead Architect',
        accountable: 'Project Manager',
        consulted: ['Client', 'Planning Consultant'],
        informed: ['Site Manager', 'Cost Consultant']
      },
      {
        task: 'Construction Quality',
        responsible: 'Site Manager',
        accountable: 'Project Manager',
        consulted: ['Lead Architect', 'Structural Engineer'],
        informed: ['Client', 'Cost Consultant']
      }
    ];
  }

  private generateCommunicationPlan(): any {
    return {
      meetings: [
        {
          type: 'Weekly Site Meeting',
          frequency: 'Weekly',
          attendees: ['Project Manager', 'Site Manager', 'Lead Architect'],
          agenda: ['Progress review', 'Issues and risks', 'Next week planning'],
          duration: 60
        },
        {
          type: 'Monthly Client Meeting',
          frequency: 'Monthly',
          attendees: ['Project Manager', 'Client', 'Lead Architect'],
          agenda: ['Progress report', 'Financial update', 'Change requests'],
          duration: 90
        }
      ],
      reports: [
        {
          reportType: 'Weekly Progress Report',
          frequency: 'Weekly',
          recipients: ['Client', 'Project Team'],
          format: 'PDF',
          dueDate: 'Friday 5pm'
        }
      ],
      escalationProcedure: [
        {
          level: 1,
          issues: ['Minor delays', 'Quality issues'],
          escalateTo: 'Site Manager',
          timeframe: '24 hours'
        },
        {
          level: 2,
          issues: ['Major delays', 'Safety incidents'],
          escalateTo: 'Project Manager',
          timeframe: '4 hours'
        }
      ]
    };
  }

  private generateDocumentCategories(): any[] {
    return [
      {
        categoryId: 'drawings',
        name: 'Drawings',
        description: 'Architectural and engineering drawings',
        documents: [],
        subcategories: [
          { categoryId: 'architectural', name: 'Architectural', description: 'Architectural drawings', documents: [], subcategories: [] },
          { categoryId: 'structural', name: 'Structural', description: 'Structural drawings', documents: [], subcategories: [] }
        ]
      },
      {
        categoryId: 'specifications',
        name: 'Specifications',
        description: 'Technical specifications',
        documents: [],
        subcategories: []
      }
    ];
  }

  // Additional helper methods for data generation from config
  private generateSummaryFromConfig(config: any): ProjectBibleSummary {
    // Generate summary from fitzgerald-gardens-config.ts
    return this.processSummaryData({
      'Project Name': config.projectName,
      'Location': config.location,
      'Total Investment': config.totalInvestment
    });
  }

  private generateSOAFromUnits(units: any[]): ScheduleOfAccommodations {
    // Generate SOA from unit data
    return this.processSOAData(units.map(unit => ({
      'Unit ID': unit.id,
      'Unit Type': unit.type,
      'Floor': unit.features.floor,
      'Gross Area': unit.features.sqft,
      'Net Area': unit.features.sqft * 0.9,
      'Bedrooms': unit.features.bedrooms,
      'Bathrooms': unit.features.bathrooms
    })));
  }

  private generateProgrammeFromConfig(config: any): ProjectProgramme {
    // Generate programme from config timeline
    return this.processProgrammeData([
      {
        'Phase': 'Design & Planning',
        'Start Date': '2024-01-15',
        'End Date': '2024-06-30',
        'Duration': 24,
        'Status': 'Completed'
      },
      {
        'Phase': 'Construction',
        'Start Date': config.projectStartDate,
        'End Date': config.estimatedCompletion,
        'Duration': 52,
        'Status': 'In Progress'
      }
    ]);
  }

  private generateMilestonesFromConfig(config: any): MilestoneChecklist {
    // Generate milestones from config
    return this.processMilestoneData([
      {
        'Milestone': 'Planning Permission',
        'Due Date': '2024-03-15',
        'Status': 'Completed',
        'Completion Date': '2024-03-10'
      },
      {
        'Milestone': 'Construction Start',
        'Due Date': config.projectStartDate,
        'Status': 'Completed'
      }
    ]);
  }

  private generateAppointmentsFromConfig(config: any): AppointmentsAndFees {
    // Generate appointments from config contacts
    const teamData = realDataService.getRealTeamMembers();
    return this.processTeamData(teamData);
  }

  private generateSalesFromConfig(config: any, units: any[]): SalesTracker {
    // Generate sales data from config
    return this.processSalesData([
      {
        'Unit ID': 'A-15',
        'Sale Date': '2025-05-15',
        'Sale Price': 380000,
        'Buyer': 'John Smith',
        'Status': 'Sale Agreed'
      }
    ]);
  }

  private generateTeamFromConfig(config: any): ProjectTeamStructure {
    // Generate team structure from config
    const teamData = realDataService.getRealTeamMembers();
    return this.processTeamStructure(teamData);
  }

  private generateDocumentLibraryFromConfig(): DocumentLibrary {
    // Generate document library
    return this.processDocumentLibrary([]);
  }

  private async generatePDFContent(projectBible: ProjectBibleData, options: ProjectBibleExport): Promise<string> {
    // This would generate actual PDF content using a library like react-pdf
    return 'PDF_CONTENT_PLACEHOLDER';
  }

  private async generateExcelContent(projectBible: ProjectBibleData, sections: string[]): Promise<string> {
    // This would generate actual Excel content using a library like SheetJS
    return 'EXCEL_CONTENT_PLACEHOLDER';
  }

  private syncSalesWithUnits(salesTracker: SalesTracker, units: any[]): void {
    // Sync sales data with unit statuses
    salesTracker.unitSales.forEach(sale => {
      const unit = units.find(u => u.id === sale.unitId);
      if (unit) {
        unit.status = sale.saleStatus === 'completed' ? 'sold' : 
                     sale.saleStatus === 'reserved' ? 'reserved' : 'available';
      }
    });
  }

  private syncTeamWithRealContacts(teamStructure: ProjectTeamStructure): void {
    // Sync team structure with real contact data
    const realContacts = realDataService.getRealTeamMembers();
    teamStructure.coreTeam = teamStructure.coreTeam.map(member => {
      const realContact = realContacts.find(c => c.name === member.name);
      if (realContact) {
        return { ...member, ...realContact };
      }
      return member;
    });
  }

  private syncMilestonesWithTimeline(milestoneChecklist: MilestoneChecklist, config: any): void {
    // Sync milestones with project timeline
    const realTimeline = realDataService.getRealProjectTimeline();
    
    // Update milestone dates based on real timeline
    milestoneChecklist.categories.forEach(category => {
      category.milestones.forEach(milestone => {
        if (milestone.name.includes('Completion')) {
          milestone.dueDate = realTimeline.estimatedCompletion;
        }
      });
    });
  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

export const projectBibleService = ProjectBibleService.getInstance();