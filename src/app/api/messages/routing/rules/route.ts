// API for managing automated message routing rules
import { NextRequest, NextResponse } from 'next/server';

interface RoutingRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  priority: number;
  conditions: RoutingCondition[];
  actions: RoutingAction[];
  createdAt: string;
  updatedAt: string;
  lastTriggered?: string;
  triggerCount: number;
  successRate: number;
  createdBy: string;
}

interface RoutingCondition {
  type: 'keyword' | 'sender_role' | 'priority' | 'time_of_day' | 'project' | 'message_type' | 'attachment_count' | 'sentiment';
  operator: 'contains' | 'equals' | 'greater_than' | 'less_than' | 'between' | 'not_contains';
  value: string | string[];
  caseSensitive?: boolean;
}

interface RoutingAction {
  type: 'assign_to' | 'set_priority' | 'add_tag' | 'send_notification' | 'create_task' | 'escalate' | 'auto_reply' | 'forward_to_team';
  value: string;
  delay?: number;
  template?: string;
}

// Mock routing rules for demonstration
const mockRules: RoutingRule[] = [
  {
    id: 'rule_001',
    name: 'Urgent Buyer Queries',
    description: 'Route urgent buyer inquiries to senior development team',
    isActive: true,
    priority: 9,
    conditions: [
      { type: 'keyword', operator: 'contains', value: ['urgent', 'asap', 'immediately', 'emergency'], caseSensitive: false },
      { type: 'sender_role', operator: 'equals', value: 'buyer' }
    ],
    actions: [
      { type: 'assign_to', value: 'senior_developer' },
      { type: 'set_priority', value: 'urgent' },
      { type: 'send_notification', value: 'development_manager' },
      { type: 'add_tag', value: 'urgent_buyer_query' }
    ],
    createdAt: '2025-06-15T09:00:00Z',
    updatedAt: '2025-07-01T14:30:00Z',
    lastTriggered: '2025-07-02T14:30:00Z',
    triggerCount: 23,
    successRate: 94.5,
    createdBy: 'developer_001'
  },
  {
    id: 'rule_002',
    name: 'Customization Requests',
    description: 'Route unit customization inquiries to design team',
    isActive: true,
    priority: 6,
    conditions: [
      { type: 'keyword', operator: 'contains', value: ['customize', 'modification', 'change layout', 'upgrade', 'personalize'], caseSensitive: false },
      { type: 'project', operator: 'equals', value: 'fitzgerald-gardens' }
    ],
    actions: [
      { type: 'forward_to_team', value: 'design_team' },
      { type: 'add_tag', value: 'customization' },
      { type: 'create_task', value: 'design_lead' },
      { type: 'auto_reply', value: 'customization_template', template: 'Thank you for your customization inquiry. Our design team will review your request and respond within 48 hours.' }
    ],
    createdAt: '2025-06-20T11:15:00Z',
    updatedAt: '2025-06-25T09:20:00Z',
    lastTriggered: '2025-07-02T16:45:00Z',
    triggerCount: 18,
    successRate: 88.9,
    createdBy: 'developer_001'
  },
  {
    id: 'rule_003',
    name: 'Executive Escalation',
    description: 'Escalate high-value issues to executive team',
    isActive: true,
    priority: 10,
    conditions: [
      { type: 'keyword', operator: 'contains', value: ['legal', 'complaint', 'media', 'council', 'court', 'solicitor issue'] },
      { type: 'priority', operator: 'greater_than', value: '7' }
    ],
    actions: [
      { type: 'escalate', value: 'ceo' },
      { type: 'set_priority', value: 'executive' },
      { type: 'send_notification', value: 'executive_team' },
      { type: 'create_task', value: 'legal_team' },
      { type: 'add_tag', value: 'executive_escalation' }
    ],
    createdAt: '2025-06-10T08:30:00Z',
    updatedAt: '2025-06-15T16:45:00Z',
    lastTriggered: '2025-06-28T10:20:00Z',
    triggerCount: 5,
    successRate: 100,
    createdBy: 'ceo_001'
  },
  {
    id: 'rule_004',
    name: 'After Hours Support',
    description: 'Auto-reply to messages received outside business hours',
    isActive: true,
    priority: 3,
    conditions: [
      { type: 'time_of_day', operator: 'between', value: ['18:00', '09:00'] }
    ],
    actions: [
      { type: 'auto_reply', value: 'after_hours_template', template: 'Thank you for your message. Our team is currently out of office (9 AM - 6 PM, Monday-Friday). We will respond to your inquiry during our next business day.' },
      { type: 'add_tag', value: 'after_hours' }
    ],
    createdAt: '2025-06-25T15:45:00Z',
    updatedAt: '2025-06-30T12:00:00Z',
    lastTriggered: '2025-07-01T19:30:00Z',
    triggerCount: 45,
    successRate: 96.2,
    createdBy: 'developer_001'
  },
  {
    id: 'rule_005',
    name: 'Legal Document Processing',
    description: 'Route messages with legal documents to legal team',
    isActive: false,
    priority: 7,
    conditions: [
      { type: 'attachment_count', operator: 'greater_than', value: '0' },
      { type: 'keyword', operator: 'contains', value: ['contract', 'legal document', 'solicitor', 'agreement', 'deed'] }
    ],
    actions: [
      { type: 'forward_to_team', value: 'legal_team' },
      { type: 'add_tag', value: 'legal_document' },
      { type: 'send_notification', value: 'legal_manager' },
      { type: 'create_task', value: 'legal_review' }
    ],
    createdAt: '2025-06-18T12:00:00Z',
    updatedAt: '2025-06-22T14:15:00Z',
    triggerCount: 8,
    successRate: 75.0,
    createdBy: 'legal_manager_001'
  },
  {
    id: 'rule_006',
    name: 'Payment Queries',
    description: 'Route payment and financing inquiries to finance team',
    isActive: true,
    priority: 5,
    conditions: [
      { type: 'keyword', operator: 'contains', value: ['payment', 'finance', 'mortgage', 'deposit', 'installment', 'loan'] },
      { type: 'sender_role', operator: 'equals', value: 'buyer' }
    ],
    actions: [
      { type: 'forward_to_team', value: 'finance_team' },
      { type: 'add_tag', value: 'payment_query' },
      { type: 'auto_reply', value: 'finance_template', template: 'Thank you for your financing inquiry. Our finance team will contact you within 24 hours to discuss your options.' }
    ],
    createdAt: '2025-06-28T10:30:00Z',
    updatedAt: '2025-07-01T09:15:00Z',
    lastTriggered: '2025-07-02T11:20:00Z',
    triggerCount: 12,
    successRate: 91.7,
    createdBy: 'finance_manager_001'
  }
];

