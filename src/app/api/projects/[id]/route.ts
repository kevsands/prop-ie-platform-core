/**
 * API Route: /api/projects/[id]
 * Handles project-specific data with graceful fallback
 */

import { NextRequest, NextResponse } from 'next/server';
import { projectDataService } from '@/services/ProjectDataService';

interface Props {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: Props
) {
  try {
    const resolvedParams = await params;
    const projectId = resolvedParams.id;

    // For now, use the existing service to get project data
    // This maintains compatibility with existing frontend code
    let project = projectDataService.getProject(projectId);
    
    // Initialize Fitzgerald Gardens if it doesn't exist
    if (!project && projectId === 'fitzgerald-gardens') {
      project = projectDataService.initializeFitzgeraldGardens();
    }
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: project,
      success: true
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project data' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: Props
) {
  try {
    const resolvedParams = await params;
    const projectId = resolvedParams.id;
    const body = await request.json();

    // Handle unit status updates
    if (body.type === 'unit_status_update') {
      const { unitId, status } = body;
      
      const success = projectDataService.updateUnitStatus(projectId, unitId, status);
      
      if (!success) {
        return NextResponse.json(
          { error: 'Failed to update unit status' },
          { status: 400 }
        );
      }

      // Get updated project data
      const project = projectDataService.getProject(projectId);
      
      return NextResponse.json({
        data: project,
        success: true,
        message: 'Unit status updated successfully'
      });
    }

    // Handle unit pricing updates
    if (body.type === 'unit_price_update') {
      const { unitId, newPrice } = body;
      
      const success = projectDataService.updateUnitPrice(projectId, unitId, newPrice);
      
      if (!success) {
        return NextResponse.json(
          { error: 'Failed to update unit price' },
          { status: 400 }
        );
      }

      // Get updated project data
      const project = projectDataService.getProject(projectId);
      
      return NextResponse.json({
        data: project,
        success: true,
        message: 'Unit price updated successfully'
      });
    }

    return NextResponse.json(
      { error: 'Unsupported update type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project data' },
      { status: 500 }
    );
  }
}