import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from './useToast';
import { format, addDays, setHours, setMinutes } from 'date-fns';

interface ViewingSlot {
  id: string;
  propertyId: string;
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
  status: 'available' | 'booked' | 'blocked' | 'tentative';
  notes?: string;
  metadata?: Record<string, any>;
}

interface BookingInfo {
  propertyId: string;
  slotId: string;
  type: 'in-person' | 'virtual' | 'self-guided';
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    message?: string;
  };
  notes?: string;
  preferences?: {
    language?: string;
    accessibility?: string[];
    specialRequests?: string;
  };
}

interface ViewingScheduleConfig {
  propertyId: string;
  startDate?: Date;
  endDate?: Date;
  types?: string[];
  agentId?: string;
}

export function useViewingSchedule(propertyId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch available viewing slots
  const { data: availableSlots = [], isLoading: loadingSlots, error: slotsError } = useQuery({
    queryKey: ['viewing-slots', propertyId, selectedDate],
    queryFn: async () => {
      const response = await fetch(`/api/viewing-slots?propertyId=${propertyId}&date=${format(selectedDate, 'yyyy-MM-dd')}`);
      if (!response.ok) throw new Error('Failed to fetch slots');
      return response.json();
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000 // 1 minute
  });

  // Fetch booked slots for the property
  const { data: bookedSlots = [], isLoading: loadingBooked } = useQuery({
    queryKey: ['booked-slots', propertyId],
    queryFn: async () => {
      const response = await fetch(`/api/viewing-slots/booked?propertyId=${propertyId}`);
      if (!response.ok) throw new Error('Failed to fetch booked slots');
      return response.json();
    }
  });

  // Schedule a viewing
  const scheduleViewing = useMutation({
    mutationFn: async (booking: BookingInfo) => {
      const response = await fetch('/api/viewing-slots/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      });
      if (!response.ok) throw new Error('Failed to schedule viewing');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['viewing-slots'] });
      queryClient.invalidateQueries({ queryKey: ['booked-slots'] });
      toast({
        title: 'Viewing Scheduled',
        description: 'Your viewing has been successfully scheduled'
      });
    },
    onError: (error) => {
      toast({
        title: 'Scheduling Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Cancel a viewing
  const cancelViewing = useMutation({
    mutationFn: async (viewingId: string) => {
      const response = await fetch(`/api/viewing-slots/cancel/${viewingId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to cancel viewing');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['viewing-slots'] });
      queryClient.invalidateQueries({ queryKey: ['booked-slots'] });
      toast({
        title: 'Viewing Cancelled',
        description: 'Your viewing has been cancelled'
      });
    }
  });

  // Reschedule a viewing
  const rescheduleViewing = useMutation({
    mutationFn: async ({ viewingId, newSlotId }: { viewingId: string; newSlotId: string }) => {
      const response = await fetch(`/api/viewing-slots/reschedule/${viewingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newSlotId })
      });
      if (!response.ok) throw new Error('Failed to reschedule viewing');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['viewing-slots'] });
      queryClient.invalidateQueries({ queryKey: ['booked-slots'] });
      toast({
        title: 'Viewing Rescheduled',
        description: 'Your viewing has been rescheduled'
      });
    }
  });

  // Get agent availability
  const getAgentAvailability = useCallback(async (agentId: string, date: Date) => {
    try {
      const response = await fetch(`/api/agents/${agentId}/availability?date=${format(date, 'yyyy-MM-dd')}`);
      if (!response.ok) throw new Error('Failed to fetch agent availability');
      return response.json();
    } catch (error) {
      console.error('Error fetching agent availability:', error);
      return [];
    }
  }, []);

  // Generate time slots for a specific date
  const generateTimeSlots = useCallback((date: Date, duration: number = 30) => {
    const slots: Omit<ViewingSlot, 'id'>[] = [];
    const workingHours = {
      start: 9,
      end: 18,
      lunchStart: 13,
      lunchEnd: 14
    };

    let currentTime = setHours(setMinutes(date, 0), workingHours.start);
    const endTime = setHours(setMinutes(date, 0), workingHours.end);

    while (currentTime < endTime) {
      const slotEndTime = new Date(currentTime.getTime() + duration * 60000);
      
      // Skip lunch hours
      const isLunchTime = 
        currentTime.getHours() >= workingHours.lunchStart &&
        currentTime.getHours() < workingHours.lunchEnd;

      if (!isLunchTime) {
        slots.push({
          propertyId,
          startTime: currentTime,
          endTime: slotEndTime,
          available: true,
          type: 'in-person',
          status: 'available'
        });
      }

      currentTime = slotEndTime;
    }

    return slots;
  }, [propertyId]);

  // Check for conflicts
  const hasConflict = useCallback((slot: ViewingSlot, existingBookings: ViewingSlot[]) => {
    return existingBookings.some(booking => {
      const slotStart = new Date(slot.startTime);
      const slotEnd = new Date(slot.endTime);
      const bookingStart = new Date(booking.startTime);
      const bookingEnd = new Date(booking.endTime);

      return (
        (slotStart >= bookingStart && slotStart < bookingEnd) ||
        (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
        (slotStart <= bookingStart && slotEnd >= bookingEnd)
      );
    });
  }, []);

  // Get next available slot
  const getNextAvailableSlot = useCallback(() => {
    const now = new Date();
    const futureSlots = availableSlots
      .filter(slot => new Date(slot.startTime) > now && slot.available)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    
    return futureSlots[0] || null;
  }, [availableSlots]);

  // Batch schedule multiple viewings
  const batchScheduleViewings = useMutation({
    mutationFn: async (bookings: BookingInfo[]) => {
      const response = await fetch('/api/viewing-slots/batch-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookings })
      });
      if (!response.ok) throw new Error('Failed to schedule viewings');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['viewing-slots'] });
      queryClient.invalidateQueries({ queryKey: ['booked-slots'] });
      toast({
        title: 'Viewings Scheduled',
        description: `${data.scheduled.length} viewings scheduled successfully`
      });
    }
  });

  // Get viewing statistics
  const { data: stats } = useQuery({
    queryKey: ['viewing-stats', propertyId],
    queryFn: async () => {
      const response = await fetch(`/api/viewing-slots/stats?propertyId=${propertyId}`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
    staleTime: 300000 // 5 minutes
  });

  // Send reminders
  const sendReminder = useMutation({
    mutationFn: async (viewingId: string) => {
      const response = await fetch(`/api/viewing-slots/reminder/${viewingId}`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to send reminder');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Reminder Sent',
        description: 'Viewing reminder sent successfully'
      });
    }
  });

  // Virtual viewing setup
  const setupVirtualViewing = useMutation({
    mutationFn: async (viewingId: string) => {
      const response = await fetch(`/api/viewing-slots/virtual-setup/${viewingId}`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to setup virtual viewing');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Virtual Viewing Ready',
        description: 'Virtual viewing room created successfully'
      });
      return data;
    }
  });

  // Export calendar
  const exportToCalendar = useCallback(async (viewingId: string) => {
    try {
      const response = await fetch(`/api/viewing-slots/export/${viewingId}`);
      if (!response.ok) throw new Error('Failed to export');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `viewing-${viewingId}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export calendar event',
        variant: 'destructive'
      });
    }
  }, [toast]);

  return {
    availableSlots,
    bookedSlots,
    scheduleViewing: scheduleViewing.mutate,
    cancelViewing: cancelViewing.mutate,
    rescheduleViewing: rescheduleViewing.mutate,
    getAgentAvailability,
    generateTimeSlots,
    hasConflict,
    getNextAvailableSlot,
    batchScheduleViewings: batchScheduleViewings.mutate,
    sendReminder: sendReminder.mutate,
    setupVirtualViewing: setupVirtualViewing.mutate,
    exportToCalendar,
    stats,
    loading: loadingSlots || loadingBooked,
    error: slotsError,
    selectedDate,
    setSelectedDate
  };
}