// GET /api/messages/routing/rules - Fetch all routing rules
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('active');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    console.log('[Routing Rules] Fetching rules with filters:', { isActive, limit, offset });

    let rules = mockRules;

    // Filter by active status
    if (isActive !== null) {
      const activeFilter = isActive === 'true';
      rules = rules.filter(rule => rule.isActive === activeFilter);
    }

    // Sort by priority (highest first) then by update date
    rules.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    // Apply pagination
    const paginatedRules = rules.slice(offset, offset + limit);

    // Calculate summary statistics
    const summary = {
      totalRules: rules.length,
      activeRules: rules.filter(r => r.isActive).length,
      inactiveRules: rules.filter(r => !r.isActive).length,
      totalTriggers: rules.reduce((sum, rule) => sum + rule.triggerCount, 0),
      averageSuccessRate: rules.length > 0 ? 
        Math.round(rules.reduce((sum, rule) => sum + rule.successRate, 0) / rules.length * 10) / 10 : 0,
      recentlyTriggered: rules.filter(r => r.lastTriggered && 
        new Date(r.lastTriggered) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length
    };

    return NextResponse.json({
      success: true,
      rules: paginatedRules,
      total: rules.length,
      summary,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < rules.length
      },
      message: `Retrieved ${paginatedRules.length} routing rule${paginatedRules.length !== 1 ? 's' : ''}`
    });

  } catch (error: any) {
    console.error('Routing rules fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch routing rules' },
      { status: 500 }
    );
  }
}

