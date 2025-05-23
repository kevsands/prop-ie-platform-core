'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types
export interface Tender {
  id: string;
  title: string;
  project: string;
  projectId: string;
  description: string;
  status: 'draft' | 'open' | 'evaluating' | 'awarded' | 'closed';
  deadline: string;
  budget: {
    min: number;
    max: number;
  };
  bidsReceived: number;
  daysLeft: number;
  categories: string[];
  requirements: {
    experience: string;
    certifications: string[];
    insurance: string;
    documentation: string[];
  };
  bids: Bid[];
  createdAt: string;
  updatedAt: string;
  attachments: Attachment[];
  createdBy: string;
  aiRecommendation?: string;
}

export interface Bid {
  id: string;
  tenderId: string;
  contractor: {
    id: string;
    name: string;
    logo?: string;
    verificationStatus: 'pending' | 'verified' | 'rejected';
    foundedYear: number;
    companySize: string;
    previousProjects: number;
  };
  amount: number;
  timeline: number;
  score: number;
  submitted: string;
  status: 'submitted' | 'shortlisted' | 'rejected' | 'awarded';
  attachments: Attachment[];
  aiAnalysis: {
    priceScore: number;
    experienceScore: number;
    riskScore: number;
    valueScore: number;
    strengths: string[];
    concerns: string[];
    recommendation: string;
    timelineAssessment: string;
    qualityMetrics: {
      previousWorkQuality: number;
      materialQuality: number;
      workmanshipWarranty: number;
    };
    financialHealth: {
      stabilityScore: number;
      cashflowRisk: string;
      paymentHistory: string;
    };
    complianceStatus: {
      certifications: boolean;
      insurance: boolean;
      licenses: boolean;
    };
  };
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface TenderStats {
  active: number;
  evaluating: number;
  awarded: number;
  closed: number;
  totalValue: number;
  avgBids: number;
  avgSavings: number;
  avgCompletionRate: number;
  trendingCategories: { category: string; count: number }[];
}

export interface TenderFilters {
  status?: string[];
  category?: string[];
  budget?: { min?: number; max?: number };
  project?: string;
  search?: string;
  dateRange?: { from?: string; to?: string };
}

export interface CreateTenderInput {
  title: string;
  project: string;
  description: string;
  budget: {
    min: number;
    max: number;
  };
  deadline: string;
  categories: string[];
  requirements: {
    experience: string;
    certifications: string[];
    insurance: string;
    documentation: string[];
  };
  attachments?: File[];
}

// Mock data for tenders
const mockTenders: Tender[] = [
  {
    id: 'tender-001',
    title: 'Electrical Installation - Phase 3',
    project: 'Fitzgerald Gardens',
    projectId: 'proj-001',
    description: 'Comprehensive electrical installation for Phase 3 of the Fitzgerald Gardens development, including wiring, fixtures, and smart home integration.',
    status: 'evaluating',
    deadline: '2024-06-15',
    budget: {
      min: 450000,
      max: 550000
    },
    bidsReceived: 6,
    daysLeft: 3,
    categories: ['Electrical', 'MEP'],
    requirements: {
      experience: '5+ years commercial',
      certifications: ['RECI', 'Safe Electric'],
      insurance: '€5M liability',
      documentation: ['Company Profile', 'Financial Statements', 'Safety Statement']
    },
    bids: [
      {
        id: 'bid-001',
        tenderId: 'tender-001',
        contractor: {
          id: 'cont-001',
          name: 'Elite Electrical Services',
          logo: '/images/contractors/elite-electrical.png',
          verificationStatus: 'verified',
          foundedYear: 2005,
          companySize: '50-100',
          previousProjects: 78
        },
        amount: 485000,
        timeline: 90,
        score: 92,
        submitted: '2024-05-10',
        status: 'shortlisted',
        attachments: [
          {
            id: 'att-001',
            name: 'Proposal.pdf',
            size: 4500000,
            type: 'application/pdf',
            url: '/attachments/bid-001/proposal.pdf',
            uploadedAt: '2024-05-10'
          }
        ],
        aiAnalysis: {
          priceScore: 85,
          experienceScore: 95,
          riskScore: 12,
          valueScore: 88,
          strengths: ['Extensive experience', 'Strong certifications', 'Good safety record'],
          concerns: ['Slightly above median price', 'Limited availability in Q2'],
          recommendation: 'Strong candidate - negotiate on price',
          timelineAssessment: 'Realistic timeline with appropriate milestones',
          qualityMetrics: {
            previousWorkQuality: 92,
            materialQuality: 88,
            workmanshipWarranty: 5
          },
          financialHealth: {
            stabilityScore: 90,
            cashflowRisk: 'Low',
            paymentHistory: 'Excellent'
          },
          complianceStatus: {
            certifications: true,
            insurance: true,
            licenses: true
          }
        }
      },
      {
        id: 'bid-002',
        tenderId: 'tender-001',
        contractor: {
          id: 'cont-002',
          name: 'PowerTech Solutions',
          verificationStatus: 'verified',
          foundedYear: 2010,
          companySize: '20-50',
          previousProjects: 42
        },
        amount: 468000,
        timeline: 95,
        score: 88,
        submitted: '2024-05-11',
        status: 'shortlisted',
        attachments: [
          {
            id: 'att-002',
            name: 'Technical-Proposal.pdf',
            size: 3800000,
            type: 'application/pdf',
            url: '/attachments/bid-002/technical-proposal.pdf',
            uploadedAt: '2024-05-11'
          }
        ],
        aiAnalysis: {
          priceScore: 90,
          experienceScore: 85,
          riskScore: 18,
          valueScore: 86,
          strengths: ['Competitive pricing', 'Available immediately', 'Good references'],
          concerns: ['Less experience with similar projects', 'Smaller team size'],
          recommendation: 'Good value option - verify capacity',
          timelineAssessment: 'Slightly aggressive timeline - may need buffers',
          qualityMetrics: {
            previousWorkQuality: 85,
            materialQuality: 86,
            workmanshipWarranty: 3
          },
          financialHealth: {
            stabilityScore: 82,
            cashflowRisk: 'Medium',
            paymentHistory: 'Good'
          },
          complianceStatus: {
            certifications: true,
            insurance: true,
            licenses: true
          }
        }
      }
    ],
    createdAt: '2024-04-15T13:45:00Z',
    updatedAt: '2024-05-12T09:30:00Z',
    attachments: [
      {
        id: 'tender-att-001',
        name: 'Requirements-Specification.pdf',
        size: 2800000,
        type: 'application/pdf',
        url: '/attachments/tender-001/requirements.pdf',
        uploadedAt: '2024-04-15'
      },
      {
        id: 'tender-att-002',
        name: 'Phase3-Plans.dwg',
        size: 5600000,
        type: 'application/dwg',
        url: '/attachments/tender-001/plans.dwg',
        uploadedAt: '2024-04-15'
      }
    ],
    createdBy: 'user-001',
    aiRecommendation: 'Based on comprehensive analysis, Elite Electrical Services represents the best value with superior experience and quality metrics, despite 3.6% higher price than the lowest bid.'
  },
  {
    id: 'tender-002',
    title: 'Foundation Work - Block B',
    project: 'Riverside Manor',
    projectId: 'proj-002',
    description: 'Complete foundation and groundwork for Block B of Riverside Manor, including excavation, reinforcement, and concrete pouring.',
    status: 'open',
    deadline: '2024-06-28',
    budget: {
      min: 1200000,
      max: 1500000
    },
    bidsReceived: 3,
    daysLeft: 16,
    categories: ['Groundworks', 'Structural'],
    requirements: {
      experience: '10+ years',
      certifications: ['ISO 9001', 'CIRI'],
      insurance: '€10M liability',
      documentation: ['Project Portfolio', 'Equipment List', 'Quality Assurance Plan']
    },
    bids: [],
    createdAt: '2024-05-01T10:20:00Z',
    updatedAt: '2024-05-15T14:15:00Z',
    attachments: [
      {
        id: 'tender-att-003',
        name: 'Block-B-Specifications.pdf',
        size: 4200000,
        type: 'application/pdf',
        url: '/attachments/tender-002/specifications.pdf',
        uploadedAt: '2024-05-01'
      }
    ],
    createdBy: 'user-002'
  },
  {
    id: 'tender-003',
    title: 'Landscaping & External Works',
    project: 'Fitzgerald Gardens',
    projectId: 'proj-001',
    description: 'Comprehensive landscaping, paving, and external works for the common areas and garden spaces of Fitzgerald Gardens.',
    status: 'open',
    deadline: '2024-07-10',
    budget: {
      min: 350000,
      max: 420000
    },
    bidsReceived: 4,
    daysLeft: 28,
    categories: ['Landscaping', 'External Works'],
    requirements: {
      experience: '7+ years landscaping',
      certifications: ['Bord Bia', 'Association of Landscape Contractors'],
      insurance: '€3M liability',
      documentation: ['Portfolio', 'Material Specifications', 'Maintenance Plan']
    },
    bids: [],
    createdAt: '2024-05-10T11:30:00Z',
    updatedAt: '2024-05-16T16:45:00Z',
    attachments: [
      {
        id: 'tender-att-004',
        name: 'Landscape-Design.pdf',
        size: 6800000,
        type: 'application/pdf',
        url: '/attachments/tender-003/landscape-design.pdf',
        uploadedAt: '2024-05-10'
      }
    ],
    createdBy: 'user-001'
  },
  {
    id: 'tender-004',
    title: 'Interior Fit-Out - Phase 1',
    project: 'Ellwood',
    projectId: 'proj-003',
    description: 'Complete interior fit-out for Phase 1 units of Ellwood development, including kitchens, bathrooms, wardrobes, and finishes.',
    status: 'draft',
    deadline: '2024-08-15',
    budget: {
      min: 680000,
      max: 750000
    },
    bidsReceived: 0,
    daysLeft: 64,
    categories: ['Interior Fit-Out', 'Joinery'],
    requirements: {
      experience: '5+ years high-end residential',
      certifications: ['RIAI Accredited', 'CIRI'],
      insurance: '€5M liability',
      documentation: ['Project Portfolio', 'Material Samples', 'Quality Control Plan']
    },
    bids: [],
    createdAt: '2024-05-18T09:15:00Z',
    updatedAt: '2024-05-18T09:15:00Z',
    attachments: [
      {
        id: 'tender-att-005',
        name: 'Interior-Specifications.pdf',
        size: 5200000,
        type: 'application/pdf',
        url: '/attachments/tender-004/specifications.pdf',
        uploadedAt: '2024-05-18'
      }
    ],
    createdBy: 'user-003'
  },
  {
    id: 'tender-005',
    title: 'HVAC Installation',
    project: 'Riverside Manor',
    projectId: 'proj-002',
    description: 'Complete HVAC system installation for all units in Riverside Manor, including heat pumps, underfloor heating, and ventilation.',
    status: 'awarded',
    deadline: '2024-03-30',
    budget: {
      min: 820000,
      max: 950000
    },
    bidsReceived: 5,
    daysLeft: 0,
    categories: ['HVAC', 'MEP'],
    requirements: {
      experience: '8+ years commercial HVAC',
      certifications: ['RGII', 'SEAI Registered', 'ISO 9001'],
      insurance: '€5M liability',
      documentation: ['Technical Proposal', 'Project Timeline', 'Testing Protocol']
    },
    bids: [
      {
        id: 'bid-003',
        tenderId: 'tender-005',
        contractor: {
          id: 'cont-003',
          name: 'ClimateControl Ireland',
          logo: '/images/contractors/climate-control.png',
          verificationStatus: 'verified',
          foundedYear: 2008,
          companySize: '50-100',
          previousProjects: 62
        },
        amount: 885000,
        timeline: 120,
        score: 95,
        submitted: '2024-03-15',
        status: 'awarded',
        attachments: [
          {
            id: 'att-003',
            name: 'HVAC-Proposal.pdf',
            size: 7200000,
            type: 'application/pdf',
            url: '/attachments/bid-003/hvac-proposal.pdf',
            uploadedAt: '2024-03-15'
          }
        ],
        aiAnalysis: {
          priceScore: 88,
          experienceScore: 96,
          riskScore: 8,
          valueScore: 94,
          strengths: ['Extensive HVAC experience', 'Energy-efficient solutions', 'Excellent project management'],
          concerns: ['Slightly longer timeline', 'Mid-range pricing'],
          recommendation: 'Top candidate - excellent experience and low risk profile',
          timelineAssessment: 'Conservative but realistic timeline with detailed milestones',
          qualityMetrics: {
            previousWorkQuality: 95,
            materialQuality: 92,
            workmanshipWarranty: 7
          },
          financialHealth: {
            stabilityScore: 94,
            cashflowRisk: 'Low',
            paymentHistory: 'Excellent'
          },
          complianceStatus: {
            certifications: true,
            insurance: true,
            licenses: true
          }
        }
      }
    ],
    createdAt: '2024-03-01T12:00:00Z',
    updatedAt: '2024-04-05T10:30:00Z',
    attachments: [
      {
        id: 'tender-att-006',
        name: 'HVAC-Requirements.pdf',
        size: 4800000,
        type: 'application/pdf',
        url: '/attachments/tender-005/hvac-requirements.pdf',
        uploadedAt: '2024-03-01'
      }
    ],
    createdBy: 'user-002',
    aiRecommendation: 'ClimateControl Ireland offers the best overall value with exceptional experience and quality metrics. Their energy-efficient approach aligns with sustainability goals and will reduce long-term operational costs.'
  }
];

// Mock stats
const mockStats: TenderStats = {
  active: 12,
  evaluating: 5,
  awarded: 24,
  closed: 8,
  totalValue: 18500000,
  avgBids: 5.2,
  avgSavings: 8.3,
  avgCompletionRate: 94.7,
  trendingCategories: [
    { category: 'MEP', count: 8 },
    { category: 'Electrical', count: 6 },
    { category: 'Fit-Out', count: 5 },
    { category: 'Structural', count: 4 }
  ]
};

// TenderService with React Query hooks
export const useTenders = (filters?: TenderFilters) => {
  return useQuery({
    queryKey: ['tenders', filters],
    queryFn: async () => {
      // In a real app, this would call your API with the filters
      // For mock, let's filter the tenders based on the provided filters
      let filteredTenders = [...mockTenders];

      if (filters) {
        if (filters.status && filters.status.length> 0) {
          filteredTenders = filteredTenders.filter(t => filters.status?.includes(t.status));
        }

        if (filters.category && filters.category.length> 0) {
          filteredTenders = filteredTenders.filter(t => 
            t.categories.some(cat => filters.category?.includes(cat))
          );
        }

        if (filters.project) {
          filteredTenders = filteredTenders.filter(t => 
            t.project.toLowerCase().includes(filters.project!.toLowerCase())
          );
        }

        if (filters.budget?.min || filters.budget?.max) {
          filteredTenders = filteredTenders.filter(t => {
            let match = true;
            if (filters.budget?.min) {
              match = match && t.budget.max>= filters.budget.min;
            }
            if (filters.budget?.max) {
              match = match && t.budget.min <= filters.budget.max;
            }
            return match;
          });
        }

        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredTenders = filteredTenders.filter(t => 
            t.title.toLowerCase().includes(searchLower) || 
            t.description.toLowerCase().includes(searchLower) ||
            t.categories.some(cat => cat.toLowerCase().includes(searchLower))
          );
        }
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve500));

      return filteredTenders;
    },
    staleTime: 60000 // 1 minute
  });
};

