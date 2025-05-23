'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import {
  Calendar,
  Clock,
  Video,
  Users,
  MapPin,
  MessageSquare,
  Download,
  Star,
  MoreVertical,
  ChevronRight,
  Filter,
  Search,
  CalendarDays,
  Home,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  FileText,
  Camera,
  Share2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/useToast';

interface Viewing {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  propertyImage?: string;
  type: 'in-person' | 'virtual' | 'self-guided';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  scheduledDate: Date;
  duration: number;
  agent?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  notes?: string;
  rating?: number;
  feedback?: string;
  recordings?: {
    id: string;
    url: string;
    duration: number;
    createdAt: Date;
  }[];
  documents?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
  photos?: {
    id: string;
    url: string;
    caption?: string;
  }[];
}

interface ViewingHistoryProps {
  propertyId?: string;
  userId?: string;
  limit?: number;
}

const statusColors = {
  scheduled: 'default',
  completed: 'success',
  cancelled: 'destructive',
  'no-show': 'warning'
};

const statusIcons = {
  scheduled: <Clock className="h-4 w-4" />,
  completed: <CheckCircle2 className="h-4 w-4" />,
  cancelled: <XCircle className="h-4 w-4" />,
  'no-show': <AlertCircle className="h-4 w-4" />
};

export default function ViewingHistory({
  propertyId,
  userId,
  limit = 10
}: ViewingHistoryProps) {
  const { toast } = useToast();
  const [searchQuerysetSearchQuery] = useState('');
  const [statusFiltersetStatusFilter] = useState<string>('all');
  const [typeFiltersetTypeFilter] = useState<string>('all');
  const [sortBysetSortBy] = useState<string>('date-desc');
  const [expandedViewingssetExpandedViewings] = useState<Set<string>>(new Set());

  // Fetch viewing history
  const { data: viewings = [], isLoading, error } = useQuery<Viewing[]>({
    queryKey: ['viewing-history', propertyId, userId, statusFiltertypeFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (propertyId) params.append('propertyId', propertyId);
      if (userId) params.append('userId', userId);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (typeFilter !== 'all') params.append('type', typeFilter);
      params.append('limit', limit.toString());

      const response = await fetch(`/api/viewings/history?${params}`);
      if (!response.ok) throw new Error('Failed to fetch viewing history');
      return response.json();
    }
  });

  // Filter and sort viewings
  const filteredViewings = viewings
    .filter(viewing: any => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          viewing.propertyTitle.toLowerCase().includes(query) ||
          viewing.propertyAddress.toLowerCase().includes(query) ||
          viewing.agent?.name.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
        case 'date-desc':
          return new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime();
        case 'property':
          return a.propertyTitle.localeCompare(b.propertyTitle);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

  // Toggle expanded view
  const toggleExpanded = (viewingId: string) => {
    const newExpanded = new Set(expandedViewings);
    if (newExpanded.has(viewingId)) {
      newExpanded.delete(viewingId);
    } else {
      newExpanded.add(viewingId);
    }
    setExpandedViewings(newExpanded);
  };

  // Handle actions
  const handleReschedule = async (viewing: Viewing) => {
    // Navigate to scheduling page
    window.location.href = `/properties/${viewing.propertyId}/viewing?reschedule=${viewing.id}`;
  };

  const handleCancel = async (viewingId: string) => {
    try {
      const response = await fetch(`/api/viewings/${viewingId}/cancel`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to cancel viewing');

      toast({
        title: 'Viewing Cancelled',
        description: 'Your viewing has been cancelled successfully'
      });
    } catch (error) {
      toast({
        title: 'Cancellation Failed',
        description: 'Unable to cancel the viewing',
        variant: 'destructive'
      });
    }
  };

  const handleDownloadRecording = async (recording: any) => {
    window.open(recording.url, '_blank');
  };

  const handleShareViewing = async (viewing: Viewing) => {
    const shareData = {
      title: `Property Viewing - ${viewing.propertyTitle}`,
      text: `Viewing on ${format(new Date(viewing.scheduledDate), 'PPP')}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link Copied',
          description: 'Viewing link copied to clipboard'
        });
      }
    } catch (error) {

    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Failed to load viewing history</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Viewing History</CardTitle>
          <CardDescription>
            Track and manage your property viewings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search viewings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no-show">No Show</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="in-person">In-Person</SelectItem>
                <SelectItem value="virtual">Virtual</SelectItem>
                <SelectItem value="self-guided">Self-Guided</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Latest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="property">Property Name</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Viewing List */}
      {filteredViewings.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No viewings found</p>
              <Button className="mt-4" onClick={() => window.location.href = '/properties'}>
                Browse Properties
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredViewings.map((viewing: any) => (
            <motion.div
              key={viewing.id}
              layout
              initial={ opacity: 0, y: 20 }
              animate={ opacity: 1, y: 0 }
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {viewing.propertyImage && (
                        <img
                          src={viewing.propertyImage}
                          alt={viewing.propertyTitle}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                      )}
                      <div className="space-y-2">
                        <div>
                          <h3 className="font-semibold">{viewing.propertyTitle}</h3>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {viewing.propertyAddress}
                          </p>
                        </div>

                        <div className="flex items-center space-x-4 text-sm">
                          <Badge variant={statusColors[viewing.status]}>
                            {statusIcons[viewing.status]}
                            <span className="ml-1">{viewing.status}</span>
                          </Badge>

                          <div className="flex items-center">
                            <CalendarDays className="h-4 w-4 mr-1" />
                            {format(new Date(viewing.scheduledDate), 'PP')}
                          </div>

                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {format(new Date(viewing.scheduledDate), 'p')}
                          </div>

                          <Badge variant="outline">
                            {viewing.type === 'in-person' && <Users className="h-3 w-3 mr-1" />}
                            {viewing.type === 'virtual' && <Video className="h-3 w-3 mr-1" />}
                            {viewing.type === 'self-guided' && <Home className="h-3 w-3 mr-1" />}
                            {viewing.type}
                          </Badge>
                        </div>

                        {viewing.agent && (
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={viewing.agent.avatar} />
                              <AvatarFallback>{viewing.agent.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">with {viewing.agent.name}</span>
                          </div>
                        )}

                        {viewing.rating && (
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i <viewing.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                            <span className="text-sm text-muted-foreground ml-1">
                              ({viewing.rating}/5)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />

                          {viewing.status === 'scheduled' && (
                            <>
                              <DropdownMenuItem onClick={() => handleReschedule(viewing: any)}>
                                <Calendar className="h-4 w-4 mr-2" />
                                Reschedule
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleCancel(viewing.id)}
                                className="text-destructive"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancel
                              </DropdownMenuItem>
                            </>
                          )}

                          {viewing.status === 'completed' && (
                            <>
                              {viewing.recordings?.map((recording: any, idx: any) => (
                                <DropdownMenuItem
                                  key={recording.id}
                                  onClick={() => handleDownloadRecording(recording: any)}
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Download Recording {idx + 1}
                                </DropdownMenuItem>
                              ))}
                              <DropdownMenuItem>
                                <Star className="h-4 w-4 mr-2" />
                                Leave Review
                              </DropdownMenuItem>
                            </>
                          )}

                          <DropdownMenuItem onClick={() => handleShareViewing(viewing: any)}>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>

                          {viewing.agent && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Phone className="h-4 w-4 mr-2" />
                                Call Agent
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="h-4 w-4 mr-2" />
                                Email Agent
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleExpanded(viewing.id)}
                      >
                        <ChevronRight
                          className={`h-4 w-4 transition-transform ${
                            expandedViewings.has(viewing.id) ? 'rotate-90' : ''
                          }`}
                        />
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {expandedViewings.has(viewing.id) && (
                      <motion.div
                        initial={ height: 0, opacity: 0 }
                        animate={ height: 'auto', opacity: 1 }
                        exit={ height: 0, opacity: 0 }
                        transition={ duration: 0.2 }
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t space-y-4">
                          {viewing.notes && (
                            <div>
                              <h4 className="text-sm font-medium mb-1">Notes</h4>
                              <p className="text-sm text-muted-foreground">{viewing.notes}</p>
                            </div>
                          )}

                          {viewing.feedback && (
                            <div>
                              <h4 className="text-sm font-medium mb-1">Feedback</h4>
                              <p className="text-sm text-muted-foreground">{viewing.feedback}</p>
                            </div>
                          )}

                          {viewing.documents && viewing.documents.length> 0 && (
                            <div>
                              <h4 className="text-sm font-medium mb-2">Documents</h4>
                              <div className="flex flex-wrap gap-2">
                                {viewing.documents.map((doc: any) => (
                                  <Button
                                    key={doc.id}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(doc.url, '_blank')}
                                  >
                                    <FileText className="h-3 w-3 mr-1" />
                                    {doc.name}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}

                          {viewing.photos && viewing.photos.length> 0 && (
                            <div>
                              <h4 className="text-sm font-medium mb-2">Photos</h4>
                              <div className="grid grid-cols-4 gap-2">
                                {viewing.photos.map((photo: any) => (
                                  <div key={photo.id} className="relative aspect-square">
                                    <img
                                      src={photo.url}
                                      alt={photo.caption || 'Viewing photo'}
                                      className="w-full h-full object-cover rounded-lg"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2 pt-2">
                            <Button size="sm" variant="outline">
                              <Calendar className="h-4 w-4 mr-2" />
                              Add to Calendar
                            </Button>
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Contact Agent
                            </Button>
                            <Button size="sm" variant="outline">
                              <Camera className="h-4 w-4 mr-2" />
                              View Photos
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Load More */}
      {filteredViewings.length>= limit && (
        <div className="text-center">
          <Button variant="outline">
            Load More Viewings
          </Button>
        </div>
      )}
    </div>
  );
}