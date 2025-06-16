/**
 * Enterprise Project Data Hook
 * React hook for unified project data access with real-time synchronization
 * 
 * @fileoverview Custom React hook providing enterprise-grade project data management
 * @version 2.0.0
 * @author Property Development Platform Team
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { projectDataService } from '@/services/ProjectDataService';
import { realDataService } from '@/services/RealDataService';
import { 
  Project, 
  Unit, 
  UnitStatus, 
  UnitType,
  ProjectStateUpdate,
  TeamMember,
  Invoice,
  FeeProposal,
  ProfessionalAppointment
} from '@/types/project';

// =============================================================================
// HOOK INTERFACES
// =============================================================================

export interface UseProjectDataResult {
  // Core project data
  project: Project | null;
  units: ReadonlyArray<Unit>;
  isLoading: boolean;
  error: string | null;
  
  // Real-time metrics (automatically calculated)
  totalUnits: number;
  soldUnits: number;
  reservedUnits: number;
  availableUnits: number;
  totalRevenue: number;
  averageUnitPrice: number;
  salesVelocity: number;
  conversionRate: number;
  
  // Unit filtering and management
  filteredUnits: ReadonlyArray<Unit>;
  setUnitFilter: (filter: UnitFilterOptions) => void;
  unitFilter: UnitFilterOptions;
  
  // Unit operations
  updateUnitStatus: (unitId: string, newStatus: UnitStatus, reason?: string) => Promise<boolean>;
  updateUnitPrice: (unitId: string, newPrice: number, reason?: string) => Promise<boolean>;
  getUnitById: (unitId: string) => Unit | null;
  getUnitsForSitePlan: () => ReadonlyArray<SitePlanUnit>;
  
  // Real-time updates
  lastUpdated: Date | null;
  isDataStale: boolean;
  refreshData: () => void;
  
  // Team management data
  teamMembers: ReadonlyArray<TeamMember>;
  
  // Financial data
  invoices: ReadonlyArray<Invoice>;
  feeProposals: ReadonlyArray<FeeProposal>;
  professionalAppointments: ReadonlyArray<ProfessionalAppointment>;
}

export interface UnitFilterOptions {
  status?: UnitStatus | 'all';
  type?: UnitType | 'all';
  building?: number | 'all';
  floor?: number | 'all';
  priceRange?: {
    min: number;
    max: number;
  };
  searchTerm?: string;
}

export interface SitePlanUnit {
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
}

// =============================================================================
// MAIN HOOK IMPLEMENTATION
// =============================================================================

export function useProjectData(projectId: string = 'fitzgerald-gardens'): UseProjectDataResult {
  // Core state management
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [unitFilter, setUnitFilterState] = useState<UnitFilterOptions>({
    status: 'all',
    type: 'all',
    building: 'all',
    floor: 'all'
  });

  // Initialize project data with API-first approach and graceful fallback
  useEffect(() => {
    const initializeProject = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let projectData = null;

        // Try to fetch from API first (for persistent data)
        try {
          const response = await fetch(`/api/projects/${projectId}`);
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data) {
              projectData = result.data;
            }
          }
        } catch (apiError) {
          console.log('API unavailable, falling back to service layer');
        }

        // Fallback to service layer if API fails (maintains existing functionality)
        if (!projectData) {
          projectData = projectDataService.getProject(projectId);
          if (!projectData) {
            // Initialize project based on projectId
            switch (projectId) {
              case 'fitzgerald-gardens':
                projectData = projectDataService.initializeFitzgeraldGardens();
                break;
              case 'ellwood':
                projectData = projectDataService.initializeEllwood();
                break;
              case 'ballymakenny-view':
                projectData = projectDataService.initializeBallymakenny();
                break;
              default:
                projectData = projectDataService.initializeFitzgeraldGardens(); // fallback
            }
          }
        }

        setProject(projectData);
        setLastUpdated(new Date());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project data');
      } finally {
        setIsLoading(false);
      }
    };

    initializeProject();
  }, [projectId]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!projectId) return;

    const unsubscribe = projectDataService.subscribe(projectId, (update: ProjectStateUpdate) => {
      // Refresh project data when updates occur
      const updatedProject = projectDataService.getProject(projectId);
      if (updatedProject) {
        setProject(updatedProject);
        setLastUpdated(new Date());
      }
    });

    return unsubscribe;
  }, [projectId]);

  // Derived data (memoized for performance)
  const units = useMemo(() => project?.units || [], [project]);
  
  const metrics = useMemo(() => ({
    totalUnits: project?.metrics.totalUnits || 0,
    soldUnits: project?.metrics.soldUnits || 0,
    reservedUnits: project?.metrics.reservedUnits || 0,
    availableUnits: project?.metrics.availableUnits || 0,
    totalRevenue: project?.metrics.totalRevenue || 0,
    averageUnitPrice: project?.metrics.averageUnitPrice || 0,
    salesVelocity: project?.metrics.salesVelocity || 0,
    conversionRate: project?.metrics.conversionRate || 0
  }), [project]);

  // Filtered units based on current filter options
  const filteredUnits = useMemo(() => {
    if (!units.length) return [];

    return units.filter(unit => {
      // Status filter
      if (unitFilter.status && unitFilter.status !== 'all' && unit.status !== unitFilter.status) {
        return false;
      }

      // Type filter
      if (unitFilter.type && unitFilter.type !== 'all' && unit.type !== unitFilter.type) {
        return false;
      }

      // Building filter
      if (unitFilter.building && unitFilter.building !== 'all' && unit.features.building !== unitFilter.building) {
        return false;
      }

      // Floor filter
      if (unitFilter.floor && unitFilter.floor !== 'all' && unit.features.floor !== unitFilter.floor) {
        return false;
      }

      // Price range filter
      if (unitFilter.priceRange) {
        const price = unit.pricing.currentPrice;
        if (price < unitFilter.priceRange.min || price > unitFilter.priceRange.max) {
          return false;
        }
      }

      // Search term filter
      if (unitFilter.searchTerm) {
        const searchLower = unitFilter.searchTerm.toLowerCase();
        const searchFields = [
          unit.number,
          unit.type,
          unit.buyer?.name || '',
          unit.buyer?.email || ''
        ].join(' ').toLowerCase();
        
        if (!searchFields.includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  }, [units, unitFilter]);

  // =============================================================================
  // UNIT OPERATIONS
  // =============================================================================

  const updateUnitStatus = useCallback(async (
    unitId: string, 
    newStatus: UnitStatus, 
    reason: string = 'Status updated by user'
  ): Promise<boolean> => {
    try {
      // Try API first for persistent updates
      try {
        const response = await fetch(`/api/projects/${projectId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'unit_status_update',
            unitId,
            status: newStatus,
            reason
          })
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            // Update local state with API response
            setProject(result.data);
            setLastUpdated(new Date());
            return true;
          }
        }
      } catch (apiError) {
        console.log('API update failed, falling back to service layer');
      }

      // Fallback to service layer
      const success = projectDataService.updateUnitStatus(
        projectId, 
        unitId, 
        newStatus, 
        reason,
        'Developer User' // Would come from auth context in real app
      );

      if (success) {
        // Data will be automatically updated via subscription
        return true;
      } else {
        setError('Failed to update unit status');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update unit status');
      return false;
    }
  }, [projectId]);

  const updateUnitPrice = useCallback(async (
    unitId: string, 
    newPrice: number, 
    reason: string = 'AI pricing recommendation'
  ): Promise<boolean> => {
    try {
      // Try API first for persistent updates
      try {
        const response = await fetch(`/api/projects/${projectId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'unit_price_update',
            unitId,
            newPrice,
            reason
          })
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            // Update local state with API response
            setProject(result.data);
            setLastUpdated(new Date());
            return true;
          }
        }
      } catch (apiError) {
        console.log('API price update failed, falling back to service layer');
      }

      // Fallback to service layer
      const success = projectDataService.updateUnitPrice(
        projectId, 
        unitId, 
        newPrice, 
        reason,
        'AI Analytics'
      );

      if (success) {
        // Data will be automatically updated via subscription
        return true;
      } else {
        setError('Failed to update unit price');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update unit price');
      return false;
    }
  }, [projectId]);

  const getUnitById = useCallback((unitId: string): Unit | null => {
    return units.find(unit => unit.id === unitId) || null;
  }, [units]);

  const getUnitsForSitePlan = useCallback((): ReadonlyArray<SitePlanUnit> => {
    return projectDataService.getUnitsForSitePlan(projectId);
  }, [projectId, lastUpdated]); // Re-run when data updates

  const setUnitFilter = useCallback((filter: UnitFilterOptions) => {
    setUnitFilterState(prev => ({
      ...prev,
      ...filter
    }));
  }, []);

  const refreshData = useCallback(() => {
    const updatedProject = projectDataService.getProject(projectId);
    if (updatedProject) {
      setProject(updatedProject);
      setLastUpdated(new Date());
    }
  }, [projectId]);

  // Check if data is stale (older than 5 minutes)
  const isDataStale = useMemo(() => {
    if (!lastUpdated) return false;
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return lastUpdated < fiveMinutesAgo;
  }, [lastUpdated]);

  // =============================================================================
  // REAL DATA INTEGRATION - TEAM MEMBERS
  // =============================================================================
  // Integrated with real data service for actual project contacts

  const teamMembers: ReadonlyArray<TeamMember> = useMemo(() => {
    // Get real team members from configuration
    const realTeamMembers = realDataService.getRealTeamMembers();
    
    // Merge with template data for complete team structure
    const templateMembers = [
      {
        id: 'member-template-1',
        name: 'Michael Walsh',
        role: 'Structural Engineer',
        company: 'Walsh Engineering',
        email: 'mwalsh@walsheng.ie',
        phone: '+353 21 234 5678',
        status: 'active' as const,
        department: 'design' as const,
        specialties: ['Structural Analysis', 'Foundation Design', 'Building Regulations'],
        hourlyRate: 95,
        joinDate: new Date('2024-02-01'),
        lastActivity: new Date('2025-06-14'),
        currentTasks: 2,
        completedTasks: 8,
        location: 'Cork, Ireland'
      },
      {
        id: 'member-template-2',
        name: 'Emma Kelly',
        role: 'Interior Designer',
        company: 'Kelly Interiors',
        email: 'emma@kellyint.ie',
        phone: '+353 21 345 6789',
        status: 'busy' as const,
        department: 'design' as const,
        specialties: ['Interior Design', 'Space Planning', 'Material Selection'],
        hourlyRate: 65,
        joinDate: new Date('2024-03-10'),
        lastActivity: new Date('2025-06-13'),
        currentTasks: 4,
        completedTasks: 15,
        location: 'Cork, Ireland'
      },
      {
        id: 'member-template-3',
        name: 'David Ryan',
        role: 'Project Manager',
        company: 'Ryan Build Ltd',
        email: 'dryan@ryanbuild.ie',
        phone: '+353 21 567 8901',
        status: 'active' as const,
        department: 'construction' as const,
        specialties: ['Project Management', 'Schedule Planning', 'Cost Control'],
        hourlyRate: 80,
        joinDate: new Date('2024-01-20'),
        lastActivity: new Date('2025-06-14'),
        currentTasks: 5,
        completedTasks: 18,
        location: 'Cork, Ireland'
      },
      {
        id: 'member-template-4',
        name: 'Lisa Connolly',
        role: 'QS Surveyor',
        company: 'Connolly Quantity Surveyors',
        email: 'lisa@connollyqs.ie',
        phone: '+353 21 678 9012',
        status: 'active' as const,
        department: 'construction' as const,
        specialties: ['Quantity Surveying', 'Cost Estimation', 'Contract Administration'],
        hourlyRate: 70,
        joinDate: new Date('2024-02-28'),
        lastActivity: new Date('2025-06-13'),
        currentTasks: 3,
        completedTasks: 14,
        location: 'Cork, Ireland'
      }
    ];
    
    // Combine real data with template data
    return [...realTeamMembers, ...templateMembers];
  }, [projectId]);

  const invoices: ReadonlyArray<Invoice> = useMemo(() => [
    {
      id: 'inv-1',
      invoiceNumber: 'INV-2025-001',
      provider: 'O\'Connor Architecture',
      providerEmail: 'sarah@oconnor-arch.ie',
      providerPhone: '+353 21 123 4567',
      amount: 12500,
      netAmount: 10569,
      vatAmount: 1931,
      date: new Date('2025-06-10'),
      dueDate: new Date('2025-07-10'),
      status: 'paid',
      type: 'Design Services',
      description: 'Architectural design services for Phase 1 planning application',
      category: 'design',
      approvedBy: 'Project Manager',
      approvedDate: new Date('2025-06-08'),
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 'inv-2',
      invoiceNumber: 'INV-2025-002',
      provider: 'Murphy Construction',
      providerEmail: 'pmurphy@murphycon.ie',
      providerPhone: '+353 21 456 7890',
      amount: 85000,
      netAmount: 71951,
      vatAmount: 13049,
      date: new Date('2025-06-08'),
      dueDate: new Date('2025-07-08'),
      status: 'pending',
      type: 'Construction Phase 2',
      description: 'Foundation work and structural elements for buildings 1-3',
      category: 'construction'
    },
    {
      id: 'inv-3',
      invoiceNumber: 'INV-2025-003',
      provider: 'Walsh Engineering',
      providerEmail: 'mwalsh@walsheng.ie',
      providerPhone: '+353 21 234 5678',
      amount: 8200,
      netAmount: 6943,
      vatAmount: 1257,
      date: new Date('2025-06-05'),
      dueDate: new Date('2025-07-05'),
      status: 'approved',
      type: 'Structural Review',
      description: 'Structural engineering review and certification',
      category: 'design',
      approvedBy: 'Technical Director',
      approvedDate: new Date('2025-06-06')
    },
    {
      id: 'inv-4',
      invoiceNumber: 'INV-2025-004',
      provider: 'Kelly Interiors',
      providerEmail: 'emma@kellyint.ie',
      providerPhone: '+353 21 345 6789',
      amount: 15800,
      netAmount: 13390,
      vatAmount: 2410,
      date: new Date('2025-06-03'),
      dueDate: new Date('2025-07-03'),
      status: 'paid',
      type: 'Interior Design Package',
      description: 'Interior design specifications and material selection',
      category: 'design',
      approvedBy: 'Project Manager',
      approvedDate: new Date('2025-06-01'),
      paymentMethod: 'Bank Transfer'
    }
  ], []);

  const feeProposals: ReadonlyArray<FeeProposal> = useMemo(() => [
    {
      id: 'prop-1',
      title: 'Landscape Architecture Services',
      provider: 'Green Spaces Ltd',
      totalAmount: 24500,
      status: 'under_review',
      submittedDate: new Date('2025-06-12'),
      description: 'Comprehensive landscape design and implementation for common areas',
      breakdownItems: [
        { description: 'Design Phase', quantity: 1, rate: 8500, total: 8500 },
        { description: 'Planning Documentation', quantity: 1, rate: 4000, total: 4000 },
        { description: 'Implementation Supervision', quantity: 60, rate: 200, total: 12000 }
      ],
      terms: 'Payment in 3 stages: 30% on contract signing, 40% on design approval, 30% on completion',
      validUntil: new Date('2025-07-12')
    },
    {
      id: 'prop-2',
      title: 'Security System Installation',
      provider: 'SecureTech Solutions',
      totalAmount: 18750,
      status: 'approved',
      submittedDate: new Date('2025-06-01'),
      reviewDate: new Date('2025-06-05'),
      description: 'Complete security system including CCTV, access control, and monitoring',
      breakdownItems: [
        { description: 'CCTV System', quantity: 1, rate: 12000, total: 12000 },
        { description: 'Access Control', quantity: 1, rate: 4500, total: 4500 },
        { description: 'Installation & Setup', quantity: 15, rate: 150, total: 2250 }
      ],
      terms: 'Payment on completion and successful testing',
      validUntil: new Date('2025-07-01')
    }
  ], []);

  const professionalAppointments: ReadonlyArray<ProfessionalAppointment> = useMemo(() => [
    {
      id: 'app-1',
      professional: 'Dr. James Mitchell',
      company: 'Mitchell Geo-Technical',
      role: 'Geotechnical Engineer',
      appointmentType: 'engineer',
      appointmentDate: new Date('2025-06-20'),
      status: 'scheduled',
      fee: 2500,
      description: 'Site investigation and geotechnical assessment for Phase 3',
      duration: 4,
      location: 'Project Site, Cork',
      contactEmail: 'j.mitchell@mitchellgeo.ie',
      contactPhone: '+353 21 987 6543',
      followUpRequired: true
    },
    {
      id: 'app-2',
      professional: 'Mary O\'Sullivan',
      company: 'O\'Sullivan & Partners',
      role: 'Planning Consultant',
      appointmentType: 'consultant',
      appointmentDate: new Date('2025-06-15'),
      status: 'completed',
      fee: 1800,
      description: 'Planning application review and compliance consultation',
      duration: 3,
      location: 'Cork City Council Offices',
      contactEmail: 'mary@osullivanpartners.ie',
      contactPhone: '+353 21 456 7891',
      notes: 'Planning application approved with minor conditions',
      followUpRequired: false
    },
    {
      id: 'app-3',
      professional: 'Thomas Brady',
      company: 'Brady Legal Services',
      role: 'Property Solicitor',
      appointmentType: 'solicitor',
      appointmentDate: new Date('2025-06-25'),
      status: 'scheduled',
      fee: 3200,
      description: 'Legal review of construction contracts and insurance policies',
      duration: 2,
      location: 'Brady Legal Offices, Cork',
      contactEmail: 'thomas@bradylegal.ie',
      contactPhone: '+353 21 234 5679',
      followUpRequired: true
    }
  ], []);

  // =============================================================================
  // RETURN HOOK RESULT
  // =============================================================================

  return {
    // Core project data
    project,
    units,
    isLoading,
    error,
    
    // Real-time metrics
    ...metrics,
    
    // Unit filtering and management
    filteredUnits,
    setUnitFilter,
    unitFilter,
    
    // Unit operations
    updateUnitStatus,
    updateUnitPrice,
    getUnitById,
    getUnitsForSitePlan,
    
    // Real-time updates
    lastUpdated,
    isDataStale,
    refreshData,
    
    // Team management data
    teamMembers,
    
    // Financial data
    invoices,
    feeProposals,
    professionalAppointments
  };
}

export default useProjectData;