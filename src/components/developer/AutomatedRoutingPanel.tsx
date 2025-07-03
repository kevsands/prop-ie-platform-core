'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Settings,
  Plus,
  Edit,
  Trash2,
  ArrowRight,
  Bot,
  Users,
  MessageSquare,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  RotateCw,
  Zap,
  Filter,
  Bell,
  User
} from 'lucide-react';

interface RoutingRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  priority: number;
  conditions: RoutingCondition[];
  actions: RoutingAction[];
  createdAt: string;
  lastTriggered?: string;
  triggerCount: number;
  successRate: number;
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
  delay?: number; // in minutes
  template?: string;
}

interface AutomatedRoutingPanelProps {
  className?: string;
}

export function AutomatedRoutingPanel({ className = '' }: AutomatedRoutingPanelProps) {
  const [rules, setRules] = useState<RoutingRule[]>([]);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [editingRule, setEditingRule] = useState<RoutingRule | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRules: 0,
    activeRules: 0,
    messagesRouted: 0,
    averageResponseTime: 0
  });

  useEffect(() => {
    fetchRoutingRules();
    fetchRoutingStats();
  }, []);

  const fetchRoutingRules = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/messages/routing/rules');
      if (response.ok) {
        const data = await response.json();
        setRules(data.rules || []);
      }
    } catch (error) {
      console.error('Failed to fetch routing rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoutingStats = async () => {
    try {
      const response = await fetch('/api/messages/routing/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error('Failed to fetch routing stats:', error);
    }
  };

  const toggleRule = async (ruleId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/messages/routing/rules/${ruleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive })
      });

      if (response.ok) {
        setRules(prev => prev.map(rule => 
          rule.id === ruleId ? { ...rule, isActive } : rule
        ));
      }
    } catch (error) {
      console.error('Failed to toggle rule:', error);
    }
  };

  const deleteRule = async (ruleId: string) => {
    if (!confirm('Are you sure you want to delete this routing rule?')) return;

    try {
      const response = await fetch(`/api/messages/routing/rules/${ruleId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setRules(prev => prev.filter(rule => rule.id !== ruleId));
      }
    } catch (error) {
      console.error('Failed to delete rule:', error);
    }
  };

  const handleEditRule = (rule: RoutingRule) => {
    setEditingRule(rule);
    setShowRuleModal(true);
  };

  const handleCreateRule = () => {
    setEditingRule(null);
    setShowRuleModal(true);
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'bg-red-100 text-red-800';
    if (priority >= 6) return 'bg-orange-100 text-orange-800';
    if (priority >= 4) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatCondition = (condition: RoutingCondition) => {
    const typeLabels = {
      keyword: 'Contains keyword',
      sender_role: 'Sender role',
      priority: 'Priority',
      time_of_day: 'Time of day',
      project: 'Project',
      message_type: 'Message type',
      attachment_count: 'Attachment count',
      sentiment: 'Sentiment'
    };

    const operatorLabels = {
      contains: 'contains',
      equals: 'equals',
      greater_than: 'greater than',
      less_than: 'less than',
      between: 'between',
      not_contains: 'does not contain'
    };

    return `${typeLabels[condition.type]} ${operatorLabels[condition.operator]} "${Array.isArray(condition.value) ? condition.value.join(', ') : condition.value}"`;
  };

  const formatAction = (action: RoutingAction) => {
    const typeLabels = {
      assign_to: 'Assign to',
      set_priority: 'Set priority to',
      add_tag: 'Add tag',
      send_notification: 'Send notification to',
      create_task: 'Create task for',
      escalate: 'Escalate to',
      auto_reply: 'Send auto-reply',
      forward_to_team: 'Forward to team'
    };

    return `${typeLabels[action.type]} "${action.value}"${action.delay ? ` (after ${action.delay}min)` : ''}`;
  };

  // Mock data for demonstration
  const mockRules: RoutingRule[] = [
    {
      id: 'rule_001',
      name: 'Urgent Buyer Queries',
      description: 'Route urgent buyer inquiries to senior development team',
      isActive: true,
      priority: 9,
      conditions: [
        { type: 'keyword', operator: 'contains', value: ['urgent', 'asap', 'immediately'], caseSensitive: false },
        { type: 'sender_role', operator: 'equals', value: 'buyer' }
      ],
      actions: [
        { type: 'assign_to', value: 'senior_developer' },
        { type: 'set_priority', value: 'urgent' },
        { type: 'send_notification', value: 'development_manager' }
      ],
      createdAt: '2025-06-15T09:00:00Z',
      lastTriggered: '2025-07-02T14:30:00Z',
      triggerCount: 23,
      successRate: 94.5
    },
    {
      id: 'rule_002',
      name: 'Customization Requests',
      description: 'Route unit customization inquiries to design team',
      isActive: true,
      priority: 6,
      conditions: [
        { type: 'keyword', operator: 'contains', value: ['customize', 'modification', 'change layout', 'upgrade'], caseSensitive: false },
        { type: 'project', operator: 'equals', value: 'fitzgerald-gardens' }
      ],
      actions: [
        { type: 'forward_to_team', value: 'design_team' },
        { type: 'add_tag', value: 'customization' },
        { type: 'create_task', value: 'design_lead' }
      ],
      createdAt: '2025-06-20T11:15:00Z',
      lastTriggered: '2025-07-02T16:45:00Z',
      triggerCount: 18,
      successRate: 88.9
    },
    {
      id: 'rule_003',
      name: 'Executive Escalation',
      description: 'Escalate high-value issues to executive team',
      isActive: true,
      priority: 10,
      conditions: [
        { type: 'keyword', operator: 'contains', value: ['legal', 'complaint', 'media', 'council'] },
        { type: 'priority', operator: 'greater_than', value: '7' }
      ],
      actions: [
        { type: 'escalate', value: 'ceo' },
        { type: 'set_priority', value: 'executive' },
        { type: 'send_notification', value: 'executive_team' },
        { type: 'create_task', value: 'legal_team' }
      ],
      createdAt: '2025-06-10T08:30:00Z',
      lastTriggered: '2025-06-28T10:20:00Z',
      triggerCount: 5,
      successRate: 100
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
        { type: 'auto_reply', value: 'after_hours_template', template: 'Thank you for your message. We will respond during business hours (9 AM - 6 PM).' },
        { type: 'add_tag', value: 'after_hours' }
      ],
      createdAt: '2025-06-25T15:45:00Z',
      lastTriggered: '2025-07-01T19:30:00Z',
      triggerCount: 45,
      successRate: 96.2
    },
    {
      id: 'rule_005',
      name: 'Document Attachments',
      description: 'Route messages with legal documents to legal team',
      isActive: false,
      priority: 7,
      conditions: [
        { type: 'attachment_count', operator: 'greater_than', value: '0' },
        { type: 'keyword', operator: 'contains', value: ['contract', 'legal', 'solicitor', 'agreement'] }
      ],
      actions: [
        { type: 'forward_to_team', value: 'legal_team' },
        { type: 'add_tag', value: 'legal_document' },
        { type: 'send_notification', value: 'legal_manager' }
      ],
      createdAt: '2025-06-18T12:00:00Z',
      triggerCount: 8,
      successRate: 75.0
    }
  ];

  // Use mock data if no real data
  const displayRules = rules.length > 0 ? rules : mockRules;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Bot size={24} className="text-blue-600" />
            Automated Routing Rules
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Intelligent message routing and automated responses for buyer inquiries
          </p>
        </div>
        <Button onClick={handleCreateRule} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={16} className="mr-2" />
          Create Rule
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Settings size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Rules</p>
                <p className="text-xl font-semibold">{displayRules.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Rules</p>
                <p className="text-xl font-semibold">{displayRules.filter(r => r.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageSquare size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Messages Routed</p>
                <p className="text-xl font-semibold">{displayRules.reduce((sum, rule) => sum + rule.triggerCount, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock size={20} className="text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Success Rate</p>
                <p className="text-xl font-semibold">
                  {Math.round(displayRules.reduce((sum, rule) => sum + rule.successRate, 0) / displayRules.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading routing rules...</p>
          </div>
        ) : displayRules.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Bot size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No routing rules configured</h3>
              <p className="text-gray-600 mb-6">Create automated rules to intelligently route buyer inquiries</p>
              <Button onClick={handleCreateRule}>
                <Plus size={16} className="mr-2" />
                Create Your First Rule
              </Button>
            </CardContent>
          </Card>
        ) : (
          displayRules.map((rule) => (
            <Card key={rule.id} className={`${rule.isActive ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-gray-300'}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{rule.name}</h3>
                      <Badge className={getPriorityColor(rule.priority)}>
                        Priority {rule.priority}
                      </Badge>
                      {rule.isActive ? (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-4">{rule.description}</p>

                    {/* Conditions */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <Filter size={14} />
                        Conditions
                      </h4>
                      <div className="space-y-1">
                        {rule.conditions.map((condition, index) => (
                          <div key={index} className="text-sm text-gray-600 bg-gray-50 rounded px-2 py-1">
                            {formatCondition(condition)}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <Zap size={14} />
                        Actions
                      </h4>
                      <div className="space-y-1">
                        {rule.actions.map((action, index) => (
                          <div key={index} className="text-sm text-gray-600 bg-blue-50 rounded px-2 py-1">
                            {formatAction(action)}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Target size={12} />
                        {rule.triggerCount} triggers
                      </span>
                      <span className={`flex items-center gap-1 ${getSuccessRateColor(rule.successRate)}`}>
                        <CheckCircle2 size={12} />
                        {rule.successRate}% success
                      </span>
                      {rule.lastTriggered && (
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          Last: {new Date(rule.lastTriggered).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <Switch
                      checked={rule.isActive}
                      onCheckedChange={(checked) => toggleRule(rule.id, checked)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditRule(rule)}
                    >
                      <Edit size={14} className="mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteRule(rule.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Rule Modal */}
      {showRuleModal && (
        <RuleEditorModal
          isOpen={showRuleModal}
          onClose={() => {
            setShowRuleModal(false);
            setEditingRule(null);
          }}
          rule={editingRule}
          onSave={(rule) => {
            if (editingRule) {
              setRules(prev => prev.map(r => r.id === rule.id ? rule : r));
            } else {
              setRules(prev => [...prev, rule]);
            }
            setShowRuleModal(false);
            setEditingRule(null);
          }}
        />
      )}
    </div>
  );
}

// Rule Editor Modal Component
interface RuleEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  rule?: RoutingRule | null;
  onSave: (rule: RoutingRule) => void;
}

function RuleEditorModal({ isOpen, onClose, rule, onSave }: RuleEditorModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 5,
    isActive: true,
    conditions: [] as RoutingCondition[],
    actions: [] as RoutingAction[]
  });

  useEffect(() => {
    if (rule) {
      setFormData({
        name: rule.name,
        description: rule.description,
        priority: rule.priority,
        isActive: rule.isActive,
        conditions: rule.conditions,
        actions: rule.actions
      });
    } else {
      setFormData({
        name: '',
        description: '',
        priority: 5,
        isActive: true,
        conditions: [],
        actions: []
      });
    }
  }, [rule]);

  const handleSave = () => {
    const newRule: RoutingRule = {
      id: rule?.id || `rule_${Date.now()}`,
      ...formData,
      createdAt: rule?.createdAt || new Date().toISOString(),
      triggerCount: rule?.triggerCount || 0,
      successRate: rule?.successRate || 0
    };

    onSave(newRule);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {rule ? 'Edit Routing Rule' : 'Create New Routing Rule'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Rule Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Urgent Buyer Queries"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this rule does..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority (1-10)</Label>
              <Input
                id="priority"
                type="number"
                min="1"
                max="10"
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
              />
            </div>

            <div className="flex items-center space-x-2 mt-6">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
              <Label>Active</Label>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Quick Rule Templates</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    name: 'Urgent Buyer Queries',
                    description: 'Route urgent buyer inquiries to senior team',
                    priority: 9,
                    conditions: [{ type: 'keyword', operator: 'contains', value: ['urgent', 'asap'], caseSensitive: false }],
                    actions: [{ type: 'assign_to', value: 'senior_developer' }, { type: 'set_priority', value: 'urgent' }]
                  }));
                }}
              >
                Urgent Queries
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    name: 'Customization Requests',
                    description: 'Route customization inquiries to design team',
                    priority: 6,
                    conditions: [{ type: 'keyword', operator: 'contains', value: ['customize', 'modify'], caseSensitive: false }],
                    actions: [{ type: 'forward_to_team', value: 'design_team' }]
                  }));
                }}
              >
                Customizations
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!formData.name.trim()}>
            {rule ? 'Update Rule' : 'Create Rule'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}