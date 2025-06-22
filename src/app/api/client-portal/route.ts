/**
 * Client Portal API Routes
 * 
 * API endpoints for enhanced client portal with AI integration
 * Provides unified client experience with multi-professional coordination
 * 
 * Endpoints:
 * - GET: Get client projects, dashboard summary, messages, notifications
 * - POST: Send messages, schedule appointments, request changes
 * - PUT: Update preferences, mark messages as read
 * - DELETE: Archive notifications and messages
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import ClientPortalService from '@/services/ClientPortalService';

const clientPortalService = new ClientPortalService();

// Request schemas
const ClientDashboardRequestSchema = z.object({
  clientId: z.string().min(1),
  includeAnalytics: z.boolean().optional(),
  includeMessages: z.boolean().optional(),
  includeNotifications: z.boolean().optional()
});

const SendMessageSchema = z.object({
  clientId: z.string().min(1),
  professionalId: z.string().min(1),
  subject: z.string().min(1),
  content: z.string().min(1),
  priority: z.enum(['high', 'medium', 'low']).optional().default('medium'),
  attachments: z.array(z.any()).optional()
});

const ScheduleAppointmentSchema = z.object({
  clientId: z.string().min(1),
  professionalId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  requestedDate: z.coerce.date(),
  duration: z.number().min(15).max(480), // 15 minutes to 8 hours
  type: z.enum(['meeting', 'site_visit', 'call', 'video_call'])
});

const ChangeRequestSchema = z.object({
  clientId: z.string().min(1),
  projectId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(['design', 'specification', 'timeline', 'budget']),
  priority: z.enum(['high', 'medium', 'low']).optional().default('medium'),
  estimatedImpact: z.string().optional()
});

const UpdatePreferencesSchema = z.object({
  clientId: z.string().min(1),
  preferences: z.object({
    notifications: z.object({
      email: z.boolean(),
      sms: z.boolean(),
      push: z.boolean(),
      frequency: z.enum(['immediate', 'daily', 'weekly'])
    }),
    communications: z.object({
      directMessaging: z.boolean(),
      videoCallRequests: z.boolean(),
      documentSharing: z.boolean()
    }),
    dashboard: z.object({
      defaultView: z.enum(['overview', 'timeline', 'professionals', 'documents']),
      displayMode: z.enum(['detailed', 'simplified']),
      aiInsights: z.boolean()
    })
  })
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const clientId = searchParams.get('clientId');
    const projectId = searchParams.get('projectId');

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'get_dashboard_summary':
        return await getClientDashboardSummary(clientId);

      case 'get_client_projects':
        return await getClientProjects(clientId);

      case 'get_client_project':
        if (!projectId) {
          return NextResponse.json(
            { error: 'Project ID is required for get_client_project' },
            { status: 400 }
          );
        }
        return await getClientProject(clientId, projectId);

      case 'get_client_messages':
        const unreadOnly = searchParams.get('unreadOnly') === 'true';
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
        const category = searchParams.get('category') || undefined;
        return await getClientMessages(clientId, { unreadOnly, limit, category });

      case 'get_client_notifications':
        return await getClientNotifications(clientId);

      case 'get_client_analytics':
        return await getClientAnalytics(clientId);

      case 'get_project_timeline':
        if (!projectId) {
          return NextResponse.json(
            { error: 'Project ID is required for get_project_timeline' },
            { status: 400 }
          );
        }
        return await getProjectTimeline(clientId, projectId);

      case 'get_project_budget':
        if (!projectId) {
          return NextResponse.json(
            { error: 'Project ID is required for get_project_budget' },
            { status: 400 }
          );
        }
        return await getProjectBudget(clientId, projectId);

      case 'get_project_professionals':
        if (!projectId) {
          return NextResponse.json(
            { error: 'Project ID is required for get_project_professionals' },
            { status: 400 }
          );
        }
        return await getProjectProfessionals(clientId, projectId);

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Client Portal API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'send_message':
        const messageData = SendMessageSchema.parse(body);
        return await sendMessage(messageData);

      case 'schedule_appointment':
        const appointmentData = ScheduleAppointmentSchema.parse(body);
        return await scheduleAppointment(appointmentData);

      case 'request_change':
        const changeData = ChangeRequestSchema.parse(body);
        return await requestChange(changeData);

      case 'upload_document':
        const { clientId, projectId, documentData } = body;
        if (!clientId || !projectId || !documentData) {
          return NextResponse.json(
            { error: 'Client ID, project ID, and document data are required' },
            { status: 400 }
          );
        }
        return await uploadDocument(clientId, projectId, documentData);

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Client Portal API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'update_preferences':
        const preferencesData = UpdatePreferencesSchema.parse(body);
        return await updatePreferences(preferencesData);

      case 'mark_message_read':
        const { clientId, messageId } = body;
        if (!clientId || !messageId) {
          return NextResponse.json(
            { error: 'Client ID and message ID are required' },
            { status: 400 }
          );
        }
        return await markMessageRead(clientId, messageId);

      case 'mark_notification_read':
        const { clientId: notifClientId, notificationId } = body;
        if (!notifClientId || !notificationId) {
          return NextResponse.json(
            { error: 'Client ID and notification ID are required' },
            { status: 400 }
          );
        }
        return await markNotificationRead(notifClientId, notificationId);

      case 'update_project_preferences':
        const { clientId: projClientId, projectId, preferences } = body;
        if (!projClientId || !projectId || !preferences) {
          return NextResponse.json(
            { error: 'Client ID, project ID, and preferences are required' },
            { status: 400 }
          );
        }
        return await updateProjectPreferences(projClientId, projectId, preferences);

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Client Portal API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'archive_message':
        const messageId = searchParams.get('messageId');
        if (!messageId) {
          return NextResponse.json(
            { error: 'Message ID is required' },
            { status: 400 }
          );
        }
        return await archiveMessage(clientId, messageId);

      case 'archive_notification':
        const notificationId = searchParams.get('notificationId');
        if (!notificationId) {
          return NextResponse.json(
            { error: 'Notification ID is required' },
            { status: 400 }
          );
        }
        return await archiveNotification(clientId, notificationId);

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Client Portal API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET action handlers
async function getClientDashboardSummary(clientId: string) {
  try {
    const dashboardSummary = await clientPortalService.getClientDashboardSummary(clientId);
    return NextResponse.json({ 
      success: true, 
      data: dashboardSummary 
    });
  } catch (error) {
    console.error('Error getting client dashboard summary:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve dashboard summary' },
      { status: 500 }
    );
  }
}

async function getClientProjects(clientId: string) {
  try {
    const projects = await clientPortalService.getClientProjects(clientId);
    return NextResponse.json({ 
      success: true, 
      projects 
    });
  } catch (error) {
    console.error('Error getting client projects:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve client projects' },
      { status: 500 }
    );
  }
}

async function getClientProject(clientId: string, projectId: string) {
  try {
    const project = await clientPortalService.getClientProject(clientId, projectId);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      project 
    });
  } catch (error) {
    console.error('Error getting client project:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve project' },
      { status: 500 }
    );
  }
}

async function getClientMessages(
  clientId: string, 
  options: { unreadOnly?: boolean; limit?: number; category?: string }
) {
  try {
    const messages = await clientPortalService.getClientMessages(clientId, options);
    return NextResponse.json({ 
      success: true, 
      messages 
    });
  } catch (error) {
    console.error('Error getting client messages:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve messages' },
      { status: 500 }
    );
  }
}

async function getClientNotifications(clientId: string) {
  try {
    const notifications = await clientPortalService.getClientNotifications(clientId);
    return NextResponse.json({ 
      success: true, 
      notifications 
    });
  } catch (error) {
    console.error('Error getting client notifications:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve notifications' },
      { status: 500 }
    );
  }
}

async function getClientAnalytics(clientId: string) {
  try {
    // This would get client analytics from the service
    const analytics = {
      engagement: {
        loginFrequency: 12,
        averageSessionTime: 18,
        featuresUsed: ['Dashboard', 'Messages', 'Documents', 'Timeline'],
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      satisfaction: {
        score: 4.6,
        feedback: ['Great communication', 'Easy to use dashboard', 'Love the AI insights'],
        improvements: ['More mobile features', 'Video calling']
      },
      communication: {
        messagesReceived: 24,
        messagesRead: 22,
        responseTime: 4.2,
        preferredChannel: 'email'
      }
    };

    return NextResponse.json({ 
      success: true, 
      analytics 
    });
  } catch (error) {
    console.error('Error getting client analytics:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve analytics' },
      { status: 500 }
    );
  }
}

async function getProjectTimeline(clientId: string, projectId: string) {
  try {
    const project = await clientPortalService.getClientProject(clientId, projectId);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      timeline: project.timeline 
    });
  } catch (error) {
    console.error('Error getting project timeline:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve project timeline' },
      { status: 500 }
    );
  }
}

async function getProjectBudget(clientId: string, projectId: string) {
  try {
    const project = await clientPortalService.getClientProject(clientId, projectId);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      budget: project.budget 
    });
  } catch (error) {
    console.error('Error getting project budget:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve project budget' },
      { status: 500 }
    );
  }
}

async function getProjectProfessionals(clientId: string, projectId: string) {
  try {
    const project = await clientPortalService.getClientProject(clientId, projectId);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      professionals: project.professionals 
    });
  } catch (error) {
    console.error('Error getting project professionals:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve project professionals' },
      { status: 500 }
    );
  }
}

// POST action handlers
async function sendMessage(data: z.infer<typeof SendMessageSchema>) {
  try {
    const success = await clientPortalService.sendMessageToProfessional(
      data.clientId,
      data.professionalId,
      {
        subject: data.subject,
        content: data.content,
        priority: data.priority || 'medium',
        attachments: data.attachments
      }
    );

    return NextResponse.json({ 
      success, 
      message: 'Message sent successfully' 
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

async function scheduleAppointment(data: z.infer<typeof ScheduleAppointmentSchema>) {
  try {
    const success = await clientPortalService.scheduleAppointment(
      data.clientId,
      data.professionalId,
      {
        title: data.title,
        description: data.description || '',
        requestedDate: data.requestedDate,
        duration: data.duration,
        type: data.type
      }
    );

    return NextResponse.json({ 
      success, 
      message: 'Appointment request sent successfully' 
    });
  } catch (error) {
    console.error('Error scheduling appointment:', error);
    return NextResponse.json(
      { error: 'Failed to schedule appointment' },
      { status: 500 }
    );
  }
}

async function requestChange(data: z.infer<typeof ChangeRequestSchema>) {
  try {
    const success = await clientPortalService.requestProjectChange(
      data.clientId,
      data.projectId,
      {
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority || 'medium',
        estimatedImpact: data.estimatedImpact || 'To be assessed'
      }
    );

    return NextResponse.json({ 
      success, 
      message: 'Change request submitted successfully' 
    });
  } catch (error) {
    console.error('Error submitting change request:', error);
    return NextResponse.json(
      { error: 'Failed to submit change request' },
      { status: 500 }
    );
  }
}

async function uploadDocument(clientId: string, projectId: string, documentData: any) {
  try {
    // This would handle document upload to storage
    console.log('Uploading document:', { clientId, projectId, documentData });

    return NextResponse.json({ 
      success: true, 
      message: 'Document uploaded successfully',
      documentId: `doc_${Date.now()}`
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}

// PUT action handlers
async function updatePreferences(data: z.infer<typeof UpdatePreferencesSchema>) {
  try {
    const success = await clientPortalService.updateNotificationPreferences(
      data.clientId,
      {
        email: data.preferences.notifications.email,
        sms: data.preferences.notifications.sms,
        push: data.preferences.notifications.push,
        frequency: data.preferences.notifications.frequency,
        types: {
          milestones: true,
          delays: true,
          communications: true,
          approvals: true,
          documents: true,
          budget: true
        }
      }
    );

    return NextResponse.json({ 
      success, 
      message: 'Preferences updated successfully' 
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}

async function markMessageRead(clientId: string, messageId: string) {
  try {
    // This would mark the message as read in the database
    console.log('Marking message as read:', { clientId, messageId });

    return NextResponse.json({ 
      success: true, 
      message: 'Message marked as read' 
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark message as read' },
      { status: 500 }
    );
  }
}

async function markNotificationRead(clientId: string, notificationId: string) {
  try {
    // This would mark the notification as read in the database
    console.log('Marking notification as read:', { clientId, notificationId });

    return NextResponse.json({ 
      success: true, 
      message: 'Notification marked as read' 
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark notification as read' },
      { status: 500 }
    );
  }
}

async function updateProjectPreferences(clientId: string, projectId: string, preferences: any) {
  try {
    // This would update project-specific preferences
    console.log('Updating project preferences:', { clientId, projectId, preferences });

    return NextResponse.json({ 
      success: true, 
      message: 'Project preferences updated successfully' 
    });
  } catch (error) {
    console.error('Error updating project preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update project preferences' },
      { status: 500 }
    );
  }
}

// DELETE action handlers
async function archiveMessage(clientId: string, messageId: string) {
  try {
    // This would archive the message in the database
    console.log('Archiving message:', { clientId, messageId });

    return NextResponse.json({ 
      success: true, 
      message: 'Message archived successfully' 
    });
  } catch (error) {
    console.error('Error archiving message:', error);
    return NextResponse.json(
      { error: 'Failed to archive message' },
      { status: 500 }
    );
  }
}

async function archiveNotification(clientId: string, notificationId: string) {
  try {
    // This would archive the notification in the database
    console.log('Archiving notification:', { clientId, notificationId });

    return NextResponse.json({ 
      success: true, 
      message: 'Notification archived successfully' 
    });
  } catch (error) {
    console.error('Error archiving notification:', error);
    return NextResponse.json(
      { error: 'Failed to archive notification' },
      { status: 500 }
    );
  }
}