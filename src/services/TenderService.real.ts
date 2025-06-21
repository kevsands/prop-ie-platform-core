import { revenueEngine, FeeType } from '@/services/revenueEngine';

// Enhanced Types for Real Implementation
export interface Tender {
  id: string;
  title: string;
  project: string;
  projectId: string;
  developerId: string;
  description: string;
  status: 'draft' | 'open' | 'evaluating' | 'awarded' | 'closed' | 'cancelled';
  deadline: Date;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  bidsReceived: number;
  categories: string[];
  requirements: {
    experience: string;
    certifications: string[];
    insurance: string;
    documentation: string[];
    bondRequired: boolean;
    bondAmount?: number;
  };
  bids: Bid[];
  createdAt: Date;
  updatedAt: Date;
  attachments: Attachment[];
  createdBy: string;
  evaluationCriteria: EvaluationCriteria;
  fees: TenderFees;
  aiAnalysisEnabled: boolean;
  publicationDate?: Date;
  clarificationDeadline?: Date;
  technicalMeeting?: {
    date: Date;
    location: string;
    required: boolean;
  };
  estimatedDuration: number; // in days
  preferredStartDate?: Date;
  isPublic: boolean;
  prequalificationRequired: boolean;
}

export interface EvaluationCriteria {
  price: number; // percentage weight
  experience: number;
  timeline: number;
  quality: number;
  financial: number;
  safety: number;
  sustainability?: number;
}

export interface Bid {
  id: string;
  tenderId: string;
  contractor: Contractor;
  amount: number;
  currency: string;
  timeline: number; // in days
  proposedStartDate: Date;
  validityPeriod: number; // days
  submitted: Date;
  status: 'draft' | 'submitted' | 'under_review' | 'shortlisted' | 'rejected' | 'awarded' | 'withdrawn';
  attachments: Attachment[];
  submissionFeePaid: boolean;
  submissionFeeAmount: number;
  feeTransactionId?: string;
  technicalProposal: TechnicalProposal;
  commercialProposal: CommercialProposal;
  aiAnalysis?: AIAnalysis;
  evaluationScore?: EvaluationScore;
  clarifications: Clarification[];
  bondSubmitted: boolean;
  bondAmount?: number;
  bondProvider?: string;
}

export interface Contractor {
  id: string;
  name: string;
  logo?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'suspended';
  foundedYear: number;
  companySize: string;
  previousProjects: number;
  location: {
    address: string;
    city: string;
    county: string;
    country: string;
  };
  contacts: {
    primary: ContactPerson;
    technical: ContactPerson;
    commercial: ContactPerson;
  };
  certifications: Certification[];
  insurance: Insurance[];
  financialInfo: FinancialInfo;
  premiumStatus: ContractorPremiumStatus;
  ratings: {
    overall: number;
    quality: number;
    timeline: number;
    communication: number;
    safety: number;
  };
  specializations: string[];
  workingRadius: number; // km
}

