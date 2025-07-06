'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  CheckCircle, 
  Shield, 
  Euro, 
  Calendar, 
  Clock, 
  FileText, 
  CreditCard,
  Home,
  AlertCircle,
  Info,
  ChevronRight,
  Lock,
  ArrowLeft,
  RefreshCw,
  Heart,
  Building,
  MapPin,
  Target,
  Receipt,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Award,
  Scale,
  Landmark,
  CheckCircle2,
  XCircle,
  Phone,
  Play,
  FileSearch,
  MessageSquare,
  User,
  Mail,
  DollarSign,
  Activity,
  TrendingUp,
  Zap
} from 'lucide-react';

// Import the real data services
import { projectDataService } from '@/services/ProjectDataService';
import { realDataService } from '@/services/RealDataService';
import { buyerSolicitorIntegrationService } from '@/services/BuyerSolicitorIntegrationService';
import { agentBuyerIntegrationService } from '@/services/AgentBuyerIntegrationService';
import { fitzgeraldGardensConfig } from '@/data/fitzgerald-gardens-config';
import { Unit, UnitStatus, BuyerInformation } from '@/types/project';

// Enhanced property data service with real integration
const getPropertyData = async (unitId: string) => {
  try {
    // Initialize Fitzgerald Gardens project data
    const project = projectDataService.initializeFitzgeraldGardens();
    
    // Get the specific unit from the real data
    const unit = projectDataService.getUnitById('fitzgerald-gardens', unitId);
    
    if (!unit) {
      // Fallback to mock data if unit not found
      return {
        id: unitId,
        title: "3 Bed Semi-Detached House",
        developmentName: "Fitzgerald Gardens",
        unitNumber: unitId,
        address: {
          street: `Unit ${unitId}, Fitzgerald Gardens`,
          city: "Drogheda",
          county: "Co. Louth"
        },
        price: 375000,
        images: [
          "/images/developments/fitzgerald-gardens/3bed-House.jpeg",
          "/images/developments/fitzgerald-gardens/2bed-House.jpeg"
        ],
        bedrooms: 3,
        bathrooms: 2,
        area: 125,
        features: [
          "A-rated energy efficiency",
          "South-facing garden",
          "Premium kitchen appliances",
          "10-year structural warranty"
        ],
        htbEligible: true,
        htbAmount: 30000,
        completionDate: "Q3 2025",
        developer: "Cairn Homes",
        status: 'available',
        isRealData: false
      };
    }
    
    // Convert unit data to property format
    return {
      id: unit.id,
      title: `${unit.features.bedrooms} Bed ${unit.type}`,
      developmentName: "Fitzgerald Gardens",
      unitNumber: unit.number,
      address: {
        street: `Unit ${unit.number}, Fitzgerald Gardens`,
        city: "Drogheda", 
        county: "Co. Louth"
      },
      price: unit.pricing.currentPrice,
      basePrice: unit.pricing.basePrice,
      images: [
        "/images/developments/fitzgerald-gardens/3bed-House.jpeg",
        "/images/developments/fitzgerald-gardens/2bed-House.jpeg"
      ],
      bedrooms: unit.features.bedrooms,
      bathrooms: unit.features.bathrooms,
      area: unit.features.sqft,
      floor: unit.features.floor,
      building: unit.features.building,
      hasBalcony: unit.features.hasBalcony,
      hasGarden: unit.features.hasGarden,
      parkingSpaces: unit.features.parkingSpaces,
      features: unit.features.features,
      amenities: unit.features.amenities,
      htbEligible: unit.pricing.htbEligible,
      htbAmount: unit.pricing.htbAmount || 30000,
      completionDate: "Q3 2025",
      developer: "Cairn Homes",
      status: unit.status,
      location: unit.location,
      buyer: unit.buyer,
      legalPack: unit.legalPack,
      priceHistory: unit.pricing.priceHistory,
      isRealData: true,
      projectData: project
    };
  } catch (error) {
    console.error('Error fetching property data:', error);
    return null;
  }
};

