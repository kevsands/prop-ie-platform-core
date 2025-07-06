/**
 * Property Reservation System
 * Comprehensive property reservation and booking system with payment processing and legal coordination
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Home,
  Calendar,
  CreditCard,
  Shield,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Euro,
  User,
  Building2,
  Gavel,
  Key,
  Lock,
  Unlock,
  Timer,
  RefreshCw,
  Download,
  Eye,
  Phone,
  Mail,
  MessageSquare,
  Star,
  Award,
  Target,
  Zap,
  ArrowRight,
  AlertCircle,
  Info,
  Users,
  MapPin,
  Bed,
  Bath,
  Car,
  Ruler
} from 'lucide-react';

export interface PropertyReservation {
  id: string;
  propertyId: string;
  propertyDetails: {
    name: string;
    address: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    floorArea: number;
    images: string[];
    developer: string;
    developmentName: string;
    completionDate: string;
    ber: string;
  };
  buyerInfo: {
    primaryBuyer: BuyerDetails;
    secondaryBuyer?: BuyerDetails;
    solicitor?: SolicitorDetails;
    mortgageProvider?: string;
    firstTimeBuyer: boolean;
  };
  reservationDetails: {
    reservationFee: number;
    totalDeposit: number;
    contractDeposit: number;
    completionDate: Date;
    keyHandoverDate?: Date;
    specialConditions: string[];
    htbApplication?: boolean;
  };
  timeline: ReservationTimeline[];
  payments: PaymentRecord[];
  documents: ReservationDocument[];
  status: 'draft' | 'reserved' | 'contract_pending' | 'contracts_signed' | 'mortgage_approved' | 'completion_pending' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

export interface BuyerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  ppsNumber?: string;
  verified: boolean;
}

export interface SolicitorDetails {
  name: string;
  firm: string;
  email: string;
  phone: string;
  regNumber: string;
}

export interface ReservationTimeline {
  id: string;
  stage: string;
  title: string;
  description: string;
  dueDate: Date;
  completedDate?: Date;
  status: 'upcoming' | 'due' | 'completed' | 'overdue';
  assignedTo: string;
  requirements: string[];
}

export interface PaymentRecord {
  id: string;
  type: 'reservation_fee' | 'booking_deposit' | 'contract_deposit' | 'final_payment';
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  paymentMethod?: string;
  status: 'pending' | 'paid' | 'overdue' | 'failed';
  transactionRef?: string;
}

export interface ReservationDocument {
  id: string;
  name: string;
  type: string;
  uploadedBy: string;
  uploadedAt: Date;
  signed: boolean;
  required: boolean;
  url: string;
}

interface PropertyReservationSystemProps {
  propertyId: string;
  userProfile?: any;
  onReservationComplete?: (reservation: PropertyReservation) => void;
  onPaymentRequired?: (payment: PaymentRecord) => void;
  className?: string;
}

const MOCK_PROPERTY = {
  id: 'prop-001',
  name: 'Fitzgerald Gardens - Apartment 3B',
  address: 'Fitzgerald Gardens, Clondalkin, Dublin 22',
  price: 425000,
  bedrooms: 3,
  bathrooms: 2,
  floorArea: 98,
  images: ['/api/placeholder/400/300'],
  developer: 'Carrigway Properties',
  developmentName: 'Fitzgerald Gardens',
  completionDate: '2024-09-15',
  ber: 'A3'
};

export default function PropertyReservationSystem({
  propertyId,
  userProfile,
  onReservationComplete,
  onPaymentRequired,
  className = ''
}: PropertyReservationSystemProps) {
  const [reservation, setReservation] = useState<Partial<PropertyReservation>>({
    propertyId,
    propertyDetails: MOCK_PROPERTY,
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date()
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingPayment, setPendingPayment] = useState<PaymentRecord | null>(null);

  const reservationSteps = [
    { id: 'details', name: 'Reservation Details', icon: Home },
    { id: 'buyer', name: 'Buyer Information', icon: User },
    { id: 'payment', name: 'Payment Setup', icon: CreditCard },
    { id: 'legal', name: 'Legal Representatives', icon: Gavel },
    { id: 'review', name: 'Review & Confirm', icon: FileText },
    { id: 'confirmation', name: 'Reservation Active', icon: CheckCircle }
  ];

  useEffect(() => {
    if (userProfile) {
      setReservation(prev => ({
        ...prev,
        buyerInfo: {
          primaryBuyer: {
            fullName: `${userProfile.firstName} ${userProfile.lastName}`,
            email: userProfile.email,
            phone: userProfile.phone || '',
            address: '',
            verified: true
          },
          firstTimeBuyer: userProfile.currentStatus === 'first-time-buyer'
        }
      }));
    }
  }, [userProfile]);

  const calculateReservationFees = useCallback(() => {
    if (!reservation.propertyDetails) return { reservationFee: 0, totalDeposit: 0, contractDeposit: 0 };
    
    const propertyPrice = reservation.propertyDetails.price;
    const reservationFee = 5000; // Standard €5,000 reservation fee
    const contractDeposit = Math.round(propertyPrice * 0.1); // 10% contract deposit
    const totalDeposit = reservationFee + contractDeposit;
    
    return { reservationFee, totalDeposit, contractDeposit };
  }, [reservation.propertyDetails]);

  const createReservationTimeline = useCallback((): ReservationTimeline[] => {
    const now = new Date();
    const timeline: ReservationTimeline[] = [
      {
        id: 'reservation',
        stage: 'reservation',
        title: 'Property Reserved',
        description: 'Pay reservation fee and secure the property',
        dueDate: now,
        status: 'upcoming',
        assignedTo: 'Buyer',
        requirements: ['Reservation fee payment', 'Signed reservation agreement']
      },
      {
        id: 'mortgage',
        stage: 'mortgage',
        title: 'Mortgage Approval',
        description: 'Secure mortgage approval in principle',
        dueDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days
        status: 'upcoming',
        assignedTo: 'Buyer',
        requirements: ['Mortgage application submitted', 'Approval in principle received']
      },
      {
        id: 'solicitor',
        stage: 'legal',
        title: 'Solicitor Appointed',
        description: 'Appoint solicitor for conveyancing',
        dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
        status: 'upcoming',
        assignedTo: 'Buyer',
        requirements: ['Solicitor details provided', 'Letter of engagement signed']
      },
      {
        id: 'contracts',
        stage: 'contracts',
        title: 'Contracts Signed',
        description: 'Exchange contracts and pay deposit',
        dueDate: new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000), // 28 days
        status: 'upcoming',
        assignedTo: 'Solicitor',
        requirements: ['Contract deposit paid', 'Purchase contracts signed']
      },
      {
        id: 'completion',
        stage: 'completion',
        title: 'Property Completion',
        description: 'Final payment and key handover',
        dueDate: new Date(reservation.propertyDetails?.completionDate || now.getTime() + 180 * 24 * 60 * 60 * 1000),
        status: 'upcoming',
        assignedTo: 'Developer',
        requirements: ['Final balance paid', 'Property inspection completed', 'Keys handed over']
      }
    ];

    return timeline;
  }, [reservation.propertyDetails]);

  const submitReservation = async () => {
    setIsProcessing(true);

    const fees = calculateReservationFees();
    const timeline = createReservationTimeline();
    
    const completeReservation: PropertyReservation = {
      id: `RES-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...reservation as PropertyReservation,
      reservationDetails: {
        reservationFee: fees.reservationFee,
        totalDeposit: fees.totalDeposit,
        contractDeposit: fees.contractDeposit,
        completionDate: new Date(reservation.propertyDetails?.completionDate || Date.now() + 180 * 24 * 60 * 60 * 1000),
        specialConditions: [],
        htbApplication: reservation.buyerInfo?.firstTimeBuyer || false
      },
      timeline,
      payments: [
        {
          id: `PAY-${Date.now()}-1`,
          type: 'reservation_fee',
          amount: fees.reservationFee,
          dueDate: new Date(),
          status: 'pending'
        }
      ],
      documents: [],
      status: 'reserved',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days to complete
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setReservation(completeReservation);
    setCurrentStep(5);
    
    // Trigger payment for reservation fee
    const reservationPayment = completeReservation.payments[0];
    setPendingPayment(reservationPayment);
    setShowPaymentModal(true);
    
    onReservationComplete?.(completeReservation);
    setIsProcessing(false);
  };

  const processPayment = async (payment: PaymentRecord) => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Update payment status
    setReservation(prev => ({
      ...prev,
      payments: prev.payments?.map(p => 
        p.id === payment.id 
          ? { ...p, status: 'paid', paidDate: new Date(), paymentMethod: 'Credit Card', transactionRef: `TXN-${Date.now()}` }
          : p
      ) || []
    }));
    
    setShowPaymentModal(false);
    setPendingPayment(null);
    setIsProcessing(false);
    
    onPaymentRequired?.(payment);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'reserved': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'overdue': return 'text-red-600 bg-red-50 border-red-200';
      case 'pending': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const renderReservationDetailsStep = () => (
    <div className="space-y-6">
      {/* Property Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <img
            src={reservation.propertyDetails?.images[0]}
            alt="Property"
            className="w-24 h-24 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg">{reservation.propertyDetails?.name}</h3>
            <p className="text-gray-600 mb-2">{reservation.propertyDetails?.address}</p>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Bed size={14} />
                {reservation.propertyDetails?.bedrooms} bed
              </span>
              <span className="flex items-center gap-1">
                <Bath size={14} />
                {reservation.propertyDetails?.bathrooms} bath
              </span>
              <span className="flex items-center gap-1">
                <Ruler size={14} />
                {reservation.propertyDetails?.floorArea}sqm
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(reservation.propertyDetails?.price || 0)}
            </div>
            <div className="text-sm text-gray-600">Purchase Price</div>
          </div>
        </div>
      </div>

      {/* Reservation Fee Breakdown */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-4">Reservation Fee Breakdown</h4>
        {(() => {
          const fees = calculateReservationFees();
          return (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-blue-800">Reservation Fee:</span>
                <span className="font-semibold text-blue-900">{formatCurrency(fees.reservationFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-800">Contract Deposit (10%):</span>
                <span className="font-semibold text-blue-900">{formatCurrency(fees.contractDeposit)}</span>
              </div>
              <div className="border-t border-blue-300 pt-2 flex justify-between">
                <span className="text-blue-800 font-medium">Total Deposit Required:</span>
                <span className="font-bold text-blue-900 text-lg">{formatCurrency(fees.totalDeposit)}</span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Important Information */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="text-orange-600 mt-0.5" size={20} />
          <div>
            <h5 className="font-medium text-orange-900 mb-1">Important Reservation Terms</h5>
            <ul className="text-orange-800 text-sm space-y-1">
              <li>• Reservation fee is non-refundable once contracts are signed</li>
              <li>• You have 28 days to complete your mortgage application</li>
              <li>• Property is reserved for 7 days pending initial payments</li>
              <li>• All payments must be made via bank transfer or certified funds</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBuyerInfoStep = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={reservation.buyerInfo?.primaryBuyer?.fullName || ''}
            onChange={(e) => setReservation(prev => ({
              ...prev,
              buyerInfo: {
                ...prev.buyerInfo!,
                primaryBuyer: { ...prev.buyerInfo!.primaryBuyer!, fullName: e.target.value }
              }
            }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={reservation.buyerInfo?.primaryBuyer?.email || ''}
            onChange={(e) => setReservation(prev => ({
              ...prev,
              buyerInfo: {
                ...prev.buyerInfo!,
                primaryBuyer: { ...prev.buyerInfo!.primaryBuyer!, email: e.target.value }
              }
            }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={reservation.buyerInfo?.primaryBuyer?.phone || ''}
            onChange={(e) => setReservation(prev => ({
              ...prev,
              buyerInfo: {
                ...prev.buyerInfo!,
                primaryBuyer: { ...prev.buyerInfo!.primaryBuyer!, phone: e.target.value }
              }
            }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PPS Number
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={reservation.buyerInfo?.primaryBuyer?.ppsNumber || ''}
            onChange={(e) => setReservation(prev => ({
              ...prev,
              buyerInfo: {
                ...prev.buyerInfo!,
                primaryBuyer: { ...prev.buyerInfo!.primaryBuyer!, ppsNumber: e.target.value }
              }
            }))}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Address *
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            value={reservation.buyerInfo?.primaryBuyer?.address || ''}
            onChange={(e) => setReservation(prev => ({
              ...prev,
              buyerInfo: {
                ...prev.buyerInfo!,
                primaryBuyer: { ...prev.buyerInfo!.primaryBuyer!, address: e.target.value }
              }
            }))}
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={reservation.buyerInfo?.firstTimeBuyer || false}
              onChange={(e) => setReservation(prev => ({
                ...prev,
                buyerInfo: { ...prev.buyerInfo!, firstTimeBuyer: e.target.checked }
              }))}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">First-time buyer</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="text-white" size={40} />
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Property Reserved Successfully!</h3>
        <p className="text-gray-600">
          Your reservation for {reservation.propertyDetails?.name} has been confirmed.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h4 className="font-semibold text-green-900 mb-4">Reservation Details</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-green-700">Reservation ID:</span>
            <div className="font-semibold text-green-900">{reservation.id}</div>
          </div>
          <div>
            <span className="text-green-700">Status:</span>
            <div className="font-semibold text-green-900">Property Reserved</div>
          </div>
          <div>
            <span className="text-green-700">Reservation Fee:</span>
            <div className="font-semibold text-green-900">{formatCurrency(reservation.reservationDetails?.reservationFee || 0)}</div>
          </div>
          <div>
            <span className="text-green-700">Expires:</span>
            <div className="font-semibold text-green-900">{reservation.expiresAt?.toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 className="font-medium text-blue-900 mb-2">Next Steps</h5>
        <ul className="text-blue-800 text-sm space-y-1 text-left">
          <li>• Complete your mortgage application within 14 days</li>
          <li>• Appoint a solicitor for conveyancing</li>
          <li>• Prepare contract deposit (due within 28 days)</li>
          <li>• We'll contact you to schedule property inspection</li>
        </ul>
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={() => window.open(`/reservations/${reservation.id}`, '_blank')}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Eye size={16} />
          View Reservation
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          <Download size={16} />
          Print Confirmation
        </button>
      </div>
    </div>
  );

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${className}`}>
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
            <Home className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Property Reservation</h2>
            <p className="text-gray-600 text-sm">Secure your property with our reservation system</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          {reservationSteps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                index <= currentStep 
                  ? 'bg-green-600 border-green-600 text-white' 
                  : 'border-gray-300 text-gray-400'
              }`}>
                {index < currentStep ? (
                  <CheckCircle size={16} />
                ) : (
                  <step.icon size={16} />
                )}
              </div>
              <span className={`ml-2 text-sm font-medium hidden sm:block ${
                index <= currentStep ? 'text-green-600' : 'text-gray-400'
              }`}>
                {step.name}
              </span>
              {index < reservationSteps.length - 1 && (
                <div className={`w-8 h-0.5 mx-4 hidden sm:block ${
                  index < currentStep ? 'bg-green-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6">
        {currentStep === 0 && renderReservationDetailsStep()}
        {currentStep === 1 && renderBuyerInfoStep()}
        {currentStep === 2 && (
          <div className="text-center py-8">
            <CreditCard size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Setup</h3>
            <p className="text-gray-600">Payment processing will be handled after reservation confirmation</p>
          </div>
        )}
        {currentStep === 3 && (
          <div className="text-center py-8">
            <Gavel size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Legal Representatives</h3>
            <p className="text-gray-600">You'll be prompted to provide solicitor details after reservation</p>
          </div>
        )}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Review Your Reservation</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Property Details</h4>
                <p className="text-gray-600">{reservation.propertyDetails?.name}</p>
                <p className="text-gray-600">{reservation.propertyDetails?.address}</p>
                <p className="font-semibold text-gray-900">{formatCurrency(reservation.propertyDetails?.price || 0)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Buyer Information</h4>
                <p className="text-gray-600">{reservation.buyerInfo?.primaryBuyer?.fullName}</p>
                <p className="text-gray-600">{reservation.buyerInfo?.primaryBuyer?.email}</p>
                <p className="text-gray-600">{reservation.buyerInfo?.primaryBuyer?.phone}</p>
              </div>
            </div>
          </div>
        )}
        {currentStep === 5 && renderConfirmationStep()}
      </div>

      {/* Navigation */}
      {currentStep < 5 && (
        <div className="p-6 border-t">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRight size={16} className="rotate-180" />
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Next
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={submitReservation}
                disabled={isProcessing}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Reserve Property
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && pendingPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Required</h3>
              <p className="text-gray-600">
                Please pay the reservation fee to secure your property
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Reservation Fee:</span>
                <span className="font-semibold text-gray-900">{formatCurrency(pendingPayment.amount)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => processPayment(pendingPayment)}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}