import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

// Validation schemas
const alertCriteriaSchema = z.object({
  locations: z.array(z.string()).optional(),
  propertyTypes: z.array(z.enum(['apartment', 'house', 'townhouse', 'penthouse', 'studio', 'duplex'])).optional(),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
  bedroomsMin: z.number().optional(),
  bedroomsMax: z.number().optional(),
  bathroomsMin: z.number().optional(),
  bathroomsMax: z.number().optional(),
  areaMin: z.number().optional(),
  areaMax: z.number().optional(),
  features: z.array(z.string()).optional(),
  developers: z.array(z.string()).optional(),
  priceDropPercentage: z.number().optional(),
  daysOnMarket: z.number().optional(),
  keywords: z.array(z.string()).optional(),
  excludeKeywords: z.array(z.string()).optional()
});

const notificationChannelSchema = z.object({
  type: z.enum(['email', 'sms', 'push', 'in_app']),
  enabled: z.boolean(),
  settings: z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    sound: z.boolean().optional(),
    vibrate: z.boolean().optional()
  }).optional()
});

const createAlertSchema = z.object({
  name: z.string(),
  type: z.enum(['price_drop', 'new_listing', 'price_change', 'status_change', 'open_house', 'market_trend']),
  criteria: alertCriteriaSchema,
  frequency: z.enum(['instant', 'daily', 'weekly', 'monthly']),
  channels: z.array(notificationChannelSchema),
  priority: z.enum(['low', 'medium', 'high']),
  tags: z.array(z.string()).optional(),
  expiresAt: z.string().datetime().optional()
});

// GET: Fetch user's property alerts
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    const where: any = {
      userId: session.user.id
    };

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    const alerts = await prisma.propertyAlert.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { matches: true }
        }
      }
    });

    // Transform the data to match frontend expectations
    const formattedAlerts = alerts.map(alert => ({
      ...alert,
      triggerCount: alert._count.matches,
      criteria: alert.criteria as any,
      channels: alert.channels as any,
      tags: alert.tags || []
    }));

    return NextResponse.json(formattedAlerts);
  } catch (error) {
    console.error('Error fetching property alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property alerts' },
      { status: 500 }
    );
  }
}

// POST: Create a new property alert
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createAlertSchema.parse(body);

    // Check user's alert limit
    const existingAlertsCount = await prisma.propertyAlert.count({
      where: {
        userId: session.user.id,
        status: 'active'
      }
    });

    const userPlan = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true }
    });

    const alertLimit = userPlan?.plan === 'pro' ? 50 : 10;

    if (existingAlertsCount >= alertLimit) {
      return NextResponse.json(
        { error: `Alert limit reached. You can have up to ${alertLimit} active alerts.` },
        { status: 400 }
      );
    }

    // Create the alert
    const alert = await prisma.propertyAlert.create({
      data: {
        userId: session.user.id,
        name: validatedData.name,
        type: validatedData.type,
        criteria: validatedData.criteria as any,
        frequency: validatedData.frequency,
        channels: validatedData.channels as any,
        priority: validatedData.priority,
        tags: validatedData.tags,
        status: 'active',
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null
      }
    });

    // Schedule initial check for matching properties
    await scheduleAlertCheck(alert.id);

    // Send confirmation notification
    await sendAlertConfirmation(alert);

    return NextResponse.json(alert);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating property alert:', error);
    return NextResponse.json(
      { error: 'Failed to create property alert' },
      { status: 500 }
    );
  }
}

// PUT: Update a property alert
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const alertId = searchParams.get('id');

    if (!alertId) {
      return NextResponse.json({ error: 'Alert ID required' }, { status: 400 });
    }

    // Verify ownership
    const existingAlert = await prisma.propertyAlert.findFirst({
      where: {
        id: alertId,
        userId: session.user.id
      }
    });

    if (!existingAlert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = createAlertSchema.partial().parse(body);

    const updatedAlert = await prisma.propertyAlert.update({
      where: { id: alertId },
      data: {
        ...validatedData,
        criteria: validatedData.criteria as any,
        channels: validatedData.channels as any,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(updatedAlert);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating property alert:', error);
    return NextResponse.json(
      { error: 'Failed to update property alert' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a property alert
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const alertId = searchParams.get('id');

    if (!alertId) {
      return NextResponse.json({ error: 'Alert ID required' }, { status: 400 });
    }

    // Verify ownership
    const existingAlert = await prisma.propertyAlert.findFirst({
      where: {
        id: alertId,
        userId: session.user.id
      }
    });

    if (!existingAlert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    await prisma.propertyAlert.delete({
      where: { id: alertId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting property alert:', error);
    return NextResponse.json(
      { error: 'Failed to delete property alert' },
      { status: 500 }
    );
  }
}

// Helper function to schedule alert check
async function scheduleAlertCheck(alertId: string) {
  // In a production environment, this would integrate with a job queue
  // For now, we'll simulate immediate checking
  try {
    const alert = await prisma.propertyAlert.findUnique({
      where: { id: alertId }
    });

    if (!alert) return;

    // Check for matching properties based on criteria
    const matchingProperties = await findMatchingProperties(alert.criteria);

    if (matchingProperties.length > 0) {
      // Create alert matches
      const matches = await Promise.all(
        matchingProperties.map(property => 
          prisma.alertMatch.create({
            data: {
              alertId: alert.id,
              propertyId: property.id,
              matchType: alert.type,
              matchData: {
                price: property.price,
                priceChange: property.priceHistory?.[0]?.change || 0
              }
            }
          })
        )
      );

      // Send notifications
      await sendAlertNotifications(alert, matches);

      // Update last triggered
      await prisma.propertyAlert.update({
        where: { id: alertId },
        data: { lastTriggered: new Date() }
      });
    }
  } catch (error) {
    console.error('Error checking alert:', error);
  }
}

// Helper function to find matching properties
async function findMatchingProperties(criteria: any) {
  const where: any = {};

  if (criteria.locations?.length > 0) {
    where.location = { in: criteria.locations };
  }

  if (criteria.propertyTypes?.length > 0) {
    where.type = { in: criteria.propertyTypes };
  }

  if (criteria.priceMin || criteria.priceMax) {
    where.price = {};
    if (criteria.priceMin) where.price.gte = criteria.priceMin;
    if (criteria.priceMax) where.price.lte = criteria.priceMax;
  }

  if (criteria.bedroomsMin || criteria.bedroomsMax) {
    where.bedrooms = {};
    if (criteria.bedroomsMin) where.bedrooms.gte = criteria.bedroomsMin;
    if (criteria.bedroomsMax) where.bedrooms.lte = criteria.bedroomsMax;
  }

  if (criteria.bathroomsMin || criteria.bathroomsMax) {
    where.bathrooms = {};
    if (criteria.bathroomsMin) where.bathrooms.gte = criteria.bathroomsMin;
    if (criteria.bathroomsMax) where.bathrooms.lte = criteria.bathroomsMax;
  }

  if (criteria.areaMin || criteria.areaMax) {
    where.area = {};
    if (criteria.areaMin) where.area.gte = criteria.areaMin;
    if (criteria.areaMax) where.area.lte = criteria.areaMax;
  }

  if (criteria.features?.length > 0) {
    where.features = {
      hasEvery: criteria.features
    };
  }

  if (criteria.keywords?.length > 0) {
    where.OR = criteria.keywords.map(keyword => ({
      OR: [
        { title: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } }
      ]
    }));
  }

  const properties = await prisma.property.findMany({
    where,
    include: {
      development: true,
      priceHistory: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    },
    take: 50 // Limit results
  });

  return properties;
}

// Helper function to send alert notifications
async function sendAlertNotifications(alert: any, matches: any[]) {
  const enabledChannels = alert.channels.filter((channel: any) => channel.enabled);

  for (const channel of enabledChannels) {
    switch (channel.type) {
      case 'email':
        await sendEmailNotification(alert, matches);
        break;
      case 'push':
        await sendPushNotification(alert, matches);
        break;
      case 'sms':
        await sendSMSNotification(alert, matches);
        break;
      case 'in_app':
        await createInAppNotification(alert, matches);
        break;
    }
  }
}

// Helper function to send confirmation
async function sendAlertConfirmation(alert: any) {
  // Create in-app notification
  await prisma.notification.create({
    data: {
      userId: alert.userId,
      type: 'alert_created',
      title: 'Alert Created',
      message: `Your property alert "${alert.name}" has been created successfully`,
      data: {
        alertId: alert.id,
        alertType: alert.type
      }
    }
  });
}

// Notification helper functions (to be implemented)
async function sendEmailNotification(alert: any, matches: any[]) {
  // Email service integration
}

async function sendPushNotification(alert: any, matches: any[]) {
  // Push notification service integration
}

async function sendSMSNotification(alert: any, matches: any[]) {
  // SMS service integration
}

async function createInAppNotification(alert: any, matches: any[]) {
  // Create in-app notification
  await prisma.notification.create({
    data: {
      userId: alert.userId,
      type: 'alert_match',
      title: `New matches for ${alert.name}`,
      message: `Found ${matches.length} properties matching your criteria`,
      data: {
        alertId: alert.id,
        matchCount: matches.length,
        matches: matches.map(m => m.propertyId)
      }
    }
  });
}