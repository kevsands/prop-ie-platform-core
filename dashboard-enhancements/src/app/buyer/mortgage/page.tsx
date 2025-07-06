'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  User,
  Building,
  Phone,
  Mail,
  Download,
  Upload,
  Euro,
  Percent,
  Home,
  Shield,
  PiggyBank,
  BarChart3,
  Info,
  ChevronRight,
  RefreshCw,
  ArrowRight,
  DollarSign,
  CreditCard,
  FileCheck2,
  Briefcase
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface MortgageApplication {
  id: string;
  lender: {
    name: string;
    logo?: string;
    type: 'bank' | 'building-society' | 'online-lender';
  };
  status: 'draft' | 'submitted' | 'in-review' | 'approved' | 'rejected' | 'withdrawn';
  applicationDate: Date;
  lastUpdateDate: Date;
  property: {
    id: string;
    address: string;
    price: number;
    type: string;
  };
  loanDetails: {
    amount: number;
    term: number; // years
    ltv: number; // loan-to-value percentage
    rate: number; // interest rate
    rateType: 'fixed' | 'variable' | 'tracker';
    fixedTermYears?: number;
    monthlyPayment: number;
    totalInterest: number;
    totalPayable: number;
  };
  applicantDetails: {
    income: number;
    employmentStatus: 'employed' | 'self-employed' | 'contractor';
    employmentLength: number; // years
    creditScore?: number;
    existingDebts: number;
    dependents: number;
  };
  documents: Array<{
    id: string;
    name: string;
    type: string;
    status: 'pending' | 'uploaded' | 'approved' | 'rejected';
    uploadedDate?: Date;
    notes?: string;
  }>;
  timeline: Array<{
    event: string;
    date: Date;
    details?: string;
  }>;
  advisor?: {
    name: string;
    company: string;
    phone: string;
    email: string;
    photo?: string;
  };
  approval?: {
    amount: number;
    conditions: string[];
    expiryDate: Date;
    approvalLetter?: string;
  };
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'completed';
    dueDate?: Date;
  }>;
}

interface MortgageCalculation {
  loanAmount: number;
  propertyPrice: number;
  deposit: number;
  ltv: number;
  interestRate: number;
  term: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayable: number;
  affordability: {
    maxLoan: number;
    basedOnIncome: number;
    basedOnExpenses: number;
    stressTestedRate: number;
  };
}

