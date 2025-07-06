// src/app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/users-production';

interface Task {
  id: string;
  title: string;
  description: string;
  category: 'financial' | 'legal' | 'documentation' | 'property' | 'verification' | 'completion';
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'optional';
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  completedAt?: string;
  assignedTo?: 'buyer' | 'solicitor' | 'agent' | 'developer' | 'lender';
  dependencies: string[]; // Task IDs that must be completed first
  progress: number; // 0-100
  milestone: string; // Journey milestone this task belongs to
  automationTrigger?: string; // Event that triggers this task
  metadata: {
    propertyId?: string;
    documentType?: string;
    amount?: number;
    estimatedDuration?: number; // in days
    stakeholders?: string[];
    externalDeadline?: string;
  };
  actions: {
    type: 'upload_document' | 'make_payment' | 'schedule_appointment' | 'external_link' | 'manual_review';
    label: string;
    url?: string;
    required: boolean;
  }[];
}

interface TaskResponse {
  id: string;
  content: string;
  notes?: string;
  completedAt: string;
}

/**
 * Task Management API
 * Handles buyer journey tasks and progress tracking
 */
export async function GET(request: NextRequest) {
  try {
    // Get current user
    let currentUser = null;
    try {
      if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
        const authToken = request.cookies.get('auth-token')?.value;
        if (authToken?.startsWith('dev-token-')) {
          const userId = authToken.replace('dev-token-', '');
          currentUser = await userService.getUserById(userId);
        }
      } else {
        currentUser = await userService.getCurrentUser();
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const milestone = searchParams.get('milestone');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // In development mode, return mock tasks
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      console.log(`[DEV] Getting tasks for user ${currentUser.id}`);
      
      const mockTasks: Task[] = [
        {
          id: 'task_001',
          title: 'Complete Identity Verification',
          description: 'Upload valid government-issued photo ID to verify your identity for the property purchase process.',
          category: 'verification',
          status: 'completed',
          priority: 'high',
          completedAt: '2025-06-10T14:30:00Z',
          assignedTo: 'buyer',
          dependencies: [],
          progress: 100,
          milestone: 'initial_setup',
          metadata: {
            documentType: 'passport_or_driving_license',
            estimatedDuration: 1
          },
          actions: [
            {
              type: 'upload_document',
              label: 'Upload ID Document',
              url: '/buyer/verification',
              required: true
            }
          ]
        },
        {
          id: 'task_002',
          title: 'Submit Help-to-Buy Application',
          description: 'Apply for the Help-to-Buy scheme to receive up to €30,000 towards your new home purchase.',
          category: 'financial',
          status: 'completed',
          priority: 'high',
          completedAt: '2025-06-12T09:15:00Z',
          assignedTo: 'buyer',
          dependencies: ['task_001'],
          progress: 100,
          milestone: 'financial_planning',
          metadata: {
            amount: 30000,
            estimatedDuration: 3,
            externalDeadline: '2025-07-01'
          },
          actions: [
            {
              type: 'external_link',
              label: 'HTB Application Portal',
              url: '/buyer/htb/new',
              required: true
            }
          ]
        },
        {
          id: 'task_003',
          title: 'Property Reservation Payment',
          description: 'Pay the €5,000 reservation fee to secure your chosen property.',
          category: 'financial',
          status: 'completed',
          priority: 'high',
          completedAt: '2025-06-15T16:45:00Z',
          assignedTo: 'buyer',
          dependencies: ['task_002'],
          progress: 100,
          milestone: 'property_secured',
          metadata: {
            propertyId: 'prop_001',
            amount: 5000,
            estimatedDuration: 1
          },
          actions: [
            {
              type: 'make_payment',
              label: 'Pay Reservation Fee',
              url: '/buyer/payments',
              required: true
            }
          ]
        },
        {
          id: 'task_004',
          title: 'Choose Your Solicitor',
          description: 'Select a qualified property solicitor to handle the legal aspects of your purchase.',
          category: 'legal',
          status: 'in_progress',
          priority: 'high',
          dueDate: '2025-06-25T00:00:00Z',
          assignedTo: 'buyer',
          dependencies: ['task_003'],
          progress: 60,
          milestone: 'legal_setup',
          metadata: {
            estimatedDuration: 5,
            stakeholders: ['buyer', 'developer', 'lender']
          },
          actions: [
            {
              type: 'external_link',
              label: 'Find Solicitors',
              url: '/professionals/solicitors',
              required: true
            },
            {
              type: 'upload_document',
              label: 'Submit Solicitor Details',
              url: '/buyer/documents',
              required: true
            }
          ]
        },
        {
          id: 'task_005',
          title: 'Mortgage Application',
          description: 'Submit your formal mortgage application with all required documentation.',
          category: 'financial',
          status: 'in_progress',
          priority: 'high',
          dueDate: '2025-06-30T00:00:00Z',
          assignedTo: 'buyer',
          dependencies: ['task_004'],
          progress: 30,
          milestone: 'financing',
          metadata: {
            amount: 280000,
            estimatedDuration: 14,
            stakeholders: ['buyer', 'lender', 'solicitor']
          },
          actions: [
            {
              type: 'upload_document',
              label: 'Submit Bank Statements',
              url: '/buyer/documents',
              required: true
            },
            {
              type: 'upload_document',
              label: 'Submit Payslips',
              url: '/buyer/documents',
              required: true
            },
            {
              type: 'schedule_appointment',
              label: 'Schedule Bank Meeting',
              url: '/buyer/appointments',
              required: false
            }
          ]
        },
        {
          id: 'task_006',
          title: 'Property Survey and Valuation',
          description: 'Arrange for a professional survey and valuation of your chosen property.',
          category: 'property',
          status: 'pending',
          priority: 'medium',
          dueDate: '2025-07-05T00:00:00Z',
          assignedTo: 'buyer',
          dependencies: ['task_005'],
          progress: 0,
          milestone: 'due_diligence',
          metadata: {
            propertyId: 'prop_001',
            amount: 450,
            estimatedDuration: 7,
            stakeholders: ['buyer', 'surveyor', 'lender']
          },
          actions: [
            {
              type: 'schedule_appointment',
              label: 'Book Survey',
              url: '/buyer/appointments',
              required: true
            },
            {
              type: 'make_payment',
              label: 'Pay Survey Fee',
              url: '/buyer/payments',
              required: true
            }
          ]
        },
        {
          id: 'task_007',
          title: 'Contract Review and Signing',
          description: 'Review and sign the purchase contract with your solicitor.',
          category: 'legal',
          status: 'pending',
          priority: 'high',
          assignedTo: 'solicitor',
          dependencies: ['task_006'],
          progress: 0,
          milestone: 'contract_stage',
          metadata: {
            propertyId: 'prop_001',
            estimatedDuration: 10,
            stakeholders: ['buyer', 'solicitor', 'developer']
          },
          actions: [
            {
              type: 'schedule_appointment',
              label: 'Schedule Contract Meeting',
              url: '/buyer/appointments',
              required: true
            },
            {
              type: 'manual_review',
              label: 'Review with Solicitor',
              required: true
            }
          ]
        },
        {
          id: 'task_008',
          title: 'Final Property Inspection',
          description: 'Conduct a final walkthrough of your property before completion.',
          category: 'property',
          status: 'pending',
          priority: 'medium',
          assignedTo: 'buyer',
          dependencies: ['task_007'],
          progress: 0,
          milestone: 'completion_prep',
          metadata: {
            propertyId: 'prop_001',
            estimatedDuration: 1,
            stakeholders: ['buyer', 'developer', 'agent']
          },
          actions: [
            {
              type: 'schedule_appointment',
              label: 'Book Final Inspection',
              url: '/buyer/appointments',
              required: true
            }
          ]
        },
        {
          id: 'task_009',
          title: 'Completion Payment',
          description: 'Transfer the remaining balance to complete your property purchase.',
          category: 'financial',
          status: 'pending',
          priority: 'high',
          assignedTo: 'solicitor',
          dependencies: ['task_008'],
          progress: 0,
          milestone: 'completion',
          metadata: {
            propertyId: 'prop_001',
            amount: 275000,
            estimatedDuration: 1,
            stakeholders: ['buyer', 'solicitor', 'developer', 'lender']
          },
          actions: [
            {
              type: 'manual_review',
              label: 'Solicitor Handles Payment',
              required: true
            }
          ]
        },
        {
          id: 'task_010',
          title: 'Collect Property Keys',
          description: 'Receive your keys and officially become the property owner!',
          category: 'completion',
          status: 'pending',
          priority: 'high',
          assignedTo: 'developer',
          dependencies: ['task_009'],
          progress: 0,
          milestone: 'completion',
          metadata: {
            propertyId: 'prop_001',
            estimatedDuration: 1,
            stakeholders: ['buyer', 'developer']
          },
          actions: [
            {
              type: 'schedule_appointment',
              label: 'Schedule Key Collection',
              url: '/buyer/appointments',
              required: true
            }
          ]
        }
      ];

      // Apply filters
      let filteredTasks = mockTasks;
      
      if (status) {
        filteredTasks = filteredTasks.filter(t => t.status === status);
      }
      
      if (category) {
        filteredTasks = filteredTasks.filter(t => t.category === category);
      }
      
      if (milestone) {
        filteredTasks = filteredTasks.filter(t => t.milestone === milestone);
      }

      // Apply pagination
      const paginatedTasks = filteredTasks.slice(offset, offset + limit);

      // Calculate journey progress
      const completedTasks = mockTasks.filter(t => t.status === 'completed').length;
      const totalTasks = mockTasks.length;
      const journeyProgress = Math.round((completedTasks / totalTasks) * 100);

      // Calculate milestone progress
      const milestones = {
        initial_setup: { completed: 1, total: 1, progress: 100 },
        financial_planning: { completed: 1, total: 1, progress: 100 },
        property_secured: { completed: 1, total: 1, progress: 100 },
        legal_setup: { completed: 0, total: 1, progress: 60 },
        financing: { completed: 0, total: 1, progress: 30 },
        due_diligence: { completed: 0, total: 1, progress: 0 },
        contract_stage: { completed: 0, total: 1, progress: 0 },
        completion_prep: { completed: 0, total: 1, progress: 0 },
        completion: { completed: 0, total: 2, progress: 0 }
      };

      return NextResponse.json({
        success: true,
        tasks: paginatedTasks,
        pagination: {
          total: filteredTasks.length,
          limit,
          offset,
          hasMore: offset + limit < filteredTasks.length
        },
        summary: {
          total: totalTasks,
          completed: completedTasks,
          inProgress: mockTasks.filter(t => t.status === 'in_progress').length,
          pending: mockTasks.filter(t => t.status === 'pending').length,
          blocked: mockTasks.filter(t => t.status === 'blocked').length,
          journeyProgress,
          milestones
        },
        message: '[DEV MODE] Mock task data. In production, this would query the database.'
      });
    }

    // Production: Query actual database
    try {
      // This would query the actual database in production
      return NextResponse.json({
        success: true,
        tasks: [],
        pagination: {
          total: 0,
          limit,
          offset,
          hasMore: false
        },
        summary: {
          total: 0,
          completed: 0,
          inProgress: 0,
          pending: 0,
          blocked: 0,
          journeyProgress: 0,
          milestones: {}
        }
      });
    } catch (dbError: any) {
      console.error('Database query error:', dbError);
      
      return NextResponse.json(
        { error: 'Failed to retrieve tasks' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Tasks API error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Update Task Status or Progress
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId, status, progress, response, notes } = body;

    // Validate required fields
    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    // Get current user
    let currentUser = null;
    try {
      if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
        const authToken = request.cookies.get('auth-token')?.value;
        if (authToken?.startsWith('dev-token-')) {
          const userId = authToken.replace('dev-token-', '');
          currentUser = await userService.getUserById(userId);
        }
      } else {
        currentUser = await userService.getCurrentUser();
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // In development mode, simulate task update
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      console.log(`[DEV] Updating task ${taskId} - Status: ${status}, Progress: ${progress}`);
      
      const updatedTask = {
        id: taskId,
        status: status || 'in_progress',
        progress: progress || 0,
        updatedAt: new Date().toISOString(),
        completedAt: status === 'completed' ? new Date().toISOString() : undefined,
        response: response || null,
        notes: notes || null
      };

      // Simulate task automation triggers
      const automationTriggers = [];
      if (status === 'completed') {
        switch (taskId) {
          case 'task_003':
            automationTriggers.push('Property reserved - legal setup tasks activated');
            break;
          case 'task_005':
            automationTriggers.push('Mortgage approved - survey tasks activated');
            break;
          case 'task_007':
            automationTriggers.push('Contract signed - completion tasks activated');
            break;
        }
      }

      return NextResponse.json({
        success: true,
        task: updatedTask,
        automationTriggers,
        message: '[DEV MODE] Task updated successfully'
      });
    }

    // Production: Update actual database
    try {
      // This would update the actual database in production
      return NextResponse.json({
        success: true,
        task: {
          id: taskId,
          status: status || 'in_progress',
          progress: progress || 0,
          updatedAt: new Date().toISOString()
        }
      });
    } catch (dbError: any) {
      console.error('Database update error:', dbError);
      
      return NextResponse.json(
        { error: 'Failed to update task' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Task update error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}