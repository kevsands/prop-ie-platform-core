/**
 * Professional Invoice Tracking System
 * 
 * Tracks professional team invoices against agreed appointments
 * Handles architect, engineer, QS, and other design team billing
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { 
  FileText, 
  Euro, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  User,
  Building2,
  Calculator,
  TrendingUp,
  Eye,
  Edit,
  Download,
  Upload,
  Plus,
  Search,
  Mail,
  Phone,
  MapPin,
  Award,
  CreditCard,
  Receipt,
  Archive,
  Send
} from 'lucide-react';

interface ProfessionalInvoice {
  id: string;
  invoiceNumber: string;
  professionalId: string;
  professionalName: string;
  professionalRole: string;
  company: string;
  projectId: string;
  appointmentId: string;
  
  // Financial details
  lineItems: InvoiceLineItem[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  currency: string;
  
  // Invoice details
  issueDate: Date;
  dueDate: Date;
  periodFrom: Date;
  periodTo: Date;
  
  // Status and workflow
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'paid' | 'rejected' | 'disputed';
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  paidAt?: Date;
  
  // Professional service details
  serviceType: 'design' | 'construction_admin' | 'project_management' | 'consultancy' | 'inspection';
  workDescription: string;
  hoursWorked?: number;
  milestoneReference?: string;
  
  // Documents and approvals
  attachments: string[];
  notes?: string;
  reviewNotes?: string;
  rejectionReason?: string;
  
  // Payment terms
  paymentTerms: number; // days
  retentionPercentage?: number;
  retentionAmount?: number;
  
  // Professional details
  professionalEmail: string;
  professionalPhone: string;
  vatNumber?: string;
  professionalAddress: string;
}

interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitRate: number;
  amount: number;
  category: string;
}

interface AppointmentSummary {
  id: string;
  professionalName: string;
  role: string;
  company: string;
  contractValue: number;
  invoicedToDate: number;
  outstandingAmount: number;
  nextMilestone?: string;
  status: 'active' | 'completed' | 'suspended';
}

interface InvoicingSummary {
  totalProfessionals: number;
  totalInvoices: number;
  totalValue: number;
  paidAmount: number;
  outstandingAmount: number;
  avgPaymentDays: number;
  thisMonth: {
    invoicesReceived: number;
    totalValue: number;
    paidCount: number;
  };
}

export default function ProfessionalInvoiceTracking() {
  const { toast } = useToast();
  
  const [invoices, setInvoices] = useState<ProfessionalInvoice[]>([]);
  const [appointments, setAppointments] = useState<AppointmentSummary[]>([]);
  const [summary, setSummary] = useState<InvoicingSummary | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<ProfessionalInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Load invoice and appointment data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Mock appointment data
        const mockAppointments: AppointmentSummary[] = [
          {
            id: 'appt_001',
            professionalName: 'Jane Smith',
            role: 'Architect',
            company: 'Smith & Associates',
            contractValue: 75000,
            invoicedToDate: 45000,
            outstandingAmount: 30000,
            nextMilestone: 'Planning Permission Submission',
            status: 'active'
          },
          {
            id: 'appt_002',
            professionalName: 'Michael O\'Brien',
            role: 'Structural Engineer',
            company: 'Dublin Engineering Ltd',
            contractValue: 45000,
            invoicedToDate: 28000,
            outstandingAmount: 17000,
            nextMilestone: 'Foundation Design Completion',
            status: 'active'
          },
          {
            id: 'appt_003',
            professionalName: 'Sarah Kelly',
            role: 'Quantity Surveyor',
            company: 'Kelly Surveying',
            contractValue: 35000,
            invoicedToDate: 35000,
            outstandingAmount: 0,
            status: 'completed'
          }
        ];

        // Mock invoice data
        const mockInvoices: ProfessionalInvoice[] = [
          {
            id: 'inv_prof_001',
            invoiceNumber: 'SA-2025-008',
            professionalId: 'prof_001',
            professionalName: 'Jane Smith',
            professionalRole: 'Architect',
            company: 'Smith & Associates',
            projectId: 'fitzgerald-gardens',
            appointmentId: 'appt_001',
            lineItems: [
              {
                id: 'li_001',
                description: 'Concept Design Development',
                quantity: 40,
                unit: 'hours',
                unitRate: 125,
                amount: 5000,
                category: 'Design'
              },
              {
                id: 'li_002',
                description: 'Planning Application Preparation',
                quantity: 1,
                unit: 'milestone',
                unitRate: 8000,
                amount: 8000,
                category: 'Planning'
              }
            ],
            subtotal: 13000,
            vatRate: 23,
            vatAmount: 2990,
            total: 15990,
            currency: 'EUR',
            issueDate: new Date('2025-07-15'),
            dueDate: new Date('2025-08-15'),
            periodFrom: new Date('2025-06-01'),
            periodTo: new Date('2025-06-30'),
            status: 'submitted',
            submittedAt: new Date('2025-07-15'),
            serviceType: 'design',
            workDescription: 'Design development for Fitzgerald Gardens residential project including concept design and planning application preparation.',
            hoursWorked: 40,
            milestoneReference: 'Design Stage 2',
            attachments: ['concept_drawings.pdf', 'planning_application.pdf'],
            notes: 'Design work completed on schedule. Planning application ready for submission.',
            paymentTerms: 30,
            professionalEmail: 'jane@smithassociates.com',
            professionalPhone: '+353 87 123 4567',
            vatNumber: 'IE1234567T',
            professionalAddress: '15 Design Quarter, Dublin 2'
          },
          {
            id: 'inv_prof_002',
            invoiceNumber: 'DE-2025-012',
            professionalId: 'prof_002',
            professionalName: 'Michael O\'Brien',
            professionalRole: 'Structural Engineer',
            company: 'Dublin Engineering Ltd',
            projectId: 'fitzgerald-gardens',
            appointmentId: 'appt_002',
            lineItems: [
              {
                id: 'li_003',
                description: 'Structural Analysis and Design',
                quantity: 32,
                unit: 'hours',
                unitRate: 110,
                amount: 3520,
                category: 'Engineering'
              },
              {
                id: 'li_004',
                description: 'Foundation Design',
                quantity: 1,
                unit: 'milestone',
                unitRate: 6000,
                amount: 6000,
                category: 'Structural'
              }
            ],
            subtotal: 9520,
            vatRate: 23,
            vatAmount: 2190,
            total: 11710,
            currency: 'EUR',
            issueDate: new Date('2025-07-01'),
            dueDate: new Date('2025-08-01'),
            periodFrom: new Date('2025-05-15'),
            periodTo: new Date('2025-06-15'),
            status: 'approved',
            submittedAt: new Date('2025-07-01'),
            reviewedAt: new Date('2025-07-05'),
            reviewedBy: 'Patrick Murphy',
            serviceType: 'design',
            workDescription: 'Structural engineering services for foundation and frame design.',
            hoursWorked: 32,
            milestoneReference: 'Structural Stage 1',
            attachments: ['structural_calcs.pdf', 'foundation_drawings.pdf'],
            notes: 'Foundation design completed and approved by building control.',
            reviewNotes: 'Excellent technical work, approved for payment.',
            paymentTerms: 30,
            professionalEmail: 'michael@dublineng.ie',
            professionalPhone: '+353 86 234 5678',
            vatNumber: 'IE2345678U',
            professionalAddress: '23 Engineering Park, Dublin 4'
          },
          {
            id: 'inv_prof_003',
            invoiceNumber: 'KS-2025-005',
            professionalId: 'prof_003',
            professionalName: 'Sarah Kelly',
            professionalRole: 'Quantity Surveyor',
            company: 'Kelly Surveying',
            projectId: 'fitzgerald-gardens',
            appointmentId: 'appt_003',
            lineItems: [
              {
                id: 'li_005',
                description: 'Final Account Preparation',
                quantity: 24,
                unit: 'hours',
                unitRate: 95,
                amount: 2280,
                category: 'Cost Management'
              },
              {
                id: 'li_006',
                description: 'Final Account Settlement',
                quantity: 1,
                unit: 'milestone',
                unitRate: 3500,
                amount: 3500,
                category: 'Final Account'
              }
            ],
            subtotal: 5780,
            vatRate: 23,
            vatAmount: 1329,
            total: 7109,
            currency: 'EUR',
            issueDate: new Date('2025-06-20'),
            dueDate: new Date('2025-07-20'),
            periodFrom: new Date('2025-06-01'),
            periodTo: new Date('2025-06-20'),
            status: 'paid',
            submittedAt: new Date('2025-06-20'),
            reviewedAt: new Date('2025-06-22'),
            reviewedBy: 'Mary Collins',
            paidAt: new Date('2025-07-18'),
            serviceType: 'consultancy',
            workDescription: 'Final account preparation and settlement for completed phases.',
            hoursWorked: 24,
            milestoneReference: 'Final Account',
            attachments: ['final_account.pdf', 'cost_reconciliation.xlsx'],
            notes: 'Final account completed with all variations reconciled.',
            reviewNotes: 'Final account approved. Payment processed.',
            paymentTerms: 30,
            professionalEmail: 'sarah@kellysurveying.ie',
            professionalPhone: '+353 85 345 6789',
            vatNumber: 'IE3456789V',
            professionalAddress: '45 Surveying House, Dublin 1'
          }
        ];

        const mockSummary: InvoicingSummary = {
          totalProfessionals: 8,
          totalInvoices: 12,
          totalValue: 156750,
          paidAmount: 98450,
          outstandingAmount: 58300,
          avgPaymentDays: 28,
          thisMonth: {
            invoicesReceived: 3,
            totalValue: 34809,
            paidCount: 1
          }
        };

        // Try to fetch from API first
        try {
          const response = await fetch('/api/invoices/professional?projectId=fitzgerald-gardens');
          const data = await response.json();
          
          if (data.success) {
            setInvoices(data.data);
            setSummary(data.summary);
          } else {
            throw new Error('API fetch failed');
          }
        } catch (apiError) {
          console.log('Using mock data for development');
          setInvoices(mockInvoices);
          setSummary(mockSummary);
        }
        
        setAppointments(mockAppointments);

      } catch (error) {
        console.error('Error loading professional invoice data:', error);
        toast({
          title: "Error",
          description: "Failed to load professional invoice data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const handleApproveInvoice = async (invoiceId: string) => {
    try {
      // Call API endpoint
      const response = await fetch(`/api/invoices/professional/${invoiceId}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve',
          reviewNotes: 'Invoice approved for payment.',
          reviewedBy: 'Patrick Murphy'
        })
      });

      if (!response.ok) throw new Error('Failed to approve invoice');

      const updatedInvoices = invoices.map(inv => 
        inv.id === invoiceId 
          ? {
              ...inv,
              status: 'approved' as const,
              reviewedAt: new Date(),
              reviewedBy: 'Patrick Murphy',
              reviewNotes: 'Invoice approved for payment.'
            }
          : inv
      );

      setInvoices(updatedInvoices);
      setSelectedInvoice(null);

      toast({
        title: "Invoice Approved",
        description: "Professional invoice has been approved for payment."
      });

    } catch (error) {
      console.error('Error approving invoice:', error);
      toast({
        title: "Error",
        description: "Failed to approve invoice",
        variant: "destructive"
      });
    }
  };

  const handleRejectInvoice = async (invoiceId: string, reason: string) => {
    try {
      // Call API endpoint
      const response = await fetch(`/api/invoices/professional/${invoiceId}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject',
          rejectionReason: reason,
          reviewedBy: 'Patrick Murphy'
        })
      });

      if (!response.ok) throw new Error('Failed to reject invoice');

      const updatedInvoices = invoices.map(inv => 
        inv.id === invoiceId 
          ? {
              ...inv,
              status: 'rejected' as const,
              reviewedAt: new Date(),
              reviewedBy: 'Patrick Murphy',
              rejectionReason: reason
            }
          : inv
      );

      setInvoices(updatedInvoices);
      setSelectedInvoice(null);

      toast({
        title: "Invoice Rejected",
        description: "Professional invoice has been rejected and returned."
      });

    } catch (error) {
      console.error('Error rejecting invoice:', error);
      toast({
        title: "Error",
        description: "Failed to reject invoice",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'paid':
        return 'bg-emerald-100 text-emerald-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'disputed':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const filteredInvoices = invoices.filter(invoice => {
    if (statusFilter !== 'all' && invoice.status !== statusFilter) return false;
    if (roleFilter !== 'all' && invoice.professionalRole !== roleFilter) return false;
    if (searchTerm && !invoice.professionalName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading professional invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Professional Invoice Tracking</h1>
            <p className="text-gray-600">Manage design team and professional service invoices</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-blue-100 text-blue-800">
              <Building2 className="h-3 w-3 mr-1" />
              Fitzgerald Gardens
            </Badge>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Upload Invoice
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{summary.totalProfessionals}</p>
                  <p className="text-sm text-gray-600">Active Professionals</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.totalValue)}</p>
                  <p className="text-sm text-gray-600">Total Invoiced</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">{formatCurrency(summary.paidAmount)}</p>
                  <p className="text-sm text-gray-600">Paid to Date</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{formatCurrency(summary.outstandingAmount)}</p>
                  <p className="text-sm text-gray-600">Outstanding</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{summary.avgPaymentDays}</p>
                  <p className="text-sm text-gray-600">Avg Payment Days</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="invoices">Invoices ({invoices.length})</TabsTrigger>
            <TabsTrigger value="appointments">Appointments ({appointments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Invoice Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Invoice Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {invoices.slice(0, 5).map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{invoice.invoiceNumber}</p>
                          <p className="text-sm text-gray-600">{invoice.professionalName} - {invoice.professionalRole}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(invoice.total)}</p>
                          <Badge className={getStatusColor(invoice.status)} variant="outline">
                            {invoice.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Status Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { status: 'Paid', count: invoices.filter(i => i.status === 'paid').length, color: 'emerald' },
                      { status: 'Approved', count: invoices.filter(i => i.status === 'approved').length, color: 'green' },
                      { status: 'Submitted', count: invoices.filter(i => i.status === 'submitted').length, color: 'blue' },
                      { status: 'Under Review', count: invoices.filter(i => i.status === 'under_review').length, color: 'yellow' },
                      { status: 'Rejected', count: invoices.filter(i => i.status === 'rejected').length, color: 'red' }
                    ].map((item) => (
                      <div key={item.status} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full bg-${item.color}-500`}></div>
                          <span className="text-sm font-medium">{item.status}</span>
                        </div>
                        <span className="text-sm font-medium">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filter Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Professional Role</Label>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All roles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="Architect">Architect</SelectItem>
                        <SelectItem value="Structural Engineer">Structural Engineer</SelectItem>
                        <SelectItem value="Quantity Surveyor">Quantity Surveyor</SelectItem>
                        <SelectItem value="Mechanical Engineer">Mechanical Engineer</SelectItem>
                        <SelectItem value="Electrical Engineer">Electrical Engineer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Search</Label>
                    <Input
                      placeholder="Search invoices..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button variant="outline" onClick={() => {
                      setStatusFilter('all');
                      setRoleFilter('all');
                      setSearchTerm('');
                    }}>
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Invoices List */}
            <div className="space-y-4">
              {filteredInvoices.map((invoice) => (
                <Card key={invoice.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <h3 className="text-lg font-semibold">{invoice.invoiceNumber}</h3>
                          <Badge className={getStatusColor(invoice.status)}>
                            {invoice.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge variant="outline">{invoice.serviceType}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {invoice.professionalName} - {invoice.professionalRole}
                          </div>
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {invoice.company}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {invoice.issueDate.toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">{invoice.workDescription}</p>
                        {invoice.milestoneReference && (
                          <Badge variant="outline" className="text-xs">
                            {invoice.milestoneReference}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-right space-y-2">
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(invoice.total)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Due: {invoice.dueDate.toLocaleDateString()}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedInvoice(invoice)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          {invoice.status === 'submitted' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApproveInvoice(invoice.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredInvoices.length === 0 && (
                <div className="text-center py-12">
                  <Receipt className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">No invoices found</h3>
                  <p className="text-gray-600">No professional invoices match your current filters.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            {/* Professional Appointments Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {appointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{appointment.professionalName}</CardTitle>
                      <Badge className={
                        appointment.status === 'active' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {appointment.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600">{appointment.role} - {appointment.company}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Contract Value:</span>
                          <p>{formatCurrency(appointment.contractValue)}</p>
                        </div>
                        <div>
                          <span className="font-medium">Invoiced to Date:</span>
                          <p>{formatCurrency(appointment.invoicedToDate)}</p>
                        </div>
                        <div>
                          <span className="font-medium">Outstanding:</span>
                          <p className="text-orange-600 font-medium">{formatCurrency(appointment.outstandingAmount)}</p>
                        </div>
                        <div>
                          <span className="font-medium">Progress:</span>
                          <p>{Math.round((appointment.invoicedToDate / appointment.contractValue) * 100)}%</p>
                        </div>
                      </div>
                      
                      {appointment.nextMilestone && (
                        <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                          <p className="text-sm">
                            <span className="font-medium">Next Milestone:</span> {appointment.nextMilestone}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <FileText className="h-3 w-3 mr-1" />
                          View Contract
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calculator className="h-3 w-3 mr-1" />
                          Invoice History
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Invoice Detail Modal */}
        {selectedInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">
                    Invoice {selectedInvoice.invoiceNumber} - {selectedInvoice.professionalName}
                  </h2>
                  <Button variant="outline" onClick={() => setSelectedInvoice(null)}>
                    Close
                  </Button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Professional Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Name & Role</Label>
                        <p className="font-medium">{selectedInvoice.professionalName} - {selectedInvoice.professionalRole}</p>
                      </div>
                      <div>
                        <Label>Company</Label>
                        <p className="font-medium">{selectedInvoice.company}</p>
                      </div>
                      <div>
                        <Label>Email</Label>
                        <p className="font-medium">{selectedInvoice.professionalEmail}</p>
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <p className="font-medium">{selectedInvoice.professionalPhone}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Line Items */}
                <Card>
                  <CardHeader>
                    <CardTitle>Line Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Description</th>
                            <th className="text-right p-2">Quantity</th>
                            <th className="text-right p-2">Unit Rate</th>
                            <th className="text-right p-2">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedInvoice.lineItems.map((item) => (
                            <tr key={item.id} className="border-b">
                              <td className="p-2">
                                <div>
                                  <p className="font-medium">{item.description}</p>
                                  <Badge variant="outline" className="text-xs">{item.category}</Badge>
                                </div>
                              </td>
                              <td className="p-2 text-right">{item.quantity} {item.unit}</td>
                              <td className="p-2 text-right">{formatCurrency(item.unitRate)}</td>
                              <td className="p-2 text-right font-medium">{formatCurrency(item.amount)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-4 space-y-2 border-t pt-4">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(selectedInvoice.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>VAT ({selectedInvoice.vatRate}%):</span>
                        <span>{formatCurrency(selectedInvoice.vatAmount)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>{formatCurrency(selectedInvoice.total)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Work Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>Work Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{selectedInvoice.workDescription}</p>
                    {selectedInvoice.hoursWorked && (
                      <p className="text-sm text-gray-600 mt-2">
                        Hours worked: {selectedInvoice.hoursWorked}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Actions */}
                {selectedInvoice.status === 'submitted' && (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      onClick={() => handleApproveInvoice(selectedInvoice.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Invoice
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleRejectInvoice(selectedInvoice.id, 'Requires additional documentation')}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Reject Invoice
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}