'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Euro,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  Building,
  Phone,
  Mail,
  Edit,
  Download,
  Share2,
  MessageSquare,
  Shield,
  Calculator,
  Info,
  ChevronRight,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface Offer {
  id: string;
  propertyId: string;
  developmentName: string;
  unitType: string;
  unitNumber: string;
  propertyPrice: number;
  offerAmount: number;
  status: 'draft' | 'submitted' | 'under-review' | 'countered' | 'accepted' | 'rejected' | 'withdrawn' | 'expired';
  submittedDate?: Date;
  expiryDate?: Date;
  lastUpdateDate: Date;
  conditions: string[];
  deposit: {
    amount: number;
    paid: boolean;
    dueDate?: Date;
    receiptUrl?: string;
  };
  financing: {
    type: 'cash' | 'mortgage';
    mortgageApproved?: boolean;
    approvalAmount?: number;
    lender?: string;
  };
  counterOffer?: {
    amount: number;
    conditions: string[];
    expiryDate: Date;
    message?: string;
  };
  agent: {
    id: string;
    name: string;
    phone: string;
    email: string;
    photo?: string;
  };
  solicitor?: {
    name: string;
    firm: string;
    phone: string;
    email: string;
  };
  documents: Array<{
    id: string;
    name: string;
    type: string;
    uploadedDate: Date;
    url: string;
  }>\n  );
  communications: Array<{
    id: string;
    type: 'note' | 'message' | 'update';
    sender: string;
    content: string;
    date: Date;
  }>\n  );
  timeline: Array<{
    event: string;
    date: Date;
    details?: string;
  }>\n  );
  competingOffers?: number;
  propertyDetails: {
    askingPrice: number;
    beds: number;
    baths: number;
    sqft: number;
    image?: string;
  };
}

const BuyerOffersPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [offerssetOffers] = useState<Offer[]>([]);
  const [filteredOfferssetFilteredOffers] = useState<Offer[]>([]);
  const [loadingsetLoading] = useState(true);
  const [filtersetFilter] = useState<'all' | 'active' | 'accepted' | 'rejected'>('all');
  const [showNewOffersetShowNewOffer] = useState(false);
  const [selectedOffersetSelectedOffer] = useState<Offer | null>(null);
  const [showCounterOffersetShowCounterOffer] = useState(false);
  const [showOfferCalculatorsetShowOfferCalculator] = useState(false);
  const [expandedOffersetExpandedOffer] = useState<string | null>(null);

  // Protect the route
  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'buyer') {
      router.push('/unauthorized');
    }
  }, [userrouter]);

  // Fetch offers
  useEffect(() => {
    if (user?.role === 'buyer') {
      fetchOffers();
    }
  }, [user]);

  // Filter offers
  useEffect(() => {
    let filtered = [...offers];

    switch (filter) {
      case 'active':
        filtered = filtered.filter(o => 
          ['submitted', 'under-review', 'countered'].includes(o.status)
        );
        break;
      case 'accepted':
        filtered = filtered.filter(o => o.status === 'accepted');
        break;
      case 'rejected':
        filtered = filtered.filter(o => o.status === 'rejected');
        break;
    }

    filtered.sort((ab: any) => b.lastUpdateDate.getTime() - a.lastUpdateDate.getTime());
    setFilteredOffers(filtered);
  }, [offersfilter]);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      // Mock data for now
      const mockOffers: Offer[] = [
        {
          id: '1',
          propertyId: 'prop1',
          developmentName: 'Ballymakenny View',
          unitType: 'Type A - The Oak',
          unitNumber: 'A12',
          propertyPrice: 425000,
          offerAmount: 415000,
          status: 'countered',
          submittedDate: new Date('2024-01-15'),
          expiryDate: new Date('2024-01-25'),
          lastUpdateDate: new Date('2024-01-18'),
          conditions: [
            'Subject to mortgage approval',
            'Subject to satisfactory survey',
            'Completion within 90 days'
          ],
          deposit: {
            amount: 41500,
            paid: false,
            dueDate: new Date('2024-01-25')
          },
          financing: {
            type: 'mortgage',
            mortgageApproved: true,
            approvalAmount: 380000,
            lender: 'Bank of Ireland'
          },
          counterOffer: {
            amount: 420000,
            conditions: ['Remove survey condition'],
            expiryDate: new Date('2024-01-22'),
            message: 'We appreciate your offer. We can accept €420,000 with the survey condition removed.'
          },
          agent: {
            id: 'agent1',
            name: 'Sarah Johnson',
            phone: '+353 1 234 5678',
            email: 'sarah.johnson@prop.ie',
            photo: '/images/agents/sarah.jpg'
          },
          solicitor: {
            name: 'John Smith',
            firm: 'Smith & Associates',
            phone: '+353 1 456 7890',
            email: 'john.smith@smithlaw.ie'
          },
          documents: [
            {
              id: 'doc1',
              name: 'Mortgage Approval Letter',
              type: 'pdf',
              uploadedDate: new Date('2024-01-14'),
              url: '/documents/mortgage-approval.pdf'
            }
          ],
          communications: [
            {
              id: 'comm1',
              type: 'message',
              sender: 'Sarah Johnson',
              content: 'The seller has made a counter offer. Please review and let me know how you\'d like to proceed.',
              date: new Date('2024-01-18')
            }
          ],
          timeline: [
            {
              event: 'Offer submitted',
              date: new Date('2024-01-15'),
              details: 'Initial offer of €415,000'
            },
            {
              event: 'Counter offer received',
              date: new Date('2024-01-18'),
              details: 'Seller countered at €420,000'
            }
          ],
          competingOffers: 2,
          propertyDetails: {
            askingPrice: 425000,
            beds: 3,
            baths: 2,
            sqft: 1200,
            image: '/images/properties/property1.jpg'
          }
        },
        {
          id: '2',
          propertyId: 'prop2',
          developmentName: 'FitzGerald Gardens',
          unitType: 'Type B - The Maple',
          unitNumber: 'B24',
          propertyPrice: 395000,
          offerAmount: 395000,
          status: 'accepted',
          submittedDate: new Date('2024-01-10'),
          lastUpdateDate: new Date('2024-01-12'),
          conditions: [
            'Subject to mortgage approval',
            'Chain-free purchase'
          ],
          deposit: {
            amount: 39500,
            paid: true,
            receiptUrl: '/receipts/deposit-b24.pdf'
          },
          financing: {
            type: 'mortgage',
            mortgageApproved: true,
            approvalAmount: 350000,
            lender: 'AIB'
          },
          agent: {
            id: 'agent2',
            name: 'Michael O\'Brien',
            phone: '+353 1 345 6789',
            email: 'michael.obrien@prop.ie'
          },
          documents: [
            {
              id: 'doc2',
              name: 'Offer Acceptance Letter',
              type: 'pdf',
              uploadedDate: new Date('2024-01-12'),
              url: '/documents/acceptance.pdf'
            },
            {
              id: 'doc3',
              name: 'Deposit Receipt',
              type: 'pdf',
              uploadedDate: new Date('2024-01-13'),
              url: '/documents/deposit-receipt.pdf'
            }
          ],
          communications: [],
          timeline: [
            {
              event: 'Offer submitted',
              date: new Date('2024-01-10'),
              details: 'Full asking price offer'
            },
            {
              event: 'Offer accepted',
              date: new Date('2024-01-12')
            },
            {
              event: 'Deposit paid',
              date: new Date('2024-01-13'),
              details: '10% deposit transferred'
            }
          ],
          propertyDetails: {
            askingPrice: 395000,
            beds: 2,
            baths: 2,
            sqft: 950,
            image: '/images/properties/property2.jpg'
          }
        }
      ];
      setOffers(mockOffers);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  const submitOffer = async (offer: Partial<Offer>) => {
    try {
      // TODO: API call to submit offer
      const newOffer: Offer = {
        ...offer as Offer,
        id: Date.now().toString(),
        status: 'submitted',
        submittedDate: new Date(),
        lastUpdateDate: new Date(),
        timeline: [{
          event: 'Offer submitted',
          date: new Date(),
          details: `Offer of €${offer.offerAmount?.toLocaleString()}`
        }]
      };
      setOffers([...offersnewOffer]);
      setShowNewOffer(false);
    } catch (error) {

    }
  };

  const withdrawOffer = async (offerId: string) => {
    try {
      setOffers(prev =>
        prev.map(o =>
          o.id === offerId
            ? { 
                ...o, 
                status: 'withdrawn',
                lastUpdateDate: new Date(),
                timeline: [...o.timeline, {
                  event: 'Offer withdrawn',
                  date: new Date()
                }]
              }
            : o
        )
      );
    } catch (error) {

    }
  };

  const OfferCard = ({ offer }: { offer: Offer }) => {
    const isExpanded = expandedOffer === offer.id;
    const offerPercentage = ((offer.offerAmount / offer.propertyPrice) * 100).toFixed(1);

    const getStatusColor = (status: Offer['status']) => {
      switch (status) {
        case 'accepted':
          return 'bg-green-100 text-green-800';
        case 'rejected':
          return 'bg-red-100 text-red-800';
        case 'countered':
          return 'bg-yellow-100 text-yellow-800';
        case 'submitted':
        case 'under-review':
          return 'bg-blue-100 text-blue-800';
        case 'withdrawn':
        case 'expired':
          return 'bg-gray-100 text-gray-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <motion.div
        initial={ opacity: 0, y: 20 }
        animate={ opacity: 1, y: 0 }
        className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all"
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex gap-4">
              {offer.propertyDetails.image && (
                <img
                  src={offer.propertyDetails.image}
                  alt={offer.unitType}
                  className="w-24 h-24 object-cover rounded"
                />
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{offer.developmentName}</h3>
                <p className="text-gray-600">{offer.unitType} - Unit {offer.unitNumber}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>{offer.propertyDetails.beds} beds</span>
                  <span>{offer.propertyDetails.baths} baths</span>
                  <span>{offer.propertyDetails.sqft} sq ft</span>
                </div>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(offer.status)}`}>
              {offer.status.charAt(0).toUpperCase() + offer.status.slice(1).replace('-', ' ')}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Asking Price</p>
              <p className="text-lg font-medium">€{offer.propertyPrice.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Your Offer</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-medium text-[#7C3AED]">
                  €{offer.offerAmount.toLocaleString()}
                </p>
                <span className="text-sm text-gray-500">({offerPercentage}%)</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Deposit Status</p>
              <div className="flex items-center gap-2">
                {offer.deposit.paid ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">Paid</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-yellow-600">
                      Due {offer.deposit.dueDate ? format(offer.deposit.dueDate, 'MMM d') : 'TBD'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {offer.counterOffer && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-yellow-900">Counter Offer Received</h4>
                <span className="text-sm text-yellow-700">
                  Expires {format(offer.counterOffer.expiryDate, 'MMM d, h:mm a')}
                </span>
              </div>
              <div className="mb-2">
                <p className="text-2xl font-bold text-yellow-900">
                  €{offer.counterOffer.amount.toLocaleString()}
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  {offer.counterOffer.message}
                </p>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="btn btn-primary btn-sm">Accept</button>
                <button className="btn btn-outline btn-sm">Counter</button>
                <button className="btn btn-outline btn-sm text-red-600">Reject</button>
              </div>
            </div>
          )}

          {offer.competingOffers && offer.competingOffers> 0 && (
            <div className="bg-red-50 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-700">
                  {offer.competingOffers} competing offer{offer.competingOffers> 1 ? 's' : ''} on this property
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Submitted {offer.submittedDate ? format(offer.submittedDate, 'MMM d') : 'Draft'}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Updated {formatDistanceToNow(offer.lastUpdateDate)} ago
              </span>
            </div>
            <button
              onClick={() => setExpandedOffer(isExpanded ? null : offer.id)}
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
                    <h4 className="font-medium text-gray-900 mb-3">Offer Conditions</h4>
                    <ul className="space-y-2">
                      {offer.conditions.map((conditionindex: any) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-gray-400 mt-0.5" />
                          <span className="text-sm text-gray-700">{condition}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Financing</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Type</span>
                        <span className="text-sm font-medium">
                          {offer.financing.type === 'cash' ? 'Cash' : 'Mortgage'}
                        </span>
                      </div>
                      {offer.financing.type === 'mortgage' && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Approval Status</span>
                            <span className="text-sm font-medium">
                              {offer.financing.mortgageApproved ? 'Approved' : 'Pending'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Lender</span>
                            <span className="text-sm font-medium">{offer.financing.lender}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Amount</span>
                            <span className="text-sm font-medium">
                              €{offer.financing.approvalAmount?.toLocaleString()}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Your Agent</h4>
                    <div className="flex items-center gap-3">
                      {offer.agent.photo ? (
                        <img
                          src={offer.agent.photo}
                          alt={offer.agent.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{offer.agent.name}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {offer.agent.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {offer.solicitor && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Your Solicitor</h4>
                      <div className="space-y-1">
                        <p className="font-medium">{offer.solicitor.name}</p>
                        <p className="text-sm text-gray-600">{offer.solicitor.firm}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {offer.solicitor.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {offer.documents.length> 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Documents</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {offer.documents.map((doc: any) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium">{doc.name}</p>
                              <p className="text-xs text-gray-500">
                                Uploaded {format(doc.uploadedDate, 'MMM d')}
                              </p>
                            </div>
                          </div>
                          <button className="text-[#7C3AED] hover:text-[#6B21A8]">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {offer.timeline.length> 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Timeline</h4>
                    <div className="space-y-3">
                      {offer.timeline.map((eventindex: any) => (
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
                  {['submitted', 'under-review', 'countered'].includes(offer.status) && (
                    <>
                      <button className="btn btn-outline">Edit Offer</button>
                      <button 
                        onClick={() => {
                          if (confirm('Are you sure you want to withdraw this offer?')) {
                            withdrawOffer(offer.id);
                          }
                        }
                        className="btn btn-outline text-red-600 border-red-600 hover:bg-red-50"
                      >
                        Withdraw Offer
                      </button>
                    </>
                  )}
                  {offer.status === 'accepted' && !offer.deposit.paid && (
                    <button className="btn btn-primary">Pay Deposit</button>
                  )}
                  <button className="btn btn-outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Agent
                  </button>
                  <button className="btn btn-outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
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
              <h1 className="text-3xl font-bold text-gray-900">Your Offers</h1>
              <p className="text-gray-600 mt-1">Track and manage your property offers</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowOfferCalculator(true)}
                className="btn btn-outline flex items-center gap-2"
              >
                <Calculator className="w-5 h-5" />
                Offer Calculator
              </button>
              <button
                onClick={() => setShowNewOffer(true)}
                className="btn btn-primary flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                New Offer
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            {(['all', 'active', 'accepted', 'rejected'] as const).map((status: any) => (
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
                  {offers.filter(o => {
                    switch (status) {
                      case 'all':
                        return true;
                      case 'active':
                        return ['submitted', 'under-review', 'countered'].includes(o.status);
                      case 'accepted':
                        return o.status === 'accepted';
                      case 'rejected':
                        return o.status === 'rejected';
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
              <p className="mt-4 text-gray-600">Loading offers...</p>
            </div>
          ) : filteredOffers.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No offers found</h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all'
                  ? 'Make your first offer on a property you love.'
                  : `No ${filter} offers at the moment.`}
              </p>
              {filter !== 'all' ? (
                <button
                  onClick={() => setFilter('all')}
                  className="btn btn-outline"
                >
                  View All Offers
                </button>
              ) : (
                <button
                  onClick={() => router.push('/properties')}
                  className="btn btn-primary"
                >
                  Browse Properties
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOffers.map((offer: any) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          )}
        </div>

        {filteredOffers.length> 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Offer Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#7C3AED]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-[#7C3AED]" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Be Competitive</h4>
                  <p className="text-sm text-gray-600">
                    Research recent sales to make informed offers
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#7C3AED]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-[#7C3AED]" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Get Pre-Approved</h4>
                  <p className="text-sm text-gray-600">
                    Strengthen your offer with mortgage pre-approval
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#7C3AED]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-[#7C3AED]" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Act Quickly</h4>
                  <p className="text-sm text-gray-600">
                    In hot markets, speed can make the difference
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerOffersPage;