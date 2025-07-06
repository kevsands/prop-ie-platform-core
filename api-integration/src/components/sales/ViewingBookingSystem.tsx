'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  CheckCircle,
  AlertCircle,
  Users,
  Car,
  Info,
  MessageSquare,
  VideoIcon,
  Home
} from 'lucide-react';

interface ViewingBookingSystemProps {
  propertyId: string;
  unitId?: string;
  developmentId: string;
  unitNumber?: string;
  propertyAddress: string;
  agentInfo?: {
    name: string;
    phone: string;
    email: string;
    image?: string;
  };
  onBookingComplete?: (bookingData: ViewingBooking) => void;
  onLeadGenerated?: (leadData: any) => void;
  className?: string;
}

interface ViewingSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
  agentName: string;
  slotType: 'individual' | 'group' | 'virtual';
  maxPeople: number;
  currentBookings: number;
}

interface ViewingBooking {
  id: string;
  propertyId: string;
  unitId?: string;
  developmentId: string;
  slotId: string;
  date: string;
  time: string;
  visitorInfo: {
    name: string;
    email: string;
    phone: string;
    numberOfPeople: number;
    requirements?: string;
    preferredContact: 'email' | 'phone' | 'whatsapp';
  };
  bookingType: 'individual' | 'group' | 'virtual';
  status: 'confirmed' | 'pending' | 'cancelled';
  agentAssigned: string;
  confirmationCode: string;
  specialRequests?: string;
  createdAt: Date;
}