export interface ContactPerson {
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface Certification {
  type: string;
  issuer: string;
  number: string;
  expiryDate: Date;
  status: 'valid' | 'expired' | 'suspended';
}

export interface Insurance {
  type: 'liability' | 'professional_indemnity' | 'employers_liability';
  provider: string;
  policyNumber: string;
  coverage: number;
  expiryDate: Date;
  status: 'active' | 'expired';
}

export interface FinancialInfo {
  annualTurnover: number;
  creditRating?: string;
  bondingCapacity: number;
  bankReferences: string[];
  lastAuditDate?: Date;
}

export interface ContractorPremiumStatus {
  isPremium: boolean;
  premiumType?: 'basic' | 'professional' | 'enterprise';
  premiumExpiry?: Date;
  premiumFeatures: string[];
  subscriptionAmount?: number;
}

export interface TechnicalProposal {
  methodology: string;
  timeline: ProjectPhase[];
  resources: ResourceAllocation;
  qualityAssurance: string;
  riskManagement: string;
  sustainability?: string;
  innovation?: string;
}

export interface ProjectPhase {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  deliverables: string[];
  resources: string[];
  dependencies: string[];
}

export interface ResourceAllocation {
  personnel: PersonnelResource[];
  equipment: EquipmentResource[];
  materials: MaterialResource[];
  subcontractors: SubcontractorResource[];
}

export interface PersonnelResource {
  role: string;
  name: string;
  experience: number;
  certifications: string[];
  allocation: number; // percentage
}

export interface EquipmentResource {
  type: string;
  model: string;
  quantity: number;
  owned: boolean;
  specifications: string;
}

export interface MaterialResource {
  type: string;
  specification: string;
  quantity: number;
  unit: string;
  supplier: string;
  leadTime: number;
}

export interface SubcontractorResource {
  company: string;
  scope: string;
  experience: string;
  value: number;
}

export interface CommercialProposal {
  totalValue: number;
  breakdown: CostBreakdown[];
  paymentTerms: PaymentTerms;
  variations: VariationClause[];
  warranties: Warranty[];
  insurances: ProposalInsurance[];
  contractDuration: number;
}

export interface CostBreakdown {
  category: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface PaymentTerms {
  structure: 'milestone' | 'monthly' | 'percentage';
  schedule: PaymentMilestone[];
  retentionPercentage: number;
  retentionPeriod: number; // days
  paymentPeriod: number; // days from invoice
}

export interface PaymentMilestone {
  description: string;
  percentage: number;
  amount: number;
  triggerEvent: string;
  documentation: string[];
}

export interface VariationClause {
  type: string;
  description: string;
  process: string;
  pricing: string;
}

export interface Warranty {
  scope: string;
  period: number; // years
  coverage: string;
  exclusions: string[];
}

export interface ProposalInsurance {
  type: string;
  coverage: number;
  excess: number;
  provider: string;
}

export interface AIAnalysis {
  overallScore: number;
  priceScore: number;
  experienceScore: number;
  riskScore: number;
  valueScore: number;
  timelineScore: number;
  qualityScore: number;
  strengths: string[];
  concerns: string[];
  recommendation: string;
  timelineAssessment: string;
  qualityMetrics: QualityMetrics;
  financialHealth: FinancialHealth;
  complianceStatus: ComplianceStatus;
  riskAssessment: RiskAssessment;
  marketComparison: MarketComparison;
  feesPaid: {
    aiAnalysisFee: boolean;
    feeTransactionId?: string;
  };
}

export interface QualityMetrics {
  previousWorkQuality: number;
  materialQuality: number;
  workmanshipWarranty: number;
  sustainabilityScore: number;
  innovationScore: number;
}

export interface FinancialHealth {
  stabilityScore: number;
  cashflowRisk: 'low' | 'medium' | 'high';
  paymentHistory: 'excellent' | 'good' | 'fair' | 'poor';
  creditRating?: string;
  bondingCapacity: number;
}

export interface ComplianceStatus {
  certifications: boolean;
  insurance: boolean;
  licenses: boolean;
  safetyRecords: boolean;
  environmentalCompliance: boolean;
}

export interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high';
  financialRisk: number;
  deliveryRisk: number;
  qualityRisk: number;
  safetyRisk: number;
  reputationalRisk: number;
  mitigationStrategies: string[];
}

export interface MarketComparison {
  pricePercentile: number;
  timelinePercentile: number;
  marketAverage: number;
  competitiveness: 'highly_competitive' | 'competitive' | 'average' | 'expensive';
}

export interface EvaluationScore {
  totalScore: number;
  priceScore: number;
  experienceScore: number;
  timelineScore: number;
  qualityScore: number;
  financialScore: number;
  safetyScore: number;
  sustainabilityScore?: number;
  evaluatedBy: string;
  evaluationDate: Date;
  comments: string;
}

export interface Clarification {
  id: string;
  question: string;
  answer?: string;
  submittedBy: string;
  submittedDate: Date;
  answeredBy?: string;
  answeredDate?: Date;
  isPublic: boolean;
}

export interface TenderFees {
  submissionFee: number;
  aiAnalysisFee?: number;
  premiumListingFee?: number;
  bondProcessingFee?: number;
  clarificationFee?: number;
  totalFeesCollected: number;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
  category: 'technical' | 'commercial' | 'legal' | 'certification' | 'reference' | 'other';
  description?: string;
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
  revenueMetrics: {
    totalFeesCollected: number;
    avgFeePerTender: number;
    premiumSubscriptions: number;
    monthlyRecurring: number;
  };
}

export interface TenderFilters {
  status?: string[];
  category?: string[];
  budget?: { min?: number; max?: number };
  project?: string;
  developer?: string;
  search?: string;
  dateRange?: { from?: Date; to?: Date };
  location?: string;
  requiresPrequalification?: boolean;
  isPublic?: boolean;
}

export interface CreateTenderInput {
  title: string;
  project: string;
  projectId: string;
  developerId: string;
  description: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  deadline: Date;
  categories: string[];
  requirements: {
    experience: string;
    certifications: string[];
    insurance: string;
    documentation: string[];
    bondRequired: boolean;
    bondAmount?: number;
  };
  evaluationCriteria: EvaluationCriteria;
  attachments?: File[];
  aiAnalysisEnabled: boolean;
  publicationDate?: Date;
  clarificationDeadline?: Date;
  technicalMeeting?: {
    date: Date;
    location: string;
    required: boolean;
  };
  estimatedDuration: number;
  preferredStartDate?: Date;
  isPublic: boolean;
  prequalificationRequired: boolean;
}

class RealTenderService {
  private baseUrl = '/api/tenders';

