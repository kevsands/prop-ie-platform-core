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

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { developmentId, units, source = 'developer-portal' } = body;

    if (!developmentId || !Array.isArray(units)) {
      return NextResponse.json(
        { error: 'Development ID and units array are required' },
        { status: 400 }
      );
    }

    const now = new Date();
    const updates: AvailabilityUpdate[] = [];
    let syncedCount = 0;

    // Sync each unit from developer portal to availability system
    for (const unit of units) {
      const { id: unitId, status, price, unitNumber, reason } = unit;
      
      if (!unitId || !status) continue;

      const propertyId = `${developmentId}-unit-${unitId}`;
      const existingAvailability = propertyAvailability.get(propertyId);

      // Create or update property availability
      const newAvailability: PropertyAvailability = {
        propertyId,
        developmentId,
        unitNumber: unitNumber || unitId.toString(),
        status: status.toUpperCase(),
        price: price || (existingAvailability?.price ?? 0),
        statusChangedAt: !existingAvailability || status !== existingAvailability.status ? now : (existingAvailability.statusChangedAt ?? now),
        priceChangedAt: !existingAvailability || price !== existingAvailability.price ? now : existingAvailability.priceChangedAt,
        lastUpdated: now,
        buyerInterest: existingAvailability?.buyerInterest ?? 0,
        viewingCount: existingAvailability?.viewingCount ?? 0,
        salesAgent: existingAvailability?.salesAgent || 'Developer Portal',
        reason: reason || `Synced from ${source}`
      };

      // Add urgency based on status
      if (status === 'RESERVED') {
        newAvailability.urgency = 'high';
        newAvailability.reservedUntil = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      } else if (status === 'SALE_AGREED') {
        newAvailability.urgency = 'urgent';
      }

      propertyAvailability.set(propertyId, newAvailability);

      // Track status changes
      if (existingAvailability && status !== existingAvailability.status) {
        updates.push({
          propertyId,
          developmentId,
          updateType: 'STATUS_CHANGE',
          oldValue: existingAvailability.status,
          newValue: status.toUpperCase(),
          timestamp: now,
          reason: reason || `Developer portal sync from ${source}`,
          agent: 'System Sync'
        });
      }

      // Track price changes
      if (existingAvailability && price && price !== existingAvailability.price) {
        updates.push({
          propertyId,
          developmentId,
          updateType: 'PRICE_CHANGE',
          oldValue: existingAvailability.price,
          newValue: price,
          timestamp: now,
          reason: reason || `Price updated via ${source}`,
          agent: 'System Sync'
        });
      }

      syncedCount++;
    }

    // Add all updates to the global updates array
    availabilityUpdates.unshift(...updates);

    // Update development stats
    updateDevelopmentStats(developmentId);

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${syncedCount} units from ${source}`,
      syncedUnits: syncedCount,
      updates: updates,
      developmentId,
      source,
      timestamp: now.toISOString()
    });

  } catch (error) {
    console.error('Error syncing developer portal data:', error);
    return NextResponse.json(
      { error: 'Failed to sync developer portal data' },
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

// Initialize with REAL BUSINESS DATA - Current Inventory as of June 2025
if (process.env.NODE_ENV === 'development') {
  const actualProperties: PropertyAvailability[] = [];
  
  // === FITZGERALD GARDENS PHASE 1 - ACTIVE SALES ===
  // 27 units built, 12 sold to government, 15 available for public sale
  for (let i = 1; i <= 27; i++) {
    const unitNumber = `FG-P1-${i.toString().padStart(3, '0')}`;
    const isGovernmentSold = i <= 12; // Units 1-12 sold to government
    const unitType = i <= 9 ? '1-bed' : (i <= 18 ? '2-bed' : '3-bed penthouse');
    const basePrice = i <= 9 ? 320000 : (i <= 18 ? 420000 : 520000);
    
    actualProperties.push({
      propertyId: `fitzgerald-gardens-unit-${i}`,
      developmentId: 'fitzgerald-gardens',
      unitNumber,
      status: isGovernmentSold ? 'SOLD' : 'AVAILABLE',
      price: basePrice,
      statusChangedAt: isGovernmentSold ? new Date('2024-06-01') : new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      lastUpdated: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      buyerInterest: isGovernmentSold ? 0 : Math.floor(Math.random() * 8) + 2, // Active interest for available units
      viewingCount: isGovernmentSold ? 0 : Math.floor(Math.random() * 15) + 5,
      salesAgent: isGovernmentSold ? 'Government Housing Scheme' : ['Sarah Murphy', 'Michael O\'Brien', 'Emma Walsh'][Math.floor(Math.random() * 3)],
      urgency: isGovernmentSold ? undefined : (i > 24 ? 'high' : (['low', 'medium'] as const)[Math.floor(Math.random() * 2)]) // Penthouses are high priority
    });
  }
  
  // === BALLYMAKENNY VIEW - FINAL UNIT ===
  // Only 1 unit remaining from the development
  actualProperties.push({
    propertyId: 'ballymakenny-view-unit-16',
    developmentId: 'ballymakenny-view', 
    unitNumber: 'BV-016',
    status: 'AVAILABLE',
    price: 450000, // Premium for last unit
    statusChangedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000),
    buyerInterest: 12, // High interest for last unit
    viewingCount: 28,
    salesAgent: 'Emma Walsh',
    urgency: 'urgent' // Last unit available
  });
  
  // NOTE: Ellwood is SOLD OUT - no units added to availability system
  
  const demoProperties = actualProperties;

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