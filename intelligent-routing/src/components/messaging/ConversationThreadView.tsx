'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  ChevronRight,
  ChevronDown,
  Reply,
  Hash,
  Clock,
  Users,
  Tag,
  TrendingUp,
  Archive,
  Star,
  MoreVertical,
  Search,
  Filter,
  Calendar,
  Target,
  CheckSquare,
  AlertCircle,
  User,
  Brain,
  BarChart3,
  FileText,
  Plus,
  X
} from 'lucide-react';
import { MessageThread, ConversationContext, ConversationSummary, ConversationAnalytics } from '@/services/ConversationThreadingService';

interface ConversationThreadViewProps {
  conversationId: string;
  className?: string;
}

export function ConversationThreadView({ conversationId, className = '' }: ConversationThreadViewProps) {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [context, setContext] = useState<ConversationContext | null>(null);
  const [summary, setSummary] = useState<ConversationSummary | null>(null);
  const [analytics, setAnalytics] = useState<ConversationAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'threads' | 'summary' | 'analytics' | 'context'>('threads');
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewActionItem, setShowNewActionItem] = useState(false);

  useEffect(() => {
    fetchConversationData();
  }, [conversationId]);

  const fetchConversationData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch threads, context, and summary in parallel
      const [threadsRes, contextRes, summaryRes] = await Promise.all([
        fetch(`/api/conversations?type=threads&conversation_id=${conversationId}`, {
          credentials: 'include'
        }),
        fetch(`/api/conversations?type=context&conversation_id=${conversationId}`, {
          credentials: 'include'
        }),
        fetch(`/api/conversations?type=summary&conversation_id=${conversationId}`, {
          credentials: 'include'
        })
      ]);

      if (threadsRes.ok) {
        const threadsData = await threadsRes.json();
        setThreads(threadsData.threads || []);
      }

      if (contextRes.ok) {
        const contextData = await contextRes.json();
        setContext(contextData.context);
      }

      if (summaryRes.ok) {
        const summaryData = await summaryRes.json();
        setSummary(summaryData.summary);
      }

    } catch (err: any) {
      setError(err.message || 'Failed to load conversation data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/conversations?type=analytics&conversation_id=${conversationId}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  const toggleThreadExpansion = (threadId: string) => {
    const newExpanded = new Set(expandedThreads);
    if (newExpanded.has(threadId)) {
      newExpanded.delete(threadId);
    } else {
      newExpanded.add(threadId);
    }
    setExpandedThreads(newExpanded);
  };

  const createActionItem = async (description: string, assignedTo?: string, dueDate?: string) => {
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          type: 'action_item',
          conversationId,
          description,
          assignedTo,
          dueDate
        })
      });

      if (response.ok) {
        // Refresh summary to show new action item
        await fetchConversationData();
        setShowNewActionItem(false);
      }
    } catch (err) {
      console.error('Error creating action item:', err);
    }
  };

  const renderThreadTree = (thread: MessageThread, level: number = 0) => {
    const hasReplies = thread.replies && thread.replies.length > 0;
    const isExpanded = expandedThreads.has(thread.id);

    return (
      <div key={thread.id} className={`${level > 0 ? 'ml-6 border-l border-gray-200 pl-4' : ''}`}>
        <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
          {hasReplies && (
            <button
              onClick={() => toggleThreadExpansion(thread.id)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Hash size={14} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-900">
                Message {thread.messageId}
              </span>
              <span className="text-xs text-gray-500">
                Level {thread.level}
              </span>
              {thread.level > 0 && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  Reply
                </span>
              )}
            </div>
            
            <div className="text-xs text-gray-500 mb-2">
              Thread path: {thread.threadPath.join(' → ')}
            </div>
            
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {new Date(thread.createdAt).toLocaleString('en-IE')}
              </span>
              {hasReplies && (
                <span className="flex items-center gap-1">
                  <Reply size={12} />
                  {thread.replies.length} replies
                </span>
              )}
            </div>
          </div>

          <button className="p-1 hover:bg-gray-200 rounded transition-colors">
            <MoreVertical size={16} className="text-gray-500" />
          </button>
        </div>

        {hasReplies && isExpanded && (
          <div className="mt-2">
            {thread.replies.map(reply => renderThreadTree(reply, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderContext = () => {
    if (!context) {
      return (
        <div className="text-center py-8">
          <Target size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">No context information available</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-900">{context.title}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              context.status === 'active' ? 'bg-green-100 text-green-800' :
              context.status === 'resolved' ? 'bg-blue-100 text-blue-800' :
              context.status === 'archived' ? 'bg-gray-100 text-gray-800' :
              'bg-amber-100 text-amber-800'
            }`}>
              {context.status}
            </span>
          </div>
          
          {context.description && (
            <p className="text-blue-800 mb-4">{context.description}</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs font-medium text-blue-700 mb-1">Type</p>
              <p className="text-sm text-blue-900 capitalize">{context.contextType.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-700 mb-1">Priority</p>
              <p className="text-sm text-blue-900 capitalize">{context.priority}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-700 mb-1">Created</p>
              <p className="text-sm text-blue-900">{new Date(context.createdAt).toLocaleDateString('en-IE')}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-700 mb-1">Updated</p>
              <p className="text-sm text-blue-900">{new Date(context.updatedAt).toLocaleDateString('en-IE')}</p>
            </div>
          </div>

          {context.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {context.tags.map((tag, index) => (
                <span key={index} className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {(context.assignedTo.length > 0 || context.watchers.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {context.assignedTo.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Assigned To</h4>
                <div className="space-y-2">
                  {context.assignedTo.map((userId, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <User size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-700">{userId}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {context.watchers.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Watchers</h4>
                <div className="space-y-2">
                  {context.watchers.map((userId, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <User size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-700">{userId}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderSummary = () => {
    if (!summary) {
      return (
        <div className="text-center py-8">
          <Brain size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">No summary available</p>
          <button
            onClick={() => fetchConversationData()}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700"
          >
            Generate Summary
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Summary Overview */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <Brain size={20} className="text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">AI-Generated Summary</h3>
            <span className="text-xs text-green-700 bg-green-200 px-2 py-1 rounded">
              {new Date(summary.autoGeneratedAt).toLocaleDateString('en-IE')}
            </span>
          </div>
          
          <p className="text-green-800 mb-4">{summary.summary}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">{summary.participantCount}</div>
              <div className="text-xs text-green-600">Participants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">{summary.messageCount}</div>
              <div className="text-xs text-green-600">Messages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">{summary.threadCount}</div>
              <div className="text-xs text-green-600">Threads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">{summary.unreadCount}</div>
              <div className="text-xs text-green-600">Unread</div>
            </div>
          </div>
        </div>

        {/* Key Points */}
        {summary.keyPoints.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Key Points</h4>
            <div className="space-y-2">
              {summary.keyPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckSquare size={16} className="text-green-600 mt-0.5" />
                  <span className="text-sm text-gray-700">{point}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Items */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Action Items</h4>
            <button
              onClick={() => setShowNewActionItem(true)}
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
            >
              <Plus size={14} className="inline mr-1" />
              Add Action
            </button>
          </div>

          {showNewActionItem && (
            <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <input
                type="text"
                placeholder="Enter action item description..."
                className="w-full p-2 border border-gray-300 rounded mb-2"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    createActionItem(e.currentTarget.value);
                  }
                }}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Enter action item description..."]') as HTMLInputElement;
                    if (input?.value) {
                      createActionItem(input.value);
                    }
                  }}
                  className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowNewActionItem(false)}
                  className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {summary.actionItems.map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                <div className={`w-3 h-3 rounded-full mt-1 ${
                  item.status === 'completed' ? 'bg-green-500' :
                  item.status === 'in_progress' ? 'bg-blue-500' :
                  'bg-gray-400'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.description}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    {item.assignedTo && (
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {item.assignedTo}
                      </span>
                    )}
                    {item.dueDate && (
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(item.dueDate).toLocaleDateString('en-IE')}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded ${
                      item.status === 'completed' ? 'bg-green-100 text-green-800' :
                      item.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Common Topics */}
        {summary.commonTopics.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Common Topics</h4>
            <div className="flex flex-wrap gap-2">
              {summary.commonTopics.map((topic, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  #{topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAnalytics = () => {
    if (!analytics) {
      return (
        <div className="text-center py-8">
          <BarChart3 size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">No analytics available</p>
          <button
            onClick={fetchAnalytics}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700"
          >
            Generate Analytics
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Metrics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">{analytics.metrics.totalMessages}</div>
            <div className="text-xs text-blue-600">Total Messages</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-700">{analytics.metrics.totalThreads}</div>
            <div className="text-xs text-green-600">Total Threads</div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-amber-700">{analytics.metrics.averageResponseTime}m</div>
            <div className="text-xs text-amber-600">Avg Response</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-700">{analytics.metrics.participantEngagement.length}</div>
            <div className="text-xs text-purple-600">Active Users</div>
          </div>
        </div>

        {/* Participant Engagement */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Participant Engagement</h4>
          <div className="space-y-3">
            {analytics.metrics.participantEngagement.map((participant) => (
              <div key={participant.userId} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <User size={16} className="text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{participant.userId}</p>
                    <p className="text-xs text-gray-500">
                      Last active: {new Date(participant.lastActive).toLocaleDateString('en-IE')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{participant.messageCount} messages</div>
                  <div className="text-xs text-gray-500">{participant.averageResponseTime}m avg response</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Topics */}
        {analytics.metrics.topTopics.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Top Discussion Topics</h4>
            <div className="space-y-2">
              {analytics.metrics.topTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">#{topic.topic}</span>
                  <span className="text-sm font-medium text-gray-900">{topic.count} mentions</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trends */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Trends</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 border border-gray-200 rounded-lg">
              <p className="text-xs font-medium text-gray-700 mb-1">Message Volume</p>
              <p className={`text-sm font-medium ${
                analytics.trends.messageVolumeTrend === 'increasing' ? 'text-green-600' :
                analytics.trends.messageVolumeTrend === 'decreasing' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {analytics.trends.messageVolumeTrend}
              </p>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg">
              <p className="text-xs font-medium text-gray-700 mb-1">Response Time</p>
              <p className={`text-sm font-medium ${
                analytics.trends.responseTrend === 'improving' ? 'text-green-600' :
                analytics.trends.responseTrend === 'declining' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {analytics.trends.responseTrend}
              </p>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg">
              <p className="text-xs font-medium text-gray-700 mb-1">Participation</p>
              <p className={`text-sm font-medium ${
                analytics.trends.participationTrend === 'increasing' ? 'text-green-600' :
                analytics.trends.participationTrend === 'decreasing' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {analytics.trends.participationTrend}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeView) {
      case 'threads':
        return (
          <div>
            {threads.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">No message threads found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {threads.map(thread => renderThreadTree(thread))}
              </div>
            )}
          </div>
        );
      case 'context':
        return renderContext();
      case 'summary':
        return renderSummary();
      case 'analytics':
        return renderAnalytics();
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border shadow-sm p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <MessageSquare size={24} className="text-blue-600" />
            Conversation Analysis
          </h2>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Search size={16} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Filter size={16} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'threads', label: 'Thread Structure', icon: Hash },
            { key: 'context', label: 'Context', icon: Target },
            { key: 'summary', label: 'AI Summary', icon: Brain },
            { key: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveView(key as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {error ? (
          <div className="bg-red-100 border border-red-200 text-red-700 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
}