  async createTender(input: CreateTenderInput): Promise<Tender> {
    try {
      // Calculate submission fee
      const submissionFee = await revenueEngine.calculateFee({
        feeType: FeeType.TENDER_SUBMISSION,
        baseAmount: (input.budget.min + input.budget.max) / 2,
        metadata: { category: input.categories[0] }
      });

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...input,
          fees: {
            submissionFee: submissionFee.amount,
            aiAnalysisFee: input.aiAnalysisEnabled ? 50 : 0,
            totalFeesCollected: 0
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create tender: ${response.statusText}`);
      }

      const tender = await response.json();

      // Record revenue
      await revenueEngine.recordRevenue({
        source: 'tender_creation',
        amount: submissionFee.amount,
        currency: 'EUR',
        developerId: input.developerId,
        metadata: {
          tenderId: tender.id,
          category: input.categories[0]
        }
      });

      return tender;
    } catch (error) {
      console.error('Error creating tender:', error);
      throw new Error('Failed to create tender');
    }
  }

  async getTenders(filters: TenderFilters = {}): Promise<Tender[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.status?.length) queryParams.set('status', filters.status.join(','));
      if (filters.category?.length) queryParams.set('category', filters.category.join(','));
      if (filters.budget?.min) queryParams.set('budgetMin', filters.budget.min.toString());
      if (filters.budget?.max) queryParams.set('budgetMax', filters.budget.max.toString());
      if (filters.project) queryParams.set('project', filters.project);
      if (filters.developer) queryParams.set('developer', filters.developer);
      if (filters.search) queryParams.set('search', filters.search);
      if (filters.dateRange?.from) queryParams.set('dateFrom', filters.dateRange.from.toISOString());
      if (filters.dateRange?.to) queryParams.set('dateTo', filters.dateRange.to.toISOString());
      if (filters.location) queryParams.set('location', filters.location);
      if (filters.requiresPrequalification !== undefined) {
        queryParams.set('prequalification', filters.requiresPrequalification.toString());
      }
      if (filters.isPublic !== undefined) {
        queryParams.set('isPublic', filters.isPublic.toString());
      }

      const response = await fetch(`${this.baseUrl}?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch tenders: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching tenders:', error);
      return [];
    }
  }

  async getTender(id: string): Promise<Tender | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      
      if (response.status === 404) {
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch tender: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching tender:', error);
      return null;
    }
  }

  async updateTender(id: string, updates: Partial<Tender>): Promise<Tender> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error(`Failed to update tender: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating tender:', error);
      throw new Error('Failed to update tender');
    }
  }

  async deleteTender(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Failed to delete tender: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting tender:', error);
      throw new Error('Failed to delete tender');
    }
  }

  async submitBid(tenderId: string, bidData: Omit<Bid, 'id' | 'tenderId' | 'submitted' | 'status'>): Promise<Bid> {
    try {
      // Process submission fee
      const submissionFee = await revenueEngine.calculateFee({
        feeType: FeeType.TENDER_SUBMISSION,
        baseAmount: bidData.amount
      });

      const response = await fetch(`${this.baseUrl}/${tenderId}/bids`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bidData,
          submissionFeeAmount: submissionFee.amount,
          submissionFeePaid: false // Will be set to true after payment
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to submit bid: ${response.statusText}`);
      }

      const bid = await response.json();

      // Record revenue when fee is paid
      if (bid.submissionFeePaid) {
        await revenueEngine.recordRevenue({
          source: 'bid_submission',
          amount: submissionFee.amount,
          currency: 'EUR',
          contractorId: bidData.contractor.id,
          metadata: {
            tenderId: tenderId,
            bidId: bid.id
          }
        });
      }