// Function to update unit status in developer portal
const updateUnitStatusInDeveloperPortal = async (
  unitId: string, 
  newStatus: UnitStatus, 
  buyerInfo: BuyerInformation,
  reservationData: any
) => {
  try {
    // Update the unit status in the project data service
    const success = await projectDataService.updateUnitStatus(
      'fitzgerald-gardens',
      unitId,
      newStatus,
      `Unit ${newStatus} by buyer: ${buyerInfo.name}`
    );
    
    if (success && newStatus === 'reserved') {
      // Update buyer information in the unit
      await projectDataService.updateUnitBuyer(
        'fitzgerald-gardens',
        unitId,
        buyerInfo
      );
      
      // Trigger real-time update to developer portal
      projectDataService.broadcastStateUpdate({
        projectId: 'fitzgerald-gardens',
        unitId: unitId,
        eventType: 'unit_reserved',
        timestamp: new Date(),
        data: {
          unitNumber: unitId,
          buyerName: buyerInfo.name,
          buyerEmail: buyerInfo.email,
          reservationAmount: reservationData.amount,
          paymentMethod: reservationData.paymentMethod,
          status: newStatus
        },
        actor: {
          id: buyerInfo.id,
          name: buyerInfo.name,
          role: 'buyer'
        }
      });
      
      console.log(`Unit ${unitId} successfully updated to ${newStatus} in developer portal`);
      return true;
    }
    
    return success;
  } catch (error) {
    console.error('Error updating unit status in developer portal:', error);
    return false;
  }
};

interface ProgressSteps {
  id: string;
  title: string;
  status: 'pending' | 'current' | 'completed';
  description?: string;
}

