import { NextRequest, NextResponse } from 'next/server';

interface PropertyAvailability {
  propertyId: string;
  status: 'AVAILABLE' | 'RESERVED' | 'SALE_AGREED' | 'SOLD' | 'WITHDRAWN';
  price: number;
  priceChangedAt?: Date;
  statusChangedAt: Date;
  lastUpdated: Date;
  reservedUntil?: Date;
  salesAgent?: string;
  buyerInterest: number;
  viewingCount: number;
  developmentId: string;
  unitNumber: string;
  urgency?: 'low' | 'medium' | 'high' | 'urgent';
  reason?: string;
}

interface AvailabilityUpdate {
  propertyId: string;
  developmentId: string;
  updateType: 'STATUS_CHANGE' | 'PRICE_CHANGE' | 'INTEREST_UPDATE' | 'VIEWING_SCHEDULED' | 'URGENT_ACTION';
  oldValue?: string | number;
  newValue: string | number;
  timestamp: Date;
  reason?: string;
  agent?: string;
  buyerId?: string;
}

interface DevelopmentAvailabilityStats {
  developmentId: string;
  developmentName: string;
  totalUnits: number;
  available: number;
  reserved: number;
  saleAgreed: number;
  sold: number;
  withdrawn: number;
  averagePrice: number;
  priceRange: { min: number; max: number };
  lastUpdate: Date;
  recentActivity: AvailabilityUpdate[];
}