export default function ViewingBookingSystem({
  propertyId,
  unitId,
  developmentId,
  unitNumber,
  propertyAddress,
  agentInfo,
  onBookingComplete,
  onLeadGenerated,
  className = ''
}: ViewingBookingSystemProps) {
  const [step, setStep] = useState<'slots' | 'details' | 'confirmation'>('slots');
  const [selectedSlot, setSelectedSlot] = useState<ViewingSlot | null>(null);
  const [availableSlots, setAvailableSlots] = useState<ViewingSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [visitorInfo, setVisitorInfo] = useState({
    name: '',
    email: '',
    phone: '',
    numberOfPeople: 1,
    requirements: '',
    preferredContact: 'email' as const,
    specialRequests: ''
  });

  const [booking, setBooking] = useState<ViewingBooking | null>(null);

  useEffect(() => {
    loadAvailableSlots();
  }, [propertyId, developmentId]);

  const loadAvailableSlots = async () => {
    setLoading(true);
    try {
      // Generate available slots for next 14 days
      const slots = generateAvailableSlots();
      setAvailableSlots(slots);
    } catch (error) {
      setError('Failed to load available viewing times');
    } finally {
      setLoading(false);
    }
  };

  const generateAvailableSlots = (): ViewingSlot[] => {
    const slots: ViewingSlot[] = [];
    const today = new Date();
    
    // Generate slots for next 14 days
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip Sundays for individual viewings
      if (date.getDay() === 0) continue;
      
      const dateStr = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();
      
      // Weekend slots (Saturday)
      if (dayOfWeek === 6) {
        // Saturday slots: 10:00, 11:30, 13:00, 14:30, 16:00
        const weekendTimes = ['10:00', '11:30', '13:00', '14:30', '16:00'];
        weekendTimes.forEach((time, index) => {
          slots.push({
            id: `${dateStr}-${time}`,
            date: dateStr,
            time,
            available: Math.random() > 0.3, // 70% availability
            agentName: agentInfo?.name || ['Sarah Murphy', 'Michael O\'Brien', 'Emma Walsh'][Math.floor(Math.random() * 3)],
            slotType: index < 3 ? 'individual' : 'group',
            maxPeople: index < 3 ? 4 : 8,
            currentBookings: Math.floor(Math.random() * 2)
          });
        });
      } 
      // Weekday slots
      else {
        // Weekday slots: 10:00, 12:00, 14:00, 16:00, 18:00
        const weekdayTimes = ['10:00', '12:00', '14:00', '16:00', '18:00'];
        weekdayTimes.forEach((time, index) => {
          slots.push({
            id: `${dateStr}-${time}`,
            date: dateStr,
            time,
            available: Math.random() > 0.2, // 80% availability
            agentName: agentInfo?.name || ['Sarah Murphy', 'Michael O\'Brien', 'Emma Walsh'][Math.floor(Math.random() * 3)],
            slotType: index === 4 ? 'virtual' : 'individual', // Evening slot is virtual
            maxPeople: index === 4 ? 10 : 4,
            currentBookings: Math.floor(Math.random() * 3)
          });
        });
      }
    }
    
    return slots.filter(slot => slot.available);
  };

  const handleSlotSelection = (slot: ViewingSlot) => {
    setSelectedSlot(slot);
    setStep('details');
  };

  const handleBookingSubmit = async () => {
    if (!selectedSlot) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Create booking
      const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const confirmationCode = Math.random().toString(36).substr(2, 8).toUpperCase();
      
      const newBooking: ViewingBooking = {
        id: bookingId,
        propertyId,
        unitId,
        developmentId,
        slotId: selectedSlot.id,
        date: selectedSlot.date,
        time: selectedSlot.time,
        visitorInfo,
        bookingType: selectedSlot.slotType,
        status: 'confirmed',
        agentAssigned: selectedSlot.agentName,
        confirmationCode,
        specialRequests: visitorInfo.specialRequests,
        createdAt: new Date()
      };
      
      setBooking(newBooking);
      
      // Generate lead data
      const leadData = {
        type: 'viewing_request',
        propertyId,
        unitId,
        developmentId,
        contactInfo: {
          name: visitorInfo.name,
          email: visitorInfo.email,
          phone: visitorInfo.phone,
          preferredContact: visitorInfo.preferredContact
        },
        viewingDetails: {
          date: selectedSlot.date,
          time: selectedSlot.time,
          type: selectedSlot.slotType,
          numberOfPeople: visitorInfo.numberOfPeople
        },
        urgency: 'high',
        leadScore: 25, // Viewing request is high value
        source: 'property-viewing-booking'
      };
      
      // Call callbacks
      if (onBookingComplete) {
        onBookingComplete(newBooking);
      }
      
      if (onLeadGenerated) {
        onLeadGenerated(leadData);
      }
      
      // Sync with real-time inventory system
      await syncViewingRequest(newBooking);
      
      setStep('confirmation');
      
    } catch (error) {
      setError('Failed to book viewing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const syncViewingRequest = async (booking: ViewingBooking) => {
    try {
      // Sync with real-time inventory service
      await fetch('/api/properties/availability', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: booking.propertyId,
          action: 'viewing_scheduled',
          buyerId: booking.visitorInfo.email,
          agent: booking.agentAssigned
        })
      });
      
      // Track buyer activity
      await fetch('/api/buyer-activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buyerId: booking.visitorInfo.email,
          sessionId: `session_${Date.now()}`,
          activityType: 'viewing_request',
          data: {
            propertyId: booking.propertyId,
            unitId: booking.unitId,
            developmentId: booking.developmentId,
            viewingDate: new Date(`${booking.date}T${booking.time}`),
            contactInfo: booking.visitorInfo
          },
          engagement: {
            intensity: 'very_high',
            timeSpent: 0,
            pageDepth: 1,
            interactionCount: 1
          }
        })
      });
      
    } catch (error) {
      console.error('Error syncing viewing request:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IE', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSlotTypeIcon = (type: ViewingSlot['slotType']) => {
    switch (type) {
      case 'virtual':
        return <VideoIcon className="w-4 h-4" />;
      case 'group':
        return <Users className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getSlotTypeLabel = (type: ViewingSlot['slotType']) => {
    switch (type) {
      case 'virtual':
        return 'Virtual Tour';
      case 'group':
        return 'Group Viewing';
      default:
        return 'Private Viewing';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-lg">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6" />
          <div>
            <h2 className="text-xl font-bold">Book Property Viewing</h2>
            <p className="text-green-100 text-sm">
              {unitNumber ? `Unit ${unitNumber}` : 'Property'} • {propertyAddress}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 'slots' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Choose Your Viewing Time
              </h3>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading available times...</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {availableSlots.slice(0, 12).map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => handleSlotSelection(slot)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-900">
                              {formatDate(slot.date).split(',')[0]}
                            </p>
                            <p className="text-lg font-bold text-green-600">
                              {new Date(slot.date).getDate()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(slot.date).toLocaleDateString('en-IE', { month: 'short' })}
                            </p>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">{slot.time}</span>
                              {getSlotTypeIcon(slot.slotType)}
                              <span className="text-sm text-gray-600">
                                {getSlotTypeLabel(slot.slotType)}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <User className="w-3 h-3" />
                              <span>With {slot.agentName}</span>
                            </div>
                            
                            {slot.slotType === 'group' && (
                              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                <Users className="w-3 h-3" />
                                <span>{slot.currentBookings}/{slot.maxPeople} spaces filled</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          →
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">Viewing Types:</p>
                    <ul className="space-y-1 text-xs">
                      <li><strong>Private Viewing:</strong> Just you and our agent</li>
                      <li><strong>Group Viewing:</strong> View with other potential buyers</li>
                      <li><strong>Virtual Tour:</strong> Interactive online viewing with live agent support</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'details' && selectedSlot && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Selected Viewing</h3>
              <div className="text-sm text-green-700">
                <p><strong>Date:</strong> {formatDate(selectedSlot.date)}</p>
                <p><strong>Time:</strong> {selectedSlot.time}</p>
                <p><strong>Type:</strong> {getSlotTypeLabel(selectedSlot.slotType)}</p>
                <p><strong>Agent:</strong> {selectedSlot.agentName}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="John Smith"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={visitorInfo.name}
                  onChange={(e) => setVisitorInfo(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={visitorInfo.email}
                  onChange={(e) => setVisitorInfo(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="+353 1 234 5678"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={visitorInfo.phone}
                  onChange={(e) => setVisitorInfo(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of People
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={visitorInfo.numberOfPeople}
                  onChange={(e) => setVisitorInfo(prev => ({ ...prev, numberOfPeople: parseInt(e.target.value) }))}
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Contact Method
              </label>
              <div className="flex gap-4">
                {[
                  { value: 'email', label: 'Email', icon: Mail },
                  { value: 'phone', label: 'Phone', icon: Phone },
                  { value: 'whatsapp', label: 'WhatsApp', icon: MessageSquare }
                ].map(({ value, label, icon: Icon }) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="preferredContact"
                      value={value}
                      checked={visitorInfo.preferredContact === value}
                      onChange={(e) => setVisitorInfo(prev => ({ ...prev, preferredContact: e.target.value as any }))}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <Icon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requirements or Questions
              </label>
              <textarea
                placeholder="Any accessibility needs, specific questions, or requirements..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={visitorInfo.specialRequests}
                onChange={(e) => setVisitorInfo(prev => ({ ...prev, specialRequests: e.target.value }))}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('slots')}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Back to Times
              </button>
              <button
                onClick={handleBookingSubmit}
                disabled={!visitorInfo.name || !visitorInfo.email || !visitorInfo.phone || loading}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'Booking...' : 'Confirm Viewing'}
              </button>
            </div>
          </div>
        )}

        {step === 'confirmation' && booking && (
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Viewing Confirmed!
              </h3>
              <p className="text-gray-600">
                Your property viewing has been successfully booked
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-left">
              <h4 className="font-semibold text-gray-900 mb-4">Booking Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Confirmation Code:</span>
                  <span className="font-mono font-bold">{booking.confirmationCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time:</span>
                  <span>{formatDate(booking.date)} at {booking.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Property:</span>
                  <span>{unitNumber ? `Unit ${unitNumber}` : 'Property'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Viewing Type:</span>
                  <span>{getSlotTypeLabel(booking.bookingType)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Your Agent:</span>
                  <span>{booking.agentAssigned}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <h4 className="font-semibold text-blue-800 mb-2">What's Next?</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Confirmation email sent to {booking.visitorInfo.email}</li>
                <li>• Agent will contact you within 2 hours</li>
                <li>• Bring photo ID and any questions you have</li>
                <li>• Arrive 5 minutes early at the property</li>
              </ul>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.href = `tel:${agentInfo?.phone || '+353 1 234 5678'}`}
                className="px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium"
              >
                Call Agent
              </button>
              <button
                onClick={() => {
                  setStep('slots');
                  setSelectedSlot(null);
                  setBooking(null);
                  setVisitorInfo({
                    name: '',
                    email: '',
                    phone: '',
                    numberOfPeople: 1,
                    requirements: '',
                    preferredContact: 'email',
                    specialRequests: ''
                  });
                }}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Book Another Viewing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}