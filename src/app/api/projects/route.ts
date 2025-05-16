import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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
    
    // Mock data for demonstration - in production this would fetch from database
    const projects: ProjectsResponse = {
      active: [
        {
          id: 'fitzgerald-gardens',
          name: 'Fitzgerald Gardens',
          status: 'In Progress',
          location: 'Drogheda, Co. Louth',
          progress: 70,
          unitsSold: 32,
          totalUnits: 45,
          nextMilestone: {
            title: 'Phase 1 Handover',
            date: '2023-10-15',
            daysRemaining: 0
          }
        },
        {
          id: 'ellwood',
          name: 'Ellwood',
          status: 'Planning',
          location: 'Ashbourne, Co. Meath',
          progress: 15,
          unitsSold: 0,
          totalUnits: 28,
          nextMilestone: {
            title: 'Planning Permission Decision',
            date: '2023-11-22',
            daysRemaining: 17
          }
        },
        {
          id: 'ballymakenny-view',
          name: 'Ballymakenny View',
          status: 'In Progress',
          location: 'Drogheda, Co. Louth',
          progress: 90,
          unitsSold: 18,
          totalUnits: 20,
          nextMilestone: {
            title: 'Final Handover',
            date: '2023-10-30',
            daysRemaining: 0
          }
        }
      ],
      completed: [
        {
          id: 'oakwood-residences',
          name: 'Oakwood Residences',
          status: 'Completed',
          location: 'Swords, Co. Dublin',
          progress: 100,
          unitsSold: 15,
          totalUnits: 15,
          nextMilestone: null
        }
      ],
      planned: [
        {
          id: 'harbour-heights',
          name: 'Harbour Heights',
          status: 'Planning',
          location: 'Bettystown, Co. Meath',
          progress: 5,
          unitsSold: 0,
          totalUnits: 32,
          nextMilestone: {
            title: 'Submit Planning Application',
            date: '2023-12-15',
            daysRemaining: 40
          }
        }
      ]
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