// In-memory storage for real-time updates (replace with Redis/database in production)
const propertyAvailability: Map<string, PropertyAvailability> = new Map();
const availabilityUpdates: AvailabilityUpdate[] = [];
const developmentStats: Map<string, DevelopmentAvailabilityStats> = new Map();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const developmentId = searchParams.get('developmentId');
    const status = searchParams.get('status');
    const lastUpdate = searchParams.get('since');
    const includeUpdates = searchParams.get('includeUpdates') === 'true';
    const includeStats = searchParams.get('includeStats') === 'true';

    // Get single property availability
    if (propertyId) {
      const availability = propertyAvailability.get(propertyId);
      if (!availability) {
        return NextResponse.json(
          { error: 'Property not found' },
          { status: 404 }
        );
      }

      const response = {
        property: availability,
        ...(includeUpdates && {
          recentUpdates: availabilityUpdates
            .filter(update => update.propertyId === propertyId)
            .slice(0, 10)
        })
      };

      return NextResponse.json(response);
    }

    // Get development availability overview
    if (developmentId) {
      const devStats = developmentStats.get(developmentId);
      if (!devStats) {
        return NextResponse.json(
          { error: 'Development not found' },
          { status: 404 }
        );
      }

      // Get all properties in development
      const devProperties = Array.from(propertyAvailability.values())
        .filter(prop => prop.developmentId === developmentId);

      // Filter by status if specified
      const filteredProperties = status 
        ? devProperties.filter(prop => prop.status === status)
        : devProperties;

      const response = {
        development: devStats,
        properties: filteredProperties,
        ...(includeUpdates && {
          recentUpdates: availabilityUpdates
            .filter(update => update.developmentId === developmentId)
            .slice(0, 20)
        })
      };

      return NextResponse.json(response);
    }

    // Get all properties with filtering
    let properties = Array.from(propertyAvailability.values());

    // Filter by status
    if (status) {
      properties = properties.filter(prop => prop.status === status);
    }

    // Filter by last update (for polling)
    if (lastUpdate) {
      const sinceDate = new Date(lastUpdate);
      properties = properties.filter(prop => prop.lastUpdated > sinceDate);
    }

    // Sort by last updated (newest first)
    properties.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());

    // Get recent updates if requested
    let recentUpdates: AvailabilityUpdate[] = [];
    if (includeUpdates) {
      recentUpdates = lastUpdate 
        ? availabilityUpdates.filter(update => update.timestamp > new Date(lastUpdate))
        : availabilityUpdates.slice(0, 50);
    }

    // Get global stats if requested
    let globalStats: any = {};
    if (includeStats) {
      globalStats = {
        totalProperties: properties.length,
        statusDistribution: {
          available: properties.filter(p => p.status === 'AVAILABLE').length,
          reserved: properties.filter(p => p.status === 'RESERVED').length,
          saleAgreed: properties.filter(p => p.status === 'SALE_AGREED').length,
          sold: properties.filter(p => p.status === 'SOLD').length,
          withdrawn: properties.filter(p => p.status === 'WITHDRAWN').length,
        },
        averagePrice: properties.length > 0 
          ? Math.round(properties.reduce((sum, p) => sum + p.price, 0) / properties.length)
          : 0,
        priceRange: properties.length > 0 
          ? {
              min: Math.min(...properties.map(p => p.price)),
              max: Math.max(...properties.map(p => p.price))
            }
          : { min: 0, max: 0 },
        recentActivity: availabilityUpdates.slice(0, 20)
      };
    }

    const response = {
      properties,
      count: properties.length,
      lastPolled: new Date().toISOString(),
      ...(includeUpdates && { recentUpdates }),
      ...(includeStats && { statistics: globalStats })
    };

    // Add cache headers for real-time polling
    const headers = new Headers();
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers.set('Content-Type', 'application/json');

    return NextResponse.json(response, { headers });

  } catch (error) {
    console.error('Error fetching property availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property availability' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyId, developmentId, unitNumber, status, price, reason, agent } = body;

    if (!propertyId || !developmentId) {
      return NextResponse.json(
        { error: 'Property ID and Development ID are required' },
        { status: 400 }
      );
    }

    const currentAvailability = propertyAvailability.get(propertyId);
    const now = new Date();

    // Create or update property availability
    const newAvailability: PropertyAvailability = {
      propertyId,
      developmentId,
      unitNumber: unitNumber || (currentAvailability?.unitNumber ?? 'N/A'),
      status: status || 'AVAILABLE',
      price: price || (currentAvailability?.price ?? 0),
      statusChangedAt: status && status !== currentAvailability?.status ? now : (currentAvailability?.statusChangedAt ?? now),
      priceChangedAt: price && price !== currentAvailability?.price ? now : currentAvailability?.priceChangedAt,
      lastUpdated: now,
      buyerInterest: currentAvailability?.buyerInterest ?? 0,
      viewingCount: currentAvailability?.viewingCount ?? 0,
      salesAgent: agent || currentAvailability?.salesAgent,
      reason
    };

    // Add urgency based on status
    if (status === 'RESERVED') {
      newAvailability.urgency = 'high';
      newAvailability.reservedUntil = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
    } else if (status === 'SALE_AGREED') {
      newAvailability.urgency = 'urgent';
    }

    propertyAvailability.set(propertyId, newAvailability);

    // Create update record
    const updates: AvailabilityUpdate[] = [];

    if (currentAvailability && status && status !== currentAvailability.status) {
      updates.push({
        propertyId,
        developmentId,
        updateType: 'STATUS_CHANGE',
        oldValue: currentAvailability.status,
        newValue: status,
        timestamp: now,
        reason,
        agent
      });
    }

    if (currentAvailability && price && price !== currentAvailability.price) {
      updates.push({
        propertyId,
        developmentId,
        updateType: 'PRICE_CHANGE',
        oldValue: currentAvailability.price,
        newValue: price,
        timestamp: now,
        reason,
        agent
      });
    }

    availabilityUpdates.unshift(...updates);

    // Update development stats
    updateDevelopmentStats(developmentId);

    return NextResponse.json({
      success: true,
      property: newAvailability,
      updates,
      message: 'Property availability updated successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error updating property availability:', error);
    return NextResponse.json(
      { error: 'Failed to update property availability' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyId, action, buyerId, agent } = body;

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    const availability = propertyAvailability.get(propertyId);
    if (!availability) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    const now = new Date();
    let updateType: AvailabilityUpdate['updateType'] = 'INTEREST_UPDATE';
    let newValue: string | number = '';
    let reason = '';

    switch (action) {
      case 'viewing_scheduled':
        availability.viewingCount += 1;
        availability.lastUpdated = now;
        updateType = 'VIEWING_SCHEDULED';
        newValue = availability.viewingCount;
        reason = 'Viewing scheduled';
        break;

      case 'interest_expressed':
        availability.buyerInterest += 1;
        availability.lastUpdated = now;
        updateType = 'INTEREST_UPDATE';
        newValue = availability.buyerInterest;
        reason = 'Buyer interest expressed';
        break;

      case 'urgent_action':
        availability.urgency = 'urgent';
        availability.lastUpdated = now;
        updateType = 'URGENT_ACTION';
        newValue = 'urgent';
        reason = body.reason || 'Urgent action required';
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    propertyAvailability.set(propertyId, availability);

    // Create update record
    const update: AvailabilityUpdate = {
      propertyId,
      developmentId: availability.developmentId,
      updateType,
      newValue,
      timestamp: now,
      reason,
      agent,
      buyerId
    };

    availabilityUpdates.unshift(update);

    // Update development stats
    updateDevelopmentStats(availability.developmentId);

    return NextResponse.json({
      success: true,
      property: availability,
      update,
      message: `Property ${action} recorded successfully`
    });

  } catch (error) {
    console.error('Error updating property activity:', error);
    return NextResponse.json(
      { error: 'Failed to update property activity' },
      { status: 500 }
    );
  }
}

function updateDevelopmentStats(developmentId: string) {
  const devProperties = Array.from(propertyAvailability.values())
    .filter(prop => prop.developmentId === developmentId);

  if (devProperties.length === 0) return;

  const stats: DevelopmentAvailabilityStats = {
    developmentId,
    developmentName: getDevelopmentName(developmentId),
    totalUnits: devProperties.length,
    available: devProperties.filter(p => p.status === 'AVAILABLE').length,
    reserved: devProperties.filter(p => p.status === 'RESERVED').length,
    saleAgreed: devProperties.filter(p => p.status === 'SALE_AGREED').length,
    sold: devProperties.filter(p => p.status === 'SOLD').length,
    withdrawn: devProperties.filter(p => p.status === 'WITHDRAWN').length,
    averagePrice: Math.round(devProperties.reduce((sum, p) => sum + p.price, 0) / devProperties.length),
    priceRange: {
      min: Math.min(...devProperties.map(p => p.price)),
      max: Math.max(...devProperties.map(p => p.price))
    },
    lastUpdate: new Date(),
    recentActivity: availabilityUpdates
      .filter(update => update.developmentId === developmentId)
      .slice(0, 10)
  };

  developmentStats.set(developmentId, stats);
}

function getDevelopmentName(developmentId: string): string {
  const nameMap: { [key: string]: string } = {
    'fitzgerald-gardens': 'Fitzgerald Gardens',
    'ellwood': 'Ellwood Heights',
    'ballymakenny-view': 'Ballymakenny View',
    'phoenix-park-residences': 'Phoenix Park Residences',
    'riverside-gardens': 'Riverside Gardens',
    'city-centre-heights': 'City Centre Heights'
  };
  return nameMap[developmentId] || 'Unknown Development';
}

// Initialize with demo data for development
if (process.env.NODE_ENV === 'development') {
  // Add demo property availability data
  const demoProperties: PropertyAvailability[] = [
    {
      propertyId: 'fitzgerald-unit-12',
      developmentId: 'fitzgerald-gardens',
      unitNumber: '12',
      status: 'AVAILABLE',
      price: 385000,
      statusChangedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      lastUpdated: new Date(Date.now() - 30 * 60 * 1000),
      buyerInterest: 3,
      viewingCount: 7,
      salesAgent: 'Sarah Murphy',
      urgency: 'medium'
    },
    {
      propertyId: 'ellwood-unit-8',
      developmentId: 'ellwood',
      unitNumber: '8',
      status: 'RESERVED',
      price: 420000,
      statusChangedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000),
      reservedUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      buyerInterest: 5,
      viewingCount: 12,
      salesAgent: 'Michael O\'Brien',
      urgency: 'high'
    },
    {
      propertyId: 'ballymakenny-unit-5',
      developmentId: 'ballymakenny-view',
      unitNumber: '5',
      status: 'SALE_AGREED',
      price: 365000,
      statusChangedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000),
      buyerInterest: 8,
      viewingCount: 15,
      salesAgent: 'Emma Walsh',
      urgency: 'urgent'
    }
  ];

  demoProperties.forEach(prop => {
    propertyAvailability.set(prop.propertyId, prop);
    updateDevelopmentStats(prop.developmentId);
  });

  // Add demo update history
  const demoUpdates: AvailabilityUpdate[] = [
    {
      propertyId: 'ballymakenny-unit-5',
      developmentId: 'ballymakenny-view',
      updateType: 'STATUS_CHANGE',
      oldValue: 'RESERVED',
      newValue: 'SALE_AGREED',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      reason: 'Sale agreed with buyer',
      agent: 'Emma Walsh'
    },
    {
      propertyId: 'ellwood-unit-8',
      developmentId: 'ellwood',
      updateType: 'STATUS_CHANGE',
      oldValue: 'AVAILABLE',
      newValue: 'RESERVED',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      reason: 'Property reserved pending mortgage approval',
      agent: 'Michael O\'Brien'
    },
    {
      propertyId: 'fitzgerald-unit-12',
      developmentId: 'fitzgerald-gardens',
      updateType: 'VIEWING_SCHEDULED',
      newValue: 7,
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      reason: 'Viewing scheduled for this weekend',
      agent: 'Sarah Murphy'
    }
  ];

  availabilityUpdates.push(...demoUpdates);
}