/**
 * API Route: /api/developments/[id]
 * Handles specific development endpoints - ENTERPRISE ENABLED
 * NOW UNIFIED: Uses live data from developer portal via BuyerDeveloperDataBridge
 */

import { NextRequest, NextResponse } from 'next/server';
import { projectDataService } from '@/services/ProjectDataService';
import { DEVELOPMENT_DATA } from '@/data/developments-brochure-data';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    console.log(`🔍 [API] Getting development data for: ${id}`);
    
    // Get live project data from ProjectDataService (same as developer portal)
    let project = projectDataService.getProject(id);
    
    // Initialize if not found
    if (!project && id === 'fitzgerald-gardens') {
      console.log('🏗️ [API] Initializing Fitzgerald Gardens...');
      project = projectDataService.initializeFitzgeraldGardens();
    }
    
    if (project) {
      console.log(`✅ [API] Using LIVE data for ${id} (${project.units.length} units)`);
      
      // Get static brochure data for presentation info
      const staticDev = DEVELOPMENT_DATA[id];
      
      // Use live units from project data
      const units = project.units;
      
      // Calculate unit statistics from live data
      const totalUnits = units.length;
      const availableUnits = units.filter(u => u.status === 'available').length;
      const reservedUnits = units.filter(u => u.status === 'reserved').length;
      const soldUnits = units.filter(u => u.status === 'sold').length;
      
      // Calculate starting price from available units
      const availableUnitPrices = units.filter(u => u.status === 'available' && u.pricing?.currentPrice).map(u => u.pricing.currentPrice);
      const startingPrice = availableUnitPrices.length > 0 ? Math.min(...availableUnitPrices) : null;
      
      const responseData = {
        id: project.id,
        name: project.name,
        slug: project.id,
        description: project.description,
        shortDescription: project.description,
        status: 'active',
        
        // Rich media content from brochure data
        mainImage: staticDev?.heroImage || '/images/developments/fitzgerald-gardens/hero.jpeg',
        images: staticDev?.galleryImages?.map(img => img.src) || [],
        videos: [],
        sitePlanUrl: staticDev?.sitePlan,
        brochureUrl: staticDev?.brochureUrl,
        virtualTourUrl: null,
        websiteUrl: null,
        
        // Location details
        location: {
          address: project.location,
          city: 'Drogheda',
          county: 'Louth',
          country: 'Ireland',
          postcode: 'A92 X984',
          coordinates: { lat: 53.7158, lng: -6.3478 },
          nearby: []
        },
        
        // Features and amenities from brochure data
        features: staticDev?.features || [],
        amenities: staticDev?.amenities || {},
        buildingSpecs: {},
        buildingType: 'Mixed Development',
        
        // Timeline from live project data
        startDate: project.timeline?.projectStart || '2024-02-01',
        completionDate: project.timeline?.plannedCompletion || '2025-08-15',
        timeline: project.timeline,
        
        // Marketing and publication
        isPublished: true,
        publishedDate: '2024-06-01',
        tags: ['new-homes', 'luxury', 'modern'],
        awards: [],
        
        // Pricing and units - LIVE DATA FROM DEVELOPER PORTAL
        startingPrice: startingPrice,
        totalUnits: totalUnits,
        unitsAvailable: availableUnits,
        
        // Timestamps
        createdAt: project.createdAt || '2024-06-01T00:00:00Z',
        updatedAt: project.lastUpdated,
        
        // Units data - EXACT SAME AS DEVELOPER PORTAL
        units: units.map(unit => ({
          id: unit.id,
          unitNumber: unit.number,
          name: `Unit ${unit.number}`,
          type: unit.type,
          bedrooms: unit.features.bedrooms,
          bathrooms: unit.features.bathrooms,
          size: unit.features.sqft,
          sqm: unit.features.sqm || Math.round(unit.features.sqft / 10.764),
          price: unit.pricing.currentPrice,
          basePrice: unit.pricing.basePrice,
          status: unit.status,
          primaryImage: null,
          images: [],
          features: unit.features.features || [],
          berRating: 'A3',
          floor: unit.features.floor,
          building: unit.features.building,
          aspect: 'South',
          developmentId: id
        })),
        
        // Analytics - LIVE DATA
        analytics: {
          totalUnits,
          availableUnits,
          reservedUnits,
          soldUnits,
          occupancyRate: totalUnits > 0 ? ((soldUnits / totalUnits) * 100).toFixed(1) : 0
        },
        unitStats: {
          total: totalUnits,
          available: availableUnits,
          reserved: reservedUnits,
          sold: soldUnits
        },
        
        // Sync metadata
        dataSource: 'live',
        lastSyncedAt: project.lastUpdated
      };
      
      return NextResponse.json({
        data: responseData,
        message: 'Development retrieved successfully (live data)'
      });
    }
    
    // Fallback to database if live data not available
    console.log(`📄 [API] Falling back to database for ${id}`);
    
    const development = await prisma.development.findUnique({
      where: { id },
      include: {
        Location: true,
        ProjectTimeline: {
          include: {
            milestones: true
          }
        },
        Unit: {
          orderBy: { unitNumber: 'asc' }
        }
      }
    });
    
    if (!development) {
      return NextResponse.json({ 
        error: 'Development not found',
        message: `Development with ID '${id}' does not exist`
      }, { status: 404 });
    }

    // Map units to the expected format
    const units = development.Unit;

    // Map units to the expected format
    const mappedUnits = units.map(unit => ({
      id: unit.id,
      unitNumber: unit.unitNumber,
      name: unit.name,
      type: unit.type,
      bedrooms: unit.bedrooms,
      bathrooms: unit.bathrooms,
      size: unit.size,
      price: unit.basePrice,
      status: unit.status,
      primaryImage: unit.primaryImage,
      images: unit.images,
      features: unit.features,
      berRating: unit.berRating,
      floor: unit.floor,
      aspect: unit.aspect,
      developmentId: id
    }));

    // Calculate unit statistics
    const totalUnits = units.length;
    const availableUnits = units.filter(u => u.status === 'available').length;
    const reservedUnits = units.filter(u => u.status === 'reserved').length;
    const soldUnits = units.filter(u => u.status === 'sold').length;

    // Calculate starting price from available units
    const availableUnitPrices = units.filter(u => u.status === 'available' && u.basePrice).map(u => u.basePrice);
    const startingPrice = availableUnitPrices.length > 0 ? Math.min(...availableUnitPrices) : null;

    const responseData = {
      id: development.id,
      name: development.name,
      slug: development.slug,
      description: development.description,
      shortDescription: development.shortDescription,
      status: development.status,
      
      // Rich media content
      mainImage: development.mainImage,
      images: development.images || [],
      videos: development.videos || [],
      sitePlanUrl: development.sitePlanUrl,
      brochureUrl: development.brochureUrl,
      virtualTourUrl: development.virtualTourUrl,
      websiteUrl: development.websiteUrl,
      
      // Location details
      location: development.Location ? {
        address: development.Location.address,
        city: development.Location.city,
        county: development.Location.county,
        country: development.Location.country,
        postcode: development.Location.postcode,
        coordinates: development.Location.coordinates,
        nearby: development.Location.nearby
      } : null,
      
      // Features and amenities
      features: development.features || [],
      amenities: development.amenities || [],
      buildingSpecs: development.buildingSpecs || {},
      buildingType: development.buildingType,
      
      // Timeline
      startDate: development.startDate,
      completionDate: development.completionDate,
      timeline: development.ProjectTimeline ? {
        id: development.ProjectTimeline.id,
        startDate: development.ProjectTimeline.startDate,
        targetCompletion: development.ProjectTimeline.targetCompletion,
        actualCompletion: development.ProjectTimeline.actualCompletion,
        milestones: development.ProjectTimeline.milestones || []
      } : null,
      
      // Marketing and publication
      isPublished: development.isPublished,
      publishedDate: development.publishedDate,
      tags: development.tags || [],
      awards: development.awards || [],
      
      // Pricing and units
      startingPrice: startingPrice,
      totalUnits: totalUnits,
      unitsAvailable: availableUnits,
      
      // Timestamps
      createdAt: development.created,
      updatedAt: development.updated,
      
      // Units data
      units: mappedUnits,
      
      // Analytics
      analytics: {
        totalUnits,
        availableUnits,
        reservedUnits,
        soldUnits,
        occupancyRate: totalUnits > 0 ? ((soldUnits / totalUnits) * 100).toFixed(1) : 0
      },
      unitStats: {
        total: totalUnits,
        available: availableUnits,
        reserved: reservedUnits,
        sold: soldUnits
      }
    };
    
    return NextResponse.json({
      data: responseData,
      message: 'Development retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching development:', error);
    return NextResponse.json({
      error: 'Failed to fetch development data',
      message: 'Internal server error'
    }, { status: 500 });
  }
}