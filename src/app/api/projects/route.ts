import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

interface ProjectMilestone {
  title: string;
  date: string;
  daysRemaining: number;
}

interface Project {
  id: string;
  name: string;
  status: 'Planning' | 'In Progress' | 'Completed';
  location: string;
  progress: number;
  unitsSold: number;
  totalUnits: number;
  nextMilestone: ProjectMilestone | null;
}

interface CreateProjectRequest {
  name: string;
  location: string;
  description?: string;
  totalUnits?: number;
}

interface ProjectsResponse {
  active: Project[];
  completed: Project[];
  planned: Project[];
}

/**
 * GET /api/projects
 * Fetch list of all projects with summary information
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    // Fetch real development data from database
    const developments = await prisma.development.findMany({
      include: {
        location: true,
        totalUnits: {
          select: {
            id: true,
            status: true,
            basePrice: true
          }
        },
        timeline: {
          include: {
            milestones: {
              orderBy: { plannedDate: 'asc' },
              take: 1
            }
          }
        }
      }
    });

    // Transform database data to API format
    const transformedProjects = developments.map(dev => {
      const totalUnits = dev.totalUnits.length;
      const soldUnits = dev.totalUnits.filter(unit => unit.status === 'SOLD').length;
      const nextMilestone = dev.timeline?.milestones[0];
      
      // Map development status to project status
      let projectStatus: 'Planning' | 'In Progress' | 'Completed';
      switch (dev.status) {
        case 'PLANNING':
        case 'PRE_CONSTRUCTION':
          projectStatus = 'Planning';
          break;
        case 'COMPLETED':
        case 'HANDOVER':
          projectStatus = 'Completed';
          break;
        default:
          projectStatus = 'In Progress';
      }

      // Calculate progress from construction status
      const constructionStatus = dev.constructionStatus as any;
      const progress = constructionStatus?.overallCompletion || 0;

      return {
        id: dev.slug || dev.id,
        name: dev.name,
        status: projectStatus,
        location: `${dev.location.city}, ${dev.location.county}`,
        progress: progress,
        unitsSold: soldUnits,
        totalUnits: totalUnits,
        nextMilestone: nextMilestone ? {
          title: nextMilestone.name,
          date: nextMilestone.plannedDate.toISOString().split('T')[0],
          daysRemaining: Math.max(0, Math.ceil((nextMilestone.plannedDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
        } : null
      };
    });

    // Categorize projects by status
    const projects: ProjectsResponse = {
      active: transformedProjects.filter(p => p.status === 'In Progress'),
      completed: transformedProjects.filter(p => p.status === 'Completed'),
      planned: transformedProjects.filter(p => p.status === 'Planning')
    };

    // Filter by status if specified
    if (status) {
      if (status === 'active') {
        return NextResponse.json({ projects: projects.active });
      } else if (status === 'completed') {
        return NextResponse.json({ projects: projects.completed });
      } else if (status === 'planned') {
        return NextResponse.json({ projects: projects.planned });
      }
    }

    // Return all projects if no filter
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects
 * Create a new project
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body with type assertion
    const body = await request.json() as CreateProjectRequest;
    const { name, location, description, totalUnits } = body;
    
    if (!name || !location) {
      return NextResponse.json(
        { error: 'Name and location are required' },
        { status: 400 }
      );
    }
    
    // Generate a slug for the project ID
    const projectId = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    
    // In production, this would create a project in database
    // For now, just return success response with generated ID
    return NextResponse.json({
      success: true,
      message: 'Project created successfully',
      project: {
        id: projectId,
        name,
        location,
        description,
        status: 'Planning',
        progress: 0,
        unitsSold: 0,
        totalUnits: totalUnits || 0,
        createdBy: session.user.name || 'User',
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}