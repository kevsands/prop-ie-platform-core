// src/app/api/tasks/automation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/users-production';

interface AutomationTrigger {
  id: string;
  name: string;
  event: string; // Event that triggers the automation
  conditions: Record<string, any>; // Conditions that must be met
  actions: {
    type: 'create_task' | 'update_task' | 'send_notification' | 'schedule_reminder';
    payload: Record<string, any>;
  }[];
  enabled: boolean;
  priority: number; // Execution order
}

interface TaskAutomationRequest {
  event: string;
  payload: Record<string, any>;
  userId?: string;
}

/**
 * Task Automation API
 * Handles automated task creation and updates based on events
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as TaskAutomationRequest;
    const { event, payload } = body;

    // Validate required fields
    if (!event) {
      return NextResponse.json(
        { error: 'Event type is required' },
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

    // In development mode, simulate automation triggers
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      console.log(`[DEV] Processing automation trigger - Event: ${event}`);
      
      const automationResults = [];
      
      // Define automation rules
      switch (event) {
        case 'payment_completed':
          if (payload.paymentType === 'reservation') {
            automationResults.push({
              type: 'create_task',
              message: 'Created solicitor selection task',
              taskId: `task_auto_${Date.now()}_1`,
              task: {
                title: 'Choose Your Solicitor',
                description: 'Now that you\'ve reserved your property, you need to select a qualified solicitor to handle the legal process.',
                category: 'legal',
                priority: 'high',
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                milestone: 'legal_setup'
              }
            });

            automationResults.push({
              type: 'send_notification',
              message: 'Property reservation notification sent',
              notification: {
                type: 'success',
                title: 'Property Reserved Successfully!',
                message: 'Your property has been reserved. Next step: choose your solicitor.',
                actionUrl: '/buyer/tasks'
              }
            });
          }
          
          if (payload.paymentType === 'deposit') {
            automationResults.push({
              type: 'create_task',
              message: 'Created mortgage application task',
              taskId: `task_auto_${Date.now()}_2`,
              task: {
                title: 'Submit Formal Mortgage Application',
                description: 'With your deposit paid, it\'s time to submit your formal mortgage application with all required documentation.',
                category: 'financial',
                priority: 'high',
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                milestone: 'financing'
              }
            });
          }
          break;

        case 'document_uploaded':
          if (payload.documentType === 'identity_verification') {
            automationResults.push({
              type: 'update_task',
              message: 'Updated identity verification task',
              taskId: 'task_001',
              updates: {
                status: 'completed',
                progress: 100,
                completedAt: new Date().toISOString()
              }
            });

            automationResults.push({
              type: 'create_task',
              message: 'Unlocked HTB application task',
              taskId: `task_auto_${Date.now()}_3`,
              task: {
                title: 'Complete Help-to-Buy Application',
                description: 'Your identity has been verified. You can now apply for the Help-to-Buy scheme.',
                category: 'financial',
                priority: 'high',
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                milestone: 'financial_planning'
              }
            });
          }
          break;

        case 'mortgage_approved':
          automationResults.push({
            type: 'create_task',
            message: 'Created property survey task',
            taskId: `task_auto_${Date.now()}_4`,
            task: {
              title: 'Arrange Property Survey',
              description: 'Your mortgage has been approved! Now arrange for a professional property survey and valuation.',
              category: 'property',
              priority: 'medium',
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              milestone: 'due_diligence'
            }
          });

          automationResults.push({
            type: 'send_notification',
            message: 'Mortgage approval notification sent',
            notification: {
              type: 'success',
              title: 'Mortgage Approved!',
              message: 'Congratulations! Your mortgage application has been approved.',
              actionUrl: '/buyer/tasks'
            }
          });
          break;

        case 'contract_signed':
          automationResults.push({
            type: 'create_task',
            message: 'Created final inspection task',
            taskId: `task_auto_${Date.now()}_5`,
            task: {
              title: 'Schedule Final Property Inspection',
              description: 'Contract is signed! Schedule your final property walkthrough before completion.',
              category: 'property',
              priority: 'medium',
              dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
              milestone: 'completion_prep'
            }
          });

          automationResults.push({
            type: 'create_task',
            message: 'Created completion preparation task',
            taskId: `task_auto_${Date.now()}_6`,
            task: {
              title: 'Prepare for Completion',
              description: 'Work with your solicitor to prepare for the completion process and final payment.',
              category: 'legal',
              priority: 'high',
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              milestone: 'completion'
            }
          });
          break;

        case 'htb_approved':
          automationResults.push({
            type: 'update_task',
            message: 'Updated HTB application task',
            taskId: 'task_002',
            updates: {
              status: 'completed',
              progress: 100,
              notes: `HTB benefit approved: €${payload.amount}`
            }
          });

          automationResults.push({
            type: 'send_notification',
            message: 'HTB approval notification sent',
            notification: {
              type: 'success',
              title: 'Help-to-Buy Approved!',
              message: `Your HTB application has been approved for €${payload.amount}.`,
              actionUrl: '/buyer/htb/status'
            }
          });
          break;

        case 'appointment_scheduled':
          if (payload.appointmentType === 'solicitor_meeting') {
            automationResults.push({
              type: 'schedule_reminder',
              message: 'Scheduled appointment reminder',
              reminder: {
                type: 'appointment',
                title: 'Solicitor Meeting Reminder',
                scheduledFor: new Date(payload.appointmentDate - 24 * 60 * 60 * 1000).toISOString(), // 1 day before
                message: 'Your solicitor meeting is scheduled for tomorrow. Please bring all required documents.'
              }
            });
          }
          break;

        case 'milestone_completed':
          automationResults.push({
            type: 'send_notification',
            message: 'Milestone completion notification sent',
            notification: {
              type: 'achievement',
              title: `${payload.milestone} Completed!`,
              message: 'Great progress! You\'ve completed another milestone in your property journey.',
              actionUrl: '/buyer/journey'
            }
          });
          break;

        default:
          return NextResponse.json({
            success: true,
            message: `No automation rules found for event: ${event}`,
            triggered: []
          });
      }

      return NextResponse.json({
        success: true,
        event,
        triggered: automationResults,
        message: '[DEV MODE] Automation triggers processed successfully'
      });
    }

    // Production: Process actual automation rules
    try {
      // This would process actual automation rules in production
      return NextResponse.json({
        success: true,
        event,
        triggered: [],
        message: 'Automation processed successfully'
      });
    } catch (automationError: any) {
      console.error('Automation processing error:', automationError);
      
      return NextResponse.json(
        { error: 'Failed to process automation' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Task automation error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Get Active Automation Rules
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

    // In development mode, return mock automation rules
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      const mockAutomationRules: AutomationTrigger[] = [
        {
          id: 'auto_001',
          name: 'Property Reservation Follow-up',
          event: 'payment_completed',
          conditions: { paymentType: 'reservation' },
          actions: [
            {
              type: 'create_task',
              payload: {
                title: 'Choose Your Solicitor',
                category: 'legal',
                priority: 'high',
                milestone: 'legal_setup'
              }
            }
          ],
          enabled: true,
          priority: 1
        },
        {
          id: 'auto_002',
          name: 'Identity Verification Complete',
          event: 'document_uploaded',
          conditions: { documentType: 'identity_verification' },
          actions: [
            {
              type: 'update_task',
              payload: { taskId: 'task_001', status: 'completed' }
            },
            {
              type: 'create_task',
              payload: {
                title: 'Complete Help-to-Buy Application',
                category: 'financial'
              }
            }
          ],
          enabled: true,
          priority: 2
        },
        {
          id: 'auto_003',
          name: 'Mortgage Approval Follow-up',
          event: 'mortgage_approved',
          conditions: {},
          actions: [
            {
              type: 'create_task',
              payload: {
                title: 'Arrange Property Survey',
                category: 'property'
              }
            },
            {
              type: 'send_notification',
              payload: {
                type: 'success',
                title: 'Mortgage Approved!'
              }
            }
          ],
          enabled: true,
          priority: 3
        }
      ];

      return NextResponse.json({
        success: true,
        automationRules: mockAutomationRules,
        summary: {
          total: mockAutomationRules.length,
          enabled: mockAutomationRules.filter(rule => rule.enabled).length,
          disabled: mockAutomationRules.filter(rule => !rule.enabled).length
        },
        message: '[DEV MODE] Mock automation rules'
      });
    }

    // Production: Query actual automation rules
    return NextResponse.json({
      success: true,
      automationRules: [],
      summary: {
        total: 0,
        enabled: 0,
        disabled: 0
      }
    });
  } catch (error: any) {
    console.error('Get automation rules error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}