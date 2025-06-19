import { NextRequest, NextResponse } from 'next/server';
import { conversationThreadingService } from '@/services/ConversationThreadingService';
import { userService } from '@/lib/services/users-production';

/**
 * Conversation Threading API
 * Handles advanced conversation management, threading, and search
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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const conversationId = searchParams.get('conversation_id');

    switch (type) {
      case 'threads':
        // Get thread structure for a conversation
        if (!conversationId) {
          return NextResponse.json(
            { error: 'conversation_id is required for threads' },
            { status: 400 }
          );
        }

        const threads = conversationThreadingService.getConversationThreads(conversationId);
        return NextResponse.json({
          success: true,
          threads,
          count: threads.length
        });

      case 'context':
        // Get conversation context
        if (!conversationId) {
          return NextResponse.json(
            { error: 'conversation_id is required for context' },
            { status: 400 }
          );
        }

        const context = conversationThreadingService.getConversationContext(conversationId);
        return NextResponse.json({
          success: true,
          context
        });

      case 'summary':
        // Get or generate conversation summary
        if (!conversationId) {
          return NextResponse.json(
            { error: 'conversation_id is required for summary' },
            { status: 400 }
          );
        }

        let summary = conversationThreadingService.getConversationSummary(conversationId);
        if (!summary) {
          summary = await conversationThreadingService.generateSummary(conversationId);
        }

        return NextResponse.json({
          success: true,
          summary
        });

      case 'analytics':
        // Get conversation analytics
        if (!conversationId) {
          return NextResponse.json(
            { error: 'conversation_id is required for analytics' },
            { status: 400 }
          );
        }

        const fromDate = searchParams.get('from') ? new Date(searchParams.get('from')!) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const toDate = searchParams.get('to') ? new Date(searchParams.get('to')!) : new Date();

        const analytics = await conversationThreadingService.generateAnalytics(conversationId, {
          from: fromDate,
          to: toDate
        });

        return NextResponse.json({
          success: true,
          analytics
        });

      case 'search':
        // Search conversations
        const query = searchParams.get('q') || '';
        const contextTypes = searchParams.get('context_types')?.split(',') || [];
        const participants = searchParams.get('participants')?.split(',') || [];
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = parseInt(searchParams.get('offset') || '0');
        const sortField = searchParams.get('sort') || 'relevance';
        const sortDirection = searchParams.get('direction') || 'desc';

        const searchResults = await conversationThreadingService.searchConversations({
          query,
          filters: {
            contextTypes: contextTypes.length > 0 ? contextTypes : undefined,
            participantIds: participants.length > 0 ? participants : undefined
          },
          sorting: {
            field: sortField as any,
            direction: sortDirection as any
          },
          pagination: {
            limit,
            offset
          }
        });

        return NextResponse.json({
          success: true,
          ...searchResults
        });

      default:
        return NextResponse.json(
          { error: 'Invalid request type' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Conversations API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Create conversation elements (threads, contexts, action items)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...params } = body;

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

    switch (type) {
      case 'thread':
        // Create a new message thread
        const { messageId, conversationId, parentMessageId, metadata } = params;
        
        if (!messageId || !conversationId) {
          return NextResponse.json(
            { error: 'messageId and conversationId are required' },
            { status: 400 }
          );
        }

        const thread = await conversationThreadingService.createThread({
          messageId,
          conversationId,
          parentMessageId,
          metadata
        });

        return NextResponse.json({
          success: true,
          thread,
          message: 'Thread created successfully'
        });

      case 'context':
        // Create conversation context
        const contextData = {
          conversationId: params.conversationId,
          contextType: params.contextType,
          entityId: params.entityId,
          entityType: params.entityType,
          title: params.title,
          description: params.description,
          tags: params.tags,
          priority: params.priority,
          assignedTo: params.assignedTo,
          watchers: params.watchers,
          metadata: params.metadata
        };

        if (!contextData.conversationId || !contextData.contextType || !contextData.title) {
          return NextResponse.json(
            { error: 'conversationId, contextType, and title are required' },
            { status: 400 }
          );
        }

        const context = await conversationThreadingService.createContext(contextData);

        return NextResponse.json({
          success: true,
          context,
          message: 'Context created successfully'
        });

      case 'action_item':
        // Create action item
        const actionItemData = {
          conversationId: params.conversationId,
          description: params.description,
          assignedTo: params.assignedTo,
          dueDate: params.dueDate ? new Date(params.dueDate) : undefined,
          priority: params.priority,
          metadata: params.metadata
        };

        if (!actionItemData.conversationId || !actionItemData.description) {
          return NextResponse.json(
            { error: 'conversationId and description are required' },
            { status: 400 }
          );
        }

        const actionItem = await conversationThreadingService.createActionItem(actionItemData);

        return NextResponse.json({
          success: true,
          actionItem,
          message: 'Action item created successfully'
        });

      case 'summary':
        // Generate conversation summary
        if (!params.conversationId) {
          return NextResponse.json(
            { error: 'conversationId is required' },
            { status: 400 }
          );
        }

        const summary = await conversationThreadingService.generateSummary(params.conversationId);

        return NextResponse.json({
          success: true,
          summary,
          message: 'Summary generated successfully'
        });

      default:
        return NextResponse.json(
          { error: 'Invalid creation type' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Conversation creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create conversation element' },
      { status: 500 }
    );
  }
}

/**
 * Update conversation elements
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id, ...updates } = body;

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

    switch (type) {
      case 'context':
        // Update conversation context
        if (!id) {
          return NextResponse.json(
            { error: 'Context ID is required' },
            { status: 400 }
          );
        }

        const updatedContext = await conversationThreadingService.updateContext(id, updates);

        return NextResponse.json({
          success: true,
          context: updatedContext,
          message: 'Context updated successfully'
        });

      case 'archive':
        // Archive conversation
        if (!updates.conversationId) {
          return NextResponse.json(
            { error: 'conversationId is required' },
            { status: 400 }
          );
        }

        await conversationThreadingService.archiveConversation(
          updates.conversationId,
          updates.reason
        );

        return NextResponse.json({
          success: true,
          message: 'Conversation archived successfully'
        });

      default:
        return NextResponse.json(
          { error: 'Invalid update type' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Conversation update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update conversation element' },
      { status: 500 }
    );
  }
}