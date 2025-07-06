'use client';

import { useState } from 'react';
import { MessageCircle, Phone, Video, Calendar, User, Star, Clock, Check, ChevronRight, ArrowRight, Award, Briefcase } from 'lucide-react';
import { format } from 'date-fns';

interface Advisor {
  id: string;
  name: string;
  title: string;
  specialization: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  image: string;
  bio: string;
  certifications: string[];
  languages: string[];
  availability: string;
  responseTime: string;
  successStories: number;
}

interface TimeSlot {
  id: string;
  date: Date;
  time: string;
  available: boolean;
}

export default function AdvisorPage() {
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [consultationType, setConsultationType] = useState<'video' | 'phone' | 'in-person'>('video');
  
  // Mock advisors data
  const advisors: Advisor[] = [
    {
      id: '1',
      name: 'Sarah O\'Connor',
      title: 'Senior Property Advisor',
      specialization: ['First-time buyers', 'Investment properties', 'New developments'],
      experience: 8,
      rating: 4.9,
      reviewCount: 127,
      image: '/images/advisors/sarah.jpg',
      bio: 'Specializing in helping first-time buyers navigate the Irish property market with confidence.',
      certifications: ['Certified Financial Planner', 'Property Investment Specialist'],
      languages: ['English', 'Irish'],
      availability: 'Mon-Fri 9am-6pm',
      responseTime: 'Usually within 2 hours',
      successStories: 250
    },
    {
      id: '2',
      name: 'Michael Kelly',
      title: 'Mortgage & Finance Expert',
      specialization: ['Mortgage advice', 'Help-to-Buy scheme', 'Financial planning'],
      experience: 12,
      rating: 4.8,
      reviewCount: 98,
      image: '/images/advisors/michael.jpg',
      bio: 'Expert in mortgage solutions and HTB applications, helping buyers secure the best financing.',
      certifications: ['QFA', 'Mortgage Advisor Certificate'],
      languages: ['English'],
      availability: 'Mon-Sat 8am-7pm',
      responseTime: 'Usually within 1 hour',
      successStories: 400
    },
    {
      id: '3',
      name: 'Emma Walsh',
      title: 'Legal & Compliance Advisor',
      specialization: ['Legal advice', 'Contract review', 'Property law'],
      experience: 10,
      rating: 4.9,
      reviewCount: 85,
      image: '/images/advisors/emma.jpg',
      bio: 'Ensuring smooth property transactions with expert legal guidance and contract expertise.',
      certifications: ['Solicitor', 'Property Law Specialist'],
      languages: ['English', 'French'],
      availability: 'Mon-Fri 9am-5pm',
      responseTime: 'Usually within 3 hours',
      successStories: 180
    }
  ];
  
  // Mock time slots
  const timeSlots: TimeSlot[] = [
    { id: '1', date: new Date(Date.now() + 24 * 60 * 60 * 1000), time: '09:00 AM', available: true },
    { id: '2', date: new Date(Date.now() + 24 * 60 * 60 * 1000), time: '10:00 AM', available: true },
    { id: '3', date: new Date(Date.now() + 24 * 60 * 60 * 1000), time: '11:00 AM', available: false },
    { id: '4', date: new Date(Date.now() + 24 * 60 * 60 * 1000), time: '2:00 PM', available: true },
    { id: '5', date: new Date(Date.now() + 24 * 60 * 60 * 1000), time: '3:00 PM', available: true },
    { id: '6', date: new Date(Date.now() + 24 * 60 * 60 * 1000), time: '4:00 PM', available: true }
  ];
  
  const handleBooking = () => {
    if (selectedAdvisor && selectedDate && selectedTime) {
      console.log('Booking:', {
        advisor: selectedAdvisor.name,
        date: selectedDate,
        time: selectedTime,
        type: consultationType
      });
    }
  };
  
  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Expert Property Advisors</h1>
          <p className="text-gray-600 mt-1">Get personalized guidance from our team of property experts</p>
        </div>
        
        {/* How it Works */}
        <div className="bg-blue-50 rounded-xl p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">How Expert Consultation Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3">
                1
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Choose an Advisor</h3>
              <p className="text-sm text-gray-600">Select based on expertise and availability</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3">
                2
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Book a Session</h3>
              <p className="text-sm text-gray-600">Choose your preferred time and consultation type</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3">
                3
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Get Expert Advice</h3>
              <p className="text-sm text-gray-600">Receive personalized guidance for your needs</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3">
                4
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Follow Up</h3>
              <p className="text-sm text-gray-600">Continue support throughout your journey</p>
            </div>
          </div>
        </div>
        
        {/* Advisors Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {advisors.map((advisor) => (
            <div 
              key={advisor.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setSelectedAdvisor(advisor)}
            >
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={advisor.image}
                    alt={advisor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{advisor.name}</h3>
                    <p className="text-sm text-gray-600">{advisor.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{advisor.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">({advisor.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{advisor.bio}</p>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Specializations:</p>
                    <div className="flex flex-wrap gap-2">
                      {advisor.specialization.map((spec, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{advisor.experience} years experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{advisor.successStories} success stories</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">{advisor.responseTime}</span>
                  </div>
                </div>
                
                <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Book Consultation
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Booking Modal */}
        {selectedAdvisor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Book Consultation with {selectedAdvisor.name}</h2>
                  <button
                    onClick={() => setSelectedAdvisor(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {/* Consultation Type */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Consultation Type</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => setConsultationType('video')}
                      className={`p-4 rounded-lg border transition-colors ${
                        consultationType === 'video' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Video className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                      <p className="font-medium">Video Call</p>
                    </button>
                    <button
                      onClick={() => setConsultationType('phone')}
                      className={`p-4 rounded-lg border transition-colors ${
                        consultationType === 'phone' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Phone className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                      <p className="font-medium">Phone Call</p>
                    </button>
                    <button
                      onClick={() => setConsultationType('in-person')}
                      className={`p-4 rounded-lg border transition-colors ${
                        consultationType === 'in-person' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <User className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                      <p className="font-medium">In Person</p>
                    </button>
                  </div>
                </div>
                
                {/* Date Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Date</h3>
                  <div className="grid grid-cols-7 gap-2">
                    {[...Array(7)].map((_, index) => {
                      const date = new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000);
                      return (
                        <button
                          key={index}
                          onClick={() => setSelectedDate(date)}
                          className={`p-3 rounded-lg text-center transition-colors ${
                            selectedDate?.toDateString() === date.toDateString()
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          <p className="text-xs">{format(date, 'EEE')}</p>
                          <p className="font-bold">{format(date, 'd')}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Time Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Times</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`p-3 rounded-lg transition-colors ${
                          selectedTime === slot.time
                            ? 'bg-blue-600 text-white'
                            : slot.available
                            ? 'bg-gray-100 hover:bg-gray-200'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Booking Summary */}
                {selectedDate && selectedTime && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Booking Summary</h3>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-600">
                        <span className="font-medium">Advisor:</span> {selectedAdvisor.name}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Date:</span> {format(selectedDate, 'EEEE, MMMM d')}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Time:</span> {selectedTime}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Type:</span> {consultationType}
                      </p>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={handleBooking}
                  disabled={!selectedDate || !selectedTime}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}