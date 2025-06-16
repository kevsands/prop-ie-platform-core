import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { uploadToCloudinary, uploadMultipleToCloudinary } from '@/lib/uploadToCloudinary';

// Validation schema for development creation
const developmentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  totalUnits: z.number().int().positive('Total units must be positive'),
  developmentType: z.enum(['RESIDENTIAL', 'COMMERCIAL', 'MIXED_USE']),
  projectType: z.enum(['APARTMENTS', 'HOUSES', 'TOWNHOUSES', 'CONDOS', 'MIXED']),
  status: z.enum(['PLANNING', 'CONSTRUCTION', 'SELLING', 'SOLD_OUT', 'COMPLETED']),
  startDate: z.string(),
  completionDate: z.string(),
  amenities: z.array(z.string()).optional(),
  transportLinks: z.array(z.string()).optional(),
  nearbyAmenities: z.array(z.string()).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  planningPermission: z.boolean(),
  buildingRegulations: z.boolean(),
  environmentalCompliance: z.boolean()
});

// GET /api/developer/developments - Get all developments for the developer
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has developer role
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id
      },
      select: {
        roles: true
      }
    });

    if (!user?.roles.includes('developer')) {
      return NextResponse.json(
        { error: 'User is not registered as a developer' },
        { status: 403 }
      );
    }

    const developments = await prisma.development.findMany({
      where: {
        developerId: session.user.id
      },
      include: {
        UnitType: {
          include: {
            _count: {
              select: { units: true }
            }
          }
        },
        _count: {
          select: {
            units: true,
            Viewing: true,
            transactions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ developments });
  } catch (error) {
    console.error('Error fetching developments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch developments' },
      { status: 500 }
    );
  }
}

// POST /api/developer/developments - Create a new development
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has developer role
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id
      },
      select: {
        roles: true
      }
    });

    if (!user?.roles.includes('developer')) {
      return NextResponse.json(
        { error: 'User is not registered as a developer' },
        { status: 403 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    
    // Extract and validate basic data
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      location: formData.get('location') as string,
      addressLine1: formData.get('addressLine1') as string,
      addressLine2: formData.get('addressLine2') as string || undefined,
      city: formData.get('city') as string,
      postalCode: formData.get('postalCode') as string,
      country: formData.get('country') as string,
      totalUnits: parseInt(formData.get('totalUnits') as string),
      developmentType: formData.get('developmentType') as string,
      projectType: formData.get('projectType') as string,
      status: formData.get('status') as string,
      startDate: formData.get('startDate') as string,
      completionDate: formData.get('completionDate') as string,
      amenities: JSON.parse(formData.get('amenities') as string || '[]'),
      transportLinks: JSON.parse(formData.get('transportLinks') as string || '[]'),
      nearbyAmenities: JSON.parse(formData.get('nearbyAmenities') as string || '[]'),
      latitude: formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : undefined,
      longitude: formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : undefined,
      planningPermission: formData.get('planningPermission') === 'true',
      buildingRegulations: formData.get('buildingRegulations') === 'true',
      environmentalCompliance: formData.get('environmentalCompliance') === 'true'
    };

    // Validate data
    const validatedData = developmentSchema.parse(data);

    // Handle file uploads
    const mainImage = formData.get('mainImage') as File | null;
    const galleryImages = formData.getAll('galleryImages') as File[];
    const floorPlan = formData.get('floorPlan') as File | null;
    const brochure = formData.get('brochure') as File | null;
    const video = formData.get('video') as File | null;

    let mainImageUrl: string | undefined;
    let galleryUrls: string[] = [];
    let floorPlanUrl: string | undefined;
    let brochureUrl: string | undefined;
    let videoUrl: string | undefined;

    // Upload files if provided
    if (mainImage && mainImage.size> 0) {
      mainImageUrl = await uploadToCloudinary(mainImage, 'developments/main');
    }

    if (galleryImages.length> 0 && galleryImages[0].size> 0) {
      galleryUrls = await uploadMultipleToCloudinary(galleryImages, 'developments/gallery');
    }

    if (floorPlan && floorPlan.size> 0) {
      floorPlanUrl = await uploadToCloudinary(floorPlan, 'developments/floorplans');
    }

    if (brochure && brochure.size> 0) {
      brochureUrl = await uploadToCloudinary(brochure, 'developments/brochures');
    }

    if (video && video.size> 0) {
      videoUrl = await uploadToCloudinary(video, 'developments/videos');
    }

    // First create location
    const location = await prisma.location.create({
      data: {
        address: validatedData.location,
        addressLine1: validatedData.addressLine1,
        addressLine2: validatedData.addressLine2,
        city: validatedData.city,
        county: validatedData.city, // Using city as county for now
        eircode: validatedData.postalCode,
        country: validatedData.country,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude
      }
    });

    // Create development in database
    const development = await prisma.development.create({
      data: {
        name: validatedData.name,
        slug: validatedData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        developerId: session.user.id,
        locationId: location.id,
        status: validatedData.status as any,
        totalUnits: validatedData.totalUnits,
        description: validatedData.description,
        shortDescription: validatedData.description.substring(0200),
        mainImage: mainImageUrl || '/images/placeholder.jpg',
        images: galleryUrls,
        videos: videoUrl ? [videoUrl] : [],
        brochureUrl: brochureUrl,
        features: validatedData.amenities || [],
        amenities: [...(validatedData.transportLinks || []), ...(validatedData.nearbyAmenities || [])],
        buildingType: validatedData.projectType,
        startDate: new Date(validatedData.startDate),
        completionDate: new Date(validatedData.completionDate),
        buildingSpecs: {
          developmentType: validatedData.developmentType,
          projectType: validatedData.projectType,
          floorPlan: floorPlanUrl
        },
        marketingStatus: {
          status: 'PLANNING',
          lastUpdated: new Date()
        },
        salesStatus: {
          status: 'NOT_STARTED',
          unitsAvailable: validatedData.totalUnits,
          unitsSold: 0,
          lastUpdated: new Date()
        },
        constructionStatus: {
          status: validatedData.status === 'CONSTRUCTION' ? 'IN_PROGRESS' : 'NOT_STARTED',
          progress: 0,
          lastUpdated: new Date()
        },
        complianceStatus: {
          planningPermission: validatedData.planningPermission,
          buildingRegulations: validatedData.buildingRegulations,
          environmentalCompliance: validatedData.environmentalCompliance,
          lastUpdated: new Date()
        }
      }
    });

    // Create initial development timeline if needed
    // In a real implementation, we might create associated Project and ProjectTasks here
    // For now, we'll just track the development creation

    return NextResponse.json({ 
      success: true,
      development,
      message: 'Development created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating development:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create development' },
      { status: 500 }
    );
  }
}