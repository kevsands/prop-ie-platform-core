'use client'

/**
 * Enterprise Transaction Manager - Complete Buyer Journey and Legal Tracking
 * Comprehensive transaction lifecycle management with real business logic
 * 
 * @fileoverview Enterprise-grade transaction management with buyer journey
 * @version 3.0.0
 * @author Property Development Platform Team
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Euro, 
  Calendar, 
  User, 
  Home,
  Phone,
  Mail,
  Building2,
  MapPin,
  Receipt,
  CreditCard,
  Banknote,
  Scale,
  Shield,
  Eye,
  Edit,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  ArrowRight,
  ArrowLeft,
  Target,
  Activity,
  Zap,
  Award,
  Star,
  Percent,
  TrendingUp,
  BarChart3,
  PieChart
} from 'lucide-react'
import { unifiedProjectService, ProjectData, UnitData, TransactionData, BuyerDetails } from '@/services/UnifiedProjectService'

// =============================================================================
// TRANSACTION INTERFACES
// =============================================================================

interface EnterpriseTransactionManagerProps {
  projectId: string
  onTransactionUpdate?: (transactionId: string, updates: Partial<TransactionData>) => Promise<boolean>
}

interface TransactionFilters {
  status: string
  stage: string
  type: string
  solicitor: string
  dateRange: { start: string; end: string }
  searchTerm: string
}

interface TransactionMetrics {
  totalTransactions: number
  activeTransactions: number
  completedTransactions: number
  cancelledTransactions: number
  totalValue: number
  averageTimeToCompletion: number
  conversionRate: number
  legalComplianceRate: number
}

interface LegalMilestone {
  id: string
  name: string
  description: string
  required: boolean
  completed: boolean
  completedDate?: string
  documents: string[]
  responsibleParty: 'buyer' | 'seller' | 'solicitor' | 'lender'
}

interface BuyerJourneyStage {
  id: string
  name: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'blocked'
  estimatedDays: number
  actualDays?: number
  milestones: LegalMilestone[]
  documents: string[]
  communications: CommunicationRecord[]
}

interface CommunicationRecord {
  id: string
  type: 'email' | 'phone' | 'meeting' | 'document'
  subject: string
  participants: string[]
  date: string
  status: 'sent' | 'received' | 'scheduled'
  notes?: string
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function EnterpriseTransactionManager({ projectId, onTransactionUpdate }: EnterpriseTransactionManagerProps) {
  const { toast } = useToast()
  
  // Core state
  const [project, setProject] = useState<ProjectData | null>(null)
  const [transactions, setTransactions] = useState<TransactionData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // UI state
  const [viewMode, setViewMode] = useState<'overview' | 'pipeline' | 'legal' | 'communications'>('overview')
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionData | null>(null)
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  
  // Filters
  const [filters, setFilters] = useState<TransactionFilters>({
    status: 'all',
    stage: 'all',
    type: 'all',
    solicitor: 'all',
    dateRange: { start: '', end: '' },
    searchTerm: ''
  })

  // =============================================================================
  // DATA LOADING AND MANAGEMENT
  // =============================================================================

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const projectData = await unifiedProjectService.getProject(projectId)
      if (!projectData) {
        throw new Error('Project not found')
      }
      
      setProject(projectData)
      setTransactions(projectData.transactions || [])
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transaction data')
      console.error('Failed to load transaction data:', err)
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    loadData()
  }, [loadData])

  // =============================================================================
  // CALCULATED METRICS
  // =============================================================================

  const metrics = useMemo((): TransactionMetrics => {
    const activeTransactions = transactions.filter(t => t.status === 'active')
    const completedTransactions = transactions.filter(t => t.status === 'completed')
    const cancelledTransactions = transactions.filter(t => t.status === 'cancelled')
    
    const totalValue = transactions.reduce((sum, t) => sum + t.financial.amount, 0)
    
    // Calculate average time to completion
    const completedWithDates = completedTransactions.filter(t => 
      t.timeline.reservationDate && t.timeline.actualCompletionDate
    )
    
    const averageTimeToCompletion = completedWithDates.length > 0
      ? completedWithDates.reduce((sum, t) => {
          const start = new Date(t.timeline.reservationDate!).getTime()
          const end = new Date(t.timeline.actualCompletionDate!).getTime()
          return sum + (end - start) / (1000 * 60 * 60 * 24) // Convert to days
        }, 0) / completedWithDates.length
      : 0
    
    const conversionRate = transactions.length > 0
      ? (completedTransactions.length / transactions.length) * 100
      : 0
    
    // Legal compliance rate (contracts signed, deposits paid, etc.)
    const compliantTransactions = transactions.filter(t => 
      t.legal.contractSigned && 
      t.financial.depositPaid > 0
    ).length
    
    const legalComplianceRate = transactions.length > 0
      ? (compliantTransactions / transactions.length) * 100
      : 0

    return {
      totalTransactions: transactions.length,
      activeTransactions: activeTransactions.length,
      completedTransactions: completedTransactions.length,
      cancelledTransactions: cancelledTransactions.length,
      totalValue,
      averageTimeToCompletion: Math.round(averageTimeToCompletion),
      conversionRate: Math.round(conversionRate * 10) / 10,
      legalComplianceRate: Math.round(legalComplianceRate * 10) / 10
    }
  }, [transactions])

  // =============================================================================
  // FILTERED DATA
  // =============================================================================

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Status filter
      if (filters.status !== 'all' && transaction.status !== filters.status) {
        return false
      }

      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        const buyerName = transaction.buyer.name?.toLowerCase() || ''
        const unitNumber = project?.units.find(u => u.id === transaction.unitId)?.number || ''
        
        if (!buyerName.includes(searchLower) && !unitNumber.includes(searchLower)) {
          return false
        }
      }

      return true
    })
  }, [transactions, filters, project])

  // =============================================================================
  // BUYER JOURNEY STAGES
  // =============================================================================

  const getBuyerJourneyStages = useCallback((transaction: TransactionData): BuyerJourneyStage[] => {
    return [
      {
        id: 'reservation',
        name: 'Property Reservation',
        description: 'Initial property reservation and deposit',
        status: transaction.timeline.reservationDate ? 'completed' : 'pending',
        estimatedDays: 1,
        actualDays: transaction.timeline.reservationDate ? 1 : undefined,
        milestones: [
          {
            id: 'booking_form',
            name: 'Booking Form Completed',
            description: 'Property booking form submitted and signed',
            required: true,
            completed: !!transaction.timeline.reservationDate,
            documents: ['booking_form.pdf'],
            responsibleParty: 'buyer'
          },
          {
            id: 'reservation_deposit',
            name: 'Reservation Deposit Paid',
            description: 'Initial reservation deposit payment received',
            required: true,
            completed: transaction.financial.depositPaid > 0,
            documents: ['deposit_receipt.pdf'],
            responsibleParty: 'buyer'
          }
        ],
        documents: ['booking_form.pdf', 'deposit_receipt.pdf'],
        communications: []
      },
      {
        id: 'legal_appointment',
        name: 'Legal Appointment',
        description: 'Solicitor appointment and legal process initiation',
        status: transaction.legal.solicitorId ? 'completed' : 'pending',
        estimatedDays: 7,
        milestones: [
          {
            id: 'solicitor_appointment',
            name: 'Solicitor Appointed',
            description: 'Buyer solicitor appointed and confirmed',
            required: true,
            completed: !!transaction.legal.solicitorId,
            documents: ['solicitor_appointment.pdf'],
            responsibleParty: 'buyer'
          }
        ],
        documents: ['solicitor_appointment.pdf'],
        communications: []
      },
      {
        id: 'mortgage_approval',
        name: 'Mortgage Approval',
        description: 'Mortgage application and approval process',
        status: transaction.financial.mortgageAmount && transaction.financial.mortgageAmount > 0 ? 'completed' : 'in_progress',
        estimatedDays: 21,
        milestones: [
          {
            id: 'mortgage_application',
            name: 'Mortgage Application Submitted',
            description: 'Formal mortgage application submitted to lender',
            required: transaction.financial.mortgageAmount ? transaction.financial.mortgageAmount > 0 : false,
            completed: !!transaction.financial.mortgageAmount,
            documents: ['mortgage_application.pdf'],
            responsibleParty: 'buyer'
          },
          {
            id: 'mortgage_approval',
            name: 'Mortgage Approval Received',
            description: 'Formal mortgage approval letter received',
            required: transaction.financial.mortgageAmount ? transaction.financial.mortgageAmount > 0 : false,
            completed: !!transaction.financial.mortgageAmount,
            documents: ['mortgage_approval.pdf'],
            responsibleParty: 'lender'
          }
        ],
        documents: ['mortgage_application.pdf', 'mortgage_approval.pdf'],
        communications: []
      },
      {
        id: 'contracts_out',
        name: 'Contracts Out',
        description: 'Legal contracts prepared and sent to buyer solicitor',
        status: transaction.timeline.contractsOutDate ? 'completed' : 'pending',
        estimatedDays: 14,
        milestones: [
          {
            id: 'contracts_prepared',
            name: 'Contracts Prepared',
            description: 'Legal contracts prepared by vendor solicitor',
            required: true,
            completed: !!transaction.timeline.contractsOutDate,
            documents: ['sale_contract.pdf'],
            responsibleParty: 'solicitor'
          },
          {
            id: 'contracts_sent',
            name: 'Contracts Sent to Buyer',
            description: 'Contracts sent to buyer solicitor for review',
            required: true,
            completed: !!transaction.timeline.contractsOutDate,
            documents: ['contract_transmission.pdf'],
            responsibleParty: 'solicitor'
          }
        ],
        documents: ['sale_contract.pdf', 'contract_transmission.pdf'],
        communications: []
      },
      {
        id: 'contracts_signed',
        name: 'Contracts Signed',
        description: 'Contracts reviewed, signed and returned',
        status: transaction.legal.contractSigned ? 'completed' : 'pending',
        estimatedDays: 14,
        milestones: [
          {
            id: 'contract_review',
            name: 'Contract Review Completed',
            description: 'Buyer solicitor reviews and approves contracts',
            required: true,
            completed: transaction.legal.contractSigned,
            documents: ['contract_review.pdf'],
            responsibleParty: 'solicitor'
          },
          {
            id: 'contract_signing',
            name: 'Contracts Signed',
            description: 'Contracts signed by buyer and returned',
            required: true,
            completed: transaction.legal.contractSigned,
            documents: ['signed_contract.pdf'],
            responsibleParty: 'buyer'
          }
        ],
        documents: ['contract_review.pdf', 'signed_contract.pdf'],
        communications: []
      },
      {
        id: 'exchange',
        name: 'Exchange of Contracts',
        description: 'Formal exchange of contracts and deposit payment',
        status: transaction.legal.exchangeDate ? 'completed' : 'pending',
        estimatedDays: 7,
        milestones: [
          {
            id: 'exchange_completed',
            name: 'Exchange Completed',
            description: 'Formal exchange of contracts completed',
            required: true,
            completed: !!transaction.legal.exchangeDate,
            documents: ['exchange_confirmation.pdf'],
            responsibleParty: 'solicitor'
          },
          {
            id: 'deposit_paid',
            name: 'Full Deposit Paid',
            description: 'Full contract deposit paid to vendor solicitor',
            required: true,
            completed: transaction.financial.depositPaid >= (transaction.financial.amount * 0.1),
            documents: ['deposit_receipt.pdf'],
            responsibleParty: 'buyer'
          }
        ],
        documents: ['exchange_confirmation.pdf', 'deposit_receipt.pdf'],
        communications: []
      },
      {
        id: 'completion',
        name: 'Completion',
        description: 'Final completion and key handover',
        status: transaction.legal.completionDate ? 'completed' : 'pending',
        estimatedDays: 60,
        milestones: [
          {
            id: 'final_funds',
            name: 'Final Funds Received',
            description: 'Balance of purchase price received',
            required: true,
            completed: !!transaction.legal.completionDate,
            documents: ['completion_statement.pdf'],
            responsibleParty: 'buyer'
          },
          {
            id: 'key_handover',
            name: 'Key Handover',
            description: 'Property keys handed over to buyer',
            required: true,
            completed: !!transaction.legal.keyHandoverDate,
            documents: ['handover_certificate.pdf'],
            responsibleParty: 'seller'
          }
        ],
        documents: ['completion_statement.pdf', 'handover_certificate.pdf'],
        communications: []
      }
    ]
  }, [])

  // =============================================================================
  // TRANSACTION HANDLERS
  // =============================================================================

  const handleUpdateTransaction = useCallback(async (transactionId: string, updates: Partial<TransactionData>) => {
    try {
      const success = onTransactionUpdate ? await onTransactionUpdate(transactionId, updates) : false
      
      if (success) {
        await loadData() // Reload data to reflect changes
        toast({
          title: "Transaction Updated",
          description: "Transaction has been successfully updated.",
        })
      } else {
        throw new Error('Failed to update transaction')
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update transaction. Please try again.",
        variant: "destructive",
      })
      console.error('Failed to update transaction:', error)
    }
  }, [onTransactionUpdate, loadData, toast])

  const handleStatusChange = useCallback(async (transactionId: string, newStatus: string) => {
    await handleUpdateTransaction(transactionId, {
      status: newStatus as any,
      timeline: {
        ...transactions.find(t => t.id === transactionId)?.timeline,
        actualCompletionDate: newStatus === 'completed' ? new Date().toISOString() : undefined
      }
    })
  }, [handleUpdateTransaction, transactions])

  // =============================================================================
  // RENDER COMPONENTS
  // =============================================================================

  const renderMetricsOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalTransactions}</div>
          <p className="text-xs text-muted-foreground">
            {metrics.activeTransactions} active, {metrics.completedTransactions} completed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <Euro className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{metrics.totalValue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Across all transactions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Completion Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.averageTimeToCompletion} days</div>
          <p className="text-xs text-muted-foreground">
            From reservation to completion
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
          <p className="text-xs text-muted-foreground">
            Legal compliance: {metrics.legalComplianceRate}%
          </p>
        </CardContent>
      </Card>
    </div>
  )

  const renderTransactionCard = (transaction: TransactionData) => {
    const unit = project?.units.find(u => u.id === transaction.unitId)
    const journeyStages = getBuyerJourneyStages(transaction)
    const completedStages = journeyStages.filter(s => s.status === 'completed').length
    const totalStages = journeyStages.length
    const progressPercentage = (completedStages / totalStages) * 100

    return (
      <Card key={transaction.id} className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Unit {unit?.number || 'N/A'}</CardTitle>
              <p className="text-sm text-muted-foreground">{transaction.buyer.name}</p>
            </div>
            <Badge 
              variant={
                transaction.status === 'completed' ? 'default' :
                transaction.status === 'active' ? 'secondary' :
                'destructive'
              }
            >
              {transaction.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Transaction Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Amount:</span>
                <p>€{transaction.financial.amount.toLocaleString()}</p>
              </div>
              <div>
                <span className="font-medium">Type:</span>
                <p className="capitalize">{transaction.type}</p>
              </div>
              <div>
                <span className="font-medium">Deposit Paid:</span>
                <p>€{transaction.financial.depositPaid.toLocaleString()}</p>
              </div>
              <div>
                <span className="font-medium">Solicitor:</span>
                <p>{transaction.buyer.solicitor?.name || 'Not assigned'}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Journey Progress</span>
                <span className="text-sm text-muted-foreground">
                  {completedStages}/{totalStages} stages
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSelectedTransaction(transaction)
                  setShowTransactionModal(true)
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSelectedTransaction(transaction)
                  setIsEditMode(true)
                  setShowTransactionModal(true)
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderBuyerJourney = (transaction: TransactionData) => {
    const stages = getBuyerJourneyStages(transaction)
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-semibold">Buyer Journey</h3>
        </div>

        <div className="space-y-4">
          {stages.map((stage, index) => (
            <Card key={stage.id} className={`${
              stage.status === 'completed' ? 'border-green-200 bg-green-50' :
              stage.status === 'in_progress' ? 'border-blue-200 bg-blue-50' :
              stage.status === 'blocked' ? 'border-red-200 bg-red-50' :
              'border-gray-200'
            }`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      stage.status === 'completed' ? 'bg-green-500 text-white' :
                      stage.status === 'in_progress' ? 'bg-blue-500 text-white' :
                      stage.status === 'blocked' ? 'bg-red-500 text-white' :
                      'bg-gray-300 text-gray-600'
                    }`}>
                      {stage.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : stage.status === 'blocked' ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold">{stage.name}</h4>
                      <p className="text-sm text-muted-foreground">{stage.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      stage.status === 'completed' ? 'default' :
                      stage.status === 'in_progress' ? 'secondary' :
                      stage.status === 'blocked' ? 'destructive' :
                      'outline'
                    }>
                      {stage.status.replace('_', ' ')}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      Est. {stage.estimatedDays} days
                      {stage.actualDays && ` (Actual: ${stage.actualDays})`}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Milestones */}
                  <div>
                    <h5 className="font-medium mb-2">Milestones</h5>
                    <div className="space-y-2">
                      {stage.milestones.map(milestone => (
                        <div key={milestone.id} className="flex items-center gap-3 p-2 border rounded">
                          <div className={`w-4 h-4 rounded-full ${
                            milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                          }`}>
                            {milestone.completed && (
                              <CheckCircle className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{milestone.name}</p>
                            <p className="text-xs text-muted-foreground">{milestone.description}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {milestone.responsibleParty}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Documents */}
                  {stage.documents.length > 0 && (
                    <div>
                      <h5 className="font-medium mb-2">Required Documents</h5>
                      <div className="flex flex-wrap gap-2">
                        {stage.documents.map(doc => (
                          <Badge key={doc} variant="outline" className="text-xs">
                            <FileText className="w-3 h-3 mr-1" />
                            {doc}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>{error}</p>
            <Button onClick={loadData} variant="outline" className="mt-2">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold">Enterprise Transaction Manager</h2>
            <p className="text-muted-foreground">
              Complete buyer journey and legal tracking system
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Transaction
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      {renderMetricsOverview()}

      {/* Main Content Tabs */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pipeline">Sales Pipeline</TabsTrigger>
          <TabsTrigger value="legal">Legal Tracking</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Status</Label>
                  <Select value={filters.status} onValueChange={(value) => 
                    setFilters(prev => ({ ...prev, status: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Search</Label>
                  <Input
                    placeholder="Search buyer or unit..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTransactions.map(renderTransactionCard)}
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-6">
          <div className="text-center p-8 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4" />
            <p>Sales pipeline visualization coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="legal" className="space-y-6">
          <div className="text-center p-8 text-muted-foreground">
            <Scale className="h-12 w-12 mx-auto mb-4" />
            <p>Legal tracking dashboard coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="communications" className="space-y-6">
          <div className="text-center p-8 text-muted-foreground">
            <Mail className="h-12 w-12 mx-auto mb-4" />
            <p>Communications hub coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Transaction Detail Modal */}
      <Dialog open={showTransactionModal} onOpenChange={setShowTransactionModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedTransaction && (
                <>
                  Transaction Details - Unit {
                    project?.units.find(u => u.id === selectedTransaction.unitId)?.number || 'N/A'
                  }
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-6">
              {/* Buyer Journey */}
              {renderBuyerJourney(selectedTransaction)}
              
              {/* Transaction Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Transaction Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Buyer Name</Label>
                      <p className="font-medium">{selectedTransaction.buyer.name}</p>
                    </div>
                    <div>
                      <Label>Purchase Amount</Label>
                      <p className="font-medium">€{selectedTransaction.financial.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label>Deposit Paid</Label>
                      <p className="font-medium">€{selectedTransaction.financial.depositPaid.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label>Mortgage Amount</Label>
                      <p className="font-medium">
                        {selectedTransaction.financial.mortgageAmount 
                          ? `€${selectedTransaction.financial.mortgageAmount.toLocaleString()}`
                          : 'Cash purchase'
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}