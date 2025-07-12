/**
 * Professional Integration API
 * 
 * API for managing integration between developer dashboard and professional services
 * Handles status synchronization, notification routing, and cross-platform coordination
 */

import { NextRequest, NextResponse } from 'next/server';

// Integration status and sync types
interface IntegrationStatus {
  professionalId: string;
  professionalType: 'quantity-surveyor' | 'architect' | 'engineer';
  projectId: string;
  developerDashboardSync: boolean;
  lastSyncTime: string;
  syncStatus: 'active' | 'pending' | 'failed' | 'disabled';
  dataConsistency: number; // percentage
  integrationHealth: {
    connection: 'healthy' | 'warning' | 'error';
    dataFlow: 'bidirectional' | 'developer-to-professional' | 'professional-to-developer' | 'none';
    lastActivity: string;
    errorCount: number;
  };
}

interface SyncEvent {
  id: string;
  type: 'status-update' | 'document-share' | 'task-assignment' | 'notification' | 'data-sync';
  source: 'developer-dashboard' | 'professional-dashboard';
  target: string;
  data: any;
  timestamp: string;
  processed: boolean;
  errorMessage?: string;
}

interface NotificationRoute {
  id: string;
  fromProfessional: string;
  toDeveloper: string;
  notificationType: 'status-change' | 'document-ready' | 'approval-needed' | 'deadline-alert' | 'coordination-request';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  message: string;
  timestamp: string;
  read: boolean;
  actionRequired: boolean;
}

// Sample integration data
const sampleIntegrationStatuses: IntegrationStatus[] = [
  {
    professionalId: 'qs-1',
    professionalType: 'quantity-surveyor',
    projectId: 'fitzgerald-gardens',
    developerDashboardSync: true,
    lastSyncTime: '2025-07-06T16:30:00Z',
    syncStatus: 'active',
    dataConsistency: 98,
    integrationHealth: {
      connection: 'healthy',
      dataFlow: 'bidirectional',
      lastActivity: '2025-07-06T16:25:00Z',
      errorCount: 0
    }
  },
  {
    professionalId: 'arch-1',
    professionalType: 'architect',
    projectId: 'fitzgerald-gardens',
    developerDashboardSync: true,
    lastSyncTime: '2025-07-06T15:45:00Z',
    syncStatus: 'active',
    dataConsistency: 95,
    integrationHealth: {
      connection: 'healthy',
      dataFlow: 'bidirectional',
      lastActivity: '2025-07-06T15:40:00Z',
      errorCount: 1
    }
  },
  {
    professionalId: 'eng-1',
    professionalType: 'engineer',
    projectId: 'fitzgerald-gardens',
    developerDashboardSync: true,
    lastSyncTime: '2025-07-06T16:15:00Z',
    syncStatus: 'active',
    dataConsistency: 97,
    integrationHealth: {
      connection: 'healthy',
      dataFlow: 'bidirectional',
      lastActivity: '2025-07-06T16:10:00Z',
      errorCount: 0
    }
  }
];

const sampleSyncEvents: SyncEvent[] = [
  {
    id: 'sync-1',
    type: 'status-update',
    source: 'professional-dashboard',
    target: 'developer-dashboard',
    data: {
      professionalId: 'qs-1',
      workload: 85,
      currentStage: 'Cost Monitoring',
      deliverables: 18
    },
    timestamp: '2025-07-06T16:30:00Z',
    processed: true
  },
  {
    id: 'sync-2',
    type: 'document-share',
    source: 'professional-dashboard',
    target: 'developer-dashboard',
    data: {
      professionalId: 'arch-1',
      documentId: 'doc-3',
      documentTitle: 'Architectural Drawings Set - GA Plans',
      status: 'approved'
    },
    timestamp: '2025-07-06T15:45:00Z',
    processed: true
  },
  {
    id: 'sync-3',
    type: 'task-assignment',
    source: 'developer-dashboard',
    target: 'professional-dashboard',
    data: {
      taskId: 'task-1',
      assignedTo: 'eng-1',
      taskTitle: 'Structural Review for Design Coordination',
      dueDate: '2025-07-15T00:00:00Z'
    },
    timestamp: '2025-07-06T14:20:00Z',
    processed: true
  }
];

