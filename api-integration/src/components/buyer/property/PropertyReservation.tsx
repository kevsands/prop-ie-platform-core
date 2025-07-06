'use client';

import React, { useState, useEffect } from 'react';
import { 
  CalendarClock, 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Info,
  Clock,
  Home,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  User,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  Check
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/useToast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addDays, addMonths } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AffordabilityResult } from '@/components/buyer/planning/AffordabilityCalculator';

interface Property {
  id: string;
  name: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  status: 'available' | 'reserved' | 'sold';
  isNew: boolean;
  mainImage: string;
  additionalImages: string[];
  description: string;
  features: string[];
  developmentId?: string;
  developmentName?: string;
  readyDate?: string;
  energyRating?: string;
}

interface PropertyReservationProps {
  property: Property;
  initialAffordability?: AffordabilityResult;
  onReservationComplete?: (reservationId: string) => void;
  journeyId?: string;
}

interface ReservationDetails {
  fullName: string;
  email: string;
  phone: string;
  depositAmount: number;
  depositMethod: 'bank-transfer' | 'credit-card' | 'debit-card';
  appointmentDate?: Date;
  termsAccepted: boolean;
  mortgageApprovalInPrinciple: boolean;
  helpToBuyAmount?: number;
}

export default function PropertyReservation({ 
  property,
  initialAffordability,
  onReservationComplete,
  journeyId
}: PropertyReservationProps) {
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [reservationId, setReservationId] = useState('');
  const [showDepositInfo, setShowDepositInfo] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [reservationDetails, setReservationDetails] = useState<ReservationDetails>({
    fullName: '',
    email: '',
    phone: '',
    depositAmount: property.price * 0.05, // Default 5% deposit for reservation
    depositMethod: 'bank-transfer',
    termsAccepted: false,
    mortgageApprovalInPrinciple: false,
    helpToBuyAmount: initialAffordability?.htbAmount || 0
  });
  
  // Minimum deposit amount
  const minimumDeposit = property.price * 0.03;
  
  // Reservation expiry (default 14 days)
  const reservationExpiry = addDays(new Date(), 14);
  
  // Estimated completion date
  const estimatedCompletion = property.readyDate 
    ? new Date(property.readyDate) 
    : addMonths(new Date(), 6);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setReservationDetails(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              name === 'depositAmount' ? parseFloat(value) : value
    }));
  };
  
  // Handle deposit method selection
  const handleDepositMethodChange = (method: ReservationDetails['depositMethod']) => {
    setReservationDetails(prev => ({
      ...prev,
      depositMethod: method
    }));
  };
  
  // Handle appointment date selection
  const handleDateSelect = (date: string) => {
    setReservationDetails(prev => ({
      ...prev,
      appointmentDate: new Date(date)
    }));
  };
  
  // Check if form is valid for current step
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1: // Personal details
        return (
          reservationDetails.fullName.trim() !== '' &&
          reservationDetails.email.includes('@') &&
          reservationDetails.phone.trim() !== ''
        );
      case 2: // Financial details
        return (
          reservationDetails.depositAmount >= minimumDeposit &&
          reservationDetails.depositMethod !== undefined
        );
      case 3: // Terms and appointment
        return (
          reservationDetails.termsAccepted &&
          (reservationDetails.appointmentDate !== undefined || reservationDetails.mortgageApprovalInPrinciple)
        );
      default:
        return false;
    }
  };
  
  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Move to next step
  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Submit reservation
      handleSubmitReservation();
    }
  };
  
  // Move to previous step
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  // Submit the reservation
  const handleSubmitReservation = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock reservation ID
      const mockReservationId = `RES-${Date.now().toString().slice(-6)}`;
      setReservationId(mockReservationId);
      
      // Set to completed step
      setCurrentStep(4);
      
      toast({
        title: "Reservation Successful",
        description: `Your property has been reserved. Reservation ID: ${mockReservationId}`,
        variant: "default",
      });
      
      // Trigger callback if provided
      if (onReservationComplete) {
        onReservationComplete(mockReservationId);
      }
    } catch (error) {
      toast({
        title: "Reservation Failed",
        description: "There was an error processing your reservation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Available appointment dates (next 14 days, excluding weekends)
  const getAvailableAppointmentDates = () => {
    const dates: Date[] = [];
    let currentDate = new Date();
    
    while (dates.length < 5) {
      currentDate = addDays(currentDate, 1);
      const dayOfWeek = currentDate.getDay();
      
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        dates.push(new Date(currentDate));
      }
    }
    
    return dates;
  };
  
  // Available appointment times
  const appointmentTimes = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'];

  return (
    <Card className="shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Home className="h-6 w-6 mr-2" />
            <h2 className="text-xl font-semibold">Property Reservation</h2>
          </div>
          
          <Popover open={showTimeline} onOpenChange={setShowTimeline}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="text-white hover:bg-blue-500">
                <CalendarClock className="h-5 w-5 mr-1" />
                <span className="hidden md:inline">Reservation Timeline</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h3 className="font-medium">Reservation Process Timeline</h3>
                <div className="relative pl-6 border-l-2 border-gray-200 space-y-4">
                  <div className="relative">
                    <div className="absolute -left-[17px] h-4 w-4 rounded-full bg-blue-600"></div>
                    <p className="text-sm font-medium">1. Reserve Property</p>
                    <p className="text-xs text-gray-500">Pay the reservation deposit to secure the property</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[17px] h-4 w-4 rounded-full bg-gray-300"></div>
                    <p className="text-sm font-medium">2. Legal Process</p>
                    <p className="text-xs text-gray-500">Solicitors handle contracts and legal checks</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[17px] h-4 w-4 rounded-full bg-gray-300"></div>
                    <p className="text-sm font-medium">3. Final Approval</p>
                    <p className="text-xs text-gray-500">Final mortgage approval from your lender</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[17px] h-4 w-4 rounded-full bg-gray-300"></div>
                    <p className="text-sm font-medium">4. Closing</p>
                    <p className="text-xs text-gray-500">Sign final contracts and pay remaining deposit</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[17px] h-4 w-4 rounded-full bg-gray-300"></div>
                    <p className="text-sm font-medium">5. Move In</p>
                    <p className="text-xs text-gray-500">Receive keys and move into your new home</p>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <p className="text-blue-100">
          Secure your dream home with a simple reservation process
        </p>
      </div>
      
      {/* Property Summary */}
      <div className="bg-gray-50 p-4 border-b">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/4">
            <img 
              src={property.mainImage} 
              alt={property.name}
              className="rounded-lg w-full h-32 object-cover"
            />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{property.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{property.location}</p>
            
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
              <div>
                {property.bedrooms} Bedroom{property.bedrooms !== 1 ? 's' : ''}
              </div>
              <div>
                {property.bathrooms} Bathroom{property.bathrooms !== 1 ? 's' : ''}
              </div>
              <div>
                {property.area} m²
              </div>
              <div>
                {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/4 md:text-right">
            <div className="text-2xl font-bold mb-1">
              {formatCurrency(property.price)}
            </div>
            
            {property.readyDate && (
              <div className="text-sm text-gray-600">
                Ready by {format(new Date(property.readyDate), 'MMM yyyy')}
              </div>
            )}
            
            <div className="mt-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                Available for Reservation
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Steps Indicator */}
      {currentStep < 4 && (
        <div className="pt-6 px-6">
          <div className="flex items-center justify-between mb-6">
            <div className="w-full">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 1 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <User size={18} />
                </div>
                <div className={`flex-1 h-1 mx-2 ${
                  currentStep > 1 ? 'bg-blue-200' : 'bg-gray-200'
                }`}></div>
                
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 2 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <CreditCard size={18} />
                </div>
                <div className={`flex-1 h-1 mx-2 ${
                  currentStep > 2 ? 'bg-blue-200' : 'bg-gray-200'
                }`}></div>
                
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 3 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <FileText size={18} />
                </div>
              </div>
              
              <div className="flex text-xs justify-between mt-1">
                <span className={currentStep === 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
                  Your Details
                </span>
                <span className={currentStep === 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
                  Deposit
                </span>
                <span className={currentStep === 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
                  Confirmation
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-6">
        {/* Step 1: Personal Details */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Your Details</h3>
            <p className="text-gray-600 text-sm mb-4">
              Please provide your contact information to proceed with the reservation.
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={reservationDetails.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={reservationDetails.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  name="phone"
                  value={reservationDetails.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg text-sm">
                <div className="flex items-start">
                  <Info size={16} className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-blue-700">
                    Your contact details will be used to send reservation confirmation and to arrange 
                    a meeting with our sales team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 2: Financial Details */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Reservation Deposit</h3>
            <p className="text-gray-600 text-sm mb-2">
              A deposit is required to secure your reservation.
            </p>
            
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Property Price:</p>
              <p className="font-medium">{formatCurrency(property.price)}</p>
            </div>
            
            <div className="relative">
              <label htmlFor="depositAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Reservation Deposit Amount
              </label>
              <div className="flex items-center">
                <Input
                  id="depositAmount"
                  name="depositAmount"
                  type="number"
                  value={reservationDetails.depositAmount}
                  onChange={handleInputChange}
                  min={minimumDeposit}
                  max={property.price * 0.1}
                  required
                />
                <Popover open={showDepositInfo} onOpenChange={setShowDepositInfo}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="ml-2 p-2 h-auto">
                      <Info size={18} className="text-gray-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2 text-sm">
                      <h4 className="font-medium">About the Reservation Deposit</h4>
                      <p className="text-gray-600">
                        The reservation deposit secures the property for you for 14 days, during which you'll 
                        need to proceed with the mortgage process and legal steps.
                      </p>
                      <div className="mt-1">
                        <div className="flex justify-between">
                          <span>Minimum deposit:</span>
                          <span className="font-medium">{formatCurrency(minimumDeposit)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Recommended deposit:</span>
                          <span className="font-medium">{formatCurrency(property.price * 0.05)}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mt-1">
                        This deposit will be deducted from your final payment when the sale completes.
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Minimum: {formatCurrency(minimumDeposit)} (3% of property price)
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleDepositMethodChange('bank-transfer')}
                  className={`flex items-center p-3 border rounded-lg ${
                    reservationDetails.depositMethod === 'bank-transfer'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center mr-2 ${
                    reservationDetails.depositMethod === 'bank-transfer'
                      ? 'border-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {reservationDetails.depositMethod === 'bank-transfer' && (
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    )}
                  </div>
                  <span className="text-sm">Bank Transfer</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleDepositMethodChange('credit-card')}
                  className={`flex items-center p-3 border rounded-lg ${
                    reservationDetails.depositMethod === 'credit-card'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center mr-2 ${
                    reservationDetails.depositMethod === 'credit-card'
                      ? 'border-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {reservationDetails.depositMethod === 'credit-card' && (
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    )}
                  </div>
                  <span className="text-sm">Credit Card</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleDepositMethodChange('debit-card')}
                  className={`flex items-center p-3 border rounded-lg ${
                    reservationDetails.depositMethod === 'debit-card'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center mr-2 ${
                    reservationDetails.depositMethod === 'debit-card'
                      ? 'border-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {reservationDetails.depositMethod === 'debit-card' && (
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    )}
                  </div>
                  <span className="text-sm">Debit Card</span>
                </button>
              </div>
            </div>
            
            {initialAffordability && (
              <div className="p-4 bg-green-50 rounded-lg mt-4">
                <h4 className="font-medium text-green-800 flex items-center">
                  <CheckCircle size={16} className="mr-2" />
                  Affordability Pre-Check Completed
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Property Price:</span>
                    <span className="font-medium">{formatCurrency(initialAffordability.maxPropertyPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loan Amount:</span>
                    <span className="font-medium">{formatCurrency(initialAffordability.maxLoanAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deposit Available:</span>
                    <span className="font-medium">{formatCurrency(initialAffordability.depositAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Help to Buy:</span>
                    <span className="font-medium">{formatCurrency(initialAffordability.htbAmount)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Step 3: Confirmation and Terms */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <h3 className="text-lg font-medium">Reservation Confirmation</h3>
            <p className="text-gray-600 text-sm">
              Please review your reservation details and confirm your appointment.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Reservation Summary</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="text-gray-600">Property:</span>
                  <span className="font-medium">{property.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">{formatCurrency(property.price)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="text-gray-600">Reservation Deposit:</span>
                  <span className="font-medium">{formatCurrency(reservationDetails.depositAmount)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">
                    {reservationDetails.depositMethod === 'bank-transfer' ? 'Bank Transfer' : 
                     reservationDetails.depositMethod === 'credit-card' ? 'Credit Card' : 'Debit Card'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="text-gray-600">Reservation Expires:</span>
                  <span className="font-medium">{format(reservationExpiry, 'dd MMMM yyyy')}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Estimated Completion:</span>
                  <span className="font-medium">{format(estimatedCompletion, 'MMMM yyyy')}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Schedule a Meeting with Our Sales Team</h4>
              
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  We recommend scheduling a meeting with our sales team to discuss the next steps.
                </p>
                
                <Tabs defaultValue="dates">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="dates">Select a Date</TabsTrigger>
                    <TabsTrigger value="later">Schedule Later</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="dates" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 mt-3">
                      {getAvailableAppointmentDates().map((date, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleDateSelect(date.toISOString())}
                          className={`p-3 text-center border rounded-lg ${
                            reservationDetails.appointmentDate && format(reservationDetails.appointmentDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="text-sm font-medium">
                            {format(date, 'EEE')}
                          </div>
                          <div className="text-lg font-bold my-1">
                            {format(date, 'd')}
                          </div>
                          <div className="text-xs text-gray-500">
                            {format(date, 'MMM')}
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {reservationDetails.appointmentDate && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-4">
                        {appointmentTimes.map((time, index) => (
                          <button
                            key={index}
                            type="button"
                            className="p-2 text-center border rounded-md border-gray-200 hover:bg-gray-50"
                          >
                            <span className="text-sm">{time}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="later">
                    <div className="p-4 bg-gray-50 rounded-lg mt-3">
                      <h4 className="font-medium mb-2 flex items-center">
                        <Clock size={16} className="mr-2" />
                        Schedule After Reservation
                      </h4>
                      <p className="text-sm text-gray-600">
                        If you prefer, you can complete your reservation now and our sales team will contact you
                        within 24 hours to arrange a meeting at your convenience.
                      </p>
                      
                      <div className="mt-3 flex items-center">
                        <input
                          type="checkbox"
                          id="mortgage-approval"
                          name="mortgageApprovalInPrinciple"
                          checked={reservationDetails.mortgageApprovalInPrinciple}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="mortgage-approval" className="ml-2 block text-sm text-gray-700">
                          I already have mortgage approval in principle
                        </label>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            <div className="pt-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms-accepted"
                  name="termsAccepted"
                  checked={reservationDetails.termsAccepted}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="terms-accepted" className="ml-2 block text-sm text-gray-700">
                  I accept the <a href="#" className="text-blue-600 hover:underline">terms and conditions</a> and <a href="#" className="text-blue-600 hover:underline">privacy policy</a>
                </label>
              </div>
              
              <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm">
                <div className="flex items-start">
                  <AlertCircle size={16} className="text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-amber-700">
                    By proceeding, you agree to pay the reservation deposit. This secures the property for 14 days,
                    during which you'll need to progress with your mortgage application and legal requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 4: Completed Reservation */}
        {currentStep === 4 && (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
              <CheckCircle size={32} />
            </div>
            
            <h3 className="text-xl font-semibold mb-2">Reservation Confirmed!</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Congratulations! Your property has been successfully reserved. Our team will contact you shortly.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Reservation ID:</span>
                <span className="font-semibold">{reservationId}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Status:</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Expires:</span>
                <span>{format(reservationExpiry, 'dd MMMM yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Deposit Paid:</span>
                <span>{formatCurrency(reservationDetails.depositAmount)}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button className="w-full sm:w-auto">
                View Reservation Details
              </Button>
              <div>
                <a href="#" className="text-blue-600 hover:underline text-sm">
                  Download Reservation Confirmation
                </a>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg text-left">
              <h4 className="font-medium text-blue-800 mb-2">Next Steps:</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1 text-blue-600 mr-2 mt-0.5">
                    <Check size={12} />
                  </div>
                  <span className="text-sm text-gray-700">
                    Check your email for reservation confirmation details
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1 text-blue-600 mr-2 mt-0.5">
                    <Check size={12} />
                  </div>
                  <span className="text-sm text-gray-700">
                    Our sales team will contact you within 24 hours
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1 text-blue-600 mr-2 mt-0.5">
                    <Check size={12} />
                  </div>
                  <span className="text-sm text-gray-700">
                    Proceed with your mortgage application and solicitor appointment
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1 text-blue-600 mr-2 mt-0.5">
                    <Check size={12} />
                  </div>
                  <span className="text-sm text-gray-700">
                    Complete the Help to Buy application to claim your tax rebate
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}
        
        {/* Navigation Buttons */}
        {currentStep < 4 && (
          <div className="flex justify-between mt-6">
            {currentStep > 1 ? (
              <Button 
                variant="outline" 
                onClick={handlePreviousStep}
                disabled={isLoading}
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Back
              </Button>
            ) : (
              <div></div> // Empty div to maintain flexbox structure
            )}
            
            <Button 
              onClick={handleNextStep}
              disabled={!isCurrentStepValid() || isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing
                </div>
              ) : (
                <>
                  {currentStep === 3 ? 'Complete Reservation' : 'Next'}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}