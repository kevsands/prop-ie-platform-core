'use client';

import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/useToast';
import { format, addMinutes, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';
import {
  Calendar as CalendarIcon,
  Video,
  Users,
  MapPin,
  Clock,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  User,
  Home,
  Car,
  Bus,
  Navigation,
  Wifi,
  Shield,
  Bell,
  Share2,
  Download,
  Settings
} from 'lucide-react';
import { useViewingSchedule } from '@/hooks/useViewingSchedule';
import { Property } from '@/types/property';
import { motion, AnimatePresence } from 'framer-motion';

interface ViewingSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  available: boolean;
  type: 'in-person' | 'virtual' | 'self-guided';
  bookedBy?: string;
  agent?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
}

interface ViewingType {
  id: 'in-person' | 'virtual' | 'self-guided';
  name: string;
  description: string;
  icon: React.ReactNode;
  duration: number;
  features: string[];
  requirements?: string[];
}

interface ViewingSchedulerProps {
  property: Property;
  onScheduled?: (viewing: any) => void;
  initialDate?: Date;
  showAgentAvailability?: boolean;
}

const viewingTypes: ViewingType[] = [
  {
    id: 'in-person',
    name: 'In-Person Viewing',
    description: 'Visit the property with an agent',
    icon: <Users size={24} />,
    duration: 30,
    features: [
      'Guided tour by property expert',
      'Real-time Q&A',
      'Full property access',
      'Personalized recommendations'
    ],
    requirements: ['Valid ID required', 'COVID-19 protocols apply']
  },
  {
    id: 'virtual',
    name: 'Virtual Viewing',
    description: 'Live video tour from anywhere',
    icon: <Video size={24} />,
    duration: 20,
    features: [
      'HD video tour',
      'Screen sharing',
      'Interactive walkthrough',
      'Recording available'
    ],
    requirements: ['Stable internet connection', 'Video-enabled device']
  },
  {
    id: 'self-guided',
    name: 'Self-Guided Tour',
    description: 'Explore at your own pace',
    icon: <Home size={24} />,
    duration: 60,
    features: [
      'Flexible timing',
      'AR/VR support',
      'Interactive floor plans',
      'Digital property guide'
    ],
    requirements: ['Mobile app download', 'Access code provided']
  }
];

