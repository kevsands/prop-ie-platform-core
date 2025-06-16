import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-server';
import prisma from '@/lib/prisma';
import { PropertyStatus, PropertyType } from '@/types/enums';
import { 
  PropertyFilters, 
  PropertyListResponse, 
  PropertyAggregations,
  Property 
} from '@/types/models/property';
import { rateLimit } from '@/lib/rate-limit';

// Rate limiter instance
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 users per interval
});

// Validation schemas
const propertyFiltersSchema = z.object({
  search: z.string().optional(),
  type: z.array(z.nativeEnum(PropertyType)).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  bedrooms: z.array(z.number().min(0).max(10)).optional(),
  bathrooms: z.array(z.number().min(0).max(10)).optional(),
  minSize: z.number().min(0).optional(),
  maxSize: z.number().min(0).optional(),
  location: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  status: z.array(z.nativeEnum(PropertyStatus)).optional(),
  features: z.array(z.string()).optional(),
  developmentId: z.string().optional(),
  hasVirtualTour: z.boolean().optional(),
  hasParking: z.boolean().optional(),
  sortBy: z.enum(['price', 'size', 'bedrooms', 'newest', 'oldest', 'name', 'availability']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()});

const createPropertySchema = z.object({
  developmentId: z.string().optional(),
  unitNumber: z.string(),
  name: z.string(),
  type: z.nativeEnum(PropertyType),
  size: z.number().min(0),
  bedrooms: z.number().min(0).max(10),
  bathrooms: z.number().min(0).max(10),
  price: z.number().min(0),
  status: z.nativeEnum(PropertyStatus).default(PropertyStatus.Available),
  features: z.array(z.string()).default([]),
  images: z.array(z.object({
    url: z.string().url(),
    alt: z.string().optional(),
    isPrimary: z.boolean().default(false),
    order: z.number().default(0)})).default([]),
  floorPlans: z.array(z.string().url()).default([]),
  virtualTourUrl: z.string().url().optional(),
  description: z.string().optional(),
  energyRating: z.string().optional(),
  berNumber: z.string().optional(),
  propertyTax: z.number().optional(),
  managementFee: z.number().optional()});

// GET /api/properties - List properties with filtering
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip ?? 'anonymous';
    try {
      await limiter.check(10ip); // 10 requests per minute
    } catch {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '12');
    const view = searchParams.get('view') || 'grid';

    // Parse filters
    const filters: PropertyFilters = {
      search: searchParams.get('search') || undefined,
      type: searchParams.getAll('type').filter(Boolean) as PropertyType[],
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
      bedrooms: searchParams.getAll('bedrooms').map(Number).filter(n => !isNaN(n)),
      bathrooms: searchParams.getAll('bathrooms').map(Number).filter(n => !isNaN(n)),
      minSize: searchParams.get('minSize') ? parseFloat(searchParams.get('minSize')!) : undefined,
      maxSize: searchParams.get('maxSize') ? parseFloat(searchParams.get('maxSize')!) : undefined,
      location: searchParams.getAll('location').filter(Boolean),
      amenities: searchParams.getAll('amenities').filter(Boolean),
      status: searchParams.getAll('status').filter(Boolean) as PropertyStatus[],
      features: searchParams.getAll('features').filter(Boolean),
      developmentId: searchParams.get('developmentId') || undefined,
      hasVirtualTour: searchParams.get('hasVirtualTour') === 'true' ? true : undefined,
      hasParking: searchParams.get('hasParking') === 'true' ? true : undefined,
      sortBy: searchParams.get('sortBy') as any || 'newest',
      sortOrder: searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc'};

    // Validate filters
    const validatedFilters = propertyFiltersSchema.parse(filters);

    // Build query conditions
    const where: any = {};

    if (validatedFilters.search) {
      where.OR = [
        { name: { contains: validatedFilters.search, mode: 'insensitive' } },
        { description: { contains: validatedFilters.search, mode: 'insensitive' } },
        { unitNumber: { contains: validatedFilters.search, mode: 'insensitive' } },
        { development: { name: { contains: validatedFilters.search, mode: 'insensitive' } } }];
    }

    if (validatedFilters.type?.length) {
      where.type = { in: validatedFilters.type };
    }

    if (validatedFilters.minPrice !== undefined || validatedFilters.maxPrice !== undefined) {
      where.price = {};
      if (validatedFilters.minPrice !== undefined) where.price.gte = validatedFilters.minPrice;
      if (validatedFilters.maxPrice !== undefined) where.price.lte = validatedFilters.maxPrice;
    }

    if (validatedFilters.bedrooms?.length) {
      where.bedrooms = { in: validatedFilters.bedrooms };
    }

    if (validatedFilters.bathrooms?.length) {
      where.bathrooms = { in: validatedFilters.bathrooms };
    }

    if (validatedFilters.minSize !== undefined || validatedFilters.maxSize !== undefined) {
      where.size = {};
      if (validatedFilters.minSize !== undefined) where.size.gte = validatedFilters.minSize;
      if (validatedFilters.maxSize !== undefined) where.size.lte = validatedFilters.maxSize;
    }

    if (validatedFilters.status?.length) {
      where.status = { in: validatedFilters.status };
    }

    if (validatedFilters.developmentId) {
      where.developmentId = validatedFilters.developmentId;
    }

    if (validatedFilters.hasVirtualTour === true) {
      where.virtualTourUrl = { not: null };
    }

    if (validatedFilters.features?.length) {
      where.features = { hasSome: validatedFilters.features };
    }

    // Sorting
    const orderBy: any = {};
    switch (validatedFilters.sortBy) {
      case 'price':
        orderBy.price = validatedFilters.sortOrder;
        break;
      case 'size':
        orderBy.size = validatedFilters.sortOrder;
        break;
      case 'bedrooms':
        orderBy.bedrooms = validatedFilters.sortOrder;
        break;
      case 'newest':
        orderBy.createdAt = 'desc';
        break;
      case 'oldest':
        orderBy.createdAt = 'asc';
        break;
      case 'name':
        orderBy.name = validatedFilters.sortOrder;
        break;
      default:
        orderBy.createdAt = 'desc';
    }

    // Execute queries
    const [propertiestotal] = await Promise.all([
      prisma.unit.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          development: {
            include: {
              developer: true},
          reservations: {
            where: {
              status: 'ACTIVE'}),
      prisma.unit.count({ where })]);

    // Get aggregations for filters
    const aggregations = await getPropertyAggregations(where);

    // Transform units to properties
    const transformedProperties: Property[] = properties.map(unit => ({
      id: unit.id,
      developmentId: unit.developmentId || undefined,
      development: unit.development ? {
        id: unit.development.id,
        name: unit.development.name,
        slug: unit.development.slug || unit.development.name.toLowerCase().replace(/\s+/g, '-'),
        developer: {
          id: unit.development.developer?.id || '',
          name: unit.development.developer?.name || unit.development.developerName || 'Unknown Developer'},
        location: unit.development.location,
        totalUnits: unit.development.totalUnits,
        availableUnits: unit.development.availableUnits || 0,
        completionDate: unit.development.completionDate || undefined,
        description: unit.development.description || undefined} : undefined,
      unitNumber: unit.unitNumber,
      name: unit.name,
      type: unit.type as PropertyType,
      size: unit.size,
      bedrooms: unit.bedrooms,
      bathrooms: unit.bathrooms,
      price: unit.price.toNumber(),
      originalPrice: unit.originalPrice?.toNumber(),
      status: unit.status as PropertyStatus,
      features: unit.features || [],
      images: (unit.images as any[])?.map((imgindex: any) => ({
        id: img.id || `${unit.id}-img-${index}`,
        url: img.url || img,
        alt: img.alt || `${unit.name} - Image ${index + 1}`,
        isPrimary: img.isPrimary || index === 0,
        order: img.order || index})) || [],
      floorPlans: unit.floorPlans || [],
      virtualTourUrl: unit.virtualTourUrl || undefined,
      description: unit.description || undefined,
      specifications: unit.specifications as any || undefined,
      location: {
        address: unit.development?.address || '',
        city: unit.development?.city || '',
        county: unit.development?.county || '',
        postcode: unit.development?.postcode || undefined,
        latitude: unit.development?.latitude || 0,
        longitude: unit.development?.longitude || 0},
      amenities: unit.amenities || [],
      availability: {
        isAvailable: unit.status === 'AVAILABLE',
        availableFrom: unit.availableFrom || undefined,
        moveInDate: unit.moveInDate || undefined},
      customizationOptions: unit.customizationOptions as any || undefined,
      energyRating: unit.energyRating || undefined,
      berNumber: unit.berNumber || undefined,
      propertyTax: unit.propertyTax?.toNumber() || undefined,
      managementFee: unit.managementFee?.toNumber() || undefined,
      createdAt: unit.createdAt,
      updatedAt: unit.updatedAt}));

    const response: PropertyListResponse = {
      properties: transformedProperties,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      filters: validatedFilters,
      aggregations};

    // Add cache headers for better performance
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'});
  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

// POST /api/properties - Create a new property (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createPropertySchema.parse(body);

    // Create property (unit) in database
    const property = await prisma.unit.create({
      data: {
        developmentId: validatedData.developmentId,
        unitNumber: validatedData.unitNumber,
        name: validatedData.name,
        type: validatedData.type,
        size: validatedData.size,
        bedrooms: validatedData.bedrooms,
        bathrooms: validatedData.bathrooms,
        price: validatedData.price,
        status: validatedData.status,
        features: validatedData.features,
        images: validatedData.images,
        floorPlans: validatedData.floorPlans,
        virtualTourUrl: validatedData.virtualTourUrl,
        description: validatedData.description,
        energyRating: validatedData.energyRating,
        berNumber: validatedData.berNumber,
        propertyTax: validatedData.propertyTax,
        managementFee: validatedData.managementFee},
      include: {
        development: {
          include: {
            developer: true});

    return NextResponse.json({
      success: true,
      property}, { status: 201 });
  } catch (error) {

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}

// Helper async function toPromise.all([
    // Price aggregation
    prisma.unit.aggregate({
      where,
      _min: { price: true },
      _max: { price: true },
      _avg: { price: true }),
    // Size aggregation
    prisma.unit.aggregate({
      where,
      _min: { size: true },
      _max: { size: true },
      _avg: { size: true }),
    // Type counts
    prisma.unit.groupBy({
      by: ['type'],
      where,
      _count: true}),
    // Status counts
    prisma.unit.groupBy({
      by: ['status'],
      where,
      _count: true}),
    // Bedroom counts
    prisma.unit.groupBy({
      by: ['bedrooms'],
      where,
      _count: true})]);

  return {
    priceRange: {
      min: priceAgg._min.price?.toNumber() || 0,
      max: priceAgg._max.price?.toNumber() || 0,
      avg: priceAgg._avg.price?.toNumber() || 0},
    sizeRange: {
      min: sizeAgg._min.size || 0,
      max: sizeAgg._max.size || 0,
      avg: sizeAgg._avg.size || 0},
    typeCounts: typeCounts.reduce((acc, { type, _count }) => ({
      ...acc,
      [type]: _count}), {} as Record<PropertyType, number>),
    statusCounts: statusCounts.reduce((acc, { status, _count }) => ({
      ...acc,
      [status]: _count}), {} as Record<PropertyStatus, number>),
    bedroomCounts: bedroomCounts.reduce((acc, { bedrooms, _count }) => ({
      ...acc,
      [bedrooms]: _count}), {} as Record<number, number>),
    locationCounts: {}, // TODO: Implement location counts
  };
}