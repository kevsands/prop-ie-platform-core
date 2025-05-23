import { NextRequest, NextResponse } from 'next/server';
import { MediaFile } from '@/components/media';

// This would come from a database in a real application
const mediaDatabase: Record<string, {
  developmentImages: MediaFile[];
  floorPlans: MediaFile[];
  brochures: MediaFile[];
  sitePhotos: MediaFile[];
}> = {
  'fitzgerald-gardens': {
    developmentImages: [
      {
        name: 'development-1.jpg',
        size: 1200000,
        type: 'image/jpeg',
        preview: '/images/developments/fitzgerald-gardens.jpg',
        id: 'dev-img-1'} as MediaFile,
      {
        name: 'development-2.jpg',
        size: 1500000,
        type: 'image/jpeg',
        preview: '/images/developments/ballymakenny-view.jpg',
        id: 'dev-img-2'} as MediaFile],
    floorPlans: [
      {
        name: 'floor-plan-1.pdf',
        size: 2100000,
        type: 'application/pdf',
        id: 'floor-plan-1'} as MediaFile],
    brochures: [
      {
        name: 'brochure.pdf',
        size: 3500000,
        type: 'application/pdf',
        id: 'brochure-1'} as MediaFile],
    sitePhotos: []},
  'riverside-manor': {
    developmentImages: [
      {
        name: 'riverside-1.jpg',
        size: 1800000,
        type: 'image/jpeg',
        preview: '/images/developments/riverside-manor.jpg',
        id: 'dev-img-3'} as MediaFile],
    floorPlans: [],
    brochures: [],
    sitePhotos: []};

interface MediaCategory {
  id: string;
  name: string;
  files: MediaFile[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const projectId = params.id;

  // Check if project exists
  if (!mediaDatabase[projectId]) {
    return NextResponse.json(
      { error: 'Project not found' },
      { status: 404 }
    );
  }

  // Map the media database to the categories format expected by the client
  const mediaData = mediaDatabase[projectId];
  const categories: MediaCategory[] = [
    {
      id: 'development-images',
      name: 'Development Images',
      files: mediaData.developmentImages || []},
    {
      id: 'floor-plans',
      name: 'Floor Plans',
      files: mediaData.floorPlans || []},
    {
      id: 'brochures',
      name: 'Brochures',
      files: mediaData.brochures || []},
    {
      id: 'site-photos',
      name: 'Site Photos',
      files: mediaData.sitePhotos || []}];

  // Return the categories data
  return NextResponse.json({ categories });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const projectId = params.id;

  // Check if project exists
  if (!mediaDatabase[projectId]) {
    return NextResponse.json(
      { error: 'Project not found' },
      { status: 404 }
    );
  }

  try {
    // Get request body
    const body = await request.json();

    if (!body.categories || !Array.isArray(body.categories)) {
      return NextResponse.json(
        { error: 'Invalid request body. Expected categories array.' },
        { status: 400 }
      );
    }

    // In a real application, you would process uploads and save files
    // This is a mock implementation that just updates our in-memory database
    const categories: MediaCategory[] = body.categories;

    // Update the media database with the new data
    categories.forEach(category => {
      if (category.id === 'development-images') {
        mediaDatabase[projectId].developmentImages = category.files;
      } else if (category.id === 'floor-plans') {
        mediaDatabase[projectId].floorPlans = category.files;
      } else if (category.id === 'brochures') {
        mediaDatabase[projectId].brochures = category.files;
      } else if (category.id === 'site-photos') {
        mediaDatabase[projectId].sitePhotos = category.files;
      }
    });

    return NextResponse.json({ success: true, message: 'Media updated successfully' });
  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to process media update' },
      { status: 500 }
    );
  }
}

// Handle file uploads (in a real application you'd use middleware for multipart/form-data)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const projectId = params.id;

  // This would be a more complex implementation with actual file upload handling
  // For the mock API, we'll just acknowledge the request

  return NextResponse.json({ 
    success: true, 
    message: 'File upload endpoint (this would handle multipart/form-data in a real application)'
  });
}