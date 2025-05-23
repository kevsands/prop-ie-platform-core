'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  CalendarPlus,
  Video,
  Car,
  Building,
  MessageSquare,
  ChevronRight,
  Download,
  Share2,
  Navigation
} from 'lucide-react';
import { format, addDays, parseISO, isFuture, isPast } from 'date-fns';

interface Viewing {
  id: string;
  propertyId: string;
  developmentName: string;
  unitType: string;
  unitNumber: string;
  propertyAddress: string;
  date: Date;
  time: string;
  duration: number; // in minutes
  type: 'in-person' | 'virtual';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  agent: {
    id: string;
    name: string;
    phone: string;
    email: string;
    photo?: string;
  };
  notes?: string;
  reminders?: Array<{
    type: 'email' | 'sms' | 'push';
    time: number; // minutes before viewing
  }>\n  );
  feedback?: {
    rating: number;
    comments: string;
    interestedInProperty: boolean;
  };
  rescheduledFrom?: Date;
  cancelReason?: string;
  meetingPoint?: string;
  parkingInfo?: string;
  virtualMeetingLink?: string;
}

const BuyerViewingsPageContent = () => {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('property');

  const [viewingssetViewings] = useState<Viewing[]>([]);
  const [filteredViewingssetFilteredViewings] = useState<Viewing[]>([]);
  const [loadingsetLoading] = useState(true);
  const [showSchedulersetShowScheduler] = useState(false);
  const [selectedDatesetSelectedDate] = useState<Date | null>(null);
  const [selectedTimesetSelectedTime] = useState<string>('');
  const [viewingTypesetViewingType] = useState<'in-person' | 'virtual'>('in-person');
  const [filtersetFilter] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('all');
  const [selectedViewingsetSelectedViewing] = useState<Viewing | null>(null);
  const [showFeedbacksetShowFeedback] = useState(false);
  const [showReschedulesetShowReschedule] = useState(false);

  // Protect the route
  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'buyer') {
      router.push('/unauthorized');
    }
  }, [userrouter]);

  // Fetch viewings
  useEffect(() => {
    if (user?.role === 'buyer') {
      fetchViewings();
    }
  }, [user]);

  // Filter viewings
  useEffect(() => {
    let filtered = [...viewings];

    switch (filter) {
      case 'upcoming':
        filtered = filtered.filter(v => 
          isFuture(v.date) && v.status !== 'cancelled'
        );
        break;
      case 'past':
        filtered = filtered.filter(v => 
          isPast(v.date) || v.status === 'completed'
        );
        break;
      case 'cancelled':
        filtered = filtered.filter(v => v.status === 'cancelled');
        break;
    }

    // Sort by date
    filtered.sort((ab) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setFilteredViewings(filtered);
  }, [viewingsfilter]);

  // Handle property-specific viewing
  useEffect(() => {
    if (propertyId && !showScheduler) {
      setShowScheduler(true);
    }
  }, [propertyId]);

  const fetchViewings = async () => {
    try {
      setLoading(true);
      // TODO: Fetch from API
      // Simulate API data
      const mockViewings: Viewing[] = [
        {
          id: '1',
          propertyId: 'fitz-gardens-01',
          developmentName: 'Fitzgerald Gardens',
          unitType: 'Type A',
          unitNumber: 'A101',
          propertyAddress: 'Fitzgerald Gardens, Drogheda, Co. Louth',
          date: addDays(new Date(), 3),
          time: '14:00',
          duration: 30,
          type: 'in-person',
          status: 'confirmed',
          agent: {
            id: 'agent1',
            name: 'Sarah Johnson',
            phone: '+353 1 234 5678',
            email: 'sarah.johnson@prop.ie',
            photo: '/images/team/sarah.jpg'
          },
          notes: 'Meet at the sales office',
          reminders: [
            { type: 'email', time: 1440 }, // 24 hours
            { type: 'sms', time: 60 } // 1 hour
          ],
          meetingPoint: 'Sales Office',
          parkingInfo: 'Free parking available on-site'
        },
        {
          id: '2',
          propertyId: 'riverside-manor-03',
          developmentName: 'Riverside Manor',
          unitType: 'Type B',
          unitNumber: 'B205',
          propertyAddress: 'Riverside Manor, Dublin 15',
          date: addDays(new Date(), -5),
          time: '11:00',
          duration: 45,
          type: 'virtual',
          status: 'completed',
          agent: {
            id: 'agent2',
            name: 'Michael O\'Brien',
            phone: '+353 1 987 6543',
            email: 'michael.obrien@prop.ie'
          },
          virtualMeetingLink: 'https://meet.prop.ie/viewing-b205',
          feedback: {
            rating: 4,
            comments: 'Great property, loved the layout and natural light',
            interestedInProperty: true
          }
        },
        {
          id: '3',
          propertyId: 'ellwood-07',
          developmentName: 'Ellwood',
          unitType: 'Type C',
          unitNumber: 'C301',
          propertyAddress: 'Ellwood, Drogheda, Co. Louth',
          date: addDays(new Date(), 7),
          time: '10:00',
          duration: 30,
          type: 'in-person',
          status: 'scheduled',
          agent: {
            id: 'agent1',
            name: 'Sarah Johnson',
            phone: '+353 1 234 5678',
            email: 'sarah.johnson@prop.ie'
          },
          reminders: [
            { type: 'email', time: 1440 },
            { type: 'sms', time: 60 }
          ]
        }
      ];
      setViewings(mockViewings);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  const scheduleViewing = async () => {
    if (!selectedDate || !selectedTime) {
      return;
    }

    try {
      // TODO: API call to schedule viewing
      const newViewing: Viewing = {
        id: Date.now().toString(),
        propertyId: propertyId || 'new',
        developmentName: 'New Development',
        unitType: 'Type A',
        unitNumber: 'A1',
        propertyAddress: '1 New Street',
        date: selectedDate,
        time: selectedTime,
        duration: 30,
        type: viewingType,
        status: 'scheduled',
        agent: {
          id: 'agent1',
          name: 'Sarah Johnson',
          phone: '+353 1 234 5678',
          email: 'sarah.johnson@prop.ie'
        },
        reminders: [
          { type: 'email', time: 1440 },
          { type: 'sms', time: 60 }
        ]
      };

      setViewings([...viewingsnewViewing]);
      setShowScheduler(false);
      setSelectedDate(null);
      setSelectedTime('');
    } catch (error) {

    }
  };

  const cancelViewing = async (viewingId: string, reason?: string) => {
    try {
      // TODO: API call to cancel viewing
      setViewings(viewings.map(v => 
        v.id === viewingId 
          ? { ...v, status: 'cancelled', cancelReason: reason }
          : v
      ));
    } catch (error) {

    }
  };

  const rescheduleViewing = async (viewingId: string, newDate: Date, newTime: string) => {
    try {
      // TODO: API call to reschedule viewing
      const viewing = viewings.find(v => v.id === viewingId);
      if (viewing) {
        setViewings(viewings.map(v => 
          v.id === viewingId 
            ? { 
                ...v, 
                date: newDate,
                time: newTime,
                status: 'rescheduled',
                rescheduledFrom: v.date
              }
            : v
        ));
      }
      setShowReschedule(false);
    } catch (error) {

    }
  };

  const submitFeedback = async (viewingId: string, feedback: Viewing['feedback']) => {
    try {
      // TODO: API call to submit feedback
      setViewings(viewings.map(v => 
        v.id === viewingId 
          ? { ...v, feedback }
          : v
      ));
      setShowFeedback(false);
    } catch (error) {

    }
  };

  const getStatusColor = (status: Viewing['status']) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-50';
      case 'scheduled':
        return 'text-blue-600 bg-blue-50';
      case 'completed':
        return 'text-gray-600 bg-gray-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      case 'rescheduled':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getActionButton = (viewing: Viewing) => {
    if (isPast(viewing.date)) {
      if (!viewing.feedback) {
        return (
          <button
            onClick={() => {
              setSelectedViewing(viewing);
              setShowFeedback(true);
            }
            className="btn btn-secondary"
          >
            Leave Feedback
          </button>
        );
      }
      return null;
    }

    if (viewing.status === 'scheduled' || viewing.status === 'confirmed') {
      return (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedViewing(viewing);
              setShowReschedule(true);
            }
            className="btn btn-secondary"
          >
            Reschedule
          </button>
          <button
            onClick={() => cancelViewing(viewing.id)}
            className="btn btn-outline text-red-600 border-red-600 hover:bg-red-50"
          >
            Cancel
          </button>
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 23].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Viewings</h1>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => setShowScheduler(true)}
              className="btn btn-primary"
            >
              <CalendarPlus className="w-4 h-4 mr-2" />
              Schedule New Viewing
            </button>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              {['all', 'upcoming', 'past', 'cancelled'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === f
                      ? 'bg-[#7C3AED] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Viewings</p>
                  <p className="text-xl font-semibold">{viewings.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-xl font-semibold">
                    {viewings.filter(v => v.status === 'completed').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Upcoming</p>
                  <p className="text-xl font-semibold">
                    {viewings.filter(v => isFuture(v.date) && v.status !== 'cancelled').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Feedback Pending</p>
                  <p className="text-xl font-semibold">
                    {viewings.filter(v => isPast(v.date) && !v.feedback && v.status === 'completed').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Viewings List */}
        <div className="space-y-4">
          {filteredViewings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No viewings found
              </h3>
              <p className="text-gray-600 mb-4">
                {filter === 'all' 
                  ? "You haven't scheduled any viewings yet"
                  : `No ${filter} viewings`}
              </p>
              <button
                onClick={() => setShowScheduler(true)}
                className="btn btn-primary"
              >
                Schedule Your First Viewing
              </button>
            </div>
          ) : (
            filteredViewings.map((viewing) => (
              <motion.div
                key={viewing.id}
                initial={ opacity: 0, y: 20 }
                animate={ opacity: 1, y: 0 }
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Property Info */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      {viewing.developmentName}
                    </h3>
                    <p className="text-gray-600 text-sm mb-1">
                      {viewing.unitType} - Unit {viewing.unitNumber}
                    </p>
                    <p className="text-gray-600 text-sm flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {viewing.propertyAddress}
                    </p>

                    {/* Status Badge */}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-3 ${getStatusColor(viewing.status)}`}>
                      {viewing.status}
                    </span>
                  </div>

                  {/* Viewing Details */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">
                        {format(viewing.date, 'EEEE, MMMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{viewing.time} ({viewing.duration} min)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {viewing.type === 'in-person' ? (
                        <>
                          <Building className="w-4 h-4 text-gray-400" />
                          <span>In-Person Viewing</span>
                        </>
                      ) : (
                        <>
                          <Video className="w-4 h-4 text-gray-400" />
                          <span>Virtual Viewing</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Agent & Actions */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Your Agent</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">{viewing.agent.name}</p>
                          <p className="text-sm text-gray-600">{viewing.agent.phone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      {getActionButton(viewing)}
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                {(viewing.notes || viewing.parkingInfo || viewing.virtualMeetingLink) && (
                  <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {viewing.notes && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Notes</p>
                        <p className="text-sm">{viewing.notes}</p>
                      </div>
                    )}
                    {viewing.parkingInfo && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Parking</p>
                        <p className="text-sm">{viewing.parkingInfo}</p>
                      </div>
                    )}
                    {viewing.virtualMeetingLink && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Meeting Link</p>
                        <a href={viewing.virtualMeetingLink} className="text-sm text-[#7C3AED] hover:underline">
                          Join Virtual Viewing
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Feedback */}
                {viewing.feedback && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-600 mb-2">Your Feedback</p>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 45].map((star) => (
                          <span
                            key={star}
                            className={`text-lg ${star <= viewing.feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {viewing.feedback.interestedInProperty ? 'Interested' : 'Not Interested'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{viewing.feedback.comments}</p>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>

        {/* Viewing Tips */}
        {filteredViewings.length> 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Viewing Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#7C3AED]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#7C3AED]" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Arrive Early</h4>
                  <p className="text-sm text-gray-600">
                    Arrive 10 minutes early to explore the neighborhood
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#7C3AED]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-[#7C3AED]" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Ask Questions</h4>
                  <p className="text-sm text-gray-600">
                    Prepare a list of questions about the property
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#7C3AED]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-[#7C3AED]" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Take Notes</h4>
                  <p className="text-sm text-gray-600">
                    Document your impressions for later comparison
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      {showScheduler && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={ opacity: 0, scale: 0.95 }
            animate={ opacity: 1, scale: 1 }
            className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full"
          >
            <h2 className="text-xl font-semibold mb-4">Schedule Viewing</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="input w-full"
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <select 
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="input w-full"
                >
                  <option value="">Select a time</option>
                  {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Viewing Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="in-person"
                      checked={viewingType === 'in-person'}
                      onChange={(e) => setViewingType(e.target.value as any)}
                      className="mr-2"
                    />
                    In-Person
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="virtual"
                      checked={viewingType === 'virtual'}
                      onChange={(e) => setViewingType(e.target.value as any)}
                      className="mr-2"
                    />
                    Virtual
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowScheduler(false)}
                className="flex-1 btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={scheduleViewing}
                disabled={!selectedDate || !selectedTime}
                className="flex-1 btn btn-primary"
              >
                Schedule
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showReschedule && selectedViewing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={ opacity: 0, scale: 0.95 }
            animate={ opacity: 1, scale: 1 }
            className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full"
          >
            <h2 className="text-xl font-semibold mb-4">Reschedule Viewing</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Date
                </label>
                <input
                  type="date"
                  value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="input w-full"
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Time
                </label>
                <select 
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="input w-full"
                >
                  <option value="">Select a time</option>
                  {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowReschedule(false);
                  setSelectedViewing(null);
                  setSelectedDate(null);
                  setSelectedTime('');
                }
                className="flex-1 btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedDate && selectedTime) {
                    rescheduleViewing(selectedViewing.id, selectedDateselectedTime);
                  }
                }
                disabled={!selectedDate || !selectedTime}
                className="flex-1 btn btn-primary"
              >
                Reschedule
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedback && selectedViewing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={ opacity: 0, scale: 0.95 }
            animate={ opacity: 1, scale: 1 }
            className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full"
          >
            <h2 className="text-xl font-semibold mb-4">Leave Feedback</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  How was your viewing?
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 45].map((star) => (
                    <button
                      key={star}
                      className="text-2xl text-gray-300 hover:text-yellow-400 transition-colors"
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Are you interested in this property?
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="interested"
                      value="yes"
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="interested"
                      value="no"
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comments
                </label>
                <textarea
                  rows={4}
                  className="input w-full"
                  placeholder="Tell us about your experience..."
                ></textarea>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowFeedback(false);
                  setSelectedViewing(null);
                }
                className="flex-1 btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  submitFeedback(selectedViewing.id, {
                    rating: 4,
                    comments: 'Great property!',
                    interestedInProperty: true
                  });
                }
                className="flex-1 btn btn-primary"
              >
                Submit Feedback
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Main component with Suspense wrapper
const BuyerViewingsPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 23].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <BuyerViewingsPageContent />
    </Suspense>
  );
};

export default BuyerViewingsPage;