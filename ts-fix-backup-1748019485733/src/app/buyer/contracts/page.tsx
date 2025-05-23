'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  User,
  Building,
  Phone,
  Mail,
  Download,
  Upload,
  Eye,
  Send,
  MessageSquare,
  Shield,
  Gavel,
  Edit3,
  FileSignature,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
  Lock,
  Unlock,
  Copy,
  ExternalLink,
  Info,
  Stamp,
  FileCheck2
} from 'lucide-react';
import { format, formatDistanceToNow, addDays } from 'date-fns';

interface Contract {
  id: string;
  propertyId: string;
  developmentName: string;
  unitType: string;
  unitNumber: string;
  purchasePrice: number;
  status: 'draft' | 'pending-review' | 'ready-to-sign' | 'signed' | 'countersigned' | 'completed' | 'terminated';
  type: 'purchase-agreement' | 'deposit-receipt' | 'contracts-for-sale' | 'deed-of-sale' | 'side-letter';
  createdDate: Date;
  lastModifiedDate: Date;
  signedDate?: Date;
  completionDate?: Date;
  parties: {
    buyer: {
      name: string;
      address: string;
      email: string;
      solicitor: {
        name: string;
        firm: string;
        phone: string;
        email: string;
      };
    };
    seller: {
      name: string;
      company: string;
      solicitor: {
        name: string;
        firm: string;
        phone: string;
        email: string;
      };
    };
  };
  keyTerms: {
    closingDate: Date;
    depositAmount: number;
    depositPaid: boolean;
    balanceDue: number;
    conditions: string[];
    specialConditions: string[];
  };
  documents: Array<{
    id: string;
    name: string;
    type: string;
    version: number;
    status: 'draft' | 'final' | 'signed';
    uploadedDate: Date;
    uploadedBy: string;
    size: number;
    url: string;
    requiresSignature: boolean;
    signedBy?: string[];
  }>\n  );
  signatures: Array<{
    party: 'buyer' | 'seller' | 'buyer-solicitor' | 'seller-solicitor';
    name: string;
    signedDate?: Date;
    status: 'pending' | 'signed' | 'declined';
    ipAddress?: string;
    method: 'electronic' | 'wet-ink';
  }>\n  );
  amendments: Array<{
    id: string;
    date: Date;
    description: string;
    proposedBy: string;
    status: 'proposed' | 'accepted' | 'rejected';
    document?: string;
  }>\n  );
  timeline: Array<{
    event: string;
    date: Date;
    description?: string;
    user?: string;
  }>\n  );
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    assignedTo: string;
    dueDate?: Date;
    status: 'pending' | 'in-progress' | 'completed' | 'overdue';
    priority: 'low' | 'medium' | 'high';
  }>\n  );
  communications: Array<{
    id: string;
    date: Date;
    from: string;
    to: string[];
    subject: string;
    message: string;
    attachments?: string[];
  }>\n  );
  issues?: Array<{
    id: string;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    status: 'open' | 'resolved';
    raisedDate: Date;
    resolvedDate?: Date;
  }>\n  );
}

const BuyerContractsPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [contractssetContracts] = useState<Contract[]>([]);
  const [filteredContractssetFilteredContracts] = useState<Contract[]>([]);
  const [loadingsetLoading] = useState(true);
  const [filtersetFilter] = useState<'all' | 'active' | 'completed' | 'requires-action'>('all');
  const [selectedContractsetSelectedContract] = useState<Contract | null>(null);
  const [showDocumentViewersetShowDocumentViewer] = useState(false);
  const [selectedDocumentsetSelectedDocument] = useState<Contract['documents'][0] | null>(null);
  const [showSignatureModalsetShowSignatureModal] = useState(false);
  const [expandedContractsetExpandedContract] = useState<string | null>(null);

  // Protect the route
  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'buyer') {
      router.push('/unauthorized');
    }
  }, [userrouter]);

  // Fetch contracts
  useEffect(() => {
    if (user?.role === 'buyer') {
      fetchContracts();
    }
  }, [user]);

  // Filter contracts
  useEffect(() => {
    let filtered = [...contracts];

    switch (filter) {
      case 'active':
        filtered = filtered.filter(c => 
          ['pending-review', 'ready-to-sign', 'signed'].includes(c.status)
        );
        break;
      case 'completed':
        filtered = filtered.filter(c => c.status === 'completed');
        break;
      case 'requires-action':
        filtered = filtered.filter(c => {
          const hasPendingSignature = c.signatures.some(s => s.status === 'pending' && s.party === 'buyer');
          const hasOverdueTasks = c.tasks.some(t => t.status === 'overdue' && t.assignedTo === 'buyer');
          const hasOpenIssues = c.issues?.some(i => i.status === 'open' && i.severity === 'high');
          return hasPendingSignature || hasOverdueTasks || hasOpenIssues;
        });
        break;
    }

    filtered.sort((ab) => b.lastModifiedDate.getTime() - a.lastModifiedDate.getTime());
    setFilteredContracts(filtered);
  }, [contractsfilter]);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      // Mock data for now
      const mockContracts: Contract[] = [
        {
          id: '1',
          propertyId: 'prop1',
          developmentName: 'Ballymakenny View',
          unitType: 'Type A - The Oak',
          unitNumber: 'A12',
          purchasePrice: 425000,
          status: 'ready-to-sign',
          type: 'contracts-for-sale',
          createdDate: new Date('2024-01-20'),
          lastModifiedDate: new Date('2024-01-22'),
          parties: {
            buyer: {
              name: user?.name || 'John Doe',
              address: '123 Main St, Dublin',
              email: user?.email || 'john@example.com',
              solicitor: {
                name: 'Sarah Murphy',
                firm: 'Murphy & Associates',
                phone: '+353 1 234 5678',
                email: 'sarah@murphylaw.ie'
              }
            },
            seller: {
              name: 'Ballymakenny Developments Ltd',
              company: 'Ballymakenny Developments Ltd',
              solicitor: {
                name: 'James O\'Brien',
                firm: 'O\'Brien Legal',
                phone: '+353 1 345 6789',
                email: 'james@obrienlegal.ie'
              }
            }
          },
          keyTerms: {
            closingDate: addDays(new Date(), 60),
            depositAmount: 42500,
            depositPaid: true,
            balanceDue: 382500,
            conditions: [
              'Subject to satisfactory building inspection',
              'Subject to clear title',
              'Subject to mortgage approval'
            ],
            specialConditions: [
              'Vendor to complete landscaping before closing',
              'All appliances included in sale'
            ]
          },
          documents: [
            {
              id: 'doc1',
              name: 'Contract for Sale - Draft v3',
              type: 'pdf',
              version: 3,
              status: 'final',
              uploadedDate: new Date('2024-01-22'),
              uploadedBy: 'Seller Solicitor',
              size: 2457600,
              url: '/contracts/contract-v3.pdf',
              requiresSignature: true,
              signedBy: []
            },
            {
              id: 'doc2',
              name: 'Deposit Receipt',
              type: 'pdf',
              version: 1,
              status: 'signed',
              uploadedDate: new Date('2024-01-15'),
              uploadedBy: 'System',
              size: 524288,
              url: '/contracts/deposit-receipt.pdf',
              requiresSignature: false,
              signedBy: ['buyer', 'seller']
            },
            {
              id: 'doc3',
              name: 'Special Conditions Addendum',
              type: 'pdf',
              version: 1,
              status: 'final',
              uploadedDate: new Date('2024-01-21'),
              uploadedBy: 'Buyer Solicitor',
              size: 131072,
              url: '/contracts/special-conditions.pdf',
              requiresSignature: true,
              signedBy: []
            }
          ],
          signatures: [
            {
              party: 'buyer',
              name: user?.name || 'John Doe',
              status: 'pending',
              method: 'electronic'
            },
            {
              party: 'seller',
              name: 'Mark Thompson',
              status: 'pending',
              method: 'electronic'
            },
            {
              party: 'buyer-solicitor',
              name: 'Sarah Murphy',
              status: 'pending',
              method: 'electronic'
            },
            {
              party: 'seller-solicitor',
              name: 'James O\'Brien',
              signedDate: new Date('2024-01-22'),
              status: 'signed',
              ipAddress: '192.168.1.100',
              method: 'electronic'
            }
          ],
          amendments: [],
          timeline: [
            {
              event: 'Contract created',
              date: new Date('2024-01-20'),
              user: 'Seller Solicitor'
            },
            {
              event: 'Deposit paid',
              date: new Date('2024-01-15'),
              description: '10% deposit transferred'
            },
            {
              event: 'Special conditions added',
              date: new Date('2024-01-21'),
              user: 'Buyer Solicitor'
            },
            {
              event: 'Contract finalized',
              date: new Date('2024-01-22'),
              description: 'Ready for signatures'
            }
          ],
          tasks: [
            {
              id: 'task1',
              title: 'Review final contract',
              description: 'Review and approve the final contract terms',
              assignedTo: 'buyer',
              dueDate: addDays(new Date(), 3),
              status: 'pending',
              priority: 'high'
            },
            {
              id: 'task2',
              title: 'Sign contract',
              description: 'Electronically sign the contract for sale',
              assignedTo: 'buyer',
              dueDate: addDays(new Date(), 5),
              status: 'pending',
              priority: 'high'
            }
          ],
          communications: [
            {
              id: 'comm1',
              date: new Date('2024-01-22'),
              from: 'Sarah Murphy',
              to: [user?.email || 'john@example.com'],
              subject: 'Contract Ready for Signature',
              message: 'The contract has been finalized and is ready for your signature. Please review and sign at your earliest convenience.'
            }
          ]
        },
        {
          id: '2',
          propertyId: 'prop2',
          developmentName: 'FitzGerald Gardens',
          unitType: 'Type B - The Maple',
          unitNumber: 'B24',
          purchasePrice: 395000,
          status: 'completed',
          type: 'deed-of-sale',
          createdDate: new Date('2024-01-05'),
          lastModifiedDate: new Date('2024-01-18'),
          signedDate: new Date('2024-01-10'),
          completionDate: new Date('2024-01-18'),
          parties: {
            buyer: {
              name: user?.name || 'John Doe',
              address: '123 Main St, Dublin',
              email: user?.email || 'john@example.com',
              solicitor: {
                name: 'Sarah Murphy',
                firm: 'Murphy & Associates',
                phone: '+353 1 234 5678',
                email: 'sarah@murphylaw.ie'
              }
            },
            seller: {
              name: 'FitzGerald Properties Ltd',
              company: 'FitzGerald Properties Ltd',
              solicitor: {
                name: 'Mary Walsh',
                firm: 'Walsh Legal Services',
                phone: '+353 1 456 7890',
                email: 'mary@walshlegal.ie'
              }
            }
          },
          keyTerms: {
            closingDate: new Date('2024-01-18'),
            depositAmount: 39500,
            depositPaid: true,
            balanceDue: 0,
            conditions: [
              'Clear title confirmed',
              'Building inspection completed'
            ],
            specialConditions: []
          },
          documents: [
            {
              id: 'doc4',
              name: 'Deed of Sale - Final',
              type: 'pdf',
              version: 1,
              status: 'signed',
              uploadedDate: new Date('2024-01-18'),
              uploadedBy: 'System',
              size: 3145728,
              url: '/contracts/deed-of-sale.pdf',
              requiresSignature: false,
              signedBy: ['buyer', 'seller', 'buyer-solicitor', 'seller-solicitor']
            },
            {
              id: 'doc5',
              name: 'Final Statement of Account',
              type: 'pdf',
              version: 1,
              status: 'final',
              uploadedDate: new Date('2024-01-18'),
              uploadedBy: 'Seller Solicitor',
              size: 262144,
              url: '/contracts/final-statement.pdf',
              requiresSignature: false
            }
          ],
          signatures: [
            {
              party: 'buyer',
              name: user?.name || 'John Doe',
              signedDate: new Date('2024-01-10'),
              status: 'signed',
              ipAddress: '192.168.1.50',
              method: 'electronic'
            },
            {
              party: 'seller',
              name: 'Patrick FitzGerald',
              signedDate: new Date('2024-01-10'),
              status: 'signed',
              ipAddress: '192.168.1.51',
              method: 'electronic'
            },
            {
              party: 'buyer-solicitor',
              name: 'Sarah Murphy',
              signedDate: new Date('2024-01-10'),
              status: 'signed',
              method: 'electronic'
            },
            {
              party: 'seller-solicitor',
              name: 'Mary Walsh',
              signedDate: new Date('2024-01-10'),
              status: 'signed',
              method: 'electronic'
            }
          ],
          amendments: [],
          timeline: [
            {
              event: 'Contract signed',
              date: new Date('2024-01-10'),
              description: 'All parties signed the contract'
            },
            {
              event: 'Balance transferred',
              date: new Date('2024-01-17'),
              description: 'Final payment completed'
            },
            {
              event: 'Sale completed',
              date: new Date('2024-01-18'),
              description: 'Keys handed over'
            }
          ],
          tasks: [],
          communications: [
            {
              id: 'comm2',
              date: new Date('2024-01-18'),
              from: 'Mary Walsh',
              to: [user?.email || 'john@example.com'],
              subject: 'Sale Completed - Congratulations!',
              message: 'The sale has been completed successfully. Congratulations on your new home!'
            }
          ]
        }
      ];
      setContracts(mockContracts);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  const signContract = async (contractId: string) => {
    try {
      // TODO: Implement actual e-signature integration
      setContracts(prev =>
        prev.map(contract => {
          if (contract.id === contractId) {
            return {
              ...contract,
              signatures: contract.signatures.map(sig =>
                sig.party === 'buyer'
                  ? { ...sig, status: 'signed', signedDate: new Date() }
                  : sig
              ),
              timeline: [
                ...contract.timeline,
                {
                  event: 'Contract signed by buyer',
                  date: new Date(),
                  user: user?.name || 'Buyer'
                }
              ]
            };
          }
          return contract;
        })
      );
      setShowSignatureModal(false);
    } catch (error) {

    }
  };

  const ContractCard = ({ contract }: { contract: Contract }) => {
    const isExpanded = expandedContract === contract.id;
    const pendingSignatures = contract.signatures.filter(s => s.status === 'pending').length;
    const pendingTasks = contract.tasks.filter(t => t.status === 'pending' || t.status === 'overdue').length;
    const openIssues = contract.issues?.filter(i => i.status === 'open').length || 0;

    const getStatusColor = (status: Contract['status']) => {
      switch (status) {
        case 'completed':
          return 'bg-green-100 text-green-800';
        case 'ready-to-sign':
          return 'bg-blue-100 text-blue-800';
        case 'signed':
        case 'countersigned':
          return 'bg-purple-100 text-purple-800';
        case 'pending-review':
          return 'bg-yellow-100 text-yellow-800';
        case 'terminated':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    const getContractTypeLabel = (type: Contract['type']) => {
      switch (type) {
        case 'purchase-agreement':
          return 'Purchase Agreement';
        case 'deposit-receipt':
          return 'Deposit Receipt';
        case 'contracts-for-sale':
          return 'Contracts for Sale';
        case 'deed-of-sale':
          return 'Deed of Sale';
        case 'side-letter':
          return 'Side Letter';
        default:
          return type;
      }
    };

    const requiresAction = pendingSignatures> 0 || pendingTasks> 0 || openIssues> 0;

    return (
      <motion.div
        initial={ opacity: 0, y: 20 }
        animate={ opacity: 1, y: 0 }
        className={`bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all ${
          requiresAction ? 'ring-2 ring-[#7C3AED]' : ''
        }`}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{contract.developmentName}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                  {contract.status.charAt(0).toUpperCase() + contract.status.slice(1).replace('-', ' ')}
                </span>
              </div>
              <p className="text-gray-600">{contract.unitType} - Unit {contract.unitNumber}</p>
              <p className="text-sm text-gray-500">{getContractTypeLabel(contract.type)}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#7C3AED]">
                €{contract.purchasePrice.toLocaleString()}
              </p>
              {contract.keyTerms.closingDate && (
                <p className="text-sm text-gray-600">
                  Closing: {format(contract.keyTerms.closingDate, 'MMM d, yyyy')}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Deposit</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-medium">€{contract.keyTerms.depositAmount.toLocaleString()}</p>
                {contract.keyTerms.depositPaid && (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Balance Due</p>
              <p className="text-lg font-medium">€{contract.keyTerms.balanceDue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Documents</p>
              <p className="text-lg font-medium">{contract.documents.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Signatures</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-medium">
                  {contract.signatures.filter(s => s.status === 'signed').length}/{contract.signatures.length}
                </p>
                {pendingSignatures> 0 && (
                  <span className="text-sm text-orange-600">
                    ({pendingSignatures} pending)
                  </span>
                )}
              </div>
            </div>
          </div>

          {requiresAction && (
            <div className="bg-[#7C3AED]/10 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-[#7C3AED] mb-2">Action Required</h4>
              <div className="space-y-2">
                {pendingSignatures> 0 && (
                  <div className="flex items-center gap-2">
                    <FileSignature className="w-4 h-4 text-[#7C3AED]" />
                    <span className="text-sm text-[#7C3AED]">
                      {pendingSignatures} document{pendingSignatures> 1 ? 's' : ''} awaiting signature
                    </span>
                  </div>
                )}
                {pendingTasks> 0 && (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-orange-600">
                      {pendingTasks} pending task{pendingTasks> 1 ? 's' : ''}
                    </span>
                  </div>
                )}
                {openIssues> 0 && (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600">
                      {openIssues} open issue{openIssues> 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Created {format(contract.createdDate, 'MMM d')}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Updated {formatDistanceToNow(contract.lastModifiedDate)} ago
              </span>
            </div>
            <button
              onClick={() => setExpandedContract(isExpanded ? null : contract.id)}
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
              initial={ height: 0, opacity: 0 }
              animate={ height: 'auto', opacity: 1 }
              exit={ height: 0, opacity: 0 }
              className="border-t"
            >
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Buyer Details</h4>
                    <div className="space-y-2">
                      <p className="text-sm"><span className="text-gray-600">Name:</span> {contract.parties.buyer.name}</p>
                      <p className="text-sm"><span className="text-gray-600">Solicitor:</span> {contract.parties.buyer.solicitor.name}</p>
                      <p className="text-sm"><span className="text-gray-600">Firm:</span> {contract.parties.buyer.solicitor.firm}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button className="text-sm text-[#7C3AED] hover:underline flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {contract.parties.buyer.solicitor.phone}
                        </button>
                        <button className="text-sm text-[#7C3AED] hover:underline flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          Email
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Seller Details</h4>
                    <div className="space-y-2">
                      <p className="text-sm"><span className="text-gray-600">Company:</span> {contract.parties.seller.company}</p>
                      <p className="text-sm"><span className="text-gray-600">Solicitor:</span> {contract.parties.seller.solicitor.name}</p>
                      <p className="text-sm"><span className="text-gray-600">Firm:</span> {contract.parties.seller.solicitor.firm}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button className="text-sm text-[#7C3AED] hover:underline flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {contract.parties.seller.solicitor.phone}
                        </button>
                        <button className="text-sm text-[#7C3AED] hover:underline flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          Email
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Contract Terms</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Standard Conditions</p>
                      <ul className="space-y-1">
                        {contract.keyTerms.conditions.map((conditionindex) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                            <span className="text-sm text-gray-600">{condition}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {contract.keyTerms.specialConditions.length> 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Special Conditions</p>
                        <ul className="space-y-1">
                          {contract.keyTerms.specialConditions.map((conditionindex) => (
                            <li key={index} className="flex items-start gap-2">
                              <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                              <span className="text-sm text-gray-600">{condition}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Documents</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {contract.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-gray-500">
                              Version {doc.version} • {(doc.size / 1024 / 1024).toFixed(1)} MB
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.requiresSignature && (
                            <span className={`text-xs font-medium px-2 py-1 rounded ${
                              doc.signedBy && doc.signedBy.includes('buyer')
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {doc.signedBy && doc.signedBy.includes('buyer') ? 'Signed' : 'Unsigned'}
                            </span>
                          )}
                          <button
                            onClick={() => {
                              setSelectedDocument(doc);
                              setShowDocumentViewer(true);
                            }
                            className="text-[#7C3AED] hover:text-[#6B21A8]"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-[#7C3AED] hover:text-[#6B21A8]">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Signatures</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {contract.signatures.map((sigindex) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          sig.status === 'signed'
                            ? 'bg-green-50 border-green-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {sig.status === 'signed' ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Clock className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-xs font-medium text-gray-700 capitalize">
                            {sig.party.replace('-', ' ')}
                          </span>
                        </div>
                        <p className="text-sm font-medium">{sig.name}</p>
                        {sig.signedDate && (
                          <p className="text-xs text-gray-500 mt-1">
                            {format(sig.signedDate, 'MMM d, h:mm a')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {contract.tasks.length> 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Tasks</h4>
                    <div className="space-y-3">
                      {contract.tasks.map((task) => (
                        <div key={task.id} className={`p-3 rounded-lg ${
                          task.status === 'overdue'
                            ? 'bg-red-50'
                            : task.status === 'completed'
                            ? 'bg-green-50'
                            : 'bg-yellow-50'
                        }`}>
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                checked={task.status === 'completed'}
                                className="mt-0.5"
                                onChange={() => {
                                  // TODO: Update task status
                                }
                              />
                              <div>
                                <p className="font-medium text-sm">{task.title}</p>
                                <p className="text-xs text-gray-600">{task.description}</p>
                                {task.dueDate && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Due {format(task.dueDate, 'MMM d')}
                                  </p>
                                )}
                              </div>
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded ${
                              task.priority === 'high'
                                ? 'bg-red-100 text-red-800'
                                : task.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {contract.timeline.length> 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Activity Timeline</h4>
                    <div className="space-y-3">
                      {contract.timeline.slice(-5).reverse().map((eventindex) => (
                        <div key={index} className="flex gap-3">
                          <div className="w-2 h-2 bg-[#7C3AED] rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{event.event}</p>
                            <p className="text-xs text-gray-500">
                              {format(event.date, 'MMM d, yyyy h:mm a')}
                              {event.user && ` • ${event.user}`}
                            </p>
                            {event.description && (
                              <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  {contract.status === 'ready-to-sign' && (
                    <button
                      onClick={() => {
                        setSelectedContract(contract);
                        setShowSignatureModal(true);
                      }
                      className="btn btn-primary"
                    >
                      <FileSignature className="w-4 h-4 mr-2" />
                      Sign Contract
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedContract(contract);
                      setShowDocumentViewer(true);
                    }
                    className="btn btn-outline"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Documents
                  </button>
                  <button className="btn btn-outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Solicitor
                  </button>
                  <button className="btn btn-outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download All
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const SignatureModal = () => {
    const [agreedsetAgreed] = useState(false);
    const [pinsetPin] = useState('');

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <motion.div
          initial={ scale: 0.9, opacity: 0 }
          animate={ scale: 1, opacity: 1 }
          className="bg-white rounded-lg p-6 max-w-lg w-full mx-4"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#7C3AED]/10 rounded-lg flex items-center justify-center">
              <FileSignature className="w-6 h-6 text-[#7C3AED]" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Electronic Signature</h3>
              <p className="text-sm text-gray-600">Sign your contract securely</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-700 mb-4">
              By signing this document electronically, you agree that your electronic signature
              is the legal equivalent of your manual signature on this contract.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium mb-2">Document Summary</h4>
              <p className="text-sm text-gray-600">
                Contract for Sale - {selectedContract?.developmentName}
              </p>
              <p className="text-sm text-gray-600">
                Unit {selectedContract?.unitNumber} - €{selectedContract?.purchasePrice.toLocaleString()}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span className="text-sm text-gray-700">
                    I have read and agree to the terms of this contract. I understand that this
                    electronic signature has the same legal effect as a handwritten signature.
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your PIN to sign
                </label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter 4-digit PIN"
                  maxLength={4}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowSignatureModal(false)}
              className="flex-1 btn btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (selectedContract) {
                  signContract(selectedContract.id);
                }
              }
              disabled={!agreed || pin.length !== 4}
              className="flex-1 btn btn-primary"
            >
              Sign Document
            </button>
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
              <h1 className="text-3xl font-bold text-gray-900">Contracts & Legal Documents</h1>
              <p className="text-gray-600 mt-1">Manage your property purchase contracts and legal documents</p>
            </div>
            <button className="btn btn-primary flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Document
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            {(['all', 'active', 'completed', 'requires-action'] as const).map((status) => {
              const count = contracts.filter(c => {
                switch (status) {
                  case 'all':
                    return true;
                  case 'active':
                    return ['pending-review', 'ready-to-sign', 'signed'].includes(c.status);
                  case 'completed':
                    return c.status === 'completed';
                  case 'requires-action':
                    const hasPendingSignature = c.signatures.some(s => s.status === 'pending' && s.party === 'buyer');
                    const hasOverdueTasks = c.tasks.some(t => t.status === 'overdue' && t.assignedTo === 'buyer');
                    const hasOpenIssues = c.issues?.some(i => i.status === 'open' && i.severity === 'high');
                    return hasPendingSignature || hasOverdueTasks || hasOpenIssues;
                  default:
                    return false;
                }
              }).length;

              return (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === status
                      ? 'bg-[#7C3AED] text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                  <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#7C3AED] border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading contracts...</p>
            </div>
          ) : filteredContracts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No contracts found</h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all'
                  ? 'Your contracts will appear here once they are created.'
                  : `No ${filter === 'requires-action' ? 'contracts requiring action' : filter + ' contracts'} at the moment.`}
              </p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="btn btn-outline"
                >
                  View All Contracts
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredContracts.map((contract) => (
                <ContractCard key={contract.id} contract={contract} />
              ))}
            </div>
          )}
        </div>

        {filteredContracts.length> 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#7C3AED]/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#7C3AED]" />
                </div>
                <h3 className="text-lg font-semibold">Security</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                All documents are encrypted and stored securely
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-green-600" />
                  <span>256-bit encryption</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Legally binding e-signatures</span>
                </li>
                <li className="flex items-center gap-2">
                  <Stamp className="w-4 h-4 text-green-600" />
                  <span>Audit trail maintained</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#10B981]/10 rounded-lg flex items-center justify-center">
                  <FileCheck2 className="w-6 h-6 text-[#10B981]" />
                </div>
                <h3 className="text-lg font-semibold">Document Status</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Documents</span>
                  <span className="font-medium">
                    {contracts.reduce((accc) => acc + c.documents.length0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Awaiting Signature</span>
                  <span className="font-medium text-orange-600">
                    {contracts.reduce((accc) => 
                      acc + c.signatures.filter(s => s.status === 'pending' && s.party === 'buyer').length, 0
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-medium text-green-600">
                    {contracts.filter(c => c.status === 'completed').length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center">
                  <Info className="w-6 h-6 text-[#F59E0B]" />
                </div>
                <h3 className="text-lg font-semibold">Legal Resources</h3>
              </div>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-sm text-[#7C3AED] hover:underline flex items-center gap-2">
                    Property Law Guide
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-[#7C3AED] hover:underline flex items-center gap-2">
                    Contract Glossary
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-[#7C3AED] hover:underline flex items-center gap-2">
                    FAQ: Legal Process
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-[#7C3AED] hover:underline flex items-center gap-2">
                    Contact Legal Support
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {showSignatureModal && <SignatureModal />}

      {showDocumentViewer && selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={ scale: 0.9, opacity: 0 }
            animate={ scale: 1, opacity: 1 }
            className="bg-white rounded-lg p-6 max-w-4xl w-full h-[90vh] mx-4 flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{selectedDocument.name}</h3>
              <button
                onClick={() => setShowDocumentViewer(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Document viewer would be embedded here</p>
            </div>
            <div className="flex gap-3 mt-4">
              <button className="btn btn-outline">
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
              <button className="btn btn-outline">
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </button>
              {selectedDocument.requiresSignature && !selectedDocument.signedBy?.includes('buyer') && (
                <button
                  onClick={() => {
                    setShowDocumentViewer(false);
                    setShowSignatureModal(true);
                  }
                  className="btn btn-primary"
                >
                  <FileSignature className="w-4 h-4 mr-2" />
                  Sign Document
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BuyerContractsPage;