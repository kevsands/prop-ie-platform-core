// Advanced message search API with full-text search and filtering
import { NextRequest, NextResponse } from 'next/server';

interface SearchFilters {
  q: string; // Search query
  sender?: string;
  messageType?: string;
  priority?: string;
  dateFrom?: string;
  dateTo?: string;
  hasAttachments?: string;
  conversationType?: string;
  project?: string;
  page?: string;
  limit?: string;
}

interface SearchResult {
  id: string;
  conversationId: string;
  conversationTitle: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  messageType: string;
  priority: string;
  createdAt: string;
  hasAttachments: boolean;
  attachmentCount: number;
  snippet: string;
  relevanceScore: number;
}

// Mock data for advanced search demonstration
const mockMessages = [
  {
    id: 'msg_001',
    conversationId: 'conv_001',
    conversationTitle: 'Fitzgerald Gardens - Design Team Review',
    senderId: 'architect_001',
    senderName: 'David McCarthy',
    senderRole: 'architect',
    content: 'I\'ve completed the structural review for Unit 12A at Fitzgerald Gardens. The load calculations look good, but I need engineering sign-off on the beam specifications for the open-plan living area. Can we schedule a design meeting this week? The proposed steel beam upgrade will cost approximately €2,400 additional per unit.',
    messageType: 'text',
    priority: 'high',
    createdAt: '2025-07-02T10:30:00Z',
    hasAttachments: true,
    attachmentCount: 3,
    attachments: ['structural_plans.pdf', 'beam_specifications.dwg', 'cost_analysis.xlsx']
  },
  {
    id: 'msg_002',
    conversationId: 'conv_001',
    conversationTitle: 'Fitzgerald Gardens - Design Team Review',
    senderId: 'engineer_001',
    senderName: 'Sarah O\'Brien',
    senderRole: 'engineer',
    content: 'Reviewed the beam specs - we\'ll need to upgrade to 300x150mm steel beams for the 6m span. This will add €2,400 to the unit cost. I can provide detailed calculations and supplier quotes by Thursday. The structural integrity requirements for this span demand these specifications.',
    messageType: 'text',
    priority: 'high',
    createdAt: '2025-07-02T14:15:00Z',
    hasAttachments: true,
    attachmentCount: 2,
    attachments: ['engineering_calculations.pdf', 'supplier_quotes.xlsx']
  },
  {
    id: 'msg_003',
    conversationId: 'conv_002',
    conversationTitle: 'Unit 12A Customization Inquiry',
    senderId: 'buyer_001',
    senderName: 'John Murphy',
    senderRole: 'buyer',
    content: 'Hi, I\'m interested in potentially customizing the kitchen layout in Unit 12A. Could we discuss options for moving the island and upgrading the appliances? I understand there may be additional costs involved. Looking for premium finishes and possibly extending the kitchen into the dining area.',
    messageType: 'text',
    priority: 'normal',
    createdAt: '2025-07-02T16:45:00Z',
    hasAttachments: false,
    attachmentCount: 0,
    attachments: []
  },
  {
    id: 'msg_004',
    conversationId: 'conv_003',
    conversationTitle: 'Budget Variance Approval - Beam Upgrade',
    senderId: 'system',
    senderName: 'PROP.ie System',
    senderRole: 'admin',
    content: 'APPROVAL REQUIRED: Budget increase request for Fitzgerald Gardens Unit 12A - €2,400 for upgraded structural beams. Project timeline may be affected. CEO approval required for cost variance >€2,000. This approval is urgent due to construction schedule constraints.',
    messageType: 'approval_request',
    priority: 'executive',
    createdAt: '2025-07-02T18:00:00Z',
    hasAttachments: true,
    attachmentCount: 1,
    attachments: ['budget_variance_form.pdf']
  },
  {
    id: 'msg_005',
    conversationId: 'conv_004',
    conversationTitle: 'Weekly Design Review Meeting',
    senderId: 'developer_001',
    senderName: 'Development Manager',
    senderRole: 'developer',
    content: 'Meeting notes uploaded for this week\'s design review. Key action items: 1) Finalize beam specifications by Friday 2) Update cost projections 3) Schedule buyer consultation for Unit 12A customizations 4) Prepare executive briefing on budget variance. Next review scheduled for Friday.',
    messageType: 'text',
    priority: 'normal',
    createdAt: '2025-07-02T15:45:00Z',
    hasAttachments: true,
    attachmentCount: 4,
    attachments: ['meeting_notes.pdf', 'action_items.xlsx', 'timeline_update.pdf', 'budget_summary.xlsx']
  },
  {
    id: 'msg_006',
    conversationId: 'conv_005',
    conversationTitle: 'Construction Progress - Phase 1',
    senderId: 'site_manager_001',
    senderName: 'Patrick Kelly',
    senderRole: 'site_manager',
    content: 'Foundation work completed ahead of schedule. Ready to begin ground floor structure next week. Weather conditions have been favorable. Steel delivery confirmed for Monday. Concrete pour scheduled for Wednesday weather permitting.',
    messageType: 'progress_update',
    priority: 'normal',
    createdAt: '2025-07-02T16:30:00Z',
    hasAttachments: true,
    attachmentCount: 2,
    attachments: ['progress_photos.zip', 'schedule_update.pdf']
  },
  {
    id: 'msg_007',
    conversationId: 'conv_002',
    conversationTitle: 'Unit 12A Customization Inquiry',
    senderId: 'developer_001',
    senderName: 'Development Manager',
    senderRole: 'developer',
    content: 'Hi John, thanks for your interest in customizing Unit 12A. Kitchen modifications are possible at this stage. I\'ll have our design team prepare some options and cost estimates. Can we schedule a meeting next week to review the possibilities? We can explore premium appliance packages and layout modifications.',
    messageType: 'text',
    priority: 'normal',
    createdAt: '2025-07-02T17:30:00Z',
    hasAttachments: false,
    attachmentCount: 0,
    attachments: []
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters: SearchFilters = {
      q: searchParams.get('q') || '',
      sender: searchParams.get('sender') || '',
      messageType: searchParams.get('messageType') || '',
      priority: searchParams.get('priority') || '',
      dateFrom: searchParams.get('dateFrom') || '',
      dateTo: searchParams.get('dateTo') || '',
      hasAttachments: searchParams.get('hasAttachments') || '',
      conversationType: searchParams.get('conversationType') || '',
      project: searchParams.get('project') || '',
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '20'
    };

    console.log('[Message Search] Searching with filters:', filters);

    let results = mockMessages;

    // Apply text search
    if (filters.q.trim()) {
      const searchTerm = filters.q.toLowerCase().trim();
      results = results.filter(msg => {
        const searchableText = [
          msg.content,
          msg.conversationTitle,
          msg.senderName,
          ...(msg.attachments || [])
        ].join(' ').toLowerCase();
        
        return searchableText.includes(searchTerm);
      });
    }

    // Apply sender filter
    if (filters.sender) {
      results = results.filter(msg => msg.senderRole === filters.sender);
    }

    // Apply message type filter
    if (filters.messageType) {
      results = results.filter(msg => msg.messageType === filters.messageType);
    }

    // Apply priority filter
    if (filters.priority) {
      results = results.filter(msg => msg.priority === filters.priority);
    }

    // Apply date filters
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      results = results.filter(msg => new Date(msg.createdAt) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      results = results.filter(msg => new Date(msg.createdAt) <= toDate);
    }

    // Apply attachments filter
    if (filters.hasAttachments === 'true') {
      results = results.filter(msg => msg.hasAttachments);
    }

    // Apply project filter (based on conversation title)
    if (filters.project) {
      const projectNames = {
        'fitzgerald-gardens': 'Fitzgerald Gardens',
        'ellwood': 'Ellwood',
        'ballymakenny-view': 'Ballymakenny View'
      };
      const projectName = projectNames[filters.project as keyof typeof projectNames];
      if (projectName) {
        results = results.filter(msg => msg.conversationTitle.includes(projectName));
      }
    }

    // Calculate relevance scores and create snippets
    const searchResults: SearchResult[] = results.map(msg => {
      let relevanceScore = 0.5; // Base score
      let snippet = msg.content;

      if (filters.q.trim()) {
        const searchTerm = filters.q.toLowerCase();
        const contentLower = msg.content.toLowerCase();
        
        // Higher score for title matches
        if (msg.conversationTitle.toLowerCase().includes(searchTerm)) {
          relevanceScore += 0.3;
        }
        
        // Higher score for exact phrase matches
        if (contentLower.includes(searchTerm)) {
          relevanceScore += 0.2;
        }
        
        // Create snippet around the search term
        const index = contentLower.indexOf(searchTerm);
        if (index !== -1) {
          const start = Math.max(0, index - 50);
          const end = Math.min(msg.content.length, index + searchTerm.length + 50);
          snippet = (start > 0 ? '...' : '') + 
                   msg.content.substring(start, end) + 
                   (end < msg.content.length ? '...' : '');
          relevanceScore += 0.1;
        }
      }

      // Boost score for urgent/executive messages
      if (msg.priority === 'urgent' || msg.priority === 'executive') {
        relevanceScore += 0.1;
      }

      // Boost score for messages with attachments
      if (msg.hasAttachments) {
        relevanceScore += 0.05;
      }

      // Limit snippet length
      if (snippet.length > 150) {
        snippet = snippet.substring(0, 147) + '...';
      }

      return {
        id: msg.id,
        conversationId: msg.conversationId,
        conversationTitle: msg.conversationTitle,
        senderId: msg.senderId,
        senderName: msg.senderName,
        senderRole: msg.senderRole,
        content: msg.content,
        messageType: msg.messageType,
        priority: msg.priority,
        createdAt: msg.createdAt,
        hasAttachments: msg.hasAttachments,
        attachmentCount: msg.attachmentCount,
        snippet,
        relevanceScore: Math.min(1, relevanceScore)
      };
    });

    // Sort by relevance score and then by date
    searchResults.sort((a, b) => {
      if (a.relevanceScore !== b.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Apply pagination
    const page = parseInt(filters.page || '1');
    const limit = parseInt(filters.limit || '20');
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedResults = searchResults.slice(startIndex, endIndex);

    // Calculate search statistics
    const stats = {
      totalResults: searchResults.length,
      searchTime: Math.random() * 50 + 10, // Mock search time
      topSenders: getTopSenders(searchResults),
      messageTypes: getMessageTypeDistribution(searchResults),
      timeRange: getTimeRange(searchResults)
    };

    return NextResponse.json({
      success: true,
      results: paginatedResults,
      total: searchResults.length,
      page,
      limit,
      hasMore: endIndex < searchResults.length,
      stats,
      filters: filters,
      message: `Found ${searchResults.length} result${searchResults.length !== 1 ? 's' : ''}`
    });

  } catch (error: any) {
    console.error('Message search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}

function getTopSenders(results: SearchResult[]) {
  const senders = results.reduce((acc, result) => {
    acc[result.senderName] = (acc[result.senderName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(senders)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));
}

function getMessageTypeDistribution(results: SearchResult[]) {
  const types = results.reduce((acc, result) => {
    acc[result.messageType] = (acc[result.messageType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(types).map(([type, count]) => ({ type, count }));
}

function getTimeRange(results: SearchResult[]) {
  if (results.length === 0) return null;

  const dates = results.map(r => new Date(r.createdAt).getTime());
  return {
    earliest: new Date(Math.min(...dates)).toISOString(),
    latest: new Date(Math.max(...dates)).toISOString()
  };
}