export const useTender = (id: string) => {
  return useQuery({
    queryKey: ['tender', id],
    queryFn: async () => {
      // In a real app, this would call your API with the id
      const tender = mockTenders.find(t => t.id === id);

      if (!tender) {
        throw new Error('Tender not found');
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve300));

      return tender;
    },
    staleTime: 60000 // 1 minute
  });
};

export const useTenderStats = () => {
  return useQuery({
    queryKey: ['tenderStats'],
    queryFn: async () => {
      // In a real app, this would call your API to get stats
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve300));

      return mockStats;
    },
    staleTime: 300000 // 5 minutes
  });
};

export const useCreateTender = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTenderInput) => {
      // In a real app, this would call your API to create a tender
      // For mock, generate an ID and return a new tender
      const newTender: Tender = {
        id: `tender-${Date.now().toString().substring(9)}`,
        title: input.title,
        project: input.project,
        projectId: `proj-${Date.now().toString().substring(9)}`,
        description: input.description,
        status: 'draft',
        deadline: input.deadline,
        budget: input.budget,
        bidsReceived: 0,
        daysLeft: Math.ceil((new Date(input.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
        categories: input.categories,
        requirements: input.requirements,
        bids: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        attachments: [],
        createdBy: 'current-user' // In real app, get from auth context
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve800));

      return newTender;
    },
    onSuccess: () => {
      // Invalidate tenders query to refetch with the new tender
      queryClient.invalidateQueries({ queryKey: ['tenders'] });
    }
  });
};