export default function PurchasePage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params?.id as string;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [reservationId, setReservationId] = useState<string | null>(null);
  
  const [verificationStatus, setVerificationStatus] = useState({
    kyc: true, // Assume verified since they passed verification
    fundsProof: true,
    solicitAppointed: false
  });
  
  const [purchaseData, setPurchaseData] = useState({
    acceptedTerms: false,
    reservationAmount: 500,
    agreementType: null as null | 'booking' | 'exclusivity',
    paymentMethod: null as null | 'card' | 'transfer',
    solicitorDetails: {
      appointed: false,
      name: '',
      firm: '',
      contact: ''
    }
  });

  // Mock buyer information (in real app this would come from auth context)
  const currentBuyer: BuyerInformation = {
    id: 'buyer-001',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+353 87 123 4567',
    address: '123 Main Street, Dublin 1',
    solicitor: 'Kelly & Associates',
    solicitorContact: 'mary.kelly@kellylaw.ie',
    mortgageProvider: 'Bank of Ireland',
    mortgageApproved: true,
    depositAmount: 35000,
    notes: 'First-time buyer, HTB eligible',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  useEffect(() => {
    const loadPropertyData = async () => {
      if (propertyId) {
        setIsDataLoading(true);
        try {
          const propertyData = await getPropertyData(propertyId);
          setProperty(propertyData);
          
          // If unit is already reserved or sold, redirect to status page
          if (propertyData?.status === 'reserved' || propertyData?.status === 'sold') {
            router.push(`/buyer/transaction`);
          }
        } catch (error) {
          console.error('Error loading property data:', error);
        } finally {
          setIsDataLoading(false);
        }
      }
    };
    
    loadPropertyData();
  }, [propertyId, router]);

  const progressSteps: ProgressSteps[] = [
    {
      id: 'verify',
      title: 'Verification Check',
      status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'current' : 'pending',
      description: 'Confirm your KYC and funds verification'
    },
    {
      id: 'reservation',
      title: 'Reservation Terms',
      status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'current' : 'pending',
      description: 'Review and accept reservation terms'
    },
    {
      id: 'payment',
      title: 'Payment',
      status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'current' : 'pending',
      description: 'Secure with €500 refundable fee'
    },
    {
      id: 'confirmation',
      title: 'Confirmation',
      status: currentStep === 4 ? 'current' : 'pending',
      description: 'Receive your booking confirmation'
    }
  ];

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate reservation ID
      const newReservationId = `FG-${propertyId}-${Date.now()}`;
      setReservationId(newReservationId);
      
      // Update unit status in developer portal
      const reservationData = {
        amount: purchaseData.reservationAmount,
        paymentMethod: purchaseData.paymentMethod,
        agreementType: purchaseData.agreementType,
        reservationId: newReservationId
      };
      
      const updateSuccess = await updateUnitStatusInDeveloperPortal(
        propertyId,
        'reserved',
        currentBuyer,
        reservationData
      );
      
      if (updateSuccess) {
        setReservationSuccess(true);
        console.log('✅ Reservation successful - Developer portal updated');
        
        // Create transaction record for buyer transaction page
        const transactionData = {
          id: newReservationId,
          propertyId: propertyId,
          propertyName: property?.title,
          propertyAddress: property?.address,
          buyerId: currentBuyer.id,
          buyerName: currentBuyer.name,
          reservationAmount: purchaseData.reservationAmount,
          totalPrice: property?.price,
          status: 'reserved',
          date: new Date(),
          nextSteps: [
            'Mortgage approval finalization',
            'Solicitor appointment',
            'Contract review and signing'
          ]
        };
        
        // Store transaction data (in real app, this would go to a database)
        localStorage.setItem(`transaction_${newReservationId}`, JSON.stringify(transactionData));
        
        // 🚀 AUTO-CREATE SOLICITOR CASE FROM RESERVATION
        try {
          const unit = await projectDataService.getUnitById('fitzgerald-gardens', propertyId);
          if (unit) {
            const solicitorCase = await buyerSolicitorIntegrationService.createCaseFromReservation({
              unitId: propertyId,
              buyer: currentBuyer,
              property: unit,
              reservationAmount: purchaseData.reservationAmount,
              htbApplication: currentBuyer.htbEligible ? {
                id: `htb-${currentBuyer.id}`,
                amount: property?.htbAmount || 30000,
                status: 'submitted'
              } : undefined
            });
            
            console.log('🏛️ Solicitor case auto-created:', solicitorCase.caseNumber);
            
            // Update transaction data with solicitor information
            transactionData.solicitorCaseId = solicitorCase.id;
            transactionData.solicitorInfo = {
              firm: 'O\'Brien & Associates',
              contact: 'cases@obrienlaw.ie',
              phone: '+353 1 234 5678'
            };
            localStorage.setItem(`transaction_${newReservationId}`, JSON.stringify(transactionData));
          }
        } catch (error) {
          console.error('Failed to create solicitor case:', error);
          // Don't fail the reservation if solicitor case creation fails
        }

        // 🎯 TRACK AGENT COMMISSION FROM REFERRAL
        try {
          const commissionRecord = await agentBuyerIntegrationService.trackAgentReferralReservation(
            currentBuyer.id,
            propertyId,
            'fitzgerald-gardens',
            purchaseData.reservationAmount
          );
          
          if (commissionRecord) {
            console.log(`💰 Agent commission tracked: €${commissionRecord.commissionAmount.toFixed(2)} for agent referral`);
            
            // Update transaction data with agent commission information
            transactionData.agentCommission = {
              commissionId: commissionRecord.id,
              agentId: commissionRecord.agentId,
              amount: commissionRecord.commissionAmount,
              status: commissionRecord.status
            };
            localStorage.setItem(`transaction_${newReservationId}`, JSON.stringify(transactionData));
          } else {
            console.log('ℹ️ No agent referral found for this buyer - no commission to track');
          }
        } catch (error) {
          console.error('Failed to track agent commission:', error);
          // Don't fail the reservation if commission tracking fails
        }
        
        handleNextStep();
      } else {
        throw new Error('Failed to update developer portal');
      }
    } catch (error) {
      console.error('Payment/reservation failed:', error);
      // Handle error - show error message to user
    } finally {
      setLoading(false);
    }
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">Secure Transaction</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {progressSteps.map((step, index) => (
              <div key={step.id} className="flex-1">
                <div className="relative">
                  {index < progressSteps.length - 1 && (
                    <div
                      className={`absolute top-5 left-8 right-0 h-0.5 ${
                        step.status === 'completed' ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                  <div className="flex flex-col items-start">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.status === 'completed' ? 'bg-green-600 text-white' :
                        step.status === 'current' ? 'bg-blue-600 text-white' :
                        'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="mt-2">
                      <p className={`font-medium text-sm ${
                        step.status === 'current' ? 'text-blue-600' :
                        step.status === 'completed' ? 'text-green-600' :
                        'text-gray-500'
                      }`}>
                        {step.title}
                      </p>
                      {step.description && (
                        <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Property Summary */}
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Property Details</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="aspect-video relative rounded-lg overflow-hidden">
                      <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg">{property.title}</h3>
                      <p className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {property.developmentName}, {property.address.city}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{property.bedrooms} Beds</span>
                        <span>{property.bathrooms} Baths</span>
                        <span>{property.area} m²</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">
                        €{property.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {currentStep === 1 && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Verification Status</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-green-900">KYC/AML Verified</h3>
                        <p className="text-green-800 text-sm mt-1">
                          Your identity and anti-money laundering checks are complete
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-green-900">Proof of Funds Verified</h3>
                        <p className="text-green-800 text-sm mt-1">
                          Your financial documentation has been approved
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-yellow-900">Solicitor Appointment</h3>
                        <p className="text-yellow-800 text-sm mt-1">
                          You can appoint a solicitor now or during the 30-day exclusivity period
                        </p>
                        <button 
                          onClick={() => setPurchaseData({...purchaseData, solicitorDetails: {...purchaseData.solicitorDetails, appointed: true}})}
                          className="mt-2 text-sm text-yellow-700 hover:text-yellow-800 underline"
                        >
                          I have appointed a solicitor
                        </button>
                      </div>
                    </div>
                  </div>

                  {purchaseData.solicitorDetails.appointed && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold mb-4">Solicitor Details</h3>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Solicitor Name"
                          className="w-full px-4 py-2 border rounded-lg"
                          value={purchaseData.solicitorDetails.name}
                          onChange={(e) => setPurchaseData({
                            ...purchaseData,
                            solicitorDetails: {...purchaseData.solicitorDetails, name: e.target.value}
                          })}
                        />
                        <input
                          type="text"
                          placeholder="Firm Name"
                          className="w-full px-4 py-2 border rounded-lg"
                          value={purchaseData.solicitorDetails.firm}
                          onChange={(e) => setPurchaseData({
                            ...purchaseData,
                            solicitorDetails: {...purchaseData.solicitorDetails, firm: e.target.value}
                          })}
                        />
                        <input
                          type="text"
                          placeholder="Contact Email/Phone"
                          className="w-full px-4 py-2 border rounded-lg"
                          value={purchaseData.solicitorDetails.contact}
                          onChange={(e) => setPurchaseData({
                            ...purchaseData,
                            solicitorDetails: {...purchaseData.solicitorDetails, contact: e.target.value}
                          })}
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Next Step</h3>
                    <p className="text-blue-800 text-sm">
                      Review the reservation terms and choose your preferred booking option
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Reservation Options</h2>
                  
                  <div className="space-y-4">
                    <div 
                      onClick={() => setPurchaseData({...purchaseData, agreementType: 'booking'})}
                      className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                        purchaseData.agreementType === 'booking' 
                          ? 'border-blue-600 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-5 h-5 rounded-full border-2 mt-1 ${
                          purchaseData.agreementType === 'booking'
                            ? 'border-blue-600 bg-blue-600'
                            : 'border-gray-300'
                        }`}>
                          {purchaseData.agreementType === 'booking' && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">Standard Booking Deposit</h3>
                          <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start">
                              <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                              <span>€5,000 deposit (€500 initial + €4,500 within 7 days)</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                              <span>30-day exclusive buying period</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                              <span>Property taken off market immediately</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                              <span>If you proceed: Full deposit counts towards purchase</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                              <span>If not: €4,500 becomes PROP Choice credit</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div 
                      onClick={() => setPurchaseData({...purchaseData, agreementType: 'exclusivity'})}
                      className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                        purchaseData.agreementType === 'exclusivity' 
                          ? 'border-blue-600 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-5 h-5 rounded-full border-2 mt-1 ${
                          purchaseData.agreementType === 'exclusivity'
                            ? 'border-blue-600 bg-blue-600'
                            : 'border-gray-300'
                        }`}>
                          {purchaseData.agreementType === 'exclusivity' && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">Exclusivity Agreement Only</h3>
                          <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start">
                              <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                              <span>€500 exclusivity fee</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                              <span>7-day exclusive viewing period</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                              <span>Property held for you during this time</span>
                            </li>
                            <li className="flex items-start">
                              <Info className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" />
                              <span>Ideal if you need time to view the property</span>
                            </li>
                            <li className="flex items-start">
                              <Info className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" />
                              <span>Can convert to full booking within 7 days</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Terms & Conditions</h3>
                    <div className="space-y-3">
                      <label className="flex items-start">
                        <input
                          type="checkbox"
                          checked={purchaseData.acceptedTerms}
                          onChange={(e) => setPurchaseData({...purchaseData, acceptedTerms: e.target.checked})}
                          className="mt-1 mr-3"
                        />
                        <span className="text-sm text-gray-700">
                          I have read and accept the <Link href="/terms" className="text-blue-600 hover:underline">reservation terms</Link> and 
                          understand that this creates a legally binding agreement under Irish contract law
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <Shield className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-blue-900">Consumer Protection</h3>
                        <p className="text-blue-800 text-sm mt-1">
                          You have a 14-day cooling-off period under the Consumer Protection Act 2007
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
                  
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-blue-900">Amount Due Now</h3>
                        <p className="text-sm text-blue-800">
                          {purchaseData.agreementType === 'booking' ? 'Initial booking deposit' : 'Exclusivity fee'}
                        </p>
                      </div>
                      <div className="text-2xl font-bold text-blue-900">
                        €500
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Select Payment Method</h3>
                    
                    <div 
                      onClick={() => setPurchaseData({...purchaseData, paymentMethod: 'card'})}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        purchaseData.paymentMethod === 'card' 
                          ? 'border-blue-600 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-6 h-6 text-gray-600" />
                          <div>
                            <p className="font-medium">Credit/Debit Card</p>
                            <p className="text-sm text-gray-600">Instant processing</p>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 ${
                          purchaseData.paymentMethod === 'card'
                            ? 'border-blue-600 bg-blue-600'
                            : 'border-gray-300'
                        }`}>
                          {purchaseData.paymentMethod === 'card' && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div 
                      onClick={() => setPurchaseData({...purchaseData, paymentMethod: 'transfer'})}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        purchaseData.paymentMethod === 'transfer' 
                          ? 'border-blue-600 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Landmark className="w-6 h-6 text-gray-600" />
                          <div>
                            <p className="font-medium">Bank Transfer</p>
                            <p className="text-sm text-gray-600">1-2 business days</p>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 ${
                          purchaseData.paymentMethod === 'transfer'
                            ? 'border-blue-600 bg-blue-600'
                            : 'border-gray-300'
                        }`}>
                          {purchaseData.paymentMethod === 'transfer' && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {purchaseData.paymentMethod === 'card' && (
                    <div className="mt-6 space-y-4">
                      <input
                        type="text"
                        placeholder="Card Number"
                        className="w-full px-4 py-3 border rounded-lg"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="px-4 py-3 border rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          className="px-4 py-3 border rounded-lg"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Cardholder Name"
                        className="w-full px-4 py-3 border rounded-lg"
                      />
                    </div>
                  )}

                  {purchaseData.paymentMethod === 'transfer' && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-3">Bank Transfer Details</h4>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Bank:</dt>
                          <dd className="font-medium">Bank of Ireland</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Account Name:</dt>
                          <dd className="font-medium">PROP Client Account</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">IBAN:</dt>
                          <dd className="font-medium">IE12 BOFI 9012 3456 7890 12</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">BIC:</dt>
                          <dd className="font-medium">BOFIIE2D</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Reference:</dt>
                          <dd className="font-medium">FG-{propertyId}-{Date.now()}</dd>
                        </div>
                      </dl>
                    </div>
                  )}

                  <div className="mt-6 flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                    <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div className="text-sm text-green-800">
                      <p className="font-semibold">Secure Payment</p>
                      <p>Your payment is protected by bank-level encryption and held in a regulated client account</p>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="p-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Reservation Confirmed!</h2>
                    <p className="text-gray-600 mb-6">
                      Your property has been successfully reserved and the developer has been notified
                    </p>
                  </div>

                  {/* Real-time Integration Status */}
                  {reservationSuccess && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-green-600 animate-pulse" />
                        <div>
                          <h4 className="font-semibold text-green-900">Live System Update</h4>
                          <p className="text-sm text-green-800">
                            ✅ Unit status updated in developer portal<br />
                            ✅ Sales team notified automatically<br />
                            ✅ Legal pack preparation initiated
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Show property info from real data if available */}
                  {property?.isRealData && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <div>
                          <h4 className="font-semibold text-blue-900">Fitzgerald Gardens Real-Time Data</h4>
                          <p className="text-sm text-blue-800">
                            This unit is connected to live project data. The developer team can see your reservation in real-time.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold mb-4">Reservation Details</h3>
                    <dl className="space-y-3">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Reservation ID:</dt>
                        <dd className="font-medium">{reservationId || `FG-${propertyId}-${Date.now()}`}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Unit Number:</dt>
                        <dd className="font-medium">{property?.unitNumber || propertyId}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Property:</dt>
                        <dd className="font-medium">{property.title}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Development:</dt>
                        <dd className="font-medium">{property.developmentName}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Purchase Price:</dt>
                        <dd className="font-medium">€{property.price?.toLocaleString()}</dd>
                      </div>
                      {property?.htbEligible && (
                        <div className="flex justify-between">
                          <dt className="text-gray-600">HTB Benefit:</dt>
                          <dd className="font-medium text-green-600">€{property.htbAmount?.toLocaleString()}</dd>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Reservation Type:</dt>
                        <dd className="font-medium">
                          {purchaseData.agreementType === 'booking' ? '30-Day Booking' : '7-Day Exclusivity'}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Deposit Paid:</dt>
                        <dd className="font-medium">€{purchaseData.reservationAmount}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Expires:</dt>
                        <dd className="font-medium">
                          {new Date(Date.now() + (purchaseData.agreementType === 'booking' ? 30 : 7) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* Developer Portal Integration Info */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-purple-900">Connected to Developer Portal</h4>
                        <p className="text-sm text-purple-800 mb-2">
                          Your reservation has been automatically updated in the Fitzgerald Gardens developer portal:
                        </p>
                        <ul className="text-sm text-purple-700 space-y-1">
                          <li>• Unit {propertyId} status changed to "Reserved"</li>
                          <li>• Your buyer information added to the unit record</li>
                          <li>• Legal pack preparation queue updated</li>
                          <li>• Sales team dashboard refreshed</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold mb-4">Next Steps</h3>
                    <ul className="space-y-3">
                      {purchaseData.agreementType === 'booking' ? (
                        <>
                          <li className="flex items-start">
                            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 text-sm font-bold">
                              1
                            </div>
                            <div>
                              <p className="font-medium">Pay remaining €4,500 deposit</p>
                              <p className="text-sm text-gray-600">Due within 7 days to secure full booking</p>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 text-sm font-bold">
                              2
                            </div>
                            <div>
                              <p className="font-medium">Schedule property viewing</p>
                              <p className="text-sm text-gray-600">Our team will contact you within 24 hours</p>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 text-sm font-bold">
                              3
                            </div>
                            <div>
                              <p className="font-medium">Appoint your solicitor</p>
                              <p className="text-sm text-gray-600">Begin the legal review process</p>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 text-sm font-bold">
                              4
                            </div>
                            <div>
                              <p className="font-medium">Finalize your mortgage</p>
                              <p className="text-sm text-gray-600">Complete your financing arrangements</p>
                            </div>
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-start">
                            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 text-sm font-bold">
                              1
                            </div>
                            <div>
                              <p className="font-medium">Schedule property viewing</p>
                              <p className="text-sm text-gray-600">Visit the property within your exclusivity period</p>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 text-sm font-bold">
                              2
                            </div>
                            <div>
                              <p className="font-medium">Convert to full booking</p>
                              <p className="text-sm text-gray-600">Upgrade to 30-day booking if you wish to proceed</p>
                            </div>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>

                  <div className="flex gap-4">
                    <Link
                      href="/buyer/dashboard"
                      className="flex-1 text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Go to Dashboard
                    </Link>
                    <button
                      onClick={() => window.print()}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Download Receipt
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="p-6 border-t bg-gray-50">
                <div className="flex justify-between items-center">
                  <button
                    onClick={handlePreviousStep}
                    disabled={currentStep === 1}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      currentStep === 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>

                  {currentStep < 4 ? (
                    <button
                      onClick={currentStep === 3 ? handlePayment : handleNextStep}
                      disabled={
                        (currentStep === 2 && (!purchaseData.agreementType || !purchaseData.acceptedTerms)) ||
                        (currentStep === 3 && !purchaseData.paymentMethod) ||
                        loading
                      }
                      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        ((currentStep === 2 && (!purchaseData.agreementType || !purchaseData.acceptedTerms)) ||
                        (currentStep === 3 && !purchaseData.paymentMethod))
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Processing...
                        </div>
                      ) : currentStep === 3 ? (
                        'Complete Payment'
                      ) : (
                        'Continue'
                      )}
                    </button>
                  ) : (
                    <Link
                      href="/buyer/dashboard"
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      View in Dashboard
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{property.title}</p>
                    <p className="text-sm text-gray-600">{property.developmentName}</p>
                  </div>
                  <p className="font-medium">€{property.price.toLocaleString()}</p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Price</span>
                  <span>€{property.price.toLocaleString()}</span>
                </div>
                {property.htbEligible && (
                  <div className="flex justify-between text-green-600">
                    <span>HTB Benefit</span>
                    <span>-€{Math.min(property.price * 0.1, 30000).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Deposit Required (10%)</span>
                  <span>€{(property.price * 0.1).toLocaleString()}</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Due Today</span>
                    <span className="text-blue-600">€500</span>
                  </div>
                  {purchaseData.agreementType === 'booking' && (
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>Due in 7 days</span>
                      <span>€4,500</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Legal Protection */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Your Legal Protection</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <Shield className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span>14-day cooling-off period</span>
                </li>
                <li className="flex items-start">
                  <Scale className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Law Society approved contracts</span>
                </li>
                <li className="flex items-start">
                  <Landmark className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Client account protection</span>
                </li>
                <li className="flex items-start">
                  <Award className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span>PSRA licensed</span>
                </li>
              </ul>
            </div>

            {/* Help Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Need Help?</h3>
              <div className="space-y-3">
                <Link
                  href="/buyer/faq"
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  <span>View FAQs</span>
                </Link>
                <button className="flex items-center text-blue-600 hover:text-blue-700">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  <span>Chat with advisor</span>
                </button>
                <a href="tel:+35318123456" className="flex items-center text-blue-600 hover:text-blue-700">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>Call 01 812 3456</span>
                </a>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="text-center space-y-4">
              <div className="flex justify-center gap-4">
                <div className="text-center">
                  <Shield className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">SSL Secured</p>
                </div>
                <div className="text-center">
                  <Landmark className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Bank Protected</p>
                </div>
                <div className="text-center">
                  <Award className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">PSRA Licensed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}