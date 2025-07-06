import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { startOfDay, endOfDay, addMinutes, setHours, setMinutes } from 'date-fns';

// Request validation schemas
const getViewingSlotsSchema = z.object({
  propertyId: z.string(),
  date: z.string().datetime(),
  type: z.enum(['in-person', 'virtual', 'self-guided']).optional(),
  agentId: z.string().optional()
});

const bookViewingSlotSchema = z.object({
  propertyId: z.string(),
  slotId: z.string(),
  type: z.enum(['in-person', 'virtual', 'self-guided']),
  contactInfo: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    message: z.string().optional()
  }),
  notes: z.string().optional(),
  preferences: z.object({
    language: z.string().optional(),
    accessibility: z.array(z.string()).optional(),
    specialRequests: z.string().optional()
  }).optional()
});

// GET: Fetch available viewing slots
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = {
      propertyId: searchParams.get('propertyId'),
      date: searchParams.get('date'),
      type: searchParams.get('type'),
      agentId: searchParams.get('agentId')
    };

    // Validate request
    const validatedParams = getViewingSlotsSchema.parse(params);
    const selectedDate = new Date(validatedParams.date);
    const dayStart = startOfDay(selectedDate);
    const dayEnd = endOfDay(selectedDate);

    // Get property details
    const property = await prisma.property.findUnique({
      where: { id: validatedParams.propertyId },
      include: {
        development: true,
        unit: true
      }
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Get existing bookings for the day
    const existingBookings = await prisma.viewingSlot.findMany({
      where: {
        propertyId: validatedParams.propertyId,
        startTime: {
          gte: dayStart,
          lte: dayEnd
        }
      }
    });

    // Generate available time slots
    const slots = generateTimeSlots(
      selectedDate,
      property,
      existingBookings,
      validatedParams.type,
      validatedParams.agentId
    );

    return NextResponse.json(slots);
  } catch (error) {
    console.error('Error fetching viewing slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch viewing slots' },
      { status: 500 }
    );
  }
}

// POST: Book a viewing slot
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = bookViewingSlotSchema.parse(body);

    // Check if slot is still available
    const existingBooking = await prisma.viewingSlot.findFirst({
      where: {
        id: validatedData.slotId,
        propertyId: validatedData.propertyId,
        status: 'available'
      }
    });

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Slot is no longer available' },
        { status: 400 }
      );
    }

    // Create the viewing booking
    const viewing = await prisma.viewing.create({
      data: {
        propertyId: validatedData.propertyId,
        userId: session.user.id,
        slotId: validatedData.slotId,
        type: validatedData.type,
        status: 'scheduled',
        contactName: validatedData.contactInfo.name,
        contactEmail: validatedData.contactInfo.email,
        contactPhone: validatedData.contactInfo.phone,
        message: validatedData.contactInfo.message,
        notes: validatedData.notes,
        preferences: validatedData.preferences,
        scheduledDate: existingBooking.startTime
      },
      include: {
        property: true,
        slot: {
          include: {
            agent: true
          }
        }
      }
    });

    // Update slot status
    await prisma.viewingSlot.update({
      where: { id: validatedData.slotId },
      data: {
        status: 'booked',
        bookedBy: session.user.id
      }
    });

    // Send confirmation email
    await sendViewingConfirmation(viewing);

    // Create calendar event
    const calendarEvent = await createCalendarEvent(viewing);

    // Create notification
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: 'viewing_scheduled',
        title: 'Viewing Scheduled',
        message: `Your ${validatedData.type} viewing for ${viewing.property.title} has been confirmed`,
        data: {
          viewingId: viewing.id,
          propertyId: viewing.propertyId
        }
      }
    });

    return NextResponse.json({
      viewing,
      calendarEvent
    });
  } catch (error) {
    console.error('Error booking viewing slot:', error);
    return NextResponse.json(
      { error: 'Failed to book viewing slot' },
      { status: 500 }
    );
  }
}

// Helper function to generate time slots
function generateTimeSlots(
  date: Date,
  property: any,
  existingBookings: any[],
  type?: string,
  agentId?: string
) {
  const slots = [];
  const workingHours = {
    start: 9,
    end: 18,
    lunchStart: 13,
    lunchEnd: 14
  };

  // Duration based on viewing type
  const durations = {
    'in-person': 30,
    'virtual': 20,
    'self-guided': 60
  };

  const duration = type ? durations[type] : 30;
  let currentTime = setHours(setMinutes(date, 0), workingHours.start);
  const endTime = setHours(setMinutes(date, 0), workingHours.end);

  while (currentTime < endTime) {
    const slotEndTime = addMinutes(currentTime, duration);
    
    // Skip lunch hours
    const isLunchTime = 
      currentTime.getHours() >= workingHours.lunchStart &&
      currentTime.getHours() < workingHours.lunchEnd;

    // Check if slot conflicts with existing bookings
    const hasConflict = existingBookings.some(booking => {
      const bookingStart = new Date(booking.startTime);
      const bookingEnd = new Date(booking.endTime);
      return (
        (currentTime >= bookingStart && currentTime < bookingEnd) ||
        (slotEndTime > bookingStart && slotEndTime <= bookingEnd)
      );
    });

    if (!isLunchTime && !hasConflict) {
      // Get available agents for this slot
      const availableAgents = agentId 
        ? [{ id: agentId, name: 'Assigned Agent' }]
        : getAvailableAgents(currentTime, slotEndTime);

      slots.push({
        id: `slot-${currentTime.getTime()}`,
        propertyId: property.id,
        startTime: currentTime,
        endTime: slotEndTime,
        available: true,
        type: type || 'in-person',
        status: 'available',
        agents: availableAgents
      });
    }

    currentTime = slotEndTime;
  }

  return slots;
}

// Helper function to get available agents
async function getAvailableAgents(startTime: Date, endTime: Date) {
  // This would query agent availability in a real implementation
  return [
    { id: 'agent1', name: 'John Smith', avatar: '/avatars/john.jpg' },
    { id: 'agent2', name: 'Sarah Johnson', avatar: '/avatars/sarah.jpg' }
  ];
}

// Helper function to send viewing confirmation
async function sendViewingConfirmation(viewing: any) {
  // Implementation for sending confirmation email
  // This would integrate with your email service
  console.log('Sending viewing confirmation for:', viewing.id);
}

// Helper function to create calendar event
async function createCalendarEvent(viewing: any) {
  const event = {
    title: `Property Viewing - ${viewing.property.title}`,
    start: viewing.slot.startTime,
    end: viewing.slot.endTime,
    description: `${viewing.type} viewing at ${viewing.property.address}`,
    location: viewing.property.address,
    attendees: [
      viewing.contactEmail,
      viewing.slot.agent?.email
    ].filter(Boolean)
  };

  // This would integrate with calendar service (Google Calendar, etc.)
  console.log('Creating calendar event:', event);
  
  return event;
}