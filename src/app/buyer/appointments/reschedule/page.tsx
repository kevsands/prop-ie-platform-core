'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  AlertCircle, 
  CheckCircle, 
  Phone, 
  Video, 
  Home, 
  Building, 
  Mail,
  Save,
  X
} from 'lucide-react';
import Link from 'next/link';
import { format, addDays, isWeekend, startOfWeek, isSameDay } from 'date-fns';

interface AppointmentDetails {
  id: string;
  type: 'viewing' | 'meeting' | 'call' | 'video';
  title: string;
  description: string;
  currentDate: Date;
  duration: number;
  location?: string;
  isVirtual: boolean;
  attendees: string[];
  property?: {
    id: string;
    name: string;
    unit: string;
    address: string;
  };
  agent?: {
    name: string;
    phone: string;
    email: string;
  };
  notes?: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
  reason?: string;
}

function RescheduleAppointmentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const appointmentId = searchParams.get('id') || '1';
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock appointment data - in a real app, this would be fetched based on the ID
  const appointment: AppointmentDetails = {
    id: appointmentId,
    type: 'viewing',
    title: 'Property Viewing - Riverside Manor',
    description: 'Viewing Unit 4B with Sarah Johnson',
    currentDate: new Date(Date.now() + 86400000), // Tomorrow
    duration: 30,
    location: 'Riverside Manor, Unit 4B',
    isVirtual: false,
    attendees: ['Sarah Johnson', 'You'],
    property: {
      id: 'RM-4B',
      name: 'Riverside Manor',
      unit: '4B',
      address: '123 Riverside Drive, Dublin 2'
    },
    agent: {
      name: 'Sarah Johnson',
      phone: '+353 1 234 5678',
      email: 'sarah.johnson@prop.ie'
    },
    notes: 'Please bring photo ID and proof of funds'
  };

  // Generate available dates (next 14 days, excluding weekends for property viewings)
  const generateAvailableDates = () => {
    const dates = [];
    for (let i = 2; i <= 15; i++) { // Start from day after tomorrow
      const date = addDays(new Date(), i);
      if (appointment.type === 'viewing' && isWeekend(date)) {
        continue; // Skip weekends for property viewings
      }
      dates.push(date);
    }
    return dates;
  };

  // Generate time slots for selected date
  const generateTimeSlots = (date: Date): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const isWeekday = !isWeekend(date);
    
    if (appointment.type === 'viewing') {
      // Property viewings: 10 AM - 6 PM on weekdays, 10 AM - 4 PM on weekends
      const startHour = 10;
      const endHour = isWeekday ? 18 : 16;
      
      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          
          // Mock availability - some slots are unavailable
          const unavailableSlots = ['11:00', '14:30', '16:00'];
          const isUnavailable = unavailableSlots.includes(timeString);
          
          slots.push({
            time: timeString,
            available: !isUnavailable,
            reason: isUnavailable ? 'Already booked' : undefined
          });
        }
      }
    } else {
      // Meetings/calls: 9 AM - 6 PM on weekdays
      const startHour = 9;
      const endHour = 18;
      
      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          
          // Mock availability
          const unavailableSlots = ['12:00', '12:30', '13:00', '17:30'];
          const isUnavailable = unavailableSlots.includes(timeString);
          
          slots.push({
            time: timeString,
            available: !isUnavailable,
            reason: isUnavailable ? 'Lunch break' : undefined
          });
        }
      }
    }
    
    return slots;
  };

  const availableDates = generateAvailableDates();
  const timeSlots = selectedDate ? generateTimeSlots(selectedDate) : [];

  const getAppointmentIcon = (type: string) => {
    switch (type) {
      case 'viewing': return <Home className="h-5 w-5 text-blue-600" />;
      case 'meeting': return <Building className="h-5 w-5 text-purple-600" />;
      case 'call': return <Phone className="h-5 w-5 text-green-600" />;
      case 'video': return <Video className="h-5 w-5 text-orange-600" />;
      default: return <Calendar className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'viewing': return 'Property Viewing';
      case 'meeting': return 'In-Person Meeting';
      case 'call': return 'Phone Call';
      case 'video': return 'Video Call';
      default: return 'Appointment';
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setShowConfirmation(true);
    
    // Auto-redirect after 3 seconds
    setTimeout(() => {
      router.push('/buyer/appointments');
    }, 3000);
  };

  const canReschedule = selectedDate && selectedTime && reason.trim();

  if (showConfirmation) {
    return (
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg border shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Appointment Rescheduled!</h1>
            <p className="text-gray-600 mb-6">
              Your appointment has been successfully rescheduled to{' '}
              <strong>{selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}</strong> at{' '}
              <strong>{selectedTime}</strong>.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                A confirmation email has been sent to you and all attendees. 
                You'll be redirected to your appointments page shortly.
              </p>
            </div>
            <Link 
              href="/buyer/appointments"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Calendar className="h-5 w-5" />
              View All Appointments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/buyer/appointments"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reschedule Appointment</h1>
            <p className="text-gray-600 mt-1">Choose a new date and time for your appointment</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Appointment Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Appointment</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  {getAppointmentIcon(appointment.type)}
                  <div>
                    <h4 className="font-medium text-gray-900">{appointment.title}</h4>
                    <p className="text-sm text-gray-600">{getTypeLabel(appointment.type)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {format(appointment.currentDate, 'EEEE, MMMM d, yyyy')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(appointment.currentDate, 'h:mm a')} ({appointment.duration} min)
                    </p>
                  </div>
                </div>

                {appointment.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Location</p>
                      <p className="text-sm text-gray-600">{appointment.location}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Attendees</p>
                    <div className="text-sm text-gray-600">
                      {appointment.attendees.map((attendee, index) => (
                        <p key={index}>{attendee}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {appointment.agent && (
                  <div className="border-t pt-4">
                    <p className="font-medium text-gray-900 mb-2">Agent Contact</p>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">{appointment.agent.name}</p>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <a href={`tel:${appointment.agent.phone}`} className="text-sm text-blue-600 hover:underline">
                          {appointment.agent.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <a href={`mailto:${appointment.agent.email}`} className="text-sm text-blue-600 hover:underline">
                          {appointment.agent.email}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reschedule Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Select New Date & Time</h3>

              {/* Date Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Choose Date</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableDates.map((date) => (
                    <button
                      key={date.toISOString()}
                      onClick={() => handleDateSelect(date)}
                      className={`p-3 border rounded-lg transition-all ${
                        selectedDate && isSameDay(selectedDate, date)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <p className="font-medium">{format(date, 'EEE')}</p>
                      <p className="text-lg font-bold">{format(date, 'd')}</p>
                      <p className="text-sm text-gray-600">{format(date, 'MMM')}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Choose Time for {format(selectedDate, 'EEEE, MMMM d')}
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => slot.available && handleTimeSelect(slot.time)}
                        disabled={!slot.available}
                        className={`p-2 border rounded-lg text-sm transition-all ${
                          !slot.available
                            ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                            : selectedTime === slot.time
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        title={slot.reason}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                  {timeSlots.some(slot => !slot.available) && (
                    <p className="text-xs text-gray-500 mt-2">
                      <AlertCircle className="h-3 w-3 inline mr-1" />
                      Grayed out times are unavailable
                    </p>
                  )}
                </div>
              )}

              {/* Reason for Rescheduling */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Rescheduling
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please provide a brief reason for rescheduling..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be shared with all attendees in the reschedule notification.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleReschedule}
                  disabled={!canReschedule || isSubmitting}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    canReschedule && !isSubmitting
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="h-5 w-5" />
                  )}
                  {isSubmitting ? 'Rescheduling...' : 'Reschedule Appointment'}
                </button>
                
                <Link
                  href="/buyer/appointments"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </Link>
              </div>

              {/* Important Notes */}
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800 mb-1">Important Notes</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• All attendees will be notified of the schedule change</li>
                      <li>• You can reschedule up to 24 hours before the appointment</li>
                      <li>• Property viewings are only available during business hours</li>
                      {appointment.type === 'viewing' && (
                        <li>• Please arrive 5 minutes early and bring valid ID</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RescheduleAppointmentPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            <div>
              <div className="w-64 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="w-48 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border shadow-sm p-6">
                <div className="w-48 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-4">
                  <div className="w-full h-16 bg-gray-100 rounded animate-pulse"></div>
                  <div className="w-full h-12 bg-gray-100 rounded animate-pulse"></div>
                  <div className="w-full h-12 bg-gray-100 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border shadow-sm p-6">
                <div className="w-56 h-6 bg-gray-200 rounded animate-pulse mb-6"></div>
                <div className="space-y-6">
                  <div className="w-full h-32 bg-gray-100 rounded animate-pulse"></div>
                  <div className="w-full h-24 bg-gray-100 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }>
      <RescheduleAppointmentPageContent />
    </Suspense>
  );
}