const BuyerMortgagePage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<MortgageApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<MortgageApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'approved' | 'rejected'>('all');
  const [showCalculator, setShowCalculator] = useState(false);
  const [showNewApplication, setShowNewApplication] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<MortgageApplication | null>(null);
  const [expandedApplication, setExpandedApplication] = useState<string | null>(null);
  const [calculatorResults, setCalculatorResults] = useState<MortgageCalculation | null>(null);

  // Calculator state
  const [propertyPrice, setPropertyPrice] = useState(400000);
  const [deposit, setDeposit] = useState(40000);
  const [interestRate, setInterestRate] = useState(3.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [annualIncome, setAnnualIncome] = useState(75000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(1500);

  // Protect the route
  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'buyer') {
      router.push('/unauthorized');
    }
  }, [user, router]);

  // Fetch applications
  useEffect(() => {
    if (user?.role === 'buyer') {
      fetchApplications();
    }
  }, [user]);

  // Filter applications
  useEffect(() => {
    let filtered = [...applications];

    switch (filter) {
      case 'active':
        filtered = filtered.filter(a => 
          ['submitted', 'in-review'].includes(a.status)
        );
        break;
      case 'approved':
        filtered = filtered.filter(a => a.status === 'approved');
        break;
      case 'rejected':
        filtered = filtered.filter(a => a.status === 'rejected');
        break;
    }

    filtered.sort((a, b) => b.lastUpdateDate.getTime() - a.lastUpdateDate.getTime());
    setFilteredApplications(filtered);
  }, [applications, filter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      // Mock data for now
      const mockApplications: MortgageApplication[] = [
        {
          id: '1',
          lender: {
            name: 'Bank of Ireland',
            type: 'bank'
          },
          status: 'approved',
          applicationDate: new Date('2024-01-10'),
          lastUpdateDate: new Date('2024-01-15'),
          property: {
            id: 'prop1',
            address: 'Unit A12, Ballymakenny View',
            price: 425000,
            type: '3 Bed Semi-Detached'
          },
          loanDetails: {
            amount: 382500,
            term: 30,
            ltv: 90,
            rate: 3.45,
            rateType: 'fixed',
            fixedTermYears: 5,
            monthlyPayment: 1702,
            totalInterest: 230220,
            totalPayable: 612720
          },
          applicantDetails: {
            income: 85000,
            employmentStatus: 'employed',
            employmentLength: 5,
            creditScore: 780,
            existingDebts: 5000,
            dependents: 2
          },
          documents: [
            {
              id: 'doc1',
              name: 'Proof of Income',
              type: 'payslips',
              status: 'approved',
              uploadedDate: new Date('2024-01-11')
            },
            {
              id: 'doc2',
              name: 'Bank Statements',
              type: 'bank-statements',
              status: 'approved',
              uploadedDate: new Date('2024-01-11')
            },
            {
              id: 'doc3',
              name: 'Property Valuation',
              type: 'valuation',
              status: 'approved',
              uploadedDate: new Date('2024-01-13')
            }
          ],
          timeline: [
            {
              event: 'Application submitted',
              date: new Date('2024-01-10')
            },
            {
              event: 'Documents uploaded',
              date: new Date('2024-01-11')
            },
            {
              event: 'Initial review completed',
              date: new Date('2024-01-12')
            },
            {
              event: 'Property valuation received',
              date: new Date('2024-01-13')
            },
            {
              event: 'Mortgage approved',
              date: new Date('2024-01-15'),
              details: 'Approved for €382,500 over 30 years'
            }
          ],
          advisor: {
            name: 'Mary Walsh',
            company: 'Irish Mortgage Brokers',
            phone: '+353 1 234 5678',
            email: 'mary.walsh@imb.ie'
          },
          approval: {
            amount: 382500,
            conditions: [
              'Valid home insurance policy required',
              'Life insurance policy required',
              'Property valuation must remain valid'
            ],
            expiryDate: new Date('2024-04-15'),
            approvalLetter: '/documents/approval-letter.pdf'
          },
          tasks: [
            {
              id: 'task1',
              title: 'Arrange home insurance',
              description: 'Get quotes and arrange home insurance policy',
              status: 'pending',
              dueDate: new Date('2024-02-01')
            },
            {
              id: 'task2',
              title: 'Set up life insurance',
              description: 'Arrange life insurance to cover mortgage amount',
              status: 'pending',
              dueDate: new Date('2024-02-01')
            }
          ]
        },
        {
          id: '2',
          lender: {
            name: 'AIB',
            type: 'bank'
          },
          status: 'in-review',
          applicationDate: new Date('2024-01-18'),
          lastUpdateDate: new Date('2024-01-20'),
          property: {
            id: 'prop2',
            address: 'Unit B24, FitzGerald Gardens',
            price: 395000,
            type: '2 Bed Apartment'
          },
          loanDetails: {
            amount: 316000,
            term: 25,
            ltv: 80,
            rate: 3.25,
            rateType: 'variable',
            monthlyPayment: 1544,
            totalInterest: 146400,
            totalPayable: 462400
          },
          applicantDetails: {
            income: 72000,
            employmentStatus: 'employed',
            employmentLength: 3,
            existingDebts: 0,
            dependents: 0
          },
          documents: [
            {
              id: 'doc4',
              name: 'Proof of Income',
              type: 'payslips',
              status: 'uploaded',
              uploadedDate: new Date('2024-01-19')
            },
            {
              id: 'doc5',
              name: 'Bank Statements',
              type: 'bank-statements',
              status: 'pending'
            },
            {
              id: 'doc6',
              name: 'Employment Contract',
              type: 'employment',
              status: 'uploaded',
              uploadedDate: new Date('2024-01-19')
            }
          ],
          timeline: [
            {
              event: 'Application submitted',
              date: new Date('2024-01-18')
            },
            {
              event: 'Initial documents uploaded',
              date: new Date('2024-01-19')
            },
            {
              event: 'Under review',
              date: new Date('2024-01-20'),
              details: 'Application being reviewed by underwriting team'
            }
          ],
          tasks: [
            {
              id: 'task3',
              title: 'Upload bank statements',
              description: 'Upload last 6 months of bank statements',
              status: 'pending'
            }
          ]
        }
      ];
      setApplications(mockApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMortgage = () => {
    const loanAmount = propertyPrice - deposit;
    const ltv = (loanAmount / propertyPrice) * 100;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;
    
    const monthlyPayment = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    const totalPayable = monthlyPayment * numPayments;
    const totalInterest = totalPayable - loanAmount;
    
    // Affordability calculations
    const maxLoanBasedOnIncome = annualIncome * 3.5; // Standard income multiple
    const monthlyIncomeAfterTax = (annualIncome * 0.7) / 12; // Rough tax calculation
    const maxMonthlyPayment = (monthlyIncomeAfterTax - monthlyExpenses) * 0.35; // Max 35% of net income
    const maxLoanBasedOnExpenses = maxMonthlyPayment * numPayments / (1 + (interestRate / 100));
    
    const stressTestedRate = interestRate + 2; // Stress test at +2%
    
    setCalculatorResults({
      loanAmount,
      propertyPrice,
      deposit,
      ltv,
      interestRate,
      term: loanTerm,
      monthlyPayment,
      totalInterest,
      totalPayable,
      affordability: {
        maxLoan: Math.min(maxLoanBasedOnIncome, maxLoanBasedOnExpenses),
        basedOnIncome: maxLoanBasedOnIncome,
        basedOnExpenses: maxLoanBasedOnExpenses,
        stressTestedRate
      }
    });
  };

  const ApplicationCard = ({ application }: { application: MortgageApplication }) => {
    const isExpanded = expandedApplication === application.id;
    
    const getStatusColor = (status: MortgageApplication['status']) => {
      switch (status) {
        case 'approved':
          return 'bg-green-100 text-green-800';
        case 'rejected':
          return 'bg-red-100 text-red-800';
        case 'in-review':
          return 'bg-blue-100 text-blue-800';
        case 'submitted':
          return 'bg-yellow-100 text-yellow-800';
        case 'withdrawn':
          return 'bg-gray-100 text-gray-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    const completedTasks = application.tasks.filter(t => t.status === 'completed').length;
    const pendingDocuments = application.documents.filter(d => d.status === 'pending').length;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all"
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{application.lender.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1).replace('-', ' ')}
                </span>
              </div>
              <p className="text-gray-600">{application.property.address}</p>
              <p className="text-sm text-gray-500">{application.property.type}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#7C3AED]">
                €{application.loanDetails.amount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                {application.loanDetails.ltv}% LTV • {application.loanDetails.term} years
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Monthly Payment</p>
              <p className="text-lg font-medium">€{application.loanDetails.monthlyPayment.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Interest Rate</p>
              <p className="text-lg font-medium">
                {application.loanDetails.rate}% 
                <span className="text-sm text-gray-500 ml-1">
                  ({application.loanDetails.rateType})
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Documents</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-medium">
                  {application.documents.filter(d => d.status === 'approved').length}/{application.documents.length}
                </p>
                {pendingDocuments > 0 && (
                  <span className="text-sm text-yellow-600">
                    ({pendingDocuments} pending)
                  </span>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Tasks</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-medium">
                  {completedTasks}/{application.tasks.length}
                </p>
                {application.tasks.length - completedTasks > 0 && (
                  <span className="text-sm text-orange-600">
                    ({application.tasks.length - completedTasks} pending)
                  </span>
                )}
              </div>
            </div>
          </div>

          {application.approval && application.status === 'approved' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h4 className="font-medium text-green-900">Mortgage Approved</h4>
                </div>
                <span className="text-sm text-green-700">
                  Valid until {format(application.approval.expiryDate, 'MMM d, yyyy')}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-green-800">
                  Approved for €{application.approval.amount.toLocaleString()}
                </p>
                {application.approval.conditions.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-green-800 mb-1">Conditions:</p>
                    <ul className="space-y-1">
                      {application.approval.conditions.map((condition, index) => (
                        <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                          <span className="block">•</span>
                          <span>{condition}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {application.approval.approvalLetter && (
                <button className="mt-3 flex items-center gap-2 text-green-700 hover:text-green-800">
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Download Approval Letter</span>
                </button>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Applied {format(application.applicationDate, 'MMM d')}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Updated {formatDistanceToNow(application.lastUpdateDate)} ago
              </span>
            </div>
            <button
              onClick={() => setExpandedApplication(isExpanded ? null : application.id)}
              className="flex items-center gap-1 text-[#7C3AED] hover:text-[#6B21A8]"
            >
              {isExpanded ? 'Less' : 'More'} Details
              <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t"
            >
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Loan Details</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Property Price</span>
                        <span className="text-sm font-medium">€{application.property.price.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Loan Amount</span>
                        <span className="text-sm font-medium">€{application.loanDetails.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Deposit</span>
                        <span className="text-sm font-medium">
                          €{(application.property.price - application.loanDetails.amount).toLocaleString()} 
                          ({100 - application.loanDetails.ltv}%)
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Interest</span>
                        <span className="text-sm font-medium">€{application.loanDetails.totalInterest.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Payable</span>
                        <span className="text-sm font-medium">€{application.loanDetails.totalPayable.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Applicant Details</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Annual Income</span>
                        <span className="text-sm font-medium">€{application.applicantDetails.income.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Employment</span>
                        <span className="text-sm font-medium capitalize">{application.applicantDetails.employmentStatus}</span>
                      </div>
                      {application.applicantDetails.creditScore && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Credit Score</span>
                          <span className="text-sm font-medium">{application.applicantDetails.creditScore}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Existing Debts</span>
                        <span className="text-sm font-medium">€{application.applicantDetails.existingDebts.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Dependents</span>
                        <span className="text-sm font-medium">{application.applicantDetails.dependents}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {application.documents.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Documents</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {application.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium">{doc.name}</p>
                              <p className="text-xs text-gray-500">
                                {doc.status === 'uploaded' || doc.status === 'approved'
                                  ? `Uploaded ${format(doc.uploadedDate!, 'MMM d')}`
                                  : 'Pending upload'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-medium px-2 py-1 rounded ${
                              doc.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : doc.status === 'uploaded'
                                ? 'bg-blue-100 text-blue-800'
                                : doc.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {doc.status}
                            </span>
                            {doc.status === 'pending' && (
                              <button className="text-[#7C3AED] hover:text-[#6B21A8]">
                                <Upload className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {application.tasks.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Outstanding Tasks</h4>
                    <div className="space-y-3">
                      {application.tasks.filter(t => t.status === 'pending').map((task) => (
                        <div key={task.id} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                          <input
                            type="checkbox"
                            className="mt-0.5"
                            onChange={() => {
                              // TODO: Mark task as complete
                            }}
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{task.title}</p>
                            <p className="text-xs text-gray-600">{task.description}</p>
                            {task.dueDate && (
                              <p className="text-xs text-yellow-700 mt-1">
                                Due {format(task.dueDate, 'MMM d, yyyy')}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {application.advisor && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Your Mortgage Advisor</h4>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      {application.advisor.photo ? (
                        <img
                          src={application.advisor.photo}
                          alt={application.advisor.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{application.advisor.name}</p>
                        <p className="text-sm text-gray-600">{application.advisor.company}</p>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {application.advisor.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {application.advisor.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {application.timeline.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Timeline</h4>
                    <div className="space-y-3">
                      {application.timeline.map((event, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="w-2 h-2 bg-[#7C3AED] rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{event.event}</p>
                            <p className="text-xs text-gray-500">
                              {format(event.date, 'MMM d, yyyy h:mm a')}
                            </p>
                            {event.details && (
                              <p className="text-sm text-gray-600 mt-1">{event.details}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button className="btn btn-outline">
                    View Property
                  </button>
                  {application.status === 'in-review' && (
                    <button className="btn btn-outline">
                      Upload Documents
                    </button>
                  )}
                  <button className="btn btn-outline">
                    Contact Advisor
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const MortgageCalculatorModal = () => {
    useEffect(() => {
      calculateMortgage();
    }, [propertyPrice, deposit, interestRate, loanTerm, annualIncome, monthlyExpenses]);

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 my-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Mortgage Calculator</h3>
            <button
              onClick={() => setShowCalculator(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Price
                </label>
                <div className="relative">
                  <Euro className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={propertyPrice}
                    onChange={(e) => setPropertyPrice(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deposit ({((deposit / propertyPrice) * 100).toFixed(0)}%)
                </label>
                <div className="relative">
                  <Euro className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={deposit}
                    onChange={(e) => setDeposit(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
                  />
                </div>
                <input
                  type="range"
                  min={propertyPrice * 0.05}
                  max={propertyPrice * 0.5}
                  value={deposit}
                  onChange={(e) => setDeposit(Number(e.target.value))}
                  className="w-full mt-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interest Rate (%)
                </label>
                <div className="relative">
                  <Percent className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Term (Years)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
                  />
                </div>
              </div>

              <hr className="my-4" />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Income (for affordability)
                </label>
                <div className="relative">
                  <Euro className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Expenses
                </label>
                <div className="relative">
                  <Euro className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={monthlyExpenses}
                    onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {calculatorResults && (
              <div className="space-y-6">
                <div className="bg-[#7C3AED]/10 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-[#7C3AED] mb-4">Loan Summary</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Loan Amount</span>
                      <span className="font-bold text-xl">€{calculatorResults.loanAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Monthly Payment</span>
                      <span className="font-bold text-xl text-[#7C3AED]">
                        €{Math.round(calculatorResults.monthlyPayment).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">LTV Ratio</span>
                      <span className="font-medium">{calculatorResults.ltv.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Interest</span>
                      <span className="font-medium">€{Math.round(calculatorResults.totalInterest).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Payable</span>
                      <span className="font-medium">€{Math.round(calculatorResults.totalPayable).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="text-gray-700 font-medium">Total Cost</span>
                      <span className="font-bold">
                        €{Math.round(calculatorResults.totalPayable + deposit).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-blue-900 mb-4">Affordability Check</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-700">Max Loan (3.5x Income)</span>
                        <span className="font-medium">
                          €{calculatorResults.affordability.basedOnIncome.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(100, (calculatorResults.loanAmount / calculatorResults.affordability.basedOnIncome) * 100)}%`
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-700">Based on Monthly Budget</span>
                        <span className="font-medium">
                          €{Math.round(calculatorResults.affordability.basedOnExpenses).toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(100, (calculatorResults.loanAmount / calculatorResults.affordability.basedOnExpenses) * 100)}%`
                          }}
                        />
                      </div>
                    </div>
                    <div className="pt-3 border-t">
                      <span className="text-blue-700">Stress Test Rate (+2%)</span>
                      <span className="float-right font-medium">{calculatorResults.affordability.stressTestedRate}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowCalculator(false);
                      setShowNewApplication(true);
                    }}
                    className="flex-1 btn btn-primary"
                  >
                    Apply for Mortgage
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Save calculation
                    }}
                    className="flex-1 btn btn-outline"
                  >
                    Save Calculation
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  };

  if (!user || user.role !== 'buyer') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mortgage Applications</h1>
              <p className="text-gray-600 mt-1">Manage your mortgage applications and financing</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCalculator(true)}
                className="btn btn-outline flex items-center gap-2"
              >
                <Calculator className="w-5 h-5" />
                Calculator
              </button>
              <button
                onClick={() => setShowNewApplication(true)}
                className="btn btn-primary flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                New Application
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            {(['all', 'active', 'approved', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === status
                    ? 'bg-[#7C3AED] text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {applications.filter(a => {
                    switch (status) {
                      case 'all':
                        return true;
                      case 'active':
                        return ['submitted', 'in-review'].includes(a.status);
                      case 'approved':
                        return a.status === 'approved';
                      case 'rejected':
                        return a.status === 'rejected';
                      default:
                        return false;
                    }
                  }).length}
                </span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#7C3AED] border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <PiggyBank className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No mortgage applications</h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all'
                  ? 'Start your journey to homeownership with a mortgage application.'
                  : `No ${filter} applications at the moment.`}
              </p>
              {filter !== 'all' ? (
                <button
                  onClick={() => setFilter('all')}
                  className="btn btn-outline"
                >
                  View All Applications
                </button>
              ) : (
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowCalculator(true)}
                    className="btn btn-outline"
                  >
                    Use Calculator
                  </button>
                  <button
                    onClick={() => setShowNewApplication(true)}
                    className="btn btn-primary"
                  >
                    Apply for Mortgage
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredApplications.map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </div>
          )}
        </div>

        {filteredApplications.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#7C3AED]/10 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-[#7C3AED]" />
                </div>
                <h3 className="text-lg font-semibold">Market Rates</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">3-Year Fixed</span>
                  <span className="font-medium">3.25%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">5-Year Fixed</span>
                  <span className="font-medium">3.45%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Variable Rate</span>
                  <span className="font-medium">3.15%</span>
                </div>
              </div>
              <button className="w-full mt-4 btn btn-outline btn-sm">
                Compare Rates
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#10B981]/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#10B981]" />
                </div>
                <h3 className="text-lg font-semibold">Insurance</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Protect your home and mortgage with comprehensive insurance
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Home Insurance</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Life Insurance</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Income Protection</span>
                </li>
              </ul>
              <button className="w-full mt-4 btn btn-outline btn-sm">
                Get Quotes
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center">
                  <Info className="w-6 h-6 text-[#F59E0B]" />
                </div>
                <h3 className="text-lg font-semibold">Resources</h3>
              </div>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-sm text-[#7C3AED] hover:underline flex items-center gap-2">
                    First-Time Buyer Guide
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-[#7C3AED] hover:underline flex items-center gap-2">
                    Mortgage Checklist
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-[#7C3AED] hover:underline flex items-center gap-2">
                    Tax Benefits
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-[#7C3AED] hover:underline flex items-center gap-2">
                    Government Schemes
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {showCalculator && <MortgageCalculatorModal />}
    </div>
  );
};

export default BuyerMortgagePage;