export const usePublishTender = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // In a real app, this would call your API to publish a tender
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve600));

      return { id, status: 'open' };
    },
    onSuccess: (data: any) => {
      // Update the tender in the cache
      queryClient.setQueryData(['tender', data.id], (old: Tender | undefined) => {
        if (!old) return old;
        return { ...old, status: 'open', updatedAt: new Date().toISOString() };
      });
      // Invalidate tenders query to refetch with the updated tender
      queryClient.invalidateQueries({ queryKey: ['tenders'] });
    }
  });
};

export const useAwardTender = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tenderId, bidId }: { tenderId: string, bidId: string }) => {
      // In a real app, this would call your API to award a tender
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve800));

      return { tenderId, bidId };
    },
    onSuccess: (data: any) => {
      // Update the tender in the cache
      queryClient.setQueryData(['tender', data.tenderId], (old: Tender | undefined) => {
        if (!old) return old;
        return {
          ...old,
          status: 'awarded',
          updatedAt: new Date().toISOString(),
          bids: old.bids.map(bid => ({
            ...bid,
            status: bid.id === data.bidId ? 'awarded' : bid.status
          }))
        };
      });
      // Invalidate tenders query to refetch with the updated tender
      queryClient.invalidateQueries({ queryKey: ['tenders'] });
    }
  });
};