export default function ViewingScheduler({
  property,
  onScheduled,
  initialDate = new Date(),
  showAgentAvailability = true
}: ViewingSchedulerProps) {
  const { toast } = useToast();
  const {
    availableSlots,
    bookedSlots,
    scheduleViewing,
    cancelViewing,
    rescheduleViewing,
    getAgentAvailability,
    loading,
    error
  } = useViewingSchedule(property.id);

  const [selectedDatesetSelectedDate] = useState<Date>(initialDate);
  const [selectedTypesetSelectedType] = useState<ViewingType>(viewingTypes[0]);
  const [selectedSlotsetSelectedSlot] = useState<ViewingSlot | null>(null);
  const [contactInfosetContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [showConfirmationsetShowConfirmation] = useState(false);
  const [schedulingProgresssetSchedulingProgress] = useState(0);

  // Filter available time slots for selected date
  const daySlots = availableSlots.filter(slot: any => {
    const slotStart = new Date(slot.startTime);
    return slotStart>= startOfDay(selectedDate) && slotStart <= endOfDay(selectedDate);
  });

  // Group slots by hour
  const slotsByHour = daySlots.reduce((acc: any, slot: any) => {
    const hour = format(new Date(slot.startTime), 'HH:00');
    if (!acc[hour]) acc[hour] = [];
    acc[hour].push(slot: any);
    return acc;
  }, {} as Record<string, ViewingSlot[]>);

  const handleTypeSelect = (type: ViewingType) => {
    setSelectedType(type);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot: ViewingSlot) => {
    if (slot.available) {
      setSelectedSlot(slot: any);
    }
  };

  const handleSchedule = async () => {
    if (!selectedSlot || !contactInfo.name || !contactInfo.email || !contactInfo.phone) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setSchedulingProgress(0);
    const progressInterval = setInterval(() => {
      setSchedulingProgress(prev => Math.min(prev + 1090));
    }, 200);

    try {
      const viewing = await scheduleViewing({
        propertyId: property.id,
        slotId: selectedSlot.id,
        type: selectedType.id,
        contactInfo,
        notes: contactInfo.message
      });

      setSchedulingProgress(100);
      clearInterval(progressInterval);

      setShowConfirmation(true);
      onScheduled?.(viewing);

      // Send confirmation email/SMS
      await fetch('/api/viewing-confirmations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          viewingId: viewing.id,
          email: contactInfo.email,
          phone: contactInfo.phone
        })
      });

      toast({
        title: 'Viewing Scheduled!',
        description: `Your ${selectedType.name} has been confirmed for ${format(
          new Date(selectedSlot.startTime),
          'PPpp'
        )}`
      });
    } catch (error) {
      clearInterval(progressInterval);
      toast({
        title: 'Scheduling Failed',
        description: 'Please try again or contact support',
        variant: 'destructive'
      });
    }
  };

  const handleShare = async () => {
    if (!selectedSlot) return;

    const shareData = {
      title: `Property Viewing - ${property.title}`,
      text: `I've scheduled a ${selectedType.name} for ${format(
        new Date(selectedSlot.startTime),
        'PPpp'
      )}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`
        );
        toast({
          title: 'Copied to clipboard',
          description: 'Viewing details copied successfully'
        });
      }
    } catch (error) {

    }
  };

  const handleDownloadCalendar = () => {
    if (!selectedSlot) return;

    const event = {
      title: `Property Viewing - ${property.title}`,
      start: selectedSlot.startTime,
      end: selectedSlot.endTime,
      description: `${selectedType.name} at ${property.address}`,
      location: property.address
    };

    // Create .ics file
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Property Viewing//EN
BEGIN:VEVENT
UID:${Date.now()}@propviewing.com
DTSTAMP:${format(new Date(), "yyyyMMdd'T'HHmmss'Z'")}
DTSTART:${format(new Date(event.start), "yyyyMMdd'T'HHmmss'Z'")}
DTEND:${format(new Date(event.end), "yyyyMMdd'T'HHmmss'Z'")}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'property-viewing.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar Section */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Select Viewing Date</CardTitle>
          <CardDescription>
            Choose a date and time for your property viewing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date: any) => date && setSelectedDate(date)}
                disabled={(date: any) => isBefore(date, new Date())}
                className="rounded-md border"
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Available Times</h3>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : daySlots.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No available slots for this date</p>
                  <p className="text-sm mt-2">Please select another date</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {Object.entries(slotsByHour).map(([hourslots]) => (
                    <div key={hour}>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        {hour}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {slots.map((slot: any) => (
                          <Button
                            key={slot.id}
                            variant={selectedSlot?.id === slot.id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleSlotSelect(slot: any)}
                            disabled={!slot.available}
                            className="justify-start"
                          >
                            <Clock size={16} className="mr-2" />
                            {format(new Date(slot.startTime), 'HH:mm')}
                            {!slot.available && (
                              <Badge variant="secondary" className="ml-auto">
                                Booked
                              </Badge>
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Viewing Type & Details */}
      <div className="space-y-6">
        {/* Viewing Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Viewing Type</CardTitle>
            <CardDescription>
              Choose how you'd like to view the property
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={selectedType.id} 
              onValueChange={(value: any) => {
                const type = viewingTypes.find(t => t.id === value);
                if (type) handleTypeSelect(type);
              }
            >
              {viewingTypes.map((type: any) => (
                <motion.div
                  key={type.id}
                  whileHover={ scale: 1.02 }
                  whileTap={ scale: 0.98 }
                  className="mb-4"
                >
                  <Label
                    htmlFor={type.id}
                    className="cursor-pointer block p-4 rounded-lg border-2 hover:border-primary transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value={type.id} id={type.id} />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {type.icon}
                          <span className="font-semibold">{type.name}</span>
                          <Badge variant="secondary">{type.duration} min</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {type.description}
                        </p>
                        <div className="space-y-1">
                          {type.features.map((featureindex: any) => (
                            <div key={index} className="flex items-center text-sm">
                              <CheckCircle2 size={16} className="mr-2 text-green-500" />
                              {feature}
                            </div>
                          ))}
                        </div>
                        {type.requirements && (
                          <div className="mt-3 pt-3 border-t">
                            {type.requirements.map((reqindex: any) => (
                              <div key={index} className="flex items-center text-sm text-muted-foreground">
                                <AlertCircle size={16} className="mr-2" />
                                {req}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Label>
                </motion.div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Contact Information */}
        {selectedSlot && (
          <motion.div
            initial={ opacity: 0, y: 20 }
            animate={ opacity: 1, y: 0 }
          >
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
                <CardDescription>
                  We'll send confirmation details to this information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={contactInfo.name}
                    onChange={(e: React.MouseEvent) => setContactInfo({ ...contactInfo, name: e.target.value })}
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactInfo.email}
                    onChange={(e: React.MouseEvent) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e: React.MouseEvent) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    placeholder="+353 1234567"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    value={contactInfo.message}
                    onChange={(e: React.MouseEvent) => setContactInfo({ ...contactInfo, message: e.target.value })}
                    placeholder="Any specific questions or requirements?"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Summary & Actions */}
      {selectedSlot && (
        <motion.div
          initial={ opacity: 0, y: 20 }
          animate={ opacity: 1, y: 0 }
          className="lg:col-span-3"
        >
          <Card>
            <CardHeader>
              <CardTitle>Viewing Summary</CardTitle>
              <CardDescription>
                Review your viewing details before confirming
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <Home size={16} className="mr-2" />
                    Property
                  </div>
                  <p className="font-semibold">{property.title}</p>
                  <p className="text-sm text-muted-foreground">{property.address}</p>
                </div>

                <div>
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <CalendarIcon size={16} className="mr-2" />
                    Date & Time
                  </div>
                  <p className="font-semibold">
                    {format(new Date(selectedSlot.startTime), 'PP')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(selectedSlot.startTime), 'p')} - 
                    {format(new Date(selectedSlot.endTime), 'p')}
                  </p>
                </div>

                <div>
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    {selectedType.icon}
                    <span className="ml-2">Type</span>
                  </div>
                  <p className="font-semibold">{selectedType.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedType.duration} minutes
                  </p>
                </div>

                {selectedSlot.agent && (
                  <div>
                    <div className="flex items-center text-sm text-muted-foreground mb-1">
                      <User size={16} className="mr-2" />
                      Agent
                    </div>
                    <p className="font-semibold">{selectedSlot.agent.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedSlot.agent.phone}
                    </p>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              {schedulingProgress> 0 && schedulingProgress <100 && (
                <div className="mb-6">
                  <Progress value={schedulingProgress} className="h-2" />
                  <p className="text-sm text-center mt-2 text-muted-foreground">
                    Scheduling your viewing...
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  onClick={handleSchedule}
                  disabled={schedulingProgress> 0 && schedulingProgress <100}
                  className="flex-1 md:flex-initial"
                >
                  <CheckCircle2 size={20} className="mr-2" />
                  Confirm Viewing
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleShare}
                >
                  <Share2 size={20} className="mr-2" />
                  Share
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleDownloadCalendar}
                >
                  <Download size={20} className="mr-2" />
                  Add to Calendar
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={ opacity: 0 }
            animate={ opacity: 1 }
            exit={ opacity: 0 }
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowConfirmation(false)}
          >
            <motion.div
              initial={ scale: 0.9, opacity: 0 }
              animate={ scale: 1, opacity: 1 }
              exit={ scale: 0.9, opacity: 0 }
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="text-green-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Viewing Confirmed!</h2>
                <p className="text-muted-foreground mb-6">
                  Your {selectedType.name} has been scheduled. We've sent confirmation
                  details to your email and phone.
                </p>

                <div className="space-y-3">
                  <Button
                    className="w-full"
                    onClick={() => {
                      setShowConfirmation(false);
                      handleDownloadCalendar();
                    }
                  >
                    <Download size={20} className="mr-2" />
                    Download Calendar Event
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setShowConfirmation(false);
                      handleShare();
                    }
                  >
                    <Share2 size={20} className="mr-2" />
                    Share Details
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setShowConfirmation(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}