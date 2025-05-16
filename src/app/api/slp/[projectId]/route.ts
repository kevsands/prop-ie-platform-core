import { NextRequest, NextResponse } from 'next/server';
import { slpService } from '@/services/slpService';
import { transactionCoordinator } from '@/services/transactionCoordinator';
import { requireAuth, requirePermission } from '@/lib/auth-middleware';

// Protected GET endpoint - requires authentication
export const GET = requireAuth(async (
  request: NextRequest,
  { params }: { params: { projectId: string } }
) => {
  try {
    const projectId = params.projectId;
    const user = (request as any).user;
    
    // Get SLP components
    const components = await slpService.getComponents(projectId);
    
    // Get project progress
    const progress = await slpService.getProjectProgress(projectId);
    
    return NextResponse.json({
      components,
      progress
    });
  } catch (error) {
    console.error('Error fetching SLP data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SLP data' },
      { status: 500 }
    );
  }
});

// Protected POST endpoint - requires authentication
export const POST = requireAuth(async (
  request: NextRequest,
  { params }: { params: { projectId: string } }
) => {
  try {
    const projectId = params.projectId;
    const user = (request as any).user;
    const body = await request.json();
    
    const { action, data } = body;
    
    switch (action) {
      case 'updateStatus':
        const updatedComponent = await slpService.updateComponentStatus(
          data.componentId,
          data.status,
          user.userId, // Use authenticated user ID
          data.notes
        );
        return NextResponse.json(updatedComponent);
        
      case 'uploadDocument':
        const uploadedComponent = await slpService.uploadDocument(
          data.componentId,
          data.documentId,
          data.documentUrl,
          user.userId // Use authenticated user ID
        );
        return NextResponse.json(uploadedComponent);
        
      case 'createComponent':
        const newComponent = await slpService.createComponent({
          ...data,
          projectId
        });
        return NextResponse.json(newComponent);
        
      case 'generateReport':
        const report = await slpService.generateReport(projectId);
        return NextResponse.json(report);
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error processing SLP request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
});