export const useGenerateAIAnalysis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tenderId: string) => {
      // In a real app, this would call your API to generate AI analysis
      // Simulate API delay for AI processing
      await new Promise(resolve => setTimeout(resolve2000));

      return { tenderId, status: 'completed' };
    },
    onSuccess: (data: any) => {
      // Update the tender in the cache
      queryClient.setQueryData(['tender', data.tenderId], (old: Tender | undefined) => {
        if (!old) return old;
        return {
          ...old,
          status: 'evaluating',
          updatedAt: new Date().toISOString(),
          aiRecommendation: 'Based on comprehensive analysis, the top bid represents the best overall value with superior experience and quality metrics.'
        };
      });
      // Invalidate tenders query to refetch with the updated tender
      queryClient.invalidateQueries({ queryKey: ['tenders'] });
    }
  });
};

// Helper functions for formatting
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const calculateDaysLeft = (deadline: string): number => {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  const diffTime = deadlineDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'draft': return 'gray';
    case 'open': return 'green';
    case 'evaluating': return 'yellow';
    case 'awarded': return 'blue';
    case 'closed': return 'slate';
    default: return 'gray';
  }
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case 'draft': return 'Draft';
    case 'open': return 'Open';
    case 'evaluating': return 'Evaluating';
    case 'awarded': return 'Awarded';
    case 'closed': return 'Closed';
    default: return status;
  }
};

// Constants for available categories
export const TENDER_CATEGORIES = [
  'Electrical',
  'MEP',
  'Plumbing',
  'HVAC',
  'Groundworks',
  'Structural',
  'Fit-Out',
  'Joinery',
  'Landscaping',
  'External Works',
  'Roofing',
  'Glazing',
  'Flooring',
  'Painting',
  'Tiling',
  'Security Systems'
];

// Constants for certification requirements
export const CERTIFICATIONS = [
  'RECI',
  'Safe Electric',
  'ISO 9001',
  'CIRI',
  'RGII',
  'SEAI Registered',
  'RIAI Accredited',
  'Bord Bia',
  'Association of Landscape Contractors',
  'NSAI Certified',
  'CE Marking',
  'Engineers Ireland'
];

// Constants for insurance options
export const INSURANCE_OPTIONS = [
  '€1M liability',
  '€2M liability',
  '€3M liability',
  '€5M liability',
  '€10M liability',
  '€15M liability',
  '€20M liability'
];