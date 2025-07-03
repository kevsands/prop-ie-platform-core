'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  Calendar,
  User,
  MessageSquare,
  Clock,
  FileText,
  Archive,
  ChevronDown,
  ChevronRight,
  X,
  Settings,
  Crown,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

interface MessageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMessage: (messageId: string, conversationId: string) => void;
}

interface SearchFilters {
  query: string;
  sender: string;
  messageType: string;
  priority: string;
  dateFrom: string;
  dateTo: string;
  hasAttachments: boolean;
  conversationType: string;
  project: string;
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

export function MessageSearchModal({ isOpen, onClose, onSelectMessage }: MessageSearchModalProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    sender: '',
    messageType: '',
    priority: '',
    dateFrom: '',
    dateTo: '',
    hasAttachments: false,
    conversationType: '',
    project: ''
  });

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Debounced search
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const performSearch = useCallback(async (searchFilters: SearchFilters, page: number = 1) => {
    if (!searchFilters.query.trim() && !hasActiveFilters(searchFilters)) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        q: searchFilters.query,
        sender: searchFilters.sender,
        messageType: searchFilters.messageType,
        priority: searchFilters.priority,
        dateFrom: searchFilters.dateFrom,
        dateTo: searchFilters.dateTo,
        hasAttachments: searchFilters.hasAttachments.toString(),
        conversationType: searchFilters.conversationType,
        project: searchFilters.project,
        page: page.toString(),
        limit: '20'
      });

      const response = await fetch(`/api/messages/search?${queryParams}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResults(data.results || []);
      setTotalResults(data.total || 0);
      setCurrentPage(page);

      // Add to search history
      if (searchFilters.query.trim()) {
        setSearchHistory(prev => {
          const newHistory = [searchFilters.query, ...prev.filter(q => q !== searchFilters.query)];
          return newHistory.slice(0, 10); // Keep last 10 searches
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback((searchFilters: SearchFilters) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      performSearch(searchFilters);
    }, 300); // 300ms debounce

    setSearchTimeout(timeout);
  }, [performSearch, searchTimeout]);

  const hasActiveFilters = (searchFilters: SearchFilters) => {
    return searchFilters.sender || 
           searchFilters.messageType || 
           searchFilters.priority || 
           searchFilters.dateFrom || 
           searchFilters.dateTo || 
           searchFilters.hasAttachments ||
           searchFilters.conversationType ||
           searchFilters.project;
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    handleSearch(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      query: filters.query, // Keep search query
      sender: '',
      messageType: '',
      priority: '',
      dateFrom: '',
      dateTo: '',
      hasAttachments: false,
      conversationType: '',
      project: ''
    };
    setFilters(clearedFilters);
    handleSearch(clearedFilters);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'system': return <Settings size={12} className="text-amber-500" />;
      case 'approval_request': return <Crown size={12} className="text-red-500" />;
      case 'document': return <FileText size={12} className="text-blue-500" />;
      default: return <MessageSquare size={12} className="text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      urgent: 'bg-red-100 text-red-800',
      executive: 'bg-purple-100 text-purple-800',
      high: 'bg-orange-100 text-orange-800',
      normal: 'bg-gray-100 text-gray-800',
      low: 'bg-green-100 text-green-800'
    };

    return (
      <Badge className={`text-xs ${styles[priority as keyof typeof styles] || styles.normal}`}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? 
        <mark key={index} className="bg-yellow-200 px-0.5 rounded">{part}</mark> : 
        part
    );
  };

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search size={20} className="text-blue-600" />
            Search Messages
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
          {/* Search Input */}
          <div className="space-y-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                value={filters.query}
                onChange={(e) => updateFilter('query', e.target.value)}
                placeholder="Search messages, attachments, participants..."
                className="pl-10 pr-4"
                autoFocus
              />
            </div>

            {/* Search History */}
            {searchHistory.length > 0 && !filters.query && (
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-gray-500">Recent searches:</span>
                {searchHistory.slice(0, 5).map((query, index) => (
                  <button
                    key={index}
                    onClick={() => updateFilter('query', query)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                  >
                    {query}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
            >
              <Filter size={14} />
              Advanced Filters
              {showAdvancedFilters ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>

            {hasActiveFilters(filters) && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X size={14} className="mr-1" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <Label className="text-xs">Sender</Label>
                <Select value={filters.sender} onValueChange={(value) => updateFilter('sender', value)}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Any sender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any sender</SelectItem>
                    <SelectItem value="developer">Development Team</SelectItem>
                    <SelectItem value="architect">Architects</SelectItem>
                    <SelectItem value="engineer">Engineers</SelectItem>
                    <SelectItem value="buyer">Buyers</SelectItem>
                    <SelectItem value="ceo">Executive Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Message Type</Label>
                <Select value={filters.messageType} onValueChange={(value) => updateFilter('messageType', value)}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Any type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any type</SelectItem>
                    <SelectItem value="text">Text Messages</SelectItem>
                    <SelectItem value="document">Documents</SelectItem>
                    <SelectItem value="system">System Messages</SelectItem>
                    <SelectItem value="approval_request">Approval Requests</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Priority</Label>
                <Select value={filters.priority} onValueChange={(value) => updateFilter('priority', value)}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Any priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any priority</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">From Date</Label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => updateFilter('dateFrom', e.target.value)}
                  className="h-8"
                />
              </div>

              <div>
                <Label className="text-xs">To Date</Label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => updateFilter('dateTo', e.target.value)}
                  className="h-8"
                />
              </div>

              <div>
                <Label className="text-xs">Project</Label>
                <Select value={filters.project} onValueChange={(value) => updateFilter('project', value)}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Any project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any project</SelectItem>
                    <SelectItem value="fitzgerald-gardens">Fitzgerald Gardens</SelectItem>
                    <SelectItem value="ellwood">Ellwood</SelectItem>
                    <SelectItem value="ballymakenny-view">Ballymakenny View</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Searching...</span>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{totalResults} result{totalResults !== 1 ? 's' : ''} found</span>
                  {totalResults > 20 && (
                    <span>Showing page {currentPage} of {Math.ceil(totalResults / 20)}</span>
                  )}
                </div>

                {results.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => {
                      onSelectMessage(result.id, result.conversationId);
                      onClose();
                    }}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {getMessageTypeIcon(result.messageType)}
                        <h4 className="font-medium text-gray-900 truncate">
                          {result.conversationTitle}
                        </h4>
                        {getPriorityBadge(result.priority)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {result.hasAttachments && (
                          <span className="flex items-center gap-1">
                            📎 {result.attachmentCount}
                          </span>
                        )}
                        <span>{formatDate(result.createdAt)}</span>
                      </div>
                    </div>

                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {result.senderName}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({result.senderRole})
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">
                      {highlightText(result.snippet, filters.query)}
                    </p>

                    {result.relevanceScore > 0.8 && (
                      <div className="flex items-center gap-1 mt-2">
                        <CheckCircle2 size={12} className="text-green-500" />
                        <span className="text-xs text-green-600">High relevance</span>
                      </div>
                    )}
                  </div>
                ))}

                {/* Pagination */}
                {totalResults > 20 && (
                  <div className="flex justify-center gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => performSearch(filters, currentPage - 1)}
                      disabled={currentPage <= 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => performSearch(filters, currentPage + 1)}
                      disabled={currentPage >= Math.ceil(totalResults / 20)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            ) : filters.query.trim() || hasActiveFilters(filters) ? (
              <div className="text-center py-8">
                <Search size={32} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">No messages found</p>
                <p className="text-sm text-gray-500">
                  Try adjusting your search terms or filters
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare size={32} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Start typing to search messages</p>
                <p className="text-sm text-gray-500">
                  Search across all conversations, attachments, and participants
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}