      return bid;
    } catch (error) {
      console.error('Error submitting bid:', error);
      throw new Error('Failed to submit bid');
    }
  }

  async getBids(tenderId: string): Promise<Bid[]> {
    try {
      const response = await fetch(`${this.baseUrl}/${tenderId}/bids`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch bids: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching bids:', error);
      return [];
    }
  }

  async evaluateBid(tenderId: string, bidId: string, evaluation: EvaluationScore): Promise<Bid> {
    try {
      const response = await fetch(`${this.baseUrl}/${tenderId}/bids/${bidId}/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(evaluation)
      });

      if (!response.ok) {
        throw new Error(`Failed to evaluate bid: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error evaluating bid:', error);
      throw new Error('Failed to evaluate bid');
    }
  }

  async awardTender(tenderId: string, bidId: string): Promise<Tender> {
    try {
      const response = await fetch(`${this.baseUrl}/${tenderId}/award`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bidId })
      });

      if (!response.ok) {
        throw new Error(`Failed to award tender: ${response.statusText}`);
      }

      const tender = await response.json();

      // Notify all bidders
      await this.notifyTenderResult(tenderId, bidId);

      return tender;
    } catch (error) {
      console.error('Error awarding tender:', error);
      throw new Error('Failed to award tender');
    }
  }

  async requestAIAnalysis(tenderId: string, bidId: string): Promise<AIAnalysis> {
    try {
      // Process AI analysis fee
      const aiFee = await revenueEngine.calculateFee({
        feeType: FeeType.AI_ANALYSIS,
        baseAmount: 100 // Fixed fee for AI analysis
      });

      const response = await fetch(`${this.baseUrl}/${tenderId}/bids/${bidId}/ai-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to request AI analysis: ${response.statusText}`);
      }

      const analysis = await response.json();

      // Record AI analysis revenue
      await revenueEngine.recordRevenue({
        source: 'ai_analysis',
        amount: aiFee.amount,
        currency: 'EUR',
        metadata: {
          tenderId: tenderId,
          bidId: bidId
        }
      });

      return analysis;
    } catch (error) {
      console.error('Error requesting AI analysis:', error);
      throw new Error('Failed to request AI analysis');
    }
  }

  async addClarification(tenderId: string, question: string, isPublic: boolean = true): Promise<Clarification> {
    try {
      const response = await fetch(`${this.baseUrl}/${tenderId}/clarifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, isPublic })
      });

      if (!response.ok) {
        throw new Error(`Failed to add clarification: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding clarification:', error);
      throw new Error('Failed to add clarification');
    }
  }

  async answerClarification(tenderId: string, clarificationId: string, answer: string): Promise<Clarification> {
    try {
      const response = await fetch(`${this.baseUrl}/${tenderId}/clarifications/${clarificationId}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer })
      });

      if (!response.ok) {
        throw new Error(`Failed to answer clarification: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error answering clarification:', error);
      throw new Error('Failed to answer clarification');
    }
  }

  async getTenderStats(developerId?: string, dateRange?: { from: Date; to: Date }): Promise<TenderStats> {
    try {
      const queryParams = new URLSearchParams();
      
      if (developerId) queryParams.set('developerId', developerId);
      if (dateRange?.from) queryParams.set('dateFrom', dateRange.from.toISOString());
      if (dateRange?.to) queryParams.set('dateTo', dateRange.to.toISOString());

      const response = await fetch(`${this.baseUrl}/stats?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch tender stats: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching tender stats:', error);
      throw new Error('Failed to fetch tender stats');
    }
  }

  private async notifyTenderResult(tenderId: string, winningBidId: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/${tenderId}/notify-results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ winningBidId })
      });
    } catch (error) {
      console.error('Error notifying tender results:', error);
    }
  }

  async uploadAttachment(file: File, category: string): Promise<Attachment> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);

      const response = await fetch('/api/attachments', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Failed to upload attachment: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading attachment:', error);
      throw new Error('Failed to upload attachment');
    }
  }
}

// Singleton instance
const realTenderService = new RealTenderService();

export { RealTenderService, realTenderService };
export type {
  Tender,
  Bid,
  Contractor,
  TechnicalProposal,
  CommercialProposal,
  AIAnalysis,
  EvaluationScore,
  Clarification,
  TenderStats,
  TenderFilters,
  CreateTenderInput
};