// POST /api/messages/routing/rules - Create new routing rule
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, priority, conditions, actions, isActive = true } = body;

    // Validate required fields
    if (!name || !description || !conditions || !actions) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, conditions, actions' },
        { status: 400 }
      );
    }

    // Validate priority
    if (priority < 1 || priority > 10) {
      return NextResponse.json(
        { error: 'Priority must be between 1 and 10' },
        { status: 400 }
      );
    }

    // Validate conditions
    for (const condition of conditions) {
      if (!condition.type || !condition.operator || condition.value === undefined) {
        return NextResponse.json(
          { error: 'Invalid condition format' },
          { status: 400 }
        );
      }
    }

    // Validate actions
    for (const action of actions) {
      if (!action.type || !action.value) {
        return NextResponse.json(
          { error: 'Invalid action format' },
          { status: 400 }
        );
      }
    }

    const newRule: RoutingRule = {
      id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      description: description.trim(),
      isActive,
      priority,
      conditions,
      actions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      triggerCount: 0,
      successRate: 0,
      createdBy: 'current_user' // In production, get from auth context
    };

    // In production, save to database
    // await prisma.routingRule.create({ data: newRule });

    console.log('[Routing Rules] Created new rule:', newRule.name);

    return NextResponse.json({
      success: true,
      rule: newRule,
      message: `Routing rule "${newRule.name}" created successfully`
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create routing rule error:', error);
    return NextResponse.json(
      { error: 'Failed to create routing rule' },
      { status: 500 }
    );
  }
}

// Route evaluation function - checks if a message matches routing conditions
export function evaluateRoutingRules(message: any, rules: RoutingRule[]): RoutingRule[] {
  const matchedRules = [];

  for (const rule of rules.filter(r => r.isActive)) {
    let allConditionsMet = true;

    for (const condition of rule.conditions) {
      if (!evaluateCondition(message, condition)) {
        allConditionsMet = false;
        break;
      }
    }

    if (allConditionsMet) {
      matchedRules.push(rule);
    }
  }

  // Sort by priority (highest first)
  return matchedRules.sort((a, b) => b.priority - a.priority);
}

function evaluateCondition(message: any, condition: RoutingCondition): boolean {
  const { type, operator, value, caseSensitive = false } = condition;

  switch (type) {
    case 'keyword':
      const content = caseSensitive ? message.content : message.content.toLowerCase();
      const keywords = Array.isArray(value) ? value : [value];
      
      switch (operator) {
        case 'contains':
          return keywords.some(keyword => 
            content.includes(caseSensitive ? keyword : keyword.toLowerCase())
          );
        case 'not_contains':
          return !keywords.some(keyword => 
            content.includes(caseSensitive ? keyword : keyword.toLowerCase())
          );
        default:
          return false;
      }

    case 'sender_role':
      switch (operator) {
        case 'equals':
          return message.senderRole === value;
        default:
          return false;
      }

    case 'priority':
      const priorityMap = { low: 1, normal: 3, high: 6, urgent: 8, executive: 10 };
      const messagePriority = priorityMap[message.priority as keyof typeof priorityMap] || 3;
      const conditionPriority = typeof value === 'string' ? parseInt(value) : value;

      switch (operator) {
        case 'equals':
          return messagePriority === conditionPriority;
        case 'greater_than':
          return messagePriority > conditionPriority;
        case 'less_than':
          return messagePriority < conditionPriority;
        default:
          return false;
      }

    case 'time_of_day':
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      if (operator === 'between' && Array.isArray(value) && value.length === 2) {
        const [start, end] = value;
        // Handle overnight time ranges (e.g., 18:00 to 09:00)
        if (start > end) {
          return currentTime >= start || currentTime <= end;
        }
        return currentTime >= start && currentTime <= end;
      }
      return false;

    case 'project':
      switch (operator) {
        case 'equals':
          return message.projectId === value;
        default:
          return false;
      }

    case 'message_type':
      switch (operator) {
        case 'equals':
          return message.messageType === value;
        default:
          return false;
      }

    case 'attachment_count':
      const attachmentCount = message.attachments ? message.attachments.length : 0;
      const conditionCount = typeof value === 'string' ? parseInt(value) : value;

      switch (operator) {
        case 'equals':
          return attachmentCount === conditionCount;
        case 'greater_than':
          return attachmentCount > conditionCount;
        case 'less_than':
          return attachmentCount < conditionCount;
        default:
          return false;
      }

    default:
      return false;
  }
}