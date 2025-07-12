/**
 * Professional Coordination API
 * 
 * Unified API for coordinating between professional teams (QS, Architects, Engineers)
 * Supports cross-project collaboration, document sharing, and status synchronization
 */

import { NextRequest, NextResponse } from 'next/server';

// Professional coordination data types
interface Professional {
  id: string;
  name: string;
  company: string;
  type: 'quantity-surveyor' | 'architect' | 'engineer';
  discipline?: string;
  qualifications: string[];
  activeProjects: string[];
  currentWorkload: number;
  performance: number;
  specializations: string[];
  contact: {
    email: string;
    phone: string;
  };
  status: 'available' | 'busy' | 'unavailable';
  dashboardUrl: string;
  currentStage: string;
  deliverables: number;
  location: string;
  yearsExperience: number;
  certifications: string[];
  lastActive: string;
}

interface CoordinationTask {
  id: string;
  title: string;
  description: string;
  projectId: string;
  assignedTo: string[];
  professionalTypes: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'review' | 'completed';
  dueDate: string;
  dependencies: string[];
  deliverables: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProjectProfessionalMatrix {
  projectId: string;
  projectName: string;
  professionals: {
    quantitySurveyors: Professional[];
    architects: Professional[];
    engineers: Professional[];
  };
  coordinationTasks: CoordinationTask[];
  integrationStatus: {
    qsIntegration: number;
    architectIntegration: number;
    engineerIntegration: number;
    overallIntegration: number;
  };
}

// Sample data for demonstration
const sampleProfessionals: Professional[] = [
  {
    id: 'qs-1',
    name: 'Michael O\'Brien',
    company: 'Byrne Wallace Quantity Surveyors',
    type: 'quantity-surveyor',
    qualifications: ['SCSI', 'RICS', 'MSc QS'],
    activeProjects: ['fitzgerald-gardens', 'ellwood-development'],
    currentWorkload: 85,
    performance: 4.8,
    specializations: ['Cost Planning', 'Value Engineering', 'Contract Administration', 'Risk Management'],
    contact: {
      email: 'michael@byrnewalllace.ie',
      phone: '+353 1 234 5670'
    },
    status: 'busy',
    dashboardUrl: '/quantity-surveyor/cost-management',
    currentStage: 'Cost Monitoring',
    deliverables: 18,
    location: 'Dublin',
    yearsExperience: 12,
    certifications: ['SCSI', 'RICS'],
    lastActive: '2 hours ago'
  },
  {
    id: 'arch-1',
    name: 'Emma Collins',
    company: 'Collins Design Studio',
    type: 'architect',
    qualifications: ['RIAI', 'ARB', 'MArch'],
    activeProjects: ['fitzgerald-gardens', 'ballymakenny-view'],
    currentWorkload: 80,
    performance: 4.7,
    specializations: ['Residential Design', 'Planning Applications', 'Sustainable Design', 'BIM Management'],
    contact: {
      email: 'emma@collinsdesign.ie',
      phone: '+353 1 234 5672'
    },
    status: 'busy',
    dashboardUrl: '/architect/coordination',
    currentStage: 'Design Development',
    deliverables: 15,
    location: 'Dublin',
    yearsExperience: 10,
    certifications: ['RIAI', 'ARB'],
    lastActive: '30 minutes ago'
  },
  {
    id: 'eng-1',
    name: 'Patrick O\'Connor',
    company: 'O\'Connor & Associates',
    type: 'engineer',
    discipline: 'structural',
    qualifications: ['Chartered Engineer', 'Engineers Ireland', 'MSc Structural'],
    activeProjects: ['fitzgerald-gardens', 'ellwood-development'],
    currentWorkload: 85,
    performance: 4.7,
    specializations: ['Concrete Design', 'Steel Structures', 'Foundation Design', 'Seismic Analysis'],
    contact: {
      email: 'patrick@oconnoreng.ie',
      phone: '+353 1 234 5678'
    },
    status: 'busy',
    dashboardUrl: '/engineer/coordination',
    currentStage: 'Structural Analysis',
    deliverables: 12,
    location: 'Dublin',
    yearsExperience: 18,
    certifications: ['Engineers Ireland'],
    lastActive: '1 hour ago'
  }
];

const sampleCoordinationTasks: CoordinationTask[] = [
  {
    id: 'task-1',
    title: 'Fitzgerald Gardens Design Coordination',
    description: 'Coordinate architectural design with structural engineering requirements',
    projectId: 'fitzgerald-gardens',
    assignedTo: ['arch-1', 'eng-1'],
    professionalTypes: ['architect', 'engineer'],
    priority: 'high',
    status: 'in_progress',
    dueDate: '2025-07-15T00:00:00Z',
    dependencies: ['design-approval'],
    deliverables: ['Coordinated drawings', 'Structural calculations'],
    createdAt: '2025-07-01T09:00:00Z',
    updatedAt: '2025-07-06T14:30:00Z'
  },
  {
    id: 'task-2',
    title: 'Cost Estimate Review',
    description: 'Review and validate cost estimates for Ellwood Development',
    projectId: 'ellwood-development',
    assignedTo: ['qs-1'],
    professionalTypes: ['quantity-surveyor'],
    priority: 'medium',
    status: 'pending',
    dueDate: '2025-07-20T00:00:00Z',
    dependencies: ['design-completion'],
    deliverables: ['Updated BOQ', 'Cost report'],
    createdAt: '2025-07-03T10:00:00Z',
    updatedAt: '2025-07-06T16:00:00Z'
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');
  const professionalType = searchParams.get('type');
  const action = searchParams.get('action');

  try {
    switch (action) {
      case 'professionals':
        // Get all professionals or filter by type/project
        let filteredProfessionals = sampleProfessionals;
        
        if (professionalType) {
          filteredProfessionals = filteredProfessionals.filter(p => p.type === professionalType);
        }
        
        if (projectId) {
          filteredProfessionals = filteredProfessionals.filter(p => 
            p.activeProjects.some(project => 
              project.toLowerCase().replace(/\s+/g, '-') === projectId
            )
          );
        }

        return NextResponse.json({
          success: true,
          professionals: filteredProfessionals,
          count: filteredProfessionals.length
        });

      case 'tasks':
        // Get coordination tasks
        let filteredTasks = sampleCoordinationTasks;
        
        if (projectId) {
          filteredTasks = filteredTasks.filter(t => 
            t.projectId.toLowerCase().replace(/\s+/g, '-') === projectId
          );
        }

        return NextResponse.json({
          success: true,
          tasks: filteredTasks,
          count: filteredTasks.length
        });

      case 'matrix':
        // Get project-professional matrix
        if (!projectId) {
          return NextResponse.json({ 
            error: 'Project ID required for matrix view' 
          }, { status: 400 });
        }

        const projectName = projectId.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');

        const projectProfessionals = sampleProfessionals.filter(p => 
          p.activeProjects.some(project => 
            project.toLowerCase().replace(/\s+/g, '-') === projectId
          )
        );

        const matrix: ProjectProfessionalMatrix = {
          projectId,
          projectName,
          professionals: {
            quantitySurveyors: projectProfessionals.filter(p => p.type === 'quantity-surveyor'),
            architects: projectProfessionals.filter(p => p.type === 'architect'),
            engineers: projectProfessionals.filter(p => p.type === 'engineer')
          },
          coordinationTasks: sampleCoordinationTasks.filter(t => 
            t.projectId.toLowerCase().replace(/\s+/g, '-') === projectId
          ),
          integrationStatus: {
            qsIntegration: 95,
            architectIntegration: 88,
            engineerIntegration: 92,
            overallIntegration: 92
          }
        };

        return NextResponse.json({
          success: true,
          matrix
        });

      case 'stats':
        // Get coordination statistics
        const stats = {
          totalProfessionals: sampleProfessionals.length,
          professionalsByType: {
            quantitySurveyors: sampleProfessionals.filter(p => p.type === 'quantity-surveyor').length,
            architects: sampleProfessionals.filter(p => p.type === 'architect').length,
            engineers: sampleProfessionals.filter(p => p.type === 'engineer').length
          },
          averagePerformance: sampleProfessionals.reduce((acc, p) => acc + p.performance, 0) / sampleProfessionals.length,
          averageWorkload: sampleProfessionals.reduce((acc, p) => acc + p.currentWorkload, 0) / sampleProfessionals.length,
          activeTasks: sampleCoordinationTasks.filter(t => t.status === 'in_progress').length,
          totalDeliverables: sampleProfessionals.reduce((acc, p) => acc + p.deliverables, 0),
          integrationHealth: 92
        };

        return NextResponse.json({
          success: true,
          stats
        });

      default:
        // Default: return all coordination data
        return NextResponse.json({
          success: true,
          professionals: sampleProfessionals,
          tasks: sampleCoordinationTasks,
          totalProfessionals: sampleProfessionals.length,
          activeTasks: sampleCoordinationTasks.filter(t => t.status === 'in_progress').length
        });
    }
  } catch (error) {
    console.error('Professional coordination API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch coordination data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'create_task':
        // Create new coordination task
        const newTask: CoordinationTask = {
          id: `task-${Date.now()}`,
          title: data.title,
          description: data.description,
          projectId: data.projectId,
          assignedTo: data.assignedTo || [],
          professionalTypes: data.professionalTypes || [],
          priority: data.priority || 'medium',
          status: 'pending',
          dueDate: data.dueDate,
          dependencies: data.dependencies || [],
          deliverables: data.deliverables || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        return NextResponse.json({
          success: true,
          task: newTask,
          message: 'Coordination task created successfully'
        });

      case 'update_task':
        // Update existing coordination task
        const taskId = data.taskId;
        const updatedTask = {
          ...data,
          id: taskId,
          updatedAt: new Date().toISOString()
        };

        return NextResponse.json({
          success: true,
          task: updatedTask,
          message: 'Coordination task updated successfully'
        });

      case 'assign_professional':
        // Assign professional to project/task
        return NextResponse.json({
          success: true,
          assignment: {
            professionalId: data.professionalId,
            projectId: data.projectId,
            taskId: data.taskId,
            assignedAt: new Date().toISOString()
          },
          message: 'Professional assigned successfully'
        });

      case 'update_status':
        // Update professional or task status
        return NextResponse.json({
          success: true,
          statusUpdate: {
            id: data.id,
            type: data.type,
            newStatus: data.status,
            updatedAt: new Date().toISOString()
          },
          message: 'Status updated successfully'
        });

      default:
        return NextResponse.json({ 
          error: 'Invalid action' 
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Professional coordination POST error:', error);
    return NextResponse.json({ 
      error: 'Failed to process coordination request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Update professional information
    return NextResponse.json({
      success: true,
      professional: {
        ...body,
        updatedAt: new Date().toISOString()
      },
      message: 'Professional information updated successfully'
    });
  } catch (error) {
    console.error('Professional coordination PUT error:', error);
    return NextResponse.json({ 
      error: 'Failed to update professional information',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');
    const professionalId = searchParams.get('professionalId');

    if (taskId) {
      return NextResponse.json({
        success: true,
        deletedTaskId: taskId,
        message: 'Coordination task deleted successfully'
      });
    }

    if (professionalId) {
      return NextResponse.json({
        success: true,
        removedProfessionalId: professionalId,
        message: 'Professional removed from coordination successfully'
      });
    }

    return NextResponse.json({ 
      error: 'Task ID or Professional ID required' 
    }, { status: 400 });
  } catch (error) {
    console.error('Professional coordination DELETE error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete coordination data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}