const sampleNotificationRoutes: NotificationRoute[] = [
  {
    id: 'notif-1',
    fromProfessional: 'qs-1',
    toDeveloper: 'developer-team',
    notificationType: 'document-ready',
    priority: 'high',
    message: 'Updated Bill of Quantities ready for review - Fitzgerald Gardens project',
    timestamp: '2025-07-06T16:30:00Z',
    read: false,
    actionRequired: true
  },
  {
    id: 'notif-2',
    fromProfessional: 'arch-1',
    toDeveloper: 'developer-team',
    notificationType: 'approval-needed',
    priority: 'medium',
    message: 'Planning application drawings require developer approval before submission',
    timestamp: '2025-07-06T15:15:00Z',
    read: true,
    actionRequired: true
  },
  {
    id: 'notif-3',
    fromProfessional: 'eng-1',
    toDeveloper: 'developer-team',
    notificationType: 'deadline-alert',
    priority: 'urgent',
    message: 'Structural calculations deadline approaching - review required by July 8th',
    timestamp: '2025-07-06T12:00:00Z',
    read: false,
    actionRequired: true
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const projectId = searchParams.get('projectId');
  const professionalId = searchParams.get('professionalId');
  const professionalType = searchParams.get('professionalType');

  try {
    switch (action) {
      case 'status':
        // Get integration status for professionals
        let filteredStatuses = sampleIntegrationStatuses;
        
        if (projectId) {
          filteredStatuses = filteredStatuses.filter(status => 
            status.projectId.toLowerCase().replace(/\s+/g, '-') === projectId
          );
        }
        
        if (professionalId) {
          filteredStatuses = filteredStatuses.filter(status => status.professionalId === professionalId);
        }
        
        if (professionalType) {
          filteredStatuses = filteredStatuses.filter(status => status.professionalType === professionalType);
        }

        return NextResponse.json({
          success: true,
          integrationStatuses: filteredStatuses,
          count: filteredStatuses.length
        });

      case 'sync-events':
        // Get synchronization events
        let filteredEvents = sampleSyncEvents;
        
        const eventType = searchParams.get('type');
        const source = searchParams.get('source');
        const limit = parseInt(searchParams.get('limit') || '50');
        
        if (eventType) {
          filteredEvents = filteredEvents.filter(event => event.type === eventType);
        }
        
        if (source) {
          filteredEvents = filteredEvents.filter(event => event.source === source);
        }
        
        // Limit results
        filteredEvents = filteredEvents.slice(0, limit);

        return NextResponse.json({
          success: true,
          syncEvents: filteredEvents,
          count: filteredEvents.length
        });

      case 'notifications':
        // Get notification routes
        let filteredNotifications = sampleNotificationRoutes;
        
        const notificationType = searchParams.get('notificationType');
        const priority = searchParams.get('priority');
        const unreadOnly = searchParams.get('unreadOnly') === 'true';
        
        if (notificationType) {
          filteredNotifications = filteredNotifications.filter(notif => notif.notificationType === notificationType);
        }
        
        if (priority) {
          filteredNotifications = filteredNotifications.filter(notif => notif.priority === priority);
        }
        
        if (unreadOnly) {
          filteredNotifications = filteredNotifications.filter(notif => !notif.read);
        }

        return NextResponse.json({
          success: true,
          notifications: filteredNotifications,
          count: filteredNotifications.length,
          unreadCount: sampleNotificationRoutes.filter(n => !n.read).length
        });

      case 'health':
        // Get overall integration health
        const healthMetrics = {
          overallHealth: 'healthy',
          totalIntegrations: sampleIntegrationStatuses.length,
          activeIntegrations: sampleIntegrationStatuses.filter(s => s.syncStatus === 'active').length,
          averageDataConsistency: sampleIntegrationStatuses.reduce((acc, s) => acc + s.dataConsistency, 0) / sampleIntegrationStatuses.length,
          totalSyncEvents: sampleSyncEvents.length,
          processedEvents: sampleSyncEvents.filter(e => e.processed).length,
          pendingNotifications: sampleNotificationRoutes.filter(n => !n.read && n.actionRequired).length,
          professionalTypes: {
            'quantity-surveyor': sampleIntegrationStatuses.filter(s => s.professionalType === 'quantity-surveyor').length,
            'architect': sampleIntegrationStatuses.filter(s => s.professionalType === 'architect').length,
            'engineer': sampleIntegrationStatuses.filter(s => s.professionalType === 'engineer').length
          },
          lastActivity: new Date().toISOString()
        };

        return NextResponse.json({
          success: true,
          health: healthMetrics
        });

      case 'dashboard-data':
        // Get comprehensive data for developer dashboard integration
        const projectFilter = projectId ? 
          sampleIntegrationStatuses.filter(s => s.projectId.toLowerCase().replace(/\s+/g, '-') === projectId) :
          sampleIntegrationStatuses;

        const dashboardData = {
          professionals: projectFilter.map(status => ({
            id: status.professionalId,
            type: status.professionalType,
            projectId: status.projectId,
            syncStatus: status.syncStatus,
            dataConsistency: status.dataConsistency,
            lastActivity: status.integrationHealth.lastActivity,
            connection: status.integrationHealth.connection
          })),
          recentActivity: sampleSyncEvents.slice(-10).reverse(),
          pendingNotifications: sampleNotificationRoutes.filter(n => !n.read),
          integrationHealth: {
            overall: 'healthy',
            consistency: projectFilter.reduce((acc, s) => acc + s.dataConsistency, 0) / projectFilter.length,
            activeConnections: projectFilter.filter(s => s.syncStatus === 'active').length,
            totalConnections: projectFilter.length
          }
        };

        return NextResponse.json({
          success: true,
          dashboardData
        });

      default:
        // Default: return comprehensive integration overview
        return NextResponse.json({
          success: true,
          integrationStatuses: sampleIntegrationStatuses,
          syncEvents: sampleSyncEvents.slice(-20),
          notifications: sampleNotificationRoutes,
          summary: {
            totalIntegrations: sampleIntegrationStatuses.length,
            activeIntegrations: sampleIntegrationStatuses.filter(s => s.syncStatus === 'active').length,
            recentEvents: sampleSyncEvents.length,
            pendingNotifications: sampleNotificationRoutes.filter(n => !n.read).length
          }
        });
    }
  } catch (error) {
    console.error('Professional integration API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch integration data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'trigger-sync':
        // Manually trigger synchronization
        const syncEvent: SyncEvent = {
          id: `sync-${Date.now()}`,
          type: data.type || 'data-sync',
          source: data.source || 'developer-dashboard',
          target: data.target,
          data: data.syncData,
          timestamp: new Date().toISOString(),
          processed: false
        };

        return NextResponse.json({
          success: true,
          syncEvent,
          message: 'Synchronization triggered successfully'
        });

      case 'send-notification':
        // Send notification from professional to developer
        const notification: NotificationRoute = {
          id: `notif-${Date.now()}`,
          fromProfessional: data.fromProfessional,
          toDeveloper: data.toDeveloper,
          notificationType: data.notificationType,
          priority: data.priority || 'medium',
          message: data.message,
          timestamp: new Date().toISOString(),
          read: false,
          actionRequired: data.actionRequired || false
        };

        return NextResponse.json({
          success: true,
          notification,
          message: 'Notification sent successfully'
        });

      case 'update-integration':
        // Update integration settings
        return NextResponse.json({
          success: true,
          integrationUpdate: {
            professionalId: data.professionalId,
            settings: data.settings,
            updatedAt: new Date().toISOString()
          },
          message: 'Integration settings updated successfully'
        });

      case 'enable-sync':
        // Enable synchronization for a professional
        return NextResponse.json({
          success: true,
          syncEnabled: {
            professionalId: data.professionalId,
            enabled: true,
            enabledAt: new Date().toISOString()
          },
          message: 'Synchronization enabled successfully'
        });

      case 'disable-sync':
        // Disable synchronization for a professional
        return NextResponse.json({
          success: true,
          syncDisabled: {
            professionalId: data.professionalId,
            enabled: false,
            disabledAt: new Date().toISOString()
          },
          message: 'Synchronization disabled successfully'
        });

      default:
        return NextResponse.json({ 
          error: 'Invalid action' 
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Professional integration POST error:', error);
    return NextResponse.json({ 
      error: 'Failed to process integration request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationId, markAsRead } = body;

    if (markAsRead) {
      return NextResponse.json({
        success: true,
        notification: {
          id: notificationId,
          read: true,
          readAt: new Date().toISOString()
        },
        message: 'Notification marked as read'
      });
    }

    return NextResponse.json({
      success: true,
      updated: {
        id: body.id,
        updatedAt: new Date().toISOString()
      },
      message: 'Integration data updated successfully'
    });
  } catch (error) {
    console.error('Professional integration PUT error:', error);
    return NextResponse.json({ 
      error: 'Failed to update integration data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const integrationId = searchParams.get('integrationId');
    const notificationId = searchParams.get('notificationId');

    if (integrationId) {
      return NextResponse.json({
        success: true,
        deletedIntegrationId: integrationId,
        message: 'Integration removed successfully'
      });
    }

    if (notificationId) {
      return NextResponse.json({
        success: true,
        deletedNotificationId: notificationId,
        message: 'Notification deleted successfully'
      });
    }

    return NextResponse.json({ 
      error: 'Integration ID or Notification ID required' 
    }, { status: 400 });
  } catch (error) {
    console.error('Professional integration DELETE error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete integration data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}